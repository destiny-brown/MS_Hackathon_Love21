from sqlalchemy import create_engine, text
from sqlalchemy import select
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
            registration_columns = {
                row[1]
                for row in connection.execute(text("PRAGMA table_info(volunteer_activity_registrations)"))
            }
            if registration_columns and "activity_slug" not in registration_columns:
                connection.execute(text("ALTER TABLE volunteer_activity_registrations ADD COLUMN activity_slug VARCHAR(120)"))
                connection.execute(
                    text(
                        """
                        UPDATE volunteer_activity_registrations
                        SET activity_slug = (
                            SELECT slug FROM volunteer_activities
                            WHERE volunteer_activities.id = volunteer_activity_registrations.activity_id
                        )
                        WHERE activity_slug IS NULL
                        """
                    )
                )
            if registration_columns and "activity_name" not in registration_columns:
                connection.execute(text("ALTER TABLE volunteer_activity_registrations ADD COLUMN activity_name VARCHAR(200)"))
                connection.execute(
                    text(
                        """
                        UPDATE volunteer_activity_registrations
                        SET activity_name = (
                            SELECT title FROM volunteer_activities
                            WHERE volunteer_activities.id = volunteer_activity_registrations.activity_id
                        )
                        WHERE activity_name IS NULL
                        """
                    )
                )
            connection.execute(
                text("UPDATE users SET role = :supporter WHERE role IN ('user', 'donor', 'volunteer', '') OR role IS NULL"),
                {"supporter": "supporter"},
            )


def ensure_role_enum_compatibility() -> None:
    if not settings.database_url.startswith("postgresql"):
        return

    # Some existing databases still have the legacy role enum without 'supporter'.
    # Add it safely, then normalize old role values.
    with engine.connect() as connection:
        connection = connection.execution_options(isolation_level="AUTOCOMMIT")
        connection.execute(
            text(
                """
                DO $$
                BEGIN
                    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
                        ALTER TYPE role ADD VALUE IF NOT EXISTS 'supporter';
                    END IF;
                END
                $$;
                """
            )
        )

    with engine.begin() as connection:
        # Cast to text so PostgreSQL accepts the comparison after the enum
        # was narrowed to supporter/member/admin (donor/volunteer are invalid literals).
        connection.execute(
            text("UPDATE users SET role = 'supporter' WHERE role::text IN ('donor', 'volunteer')")
        )


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


DEMO_USERS = [
    ("admin@love21.demo", "admin"),
    ("member@love21.demo", "member"),
    ("supporter@love21.demo", "supporter"),
]
DEMO_PASSWORD = "demo1234"


def ensure_demo_users() -> None:
    if not settings.demo_users_enabled:
        return

    from app.core.security import hash_password
    from app.models.user import Role, User

    with SessionLocal() as db:
        for email, role_value in DEMO_USERS:
            role = Role(role_value)
            user = db.scalar(select(User).where(User.email == email))
            if user is None:
                db.add(User(email=email, hashed_password=hash_password(DEMO_PASSWORD), role=role))
            else:
                user.role = role
                user.hashed_password = hash_password(DEMO_PASSWORD)
        db.commit()


def ensure_bootstrap_admin() -> None:
    email = (settings.bootstrap_admin_email or "").strip().lower()
    password = settings.bootstrap_admin_password or ""
    if not email or not password:
        return

    from app.core.security import hash_password
    from app.models.user import Role, User

    with SessionLocal() as db:
        existing = db.scalar(select(User).where(User.email == email))
        if existing is None:
            db.add(User(email=email, hashed_password=hash_password(password), role=Role.ADMIN))
        else:
            existing.role = Role.ADMIN
            existing.hashed_password = hash_password(password)
        db.commit()
