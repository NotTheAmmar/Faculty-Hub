from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import json
from typing import List
import asyncio

from models import (
    FacultyCreate, FacultyUpdate, FacultyResponse,
    AdminLogin, Token, ScrapedData
)
from database import (
    init_db, create_faculty, get_faculty, get_all_faculty,
    update_faculty, delete_faculty, search_faculty
)
from auth import verify_password, create_access_token, verify_token
from scraper import scrape_faculty_data

app = FastAPI(title="Faculty Hub API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    init_db()

def parse_json_field(field_value):
    if field_value:
        try:
            return json.loads(field_value)
        except:
            return []
    return []

def format_faculty_response(faculty_data: dict) -> dict:
    return {
        "id": faculty_data["id"],
        "name": faculty_data["name"],
        "title": faculty_data["title"],
        "department": faculty_data["department"],
        "office_location": faculty_data["office_location"],
        "email": faculty_data["email"],
        "google_scholar_url": faculty_data["google_scholar_url"],
        "linkedin_url": faculty_data["linkedin_url"],
        "profile_picture_url": faculty_data["profile_picture_url"],
        "headline": faculty_data["headline"],
        "experience": parse_json_field(faculty_data["experience"]),
        "certifications": parse_json_field(faculty_data["certifications"]),
        "projects": parse_json_field(faculty_data["projects"]),
        "publications": parse_json_field(faculty_data["publications"]),
        "last_updated": faculty_data["last_updated"]
    }

async def background_scrape_and_update(faculty_id: int, linkedin_url: str, scholar_url: str):
    try:
        scraped_data = await scrape_faculty_data(linkedin_url, scholar_url)
        
        faculty = get_faculty(faculty_id)
        if faculty:
            update_data = {
                "name": faculty["name"],
                "title": faculty["title"],
                "department": faculty["department"],
                "office_location": faculty["office_location"],
                "email": faculty["email"],
                "google_scholar_url": faculty["google_scholar_url"],
                "linkedin_url": faculty["linkedin_url"],
                "profile_picture_url": scraped_data.get("profile_picture_url") or faculty["profile_picture_url"],
                "headline": scraped_data.get("headline") or faculty["headline"],
                "experience": scraped_data.get("experience", []),
                "certifications": scraped_data.get("certifications", []),
                "projects": scraped_data.get("projects", []),
                "publications": scraped_data.get("publications", []),
                "last_updated": datetime.now().isoformat()
            }
            update_faculty(faculty_id, update_data)
    except Exception as e:
        print(f"Background scrape failed: {e}")

@app.post("/api/admin/login", response_model=Token)
async def admin_login(login_data: AdminLogin):
    if not verify_password(login_data.password):
        raise HTTPException(status_code=401, detail="Invalid password")
    
    access_token = create_access_token(data={"sub": "admin"})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/admin/scrape", response_model=ScrapedData)
async def scrape_preview(
    linkedin_url: str = None,
    scholar_url: str = None,
    admin=Depends(verify_token)
):
    scraped_data = await scrape_faculty_data(linkedin_url, scholar_url)
    return scraped_data

@app.post("/api/admin/faculty", response_model=FacultyResponse)
async def create_new_faculty(faculty: FacultyUpdate, admin=Depends(verify_token)):
    faculty_data = {
        "name": faculty.name,
        "title": faculty.title,
        "department": faculty.department,
        "office_location": faculty.office_location,
        "email": faculty.email,
        "google_scholar_url": faculty.google_scholar_url,
        "linkedin_url": faculty.linkedin_url,
        "profile_picture_url": faculty.profile_picture_url,
        "headline": faculty.headline,
        "experience": [exp.dict() for exp in faculty.experience] if faculty.experience else [],
        "certifications": [cert.dict() for cert in faculty.certifications] if faculty.certifications else [],
        "projects": [proj.dict() for proj in faculty.projects] if faculty.projects else [],
        "publications": [pub.dict() for pub in faculty.publications] if faculty.publications else [],
        "last_updated": datetime.now().isoformat()
    }
    
    faculty_id = create_faculty(faculty_data)
    created_faculty = get_faculty(faculty_id)
    return format_faculty_response(created_faculty)

@app.put("/api/admin/faculty/{faculty_id}", response_model=FacultyResponse)
async def update_existing_faculty(
    faculty_id: int,
    faculty: FacultyUpdate,
    admin=Depends(verify_token)
):
    existing = get_faculty(faculty_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Faculty not found")
    
    faculty_data = {
        "name": faculty.name,
        "title": faculty.title,
        "department": faculty.department,
        "office_location": faculty.office_location,
        "email": faculty.email,
        "google_scholar_url": faculty.google_scholar_url,
        "linkedin_url": faculty.linkedin_url,
        "profile_picture_url": faculty.profile_picture_url,
        "headline": faculty.headline,
        "experience": [exp.dict() for exp in faculty.experience] if faculty.experience else [],
        "certifications": [cert.dict() for cert in faculty.certifications] if faculty.certifications else [],
        "projects": [proj.dict() for proj in faculty.projects] if faculty.projects else [],
        "publications": [pub.dict() for pub in faculty.publications] if faculty.publications else [],
        "last_updated": datetime.now().isoformat()
    }
    
    update_faculty(faculty_id, faculty_data)
    updated_faculty = get_faculty(faculty_id)
    return format_faculty_response(updated_faculty)

@app.delete("/api/admin/faculty/{faculty_id}")
async def delete_existing_faculty(faculty_id: int, admin=Depends(verify_token)):
    success = delete_faculty(faculty_id)
    if not success:
        raise HTTPException(status_code=404, detail="Faculty not found")
    return {"message": "Faculty deleted successfully"}

@app.get("/api/faculty", response_model=List[FacultyResponse])
async def list_faculty():
    faculty_list = get_all_faculty()
    return [format_faculty_response(f) for f in faculty_list]

@app.get("/api/faculty/{faculty_id}", response_model=FacultyResponse)
async def get_faculty_by_id(faculty_id: int, background_tasks: BackgroundTasks):
    faculty = get_faculty(faculty_id)
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")
    
    if faculty["last_updated"]:
        try:
            last_updated = datetime.fromisoformat(faculty["last_updated"])
            if datetime.now() - last_updated > timedelta(hours=24):
                background_tasks.add_task(
                    background_scrape_and_update,
                    faculty_id,
                    faculty["linkedin_url"],
                    faculty["google_scholar_url"]
                )
        except:
            pass
    
    return format_faculty_response(faculty)

@app.get("/api/search", response_model=List[FacultyResponse])
async def search_faculty_endpoint(q: str):
    results = search_faculty(q)
    return [format_faculty_response(f) for f in results]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
