#!/usr/bin/env bash
# launch-qcfs.sh – Start Full QuantCoder FS Stack (on 3003 / 8003)
# ──────────────────────────────────────────────────────────────

# Base project setup
BASE="$HOME/projects"
ROOT="$BASE/quantcoderfs"
VSCODE_BIN="/usr/share/code/code"
FRONTEND_DIR="$ROOT/frontend"
BACKEND_DIR="$ROOT/backend"

# ──────────────────────────────────────────────────────────────

# 0) Open VS Code
[[ -x "$VSCODE_BIN" ]] && "$VSCODE_BIN" -n "$ROOT" &

# 1) Start Frontend (Next.js) on :3003
gnome-terminal \
  --title="Frontend" \
  -- bash -ic "\
    cd \"$FRONTEND_DIR\" && \
    npm install && \
    PORT=3003 npm run dev || (echo '❌ Frontend crashed. Press Enter to exit.'; read)"

# 2) Start Backend (FastAPI) on :8003
gnome-terminal \
  --title="Backend" \
  -- bash -ic "\
    cd \"$BACKEND_DIR\" && \
    if [ ! -d venv ]; then python3 -m venv venv; fi && \
    source venv/bin/activate && \
    pip install -r \"$ROOT/requirements.linux.txt\" && \
    uvicorn main:app --reload --port 8003 || (echo '❌ Backend crashed. Press Enter to exit.'; read)"

# 3) Open in browser
( sleep 2 && xdg-open http://localhost:3003 ) &
( sleep 2 && xdg-open http://localhost:8003/docs ) &

