"""DeepLearning.AI — scrapes the public courses page."""
from __future__ import annotations
import logging
from datetime import date

import httpx
from bs4 import BeautifulSoup

from scraper.base import BaseScraper, RawCourse

log = logging.getLogger(__name__)

BASE = "https://www.deeplearning.ai"
COURSES_URL = f"{BASE}/courses/"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; ForgeaBot/1.0)",
    "Accept-Language": "en-US,en;q=0.9",
}

_CURATED = [
    ("Machine Learning Specialization", "machine-learning-specialization", "intermediate", 90, 49.0),
    ("Deep Learning Specialization", "deep-learning-specialization", "intermediate", 120, 49.0),
    ("MLOps Specialization", "machine-learning-engineering-for-production-mlops-specialization", "advanced", 100, 49.0),
    ("Natural Language Processing Specialization", "natural-language-processing-specialization", "advanced", 100, 49.0),
    ("AI for Everyone", "ai-for-everyone", "beginner", 6, 49.0),
    ("AI for Medicine Specialization", "ai-for-medicine-specialization", "advanced", 90, 49.0),
    ("Generative AI with Large Language Models", "generative-ai-with-large-language-models", "advanced", 20, 49.0),
    ("ChatGPT Prompt Engineering for Developers", "chatgpt-prompt-engineering-for-developers", "beginner", 2, 0.0),
    ("LangChain for LLM Application Development", "langchain-for-llm-application-development", "intermediate", 2, 0.0),
    ("Building Systems with the ChatGPT API", "building-systems-with-chatgpt", "intermediate", 2, 0.0),
    ("LangChain Chat with Your Data", "langchain-chat-with-your-data", "intermediate", 2, 0.0),
    ("How Diffusion Models Work", "how-diffusion-models-work", "advanced", 2, 0.0),
    ("Finetuning Large Language Models", "finetuning-large-language-models", "advanced", 2, 0.0),
    ("Building and Evaluating Advanced RAG Applications", "building-evaluating-advanced-rag", "advanced", 2, 0.0),
    ("TensorFlow Developer Professional Certificate", "tensorflow-developer-professional-certificate", "intermediate", 120, 49.0),
    ("AI Python for Beginners", "ai-python-for-beginners", "beginner", 10, 0.0),
]


class DeepLearningAIScraper(BaseScraper):
    name = "DeepLearning.AI"
    source_url = COURSES_URL

    def scrape(self) -> list[RawCourse]:
        courses = _try_live_scrape()
        if not courses:
            log.info("[DeepLearning.AI] using curated list")
            courses = _from_curated()
        log.info("[DeepLearning.AI] %d courses", len(courses))
        return courses


def _try_live_scrape() -> list[RawCourse]:
    try:
        resp = httpx.get(COURSES_URL, headers=HEADERS, timeout=25, follow_redirects=True)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "lxml")
        courses = []
        for card in soup.select("div[class*='course-card'], article, div[class*='CourseCard']"):
            title_el = card.select_one("h2, h3, [class*='title']")
            link_el = card.select_one("a[href]")
            if not title_el or not link_el:
                continue
            title = title_el.get_text(strip=True)
            href = link_el["href"]
            url = href if href.startswith("http") else f"{BASE}{href}"
            img_el = card.select_one("img")
            img = img_el.get("src", "") if img_el else ""
            courses.append(
                RawCourse(
                    title=title,
                    external_url=url,
                    institution="DeepLearning.AI",
                    instructor="Andrew Ng",
                    price=49.0,
                    rating=4.9,
                    review_count=30000,
                    duration_hours=20,
                    thumbnail_url=img,
                    career_path_hint="data",
                    prestige_override=85,
                )
            )
        return courses
    except Exception as exc:
        log.warning("[DeepLearning.AI] live scrape failed: %s", exc)
        return []


def _from_curated() -> list[RawCourse]:
    return [
        RawCourse(
            title=title,
            external_url=f"https://www.deeplearning.ai/courses/{slug}/",
            institution="DeepLearning.AI",
            instructor="Andrew Ng",
            description=title,
            price=price,
            rating=4.9,
            review_count=30000,
            duration_hours=hours,
            last_updated=date.today(),
            career_path_hint="data",
            level_hint=level,
            prestige_override=85,
        )
        for title, slug, level, hours, price in _CURATED
    ]
