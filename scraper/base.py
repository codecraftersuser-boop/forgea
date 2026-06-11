"""Base types and abstract scraper contract."""
from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import date


@dataclass
class RawCourse:
    """Intermediate representation before DB normalization."""
    title: str
    external_url: str
    institution: str
    instructor: str = ""
    description: str = ""
    price: float = 0.0
    rating: float = 0.0
    review_count: int = 0
    duration_hours: int = 0
    thumbnail_url: str = ""
    last_updated: date = field(default_factory=date.today)
    # Optional hints — classifier will fill if empty
    career_path_hint: str = ""   # "web" | "data" | "mobile" | ""
    level_hint: str = ""          # "beginner" | "intermediate" | "advanced" | ""
    prestige_override: int | None = None


class BaseScraper(ABC):
    """All scrapers implement this contract."""

    name: str = ""           # e.g. "freeCodeCamp"
    source_url: str = ""     # root URL being scraped

    @abstractmethod
    def scrape(self) -> list[RawCourse]:
        """Fetch and parse courses. Must be idempotent."""
        ...

    def __repr__(self) -> str:
        return f"<{self.__class__.__name__} name={self.name!r}>"
