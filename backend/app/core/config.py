from functools import lru_cache
from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILES = (BASE_DIR / ".env.local", BASE_DIR / ".env")


class Settings(BaseSettings):
    app_name: str = "hackkit"
    environment: str = "local"
    database_url: str = "sqlite:///./hackkit.db"
    secret_key: str = "change-this-before-deploying"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_days: int = 7
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    site_url: str = "http://localhost:3000"
    resend_api_key: str | None = None
    newsletter_from_email: str = "Love 21 Foundation <newsletter@love21foundation.com>"
    bootstrap_admin_email: str | None = None
    bootstrap_admin_password: str | None = None
    demo_users_enabled: bool = True
    model_enabled: bool = False
    model_base_url: str | None = None
    model_api_key: str | None = None
    model_name: str = "qwen3-8b"
    model_timeout_seconds: int = 45
    model_enhance_timeout_seconds: int = 12

    model_config = SettingsConfigDict(
        env_file=ENV_FILES,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @field_validator("database_url", mode="before")
    @classmethod
    def use_psycopg_driver(cls, value: object) -> object:
        if isinstance(value, str) and value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+psycopg://", 1)
        if isinstance(value, str) and value.startswith("postgres://"):
            return value.replace("postgres://", "postgresql+psycopg://", 1)
        return value

    @property
    def cors_origin_list(self) -> list[str]:
        origins: list[str] = []
        for origin in self.cors_origins.split(","):
            cleaned = origin.strip().rstrip("/")
            if cleaned and cleaned not in origins:
                origins.append(cleaned)
        site_url = self.site_url.strip().rstrip("/")
        if site_url and site_url not in origins:
            origins.append(site_url)
        return origins


@lru_cache
def get_settings() -> Settings:
    return Settings()
