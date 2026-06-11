"""
Programiz scraper — scrapes https://www.programiz.com
Free tutorials and DSA courses. Good for beginner/intermediate.
"""
from __future__ import annotations

import logging
import re

from app.scrapers.base import BaseScraper, CourseData

logger = logging.getLogger(__name__)

PROGRAMIZ_URL = "https://www.programiz.com"


class ProgramizScraper(BaseScraper):
    name = "programiz"
    prestige_score = 62

    def scrape(self) -> list[CourseData]:
        soup = self.soup(PROGRAMIZ_URL)
        if not soup:
            logger.warning(f"[{self.name}] Could not fetch Programiz, using fallback")
            return self._fallback()

        courses: list[CourseData] = []
        seen: set[str] = set()

        for a in soup.find_all("a", href=True):
            href = a["href"]
            # Programiz course links: /python-programming, /javascript, /dsa etc.
            if not re.match(r"^/[a-z0-9-]+(/?learn)?$", href):
                continue
            if href in seen or href in ("/", "/about"):
                continue
            seen.add(href)

            title = a.get_text(strip=True)
            if not title or len(title) < 3 or len(title) > 60:
                continue

            skip = ["blog", "news", "about", "contact", "forum", "quiz"]
            if any(s in href.lower() for s in skip):
                continue

            full_url = f"https://www.programiz.com{href}"
            courses.append(
                CourseData(
                    title=title,
                    institution="Programiz",
                    instructor="Programiz Team",
                    career_path=self._infer_path(href + " " + title),
                    level="beginner",
                    price=0.0,
                    rating=4.5,
                    review_count=0,
                    duration_hours=8,
                    prestige_score=self.prestige_score,
                    external_url=full_url,
                    thumbnail_url="https://www.programiz.com/sites/all/themes/programiz/assets/compiler/programiz-logo.svg",
                )
            )

        if courses:
            logger.info(f"[{self.name}] Scraped {len(courses)} courses")
            return courses[:20]

        return self._fallback()

    def _infer_path(self, text: str) -> str:
        lower = text.lower()
        if any(k in lower for k in ["android", "kotlin", "swift", "ios", "flutter"]):
            return "mobile"
        if any(k in lower for k in ["data", "machine", "ml", "numpy", "pandas", "sql", "r ", "statistics"]):
            return "data"
        return "web"

    def _fallback(self) -> list[CourseData]:
        catalog = [
            ("Learn Python Programming", "data", "beginner", 10),
            ("Learn JavaScript", "web", "beginner", 12),
            ("Learn C Programming", "web", "beginner", 10),
            ("Learn C++ Programming", "web", "intermediate", 12),
            ("Learn Java", "web", "beginner", 12),
            ("Learn Kotlin", "mobile", "beginner", 10),
            ("Learn Swift", "mobile", "beginner", 10),
            ("Learn R Programming", "data", "beginner", 8),
            ("Learn SQL", "data", "beginner", 8),
            ("Python Data Science Tutorial", "data", "intermediate", 10),
            ("Data Structures and Algorithms (DSA)", "web", "intermediate", 20),
            ("Learn C#", "web", "beginner", 10),
            ("Learn HTML", "web", "beginner", 6),
            ("Learn CSS", "web", "beginner", 6),
            ("Learn NumPy", "data", "beginner", 5),
            ("Learn Pandas", "data", "beginner", 5),
            ("Learn Django", "web", "intermediate", 8),
            ("Learn Flask", "web", "intermediate", 6),
            ("Learn React", "web", "intermediate", 10),
            ("Learn Go", "web", "intermediate", 10),
        ]
        return [
            CourseData(
                title=title,
                institution="Programiz",
                instructor="Programiz Team",
                career_path=cp,
                level=level,
                price=0.0,
                rating=4.5,
                review_count=0,
                duration_hours=hours,
                prestige_score=self.prestige_score,
                external_url=f"https://www.programiz.com/{title.lower().replace(' ', '-').replace('(', '').replace(')', '')}",
                thumbnail_url="https://www.programiz.com/sites/all/themes/programiz/assets/compiler/programiz-logo.svg",
            )
            for title, cp, level, hours in catalog
        ]
