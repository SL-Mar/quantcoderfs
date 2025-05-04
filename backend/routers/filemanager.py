# routers/filemanager.py

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os

from core.logger_config import setup_logger

router = APIRouter(
    prefix="/filemanager",
    tags=["File management"],
)

logger = setup_logger().getChild("filemanager")

# 🔧 Define user workspace
BASE_DIR = os.path.join(os.getcwd(), "user_workdir")
ALLOWED_FOLDERS = {"articles", "codes"}


class FilePayload(BaseModel):
    filename: str
    content: str


def validate_folder(folder: str):
    if folder not in ALLOWED_FOLDERS:
        raise HTTPException(status_code=400, detail=f"Invalid folder '{folder}'. Must be one of {ALLOWED_FOLDERS}.")


# 📃 List all files in a folder
@router.get("/")
def list_files(folder: str = Query(...)):
    validate_folder(folder)
    folder_path = os.path.join(BASE_DIR, folder)
    logger.info(f"[LIST] Listing files in folder: {folder_path}")

    if not os.path.exists(folder_path):
        return {"files": []}

    files = [
        f for f in os.listdir(folder_path)
        if os.path.isfile(os.path.join(folder_path, f))
    ]
    logger.info(f"[LIST] Found {len(files)} files in '{folder}'")
    return {"files": files}


# 📤 Stream a PDF from the 'articles' folder
@router.get("/pdf/{filename}")
def get_pdf(filename: str, folder: str = Query("articles")):
    validate_folder(folder)
    if folder != "articles":
        raise HTTPException(status_code=400, detail="PDFs can only be served from the 'articles' folder.")
    file_path = os.path.join(BASE_DIR, folder, filename)
    logger.info(f"[PDF] Serving PDF: {file_path}")

    if not os.path.exists(file_path):
        logger.warning(f"[PDF] File not found: {file_path}")
        raise HTTPException(status_code=404, detail="PDF not found")

    return FileResponse(file_path, media_type="application/pdf")


# 🔽 Load a text or code file (.txt from articles, .py from codes)
@router.get("/load/{filename}")
def load_file(filename: str, folder: str = Query(...)):
    validate_folder(folder)
    file_path = os.path.join(BASE_DIR, folder, filename)
    logger.info(f"[LOAD] Requested file: {file_path}")

    if not os.path.exists(file_path):
        logger.warning(f"[LOAD] File not found: {file_path}")
        raise HTTPException(status_code=404, detail="File not found")

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        logger.info(f"[LOAD] Loaded file: {filename}")
        return {"filename": filename, "content": content}
    except Exception:
        logger.error("[LOAD] Error reading file", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to read file")


@router.post("/save")
def save_file(
    payload: FilePayload,
    folder: str = Query(...),
    overwrite: bool = Query(False),
):
    validate_folder(folder)
    logger.info(f"[SAVE] Attempting to save '{payload.filename}' into '{folder}' (overwrite={overwrite})")

    # Define the base directory for user workspace
    folder_path = os.path.join(BASE_DIR, folder)
    os.makedirs(folder_path, exist_ok=True)

    # Manually set the project root path and calculate lean folder path
    project_root_path = "/home/slmar/projects"  # Directly define your project root path
    lean_folder_path = os.path.join(project_root_path, "lean", "Algorithm.Python")
    logger.info(f"[SAVE] Corrected lean folder path: {lean_folder_path}")  # Log the corrected lean folder path
    
    # Check if the lean folder exists and log the result
    if not os.path.exists(lean_folder_path):
        logger.info(f"[SAVE] Lean folder does not exist. Creating it now.")
        os.makedirs(lean_folder_path, exist_ok=True)

    # Double-check directory creation
    if not os.path.exists(lean_folder_path):
        logger.error(f"[SAVE] Failed to create lean folder path: {lean_folder_path}")
        raise HTTPException(status_code=500, detail="Failed to create lean folder path.")
    
    # Check if the lean folder is writable
    if not os.access(lean_folder_path, os.W_OK):
        logger.error(f"[SAVE] Lean folder is not writable: {lean_folder_path}")
        raise HTTPException(status_code=500, detail="Lean folder is not writable.")

    base, ext = os.path.splitext(payload.filename)
    file_path = os.path.join(folder_path, payload.filename)

    if not overwrite:
        counter = 1
        while os.path.exists(file_path):
            file_path = os.path.join(folder_path, f"{base}_{counter}{ext}")
            counter += 1
        logger.info(f"[SAVE] File exists, using new name: {os.path.basename(file_path)}")

    lean_file_path = os.path.join(lean_folder_path, payload.filename)

    try:
        # Save the file to user workspace folder
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(payload.content)
        logger.info(f"[SAVE] Successfully saved to {file_path}")

        # Save the file to the lean algorithm folder
        with open(lean_file_path, "w", encoding="utf-8") as f:
            f.write(payload.content)
        logger.info(f"[SAVE] Successfully saved to {lean_file_path}")

        return {"status": "saved", "paths": {"user_workdir": file_path, "lean_algorithm": lean_file_path}}
    except Exception as e:
        logger.error(f"[SAVE] Failed to save file: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Could not save file")


# 🗑️ Delete a file
@router.delete("/{filename}")
def delete_file(filename: str, folder: str = Query(...)):
    validate_folder(folder)
    file_path = os.path.join(BASE_DIR, folder, filename)
    logger.info(f"[DELETE] Requested file delete: {file_path}")

    if os.path.exists(file_path):
        os.remove(file_path)
        logger.info(f"[DELETE] File deleted: {file_path}")
        return {"status": "deleted"}

    logger.warning(f"[DELETE] File not found: {file_path}")
    raise HTTPException(status_code=404, detail="File not found")
