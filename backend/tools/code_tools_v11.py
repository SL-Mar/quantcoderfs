import re
import ast
import logging
from typing import List, Dict, Any
from crewai.tools import BaseTool
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

# -------------------------------
# INPUT SCHEMAS
# -------------------------------
class SummaryInput(BaseModel):
    sections: List[Dict[str, Any]] = Field(..., description="List of structured sections extracted from the PDF")

class CodeInput(BaseModel):
    summary: str = Field(..., description="Structured trading strategy summary")

class ValidationInput(BaseModel):
    code: str = Field(..., description="Python code to validate")

# -------------------------------
# TOOL IMPLEMENTATIONS
# -------------------------------
class SummaryTool(BaseTool):
    name: str = "SummaryTool"
    description: str = "Formats sections into a single markdown string for summary agents"
    args_schema: type = SummaryInput

    def _run(self, sections: List[Dict[str, Any]]) -> str:
        return "\n".join([f"### {s['heading']}\n{s['text']}" for s in sections])

class CodeGenerationTool(BaseTool):
    name: str = "CodeGenerationTool"
    description: str = "Wraps structured summary in a code generation-ready prompt"
    args_schema: type = CodeInput

    def _run(self, summary: str) -> str:
        return f"""
You are a QuantConnect algorithm developer. Convert the following trading strategy description into a complete, error-free QuantConnect Python algorithm.

### Trading Strategy Summary:
{summary}

### Requirements:
1. Set up `Initialize` with date range, capital, universe, and indicators.
2. Implement `OnData` logic as described.
3. Apply stop-loss, position sizing, or constraints.
4. Ensure code is syntactically correct and Lean-compatible.
"""

class CodeValidationTool(BaseTool):
    name: str = "CodeValidationTool"
    description: str = "Validates Python code using AST"
    args_schema: type = ValidationInput

    def _run(self, code: str) -> str:
        try:
            ast.parse(code)
            return "ok"
        except SyntaxError as e:
            return f"SyntaxError: {e}"
        except Exception as e:
            return f"Validation failed: {e}"
