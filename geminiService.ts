import { Transaction } from "./types";

// The Gemini API key is NOT used here. It is held server-side in the Vercel
// serverless function at /api/advice (env var GEMINI_API_KEY) so it never
// reaches the browser. This client only calls our own endpoint.
export const getFinancialAdvice = async (transactions: Transaction[], income: number) => {
  try {
    const response = await fetch("/api/advice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactions, income }),
    });

    if (!response.ok) {
      return "The AI financial advisor is currently offline. Please try again later.";
    }

    const data = await response.json();
    return data.advice || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Advice request failed:", error);
    return "The AI financial advisor is currently offline. Check your connection.";
  }
};
