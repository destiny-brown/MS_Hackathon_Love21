from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILES = (BASE_DIR / ".env.local", BASE_DIR / ".env")


class Settings(BaseSettings):
    app_name: str = "hackkit"
    environment: str = "local"
    database_url: str = "sqlite:///./hackkit.db"
    secret_key: str = "change-this-before-deploying"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    anthropic_api_key: str | None = None
    youtube_api_key: str | None = None

    model_config = SettingsConfigDict(
        env_file=ENV_FILES,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
