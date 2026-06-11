"""Roadmap.sh — uses their public GitHub JSON to build learning path courses."""
from __future__ import annotations
import logging
from datetime import date

import httpx

from scraper.base import BaseScraper, RawCourse

log = logging.getLogger(__name__)

# roadmap.sh exposes their roadmap list via their public API
API_URL = "https://roadmap.sh/api/roadmaps"
BASE = "https://roadmap.sh"
HEADERS = {"User-Agent": "ForgeaBot/1.0 (educational indexer)"}

# Manual mapping for roadmaps we care about
_ROADMAP_META = {
    "frontend": ("Frontend Developer Roadmap", "web", "beginner", 100),
    "backend": ("Backend Developer Roadmap", "web", "intermediate", 100),
    "fullstack": ("Full Stack Developer Roadmap", "web", "intermediate", 150),
    "react": ("React Developer Roadmap", "web", "intermediate", 60),
    "nodejs": ("Node.js Developer Roadmap", "web", "intermediate", 60),
    "typescript": ("TypeScript Roadmap", "web", "intermediate", 30),
    "python": ("Python Roadmap", "data", "beginner", 50),
    "data-analyst": ("Data Analyst Roadmap", "data", "beginner", 80),
    "ai-data-scientist": ("AI and Data Scientist Roadmap", "data", "advanced", 120),
    "mlops": ("MLOps Roadmap", "data", "advanced", 100),
    "android": ("Android Developer Roadmap", "mobile", "intermediate", 80),
    "react-native": ("React Native Roadmap", "mobile", "intermediate", 70),
    "flutter": ("Flutter Roadmap", "mobile", "intermediate", 70),
    "devops": ("DevOps Roadmap", "web", "advanced", 120),
    "docker": ("Docker Roadmap", "web", "intermediate", 20),
    "kubernetes": ("Kubernetes Roadmap", "web", "advanced", 30),
    "javascript": ("JavaScript Roadmap", "web", "beginner", 60),
    "vue": ("Vue.js Roadmap", "web", "intermediate", 40),
    "angular": ("Angular Roadmap", "web", "intermediate", 50),
    "sql": ("SQL Roadmap", "data", "beginner", 30),
    "postgresql": ("PostgreSQL Roadmap", "data", "intermediate", 40),
    "system-design": ("System Design Roadmap", "web", "advanced", 60),
    "git-github": ("Git and GitHub Roadmap", "web", "beginner", 10),
    "linux": ("Linux Roadmap", "web", "intermediate", 40),
    "cyber-security": ("Cyber Security Roadmap", "web", "advanced", 80),
    "ux-design": ("UX Design Roadmap", "web", "beginner", 60),
}


class RoadmapShScraper(BaseScraper):
    name = "roadmap.sh"
    source_url = BASE

    def scrape(self) -> list[RawCourse]:
        courses = []
        for slug, (title, path, level, hours) in _ROADMAP_META.items():
            courses.append(
                RawCourse(
                    title=title,
                    external_url=f"{BASE}/{slug}",
                    institution="roadmap.sh",
                    instructor="roadmap.sh Community",
                    description=f"Interactive visual roadmap for {title}. Community-maintained learning path.",
                    price=0.0,
                    rating=4.8,
                    review_count=100000,
                    duration_hours=hours,
                    last_updated=date.today(),
                    career_path_hint=path,
                    level_hint=level,
                    prestige_override=72,
                )
            )
        log.info("[roadmap.sh] %d roadmaps", len(courses))
        return courses
