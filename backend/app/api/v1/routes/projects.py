from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.notification import Notification, NotificationType
from app.models.project import Project, ProjectMember, ProjectRole, ProjectTech
from app.models.user import User
from app.schemas import (
    ProjectAcceptApplicationIn,
    ProjectAcceptInviteIn,
    ProjectApplyIn,
    ProjectCreateIn,
    ProjectInviteIn,
    ProjectOut,
    ProjectUpdateIn,
)

router = APIRouter()


def _load_project(db: Session, project_id: int) -> Project:
    project = (
        db.query(Project)
        .options(
            joinedload(Project.owner),
            joinedload(Project.members).joinedload(ProjectMember.user),
            joinedload(Project.tech_stack),
            joinedload(Project.open_roles),
        )
        .filter(Project.id == project_id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


def _project_out(project: Project) -> dict:
    return {
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "career_path": project.career_path,
        "status": project.status.value if hasattr(project.status, "value") else project.status,
        "progress": project.progress,
        "team_size": project.team_size,
        "owner": project.owner,
        "members": [
            {"user": m.user, "role": m.role, "joined_at": m.joined_at}
            for m in project.members
        ],
        "tech_stack": [t.name for t in project.tech_stack],
        "open_roles": project.open_roles,
    }


@router.get("/my", response_model=list[ProjectOut])
def list_my_projects(
    status_filter: str | None = Query(default=None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Projects owned by or where the current user is a member."""
    q = db.query(Project).options(
        joinedload(Project.owner),
        joinedload(Project.members).joinedload(ProjectMember.user),
        joinedload(Project.tech_stack),
        joinedload(Project.open_roles),
    ).filter(Project.owner_id == current_user.id)
    if status_filter:
        q = q.filter(Project.status == status_filter)
    return [_project_out(p) for p in q.all()]


@router.get("/", response_model=list[ProjectOut])
def list_projects(
    career_path: str | None = Query(default=None),
    status_filter: str | None = Query(default=None, alias="status"),
    skip: int = 0,
    limit: int = Query(default=20, le=100),
    db: Session = Depends(get_db),
):
    q = db.query(Project).options(
        joinedload(Project.owner),
        joinedload(Project.members).joinedload(ProjectMember.user),
        joinedload(Project.tech_stack),
        joinedload(Project.open_roles),
    )
    if career_path:
        q = q.filter(Project.career_path == career_path)
    if status_filter:
        q = q.filter(Project.status == status_filter)
    projects = q.offset(skip).limit(limit).all()
    return [_project_out(p) for p in projects]


@router.post("/", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    body: ProjectCreateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = Project(
        title=body.title,
        description=body.description,
        career_path=body.career_path,
        team_size=body.team_size,
        owner_id=current_user.id,
    )
    db.add(project)
    db.flush()

    for tech in body.tech_stack:
        db.add(ProjectTech(project_id=project.id, name=tech))
    for role_name in body.open_roles:
        db.add(ProjectRole(project_id=project.id, role=role_name))

    # Owner is automatically a member
    db.add(ProjectMember(project_id=project.id, user_id=current_user.id, role="Owner"))
    db.commit()

    return _project_out(_load_project(db, project.id))


@router.get("/{project_id}", response_model=ProjectOut)
def get_project(project_id: int, db: Session = Depends(get_db)):
    return _project_out(_load_project(db, project_id))


@router.patch("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: int,
    body: ProjectUpdateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = _load_project(db, project_id)
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the owner can edit this project")
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(project, field, value)
    db.commit()
    return _project_out(_load_project(db, project_id))


@router.post("/{project_id}/apply", status_code=status.HTTP_201_CREATED)
def apply_to_project(
    project_id: int,
    body: ProjectApplyIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = _load_project(db, project_id)

    already_member = any(m.user_id == current_user.id for m in project.members)
    if already_member:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Already a member of this project")

    role = db.get(ProjectRole, body.role_id)
    if not role or role.project_id != project_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")
    if role.is_filled:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Role already filled")

    # Notify the project owner — application is pending until owner accepts
    db.add(
        Notification(
            user_id=project.owner_id,
            type=NotificationType.project_application,
            message=f"{current_user.full_name} applied for {role.role} in '{project.title}'",
            action_url=f"/projects/{project_id}?applicant_id={current_user.id}&role_id={role.id}",
        )
    )
    db.commit()
    return {"message": "Application submitted — waiting for owner approval"}


@router.post("/{project_id}/accept-application")
def accept_application(
    project_id: int,
    body: ProjectAcceptApplicationIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = _load_project(db, project_id)
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the owner can accept applications")

    applicant = db.get(User, body.user_id)
    if not applicant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    already_member = any(m.user_id == body.user_id for m in project.members)
    if already_member:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User is already a member")

    role = db.get(ProjectRole, body.role_id)
    if not role or role.project_id != project_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")
    if role.is_filled:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Role already filled")

    role.is_filled = True
    db.add(ProjectMember(project_id=project_id, user_id=body.user_id, role=role.role))

    db.add(Notification(
        user_id=body.user_id,
        type=NotificationType.project_accepted,
        message=f"You've been accepted into '{project.title}' as {role.role}!",
        action_url=f"/projects/{project_id}",
    ))
    db.commit()
    return {"message": f"{applicant.full_name} accepted into the project"}


@router.post("/{project_id}/accept-invite")
def accept_invite(
    project_id: int,
    body: ProjectAcceptInviteIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = _load_project(db, project_id)

    already_member = any(m.user_id == current_user.id for m in project.members)
    if already_member:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Already a member of this project")

    role = db.get(ProjectRole, body.role_id)
    if not role or role.project_id != project_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")
    if role.is_filled:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Role already filled")

    role.is_filled = True
    db.add(ProjectMember(project_id=project_id, user_id=current_user.id, role=role.role))

    # Mark any pending team_invitation notifications for this user+project as read
    db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.type == NotificationType.team_invitation,
        Notification.action_url.like(f"/projects/{project_id}%"),
        Notification.is_read == False,
    ).update({"is_read": True})

    db.add(Notification(
        user_id=project.owner_id,
        type=NotificationType.project_accepted,
        message=f"{current_user.full_name} accepted your invitation and joined '{project.title}' as {role.role}",
        action_url=f"/projects/{project_id}",
    ))
    db.commit()
    return {"message": "Joined project successfully"}


@router.post("/{project_id}/invite")
def invite_to_project(
    project_id: int,
    body: ProjectInviteIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = _load_project(db, project_id)

    if project.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the owner can invite members")

    invitee = db.query(User).filter(User.email == body.email).first()
    if not invitee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No account found with that email address")

    if invitee.id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot invite yourself")

    already_member = any(m.user_id == invitee.id for m in project.members)
    if already_member:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="This user is already a member of the project")

    role = db.get(ProjectRole, body.role_id)
    if not role or role.project_id != project_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")

    db.add(
        Notification(
            user_id=invitee.id,
            type=NotificationType.team_invitation,
            message=f"{current_user.full_name} invited you to join '{project.title}' as {role.role}",
            action_url=f"/projects/{project_id}?role_id={role.id}",
        )
    )
    db.commit()
    return {"message": f"Invitation sent to {invitee.full_name}"}


@router.post("/{project_id}/complete")
def complete_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = _load_project(db, project_id)
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the owner can complete this project")

    project.status = "completed"
    project.progress = 100

    # Award XP to all members and notify them
    XP_REWARD = 200
    for member in project.members:
        member.user.xp += XP_REWARD
        if member.user_id != current_user.id:
            db.add(
                Notification(
                    user_id=member.user_id,
                    type=NotificationType.project_completed,
                    message=f"Project '{project.title}' has been completed! +{XP_REWARD} XP",
                    action_url=f"/projects/{project_id}",
                )
            )
    db.commit()
    return {"message": "Project marked as completed", "xp_awarded": XP_REWARD}
