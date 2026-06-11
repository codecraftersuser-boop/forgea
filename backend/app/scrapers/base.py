"""Base scraper — shared HTTP client, helpers, and the CourseData dataclass."""
from __future__ import annotations

import logging
import random
import time
from dataclasses import dataclass, field
from datetime import date

import httpx
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

CAREER_KEYWORDS: dict[str, list[str]] = {
    "data": [
        "data science", "machine learning", "deep learning", "artificial intelligence",
        "ai", "ml", "nlp", "neural", "tensorflow", "pytorch", "pandas", "numpy",
        "analytics", "statistics", "sql", "r programming", "data analysis",
        "data engineering", "spark", "kafka", "airflow", "dbt", "bigquery",
        "tableau", "power bi", "visualization",
    ],
    "mobile": [
        "android", "ios", "swift", "kotlin", "react native", "flutter",
        "mobile development", "mobile app", "xcode",
    ],
    "web": [
        "html", "css", "javascript", "typescript", "react", "vue", "angular",
        "node", "express", "django", "fastapi", "flask", "rest api", "graphql",
        "web development", "frontend", "backend", "fullstack", "full stack",
        "php", "ruby", "rails", "next.js", "svelte", "tailwind",
        "web design", "responsive", "wordpress",
    ],
}

LEVEL_KEYWORDS: dict[str, list[str]] = {
    "professional": ["professional", "specialization", "certification", "capstone", "expert"],
    "advanced": ["advanced", "deep dive", "mastery", "senior", "expert", "pro"],
    "intermediate": ["intermediate", "practical", "applied", "hands-on", "real-world"],
    "beginner": ["beginner", "introduction", "intro", "basics", "fundamentals", "starter", "zero to"],
}


@dataclass
class CourseData:
    title: str
    institution: str
    instructor: str
    career_path: str          # data | web | mobile
    level: str                # beginner | intermediate | advanced | professional
    price: float
    rating: float
    review_count: int
    duration_hours: int
    prestige_score: int       # 0–100
    external_url: str
    thumbnail_url: str | None = None
    last_updated: date = field(default_factory=date.today)


def infer_career_path(text: str) -> str:
    lower = text.lower()
    scores = {path: 0 for path in CAREER_KEYWORDS}
    for path, keywords in CAREER_KEYWORDS.items():
        for kw in keywords:
            if kw in lower:
                scores[path] += 1
    best = max(scores, key=lambda k: scores[k])
    return best if scores[best] > 0 else "web"


def infer_level(text: str) -> str:
    lower = text.lower()
    for level in ["professional", "advanced", "intermediate", "beginner"]:
        for kw in LEVEL_KEYWORDS[level]:
            if kw in lower:
                return level
    return "beginner"


class BaseScraper:
    name: str = "base"
    prestige_score: int = 60

    def __init__(self, delay: float = 1.5):
        self.delay = delay
        self.client = httpx.Client(headers=HEADERS, timeout=20, follow_redirects=True)

    def get(self, url: str) -> httpx.Response | None:
        try:
            time.sleep(self.delay + random.uniform(0, 0.5))
            r = self.client.get(url)
            r.raise_for_status()
            return r
        except httpx.HTTPError as e:
            logger.warning(f"[{self.name}] HTTP error fetching {url}: {e}")
            return None

    def soup(self, url: str) -> BeautifulSoup | None:
        r = self.get(url)
        if r is None:
            return None
        return BeautifulSoup(r.text, "lxml")

    def scrape(self) -> list[CourseData]:
        raise NotImplementedError

    def close(self):
        self.client.close()
