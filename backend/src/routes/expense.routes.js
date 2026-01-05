import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { db } from "../db/index.js";
import { expenses, budgets, userIncome as userIncomeTable } from "../db/schema.js";
import { eq, sql } from "drizzle-orm";

const router = express.Router();

/**
 * =========================
 * ADD EXPENSE
 * =========================
 */
router.post("/", requireAuth, async (req, res) => {
  const { userId } = req.auth;
  let { amount, category, note } = req.body;

  // 🔒 Normalize amount
  amount = Number(amount);

  // 🔹 Basic validation
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid expense amount" });
  }

  if (!category || !category.trim()) {
    return res.status(400).json({ error: "Category is required" });
  }

  /* =========================
     FETCH USER DATA
  ========================== */

  const [budget] = await db
    .select()
    .from(budgets)
    .where(eq(budgets.userId, userId));

  const [incomeRow] = await db
    .select()
    .from(userIncomeTable)
    .where(eq(userIncomeTable.userId, userId));

  const spentResult = await db.execute(sql`
    SELECT COALESCE(SUM(amount), 0) AS total
    FROM expenses
    WHERE user_id = ${userId}
  `);

  const totalSpent = Number(spentResult.rows[0].total || 0);

  /* =========================
     HARD BLOCK RULES
  ========================== */

  // 🔒 Budget protection
  if (budget && totalSpent + amount > Number(budget.monthlyLimit)) {
    return res.status(400).json({
      error: "This expense will exceed your monthly budget",
    });
  }

  // 🔒 Income protection
  if (incomeRow && totalSpent + amount > Number(incomeRow.amount)) {
    return res.status(400).json({
      error: "This expense will exceed your available income",
    });
  }

  /* =========================
     INSERT EXPENSE
  ========================== */

  await db.insert(expenses).values({
    userId,
    amount,
    category: category.trim(),
    note,
  });

  res.json({ success: true });
});

/**
 * =========================
 * GET EXPENSES
 * =========================
 */
router.get("/", requireAuth, async (req, res) => {
  const { userId } = req.auth;

  const data = await db
    .select()
    .from(expenses)
    .where(eq(expenses.userId, userId))
    .orderBy(expenses.createdAt);

  res.json(data);
});

/**
 * =========================
 * DELETE EXPENSE
 * =========================
 */
router.delete("/:id", requireAuth, async (req, res) => {
  const { userId } = req.auth;
  const { id } = req.params;

  await db
    .delete(expenses)
    .where(
      sql`${expenses.id} = ${id} AND ${expenses.userId} = ${userId}`
    );

  res.json({ success: true });
});

/**
 * =========================
 * CATEGORY SUMMARY
 * =========================
 */
router.get("/summary", requireAuth, async (req, res) => {
  const { userId } = req.auth;

  const result = await db.execute(sql`
    SELECT category, SUM(amount)::int AS total
    FROM expenses
    WHERE user_id = ${userId}
    GROUP BY category
  `);

  res.json(result.rows);
});

export default router;
