import express from "express";
import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { userIncome } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET income
 * Returns user's income if exists
 */
router.get("/", requireAuth, async (req, res) => {
  const userId = req.auth.userId;

  const [income] = await db
    .select()
    .from(userIncome)
    .where(eq(userIncome.userId, userId));

  res.json(income || null);
});

/**
 * CREATE / UPDATE income
 */
router.post("/", requireAuth, async (req, res) => {
  const userId = req.auth.userId;
  const { amount, source, frequency } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid income amount" });
  }

  if (!["weekly", "monthly", "yearly"].includes(frequency)) {
    return res.status(400).json({ error: "Invalid frequency" });
  }

  await db
    .insert(userIncome)
    .values({
      userId,
      amount,
      source,
      frequency,
    })
    .onConflictDoUpdate({
      target: userIncome.userId,
      set: {
        amount,
        source,
        frequency,
      },
    });

  res.json({ success: true });
});

export default router;
