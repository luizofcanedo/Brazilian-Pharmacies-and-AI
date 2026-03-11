const LEADS_API = "https://brazilian-pharmacies-and-ai.onrender.com";

export type Sentiment = "positive" | "neutral" | "negative";

export type Lead = {
  name: string;
  city: string;
  whatsapp: string;
  maps_rating: number | null;
  last_analyzed_review: string | null;
  ai_sentiment: string | null;
};

export async function fetchLeads(): Promise<Lead[]> {
  const response = await fetch(LEADS_API);
  if (!response.ok) {
    throw new Error(`Leads API error: ${response.status}`);
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}
