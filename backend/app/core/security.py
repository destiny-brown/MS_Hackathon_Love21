from __future__ import annotations

import secrets
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ACCESS_TOKEN_TYPE = "access"
REFRESH_TOKEN_TYPE = "refresh"


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def verify_password_with_rehash(plain_password: str, hashed_password: str) -> tuple[bool, str | None]:
    """Verify a password and return an updated hash when passlib marks the hash as outdated."""
    verified = pwd_context.verify(plain_password, hashed_password)
    if not verified:
        return False, None
    if pwd_context.needs_update(hashed_password):
        return True, pwd_context.hash(plain_password)
    return True, None


def _encode_token(payload: dict[str, object]) -> str:
    settings = get_settings()
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def create_access_token(subject: str, *, role: str | None = None, expires_delta: timedelta | None = None) -> str:
    settings = get_settings()
    now = datetime.now(timezone.utc)
    expire = now + (expires_delta or timedelta(minutes=settings.access_token_expire_minutes))
    payload: dict[str, object] = {
        "sub": subject,
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
        "typ": ACCESS_TOKEN_TYPE,
    }
    if role:
        payload["role"] = role
    return _encode_token(payload)


def create_refresh_token(subject: str, expires_delta: timedelta | None = None) -> tuple[str, str]:
    settings = get_settings()
    now = datetime.now(timezone.utc)
    expire = now + (expires_delta or timedelta(days=settings.refresh_token_expire_days))
    jti = secrets.token_urlsafe(32)
    payload = {
        "sub": subject,
        "jti": jti,
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
        "typ": REFRESH_TOKEN_TYPE,
    }
    return _encode_token(payload), jti


def decode_access_token(token: str) -> str | None:
    payload = _decode_token(token, expected_type=ACCESS_TOKEN_TYPE)
    if payload is None:
        return None
    subject = payload.get("sub")
    return subject if isinstance(subject, str) else None


def decode_refresh_token(token: str) -> dict[str, str] | None:
    payload = _decode_token(token, expected_type=REFRESH_TOKEN_TYPE)
    if payload is None:
        return None
    subject = payload.get("sub")
    jti = payload.get("jti")
    if not isinstance(subject, str) or not isinstance(jti, str):
        return None
    return {"sub": subject, "jti": jti}


def _decode_token(token: str, *, expected_type: str) -> dict | None:
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError:
        return None
    if payload.get("typ") != expected_type:
        return None
    return payload
