import ast
import logging
import re
from typing import List, Dict, Any
from pydantic import BaseModel, Field
from crewai.tools import BaseTool

logger = logging.getLogger(__name__)


# -------------------------------
# INPUT SCHEMAS
# -------------------------------
class SummaryInput(BaseModel):
    sections: List[Dict[str, Any]] = Field(
        ..., description="List of structured sections extracted from the PDF"
    )


class CodeInput(BaseModel):
    summary: str = Field(
        ..., description="Structured trading strategy summary"
    )


class ValidationInput(BaseModel):
    code: str = Field(
        ..., description="Python code to validate"
    )


# -------------------------------
# TOOL IMPLEMENTATIONS
# -------------------------------
class SummaryTool(BaseTool):
    """Formats structured PDF sections into a Markdown string."""
    name: str = "SummaryTool"
    description: str = "Formats sections into a single markdown string for summary agents"
    args_schema: type = SummaryInput

    def _run(self, sections: List[Dict[str, Any]]) -> str:
        if not isinstance(sections, list):
            raise ValueError("SummaryTool expected a list of sections.")

        output = []
        for idx, section in enumerate(sections):
            if not isinstance(section, dict):
                logger.warning(f"Skipping invalid section at index {idx}: {section}")
                continue
            heading = section.get("heading", f"Section {idx + 1}")
            text = section.get("text", "")
            output.append(f"### {heading}\n{text}")
        return "\n\n".join(output)


class CodeGenerationTool(BaseTool):
    """Wraps a strategy summary in a code-generation prompt for QuantConnect."""
    name: str = "CodeGenerationTool"
    description: str = "Wraps structured summary in a code generation-ready prompt"
    args_schema: type = CodeInput

    def _run(self, summary: str) -> str:
        return f"""You are a QuantConnect algorithm developer. Convert the following trading strategy description into a complete, error-free QuantConnect Python algorithm.

### Trading Strategy Summary:
{summary}

### Requirements:
1. Set up `Initialize()` with date range, capital, universe, and indicators.
2. Implement `OnData()` logic as described.
3. Apply stop-loss, position sizing, or constraints.
4. Ensure the code is syntactically correct and Lean-compatible.
"""


class CodeValidationTool(BaseTool):
    """Validates Python code syntax using AST parsing."""
    name: str = "CodeValidationTool"
    description: str = "Validates Python code using AST"
    args_schema: type = ValidationInput

    def _run(self, code: str) -> str:
        try:
            ast.parse(code)
            return "ok"
        except SyntaxError as e:
            logger.error(f"Syntax error during AST validation: {e}")
            return f"SyntaxError: {e.msg} at line {e.lineno}, column {e.offset}"
        except Exception as e:
            logger.exception("Unexpected error during code validation")
            return f"Validation failed: {str(e)}"
