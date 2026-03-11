import os
from dotenv import load_dotenv
from groq import Groq
from database import SessionLocal
from models import PharmacyLead

# Load environment variables (DATABASE_URL and GROQ_API_KEY)
load_dotenv()

# Initialize the Groq client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def generate_fake_review(name, sentiment):
    """Uses AI to generate a contextual review based on the pharmacy's sentiment."""
    prompt = f"""
    Write a realistic, 1-sentence Google Maps review in Portuguese for a Brazilian pharmacy named '{name}'. 
    The CRM sentiment for this lead is '{sentiment}'. 
    - If Positive: Praise the service, attendants, or price.
    - If Price Objection: Complain that the medicines are too expensive compared to competitors.
    - If Timing Objection: Complain about long lines, slow delivery, or out-of-stock items.
    - If Neutral: Give a generic 3-star review (e.g., "Normal", "Ok, but nothing special").
    
    Only return the review text. Do not use quotes, bolding, or conversational filler.
    """

    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.1-8b-instant",
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()

def run_ai_agent():
    db = SessionLocal()
    
    # Find all leads where the review is currently empty
    leads_to_update = db.query(PharmacyLead).filter(PharmacyLead.last_analyzed_review == None).all()
    
    print(f"Found {len(leads_to_update)} pharmacies that need reviews. Firing up the AI...")

    for lead in leads_to_update:
        print(f"Drafting review for {lead.name} ({lead.ai_sentiment})...")
        try:
            review = generate_fake_review(lead.name, lead.ai_sentiment)
            lead.last_analyzed_review = review
            db.commit() # Save to Supabase immediately
            print(f"  -> Saved: {review}")
        except Exception as e:
            print(f"  -> Error generating review: {e}")
            db.rollback()

    db.close()
    print("All reviews generated and saved to the database!")

if __name__ == "__main__":
    run_ai_agent()
