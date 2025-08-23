from pydantic import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./app.db"
    API_V1_STR: str = "/api/v1"
    JWT_SECRET: str = "your_jwt_secret"
    JWT_EXPIRATION: int = 60  # in minutes

    class Config:
        env_file = ".env"

settings = Settings()