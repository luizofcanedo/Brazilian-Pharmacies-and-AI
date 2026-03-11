import random
from database import SessionLocal
from models import PharmacyLead

def generate_maps_ratings():
    db = SessionLocal()
    
    # Find all leads where the rating is currently empty
    leads_to_update = db.query(PharmacyLead).filter(PharmacyLead.maps_rating == None).all()
    
    print(f"Found {len(leads_to_update)} pharmacies that need a Maps rating...")

    for lead in leads_to_update:
        # Generate a realistic rating based on their sentiment
        if lead.ai_sentiment == "Positive":
            rating = round(random.uniform(4.5, 5.0), 1)
        elif lead.ai_sentiment == "Neutral":
            rating = round(random.uniform(3.5, 4.4), 1)
        elif lead.ai_sentiment in ["Price Objection", "Timing Objection"]:
            rating = round(random.uniform(2.0, 3.4), 1)
        else:
            rating = round(random.uniform(3.0, 4.2), 1) # Fallback
            
        lead.maps_rating = rating
        db.commit() # Save to Supabase
        
        print(f"  -> {lead.name}: {rating} Stars")

    db.close()
    print("All ratings successfully generated and saved to the database!")

if __name__ == "__main__":
    generate_maps_ratings()
