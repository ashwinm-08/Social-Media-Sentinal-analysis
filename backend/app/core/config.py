from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Social Media Sentiment Intelligence"
    DATABASE_URL: str = "sqlite:///./sentiment.db"
    SECRET_KEY: str = "supersecretkey_for_dev_change_in_production_jwt_token_key_12345"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    MODEL_PROVIDER: str = "mock"  # "mock" or "hf"
    MODEL_DIR: str = "./saved_models/sentiment_model"
    ENVIRONMENT: str = "development"

    model_config = {
        "env_file": ".env",
        "extra": "ignore"
    }


settings = Settings()
