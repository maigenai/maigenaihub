# routers/companies.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from database import SessionLocal, CompanyModel

router = APIRouter(prefix="/api/companies", tags=["companies"])

class Company(BaseModel):
    name: str
    description: str
    industry: str
    size: str
    location: str

@router.post("/")
async def create_company(company: Company):
    db = SessionLocal()
    try:
        db_company = CompanyModel(**company.dict())
        db.add(db_company)
        db.commit()
        return company
    finally:
        db.close()

@router.get("/")
async def get_companies():
    db = SessionLocal()
    try:
        return db.query(CompanyModel).all()
    finally:
        db.close()