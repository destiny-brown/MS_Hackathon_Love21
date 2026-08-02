"""add volunteer activity registrations

Revision ID: e5f6a7b8c9d0
Revises: d4e8a2b3c5f1
Create Date: 2026-08-02 00:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "e5f6a7b8c9d0"
down_revision: Union[str, None] = "d4e8a2b3c5f1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "volunteer_activity_registrations",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("activity_id", sa.Integer(), nullable=False),
        sa.Column("activity_slug", sa.String(length=120), nullable=False),
        sa.Column("activity_name", sa.String(length=200), nullable=False),
        sa.Column("status", sa.String(length=30), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["activity_id"], ["volunteer_activities.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", "activity_id", name="uq_user_volunteer_activity_registration"),
    )
    op.create_index(op.f("ix_volunteer_activity_registrations_activity_id"), "volunteer_activity_registrations", ["activity_id"], unique=False)
    op.create_index(op.f("ix_volunteer_activity_registrations_id"), "volunteer_activity_registrations", ["id"], unique=False)
    op.create_index(op.f("ix_volunteer_activity_registrations_user_id"), "volunteer_activity_registrations", ["user_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_volunteer_activity_registrations_user_id"), table_name="volunteer_activity_registrations")
    op.drop_index(op.f("ix_volunteer_activity_registrations_id"), table_name="volunteer_activity_registrations")
    op.drop_index(op.f("ix_volunteer_activity_registrations_activity_id"), table_name="volunteer_activity_registrations")
    op.drop_table("volunteer_activity_registrations")
