import express from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { userStats } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import {
  calculateLevel,
  unlockBadges,
} from "../utils/gamification.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const userId = req.auth.userId;

  const [stats] = await db
    .select()
    .from(userStats)
    .where(eq(userStats.userId, userId));

  res.json(
    stats || {
      xp: 0,
      level: 1,
      saverDays: 0,
      happyDays: 0,
      badges: [],
    }
  );
});

router.post("/xp", requireAuth, async (req, res) => {
  const userId = req.auth.userId;
  const { xp = 0, happy = false, saver = false } = req.body;

  const [existing] = await db
    .select()
    .from(userStats)
    .where(eq(userStats.userId, userId));

  const newXp = (existing?.xp || 0) + xp;
  const level = calculateLevel(newXp);

  const newStats = {
    xp: newXp,
    level,
    saverDays: (existing?.saverDays || 0) + (saver ? 1 : 0),
    happyDays: (existing?.happyDays || 0) + (happy ? 1 : 0),
    badges: unlockBadges({
      ...existing,
      xp: newXp,
      level,
      saverDays:
        (existing?.saverDays || 0) + (saver ? 1 : 0),
      happyDays:
        (existing?.happyDays || 0) + (happy ? 1 : 0),
    }),
  };

  await db
    .insert(userStats)
    .values({ userId, ...newStats })
    .onConflictDoUpdate({
      target: userStats.userId,
      set: newStats,
    });

  res.json(newStats);
});

export default router;
