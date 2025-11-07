from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class ExperienceItem(BaseModel):
    position: str
    company: str
    duration: Optional[str] = None

class Certification(BaseModel):
    name: str
    issuer: Optional[str] = None

class Project(BaseModel):
    title: str
    description: Optional[str] = None

class Publication(BaseModel):
    title: str
    authors: Optional[str] = None
    year: Optional[str] = None
    citation: Optional[str] = None

class FacultyBase(BaseModel):
    name: str
    title: Optional[str] = None
    department: Optional[str] = None
    office_location: Optional[str] = None
    email: Optional[EmailStr] = None
    google_scholar_url: Optional[str] = None
    linkedin_url: Optional[str] = None

class FacultyCreate(FacultyBase):
    pass

class FacultyUpdate(FacultyBase):
    profile_picture_url: Optional[str] = None
    headline: Optional[str] = None
    experience: Optional[List[ExperienceItem]] = []
    certifications: Optional[List[Certification]] = []
    projects: Optional[List[Project]] = []
    publications: Optional[List[Publication]] = []

class FacultyResponse(FacultyBase):
    id: int
    profile_picture_url: Optional[str] = None
    headline: Optional[str] = None
    experience: Optional[List[ExperienceItem]] = []
    certifications: Optional[List[Certification]] = []
    projects: Optional[List[Project]] = []
    publications: Optional[List[Publication]] = []
    last_updated: Optional[str] = None

class AdminLogin(BaseModel):
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ScrapedData(BaseModel):
    profile_picture_url: Optional[str] = None
    headline: Optional[str] = None
    experience: List[ExperienceItem] = []
    certifications: List[Certification] = []
    projects: List[Project] = []
    publications: List[Publication] = []
