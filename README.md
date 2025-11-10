# Faculty Hub

A web portal that helps students in large academic institutions find and connect with the right faculty members for mentorship, projects, or academic advice.

> **⚠️ Important for Existing Users**: If you're updating from a previous version, please run the database migration script. See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for details.

## Features

### Student-Facing
- **Search & Discovery**: Search faculty by name, department, research area, project, or keyword
- **Rich Faculty Profiles**: View comprehensive faculty information including:
  - Profile picture and contact details
  - Academic position and department
  - Professional experience
  - Recent publications (from Google Scholar)
  - Projects and certifications (from LinkedIn)

### Admin-Facing
- **Faculty Management**: Add, edit, and delete faculty records
- **Automated Data Scraping**: Automatically fetch publications from Google Scholar
- **Manual Data Entry**: Add experience, projects, certifications, and other details manually
- **CSV Bulk Import**: Import multiple faculty members at once from a CSV file
- **Data Preview**: Review scraped data before saving
- **Smart Caching**: Auto-refresh faculty data every 24 hours

## Technology Stack

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| Backend      | Python 3.10+ (FastAPI)                  |
| Frontend     | React (Vite)                            |
| Database     | SQLite                                  |
| Web Scraping | Playwright + BeautifulSoup              |

## Prerequisites

- **Python 3.10+**
- **Node.js 16+** and npm
- **Git**

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd PBL
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install chromium

# Create .env file
copy ..\.env.example .env
# Or on Linux/Mac:
cp ../.env.example .env

# Edit .env and set your admin password and JWT secret
# Example:
# ADMIN_PASSWORD=your_secure_password
# JWT_SECRET_KEY=your_jwt_secret_key_here
```

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### 4. Running the Application

#### Option 1: Run with VS Code (Recommended)

1. Open the project in VS Code
2. Go to "Run and Debug" panel (Ctrl+Shift+D)
3. Select "Full Stack (Backend + Frontend)" from the dropdown
4. Click the green play button

This will start both the backend and frontend servers simultaneously.

#### Option 2: Run Manually

**Terminal 1 - Backend:**
```bash
cd backend
# Activate virtual environment if not already activated
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Usage

### For Students

1. Visit http://localhost:3000
2. Browse or search for faculty members
3. Click on any faculty card to view their full profile
4. Access their LinkedIn and Google Scholar profiles via provided links

### For Admins

1. Visit http://localhost:3000/admin/login
2. Enter the admin password (from your .env file)
3. **Add Single Faculty:**
   - Click "Add Faculty"
   - Fill in basic information (name, title, department, etc.)
   - Add LinkedIn and Google Scholar URLs
   - Click "Scrape Data from URLs" to auto-fetch publications (Google Scholar)
   - Use "Add Manual Data Entry" to manually add experience, projects, certifications
   - Click "Save"
4. **Bulk Import via CSV:**
   - Click "Import CSV" 
   - Download the CSV template
   - Fill in faculty data (see CSV format below)
   - Upload and import multiple faculty at once
5. Edit or delete existing faculty as needed

## CSV Import Format

To bulk import faculty members, create a CSV file with the following columns:

### Required Column
- `name` - Faculty full name (required)

### Optional Columns
- `designation` (or `title`) - Academic designation (e.g., "Professor", "Associate Professor")
- `department` - Department name (e.g., "Computer Science")
- `office_location` - Office location (e.g., "Building A, Room 305")
- `email` - Email address
- `linkedin_url` - Full LinkedIn profile URL
- `google_scholar_url` - Full Google Scholar profile URL
- `headline` - Professional headline/tagline
- `profile_picture_url` - URL to profile picture
- `experience` - Work experience (format: Position|Company|Duration; use semicolon for multiple entries)
- `projects` - Projects (format: Title|Description; use semicolon for multiple entries)
- `certifications` - Certifications (format: Name|Issuer; use semicolon for multiple entries)

### CSV Template Example

```csv
name,designation,department,office_location,email,linkedin_url,google_scholar_url,headline,profile_picture_url,experience,projects,certifications
Dr. John Doe,Professor,Computer Science,Building A Room 305,john.doe@university.edu,https://linkedin.com/in/johndoe,https://scholar.google.com/citations?user=ABC123,AI and Machine Learning Researcher,https://example.com/john.jpg,Professor|MIT|2015-Present;Associate Professor|Stanford|2010-2015,AI Research Platform|ML framework;Smart Grid|IoT system,AWS Solutions Architect|Amazon;PMP|PMI
Dr. Jane Smith,Associate Professor,Electrical Engineering,Building B Room 201,jane.smith@university.edu,https://linkedin.com/in/janesmith,https://scholar.google.com/citations?user=XYZ456,Power Systems Expert,https://example.com/jane.jpg,Associate Professor|Harvard|2018-Present,Renewable Energy Grid|Smart grid tech,IEEE Senior Member|IEEE
```

### CSV Format Details

**Experience Format**: `Position|Company|Duration;Position|Company|Duration`
- Example: `Professor|MIT|2015-Present;Associate Professor|Stanford|2010-2015`

**Projects Format**: `Title|Description;Title|Description`
- Example: `AI Research Platform|Machine learning framework;Smart Grid|IoT energy system`

**Certifications Format**: `Name|Issuer;Name|Issuer`
- Example: `AWS Solutions Architect|Amazon;PMP Certification|PMI`

### CSV Import Notes

- The CSV file must include a header row with column names
- Only the `name` field is required; all other fields are optional
- You can download a template from the Admin Dashboard
- A sample file `sample_faculty_import.csv` is included in the project root with complete LinkedIn data examples
- **New**: CSV now supports importing experience, projects, and certifications directly
- Use pipe `|` to separate fields within an entry, semicolon `;` to separate multiple entries
- See [CSV_IMPORT_GUIDE.md](CSV_IMPORT_GUIDE.md) for detailed format specifications and examples
- The import will create complete faculty profiles with all LinkedIn data
- After import, you can edit individual profiles to modify any data
- Invalid or duplicate entries will be skipped with a notification

## Project Structure

```
PBL/
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── database.py          # Database operations
│   ├── models.py            # Pydantic models
│   ├── auth.py              # Authentication logic
│   ├── scraper.py           # Web scraping functions
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── api.js           # API client
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # Global styles
│   ├── index.html           # HTML template
│   ├── package.json         # Node dependencies
│   └── vite.config.js       # Vite configuration
├── .vscode/
│   └── launch.json          # VS Code debug configuration
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── sample_faculty_import.csv # Sample CSV for bulk import
└── README.md                # This file
```

## API Endpoints

### Public Endpoints
- `GET /api/faculty` - List all faculty
- `GET /api/faculty/{id}` - Get faculty by ID
- `GET /api/search?q={query}` - Search faculty

### Admin Endpoints (Requires Authentication)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/scrape` - Preview scraped data
- `POST /api/admin/faculty` - Create faculty
- `PUT /api/admin/faculty/{id}` - Update faculty
- `DELETE /api/admin/faculty/{id}` - Delete faculty

## Database Schema

The SQLite database (`faculty_hub.db`) contains a single `faculty` table with the following structure:

| Column               | Type     | Description                          |
| -------------------- | -------- | ------------------------------------ |
| id                   | INTEGER  | Primary key                          |
| name                 | TEXT     | Faculty name                         |
| title                | TEXT     | Academic title                       |
| department           | TEXT     | Department name                      |
| office_location      | TEXT     | Office location                      |
| email                | TEXT     | Email address                        |
| google_scholar_url   | TEXT     | Google Scholar profile URL           |
| linkedin_url         | TEXT     | LinkedIn profile URL                 |
| profile_picture_url  | TEXT     | Profile picture URL (scraped)        |
| headline             | TEXT     | LinkedIn headline (scraped)          |
| experience           | TEXT     | JSON array of experience (scraped)   |
| certifications       | TEXT     | JSON array of certifications (scraped) |
| projects             | TEXT     | JSON array of projects (scraped)     |
| publications         | TEXT     | JSON array of publications (scraped) |
| last_updated         | DATETIME | Last scrape timestamp                |

## Data Collection & Caching Strategy

### Automated Scraping
- **Google Scholar**: Successfully scrapes recent publications (5 most recent)
- **LinkedIn**: Limited due to authentication requirements (see below)
- Faculty data is automatically refreshed when older than 24 hours
- Background scraping occurs when students view faculty profiles
- Scraping failures are logged but don't break the application
- Old data is retained if scraping fails

### LinkedIn Limitations
LinkedIn blocks automated scraping without authentication to protect user privacy. This is expected behavior and affects all scraping tools.

**Recommended Approaches:**
1. **Manual Entry** - Use the "Add Manual Data Entry" feature to add experience, projects, and certifications
2. **CSV Import** - Bulk import faculty data from a prepared spreadsheet
3. **Hybrid** - Auto-scrape Google Scholar publications + manually add LinkedIn data once

The system stores LinkedIn URLs so students can click through to view real-time profiles directly.

## Security Notes

- Admin password is stored in `.env` file (not committed to git)
- JWT tokens are used for admin authentication
- Tokens expire after 8 hours
- CORS is configured to allow frontend-backend communication

## Troubleshooting

### Playwright Installation Issues
```bash
playwright install chromium --with-deps
```

### Database Not Found
The database is created automatically on first run. Ensure the backend has write permissions.

### Port Already in Use
- Backend (8000): Change port in `backend/main.py`
- Frontend (3000): Change port in `frontend/vite.config.js`

### Scraping Not Working
- Ensure Playwright browsers are installed
- Check that URLs are valid and accessible
- LinkedIn and Google Scholar may have anti-scraping measures

## Future Enhancements

- User authentication for students
- Advanced search filters (by department, research area)
- Faculty availability calendar
- Email notifications
- Export faculty data to CSV
- Multi-language support

## License

This project is for educational purposes.

## Support

For issues or questions, please contact the development team.
