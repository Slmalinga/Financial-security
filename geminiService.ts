import { GoogleGenAI } from "@google/genai";
import { Transaction } from "./types";

// SECURITY WARNING: This calls the Gemini API directly from the browser, which
// requires the API key to be present in the client bundle (see vite.config.ts).
// Any user can extract that key from the shipped JavaScript. Before production,
// move these calls behind a server-side proxy that holds GEMINI_API_KEY and
// forwards requests, so the key never reaches the client.
export const getFinancialAdvice = async (transactions: Transaction[], income: number) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return "AI insights are unavailable: the AI service is not configured.";
  }

  const ai = new GoogleGenAI({ apiKey });

  const summary = transactions.reduce((acc, t) => {
    if (t.type !== 'Income') {
      acc[t.type] = (acc[t.type] || 0) + t.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const prompt = `
    Analyze my monthly financial health based on the 50/30/20 rule.
    Monthly Income: $${income}
    Spending:
    - Needs: $${summary.Need || 0}
    - Wants: $${summary.Want || 0}
    - Savings: $${summary.Saving || 0}
    
    Recent Transactions: ${transactions.slice(0, 5).map(t => `${t.description}: $${t.amount}`).join(', ')}
    
    Provide a concise, encouraging, and actionable financial insight in 3-4 sentences.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });
    // Correctly using the .text property as per GenerateContentResponse definition.
    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI financial advisor is currently offline. Check your connection.";
  }
};
