"""merge heads after volunteer and play state migrations

Revision ID: f0a1b2c3d4e5
Revises: e5f6a7b8c9d0, e5f9a3b4c6d2
Create Date: 2026-08-02 12:00:00.000000

"""

from typing import Sequence, Union


revision: str = "f0a1b2c3d4e5"
down_revision: Union[str, Sequence[str], None] = ("e5f6a7b8c9d0", "e5f9a3b4c6d2")
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
