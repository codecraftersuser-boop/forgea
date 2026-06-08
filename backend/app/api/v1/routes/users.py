from fastapi import APIRouter

router = APIRouter()


@router.get("/me")
def get_me():
    # TODO: return current user profile
    return {"message": "current user"}


@router.patch("/me")
def update_me():
    # TODO: update user profile
    return {"message": "updated"}


@router.get("/{user_id}")
def get_user(user_id: int):
    # TODO: return public profile
    return {"user_id": user_id}


@router.get("/leaderboard")
def get_leaderboard():
    # TODO: return top users by XP
    return {"message": "leaderboard"}
