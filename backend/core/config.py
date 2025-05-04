import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    openai_api_key: str
    model_name: str = "gpt-4o"   # fallback if not set in .env

    eodhd_api_key: Optional[str] = None
    serper_api_key: Optional[str] = None
    mistral_api_key: Optional[str] = None

    NOTION_API_KEY: str = ""
    NOTION_DATABASE_ID: str = ""

    # Local dev mode toggle
    local_mode: bool = True

    USER_WORKDIR: str = os.getenv(
        "USER_WORKDIR",
        os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "user_workdir"))
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        case_sensitive=False,  
    )

settings = Settings()

# Ensure workdir exists
os.makedirs(settings.USER_WORKDIR, exist_ok=True)
print(f"USER_WORKDIR set to: {settings.USER_WORKDIR}")
