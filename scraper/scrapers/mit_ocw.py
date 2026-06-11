"""MIT OpenCourseWare — uses the public search JSON endpoint."""
from __future__ import annotations
import logging
from datetime import date

import httpx

from scraper.base import BaseScraper, RawCourse

log = logging.getLogger(__name__)

BASE = "https://ocw.mit.edu"
# MIT OCW exposes a search API used by their own frontend
SEARCH_API = "https://open.mit.edu/api/v0/search/"
HEADERS = {"User-Agent": "ForgeaBot/1.0 (educational indexer)"}

QUERIES = [
    ("web development", "web"),
    ("javascript python", "web"),
    ("machine learning", "data"),
    ("data science", "data"),
    ("artificial intelligence", "data"),
    ("mobile application", "mobile"),
    ("computer science", "web"),
    ("software engineering", "web"),
    ("deep learning", "data"),
    ("algorithms", "web"),
]


def _fetch_page(query: str, from_: int = 0) -> list[dict]:
    try:
        resp = httpx.post(
            SEARCH_API,
            json={
                "query": query,
                "from": from_,
                "size": 25,
                "resource_category": "Course",
            },
            headers=HEADERS,
            timeout=20,
        )
        if resp.status_code == 200:
            return resp.json().get("hits", {}).get("hits", [])
    except Exception as exc:
        log.debug("[MIT OCW] API error for %r: %s", query, exc)
    return []


def _parse_hit(hit: dict, career_path_hint: str) -> RawCourse | None:
    src = hit.get("_source", {})
    title = src.get("title", "").strip()
    url_slug = src.get("url", "")
    if not title or not url_slug:
        return None

    url = url_slug if url_slug.startswith("http") else f"{BASE}{url_slug}"
    topics = " ".join(src.get("topics", []))
    department = src.get("department_name", ["MIT"])[0] if src.get("department_name") else "MIT"
    instructors = src.get("instructors", [])
    instructor_name = instructors[0].get("full_name", "MIT Faculty") if instructors else "MIT Faculty"
    image = src.get("image_src", "")
    if image and not image.startswith("http"):
        image = f"{BASE}{image}"

    level_raw = src.get("level", ["beginner"])[0] if src.get("level") else "beginner"
    level_map = {"Graduate": "advanced", "Undergraduate": "intermediate", "High School": "beginner"}
    level = level_map.get(level_raw, "intermediate")

    return RawCourse(
        title=title,
        external_url=url,
        institution="MIT OpenCourseWare",
        instructor=instructor_name,
        description=f"{title} — {department}. {topics}",
        price=0.0,
        rating=4.8,
        review_count=10000,
        duration_hours=40,
        thumbnail_url=image,
        last_updated=date.today(),
        career_path_hint=career_path_hint,
        level_hint=level,
        prestige_override=95,
    )


class MITOpenCourseWareScraper(BaseScraper):
    name = "MIT OCW"
    source_url = BASE

    def scrape(self) -> list[RawCourse]:
        seen: set[str] = set()
        courses: list[RawCourse] = []

        for query, hint in QUERIES:
            hits = _fetch_page(query)
            for hit in hits:
                course = _parse_hit(hit, hint)
                if course and course.external_url not in seen:
                    seen.add(course.external_url)
                    courses.append(course)

        # Fallback: scrape the search page HTML if the API returns nothing
        if not courses:
            log.warning("[MIT OCW] API returned 0 results, falling back to HTML scrape")
            courses = _scrape_html_fallback()

        log.info("[MIT OCW] %d courses", len(courses))
        return courses


def _scrape_html_fallback() -> list[RawCourse]:
    from bs4 import BeautifulSoup
    courses = []
    try:
        resp = httpx.get(
            f"{BASE}/search/?q=&type=course",
            headers=HEADERS,
            timeout=20,
            follow_redirects=True,
        )
        soup = BeautifulSoup(resp.text, "lxml")
        for card in soup.select("div.lr-search-result, article.course-card, div[class*='course']")[:30]:
            title_el = card.select_one("h3, h2, .title")
            link_el = card.select_one("a[href]")
            if not title_el or not link_el:
                continue
            title = title_el.get_text(strip=True)
            href = link_el["href"]
            url = href if href.startswith("http") else f"{BASE}{href}"
            courses.append(
                RawCourse(
                    title=title,
                    external_url=url,
                    institution="MIT OpenCourseWare",
                    instructor="MIT Faculty",
                    price=0.0,
                    rating=4.8,
                    review_count=10000,
                    duration_hours=40,
                    prestige_override=95,
                )
            )
    except Exception as exc:
        log.error("[MIT OCW] HTML fallback failed: %s", exc)
    return courses
