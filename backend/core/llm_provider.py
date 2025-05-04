from pathlib import Path
import sqlite3
from langchain_community.chat_models import ChatOpenAI
from core.config import settings

DB_PATH = Path("core/llm_config.db")

def get_llm(role: str = "store") -> ChatOpenAI:
    """
    Retrieve the active LLM for a given role ('manager' or 'store').

    Falls back to .env MODEL_NAME if not found in DB.
    """
    assert role in ("manager", "store"), "role must be 'manager' or 'store'"

    try:
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute(f"SELECT {role} FROM llm_settings LIMIT 1")
            row = cursor.fetchone()
            model_name = row[0] if row and row[0] else settings.model_name
    except Exception:
        model_name = settings.model_name

    return ChatOpenAI(
        model=model_name,
        api_key=settings.openai_api_key,
        temperature=0.3
    )
