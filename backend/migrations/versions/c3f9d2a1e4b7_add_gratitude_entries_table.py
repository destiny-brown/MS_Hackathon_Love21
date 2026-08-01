"""add gratitude entries table

Revision ID: c3f9d2a1e4b7
Revises: b1d4e8f29c70
Create Date: 2026-08-01 14:45:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c3f9d2a1e4b7"
down_revision: Union[str, None] = "b1d4e8f29c70"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "gratitude_entries",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("author_id", sa.Integer(), nullable=False),
        sa.Column("display_name", sa.String(length=120), nullable=True),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("photo_url", sa.String(length=500), nullable=True),
        sa.Column(
            "status",
            sa.Enum("pending", "approved", "rejected", name="gratitudeentrystatus"),
            nullable=False,
        ),
        sa.Column("submitted_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("moderated_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("moderator_id", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(["author_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["moderator_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_gratitude_entries_author_id"), "gratitude_entries", ["author_id"], unique=False)
    op.create_index(op.f("ix_gratitude_entries_id"), "gratitude_entries", ["id"], unique=False)
    op.create_index(op.f("ix_gratitude_entries_status"), "gratitude_entries", ["status"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_gratitude_entries_status"), table_name="gratitude_entries")
    op.drop_index(op.f("ix_gratitude_entries_id"), table_name="gratitude_entries")
    op.drop_index(op.f("ix_gratitude_entries_author_id"), table_name="gratitude_entries")
    op.drop_table("gratitude_entries")
