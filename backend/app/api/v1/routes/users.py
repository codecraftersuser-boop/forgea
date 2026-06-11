from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.gamification import UserBadge
from app.models.user import User
from app.schemas import UserLeaderboardItem, UserOut, UserPublicOut, UserUpdateIn

router = APIRouter()


def _load_user(db: Session, user_id: int) -> User:
    user = (
        db.query(User)
        .options(
            joinedload(User.skills),
            joinedload(User.certifications),
            joinedload(User.badges).joinedload(UserBadge.badge),
        )
        .filter(User.id == user_id)
        .first()
    )
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


def _badges_out(user: User):
    """Flatten UserBadge → BadgeOut shape expected by the schema."""
    result = []
    for ub in user.badges:
        b = ub.badge
        result.append(
            {
                "id": b.id,
                "name": b.name,
                "description": b.description,
                "icon": b.icon,
                "earned_at": ub.earned_at,
            }
        )
    return result


# /leaderboard must come before /{user_id} to avoid routing conflicts
@router.get("/leaderboard", response_model=list[UserLeaderboardItem])
def get_leaderboard(limit: int = 20, db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.xp.desc()).limit(min(limit, 100)).all()
    return users


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user = _load_user(db, current_user.id)
    return user


@router.patch("/me", response_model=UserOut)
def update_me(
    body: UserUpdateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(current_user, field, value)
    db.commit()
    return _load_user(db, current_user.id)


@router.get("/{user_id}", response_model=UserPublicOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    return _load_user(db, user_id)
