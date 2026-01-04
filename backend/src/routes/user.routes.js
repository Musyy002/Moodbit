import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { db } from "../db/index.js";
import { users, expenses, budgets, userStats } from "../db/schema.js";
import { eq } from "drizzle-orm";

const router = express.Router();

router.post("/sync", requireAuth, async (req, res) => {
  console.log("API is working!!");

  const { userId } = req.auth;
  const { email } = req.body;

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));

  if (existing.length === 0) {
    await db.insert(users).values({
      id: userId,
      email,
    });
  }

  res.json({ success: true });
});

router.delete("/delete", requireAuth, async (req, res) => {
  try {
    const userId = req.auth.userId;

    await db.delete(expenses).where(eq(expenses.userId, userId));
    await db.delete(budgets).where(eq(budgets.userId, userId));
    await db.delete(userStats).where(eq(userStats.userId, userId));

    //Delete user
    await db.delete(users).where(eq(users.id, userId));

    res.json({ success: true });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ error: "Failed to delete account" });
  }
});

export default router;
