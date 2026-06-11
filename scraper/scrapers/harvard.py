"""Harvard Online Learning — scrapes the public course catalog."""
from __future__ import annotations
import logging
from datetime import date

import httpx
from bs4 import BeautifulSoup

from scraper.base import BaseScraper, RawCourse

log = logging.getLogger(__name__)

BASE = "https://pll.harvard.edu"
CATALOG = f"{BASE}/catalog"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; ForgeaBot/1.0)",
    "Accept-Language": "en-US,en;q=0.9",
}


def _parse_page(html: str) -> list[RawCourse]:
    soup = BeautifulSoup(html, "lxml")
    courses = []

    for card in soup.select("article.course-card, div.course-card, li.course-item, div[class*='catalog-item']"):
        title_el = card.select_one("h3, h2, .course-title, [class*='title']")
        link_el = card.select_one("a[href]")
        meta_el = card.select_one(".course-meta, .course-details, [class*='meta']")
        img_el = card.select_one("img")

        if not title_el or not link_el:
            continue

        title = title_el.get_text(strip=True)
        href = link_el["href"]
        url = href if href.startswith("http") else f"{BASE}{href}"
        meta_text = meta_el.get_text(" ", strip=True) if meta_el else ""
        img = img_el.get("src", "") if img_el else ""
        if img and not img.startswith("http"):
            img = f"{BASE}{img}"

        # Detect free vs paid
        price_text = card.get_text(" ", strip=True).lower()
        price = 0.0 if "free" in price_text else 149.0

        courses.append(
            RawCourse(
                title=title,
                external_url=url,
                institution="Harvard University",
                instructor="Harvard Faculty",
                description=f"{title}. {meta_text}",
                price=price,
                rating=4.9,
                review_count=5000,
                duration_hours=40,
                thumbnail_url=img,
                last_updated=date.today(),
                prestige_override=95,
            )
        )
    return courses


class HarvardOnlineScraper(BaseScraper):
    name = "Harvard Online"
    source_url = CATALOG

    def scrape(self) -> list[RawCourse]:
        courses: list[RawCourse] = []
        page = 0

        while page < 5:  # cap at 5 pages
            url = CATALOG if page == 0 else f"{CATALOG}?page={page}"
            try:
                resp = httpx.get(url, headers=HEADERS, timeout=25, follow_redirects=True)
                resp.raise_for_status()
            except Exception as exc:
                log.error("[Harvard] page %d failed: %s", page, exc)
                break

            parsed = _parse_page(resp.text)
            if not parsed:
                break

            courses.extend(parsed)
            page += 1

        # Fallback curated list if scraping yields nothing
        if not courses:
            log.warning("[Harvard] scrape yielded 0, using curated list")
            courses = _curated()

        # Deduplicate
        seen: set[str] = set()
        unique = []
        for c in courses:
            if c.external_url not in seen:
                seen.add(c.external_url)
                unique.append(c)

        log.info("[Harvard] %d courses", len(unique))
        return unique


def _curated() -> list[RawCourse]:
    items = [
        ("CS50: Introduction to Computer Science", "cs50", "web", "beginner", 0.0, 100),
        ("CS50's Web Programming with Python and JavaScript", "cs50w", "web", "intermediate", 0.0, 120),
        ("CS50's Introduction to Artificial Intelligence with Python", "cs50ai", "data", "intermediate", 0.0, 100),
        ("CS50's Introduction to Databases with SQL", "cs50sql", "data", "beginner", 0.0, 80),
        ("CS50's Introduction to Cybersecurity", "cs50cybersecurity", "web", "beginner", 0.0, 60),
        ("Data Science: Machine Learning", "data-science-machine-learning", "data", "intermediate", 149.0, 120),
        ("Data Science: Productivity Tools", "data-science-productivity-tools", "data", "beginner", 149.0, 40),
        ("Professional Certificate in Data Science", "professional-certificate-data-science", "data", "professional", 441.0, 200),
        ("Introduction to Data Science with Python", "introduction-data-science-python", "data", "beginner", 149.0, 60),
        ("High-Powered Machine Learning with Python", "high-powered-machine-learning-python", "data", "advanced", 149.0, 80),
        ("Mobile Application Development with React Native", "mobile-application-development-react-native", "mobile", "intermediate", 149.0, 60),
        ("Android App Development", "android-app-development", "mobile", "beginner", 149.0, 60),
    ]
    return [
        RawCourse(
            title=title,
            external_url=f"https://pll.harvard.edu/course/{slug}",
            institution="Harvard University",
            instructor="Harvard Faculty",
            description=title,
            price=price,
            rating=4.9,
            review_count=5000,
            duration_hours=hours,
            career_path_hint=path,
            level_hint=level,
            prestige_override=95,
        )
        for title, slug, path, level, price, hours in items
    ]
