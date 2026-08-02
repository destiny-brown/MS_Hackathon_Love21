from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.user import Role


class UserCreate(BaseModel):
    email: str
    password: str = Field(min_length=8, max_length=128)
    role: Role = Role.SUPPORTER


class UserLogin(BaseModel):
    email: str
    password: str = Field(min_length=8, max_length=128)


class UserRead(BaseModel):
    id: int
    email: str
    role: Role
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserRead


class RefreshRequest(BaseModel):
    refresh_token: str


class LogoutRequest(BaseModel):
    refresh_token: str
