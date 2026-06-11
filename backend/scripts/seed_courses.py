"""
Seed the courses table from multiple web sources.

Usage:
    # Run all scrapers (inside Docker or with DB running)
    python scripts/seed_courses.py

    # Only specific sources
    python scripts/seed_courses.py --sources freecodecamp kaggle_learn

    # Dry-run (no DB insert, just print counts)
    python scripts/seed_courses.py --dry-run

    # Force re-insert (skip duplicate check)
    python scripts/seed_courses.py --force
"""
from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path

# Make sure the backend root is on the path when running directly
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.database import SessionLocal
from app.models.course import Course
from app.scrapers import ALL_SCRAPERS
from app.scrapers.base import CourseData

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("seed_courses")

SCRAPER_MAP = {cls().__class__.name: cls for cls in ALL_SCRAPERS}


def upsert_courses(db, courses: list[CourseData], force: bool = False) -> tuple[int, int]:
    inserted = 0
    skipped = 0
    for c in courses:
        existing = db.query(Course).filter(Course.external_url == c.external_url).first()
        if existing and not force:
            skipped += 1
            continue
        if existing and force:
            for field in ["title", "institution", "instructor", "career_path", "level",
                          "price", "rating", "duration_hours", "prestige_score", "thumbnail_url"]:
                setattr(existing, field, getattr(c, field))
            inserted += 1
        else:
            db.add(Course(
                title=c.title,
                institution=c.institution,
                instructor=c.instructor,
                career_path=c.career_path,
                level=c.level,
                price=c.price,
                rating=c.rating,
                review_count=c.review_count,
                duration_hours=c.duration_hours,
                prestige_score=c.prestige_score,
                external_url=c.external_url,
                thumbnail_url=c.thumbnail_url,
                last_updated=c.last_updated,
            ))
            inserted += 1
    db.commit()
    return inserted, skipped


def run(sources: list[str] | None, dry_run: bool, force: bool) -> None:
    scrapers_to_run = []
    for cls in ALL_SCRAPERS:
        instance = cls()
        if sources is None or instance.name in sources:
            scrapers_to_run.append(instance)

    if not scrapers_to_run:
        logger.error(f"No scrapers matched. Available: {list(SCRAPER_MAP.keys())}")
        sys.exit(1)

    all_courses: list[CourseData] = []
    for scraper in scrapers_to_run:
        logger.info(f"▶  Running scraper: {scraper.name}")
        try:
            courses = scraper.scrape()
            logger.info(f"   ✓ {scraper.name}: {len(courses)} courses collected")
            all_courses.extend(courses)
        except Exception as e:
            logger.error(f"   ✗ {scraper.name} failed: {e}")
        finally:
            scraper.close()

    # Summary before DB write
    from collections import Counter
    by_path = Counter(c.career_path for c in all_courses)
    by_level = Counter(c.level for c in all_courses)
    by_source = Counter(c.institution for c in all_courses)

    logger.info(f"\n{'='*50}")
    logger.info(f"Total courses collected: {len(all_courses)}")
    logger.info(f"By career path: {dict(by_path)}")
    logger.info(f"By level:       {dict(by_level)}")
    logger.info(f"By institution: {dict(by_source)}")
    logger.info(f"{'='*50}\n")

    if dry_run:
        logger.info("DRY RUN — no database writes performed.")
        return

    db = SessionLocal()
    try:
        inserted, skipped = upsert_courses(db, all_courses, force=force)
        logger.info(f"✅ Done — inserted/updated: {inserted}, skipped (duplicates): {skipped}")
    except Exception as e:
        db.rollback()
        logger.error(f"Database error: {e}")
        raise
    finally:
        db.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed Forgea courses from web sources")
    parser.add_argument(
        "--sources",
        nargs="+",
        choices=list(SCRAPER_MAP.keys()),
        metavar="SOURCE",
        help=f"Which scrapers to run. Choices: {', '.join(SCRAPER_MAP.keys())}",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Collect courses but do not write to DB",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Update existing courses instead of skipping duplicates",
    )
    args = parser.parse_args()
    run(sources=args.sources, dry_run=args.dry_run, force=args.force)


if __name__ == "__main__":
    main()
