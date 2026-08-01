from alembic import command
from alembic.config import Config
from alembic.runtime.migration import MigrationContext
from sqlalchemy import inspect

import app.models  # noqa: F401
from app.db import Base, engine


def run() -> None:
    config = Config("alembic.ini")
    existing_tables = set(inspect(engine).get_table_names())
    application_tables = set(Base.metadata.tables)
    with engine.connect() as connection:
        current_revision = MigrationContext.configure(connection).get_current_revision()

    if current_revision is None and existing_tables & application_tables:
        missing_tables = application_tables - existing_tables
        if missing_tables:
            missing = ", ".join(sorted(missing_tables))
            raise RuntimeError(f"Cannot stamp a partial legacy schema; missing tables: {missing}")
        command.stamp(config, "head")

    command.upgrade(config, "head")


if __name__ == "__main__":
    run()