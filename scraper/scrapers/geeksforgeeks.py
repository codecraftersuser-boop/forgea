"""GeeksForGeeks — scrapes the courses/learning paths catalog."""
from __future__ import annotations
import logging
from datetime import date

import httpx
from bs4 import BeautifulSoup

from scraper.base import BaseScraper, RawCourse

log = logging.getLogger(__name__)

BASE = "https://www.geeksforgeeks.org"
COURSES_URL = f"{BASE}/courses"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; ForgeaBot/1.0)",
    "Accept-Language": "en-US,en;q=0.9",
}

_CURATED = [
    ("Complete Interview Preparation", "complete-interview-preparation", "web", "intermediate", 100, 2999),
    ("DSA Self-Paced", "dsa-self-paced", "web", "intermediate", 100, 2999),
    ("Python Programming – Self Paced", "python-programming-self-paced", "data", "beginner", 40, 999),
    ("JavaScript – Self Paced", "javascript-self-paced", "web", "beginner", 30, 999),
    ("React – Self Paced", "reactjs-self-paced", "web", "intermediate", 25, 999),
    ("Node.js – Self Paced", "nodejs-self-paced", "web", "intermediate", 25, 999),
    ("Machine Learning – Self Paced", "machine-learning-self-paced", "data", "intermediate", 60, 1499),
    ("Deep Learning – Self Paced", "deep-learning-self-paced", "data", "advanced", 50, 1499),
    ("Data Science – Self Paced", "data-science-self-paced", "data", "beginner", 60, 1499),
    ("SQL – Self Paced", "sql-self-paced", "data", "beginner", 20, 499),
    ("Android Development – Self Paced", "android-development-self-paced", "mobile", "intermediate", 60, 1499),
    ("Kotlin – Self Paced", "kotlin-self-paced", "mobile", "beginner", 20, 499),
    ("Flutter – Self Paced", "flutter-self-paced", "mobile", "beginner", 30, 499),
    ("Full Stack Development – MERN", "full-stack-node-react", "web", "intermediate", 120, 4999),
    ("DevOps Engineering – Live", "devops-live", "web", "advanced", 80, 7999),
    ("System Design – Self Paced", "system-design-self-paced", "web", "advanced", 40, 1499),
    ("Operating Systems – Self Paced", "os-self-paced", "web", "intermediate", 30, 499),
    ("Computer Networks – Self Paced", "computer-networks-self-paced", "web", "intermediate", 25, 499),
    ("DBMS – Self Paced", "dbms-self-paced", "data", "beginner", 20, 499),
    ("C++ Self Paced", "cpp-self-paced", "web", "beginner", 25, 499),
]


class GeeksForGeeksScraper(BaseScraper):
    name = "GeeksforGeeks"
    source_url = COURSES_URL

    def scrape(self) -> list[RawCourse]:
        courses = _try_live_scrape()
        if not courses:
            log.info("[GFG] using curated list")
            courses = _from_curated()
        log.info("[GeeksForGeeks] %d courses", len(courses))
        return courses


def _try_live_scrape() -> list[RawCourse]:
    try:
        resp = httpx.get(COURSES_URL, headers=HEADERS, timeout=25, follow_redirects=True)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "lxml")
        courses = []
        for card in soup.select("div[class*='course-card'], div[class*='CourseCard'], article"):
            title_el = card.select_one("h3, h2, [class*='title']")
            link_el = card.select_one("a[href]")
            if not title_el or not link_el:
                continue
            title = title_el.get_text(strip=True)
            href = link_el["href"]
            url = href if href.startswith("http") else f"{BASE}{href}"
            price_el = card.select_one("[class*='price'], [class*='Price']")
            price_text = price_el.get_text(strip=True) if price_el else ""
            price = 0.0
            if "₹" in price_text:
                import re
                m = re.search(r"[\d,]+", price_text.replace(",", ""))
                price = float(m.group().replace(",", "")) / 83 if m else 0.0  # INR to USD approx
            img_el = card.select_one("img")
            img = img_el.get("src", "") if img_el else ""
            courses.append(
                RawCourse(
                    title=title,
                    external_url=url,
                    institution="GeeksforGeeks",
                    instructor="GeeksforGeeks",
                    price=round(price, 2),
                    rating=4.4,
                    review_count=10000,
                    duration_hours=40,
                    thumbnail_url=img,
                    prestige_override=55,
                )
            )
        return courses
    except Exception as exc:
        log.warning("[GFG] live scrape failed: %s", exc)
        return []


def _from_curated() -> list[RawCourse]:
    return [
        RawCourse(
            title=title,
            external_url=f"https://www.geeksforgeeks.org/courses/{slug}",
            institution="GeeksforGeeks",
            instructor="GeeksforGeeks",
            description=title,
            price=round(price_inr / 83, 2),  # approximate INR → USD
            rating=4.4,
            review_count=10000,
            duration_hours=hours,
            last_updated=date.today(),
            career_path_hint=path,
            level_hint=level,
            prestige_override=55,
        )
        for title, slug, path, level, hours, price_inr in _CURATED
    ]
