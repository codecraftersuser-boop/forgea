from fastapi import APIRouter, Depends, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.course import Course
from app.models.project import Project
from app.models.user import User

router = APIRouter()


@router.get("/")
def global_search(
    q: str = Query(min_length=2, max_length=100),
    limit: int = Query(default=5, le=10),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Search courses, projects, and users by name/title. Returns top matches per category."""
    pattern = f"%{q}%"

    courses = (
        db.query(Course)
        .filter(or_(
            Course.title.ilike(pattern),
            Course.institution.ilike(pattern),
            Course.instructor.ilike(pattern),
        ))
        .order_by(Course.prestige_score.desc())
        .limit(limit)
        .all()
    )

    projects = (
        db.query(Project)
        .filter(or_(
            Project.title.ilike(pattern),
            Project.description.ilike(pattern),
        ))
        .order_by(Project.id.desc())
        .limit(limit)
        .all()
    )

    users = (
        db.query(User)
        .filter(User.full_name.ilike(pattern))
        .order_by(User.reputation_score.desc())
        .limit(limit)
        .all()
    )

    return {
        "courses": [
            {
                "id": c.id,
                "title": c.title,
                "institution": c.institution,
                "level": c.level,
                "career_path": c.career_path,
                "external_url": c.external_url,
            }
            for c in courses
        ],
        "projects": [
            {
                "id": p.id,
                "title": p.title,
                "status": p.status,
                "career_path": p.career_path,
            }
            for p in projects
        ],
        "users": [
            {
                "id": u.id,
                "full_name": u.full_name,
                "career_path": u.career_path,
                "level": u.level,
            }
            for u in users
        ],
    }
