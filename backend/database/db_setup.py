import os
import sqlite3
import sys
from datetime import datetime

try:
    from database.database import get_db_connection, execute_query
except ModuleNotFoundError:
    from database import get_db_connection, execute_query

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    is_postgres = not isinstance(conn, sqlite3.Connection)
    
    # In PostgreSQL, we can use TEXT or VARCHAR, both work perfectly
    # Create Tables
    
    # 1. Users table
    execute_query(conn, cursor, """
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        plan_tier TEXT NOT NULL DEFAULT 'free',
        credits_used INTEGER NOT NULL DEFAULT 0,
        credits_total INTEGER NOT NULL DEFAULT 20,
        created_at TEXT NOT NULL
    )
    """)
    
    # 2. Datasets table
    execute_query(conn, cursor, """
    CREATE TABLE IF NOT EXISTS datasets (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        filename TEXT NOT NULL,
        file_path TEXT NOT NULL,
        row_count INTEGER NOT NULL DEFAULT 0,
        column_count INTEGER NOT NULL DEFAULT 0,
        uploaded_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    """)
    
    # 3. Query history table
    execute_query(conn, cursor, """
    CREATE TABLE IF NOT EXISTS query_history (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        dataset_id TEXT,
        question TEXT NOT NULL,
        result_summary TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (dataset_id) REFERENCES datasets (id)
    )
    """)

    # 4. API keys table
    execute_query(conn, cursor, """
    CREATE TABLE IF NOT EXISTS api_keys (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        key_value TEXT UNIQUE NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    """)
    
    # Insert a default guest user for backwards compatibility
    # In Postgres, RealDictCursor is used if psycopg2.extras is configured,
    # but standard cursor works for standard tuple lookup. We'll query safely.
    execute_query(conn, cursor, "SELECT id FROM users WHERE id = ?", ("guest",))
    if not cursor.fetchone():
        execute_query(conn, cursor, """
        INSERT INTO users (id, email, password_hash, plan_tier, credits_used, credits_total, created_at)
        VALUES ('guest', 'guest@insightflow.ai', 'guestpass_hash', 'free', 5, 20, ?)
        """, (datetime.utcnow().isoformat(),))
    
    conn.commit()
    cursor.close()
    conn.close()

if __name__ == "__main__":
    init_db()
    db_type = "PostgreSQL (Supabase)" if os.getenv("DATABASE_URL") else "SQLite (Local)"
    print(f"Database schemas successfully checked and initialized on {db_type}!")
