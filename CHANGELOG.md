# Changelog

All notable changes to Faculty Hub project.

## [2.0.0] - November 6, 2025

### 🎉 Major Changes

#### Backend: Field Name Change
- **BREAKING**: Renamed `title` field to `designation` throughout backend
  - Database column: `title` → `designation`
  - API models: `title` → `designation`
  - All API responses now use `designation`

#### Frontend: Dropdown Menus Added
- **NEW**: Designation field is now a dropdown menu with predefined options:
  - Assistant Professor
  - Associate Professor
  - Professor
  - Head of Department
  - Lab Attendant
  - Research Scholar
  - Visiting Professor
  - Emeritus Professor
  - Lecturer
  - Senior Lecturer

- **NEW**: Department field is now a dropdown menu with predefined options:
  - Computer Science
  - Mechanical Engineering
  - Civil Engineering
  - Electrical Engineering
  - Electronics and Communication
  - Information Technology
  - Chemical Engineering
  - Biotechnology
  - Mathematics
  - Physics
  - Chemistry
  - Management Studies
  - Humanities

#### CSV Import Enhancements
- **ENHANCED**: CSV now supports `experience`, `projects`, and `certifications` columns
- **FORMAT**: Use pipe `|` to separate fields, semicolon `;` to separate entries
- **BACKWARD COMPATIBLE**: Accepts both `title` and `designation` column names
- **NEW**: Comprehensive [CSV_IMPORT_GUIDE.md](CSV_IMPORT_GUIDE.md) with examples

### 📝 Documentation

#### New Files
- `MIGRATION_GUIDE.md` - Step-by-step migration from v1.x to v2.0
- `CSV_IMPORT_GUIDE.md` - Detailed CSV format specification
- `RECENT_UPDATES.md` - Summary of latest changes
- `CHANGELOG.md` - This file
- `backend/migrate_database.py` - Automated migration script

#### Updated Files
- `README.md` - Added migration warning, updated CSV docs
- `sample_faculty_import.csv` - Now includes full LinkedIn data examples
- `PROJECT_DOCUMENTATION.md` - Updated with latest changes

### 🔧 Technical Changes

#### Backend Files Modified
- `backend/database.py` - Column name change, all CRUD operations updated
- `backend/models.py` - Pydantic models use `designation`
- `backend/main.py` - API responses use `designation`

#### Frontend Files Modified
- `frontend/src/components/FacultyForm.jsx` - Added dropdown menus
- `frontend/src/components/CSVImport.jsx` - Enhanced CSV parsing
- `frontend/src/pages/HomePage.jsx` - Display `designation`
- `frontend/src/pages/FacultyProfile.jsx` - Display `designation`
- `frontend/src/pages/AdminDashboard.jsx` - Display `designation`
- `frontend/src/index.css` - Added select styling

### 🚀 Migration Required

**For existing installations:**
1. Backup database: `copy faculty_hub.db faculty_hub.db.backup`
2. Run migration: `python backend/migrate_database.py`
3. Restart application

See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for detailed instructions.

### ✅ Backward Compatibility

- CSV import accepts both `title` and `designation`
- Frontend gracefully handles missing designation/department
- Old CSV files will continue to work

---

## [1.0.0] - November 5, 2025

### 🎉 Initial Release

#### Features
- Faculty directory with search functionality
- Admin dashboard with CRUD operations
- Google Scholar publication scraping
- Manual data entry for LinkedIn information
- CSV bulk import
- JWT-based authentication
- SQLite database
- React frontend with Vite
- FastAPI backend

#### Components
- Student-facing search and profile pages
- Admin login and dashboard
- Faculty form with scraping
- CSV import with preview

#### Documentation
- README.md with setup instructions
- PROJECT_DOCUMENTATION.md with technical details
- FEATURES_SUMMARY.md with feature descriptions

---

## Versioning

This project uses [Semantic Versioning](https://semver.org/):
- **Major**: Breaking changes (e.g., field renames, schema changes)
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes (backward compatible)

## Upgrade Path

### From 1.x to 2.0
- **Required**: Database migration
- **Breaking**: API responses use `designation` instead of `title`
- **Breaking**: Frontend expects `designation` field
- See: [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)

### Future Upgrades
- Patch releases (2.0.x): No migration needed, just update code
- Minor releases (2.x.0): No breaking changes, optional new features
- Major releases (3.0.0): May require migration, check changelog

---

**Current Version**: 2.0.0  
**Release Date**: November 6, 2025  
**Status**: Stable
