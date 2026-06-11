"""
The Odin Project scraper — scrapes https://www.theodinproject.com/paths
Free, project-based fullstack curriculum. Excellent for web career path.
"""
from __future__ import annotations

import logging
import re

from app.scrapers.base import BaseScraper, CourseData

logger = logging.getLogger(__name__)

ODIN_PATHS_URL = "https://www.theodinproject.com/paths"


class OdinProjectScraper(BaseScraper):
    name = "odin_project"
    prestige_score = 78

    def scrape(self) -> list[CourseData]:
        soup = self.soup(ODIN_PATHS_URL)
        if not soup:
            return self._fallback()

        courses: list[CourseData] = []
        seen: set[str] = set()

        for a in soup.find_all("a", href=True):
            href = a["href"]
            if not re.match(r"^/paths/[a-z0-9-]+$", href):
                continue
            if href in seen:
                continue
            seen.add(href)

            title_el = a.find(["h2", "h3", "h4", "span"]) or a
            title = title_el.get_text(strip=True)
            if not title:
                continue

            full_url = f"https://www.theodinproject.com{href}"
            courses.append(
                CourseData(
                    title=f"The Odin Project: {title}",
                    institution="The Odin Project",
                    instructor="The Odin Project Community",
                    career_path="web",
                    level=self._infer_level(title),
                    price=0.0,
                    rating=4.8,
                    review_count=0,
                    duration_hours=self._infer_hours(title),
                    prestige_score=self.prestige_score,
                    external_url=full_url,
                    thumbnail_url="https://www.theodinproject.com/assets/icons/odin-icon-c48c1b0c31a8c...png",
                )
            )

        if courses:
            logger.info(f"[{self.name}] Scraped {len(courses)} paths")
            return courses

        return self._fallback()

    def _infer_level(self, title: str) -> str:
        lower = title.lower()
        if "full" in lower:
            return "advanced"
        if "javascript" in lower or "ruby" in lower:
            return "intermediate"
        return "beginner"

    def _infer_hours(self, title: str) -> int:
        lower = title.lower()
        if "full" in lower:
            return 1000
        if "javascript" in lower:
            return 300
        return 200

    def _fallback(self) -> list[CourseData]:
        paths = [
            ("Foundations", "web", "beginner", 200),
            ("Full Stack JavaScript", "web", "advanced", 1000),
            ("Full Stack Ruby on Rails", "web", "advanced", 1000),
        ]
        return [
            CourseData(
                title=f"The Odin Project: {title}",
                institution="The Odin Project",
                instructor="The Odin Project Community",
                career_path=cp,
                level=level,
                price=0.0,
                rating=4.8,
                review_count=0,
                duration_hours=hours,
                prestige_score=self.prestige_score,
                external_url=f"https://www.theodinproject.com/paths/{title.lower().replace(' ', '-')}",
                thumbnail_url=None,
            )
            for title, cp, level, hours in paths
        ]
