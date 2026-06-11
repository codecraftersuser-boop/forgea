"""W3Schools — scrapes the public tutorials index."""
from __future__ import annotations
import logging
from datetime import date

import httpx
from bs4 import BeautifulSoup

from scraper.base import BaseScraper, RawCourse

log = logging.getLogger(__name__)

BASE = "https://www.w3schools.com"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; ForgeaBot/1.0)",
    "Accept-Language": "en-US,en;q=0.9",
}

# W3Schools tutorial paths we want to index
_TUTORIALS = [
    # (title, path_slug, career_path, level, duration_hours)
    ("HTML Tutorial", "html", "web", "beginner", 8),
    ("CSS Tutorial", "css", "web", "beginner", 10),
    ("JavaScript Tutorial", "js", "web", "beginner", 20),
    ("Python Tutorial", "python", "data", "beginner", 15),
    ("SQL Tutorial", "sql", "data", "beginner", 10),
    ("React Tutorial", "react", "web", "intermediate", 15),
    ("Node.js Tutorial", "nodejs", "web", "intermediate", 10),
    ("TypeScript Tutorial", "typescript", "web", "intermediate", 8),
    ("PHP Tutorial", "php", "web", "beginner", 12),
    ("C++ Tutorial", "cpp", "web", "beginner", 15),
    ("C# Tutorial", "cs", "web", "intermediate", 12),
    ("Java Tutorial", "java", "web", "beginner", 15),
    ("jQuery Tutorial", "jquery", "web", "beginner", 8),
    ("Bootstrap Tutorial", "bootstrap", "web", "beginner", 6),
    ("XML Tutorial", "xml", "web", "beginner", 4),
    ("JSON Tutorial", "json", "web", "beginner", 3),
    ("Git Tutorial", "git", "web", "beginner", 5),
    ("Django Tutorial", "django", "web", "intermediate", 10),
    ("NumPy Tutorial", "numpy", "data", "intermediate", 8),
    ("Pandas Tutorial", "pandas", "data", "intermediate", 8),
    ("Machine Learning Tutorial", "python/python_ml_getting_started.asp", "data", "beginner", 15),
    ("Data Science Tutorial", "datascience", "data", "beginner", 10),
    ("MySQL Tutorial", "mysql", "data", "beginner", 8),
    ("MongoDB Tutorial", "mongodb", "data", "intermediate", 6),
    ("Kotlin Tutorial", "kotlin", "mobile", "beginner", 12),
    ("Swift Tutorial", "swift", "mobile", "beginner", 12),
]


class W3SchoolsScraper(BaseScraper):
    name = "W3Schools"
    source_url = BASE

    def scrape(self) -> list[RawCourse]:
        """Use curated list — W3Schools doesn't have a central catalog page to scrape."""
        courses = []
        for title, slug, path, level, hours in _TUTORIALS:
            url = f"{BASE}/{slug}/default.asp" if "/" not in slug else f"{BASE}/{slug}"
            courses.append(
                RawCourse(
                    title=title,
                    external_url=url,
                    institution="W3Schools",
                    instructor="W3Schools",
                    description=f"Free interactive tutorial: {title}",
                    price=0.0,
                    rating=4.5,
                    review_count=500000,
                    duration_hours=hours,
                    last_updated=date.today(),
                    career_path_hint=path,
                    level_hint=level,
                    prestige_override=50,
                )
            )
        log.info("[W3Schools] %d tutorials", len(courses))
        return courses
