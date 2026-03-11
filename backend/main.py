# main.py
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import Base, engine, get_db
from models import PharmacyLead
from schemas import PharmacyLeadOut

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For the demo, allow all. (Change to Vercel URL later if you want)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables (for simple setups; in production use Alembic)
Base.metadata.create_all(bind=engine)


@app.get("/api/leads", response_model=List[PharmacyLeadOut])
def get_leads(db: Session = Depends(get_db)):
    leads = db.query(PharmacyLead).all()
    return leads
