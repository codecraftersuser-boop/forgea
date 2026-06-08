from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_ENV: str = "development"
    SECRET_KEY: str = "change-me"
    DATABASE_URL: str
    ALLOWED_ORIGINS: list[str] = ["http://localhost:5173"]

    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_KEY: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
