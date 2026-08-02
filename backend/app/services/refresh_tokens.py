from __future__ import annotations

from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import create_access_token, create_refresh_token, decode_refresh_token
from app.models.refresh_token import RefreshTokenRecord
from app.models.user import User


def issue_token_pair(db: Session, user: User) -> tuple[str, str]:
    settings = get_settings()
    access_token = create_access_token(str(user.id), role=user.role.value)
    refresh_token, jti = create_refresh_token(str(user.id))
    record = RefreshTokenRecord(
        jti=jti,
        user_id=user.id,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days),
    )
    db.add(record)
    db.commit()
    return access_token, refresh_token


def rotate_refresh_token(db: Session, refresh_token: str) -> tuple[str, str, User] | None:
    claims = decode_refresh_token(refresh_token)
    if claims is None:
        return None

    record = db.scalar(
        select(RefreshTokenRecord).where(
            RefreshTokenRecord.jti == claims["jti"],
            RefreshTokenRecord.revoked_at.is_(None),
        )
    )
    if record is None or record.expires_at <= datetime.now(timezone.utc):
        return None

    user = db.get(User, record.user_id)
    if user is None or str(user.id) != claims["sub"]:
        return None

    record.revoked_at = datetime.now(timezone.utc)
    access_token, new_refresh_token = issue_token_pair(db, user)
    return access_token, new_refresh_token, user


def revoke_refresh_token(db: Session, refresh_token: str) -> bool:
    claims = decode_refresh_token(refresh_token)
    if claims is None:
        return False

    record = db.scalar(
        select(RefreshTokenRecord).where(
            RefreshTokenRecord.jti == claims["jti"],
            RefreshTokenRecord.revoked_at.is_(None),
        )
    )
    if record is None:
        return False

    record.revoked_at = datetime.now(timezone.utc)
    db.commit()
    return True
