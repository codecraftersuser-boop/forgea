"""Classify career_path and level from text using keyword matching."""
from __future__ import annotations
import re

# ── Career path keywords ──────────────────────────────────────────────────────

_WEB = [
    "html", "css", "javascript", "typescript", "react", "vue", "angular",
    "node", "express", "fastapi", "django", "flask", "rest api", "graphql",
    "web development", "frontend", "backend", "full stack", "fullstack",
    "next.js", "nuxt", "svelte", "tailwind", "bootstrap", "php", "ruby",
    "responsive", "accessibility", "browser", "http", "webpack", "vite",
]

_DATA = [
    "python", "data science", "machine learning", "deep learning",
    "artificial intelligence", "ai", "neural network", "nlp",
    "natural language", "computer vision", "tensorflow", "pytorch",
    "pandas", "numpy", "scikit", "sql", "database", "big data", "spark",
    "hadoop", "tableau", "power bi", "statistics", "data analysis",
    "data engineering", "etl", "dbt", "airflow", "kafka", "data pipeline",
    "r programming", "matlab", "jupyter", "kaggle", "regression",
    "classification", "clustering",
]

_MOBILE = [
    "android", "ios", "swift", "kotlin", "flutter", "dart",
    "react native", "mobile development", "mobile app", "xcode",
    "jetpack compose", "swiftui", "objective-c", "xamarin",
]

_LEVELS = {
    "beginner": [
        "beginner", "introduction", "intro to", "getting started",
        "fundamentals", "basics", "for beginners", "101", "zero to",
        "from scratch", "no experience", "absolute beginner",
    ],
    "intermediate": [
        "intermediate", "beyond basics", "deeper dive", "applied",
        "practical", "hands-on", "in practice",
    ],
    "advanced": [
        "advanced", "mastery", "expert", "professional", "production",
        "at scale", "deep dive", "masterclass", "specialization",
    ],
    "professional": [
        "professional certificate", "certification", "bootcamp",
        "nanodegree", "career", "job-ready",
    ],
}


def _score(text: str, keywords: list[str]) -> int:
    t = text.lower()
    return sum(1 for kw in keywords if kw in t)


def classify_career_path(text: str, hint: str = "") -> str:
    if hint in ("web", "data", "mobile"):
        return hint
    scores = {
        "web": _score(text, _WEB),
        "data": _score(text, _DATA),
        "mobile": _score(text, _MOBILE),
    }
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "web"  # default to web


def classify_level(text: str, hint: str = "") -> str:
    if hint in ("beginner", "intermediate", "advanced", "professional"):
        return hint
    t = text.lower()
    for level, keywords in _LEVELS.items():
        if any(kw in t for kw in keywords):
            return level
    return "beginner"


def estimate_duration(text: str, fallback: int = 10) -> int:
    """Extract hours from strings like '30 hours', '4 weeks', '2 months'."""
    t = text.lower()
    m = re.search(r"(\d+)\s*hour", t)
    if m:
        return int(m.group(1))
    m = re.search(r"(\d+)\s*week", t)
    if m:
        return int(m.group(1)) * 5  # ~5h/week
    m = re.search(r"(\d+)\s*month", t)
    if m:
        return int(m.group(1)) * 20
    return fallback
