from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def list_courses():
    # TODO: filter by career_path, level, price, prestige
    return {"message": "courses list"}


@router.get("/{course_id}")
def get_course(course_id: int):
    return {"course_id": course_id}


@router.post("/{course_id}/enroll")
def enroll_course(course_id: int):
    return {"message": "enrolled"}


@router.patch("/{course_id}/progress")
def update_progress(course_id: int):
    return {"message": "progress updated"}
