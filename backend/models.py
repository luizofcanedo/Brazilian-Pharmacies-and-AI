# models.py
from sqlalchemy import Column, Integer, String, Float
from database import Base


class PharmacyLead(Base):
    __tablename__ = "pharmacy_leads"

    name = Column(String, nullable=False)
    city = Column(String, nullable=True)
    whatsapp = Column(String, primary_key=True, index=True)
    ai_sentiment = Column(String, nullable=True)

    last_analyzed_review = Column(String, nullable=True)
    maps_rating = Column(Float, nullable=True)
