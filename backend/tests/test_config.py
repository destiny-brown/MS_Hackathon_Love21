from app.core.config import Settings


def test_render_postgres_url_uses_psycopg_driver() -> None:
    settings = Settings(database_url="postgresql://user:pass@localhost/love21")

    assert settings.database_url == "postgresql+psycopg://user:pass@localhost/love21"


def test_legacy_postgres_url_uses_psycopg_driver() -> None:
    settings = Settings(database_url="postgres://user:pass@localhost/love21")

    assert settings.database_url == "postgresql+psycopg://user:pass@localhost/love21"


def test_explicit_database_driver_is_preserved() -> None:
    database_url = "postgresql+psycopg://user:pass@localhost/love21"

    assert Settings(database_url=database_url).database_url == database_url


def test_hosted_model_is_disabled_without_explicit_configuration() -> None:
    settings = Settings(_env_file=None)

    assert settings.model_enabled is False
    assert settings.model_base_url is None
    assert settings.model_api_key is None
    assert settings.model_name == "qwen3-8b"