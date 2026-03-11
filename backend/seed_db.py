import os
from typing import List

import pandas as pd
from sqlalchemy.orm import Session

from database import SessionLocal, engine
from models import PharmacyLead


def create_tables() -> None:
    """
    Ensure all tables defined in models are created in the database.
    """
    from database import Base

    Base.metadata.create_all(bind=engine)


def load_leads_from_csv(csv_path: str) -> pd.DataFrame:
    """
    Load leads data from a CSV file using pandas.
    """
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"CSV file not found at: {csv_path}")

    df = pd.read_csv(csv_path)

    # Normalize column names (strip spaces, lower-case) to be forgiving
    df.columns = [c.strip().lower() for c in df.columns]

    expected_columns = {"name", "city", "whatsapp", "ai_sentiment"}
    missing = expected_columns - set(df.columns)
    if missing:
        raise ValueError(f"CSV is missing expected columns: {missing}")

    # Keep only the columns that map directly to PharmacyLead
    df = df[["name", "city", "whatsapp", "ai_sentiment"]]
    return df


def df_to_lead_objects(df: pd.DataFrame) -> List[PharmacyLead]:
    """
    Convert DataFrame rows to PharmacyLead ORM objects.
    """
    leads: List[PharmacyLead] = []
    for _, row in df.iterrows():
        lead = PharmacyLead(
            name=str(row["name"]) if pd.notna(row["name"]) else None,
            city=str(row["city"]) if pd.notna(row["city"]) else None,
            whatsapp=str(row["whatsapp"]) if pd.notna(row["whatsapp"]) else None,
            ai_sentiment=str(row["ai_sentiment"]) if pd.notna(row["ai_sentiment"]) else None,
        )
        leads.append(lead)
    return leads


def seed_database(csv_path: str) -> None:
    """
    Main seeding function: loads CSV, maps columns, and inserts into the DB.
    """
    create_tables()

    df = load_leads_from_csv(csv_path)
    leads = df_to_lead_objects(df)

    if not leads:
        print("No leads found in CSV; nothing to insert.")
        return

    db: Session = SessionLocal()
    try:
        db.add_all(leads)
        db.commit()
        print(f"Inserted {len(leads)} leads into the database.")
    except Exception as exc:
        db.rollback()
        raise exc
    finally:
        db.close()


if __name__ == "__main__":
    # Default path relative to this script (backend/seed_db.py -> ../teste/mock_leads.csv)
    default_csv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "teste", "mock_leads.csv")
    csv_path = os.getenv("LEADS_CSV_PATH", default_csv_path)

    print(f"Using CSV at: {csv_path}")
    seed_database(csv_path)

