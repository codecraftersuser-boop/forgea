"""
DeepLearning.AI scraper — scrapes https://www.deeplearning.ai/courses/
Focus on AI/ML courses. Many are free short courses.
"""
from __future__ import annotations

import logging
import re

from app.scrapers.base import BaseScraper, CourseData, infer_career_path, infer_level

logger = logging.getLogger(__name__)

DLAI_COURSES_URL = "https://www.deeplearning.ai/courses/"


class DeepLearningAIScraper(BaseScraper):
    name = "deeplearning_ai"
    prestige_score = 88

    def scrape(self) -> list[CourseData]:
        soup = self.soup(DLAI_COURSES_URL)
        if not soup:
            logger.warning(f"[{self.name}] Could not fetch DeepLearning.AI, using fallback")
            return self._fallback()

        courses: list[CourseData] = []
        seen: set[str] = set()

        # Course cards are typically article or div with course info
        for card in soup.find_all(["article", "div"], class_=re.compile(r"course|card", re.I)):
            a = card.find("a", href=True)
            if not a:
                continue
            href = a["href"]
            if href in seen:
                continue
            seen.add(href)

            title_el = card.find(["h2", "h3", "h4"])
            if not title_el:
                continue
            title = title_el.get_text(strip=True)
            if not title or len(title) < 3:
                continue

            desc_el = card.find("p")
            description = desc_el.get_text(strip=True) if desc_el else title

            # Check for price info
            price_el = card.find(string=re.compile(r"free|paid|\$", re.I))
            price = 0.0 if price_el and "free" in str(price_el).lower() else 49.0

            full_url = href if href.startswith("http") else f"https://www.deeplearning.ai{href}"

            img = card.find("img")
            thumbnail = img["src"] if img and img.get("src") else None

            courses.append(
                CourseData(
                    title=title,
                    institution="DeepLearning.AI",
                    instructor="Andrew Ng & Team",
                    career_path=infer_career_path(title + " " + description),
                    level=infer_level(title + " " + description),
                    price=price,
                    rating=4.8,
                    review_count=0,
                    duration_hours=self._estimate_hours(title, description),
                    prestige_score=self.prestige_score,
                    external_url=full_url,
                    thumbnail_url=thumbnail,
                )
            )

        if courses:
            logger.info(f"[{self.name}] Scraped {len(courses)} courses")
            return courses

        return self._fallback()

    def _estimate_hours(self, title: str, description: str) -> int:
        combined = (title + " " + description).lower()
        if "specialization" in combined or "professional" in combined:
            return 80
        if "course" in combined or "series" in combined:
            return 20
        return 4  # short course default for DeepLearning.AI

    def _fallback(self) -> list[CourseData]:
        catalog = [
            # (title, level, hours, price)
            ("Machine Learning Specialization", "intermediate", 80, 49.0),
            ("Deep Learning Specialization", "advanced", 120, 49.0),
            ("MLOps Specialization", "professional", 80, 49.0),
            ("Natural Language Processing Specialization", "advanced", 80, 49.0),
            ("AI For Everyone", "beginner", 6, 0.0),
            ("AI For Good Specialization", "beginner", 20, 0.0),
            ("Generative AI with Large Language Models", "intermediate", 16, 49.0),
            ("ChatGPT Prompt Engineering for Developers", "beginner", 4, 0.0),
            ("LangChain for LLM Application Development", "intermediate", 4, 0.0),
            ("How Diffusion Models Work", "advanced", 4, 0.0),
            ("Building Systems with the ChatGPT API", "intermediate", 4, 0.0),
            ("LangChain: Chat with Your Data", "intermediate", 4, 0.0),
            ("Finetuning Large Language Models", "advanced", 4, 0.0),
            ("AI Agents in LangGraph", "advanced", 6, 0.0),
            ("Preprocessing Unstructured Data for LLM Applications", "intermediate", 4, 0.0),
            ("Vector Databases: from Embeddings to Applications", "intermediate", 4, 0.0),
            ("TensorFlow Developer Professional Certificate", "intermediate", 80, 49.0),
            ("Computer Vision", "intermediate", 20, 0.0),
            ("Reinforcement Learning Specialization", "advanced", 80, 49.0),
            ("Practical Data Science on the AWS Cloud Specialization", "professional", 60, 49.0),
        ]
        return [
            CourseData(
                title=title,
                institution="DeepLearning.AI",
                instructor="Andrew Ng & Team",
                career_path="data",
                level=level,
                price=price,
                rating=4.8,
                review_count=0,
                duration_hours=hours,
                prestige_score=self.prestige_score,
                external_url=f"https://www.deeplearning.ai/courses/{title.lower().replace(' ', '-')}/",
                thumbnail_url="https://www.deeplearning.ai/wp-content/themes/deeplearning-ai/assets/img/logo.svg",
            )
            for title, level, hours, price in catalog
        ]
