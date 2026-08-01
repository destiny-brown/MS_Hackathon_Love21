from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import get_settings

settings = get_settings()
connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}

engine = create_engine(settings.database_url, connect_args=connect_args, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


class Base(DeclarativeBase):
    pass


def create_db_and_tables() -> None:
    # Import models so SQLAlchemy registers them before create_all.
    import app.models  # noqa: F401

    Base.metadata.create_all(bind=engine)
    if settings.database_url.startswith("sqlite"):
        with engine.begin() as connection:
            support_columns = {
                row[1]
                for row in connection.execute(text("PRAGMA table_info(support_opportunities)"))
            }
            if "image_url" not in support_columns:
                connection.execute(text("ALTER TABLE support_opportunities ADD COLUMN image_url VARCHAR(500)"))
            connection.execute(
                text("UPDATE users SET role = :supporter WHERE role IN ('user', 'donor', 'volunteer', '') OR role IS NULL"),
                {"supporter": "supporter"},
            )


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
