const LEADS_API = "http://localhost:8000/api/leads";

export type Sentiment = "positive" | "neutral" | "negative";

export interface Lead {
  id: number;
  name: string;
  city: string;
  neighborhood: string;
  gmapsRating: number;
  lastReviewSnippet: string;
  aiSentiment: Sentiment;
}

export async function fetchLeads(): Promise<Lead[]> {
  const response = await fetch(LEADS_API);
  if (!response.ok) {
    throw new Error(`Leads API error: ${response.status}`);
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}
