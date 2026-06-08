from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def list_projects():
    # TODO: filter by career_path, status
    return {"message": "projects list"}


@router.post("/")
def create_project():
    # TODO: create project and assign owner
    return {"message": "created"}


@router.get("/{project_id}")
def get_project(project_id: int):
    return {"project_id": project_id}


@router.patch("/{project_id}")
def update_project(project_id: int):
    return {"project_id": project_id}


@router.post("/{project_id}/apply")
def apply_to_project(project_id: int):
    # TODO: create application for a role
    return {"message": "applied"}


@router.post("/{project_id}/complete")
def complete_project(project_id: int):
    # TODO: mark complete, trigger peer review flow
    return {"message": "completed"}
