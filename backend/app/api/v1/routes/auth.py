from fastapi import APIRouter

router = APIRouter()


@router.post("/login")
def login():
    # TODO: implement Supabase auth
    return {"message": "login"}


@router.post("/register")
def register():
    # TODO: implement Supabase auth
    return {"message": "register"}


@router.post("/logout")
def logout():
    return {"message": "logout"}
