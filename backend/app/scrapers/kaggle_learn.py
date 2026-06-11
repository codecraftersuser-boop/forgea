"""
Kaggle Learn scraper — scrapes https://www.kaggle.com/learn
All courses are free, focus on data science / ML.
"""
from __future__ import annotations

import logging
import re

from app.scrapers.base import BaseScraper, CourseData, infer_career_path, infer_level

logger = logging.getLogger(__name__)

KAGGLE_LEARN_URL = "https://www.kaggle.com/learn"


class KaggleLearnScraper(BaseScraper):
    name = "kaggle_learn"
    prestige_score = 82

    def scrape(self) -> list[CourseData]:
        soup = self.soup(KAGGLE_LEARN_URL)
        if not soup:
            logger.warning(f"[{self.name}] Could not fetch Kaggle Learn page, using fallback data")
            return self._fallback()

        courses: list[CourseData] = []
        # Kaggle Learn renders course cards — look for links with /learn/ path
        seen: set[str] = set()
        for a in soup.find_all("a", href=True):
            href = a["href"]
            if not re.match(r"^/learn/[a-z0-9-]+$", href):
                continue
            if href in seen:
                continue
            seen.add(href)

            title_el = a.find(["h3", "h2", "h4"]) or a
            title = title_el.get_text(strip=True)
            if not title or len(title) < 3:
                continue

            desc_el = a.find("p")
            description = desc_el.get_text(strip=True) if desc_el else title

            # Try to find hour count in the card
            hours_text = a.get_text()
            hours_match = re.search(r"(\d+)\s*hour", hours_text, re.I)
            duration = int(hours_match.group(1)) if hours_match else 4

            courses.append(
                CourseData(
                    title=title,
                    institution="Kaggle",
                    instructor="Kaggle Team",
                    career_path=infer_career_path(title + " " + description),
                    level=infer_level(title + " " + description),
                    price=0.0,
                    rating=4.6,
                    review_count=0,
                    duration_hours=duration,
                    prestige_score=self.prestige_score,
                    external_url=f"https://www.kaggle.com{href}",
                    thumbnail_url="https://www.kaggle.com/static/images/site-logo.svg",
                )
            )

        if courses:
            logger.info(f"[{self.name}] Scraped {len(courses)} courses from Kaggle Learn")
            return courses

        logger.info(f"[{self.name}] No courses scraped, using fallback")
        return self._fallback()

    def _fallback(self) -> list[CourseData]:
        """Hardcoded Kaggle Learn catalog (stable as of 2025)."""
        catalog = [
            ("Python", "data", "beginner", 5),
            ("Intro to Machine Learning", "data", "beginner", 3),
            ("Intermediate Machine Learning", "data", "intermediate", 4),
            ("Data Visualization", "data", "beginner", 4),
            ("Pandas", "data", "beginner", 4),
            ("Feature Engineering", "data", "intermediate", 5),
            ("SQL", "data", "beginner", 3),
            ("Advanced SQL", "data", "intermediate", 4),
            ("Intro to Deep Learning", "data", "intermediate", 6),
            ("Computer Vision", "data", "intermediate", 5),
            ("Time Series", "data", "intermediate", 5),
            ("Natural Language Processing", "data", "advanced", 5),
            ("Intro to AI Ethics", "data", "beginner", 4),
            ("Geospatial Analysis", "data", "intermediate", 5),
            ("Machine Learning Explainability", "data", "advanced", 4),
            ("Intro to Game AI and Reinforcement Learning", "data", "advanced", 4),
        ]
        return [
            CourseData(
                title=title,
                institution="Kaggle",
                instructor="Kaggle Team",
                career_path=cp,
                level=level,
                price=0.0,
                rating=4.6,
                review_count=0,
                duration_hours=hours,
                prestige_score=self.prestige_score,
                external_url=f"https://www.kaggle.com/learn/{title.lower().replace(' ', '-')}",
                thumbnail_url="https://www.kaggle.com/static/images/site-logo.svg",
            )
            for title, cp, level, hours in catalog
        ]
