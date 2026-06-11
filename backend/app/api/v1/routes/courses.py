from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.course import Course, UserCourse
from app.models.user import User
from app.schemas import CourseOut, CourseProgressIn

router = APIRouter()


def _course_out(course: Course, progress: int | None = None) -> dict:
    data = CourseOut.model_validate(course).model_dump()
    data["progress"] = progress
    return data


@router.get("/", response_model=list[CourseOut])
def list_courses(
    career_path: str | None = Query(default=None),
    level: str | None = Query(default=None),
    max_price: float | None = Query(default=None),
    min_prestige: int | None = Query(default=None),
    skip: int = 0,
    limit: int = Query(default=20, le=100),
    db: Session = Depends(get_db),
):
    q = db.query(Course)
    if career_path:
        q = q.filter(Course.career_path == career_path)
    if level:
        q = q.filter(Course.level == level)
    if max_price is not None:
        q = q.filter(Course.price <= max_price)
    if min_prestige is not None:
        q = q.filter(Course.prestige_score >= min_prestige)
    courses = q.order_by(Course.prestige_score.desc()).offset(skip).limit(limit).all()
    return [CourseOut.model_validate(c) for c in courses]


@router.get("/my", response_model=list[CourseOut])
def my_courses(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    enrollments = db.query(UserCourse).filter(UserCourse.user_id == current_user.id).all()
    result = []
    for uc in enrollments:
        data = CourseOut.model_validate(uc.course).model_dump()
        data["progress"] = uc.progress
        data["completed_at"] = uc.completed_at
        result.append(data)
    return result


@router.get("/{course_id}", response_model=CourseOut)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    return CourseOut.model_validate(course)


@router.post("/{course_id}/enroll", status_code=status.HTTP_201_CREATED)
def enroll_course(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = db.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    existing = (
        db.query(UserCourse)
        .filter(UserCourse.user_id == current_user.id, UserCourse.course_id == course_id)
        .first()
    )
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Already enrolled")
    db.add(UserCourse(user_id=current_user.id, course_id=course_id))
    db.commit()
    return {"message": "Enrolled successfully"}


@router.patch("/{course_id}/progress")
def update_progress(
    course_id: int,
    body: CourseProgressIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    uc = (
        db.query(UserCourse)
        .filter(UserCourse.user_id == current_user.id, UserCourse.course_id == course_id)
        .first()
    )
    if not uc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not enrolled in this course")
    uc.progress = body.progress
    if body.progress == 100 and not uc.completed_at:
        from datetime import datetime
        uc.completed_at = datetime.utcnow()
        # Award XP for completing a course
        current_user.xp += 50
    db.commit()
    return {"progress": uc.progress}
