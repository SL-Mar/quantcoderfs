from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from core.llm_settings import get_active_llm_setting, set_active_llm
import logging
import sqlite3
from core.llm_settings import DB_PATH

router = APIRouter(prefix="/settings", tags=["LLMLoader"])
logger = logging.getLogger("llmloader")

# === Pydantic models ===

class LLMSetting(BaseModel):
    manager: str
    store: str

class UpdateLLMRequest(BaseModel):
    field: str  # "manager" or "store"
    model_name: str

# === Endpoints ===

@router.get("/llm", response_model=LLMSetting)
def get_llm_settings():
    """
    Get the current active LLM setting (manager + store)
    """
    try:
        setting = get_active_llm_setting()
        logger.info("✅ Retrieved active LLM setting")
        return setting
    except Exception as e:
        logger.exception("❌ Failed to retrieve LLM setting")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/llm", response_model=LLMSetting)
def update_llm_setting(request: UpdateLLMRequest):
    """
    Update either the 'manager' or 'store' field in the current LLM config
    """
    try:
        if request.field not in ("manager", "store"):
            raise ValueError("Field must be 'manager' or 'store'")
        set_active_llm(request.field, request.model_name)
        setting = get_active_llm_setting()
        logger.info(f"✅ Updated {request.field} to {request.model_name}")
        return setting
    except Exception as e:
        logger.exception("❌ Failed to update LLM setting")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/llm/models", response_model=List[str])
def list_supported_models():
    """
    Return the list of allowed LLM model names
    """
    models = ["gpt-4.1", "o1", "gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"]
    logger.info("📋 Listed supported LLM models")
    return models


@router.get("/llm/active", response_model=LLMSetting)
def get_active_llm():
    """
    Get the current active LLM setting — simplified route used by frontend badge
    """
    try:
        return get_active_llm_setting()
    except Exception as e:
        logger.exception("❌ Failed to retrieve active LLM setting")
        raise HTTPException(status_code=500, detail=str(e))
