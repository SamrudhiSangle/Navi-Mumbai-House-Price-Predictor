from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Navi Mumbai House Price Predictor"
    API_V1_STR: str = "/api/v1"
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "https://yourfrontend.vercel.app"]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
