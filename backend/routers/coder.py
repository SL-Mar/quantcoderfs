# routers/coder.py

import os
import asyncio
from fastapi import APIRouter, HTTPException, UploadFile, File
from core.config import settings
from core.logger_config import setup_logger
from flows.code import CodingFlow
from models.code_models import GeneratedCode

router = APIRouter(
    prefix="/coder",
    tags=["Unified Extract+Code"],
)

logger = setup_logger().getChild("coder")

@router.post("/process", response_model=GeneratedCode)
async def process_pdf_and_generate_code(
    file: UploadFile = File(..., description="PDF to convert into trading algorithm")
):
    """
    Upload a PDF, run the unified Extract+Code Crew flow, and return the generated code.
    """
    # 1️⃣ Save the uploaded PDF
    downloads_dir = os.path.join(settings.USER_WORKDIR, "downloads")
    os.makedirs(downloads_dir, exist_ok=True)
    pdf_path = os.path.join(downloads_dir, file.filename)
    try:
        content = await file.read()
        with open(pdf_path, "wb") as f:
            f.write(content)
        logger.info(f"[CODER] Saved PDF to {pdf_path}")
    except Exception as e:
        logger.error(f"[CODER] Failed saving PDF: {e}")
        raise HTTPException(status_code=500, detail="Could not save uploaded PDF.")

    # 2️⃣ Execute unified Extract+Code flow
    flow = CodingFlow()
    flow.inputs = {"pdf_path": pdf_path}

    try:
        result: GeneratedCode = await asyncio.to_thread(flow.kickoff)
        logger.info(f"[CODER] Generated code file: {result.filename}")
    except Exception as e:
        logger.exception("[CODER] Flow execution failed")
        raise HTTPException(status_code=500, detail=str(e))

    return result
