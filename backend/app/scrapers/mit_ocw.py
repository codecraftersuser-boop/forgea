"""
MIT OpenCourseWare scraper — uses the public REST API.
API: https://ocw.mit.edu/api/v0/courses/?format=json
Free, no auth required, permissive ToS for educational use.
"""
from __future__ import annotations

import logging

from app.scrapers.base import BaseScraper, CourseData, infer_career_path, infer_level

logger = logging.getLogger(__name__)

MIT_API = "https://ocw.mit.edu/api/v0/courses/?format=json&limit=100"

# Topics we care about for Forgea's three career paths
RELEVANT_TOPICS = {
    "Electrical Engineering and Computer Science",
    "Mathematics",
    "Science",
}

CS_KEYWORDS = [
    "programming", "computer", "software", "algorithm", "data", "machine learning",
    "artificial intelligence", "web", "mobile", "network", "database", "python",
    "java", "javascript", "computing", "information",
]


class MITOpenCourseWareScraper(BaseScraper):
    name = "mit_ocw"
    prestige_score = 95

    def scrape(self) -> list[CourseData]:
        courses: list[CourseData] = []
        url = MIT_API

        while url and len(courses) < 80:
            r = self.get(url)
            if not r:
                break
            data = r.json()
            results = data.get("results", [])

            for item in results:
                title = item.get("title", "").strip()
                description = item.get("description", "") or ""
                department = item.get("department_name", "") or ""
                topics = [t.get("name", "") for t in item.get("topics", [])]
                topics_str = " ".join(topics)

                # Filter: only CS/Math/Engineering with relevant keywords
                combined = (title + " " + description + " " + topics_str + " " + department).lower()
                if not any(kw in combined for kw in CS_KEYWORDS):
                    continue

                career_path = infer_career_path(combined)
                level = infer_level(title + " " + str(item.get("course_num", "")))

                # Duration: MIT courses are ~40–80 hrs; use level as proxy
                duration_map = {"beginner": 40, "intermediate": 55, "advanced": 70, "professional": 80}
                duration = duration_map[level]

                course_url = item.get("url", "")
                if not course_url.startswith("http"):
                    course_url = f"https://ocw.mit.edu{course_url}"

                image = item.get("image_src", None)
                if image and not image.startswith("http"):
                    image = f"https://ocw.mit.edu{image}"

                courses.append(
                    CourseData(
                        title=title,
                        institution="MIT OpenCourseWare",
                        instructor=", ".join(item.get("instructors", []) or []) or "MIT Faculty",
                        career_path=career_path,
                        level=level,
                        price=0.0,
                        rating=4.8,
                        review_count=0,
                        duration_hours=duration,
                        prestige_score=self.prestige_score,
                        external_url=course_url,
                        thumbnail_url=image,
                    )
                )

            url = data.get("next")  # paginate

        logger.info(f"[{self.name}] Collected {len(courses)} courses from MIT OCW")
        return courses
