# Project: Faculty Hub

## Project Overview & Goal

The Faculty Hub is a web portal that helps students in large academic institutions find and connect with the right faculty members for mentorship, projects, or academic advice.

The platform is a centralized, intelligent directory.
An admin will curate a list of faculty, and the system will scrape their professional profiles (LinkedIn + Google Scholar) to automatically generate rich, up-to-date profiles.

Students can then search by name, research area, project, or keyword, and view detailed faculty information.

## Core Technology Stack

| Layer        | Technology                              | Description                               |
| ------------ | --------------------------------------- | ----------------------------------------- |
| Backend      | **Python 3.10+ (FastAPI)**              | For API endpoints and backend logic       |
| Frontend     | **React**                               | Public + Admin dashboard                  |
| Database     | **SQLite**                              | Simple, single-file DB (`faculty_hub.db`) |
| Web Scraping | **Playwright + BeautifulSoup (Python)** | For LinkedIn & Google Scholar scraping    |

## Database Schema

Table: faculty

| Column                    | Type     | Description                              |
| ------------------------- | -------- | ---------------------------------------- |
| id                        | INTEGER  | Primary Key, Auto-incrementing           |
| **Admin-Entered Data**    |          |                                          |
| name                      | TEXT     | Faculty full name                        |
| title                     | TEXT     | e.g., “Professor”, “Associate Professor” |
| department                | TEXT     | e.g., “Computer Science”                 |
| office_location           | TEXT     | e.g., “Building A, Room 305”             |
| email                     | TEXT     | Faculty email                            |
| google_scholar_url        | TEXT     | URL to Google Scholar                    |
| linkedin_url              | TEXT     | URL to LinkedIn                          |
| **Scraped & Cached Data** |          |                                          |
| profile_picture_url       | TEXT     | Scraped profile image URL                |
| headline                  | TEXT     | LinkedIn headline                        |
| experience                | TEXT     | JSON array of experience objects         |
| certifications            | TEXT     | JSON array of certifications             |
| projects                  | TEXT     | JSON array of projects                   |
| publications              | TEXT     | JSON array of recent publications        |
| last_updated              | DATETIME | Timestamp of last successful scrape      |

Note: JSON-encoded strings are used for complex fields to maintain flexibility with SQLite.

## Core Logic: Data Scraping & Caching

Data scraping occurs at two critical triggers:

Trigger 1: Admin Create/Update

1. Admin fills in faculty details via admin panel and clicks “Add Faculty”.
2. FastAPI backend receives data.
3. Backend scrapes LinkedIn and Google Scholar URLs.
4. Scraped data preview is shown in frontend for manual verification/editing.
5. Admin clicks “Save”, and data is persisted to DB with current timestamp.

Trigger 2: Student Profile View (24-Hour Cache)

1. A student views a faculty profile (GET /api/faculty/{id}).
2. Backend checks last_updated timestamp.
3. If data is older than 24 hours, trigger background scrape:
   * On success → Update DB and timestamp.
   * On failure → Log error and retain old data.
4. If data is fresh (< 24 hours) → Serve cached data.

## Feature Breakdown

### Student-Facing (React)

* Public Access: No login required.
* Home/Search Page:
  * Prominent search bar.
  * Grid/list of faculty (Name, Title, Department, Profile Picture).
* Search Functionality:
  * Endpoint: `GET /api/search?q=<query>`
  * Search across: name, department, title, headline, projects, publications, experience.
  * Example: “Machine Learning” returns all related faculty.
* Faculty Profile Page:
  * Dynamic route: /faculty/:id
  * Displays all faculty data with formatted JSON fields.

### Admin-Facing (React + FastAPI)

* Admin Login:
  * Single hard-coded password (stored in .env).
  * Authentication via JWT token.
* Admin Dashboard:
  * List all faculty in DB.
  * Add, Edit, or Delete entries.
* Add/Edit Faculty Form:
  * Input for admin-entered fields.
  * Preview and manual edit of scraped data.
* Delete Faculty:
  * Endpoint to remove a faculty record.

## Data to Scrape

| Source             | Fields                                                                      |
| ------------------ | --------------------------------------------------------------------------- |
| **LinkedIn**       | Profile Picture, Headline, Experience (positions), Certifications, Projects |
| **Google Scholar** | Recent Publications (5 most recent)                                         |

## VS Code Configuration

Include a .vscode/launch.json that allows simultaneous start of backend + frontend with one click (“Run and Debug”).

## Deliverables

* Fully functional FastAPI backend with scraping, caching, and CRUD endpoints.
* React frontend for students and admin.
* README.md with setup instructions.
* .vscode/launch.json for one-click run.
* All scraping scripts runnable and stable.
  