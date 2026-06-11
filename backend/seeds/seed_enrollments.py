"""
Re-seed user course enrollments to match each user's career path and level.
Run: docker exec forgea-backend-1 python -m seeds.seed_enrollments
"""
import sys, random
sys.path.insert(0, "/app")

from app.core.database import SessionLocal
from app.models.user import User
from app.models.course import Course, UserCourse

LEVEL_ORDER = ["beginner", "intermediate", "advanced", "professional"]

def levels_for_user(user_level: int) -> list[str]:
    """Return which course levels a user of this level should have seen."""
    if user_level <= 2:
        return ["beginner"]
    elif user_level <= 5:
        return ["beginner", "intermediate"]
    elif user_level <= 9:
        return ["beginner", "intermediate", "advanced"]
    else:
        return ["beginner", "intermediate", "advanced", "professional"]

def progress_for_level(course_level: str, user_level: int, is_last: bool) -> int:
    """
    Courses from older levels = completed (100).
    Last tier = mix of in-progress and completed.
    """
    tiers = levels_for_user(user_level)
    if course_level != tiers[-1]:
        return 100
    # In current tier: some done, some in-progress, maybe one not started
    if is_last:
        return random.choice([0, 25, 50, 75])
    return random.choice([60, 75, 80, 90, 100])


def run():
    random.seed(42)
    db = SessionLocal()
    try:
        # Clear existing
        deleted = db.query(UserCourse).delete()
        print(f"Cleared {deleted} existing enrollments")

        users = db.query(User).filter(User.career_path.isnot(None)).all()
        courses = db.query(Course).all()

        # Index courses by path+level
        by_path_level: dict[tuple, list[Course]] = {}
        for c in courses:
            key = (c.career_path, c.level)
            by_path_level.setdefault(key, []).append(c)

        total = 0
        for user in users:
            path = str(user.career_path).replace("CareerPath.", "")
            tiers = levels_for_user(user.level)

            for tier in tiers:
                pool = by_path_level.get((path, tier), [])
                if not pool:
                    continue

                # Pick 3-6 courses from this tier (or all if fewer exist)
                n = min(len(pool), random.randint(3, 6))
                selected = random.sample(pool, n)

                for i, course in enumerate(selected):
                    is_last_course = (tier == tiers[-1]) and (i == len(selected) - 1)
                    prog = progress_for_level(tier, user.level, is_last_course)
                    db.add(UserCourse(
                        user_id=user.id,
                        course_id=course.id,
                        progress=prog,
                    ))
                    total += 1

        db.commit()
        print(f"Inserted {total} enrollments across {len(users)} users")

        # Summary per user
        for user in users[:10]:
            path = str(user.career_path).replace("CareerPath.", "")
            count = db.query(UserCourse).filter(UserCourse.user_id == user.id).count()
            print(f"  {user.full_name[:22]:<22} lv{user.level:>2} [{path:<6}] → {count} courses")

    finally:
        db.close()


if __name__ == "__main__":
    run()
