import sqlite3
from pathlib import Path
import os

DB_PATH = Path(__file__).parent / "llm_config.db"
DEFAULT_MANAGER = "gpt-4o"
DEFAULT_STORE = "gpt-3.5-turbo"

# === Ensure DB and table exist, insert defaults if empty ===
def init_llm_settings_db():
    create_table = """
        CREATE TABLE IF NOT EXISTS llm_settings (
            manager TEXT NOT NULL,
            store TEXT NOT NULL
        )
    """
    insert_default = """
        INSERT INTO llm_settings (manager, store)
        SELECT ?, ?
        WHERE NOT EXISTS (SELECT 1 FROM llm_settings)
    """

    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(create_table)
        conn.execute(insert_default, (DEFAULT_MANAGER, DEFAULT_STORE))
    print("✅ LLM settings DB initialized")

# === Fetch current active setting ===
def get_active_llm_setting() -> dict:
    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.cursor()
        cur.execute("SELECT manager, store FROM llm_settings LIMIT 1")
        row = cur.fetchone()
        if not row:
            raise ValueError("No LLM settings found")
        return {"manager": row[0], "store": row[1]}

# === Update manager or store ===
def set_active_llm(field: str, model_name: str):
    if field not in ("manager", "store"):
        raise ValueError("Field must be 'manager' or 'store'")

    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(f"""
            UPDATE llm_settings
            SET {field} = ?
        """, (model_name,))
    print(f"✅ Updated {field} to {model_name}")

# Run on import
init_llm_settings_db()
