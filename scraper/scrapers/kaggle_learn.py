"""Kaggle Learn — scrapes the public /learn page (no API key needed)."""
from __future__ import annotations
import logging
from datetime import date

import httpx
from bs4 import BeautifulSoup

from scraper.base import BaseScraper, RawCourse

log = logging.getLogger(__name__)

BASE = "https://www.kaggle.com"
LEARN_URL = f"{BASE}/learn"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; ForgeaBot/1.0)",
    "Accept": "text/html,application/xhtml+xml",
}

# Curated list — Kaggle Learn is JS-heavy, so we keep a stable fallback
_KAGGLE_COURSES = [
    ("Python", "python", "data", "beginner", 5),
    ("Intro to Machine Learning", "intro-to-machine-learning", "data", "beginner", 3),
    ("Intermediate Machine Learning", "intermediate-machine-learning", "data", "intermediate", 4),
    ("Data Visualization", "data-visualization", "data", "beginner", 4),
    ("Pandas", "pandas", "data", "beginner", 4),
    ("Feature Engineering", "feature-engineering", "data", "intermediate", 5),
    ("SQL", "intro-to-sql", "data", "beginner", 3),
    ("Advanced SQL", "advanced-sql", "data", "intermediate", 4),
    ("Geospatial Analysis", "geospatial-analysis", "data", "intermediate", 5),
    ("Machine Learning Explainability", "machine-learning-explainability", "data", "advanced", 4),
    ("Natural Language Processing", "natural-language-processing", "data", "intermediate", 5),
    ("Intro to Deep Learning", "intro-to-deep-learning", "data", "intermediate", 6),
    ("Computer Vision", "computer-vision", "data", "intermediate", 4),
    ("Time Series", "time-series", "data", "intermediate", 5),
    ("Data Cleaning", "data-cleaning", "data", "beginner", 4),
    ("Intro to AI Ethics", "intro-to-ai-ethics", "data", "beginner", 4),
    ("Intro to Programming", "intro-to-programming", "data", "beginner", 5),
    ("Game AI and Reinforcement Learning", "game-ai-and-reinforcement-learning", "data", "advanced", 8),
    ("LLM Zoomcamp", "llm-zoomcamp", "data", "advanced", 10),
]


class KaggleLearnScraper(BaseScraper):
    name = "Kaggle Learn"
    source_url = LEARN_URL

    def scrape(self) -> list[RawCourse]:
        courses = []

        # Try live scrape first
        try:
            resp = httpx.get(LEARN_URL, headers=HEADERS, timeout=20, follow_redirects=True)
            if resp.status_code == 200:
                courses = _parse_html(resp.text)
        except Exception as exc:
            log.warning("[Kaggle] live scrape failed: %s", exc)

        if not courses:
            log.info("[Kaggle] using curated list")
            courses = _from_curated()

        log.info("[Kaggle Learn] %d courses", len(courses))
        return courses


def _parse_html(html: str) -> list[RawCourse]:
    soup = BeautifulSoup(html, "lxml")
    courses = []
    for card in soup.select("div[class*='sc-'] a[href*='/learn/']"):
        href = card.get("href", "")
        if not href:
            continue
        title_el = card.select_one("div[class*='title'], h3, span[class*='title']")
        title = title_el.get_text(strip=True) if title_el else ""
        if not title:
            continue
        url = href if href.startswith("http") else f"{BASE}{href}"
        courses.append(
            RawCourse(
                title=title,
                external_url=url,
                institution="Kaggle",
                instructor="Kaggle",
                price=0.0,
                rating=4.7,
                review_count=20000,
                duration_hours=5,
                career_path_hint="data",
                prestige_override=75,
            )
        )
    return courses


def _from_curated() -> list[RawCourse]:
    return [
        RawCourse(
            title=title,
            external_url=f"https://www.kaggle.com/learn/{slug}",
            institution="Kaggle",
            instructor="Kaggle",
            description=f"Free mini-course: {title}",
            price=0.0,
            rating=4.7,
            review_count=20000,
            duration_hours=hours,
            last_updated=date.today(),
            career_path_hint=path,
            level_hint=level,
            prestige_override=75,
        )
        for title, slug, path, level, hours in _KAGGLE_COURSES
    ]
