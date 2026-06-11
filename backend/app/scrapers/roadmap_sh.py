"""
roadmap.sh scraper — scrapes the public roadmap listing at https://roadmap.sh/roadmaps
Each roadmap is a structured learning path; we represent each as a "course".
"""
from __future__ import annotations

import logging
import re

from app.scrapers.base import BaseScraper, CourseData, infer_career_path, infer_level

logger = logging.getLogger(__name__)

ROADMAP_URL = "https://roadmap.sh/roadmaps"


class RoadmapShScraper(BaseScraper):
    name = "roadmap_sh"
    prestige_score = 72

    def scrape(self) -> list[CourseData]:
        soup = self.soup(ROADMAP_URL)
        if not soup:
            logger.warning(f"[{self.name}] Could not fetch roadmap.sh, using fallback")
            return self._fallback()

        courses: list[CourseData] = []
        seen: set[str] = set()

        for a in soup.find_all("a", href=True):
            href = a["href"]
            # roadmap.sh paths look like /frontend, /backend, /devops etc.
            if not re.match(r"^/[a-z0-9-]+$", href) or href in ("/", "/roadmaps"):
                continue
            if href in seen:
                continue
            seen.add(href)

            title_el = a.find(["h2", "h3", "h4", "span", "p"])
            title = (title_el.get_text(strip=True) if title_el else a.get_text(strip=True))
            if not title or len(title) < 3 or len(title) > 80:
                continue

            full_url = f"https://roadmap.sh{href}"
            career_path = infer_career_path(title + " " + href)

            courses.append(
                CourseData(
                    title=f"{title} Roadmap",
                    institution="roadmap.sh",
                    instructor="roadmap.sh Community",
                    career_path=career_path,
                    level=infer_level(title),
                    price=0.0,
                    rating=4.7,
                    review_count=0,
                    duration_hours=self._estimate_hours(title),
                    prestige_score=self.prestige_score,
                    external_url=full_url,
                    thumbnail_url="https://roadmap.sh/images/brand.png",
                )
            )

        if courses:
            logger.info(f"[{self.name}] Scraped {len(courses)} roadmaps")
            return courses

        return self._fallback()

    def _estimate_hours(self, title: str) -> int:
        lower = title.lower()
        if any(k in lower for k in ["full", "complete", "professional"]):
            return 120
        if any(k in lower for k in ["advanced", "backend", "frontend", "devops"]):
            return 80
        return 40

    def _fallback(self) -> list[CourseData]:
        roadmaps = [
            ("Frontend Developer", "web", "intermediate", 80),
            ("Backend Developer", "web", "intermediate", 90),
            ("Full Stack Developer", "web", "advanced", 150),
            ("React Developer", "web", "intermediate", 60),
            ("Node.js Developer", "web", "intermediate", 60),
            ("JavaScript", "web", "beginner", 40),
            ("TypeScript", "web", "intermediate", 30),
            ("Python", "data", "beginner", 40),
            ("SQL", "data", "beginner", 30),
            ("Data Science", "data", "intermediate", 100),
            ("Machine Learning", "data", "advanced", 120),
            ("MLOps", "data", "professional", 80),
            ("AI and Data Scientist", "data", "professional", 150),
            ("Android Developer", "mobile", "intermediate", 80),
            ("iOS Developer", "mobile", "intermediate", 80),
            ("React Native", "mobile", "intermediate", 60),
            ("Flutter", "mobile", "intermediate", 60),
            ("DevOps", "web", "advanced", 100),
            ("Docker", "web", "intermediate", 25),
            ("Kubernetes", "web", "advanced", 40),
            ("PostgreSQL", "data", "intermediate", 30),
            ("MongoDB", "data", "beginner", 25),
            ("GraphQL", "web", "intermediate", 25),
            ("System Design", "web", "advanced", 40),
            ("Software Design & Architecture", "web", "professional", 60),
        ]
        return [
            CourseData(
                title=f"{title} Roadmap",
                institution="roadmap.sh",
                instructor="roadmap.sh Community",
                career_path=cp,
                level=level,
                price=0.0,
                rating=4.7,
                review_count=0,
                duration_hours=hours,
                prestige_score=self.prestige_score,
                external_url=f"https://roadmap.sh/{title.lower().replace(' ', '-').replace('.', '')}",
                thumbnail_url="https://roadmap.sh/images/brand.png",
            )
            for title, cp, level, hours in roadmaps
        ]
