import { GoogleGenAI } from "@google/genai";

// Vercel Serverless Function.
// The Gemini API key lives ONLY here, as a server-side environment variable
// (GEMINI_API_KEY set in the Vercel project settings). It is never sent to the
// browser, so it cannot be extracted from the client bundle.

interface Transaction {
  description: string;
  amount: number;
  type: string;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "AI service is not configured." });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const transactions: Transaction[] = Array.isArray(body?.transactions) ? body.transactions : [];
    const income: number = Number.isFinite(body?.income) ? body.income : 0;

    const summary = transactions.reduce((acc, t) => {
      if (t.type !== "Income") {
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

      Recent Transactions: ${transactions
        .slice(0, 5)
        .map((t) => `${t.description}: $${t.amount}`)
        .join(", ")}

      Provide a concise, encouraging, and actionable financial insight in 3-4 sentences.
    `;

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    res.status(200).json({ advice: response.text || "Unable to generate insights at this time." });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(502).json({ error: "The AI financial advisor is currently offline." });
  }
}
