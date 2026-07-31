from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.user import Role


class UserCreate(BaseModel):
    email: str
    password: str
    role: Role = Role.DONOR


class UserLogin(BaseModel):
    email: str
    password: str


class UserRead(BaseModel):
    id: int
    email: str
    role: Role
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead
