# Database Migration Guide

## Important: Field Name Changes

The latest update changes the field name from **"title"** to **"designation"** throughout the application.

### What Changed

**Backend/Database:**
- Database column: `title` → `designation`
- API responses: `title` → `designation`
- Pydantic models: `title` → `designation`

**Frontend:**
- All components now use `designation` field
- Labels changed to "Designation"
- Dropdown menu added for designation selection
- Dropdown menu added for department selection

**CSV Import:**
- Accepts both `title` and `designation` column names (backward compatible)
- New template uses `designation`

## Migration Required?

### For New Installations
✅ **No action needed**
- The new database schema will be created automatically
- Just follow normal setup instructions

### For Existing Installations
⚠️ **Migration required if:**
- You have an existing `faculty_hub.db` database
- You have faculty data you want to keep

✅ **No migration needed if:**
- This is a fresh installation
- You can recreate faculty data from scratch

## How to Migrate

### Step 1: Backup Your Database (Important!)

```bash
cd backend
copy faculty_hub.db faculty_hub.db.backup
# Or on Linux/Mac:
cp faculty_hub.db faculty_hub.db.backup
```

### Step 2: Run Migration Script

```bash
# Make sure you're in the backend directory
cd backend

# Activate virtual environment
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Run migration
python migrate_database.py
```

### Step 3: Verify Migration

The script will output:
```
============================================================
Faculty Hub Database Migration
============================================================

Starting migration: 'title' → 'designation'...
✓ Migration completed successfully!
  - Column 'title' renamed to 'designation'
  - All existing data preserved

============================================================
Migration process complete!
You can now start the application.
============================================================
```

### Step 4: Restart Application

```bash
# If backend is running, stop it (Ctrl+C)
# Then restart
python main.py
```

Frontend will automatically work with the new field names.

## Alternative: Manual Migration

If you prefer to migrate manually:

### Option 1: SQL Migration

```bash
cd backend
sqlite3 faculty_hub.db
```

Then run:
```sql
-- Create new table with 'designation'
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
);

-- Copy data
INSERT INTO faculty_new 
SELECT id, name, title, department, office_location, email,
       google_scholar_url, linkedin_url, profile_picture_url,
       headline, experience, certifications, projects,
       publications, last_updated
FROM faculty;

-- Replace old table
DROP TABLE faculty;
ALTER TABLE faculty_new RENAME TO faculty;

-- Verify
.schema faculty
SELECT COUNT(*) FROM faculty;
```

Exit: `.quit`

### Option 2: Fresh Start

If you don't have critical data to preserve:

1. **Delete old database:**
```bash
cd backend
del faculty_hub.db  # Windows
# rm faculty_hub.db  # Mac/Linux
```

2. **Restart backend:**
```bash
python main.py
```

New database with correct schema will be created automatically.

3. **Re-import data:**
- Use CSV import to add faculty again
- Or add manually through admin interface

## Troubleshooting

### Migration Script Says "Already Migrated"

This means your database already uses `designation`. You're good to go!

### Migration Script Says "No Database Found"

This means you don't have an existing database. The new schema will be created automatically when you start the backend.

### Migration Fails

1. **Check backup exists:**
```bash
# Restore from backup
copy faculty_hub.db.backup faculty_hub.db  # Windows
# cp faculty_hub.db.backup faculty_hub.db  # Mac/Linux
```

2. **Check file permissions:**
- Ensure `faculty_hub.db` is not locked by another process
- Close any database browsers or admin tools

3. **Check Python environment:**
- Ensure virtual environment is activated
- Ensure sqlite3 is available: `python -c "import sqlite3; print(sqlite3.version)"`

### Frontend Shows Empty Values

If you migrated the database but frontend shows empty designation/department:

1. **Check API response:**
```bash
# Visit in browser:
http://localhost:8000/api/faculty
```

Should show `"designation"` field, not `"title"`

2. **Hard refresh frontend:**
- Press Ctrl+Shift+R (Windows/Linux)
- Press Cmd+Shift+R (Mac)
- Or clear browser cache

3. **Restart both servers:**
```bash
# Stop both backend and frontend
# Restart backend:
cd backend
python main.py

# Restart frontend:
cd frontend
npm run dev
```

## Verification Checklist

After migration, verify:

- ✅ Backend starts without errors
- ✅ API returns `designation` field (check http://localhost:8000/api/faculty)
- ✅ Frontend shows faculty with designations
- ✅ Search works
- ✅ Faculty profiles display correctly
- ✅ Admin can add/edit faculty
- ✅ Designation dropdown appears in admin form
- ✅ Department dropdown appears in admin form
- ✅ CSV import works with new format

## Rollback

If you need to rollback for any reason:

1. **Stop backend**

2. **Restore backup:**
```bash
cd backend
del faculty_hub.db  # Windows
copy faculty_hub.db.backup faculty_hub.db  # Windows

# Or on Mac/Linux:
rm faculty_hub.db
cp faculty_hub.db.backup faculty_hub.db
```

3. **Switch to previous code version:**
```bash
git checkout <previous-commit>
# Or restore from backup
```

## CSV Import Backward Compatibility

The CSV import supports both old and new formats:

**Old Format (Still Works):**
```csv
name,title,department,email
Dr. John Doe,Professor,Computer Science,john@edu
```

**New Format (Recommended):**
```csv
name,designation,department,email
Dr. John Doe,Professor,Computer Science,john@edu
```

Both will work! The system accepts both column names.

## Support

If you encounter issues:

1. Check this migration guide
2. Ensure database backup exists
3. Check error messages in terminal
4. Try fresh start option if data is not critical
5. Check [RECENT_UPDATES.md](RECENT_UPDATES.md) for details

---

**Last Updated:** November 6, 2025  
**Migration Version:** 1.0  
**Database Schema Version:** 2.0
