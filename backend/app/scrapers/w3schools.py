"""
W3Schools scraper — scrapes the tutorial index at https://www.w3schools.com/
Each tutorial track is treated as a course. Focus: web development.
"""
from __future__ import annotations

import logging
import re

from app.scrapers.base import BaseScraper, CourseData, infer_career_path, infer_level

logger = logging.getLogger(__name__)

W3_INDEX_URL = "https://www.w3schools.com/"


class W3SchoolsScraper(BaseScraper):
    name = "w3schools"
    prestige_score = 65

    def scrape(self) -> list[CourseData]:
        soup = self.soup(W3_INDEX_URL)
        if not soup:
            logger.warning(f"[{self.name}] Could not fetch W3Schools, using fallback")
            return self._fallback()

        courses: list[CourseData] = []
        seen: set[str] = set()

        for a in soup.find_all("a", href=True):
            href = a["href"]
            # Tutorial pages follow pattern like /html/, /python/, /sql/ etc.
            if not re.match(r"^/[a-z0-9_]+/default\.asp$", href) and \
               not re.match(r"^/[a-z0-9_]+/$", href):
                continue
            if "w3schools" in href or href in ("/", "/about/"):
                continue
            if href in seen:
                continue
            seen.add(href)

            title = a.get_text(strip=True)
            if not title or len(title) < 2 or len(title) > 50:
                continue

            # Skip non-tech sections
            skip_words = ["quiz", "exercise", "certificate", "bootcamp", "about", "contact", "forum"]
            if any(w in title.lower() for w in skip_words):
                continue

            full_url = f"https://www.w3schools.com{href}"
            combined = title + " " + href

            courses.append(
                CourseData(
                    title=f"{title} Tutorial",
                    institution="W3Schools",
                    instructor="W3Schools Team",
                    career_path=infer_career_path(combined),
                    level=infer_level(combined),
                    price=0.0,
                    rating=4.4,
                    review_count=0,
                    duration_hours=self._estimate_hours(title),
                    prestige_score=self.prestige_score,
                    external_url=full_url,
                    thumbnail_url="https://www.w3schools.com/images/w3schools_logo_436_2.png",
                )
            )

        if courses:
            logger.info(f"[{self.name}] Scraped {len(courses)} tutorials")
            return courses[:30]  # cap to 30 most relevant

        return self._fallback()

    def _estimate_hours(self, title: str) -> int:
        lower = title.lower()
        if any(k in lower for k in ["full", "complete", "advanced"]):
            return 20
        return 8

    def _fallback(self) -> list[CourseData]:
        tutorials = [
            # (title, career_path, level, hours)
            ("HTML", "web", "beginner", 8),
            ("CSS", "web", "beginner", 8),
            ("JavaScript", "web", "beginner", 15),
            ("Python", "data", "beginner", 12),
            ("SQL", "data", "beginner", 8),
            ("PHP", "web", "beginner", 10),
            ("React", "web", "intermediate", 10),
            ("Node.js", "web", "intermediate", 8),
            ("TypeScript", "web", "intermediate", 8),
            ("Bootstrap", "web", "beginner", 6),
            ("jQuery", "web", "beginner", 5),
            ("XML", "web", "beginner", 4),
            ("JSON", "web", "beginner", 3),
            ("AJAX", "web", "intermediate", 5),
            ("Git", "web", "beginner", 5),
            ("Django", "web", "intermediate", 8),
            ("NumPy", "data", "beginner", 6),
            ("Pandas", "data", "beginner", 8),
            ("Matplotlib", "data", "beginner", 6),
            ("Machine Learning", "data", "intermediate", 10),
            ("Java", "web", "beginner", 15),
            ("C++", "web", "intermediate", 15),
            ("MongoDB", "data", "beginner", 6),
            ("MySQL", "data", "beginner", 8),
            ("PostgreSQL", "data", "intermediate", 8),
            ("Kotlin", "mobile", "beginner", 12),
            ("Swift", "mobile", "beginner", 12),
            ("R", "data", "beginner", 10),
            ("Sass", "web", "intermediate", 5),
            ("Vue.js", "web", "intermediate", 8),
        ]
        return [
            CourseData(
                title=f"{title} Tutorial",
                institution="W3Schools",
                instructor="W3Schools Team",
                career_path=cp,
                level=level,
                price=0.0,
                rating=4.4,
                review_count=0,
                duration_hours=hours,
                prestige_score=self.prestige_score,
                external_url=f"https://www.w3schools.com/{title.lower()}/",
                thumbnail_url="https://www.w3schools.com/images/w3schools_logo_436_2.png",
            )
            for title, cp, level, hours in tutorials
        ]
