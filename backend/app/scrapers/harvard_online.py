"""
Harvard Online scraper — scrapes https://pll.harvard.edu/catalog
Many courses are free (audit). High prestige for data/CS paths.
"""
from __future__ import annotations

import logging
import re

from app.scrapers.base import BaseScraper, CourseData, infer_career_path, infer_level

logger = logging.getLogger(__name__)

HARVARD_URL = "https://pll.harvard.edu/catalog"


class HarvardOnlineScraper(BaseScraper):
    name = "harvard_online"
    prestige_score = 93

    def scrape(self) -> list[CourseData]:
        soup = self.soup(HARVARD_URL)
        if not soup:
            return self._fallback()

        courses: list[CourseData] = []
        seen: set[str] = set()

        # Harvard catalog uses article or li elements per course
        for card in soup.find_all(["article", "li"], class_=re.compile(r"course|item|card", re.I)):
            a = card.find("a", href=True)
            if not a:
                continue
            href = a["href"]
            if not href or href in seen:
                continue
            seen.add(href)

            title_el = card.find(["h2", "h3", "h4"])
            if not title_el:
                title_el = a
            title = title_el.get_text(strip=True)
            if not title or len(title) < 5:
                continue

            # Filter to CS/tech only
            combined = title.lower()
            tech_terms = ["computer", "python", "data", "programming", "web", "software",
                          "machine", "ai", "statistic", "javascript", "analytics", "algorithm"]
            if not any(t in combined for t in tech_terms):
                continue

            price_el = card.find(string=re.compile(r"free|\$0|audit", re.I))
            price = 0.0 if price_el else 149.0

            full_url = href if href.startswith("http") else f"https://pll.harvard.edu{href}"
            img = card.find("img")
            thumbnail = img.get("src") if img else None

            courses.append(
                CourseData(
                    title=title,
                    institution="Harvard University",
                    instructor="Harvard Faculty",
                    career_path=infer_career_path(title),
                    level=infer_level(title),
                    price=price,
                    rating=4.9,
                    review_count=0,
                    duration_hours=self._estimate_hours(title),
                    prestige_score=self.prestige_score,
                    external_url=full_url,
                    thumbnail_url=thumbnail,
                )
            )

        if courses:
            logger.info(f"[{self.name}] Scraped {len(courses)} courses")
            return courses

        return self._fallback()

    def _estimate_hours(self, title: str) -> int:
        lower = title.lower()
        if "professional" in lower or "certificate" in lower:
            return 60
        if "cs50" in lower:
            return 100
        return 30

    def _fallback(self) -> list[CourseData]:
        catalog = [
            ("CS50: Introduction to Computer Science", "web", "beginner", 100, 0.0),
            ("CS50's Web Programming with Python and JavaScript", "web", "intermediate", 80, 0.0),
            ("CS50's Introduction to Artificial Intelligence with Python", "data", "intermediate", 50, 0.0),
            ("CS50's Introduction to Cybersecurity", "web", "beginner", 30, 0.0),
            ("CS50's Introduction to Programming with Python", "data", "beginner", 40, 0.0),
            ("Data Science: Machine Learning", "data", "intermediate", 30, 149.0),
            ("Data Science: Probability", "data", "intermediate", 25, 149.0),
            ("Data Science: R Basics", "data", "beginner", 20, 149.0),
            ("Data Science: Visualization", "data", "beginner", 20, 149.0),
            ("Data Science: Wrangling", "data", "intermediate", 20, 149.0),
            ("Data Science: Linear Regression", "data", "intermediate", 20, 149.0),
            ("Data Science: Inference and Modeling", "data", "advanced", 25, 149.0),
            ("Data Science: Productivity Tools", "data", "beginner", 15, 149.0),
            ("Data Science: Capstone", "data", "professional", 30, 149.0),
            ("Python Programming for Mobile Applications", "mobile", "intermediate", 40, 149.0),
        ]
        return [
            CourseData(
                title=title,
                institution="Harvard University",
                instructor="Harvard Faculty",
                career_path=cp,
                level=level,
                price=price,
                rating=4.9,
                review_count=0,
                duration_hours=hours,
                prestige_score=self.prestige_score,
                external_url=f"https://pll.harvard.edu/course/{title.lower().replace(' ', '-').replace(':', '').replace(\"'\", '')}",
                thumbnail_url="https://pll.harvard.edu/themes/custom/harvard_pll/assets/images/harvard-logo.svg",
            )
            for title, cp, level, hours, price in catalog
        ]
