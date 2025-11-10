import sqlite3
from datetime import datetime
import json
from typing import Optional, List, Dict, Any

DATABASE_PATH = "faculty_hub.db"

def init_db():
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS faculty (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            designation TEXT,
            department TEXT,
            office_location TEXT,
            email TEXT,
            google_scholar_url TEXT,
            linkedin_url TEXT,
            profile_picture_url TEXT,
            headline TEXT,
            experience TEXT,
            certifications TEXT,
            projects TEXT,
            publications TEXT,
            last_updated DATETIME
        )
    """)
    
    conn.commit()
    conn.close()

def get_db_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def create_faculty(data: Dict[str, Any]) -> int:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO faculty (
            name, designation, department, office_location, email,
            google_scholar_url, linkedin_url, profile_picture_url,
            headline, experience, certifications, projects,
            publications, last_updated
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.get('name'),
        data.get('designation'),
        data.get('department'),
        data.get('office_location'),
        data.get('email'),
        data.get('google_scholar_url'),
        data.get('linkedin_url'),
        data.get('profile_picture_url'),
        data.get('headline'),
        json.dumps(data.get('experience', [])),
        json.dumps(data.get('certifications', [])),
        json.dumps(data.get('projects', [])),
        json.dumps(data.get('publications', [])),
        data.get('last_updated', datetime.now().isoformat())
    ))
    
    faculty_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return faculty_id

def get_faculty(faculty_id: int) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM faculty WHERE id = ?", (faculty_id,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return dict(row)
    return None

def get_all_faculty() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM faculty ORDER BY name")
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]

def update_faculty(faculty_id: int, data: Dict[str, Any]) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        UPDATE faculty SET
            name = ?, designation = ?, department = ?, office_location = ?,
            email = ?, google_scholar_url = ?, linkedin_url = ?,
            profile_picture_url = ?, headline = ?, experience = ?,
            certifications = ?, projects = ?, publications = ?,
            last_updated = ?
        WHERE id = ?
    """, (
        data.get('name'),
        data.get('designation'),
        data.get('department'),
        data.get('office_location'),
        data.get('email'),
        data.get('google_scholar_url'),
        data.get('linkedin_url'),
        data.get('profile_picture_url'),
        data.get('headline'),
        json.dumps(data.get('experience', [])),
        json.dumps(data.get('certifications', [])),
        json.dumps(data.get('projects', [])),
        json.dumps(data.get('publications', [])),
        data.get('last_updated', datetime.now().isoformat()),
        faculty_id
    ))
    
    success = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return success

def delete_faculty(faculty_id: int) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM faculty WHERE id = ?", (faculty_id,))
    
    success = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return success

def search_faculty(query: str) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    search_pattern = f"%{query}%"
    cursor.execute("""
        SELECT * FROM faculty
        WHERE name LIKE ? OR department LIKE ? OR designation LIKE ?
           OR headline LIKE ? OR experience LIKE ? OR projects LIKE ?
           OR publications LIKE ?
        ORDER BY name
    """, (search_pattern, search_pattern, search_pattern, search_pattern,
          search_pattern, search_pattern, search_pattern))
    
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]
