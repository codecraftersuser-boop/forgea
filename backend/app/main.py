from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.routes import auth, users, projects, courses, notifications

app = FastAPI(
    title="Forgea API",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(projects.router, prefix="/api/v1/projects", tags=["projects"])
app.include_router(courses.router, prefix="/api/v1/courses", tags=["courses"])
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["notifications"])


@app.get("/health")
def health_check():
    return {"status": "ok"}
