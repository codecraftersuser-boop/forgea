"""Normalize RawCourse → Course ORM and upsert to the DB."""
from __future__ import annotations
import logging
from datetime import date

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from scraper.base import RawCourse
from scraper.classifier import classify_career_path, classify_level, estimate_duration

log = logging.getLogger(__name__)


def _normalize(raw: RawCourse) -> dict:
    text_for_classify = f"{raw.title} {raw.description}"
    return {
        "title": raw.title.strip()[:255],
        "institution": raw.institution.strip()[:255],
        "instructor": (raw.instructor or raw.institution).strip()[:255],
        "career_path": classify_career_path(text_for_classify, raw.career_path_hint),
        "level": classify_level(text_for_classify, raw.level_hint),
        "price": max(0.0, raw.price),
        "rating": min(5.0, max(0.0, raw.rating)) if raw.rating else 0.0,
        "review_count": max(0, raw.review_count),
        "duration_hours": raw.duration_hours if raw.duration_hours > 0 else estimate_duration(raw.description),
        "prestige_score": raw.prestige_override if raw.prestige_override is not None else _prestige(raw.institution),
        "external_url": raw.external_url.strip()[:500],
        "thumbnail_url": raw.thumbnail_url[:500] if raw.thumbnail_url else None,
        "last_updated": raw.last_updated or date.today(),
    }


def _prestige(institution: str) -> int:
    PRESTIGE = {
        "MIT": 95,
        "Harvard": 95,
        "Stanford": 93,
        "Google": 88,
        "IBM": 82,
        "DeepLearning.AI": 85,
        "Kaggle": 75,
        "freeCodeCamp": 70,
        "W3Schools": 50,
        "GeeksforGeeks": 55,
        "Programiz": 52,
        "TutorialsPoint": 50,
        "DataCamp": 78,
        "Coursera": 80,
        "edX": 80,
        "FutureLearn": 72,
        "Udemy": 65,
    }
    name = institution.strip()
    for key, score in PRESTIGE.items():
        if key.lower() in name.lower():
            return score
    return 60  # default


class Pipeline:
    def __init__(self, database_url: str):
        engine = create_engine(database_url)
        self.Session = sessionmaker(bind=engine)

    def run(self, raw_courses: list[RawCourse], source_name: str = "") -> tuple[int, int]:
        """Upsert courses. Returns (inserted, updated)."""
        inserted = updated = 0
        with self.Session() as session:
            for raw in raw_courses:
                if not raw.title or not raw.external_url:
                    continue
                try:
                    data = _normalize(raw)
                except Exception as exc:
                    log.warning("Normalization failed for %r: %s", raw.title, exc)
                    continue

                # Upsert on external_url (unique key for dedup)
                existing = session.execute(
                    text("SELECT id FROM courses WHERE external_url = :url"),
                    {"url": data["external_url"]},
                ).fetchone()

                if existing:
                    session.execute(
                        text("""
                            UPDATE courses SET
                                title=:title, institution=:institution, instructor=:instructor,
                                career_path=:career_path, level=:level, price=:price,
                                rating=:rating, review_count=:review_count,
                                duration_hours=:duration_hours, prestige_score=:prestige_score,
                                thumbnail_url=:thumbnail_url, last_updated=:last_updated
                            WHERE external_url=:external_url
                        """),
                        data,
                    )
                    updated += 1
                else:
                    session.execute(
                        text("""
                            INSERT INTO courses
                                (title, institution, instructor, career_path, level, price,
                                 rating, review_count, duration_hours, prestige_score,
                                 external_url, thumbnail_url, last_updated)
                            VALUES
                                (:title, :institution, :instructor, :career_path, :level, :price,
                                 :rating, :review_count, :duration_hours, :prestige_score,
                                 :external_url, :thumbnail_url, :last_updated)
                        """),
                        data,
                    )
                    inserted += 1

            session.commit()
        log.info("[%s] inserted=%d updated=%d", source_name or "pipeline", inserted, updated)
        return inserted, updated
