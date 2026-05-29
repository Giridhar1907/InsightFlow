import os
import sqlite3

# Try importing psycopg2 for PostgreSQL (Supabase) support
try:
    import psycopg2
    import psycopg2.extras
    POSTGRES_AVAILABLE = True
except ImportError:
    POSTGRES_AVAILABLE = False

DB_PATH = "storage/insightflow.db"

def get_db_connection():
    """
    Returns a database connection. Switches dynamically to PostgreSQL (Supabase)
    if the DATABASE_URL environment variable is set, otherwise falls back to SQLite.
    """
    db_url = os.getenv("DATABASE_URL")
    
    if db_url and POSTGRES_AVAILABLE:
        # PostgreSQL / Supabase
        conn = psycopg2.connect(db_url)
        return conn
    else:
        # SQLite local fallback
        os.makedirs("storage", exist_ok=True)
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn

def execute_query(conn, cursor, query: str, params=()):
    """
    Helper to execute a SQL query. If the connection is PostgreSQL,
    it automatically replaces SQLite '?' placeholders with PostgreSQL '%s' placeholders
    to maintain 100% query compatibility across databases.
    """
    is_postgres = not isinstance(conn, sqlite3.Connection)
    
    if is_postgres:
        # Swap placeholder characters
        query = query.replace("?", "%s")
        
    cursor.execute(query, params)
    return cursor

def dict_from_row(conn, row):
    """
    Converts a database row to a standard Python dictionary,
    supporting both SQLite Rows and PostgreSQL RealDict objects.
    """
    if row is None:
        return None
    is_postgres = not isinstance(conn, sqlite3.Connection)
    if is_postgres:
        return dict(row)
    else:
        return dict(row)
