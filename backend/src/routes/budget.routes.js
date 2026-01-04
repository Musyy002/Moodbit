import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { db } from "../db/index.js";
import { budgets } from "../db/schema.js";
import { eq } from "drizzle-orm";

const router = express.Router();

//Set / Update budget
router.post("/", requireAuth, async (req, res) => {
  const { userId } = req.auth;
  const { monthlyLimit } = req.body;

  const existing = await db
    .select()
    .from(budgets)
    .where(eq(budgets.userId, userId));

  if (existing.length === 0) {
    await db.insert(budgets).values({ userId, monthlyLimit });
  } else {
    await db
      .update(budgets)
      .set({ monthlyLimit })
      .where(eq(budgets.userId, userId));
  }

  res.json({ success: true });
});

// Get budget
router.get("/", requireAuth, async (req, res) => {
  const { userId } = req.auth;

  const data = await db
    .select()
    .from(budgets)
    .where(eq(budgets.userId, userId));

  res.json(data[0] || null);
});

export default router;
