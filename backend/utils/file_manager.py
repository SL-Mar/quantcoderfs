import os
from fastapi import UploadFile
from core.config import settings

USER_WORKDIR = settings.USER_WORKDIR


def ensure_folder_exists(folder_path: str):
    os.makedirs(folder_path, exist_ok=True)


#async def save_uploaded_file(file: UploadFile, folder_path: str) -> str:
 #   ensure_folder_exists(folder_path)
  #  file_path = os.path.join(folder_path, file.filename)

   # contents = await file.read()  # ✅ Fix corruption
    #with open(file_path, "wb") as f:
     #   f.write(contents)

    #return file_path

def save_file(path: str, content: str):
    """
    Save plain text (e.g., summary or code) to disk.
    """
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def load_file(path: str) -> str:
    """
    Load a plain text file.
    """
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def delete_file(path: str):
    """
    Delete a file if it exists.
    """
    if os.path.exists(path):
        os.remove(path)


def list_files(folder_path: str) -> list[str]:
    """
    List all files in a given folder.
    """
    if not os.path.exists(folder_path):
        return []

    return [
        f for f in os.listdir(folder_path)
        if os.path.isfile(os.path.join(folder_path, f))
    ]
