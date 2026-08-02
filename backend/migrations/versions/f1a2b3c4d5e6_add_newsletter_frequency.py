"""add newsletter subscriber frequency and delivery cadence

Revision ID: f1a2b3c4d5e6
Revises: f0a1b2c3d4e5
Create Date: 2026-08-02 08:45:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "f1a2b3c4d5e6"
down_revision: Union[str, None] = "f0a1b2c3d4e5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("newsletter_subscribers") as batch_op:
        batch_op.add_column(
            sa.Column("frequency", sa.String(length=20), server_default="monthly", nullable=False)
        )
        batch_op.create_index(batch_op.f("ix_newsletter_subscribers_frequency"), ["frequency"], unique=False)

    with op.batch_alter_table("newsletter_deliveries") as batch_op:
        batch_op.add_column(sa.Column("cadence", sa.String(length=20), nullable=True))
        batch_op.add_column(sa.Column("recipient_groups", sa.String(length=120), nullable=True))


def downgrade() -> None:
    with op.batch_alter_table("newsletter_deliveries") as batch_op:
        batch_op.drop_column("recipient_groups")
        batch_op.drop_column("cadence")

    with op.batch_alter_table("newsletter_subscribers") as batch_op:
        batch_op.drop_index(batch_op.f("ix_newsletter_subscribers_frequency"))
        batch_op.drop_column("frequency")
