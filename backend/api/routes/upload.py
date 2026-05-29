from fastapi import APIRouter, UploadFile, File
import pandas as pd
import os

import services.data_store as data_store

router = APIRouter()

UPLOAD_DIR = "storage/uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/csv")
async def upload_csv(file: UploadFile = File(...)):

    try:

        file_path = os.path.join(
            UPLOAD_DIR,
            file.filename
        )

        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)

        # Safer CSV reading
        try:

            df = pd.read_csv(
                file_path,
                encoding="latin1"
            )

        except Exception:

            df = pd.read_csv(
                file_path,
                encoding="utf-8",
                on_bad_lines="skip"
            )

        data_store.current_dataframe = df

        preview = df.head(10).to_dict(
            orient="records"
        )

        return {
            "filename": file.filename,
            "columns": df.columns.tolist(),
            "preview": preview,
            "rows": len(df),
        }

    except Exception as e:

        return {
            "error": str(e)
        }