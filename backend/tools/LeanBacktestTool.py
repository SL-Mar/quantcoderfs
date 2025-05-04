# tools/LeanBacktestTool.py

import os
import subprocess
import sys
from typing import Type
from pydantic import BaseModel

from crewai.tools import BaseTool

LEAN_FOLDER = "/home/slmar/projects/lean/Algorithm.Python"

class LeanBacktestInput(BaseModel):
    file_path: str

class LeanBacktestTool(BaseTool):
    name: str = "lean_backtest"
    description: str = "Run `lean backtest <file>` inside the project venv and return stdout/stderr."
    args_schema: Type[BaseModel] = LeanBacktestInput

    def _run(self, file_path: str) -> str:
        script = os.path.abspath(file_path)
        if not os.path.exists(script):
            return f"Error: file not found: {script}"

        venv_bin = os.path.dirname(sys.executable)
        lean = os.path.join(venv_bin, "lean")
        if not os.path.isfile(lean):
            return f"Error: lean CLI not found in {venv_bin}"

        env = os.environ.copy()
        env["PATH"] = venv_bin + os.pathsep + env.get("PATH", "")

        try:
            result = subprocess.run(
                [lean, "backtest", script],
                check=True,
                capture_output=True,
                text=True,
                env=env,
                timeout=60,
            )
            return result.stdout + "\n\n" + (result.stderr or "")
        except subprocess.CalledProcessError as e:
            return f"Backtest failed (exit {e.returncode}):\n{e.stderr}"
        except Exception as ex:
            return f"Unexpected error during backtest: {str(ex)}"
