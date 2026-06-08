from datetime import datetime, date
from sqlalchemy import String, Integer, Float, DateTime, Date, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    institution: Mapped[str] = mapped_column(String(255))
    instructor: Mapped[str] = mapped_column(String(255))
    career_path: Mapped[str] = mapped_column(String(50))
    level: Mapped[str] = mapped_column(String(50))  # beginner, intermediate, advanced, professional
    price: Mapped[float] = mapped_column(Float, default=0.0)
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    review_count: Mapped[int] = mapped_column(Integer, default=0)
    duration_hours: Mapped[int] = mapped_column(Integer)
    prestige_score: Mapped[int] = mapped_column(Integer, default=50)
    external_url: Mapped[str] = mapped_column(String(500))
    thumbnail_url: Mapped[str | None] = mapped_column(String(500))
    last_updated: Mapped[date] = mapped_column(Date)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    enrollments: Mapped[list["UserCourse"]] = relationship(back_populates="course")


class UserCourse(Base):
    __tablename__ = "user_courses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"))
    progress: Mapped[int] = mapped_column(Integer, default=0)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime)
    enrolled_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship()
    course: Mapped["Course"] = relationship(back_populates="enrollments")
