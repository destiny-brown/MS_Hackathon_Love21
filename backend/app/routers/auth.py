from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password_with_rehash
from app.db import get_db
from app.deps import get_current_user
from app.models.user import Role, User
from app.schemas.user import LogoutRequest, RefreshRequest, Token, UserCreate, UserLogin, UserRead
from app.services.refresh_tokens import issue_token_pair, revoke_refresh_token, rotate_refresh_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)) -> Token:
    email = payload.email.lower().strip()
    if payload.role not in {Role.SUPPORTER, Role.MEMBER}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only supporter and member accounts can self-register")
    existing = db.scalar(select(User).where(User.email == email))
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = User(email=email, hashed_password=hash_password(payload.password), role=payload.role)
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token, refresh_token = issue_token_pair(db, user)
    return Token(access_token=access_token, refresh_token=refresh_token, user=UserRead.model_validate(user))


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)) -> Token:
    email = payload.email.lower().strip()
    user = db.scalar(select(User).where(User.email == email))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    verified, updated_hash = verify_password_with_rehash(payload.password, user.hashed_password)
    if not verified:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    if updated_hash is not None:
        user.hashed_password = updated_hash
        db.commit()

    access_token, refresh_token = issue_token_pair(db, user)
    return Token(access_token=access_token, refresh_token=refresh_token, user=UserRead.model_validate(user))


@router.post("/refresh", response_model=Token)
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)) -> Token:
    rotated = rotate_refresh_token(db, payload.refresh_token)
    if rotated is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token, refresh_token, user = rotated
    return Token(access_token=access_token, refresh_token=refresh_token, user=UserRead.model_validate(user))


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(payload: LogoutRequest, db: Session = Depends(get_db)) -> None:
    revoke_refresh_token(db, payload.refresh_token)


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)) -> User:
    return current_user
