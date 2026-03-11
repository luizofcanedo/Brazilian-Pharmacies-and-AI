from pydantic import BaseModel, ConfigDict

class PharmacyLeadOut(BaseModel):
    name: str
    city: str
    whatsapp: str
    ai_sentiment: str
    maps_rating: float
    last_analyzed_review: str
    # This is the modern Pydantic V2 way to do 'orm_mode'
    model_config = ConfigDict(from_attributes=True)
