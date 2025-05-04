# models/code_models.py

from pydantic import BaseModel, Field

from typing import Optional, Dict, Any



class SummaryResponse(BaseModel):
    """
    Output model for document summarization.
    """
    filename: str = Field(..., description="Name of the source document")
    summary: str = Field(..., description="Extracted summary text")


class CodeQuery(BaseModel):
    """
    Input model for code generation.
    Accepts a user prompt and optionally a pre-generated summary to inform the code generation.
    """
    user_prompt: str = Field(..., description="Natural language prompt describing the code to generate")
    summary: Optional[SummaryResponse] = Field(
        None, description="Optional SummaryResponse from a PDF or other document"
    )

class GeneratedCode(BaseModel):
    code: str
    filename: Optional[str] = None
    language: Optional[str] = "python"
    backtest: Optional[Dict[str, Any]] = None  # ✅ Fix: add key/value types

