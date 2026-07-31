from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.db import get_db
from app.deps import get_current_user
from app.models.user import Role, User
from app.schemas.user import Token, UserCreate, UserLogin, UserRead

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

    token = create_access_token(str(user.id))
    return Token(access_token=token, user=UserRead.model_validate(user))


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)) -> Token:
    email = payload.email.lower().strip()
    user = db.scalar(select(User).where(User.email == email))
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token(str(user.id))
    return Token(access_token=token, user=UserRead.model_validate(user))


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)) -> User:
    return current_user
