import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { db } from "../db/index.js";
import { expenses } from "../db/schema.js";
import { eq, sql } from "drizzle-orm";

const router = express.Router();


// Add expense
router.post("/", requireAuth, async (req, res) => {
  const { userId } = req.auth;
  const { amount, category, note } = req.body;

  await db.insert(expenses).values({
    userId,
    amount,
    category,
    note,
  });

  res.json({ success: true });
});


// Get user expenses
router.get("/", requireAuth, async (req, res) => {
  const { userId } = req.auth;

  const data = await db
    .select()
    .from(expenses)
    .where(eq(expenses.userId, userId))
    .orderBy(expenses.createdAt);

  res.json(data);
});


// Delete expense
router.delete("/:id", requireAuth, async (req, res) => {
  const { userId } = req.auth;
  const { id } = req.params;

  await db
    .delete(expenses)
    .where(eq(expenses.id, id));

  res.json({ success: true });
});

//Summary:
router.get("/summary", requireAuth, async (req, res) => {
    const { userId } = req.auth;
  
    const result = await db.execute(sql`
      SELECT 
        category,
        SUM(amount)::int as total
      FROM expenses
      WHERE user_id = ${userId}
      GROUP BY category
    `);
  
    res.json(result.rows);
});

export default router;
