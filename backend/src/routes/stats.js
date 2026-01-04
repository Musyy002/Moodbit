import express from "express";
import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { userStats } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import { calculateLevel } from "../../../frontend/src/utils/gamification.js";

const router = express.Router();

// 🔹 GET user stats
router.get("/", requireAuth, async (req, res) => {
  const userId = req.auth.userId;

  const [stats] = await db
    .select()
    .from(userStats)
    .where(eq(userStats.userId, userId));

  res.json(stats || { xp: 0, level: 1, badges: [] });
});

// 🔹 ADD XP
router.post("/xp", requireAuth, async (req, res) => {
  const userId = req.auth.userId;
  const { xp } = req.body;

  const [stats] = await db
    .select()
    .from(userStats)
    .where(eq(userStats.userId, userId));

  const newXp = (stats?.xp || 0) + xp;
  const level = calculateLevel(newXp);

  await db
    .insert(userStats)
    .values({ userId, xp: newXp, level })
    .onConflictDoUpdate({
      target: userStats.userId,
      set: { xp: newXp, level },
    });

  res.json({ xp: newXp, level });
});

export default router;
