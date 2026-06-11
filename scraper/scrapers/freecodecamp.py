"""freeCodeCamp — scrapes the public /learn page certifications."""
from __future__ import annotations
import logging

import httpx
from bs4 import BeautifulSoup

from scraper.base import BaseScraper, RawCourse

log = logging.getLogger(__name__)

BASE = "https://www.freecodecamp.org"
HEADERS = {"User-Agent": "ForgeaBot/1.0 (educational indexer)"}

# Manually curated cert metadata since FCC doesn't expose duration on the page
_CERT_META: dict[str, dict] = {
    "Responsive Web Design": {"career_path_hint": "web", "level_hint": "beginner", "duration_hours": 300},
    "JavaScript Algorithms and Data Structures": {"career_path_hint": "web", "level_hint": "intermediate", "duration_hours": 300},
    "Front End Development Libraries": {"career_path_hint": "web", "level_hint": "intermediate", "duration_hours": 300},
    "Data Visualization": {"career_path_hint": "data", "level_hint": "intermediate", "duration_hours": 300},
    "Back End Development and APIs": {"career_path_hint": "web", "level_hint": "intermediate", "duration_hours": 300},
    "Quality Assurance": {"career_path_hint": "web", "level_hint": "advanced", "duration_hours": 300},
    "Scientific Computing with Python": {"career_path_hint": "data", "level_hint": "beginner", "duration_hours": 300},
    "Data Analysis with Python": {"career_path_hint": "data", "level_hint": "intermediate", "duration_hours": 300},
    "Information Security": {"career_path_hint": "web", "level_hint": "advanced", "duration_hours": 300},
    "Machine Learning with Python": {"career_path_hint": "data", "level_hint": "advanced", "duration_hours": 300},
    "Relational Database": {"career_path_hint": "data", "level_hint": "intermediate", "duration_hours": 300},
    "College Algebra with Python": {"career_path_hint": "data", "level_hint": "beginner", "duration_hours": 120},
    "Foundational C# with Microsoft": {"career_path_hint": "web", "level_hint": "beginner", "duration_hours": 35},
    "A2 English for Developers": {"career_path_hint": "web", "level_hint": "beginner", "duration_hours": 20},
}


class FreeCodeCampScraper(BaseScraper):
    name = "freeCodeCamp"
    source_url = f"{BASE}/learn"

    def scrape(self) -> list[RawCourse]:
        courses: list[RawCourse] = []
        try:
            resp = httpx.get(self.source_url, headers=HEADERS, timeout=20, follow_redirects=True)
            resp.raise_for_status()
        except Exception as exc:
            log.error("[FreeCodeCamp] fetch failed: %s", exc)
            return courses

        soup = BeautifulSoup(resp.text, "lxml")

        # Each certification is an <h2> or inside a <div class="cert-card">
        # FCC renders a Next.js page — we parse the static HTML blocks
        for block in soup.select("div[class*='superblock'] h2, h2[class*='certification'], div.cert-title, div[data-test*='cert']"):
            title = block.get_text(strip=True)
            if not title or len(title) < 5:
                continue
            meta = _CERT_META.get(title, {})
            slug = title.lower().replace(" ", "-").replace("&", "and")
            url = f"{BASE}/learn/{slug}"
            courses.append(
                RawCourse(
                    title=title,
                    external_url=url,
                    institution="freeCodeCamp",
                    instructor="freeCodeCamp",
                    description=f"Free certification: {title}. 300 hours of coursework.",
                    price=0.0,
                    rating=4.7,
                    review_count=50000,
                    duration_hours=meta.get("duration_hours", 300),
                    career_path_hint=meta.get("career_path_hint", ""),
                    level_hint=meta.get("level_hint", ""),
                    prestige_override=70,
                )
            )

        # Fallback: use the curated list if scraping yielded nothing
        if not courses:
            log.warning("[FreeCodeCamp] scrape yielded 0 results, using curated list")
            for title, meta in _CERT_META.items():
                slug = title.lower().replace(" ", "-").replace("&", "and")
                courses.append(
                    RawCourse(
                        title=title,
                        external_url=f"{BASE}/learn/{slug}",
                        institution="freeCodeCamp",
                        instructor="freeCodeCamp",
                        description=f"Free certification: {title}. 300 hours of coursework.",
                        price=0.0,
                        rating=4.7,
                        review_count=50000,
                        duration_hours=meta.get("duration_hours", 300),
                        career_path_hint=meta.get("career_path_hint", ""),
                        level_hint=meta.get("level_hint", ""),
                        prestige_override=70,
                    )
                )

        log.info("[FreeCodeCamp] %d courses", len(courses))
        return courses
