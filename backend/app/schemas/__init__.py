from __future__ import annotations
from datetime import datetime, date
from typing import Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict, model_validator


# ── Auth ─────────────────────────────────────────────────────────────────────

class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str = Field(min_length=1)


class ForgotPasswordIn(BaseModel):
    email: EmailStr


class ResetPasswordIn(BaseModel):
    token: str
    password: str = Field(min_length=8)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── Skills / Certifications / Badges ─────────────────────────────────────────

class UserSkillOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    proficiency: float
    endorsement_count: int
    validated: bool


class CertificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    issuer: str
    issued_at: datetime
    credential_url: str | None = None


class BadgeOut(BaseModel):
    """Flattened from UserBadge + Badge. Works with both plain dicts and UserBadge ORM objects."""
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    description: str
    icon: str
    earned_at: datetime

    @model_validator(mode="before")
    @classmethod
    def flatten_user_badge(cls, data: Any) -> Any:
        """If this looks like a UserBadge ORM object (has .badge), flatten it."""
        if hasattr(data, "badge") and data.badge is not None:
            b = data.badge
            return {
                "id": b.id,
                "name": b.name,
                "description": b.description,
                "icon": b.icon,
                "earned_at": data.earned_at,
            }
        return data


# ── User ──────────────────────────────────────────────────────────────────────

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: str
    full_name: str
    avatar_url: str | None = None
    bio: str | None = None
    university: str | None = None
    career_path: str | None = None
    level: int
    xp: int
    reputation_score: int
    github_url: str | None = None
    linkedin_url: str | None = None
    portfolio_url: str | None = None
    skills: list[UserSkillOut] = []
    certifications: list[CertificationOut] = []
    badges: list[BadgeOut] = []


class UserPublicOut(BaseModel):
    """Slim public profile — no email."""
    model_config = ConfigDict(from_attributes=True)
    id: int
    full_name: str
    avatar_url: str | None = None
    bio: str | None = None
    university: str | None = None
    career_path: str | None = None
    level: int
    xp: int
    reputation_score: int
    github_url: str | None = None
    linkedin_url: str | None = None
    portfolio_url: str | None = None
    skills: list[UserSkillOut] = []
    certifications: list[CertificationOut] = []
    badges: list[BadgeOut] = []


class UserLeaderboardItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    full_name: str
    avatar_url: str | None = None
    career_path: str | None = None
    level: int
    xp: int
    reputation_score: int


class UserUpdateIn(BaseModel):
    full_name: str | None = None
    bio: str | None = None
    university: str | None = None
    career_path: str | None = None
    github_url: str | None = None
    linkedin_url: str | None = None
    portfolio_url: str | None = None
    avatar_url: str | None = None


# ── Projects ──────────────────────────────────────────────────────────────────

class ProjectRoleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    role: str
    is_filled: bool


class ProjectMemberOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    user: UserPublicOut
    role: str
    joined_at: datetime


class ProjectOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str
    career_path: str
    status: str
    progress: int
    team_size: int
    owner: UserPublicOut
    members: list[ProjectMemberOut] = []
    tech_stack: list[str] = []
    open_roles: list[ProjectRoleOut] = []


class ProjectCreateIn(BaseModel):
    title: str = Field(min_length=3)
    description: str = Field(min_length=10)
    career_path: str
    team_size: int = Field(default=4, ge=2, le=20)
    tech_stack: list[str] = []
    open_roles: list[str] = []


class ProjectUpdateIn(BaseModel):
    title: str | None = None
    description: str | None = None
    career_path: str | None = None
    status: str | None = None
    progress: int | None = Field(default=None, ge=0, le=100)
    team_size: int | None = Field(default=None, ge=2, le=20)


class ProjectApplyIn(BaseModel):
    role_id: int


class ProjectInviteIn(BaseModel):
    email: EmailStr
    role_id: int


class ProjectAcceptApplicationIn(BaseModel):
    user_id: int
    role_id: int


class ProjectAcceptInviteIn(BaseModel):
    role_id: int


# ── Courses ───────────────────────────────────────────────────────────────────

class CourseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    institution: str
    instructor: str
    career_path: str
    level: str
    price: float
    rating: float
    review_count: int
    duration_hours: int
    prestige_score: int
    external_url: str
    thumbnail_url: str | None = None
    last_updated: date
    tags: list[str] = []
    progress: int | None = None
    completed_at: datetime | None = None


class CourseProgressIn(BaseModel):
    progress: int = Field(ge=0, le=100)


# ── Notifications ─────────────────────────────────────────────────────────────

class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    type: str
    message: str
    is_read: bool
    action_url: str | None = None
    created_at: datetime
