import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

router.post("/chat", requireAuth, async (req, res) => {
  try {
    const { message, context } = req.body;

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash", 
      });      

    const prompt = `
You are Moodbit, a friendly financial assistant.

User data:
- Budget: ${context.budget}
- Total Spent: ${context.totalSpent}
- Health Score: ${context.healthScore}
- Mood: ${context.mood}

User question:
${message}

Give short, practical, motivating advice in 2-3 lines.
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI error" });
  }
});

export default router;
