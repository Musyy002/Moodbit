import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { db } from "../db/index.js";
import { expenses, budgets, userIncome } from "../db/schema.js";
import { eq, and, sql } from "drizzle-orm";

const router = express.Router();

/* =========================
   ADD EXPENSE
========================= */
router.post("/", requireAuth, async (req, res) => {
  try {
    const { userId } = req.auth;
    let { amount, category, note } = req.body;

    amount = Number(amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid expense amount" });
    }

    if (!category?.trim()) {
      return res.status(400).json({ error: "Category is required" });
    }

    const [budget] = await db
      .select()
      .from(budgets)
      .where(eq(budgets.userId, userId));

    const [income] = await db
      .select()
      .from(userIncome)
      .where(eq(userIncome.userId, userId));

    const spent = await db.execute(sql`
      SELECT COALESCE(SUM(amount), 0) AS total
      FROM expenses
      WHERE user_id = ${userId} AND is_deleted = false
    `);

    const totalSpent = Number(spent.rows[0].total);

    if (budget && totalSpent + amount > Number(budget.monthlyLimit)) {
      return res.status(400).json({ error: "Monthly budget exceeded" });
    }

    if (income && totalSpent + amount > Number(income.amount)) {
      return res.status(400).json({ error: "Income limit exceeded" });
    }

    await db.insert(expenses).values({
      userId,
      amount,
      category: category.trim(),
      note,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add expense" });
  }
});

/* =========================
   GET ACTIVE EXPENSES
========================= */
router.get("/", requireAuth, async (req, res) => {
  try {
    const { userId } = req.auth;

    const data = await db
      .select()
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, userId),
          eq(expenses.isDeleted, false)
        )
      )
      .orderBy(expenses.createdAt);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

/* =========================
   GET ALL (INCLUDING DELETED)
========================= */
router.get("/all", requireAuth, async (req, res) => {
  const { userId } = req.auth;

  const data = await db
    .select()
    .from(expenses)
    .where(eq(expenses.userId, userId))
    .orderBy(expenses.createdAt);

  res.json(data);
});

router.put("/update-category", requireAuth, async (req, res) => {
  const { userId } = req.auth;
  const { oldCategory, newCategory } = req.body;

  if (!oldCategory || !newCategory) {
    return res.status(400).json({ error: "Invalid category" });
  }

  await db
    .update(expenses)
    .set({ category: newCategory })
    .where(
      and(
        eq(expenses.userId, userId),
        eq(expenses.category, oldCategory),
        eq(expenses.isDeleted, false)
      )
    );

  res.json({ success: true });
});

/* =========================
   UPDATE GROUP (DASHBOARD)
========================= */
router.put("/update-group", requireAuth, async (req, res) => {
  try {
    const { userId } = req.auth;
    const { ids, newCategory, ratio } = req.body;

    if (!ids?.length || !newCategory || !ratio) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    // Fetch only user's valid expenses
    const rows = await db
      .select()
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, userId),
          eq(expenses.isDeleted, false),
          sql`${expenses.id} IN ${ids}`
        )
      );

    if (!rows.length) {
      return res.status(404).json({ error: "No expenses found" });
    }

    // Update each expense safely
    for (const exp of rows) {
      await db
        .update(expenses)
        .set({
          category: newCategory,
          amount: Math.round(Number(exp.amount) * ratio),
        })
        .where(eq(expenses.id, exp.id));
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Update group error:", err);
    res.status(500).json({ error: "Failed to update expense group" });
  }
});


router.delete("/clear-all", requireAuth, async (req, res) => {
  const { userId } = req.auth;

  await db
    .update(expenses)
    .set({ isDeleted: true })
    .where(eq(expenses.userId, userId));

  res.json({ success: true });
});

/* =========================
   DELETE EXPENSE
========================= */
router.delete("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.auth;

  await db
    .update(expenses)
    .set({ isDeleted: true })
    .where(and(eq(expenses.id, id), eq(expenses.userId, userId)));

  res.json({ success: true });
});




/* =========================
   CATEGORY SUMMARY
========================= */
router.get("/summary", requireAuth, async (req, res) => {
  const { userId } = req.auth;

  const result = await db.execute(sql`
    SELECT category, SUM(amount)::int AS total
    FROM expenses
    WHERE user_id = ${userId} AND is_deleted = false
    GROUP BY category
  `);

  res.json(result.rows);
});

export default router;
