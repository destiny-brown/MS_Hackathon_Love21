"""add user play state and captain greeting cache

Revision ID: e5f9a3b4c6d2
Revises: d4e8a2b3c5f1
Create Date: 2026-08-01 20:25:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "e5f9a3b4c6d2"
down_revision: Union[str, None] = "d4e8a2b3c5f1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "user_play_states",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("day_number", sa.Integer(), nullable=False),
        sa.Column("event_index", sa.Integer(), nullable=False),
        sa.Column("correct_count", sa.Integer(), nullable=False),
        sa.Column("total_answered", sa.Integer(), nullable=False),
        sa.Column("current_streak", sa.Integer(), nullable=False),
        sa.Column("best_streak", sa.Integer(), nullable=False),
        sa.Column("total_plays", sa.Integer(), nullable=False),
        sa.Column("last_played_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_user_play_states_id"), "user_play_states", ["id"], unique=False)
    op.create_index(op.f("ix_user_play_states_user_id"), "user_play_states", ["user_id"], unique=True)

    op.create_table(
        "captain_greeting_cache",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("greeting_date", sa.Date(), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("ai_enhanced", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", "greeting_date", name="uq_captain_greeting_user_date"),
    )
    op.create_index(op.f("ix_captain_greeting_cache_id"), "captain_greeting_cache", ["id"], unique=False)
    op.create_index(op.f("ix_captain_greeting_cache_user_id"), "captain_greeting_cache", ["user_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_captain_greeting_cache_user_id"), table_name="captain_greeting_cache")
    op.drop_index(op.f("ix_captain_greeting_cache_id"), table_name="captain_greeting_cache")
    op.drop_table("captain_greeting_cache")
    op.drop_index(op.f("ix_user_play_states_user_id"), table_name="user_play_states")
    op.drop_index(op.f("ix_user_play_states_id"), table_name="user_play_states")
    op.drop_table("user_play_states")
