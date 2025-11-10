"""
Database Migration Script: Rename 'title' column to 'designation'

This script migrates the existing faculty_hub.db database from using 'title'
to 'designation' field name.

Run this script ONCE after pulling the latest code updates.
"""

import sqlite3
import os

DATABASE_PATH = "faculty_hub.db"

def migrate_database():
    if not os.path.exists(DATABASE_PATH):
        print("No existing database found. Nothing to migrate.")
        print("The new schema will be created automatically on first run.")
        return

    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Check if migration is needed (check if 'title' column exists)
    cursor.execute("PRAGMA table_info(faculty)")
    columns = [col[1] for col in cursor.fetchall()]
    
    if 'designation' in columns:
        print("✓ Database already migrated (uses 'designation' column)")
        conn.close()
        return
    
    if 'title' not in columns:
        print("! Warning: Unexpected database schema. Please check manually.")
        conn.close()
        return
    
    print("Starting migration: 'title' → 'designation'...")
    
    try:
        # Create new table with 'designation' column
        cursor.execute("""
            CREATE TABLE faculty_new (
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
        
        # Copy data from old table to new table
        cursor.execute("""
            INSERT INTO faculty_new 
            SELECT id, name, title, department, office_location, email,
                   google_scholar_url, linkedin_url, profile_picture_url,
                   headline, experience, certifications, projects,
                   publications, last_updated
            FROM faculty
        """)
        
        # Drop old table
        cursor.execute("DROP TABLE faculty")
        
        # Rename new table to faculty
        cursor.execute("ALTER TABLE faculty_new RENAME TO faculty")
        
        conn.commit()
        print("✓ Migration completed successfully!")
        print("  - Column 'title' renamed to 'designation'")
        print("  - All existing data preserved")
        
    except Exception as e:
        conn.rollback()
        print(f"✗ Migration failed: {e}")
        print("  - Database rolled back to previous state")
        raise
    
    finally:
        conn.close()

if __name__ == "__main__":
    print("=" * 60)
    print("Faculty Hub Database Migration")
    print("=" * 60)
    print()
    
    migrate_database()
    
    print()
    print("=" * 60)
    print("Migration process complete!")
    print("You can now start the application.")
    print("=" * 60)
