"""add learn content tables

Revision ID: d4e8a2b3c5f1
Revises: c3f9d2a1e4b7
Create Date: 2026-08-01 17:50:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "d4e8a2b3c5f1"
down_revision: Union[str, None] = "c3f9d2a1e4b7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "learn_questions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("external_id", sa.String(length=40), nullable=True),
        sa.Column("kind", sa.String(length=20), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("statement", sa.Text(), nullable=False),
        sa.Column("answer", sa.String(length=40), nullable=False),
        sa.Column("explanation", sa.Text(), nullable=False),
        sa.Column("hint", sa.Text(), nullable=True),
        sa.Column("topic", sa.String(length=120), nullable=True),
        sa.Column("question_type", sa.String(length=30), nullable=True),
        sa.Column("options_json", sa.JSON(), nullable=True),
        sa.Column("image_url", sa.String(length=500), nullable=True),
        sa.Column("image_credit", sa.String(length=200), nullable=True),
        sa.Column("source", sa.String(length=200), nullable=True),
        sa.Column("related_story_slugs", sa.JSON(), nullable=False),
        sa.Column("audience", sa.String(length=30), nullable=False),
        sa.Column("display_order", sa.Integer(), nullable=False),
        sa.Column("trail_location_id", sa.String(length=40), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_learn_questions_external_id"), "learn_questions", ["external_id"], unique=False)
    op.create_index(op.f("ix_learn_questions_id"), "learn_questions", ["id"], unique=False)
    op.create_index(op.f("ix_learn_questions_kind"), "learn_questions", ["kind"], unique=False)
    op.create_index(op.f("ix_learn_questions_status"), "learn_questions", ["status"], unique=False)

    op.create_table(
        "learn_resources",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("title", sa.String(length=300), nullable=False),
        sa.Column("date_label", sa.String(length=40), nullable=False),
        sa.Column("cover_image_url", sa.String(length=500), nullable=False),
        sa.Column("source_url", sa.String(length=500), nullable=False),
        sa.Column("source_label", sa.String(length=200), nullable=False),
        sa.Column("topics", sa.JSON(), nullable=False),
        sa.Column("learning_hook", sa.Text(), nullable=False),
        sa.Column("audience", sa.String(length=30), nullable=False),
        sa.Column("resource_type", sa.String(length=30), nullable=False),
        sa.Column("origin", sa.String(length=20), nullable=False),
        sa.Column("show_on_learn", sa.Boolean(), nullable=False),
        sa.Column("show_on_stories", sa.Boolean(), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("display_order", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_learn_resources_id"), "learn_resources", ["id"], unique=False)
    op.create_index(op.f("ix_learn_resources_slug"), "learn_resources", ["slug"], unique=True)
    op.create_index(op.f("ix_learn_resources_status"), "learn_resources", ["status"], unique=False)

    op.create_table(
        "learn_videos",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("video_id", sa.String(length=40), nullable=False),
        sa.Column("title", sa.String(length=300), nullable=False),
        sa.Column("channel_title", sa.String(length=200), nullable=False),
        sa.Column("published_at", sa.String(length=40), nullable=False),
        sa.Column("thumbnail_url", sa.String(length=500), nullable=True),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("display_order", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_learn_videos_id"), "learn_videos", ["id"], unique=False)
    op.create_index(op.f("ix_learn_videos_status"), "learn_videos", ["status"], unique=False)
    op.create_index(op.f("ix_learn_videos_video_id"), "learn_videos", ["video_id"], unique=True)


def downgrade() -> None:
    op.drop_index(op.f("ix_learn_videos_video_id"), table_name="learn_videos")
    op.drop_index(op.f("ix_learn_videos_status"), table_name="learn_videos")
    op.drop_index(op.f("ix_learn_videos_id"), table_name="learn_videos")
    op.drop_table("learn_videos")
    op.drop_index(op.f("ix_learn_resources_status"), table_name="learn_resources")
    op.drop_index(op.f("ix_learn_resources_slug"), table_name="learn_resources")
    op.drop_index(op.f("ix_learn_resources_id"), table_name="learn_resources")
    op.drop_table("learn_resources")
    op.drop_index(op.f("ix_learn_questions_status"), table_name="learn_questions")
    op.drop_index(op.f("ix_learn_questions_kind"), table_name="learn_questions")
    op.drop_index(op.f("ix_learn_questions_id"), table_name="learn_questions")
    op.drop_index(op.f("ix_learn_questions_external_id"), table_name="learn_questions")
    op.drop_table("learn_questions")
