from datetime import datetime
from sqlalchemy import String, Integer, Text, DateTime, Enum, ForeignKey, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from app.core.database import Base


class ProjectStatus(str, enum.Enum):
    recruiting = "recruiting"
    in_progress = "in_progress"
    completed = "completed"


class RoleType(str, enum.Enum):
    frontend = "Frontend Developer"
    backend = "Backend Developer"
    mobile = "Mobile Developer"
    data_analyst = "Data Analyst"
    data_engineer = "Data Engineer"
    data_scientist = "Data Scientist"
    ux_designer = "UI/UX Designer"


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    career_path: Mapped[str] = mapped_column(String(50))
    status: Mapped[str] = mapped_column(String(20), default="recruiting")
    progress: Mapped[int] = mapped_column(Integer, default=0)
    team_size: Mapped[int] = mapped_column(Integer, default=4)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner: Mapped["User"] = relationship(foreign_keys=[owner_id])
    members: Mapped[list["ProjectMember"]] = relationship(back_populates="project", cascade="all, delete-orphan")
    tech_stack: Mapped[list["ProjectTech"]] = relationship(back_populates="project", cascade="all, delete-orphan")
    open_roles: Mapped[list["ProjectRole"]] = relationship(back_populates="project", cascade="all, delete-orphan")


class ProjectMember(Base):
    __tablename__ = "project_members"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    role: Mapped[str] = mapped_column(String(100))
    joined_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    project: Mapped["Project"] = relationship(back_populates="members")
    user: Mapped["User"] = relationship(back_populates="projects")


class ProjectTech(Base):
    __tablename__ = "project_tech"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    name: Mapped[str] = mapped_column(String(100))

    project: Mapped["Project"] = relationship(back_populates="tech_stack")


class ProjectRole(Base):
    __tablename__ = "project_roles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    role: Mapped[str] = mapped_column(String(100))
    is_filled: Mapped[bool] = mapped_column(default=False)

    project: Mapped["Project"] = relationship(back_populates="open_roles")
