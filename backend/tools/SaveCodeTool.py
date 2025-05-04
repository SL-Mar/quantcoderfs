# tools/SaveCodeTool.py

import os
from typing import Type
from pydantic import BaseModel

from crewai.tools import BaseTool

LEAN_FOLDER = "/home/slmar/projects/lean/Algorithm.Python"

class SaveCodeInput(BaseModel):
    filename: str
    code: str

class SaveCodeTool(BaseTool):
    name: str = "save_code"
    description: str = "Save the code string to the QuantConnect Lean Algorithm.Python folder."
    args_schema: Type[BaseModel] = SaveCodeInput

    def _run(self, filename: str, code: str) -> str:
        try:
            os.makedirs(LEAN_FOLDER, exist_ok=True)
            full_path = os.path.join(LEAN_FOLDER, filename)
            with open(full_path, "w", encoding="utf-8") as f:
                f.write(code)
            return os.path.abspath(full_path)
        except Exception as ex:
            return f"Error saving file: {str(ex)}"
