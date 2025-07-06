import functools

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    AUTH0_DOMAIN: str
    AUTH0_API_AUDIENCE: str
    AUTH0_CLIENT_ID: str
    OPENAI_API_KEY: str
    DEEPSEEK_API_KEY: str
    PEXELS_API_KEY: str
    UNSPLASH_ACCESS_KEY: str

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


@functools.lru_cache()
def get_settings() -> Settings:
    # Pylance may report a false positive here because it doesn't understand
    # that Pydantic's BaseSettings populates fields from environment variables.
    # The # type: ignore comment is the idiomatic way to handle this.
    return Settings()  # type: ignore [call-arg]
