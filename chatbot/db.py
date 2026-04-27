import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASS", ""),
        database=os.getenv("DB_NAME", "ecommerce_db")
    )

def execute_sql(sql: str) -> list[dict]:
    conn = get_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute(sql)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [{k: str(v) if v is not None else None for k, v in row.items()} for row in rows]

def get_schema() -> str:
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SHOW TABLES")
    tables = [r[0] for r in cur.fetchall()]
    parts = []
    for t in tables:
        cur.execute(f"SHOW CREATE TABLE `{t}`")
        row = cur.fetchone()
        parts.append(row[1])
    cur.close()
    conn.close()
    return "\n\n".join(parts)