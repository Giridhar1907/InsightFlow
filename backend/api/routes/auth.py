from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
import hashlib
import uuid
from datetime import datetime
from database.database import get_db_connection, execute_query

router = APIRouter()

class SignupRequest(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@router.post("/signup")
async def signup(request: SignupRequest):
    email = request.email.strip().lower()
    password = request.password
    
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")
        
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if user already exists
        execute_query(conn, cursor, "SELECT id FROM users WHERE email = ?", (email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email already registered")
            
        # Create user
        user_id = str(uuid.uuid4())
        pwd_hash = hash_password(password)
        execute_query(conn, cursor, """
        INSERT INTO users (id, email, password_hash, plan_tier, credits_used, credits_total, created_at)
        VALUES (?, ?, ?, 'free', 0, 20, ?)
        """, (user_id, email, pwd_hash, datetime.utcnow().isoformat()))
        
        conn.commit()
        
        return {
            "status": "success",
            "message": "User registered successfully",
            "token": f"token_{user_id}",
            "user": {
                "id": user_id,
                "email": email,
                "plan_tier": "free",
                "credits_used": 0,
                "credits_total": 20
            }
        }
    finally:
        cursor.close()
        conn.close()

@router.post("/login")
async def login(request: LoginRequest):
    email = request.email.strip().lower()
    password = request.password
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        pwd_hash = hash_password(password)
        # Using execute_query helper ensures compatibility with PostgreSQL and SQLite
        execute_query(conn, cursor, """
        SELECT id, email, plan_tier, credits_used, credits_total 
        FROM users 
        WHERE email = ? AND password_hash = ?
        """, (email, pwd_hash))
        
        user_row = cursor.fetchone()
        if not user_row:
            raise HTTPException(status_code=401, detail="Invalid email or password")
            
        # Standard index mapping works for both sqlite Row and psycopg Dict
        user_id = user_row[0] if isinstance(user_row, tuple) else user_row["id"]
        user_email = user_row[1] if isinstance(user_row, tuple) else user_row["email"]
        user_tier = user_row[2] if isinstance(user_row, tuple) else user_row["plan_tier"]
        user_used = user_row[3] if isinstance(user_row, tuple) else user_row["credits_used"]
        user_total = user_row[4] if isinstance(user_row, tuple) else user_row["credits_total"]
            
        return {
            "status": "success",
            "token": f"token_{user_id}",
            "user": {
                "id": user_id,
                "email": user_email,
                "plan_tier": user_tier,
                "credits_used": user_used,
                "credits_total": user_total
            }
        }
    finally:
        cursor.close()
        conn.close()

@router.get("/session")
async def get_session(authorization: str = Header(None)):
    user_id = "guest"
    
    if authorization and authorization.startswith("Bearer token_"):
        user_id = authorization.replace("Bearer token_", "").strip()
        
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        execute_query(conn, cursor, """
        SELECT id, email, plan_tier, credits_used, credits_total 
        FROM users 
        WHERE id = ?
        """, (user_id,))
        
        user_row = cursor.fetchone()
        if not user_row:
            # Fallback to guest context
            execute_query(conn, cursor, "SELECT id, email, plan_tier, credits_used, credits_total FROM users WHERE id = 'guest'")
            user_row = cursor.fetchone()
            
        # Adapt index mapping safely
        u_id = user_row[0] if isinstance(user_row, tuple) else user_row["id"]
        u_email = user_row[1] if isinstance(user_row, tuple) else user_row["email"]
        u_tier = user_row[2] if isinstance(user_row, tuple) else user_row["plan_tier"]
        u_used = user_row[3] if isinstance(user_row, tuple) else user_row["credits_used"]
        u_total = user_row[4] if isinstance(user_row, tuple) else user_row["credits_total"]
            
        return {
            "id": u_id,
            "email": u_email,
            "plan_tier": u_tier,
            "credits_used": u_used,
            "credits_total": u_total
        }
    finally:
        cursor.close()
        conn.close()
