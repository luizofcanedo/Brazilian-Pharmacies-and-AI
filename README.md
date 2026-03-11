A full-stack lead generation tool designed to identify and qualify pharmaceutical leads in the Brazilian market using AI sentiment analysis.

## Origin & Evolution
This project started as a custom tool for a local dental-tech startup to automate their clinic outreach. I’ve since adapted the architecture to the pharmaceutical sector, replacing the original dental scrapers with a pharmacy-focused dataset and transitioning the infrastructure to a production-ready cloud stack (Supabase + FastAPI).

## The Stack
Backend: FastAPI (Python) + SQLAlchemy.

AI Layer: Groq / Llama 3.1 (Used for parsing raw Google Maps reviews into actionable sentiment).

Database: Supabase (PostgreSQL).

Frontend: Next.js 15 (Turbopack) + Tailwind + Shadcn/UI.

Charts: Recharts (Mapping density vs. regional GDP).

## Key Technical Choices
Transaction Pooling: Switched to Supabase's transaction pooler (port 6543) to allow Render's IPv4 environment to communicate with Supabase's IPv6 infrastructure.

Lead Scoring: Instead of just showing stars, the backend categorizes leads into specific objections (Price vs. Service) based on the most recent reviews.

Decoupled Architecture: The frontend is hosted on Vercel to leverage its Edge Network, while the Python backend handles the heavy AI/DB processing on Render.

## Repository Overview
/backend            # FastAPI routes and AI logic
/frontend   # Next.js app (Tailwind/TS)

Link to the website:
https://vercel.com/luizofcanedos-projects/brazilian-pharmacies-and-ai
