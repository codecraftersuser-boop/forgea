"""initial schema

Revision ID: 001
Revises:
Create Date: 2026-06-08
"""
from alembic import op
import sqlalchemy as sa

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("supabase_id", sa.String(255), unique=True, nullable=True),
        sa.Column("hashed_password", sa.String(255), nullable=True),
        sa.Column("email", sa.String(255), unique=True, nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("avatar_url", sa.String(500), nullable=True),
        sa.Column("bio", sa.Text, nullable=True),
        sa.Column("university", sa.String(255), nullable=True),
        sa.Column("github_url", sa.String(500), nullable=True),
        sa.Column("linkedin_url", sa.String(500), nullable=True),
        sa.Column("portfolio_url", sa.String(500), nullable=True),
        sa.Column("career_path", sa.String(50), nullable=True),
        sa.Column("level", sa.Integer, server_default="1", nullable=False),
        sa.Column("xp", sa.Integer, server_default="0", nullable=False),
        sa.Column("reputation_score", sa.Integer, server_default="0", nullable=False),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime, server_default=sa.func.now()),
    )
    op.create_index("ix_users_email", "users", ["email"])
    op.create_index("ix_users_supabase_id", "users", ["supabase_id"])

    op.create_table(
        "badges",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String(100), unique=True, nullable=False),
        sa.Column("description", sa.Text, nullable=False),
        sa.Column("icon", sa.String(100), nullable=False),
        sa.Column("xp_reward", sa.Integer, server_default="0"),
    )

    op.create_table(
        "user_badges",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("badge_id", sa.Integer, sa.ForeignKey("badges.id"), nullable=False),
        sa.Column("earned_at", sa.DateTime, server_default=sa.func.now()),
    )

    op.create_table(
        "user_skills",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("proficiency", sa.Float, server_default="0"),
        sa.Column("endorsement_count", sa.Integer, server_default="0"),
        sa.Column("validated", sa.Boolean, server_default="false"),
        sa.Column("updated_at", sa.DateTime, server_default=sa.func.now()),
    )

    op.create_table(
        "certifications",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("issuer", sa.String(255), nullable=False),
        sa.Column("issued_at", sa.DateTime, nullable=False),
        sa.Column("credential_url", sa.String(500), nullable=True),
    )

    op.create_table(
        "notifications",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("type", sa.String(50), nullable=False),
        sa.Column("message", sa.Text, nullable=False),
        sa.Column("is_read", sa.Boolean, server_default="false"),
        sa.Column("action_url", sa.String(500), nullable=True),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
    )

    op.create_table(
        "projects",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text, nullable=False),
        sa.Column("career_path", sa.String(50), nullable=False),
        sa.Column("status", sa.String(20), server_default="recruiting", nullable=False),
        sa.Column("progress", sa.Integer, server_default="0"),
        sa.Column("team_size", sa.Integer, server_default="4"),
        sa.Column("owner_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime, server_default=sa.func.now()),
    )

    op.create_table(
        "project_members",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("project_id", sa.Integer, sa.ForeignKey("projects.id"), nullable=False),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("role", sa.String(100), nullable=False),
        sa.Column("joined_at", sa.DateTime, server_default=sa.func.now()),
    )

    op.create_table(
        "project_tech",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("project_id", sa.Integer, sa.ForeignKey("projects.id"), nullable=False),
        sa.Column("name", sa.String(100), nullable=False),
    )

    op.create_table(
        "project_roles",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("project_id", sa.Integer, sa.ForeignKey("projects.id"), nullable=False),
        sa.Column("role", sa.String(100), nullable=False),
        sa.Column("is_filled", sa.Boolean, server_default="false"),
    )

    op.create_table(
        "courses",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("institution", sa.String(255), nullable=False),
        sa.Column("instructor", sa.String(255), nullable=False),
        sa.Column("career_path", sa.String(50), nullable=False),
        sa.Column("level", sa.String(50), nullable=False),
        sa.Column("price", sa.Float, server_default="0"),
        sa.Column("rating", sa.Float, server_default="0"),
        sa.Column("review_count", sa.Integer, server_default="0"),
        sa.Column("duration_hours", sa.Integer, nullable=False),
        sa.Column("prestige_score", sa.Integer, server_default="50"),
        sa.Column("external_url", sa.String(500), nullable=False),
        sa.Column("thumbnail_url", sa.String(500), nullable=True),
        sa.Column("last_updated", sa.Date, nullable=False),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
    )

    op.create_table(
        "user_courses",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("course_id", sa.Integer, sa.ForeignKey("courses.id"), nullable=False),
        sa.Column("progress", sa.Integer, server_default="0"),
        sa.Column("completed_at", sa.DateTime, nullable=True),
        sa.Column("enrolled_at", sa.DateTime, server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("user_courses")
    op.drop_table("courses")
    op.drop_table("project_roles")
    op.drop_table("project_tech")
    op.drop_table("project_members")
    op.drop_table("projects")
    op.drop_table("notifications")
    op.drop_table("certifications")
    op.drop_table("user_skills")
    op.drop_table("user_badges")
    op.drop_table("badges")
    op.drop_table("users")
