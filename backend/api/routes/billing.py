from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
import uuid
from datetime import datetime
from database.database import get_db_connection, execute_query

router = APIRouter()

class UpgradeRequest(BaseModel):
    plan_tier: str # 'pro' or 'enterprise'

class APIKeyGenerateRequest(BaseModel):
    name: str

def get_user_id_from_header(authorization: str) -> str:
    if authorization and authorization.startswith("Bearer token_"):
        return authorization.replace("Bearer token_", "").strip()
    return "guest"

@router.get("/usage")
async def get_usage(authorization: str = Header(None)):
    user_id = get_user_id_from_header(authorization)
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        execute_query(conn, cursor, "SELECT plan_tier, credits_used, credits_total FROM users WHERE id = ?", (user_id,))
        user_row = cursor.fetchone()
        
        if not user_row:
            raise HTTPException(status_code=404, detail="User not found")
            
        execute_query(conn, cursor, "SELECT COUNT(*) as file_count, SUM(row_count) as total_rows FROM datasets WHERE user_id = ?", (user_id,))
        file_row = cursor.fetchone()
        
        # Parse fields
        p_tier = user_row[0] if isinstance(user_row, tuple) else user_row["plan_tier"]
        c_used = user_row[1] if isinstance(user_row, tuple) else user_row["credits_used"]
        c_total = user_row[2] if isinstance(user_row, tuple) else user_row["credits_total"]
        
        file_count = file_row[0] if isinstance(file_row, tuple) else (file_row["file_count"] if file_row else 0)
        total_rows = file_row[1] if isinstance(file_row, tuple) else (file_row["total_rows"] if file_row and file_row["total_rows"] else 0)
        
        if file_count is None: file_count = 0
        if total_rows is None: total_rows = 0
        
        return {
            "plan_tier": p_tier,
            "credits_used": c_used,
            "credits_total": c_total,
            "file_count": file_count,
            "total_rows": total_rows,
            "max_files": 3 if p_tier == "free" else (15 if p_tier == "pro" else 999)
        }
    finally:
        cursor.close()
        conn.close()

@router.post("/upgrade")
async def upgrade_plan(request: UpgradeRequest, authorization: str = Header(None)):
    user_id = get_user_id_from_header(authorization)
    plan_tier = request.plan_tier.lower()
    
    if plan_tier not in ["free", "pro", "enterprise"]:
        raise HTTPException(status_code=400, detail="Invalid plan tier")
        
    conn = get_db_connection()
    cursor = conn.cursor()
    
    credits_total = 20
    if plan_tier == "pro":
        credits_total = 150
    elif plan_tier == "enterprise":
        credits_total = 1000
        
    try:
        execute_query(conn, cursor, """
        UPDATE users 
        SET plan_tier = ?, credits_total = ?, credits_used = 0 
        WHERE id = ?
        """, (plan_tier, credits_total, user_id))
        
        conn.commit()
        
        return {
            "status": "success",
            "message": f"Successfully upgraded to {plan_tier.capitalize()} Plan!",
            "plan_tier": plan_tier,
            "credits_total": credits_total,
            "credits_used": 0
        }
    finally:
        cursor.close()
        conn.close()

@router.get("/api-keys")
async def list_api_keys(authorization: str = Header(None)):
    user_id = get_user_id_from_header(authorization)
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        execute_query(conn, cursor, "SELECT id, key_value, created_at FROM api_keys WHERE user_id = ?", (user_id,))
        raw_keys = cursor.fetchall()
        
        keys = []
        for row in raw_keys:
            if isinstance(row, tuple):
                keys.append({
                    "id": row[0],
                    "key_value": row[1],
                    "created_at": row[2]
                })
            else:
                keys.append(dict(row))
                
        return {"api_keys": keys}
    finally:
        cursor.close()
        conn.close()

@router.post("/api-keys/generate")
async def generate_api_key(authorization: str = Header(None)):
    user_id = get_user_id_from_header(authorization)
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Enforce API keys only for Pro/Enterprise tier users
        execute_query(conn, cursor, "SELECT plan_tier FROM users WHERE id = ?", (user_id,))
        user_row = cursor.fetchone()
        
        plan = user_row[0] if isinstance(user_row, tuple) else user_row["plan_tier"]
        
        if not user_row or plan == "free":
            raise HTTPException(
                status_code=403, 
                detail="Developer API Keys are only available on Professional or Enterprise plans."
            )
            
        key_id = str(uuid.uuid4())
        key_val = f"if_live_{uuid.uuid4().hex[:24]}"
        
        execute_query(conn, cursor, """
        INSERT INTO api_keys (id, user_id, key_value, created_at)
        VALUES (?, ?, ?, ?)
        """, (key_id, user_id, key_val, datetime.utcnow().isoformat()))
        
        conn.commit()
        
        return {
            "status": "success",
            "api_key": {
                "id": key_id,
                "key_value": key_val,
                "created_at": datetime.utcnow().isoformat()
            }
        }
    finally:
        cursor.close()
        conn.close()

@router.delete("/api-keys/{key_id}")
async def delete_api_key(key_id: str, authorization: str = Header(None)):
    user_id = get_user_id_from_header(authorization)
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        execute_query(conn, cursor, "DELETE FROM api_keys WHERE id = ? AND user_id = ?", (key_id, user_id))
        conn.commit()
        return {"status": "success", "message": "API Key revoked successfully"}
    finally:
        cursor.close()
        conn.close()

@router.post("/bypass")
async def toggle_bypass(authorization: str = Header(None)):
    user_id = get_user_id_from_header(authorization)
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        execute_query(conn, cursor, "SELECT plan_tier FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="User not found")
            
        current_tier = row[0] if isinstance(row, tuple) else row["plan_tier"]
        new_tier = "enterprise" if current_tier == "free" or current_tier == "pro" else "free"
        new_credits = 1000 if new_tier == "enterprise" else 20
        
        execute_query(conn, cursor, """
        UPDATE users 
        SET plan_tier = ?, credits_total = ?, credits_used = 0 
        WHERE id = ?
        """, (new_tier, new_credits, user_id))
        
        conn.commit()
        
        return {
            "status": "success",
            "plan_tier": new_tier,
            "credits_total": new_credits,
            "credits_used": 0
        }
    finally:
        cursor.close()
        conn.close()
