# routers/backtester.py

import os
import sys
import subprocess
from shutil import which
from fastapi import APIRouter, HTTPException, BackgroundTasks
from core.logger_config import setup_logger

router = APIRouter(
    prefix="/backtester",
    tags=["Backtesting"],
)

logger = setup_logger().getChild("backtester")

LEAN_FOLDER = "/home/slmar/projects/lean/Algorithm.Python"

def _run_backtest(cmd: list[str], env: dict[str, str], latest: str):
    """Background task: run Lean backtest and log results."""
    try:
        proc = subprocess.run(
            cmd,
            check=True,
            capture_output=True,
            text=True,
            env=env,
            timeout=3600,  # adjust if your backtest needs more time
        )
        logger.info(f"[BACKTESTER] {latest} finished. stdout:\n{proc.stdout}")
        if proc.stderr:
            logger.warning(f"[BACKTESTER] {latest} stderr:\n{proc.stderr}")
    except subprocess.TimeoutExpired:
        logger.error(f"[BACKTESTER] {latest} timed out")
    except subprocess.CalledProcessError as e:
        logger.error(f"[BACKTESTER] {latest} failed:\n{e.stderr}")

def get_latest_py() -> str | None:
    """Return the newest .py file in LEAN_FOLDER, or None if empty."""
    try:
        py_files = [f for f in os.listdir(LEAN_FOLDER) if f.endswith(".py")]
        if not py_files:
            return None
        return max(py_files, key=lambda fn: os.path.getmtime(os.path.join(LEAN_FOLDER, fn)))
    except Exception as ex:
        logger.error(f"[BACKTESTER] Couldn’t list files: {ex}")
        raise HTTPException(500, "Error reading lean algorithm folder")

@router.post("/trigger-backtest")
def trigger_backtest(background_tasks: BackgroundTasks):
    """
    Start a Lean backtest of the newest .py in the Algorithm.Python folder,
    then return immediately. The actual work happens in the background.
    """
    latest = get_latest_py()
    if not latest:
        raise HTTPException(404, "No .py file found to backtest")

    script = os.path.join(LEAN_FOLDER, latest)

    # Locate the lean CLI in your venv or on PATH
    venv_bin = os.path.dirname(sys.executable)
    lean_cli = which("lean") or os.path.join(venv_bin, "lean")
    if not os.path.isfile(lean_cli):
        lean_cli = os.path.join(venv_bin, "lean")

    # Prepare env so it sees your venv first
    env = os.environ.copy()
    env["PATH"] = venv_bin + os.pathsep + env.get("PATH", "")

    cmd = [lean_cli, "backtest", script]
    logger.info(f"[BACKTESTER] Scheduling background task: {' '.join(cmd)}")
    background_tasks.add_task(_run_backtest, cmd, env, latest)

    return {"status": "backtest started", "file": latest}
