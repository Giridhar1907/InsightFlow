from fastapi import APIRouter, UploadFile, File, Header, HTTPException
import pandas as pd
import os
import uuid
from datetime import datetime
import services.data_store as data_store
from database.database import get_db_connection, execute_query

router = APIRouter()
UPLOAD_BASE_DIR = "storage/uploads"

def get_user_id_from_header(authorization: str) -> str:
    if authorization and authorization.startswith("Bearer token_"):
        return authorization.replace("Bearer token_", "").strip()
    return "guest"

@router.get("/")
async def list_datasets(authorization: str = Header(None)):
    user_id = get_user_id_from_header(authorization)
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        execute_query(conn, cursor, """
        SELECT id, filename, row_count, column_count, uploaded_at 
        FROM datasets 
        WHERE user_id = ? 
        ORDER BY uploaded_at DESC
        """, (user_id,))
        
        raw_datasets = cursor.fetchall()
        datasets = []
        for row in raw_datasets:
            if isinstance(row, tuple):
                datasets.append({
                    "id": row[0],
                    "filename": row[1],
                    "row_count": row[2],
                    "column_count": row[3],
                    "uploaded_at": row[4]
                })
            else:
                datasets.append(dict(row))
                
        active_id = data_store.get_active_dataset_id(user_id)
        
        return {
            "datasets": datasets,
            "active_dataset_id": active_id
        }
    finally:
        cursor.close()
        conn.close()

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...), authorization: str = Header(None)):
    user_id = get_user_id_from_header(authorization)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check quota limits
        execute_query(conn, cursor, "SELECT plan_tier, credits_used, credits_total FROM users WHERE id = ?", (user_id,))
        user_row = cursor.fetchone()
        
        if user_row:
            plan = user_row[0] if isinstance(user_row, tuple) else user_row["plan_tier"]
            
            execute_query(conn, cursor, "SELECT COUNT(*) as file_count FROM datasets WHERE user_id = ?", (user_id,))
            count_row = cursor.fetchone()
            file_count = count_row[0] if isinstance(count_row, tuple) else count_row["file_count"]
            
            if plan == "free" and file_count >= 3:
                raise HTTPException(
                    status_code=400, 
                    detail="Free tier is limited to 3 datasets. Upgrade to Professional for unlimited storage."
                )
        
        # Save file locally
        user_upload_dir = os.path.join(UPLOAD_BASE_DIR, user_id)
        os.makedirs(user_upload_dir, exist_ok=True)
        
        dataset_id = str(uuid.uuid4())
        file_path = os.path.join(user_upload_dir, f"{dataset_id}_{file.filename}")
        
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
            
        # Parse CSV
        try:
            df = pd.read_csv(file_path, encoding="latin1")
        except Exception:
            try:
                df = pd.read_csv(file_path, encoding="utf-8", on_bad_lines="skip")
            except Exception as e:
                if os.path.exists(file_path):
                    os.remove(file_path)
                raise HTTPException(status_code=400, detail=f"Failed to read CSV: {str(e)}")
                
        row_count = len(df)
        col_count = len(df.columns)
        
        # Save metadata to DB
        execute_query(conn, cursor, """
        INSERT INTO datasets (id, user_id, filename, file_path, row_count, column_count, uploaded_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (dataset_id, user_id, file.filename, file_path, row_count, col_count, datetime.utcnow().isoformat()))
        
        conn.commit()
        
        # Set active dataframe in memory
        data_store.set_df(df, user_id, dataset_id)
        
        preview = df.head(10).to_dict(orient="records")
        
        return {
            "status": "success",
            "dataset": {
                "id": dataset_id,
                "filename": file.filename,
                "row_count": row_count,
                "column_count": col_count,
            },
            "columns": df.columns.tolist(),
            "preview": preview
        }
        
    finally:
        cursor.close()
        conn.close()

@router.post("/{dataset_id}/select")
async def select_dataset(dataset_id: str, authorization: str = Header(None)):
    user_id = get_user_id_from_header(authorization)
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        execute_query(conn, cursor, "SELECT file_path, filename FROM datasets WHERE id = ? AND user_id = ?", (dataset_id, user_id))
        row = cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Dataset not found")
            
        file_path = row[0] if isinstance(row, tuple) else row["file_path"]
        filename = row[1] if isinstance(row, tuple) else row["filename"]
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Physical dataset file was deleted")
            
        try:
            df = pd.read_csv(file_path, encoding="latin1")
        except Exception:
            df = pd.read_csv(file_path, encoding="utf-8", on_bad_lines="skip")
            
        data_store.set_df(df, user_id, dataset_id)
        
        return {
            "status": "success",
            "message": f"Selected dataset: {filename}",
            "dataset_id": dataset_id
        }
    finally:
        cursor.close()
        conn.close()

@router.delete("/{dataset_id}")
async def delete_dataset(dataset_id: str, authorization: str = Header(None)):
    user_id = get_user_id_from_header(authorization)
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        execute_query(conn, cursor, "SELECT file_path FROM datasets WHERE id = ? AND user_id = ?", (dataset_id, user_id))
        row = cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Dataset not found")
            
        file_path = row[0] if isinstance(row, tuple) else row["file_path"]
            
        # Delete DB record
        execute_query(conn, cursor, "DELETE FROM datasets WHERE id = ? AND user_id = ?", (dataset_id, user_id))
        conn.commit()
        
        # Delete physical file
        if os.path.exists(file_path):
            os.remove(file_path)
            
        # If deleted dataset was active, reset in memory
        if data_store.get_active_dataset_id(user_id) == dataset_id:
            data_store.set_df(None, user_id, None)
            
        return {
            "status": "success",
            "message": "Dataset deleted successfully"
        }
    finally:
        cursor.close()
        conn.close()
