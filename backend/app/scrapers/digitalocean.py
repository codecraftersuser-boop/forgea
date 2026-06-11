"""
DigitalOcean Community scraper — uses their public Tutorials API.
API: https://www.digitalocean.com/community/tutorials?subtype=tutorial
Free tutorials focused on web dev, DevOps, and backend.
"""
from __future__ import annotations

import logging

from app.scrapers.base import BaseScraper, CourseData, infer_career_path, infer_level

logger = logging.getLogger(__name__)

DO_API = "https://www.digitalocean.com/community/tutorials.json?per_page=50&page={page}"


class DigitalOceanScraper(BaseScraper):
    name = "digitalocean"
    prestige_score = 70

    def scrape(self) -> list[CourseData]:
        courses: list[CourseData] = []
        seen: set[str] = set()

        for page in range(1, 4):  # 3 pages = ~150 tutorials
            r = self.get(DO_API.format(page=page))
            if not r:
                break
            try:
                data = r.json()
            except Exception:
                break

            items = data if isinstance(data, list) else data.get("items", data.get("tutorials", []))
            if not items:
                break

            for item in items:
                title = item.get("title", "").strip()
                slug = item.get("slug", "")
                description = item.get("description", "") or item.get("blurb", "") or title

                if not title or slug in seen:
                    continue
                seen.add(slug)

                combined = title + " " + description
                # Skip non-tech
                if not any(k in combined.lower() for k in [
                    "python", "javascript", "node", "react", "django", "flask",
                    "docker", "kubernetes", "linux", "nginx", "database", "sql",
                    "api", "server", "web", "deploy", "cloud", "security",
                ]):
                    continue

                courses.append(
                    CourseData(
                        title=title,
                        institution="DigitalOcean",
                        instructor="DigitalOcean Community",
                        career_path=infer_career_path(combined),
                        level=infer_level(combined),
                        price=0.0,
                        rating=4.5,
                        review_count=item.get("reactions_count", 0) or 0,
                        duration_hours=1,  # tutorials are ~30–60 min reads
                        prestige_score=self.prestige_score,
                        external_url=f"https://www.digitalocean.com/community/tutorials/{slug}",
                        thumbnail_url=None,
                    )
                )

        if courses:
            logger.info(f"[{self.name}] Collected {len(courses)} tutorials")
            return courses[:40]  # cap; DO has thousands

        logger.warning(f"[{self.name}] API returned no data, using fallback")
        return self._fallback()

    def _fallback(self) -> list[CourseData]:
        tutorials = [
            ("How To Install and Use Docker on Ubuntu 22.04", "web", "beginner", 1),
            ("How To Set Up Django with Postgres, Nginx, and Gunicorn on Ubuntu", "web", "intermediate", 2),
            ("How To Build a React Application with Create React App", "web", "beginner", 1),
            ("A General Introduction to Cloud Computing", "web", "beginner", 1),
            ("How To Write Your First JavaScript Program", "web", "beginner", 1),
            ("How To Code in Python 3", "data", "beginner", 3),
            ("How To Work with SQL in Python 3 Using the sqlite3 Module", "data", "beginner", 1),
            ("How To Use NumPy in Python", "data", "beginner", 2),
            ("How To Build a Machine Learning Classifier in Python with Scikit-learn", "data", "intermediate", 2),
            ("How To Set Up a Node.js Application for Production on Ubuntu", "web", "intermediate", 2),
            ("How To Use Vue.js and Axios to Display Data from an API", "web", "intermediate", 1),
            ("An Introduction to Kubernetes", "web", "intermediate", 2),
            ("How To Install and Configure Laravel with Nginx on Ubuntu", "web", "intermediate", 2),
            ("How To Deploy a Go Web Application Using Nginx on Ubuntu", "web", "intermediate", 2),
            ("How To Create a Self-Signed SSL Certificate for Nginx", "web", "intermediate", 1),
        ]
        return [
            CourseData(
                title=title,
                institution="DigitalOcean",
                instructor="DigitalOcean Community",
                career_path=cp,
                level=level,
                price=0.0,
                rating=4.5,
                review_count=0,
                duration_hours=hours,
                prestige_score=self.prestige_score,
                external_url=f"https://www.digitalocean.com/community/tutorials/{title.lower().replace(' ', '-').replace(',', '').replace(':', '')}",
                thumbnail_url=None,
            )
            for title, cp, level, hours in tutorials
        ]
