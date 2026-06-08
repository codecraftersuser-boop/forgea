from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def list_notifications():
    # TODO: return notifications for current user
    return {"message": "notifications"}


@router.patch("/{notification_id}/read")
def mark_read(notification_id: int):
    return {"message": "marked as read"}


@router.patch("/read-all")
def mark_all_read():
    return {"message": "all marked as read"}
