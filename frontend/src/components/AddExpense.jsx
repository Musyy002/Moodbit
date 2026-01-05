import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, AlertCircle } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import DashboardLayout from "./DashboardLayout";
import Sidebar from "./Sidebar";

const CATEGORY_OPTIONS = [
  "Food",
  "Travel",
  "Shopping",
  "Rent",
  "Entertainment",
  "Health",
  "Education",
  "Other",
];

export default function AddExpense() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [note, setNote] = useState("");

  const [budget, setBudget] = useState(null);
  const [income, setIncome] = useState(null);
  const [totalSpent, setTotalSpent] = useState(0);

  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  /* 🔹 Fetch budget, income & total spent */
  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();

      const [budgetRes, incomeRes, expenseRes] = await Promise.all([
        fetch("http://localhost:5000/api/budget", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/income", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/expenses", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const budgetData = await budgetRes.json();
      const incomeData = await incomeRes.json();
      const expensesData = await expenseRes.json();

      setBudget(budgetData?.monthlyLimit ?? null);
      setIncome(incomeData?.amount ?? null);

      const spent = expensesData.reduce(
        (sum, e) => sum + Number(e.amount),
        0
      );
      setTotalSpent(spent);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setWarning("");

    const numericAmount = Number(amount);

    /* 🔒 Basic validation */
    if (numericAmount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    if (!selectedCategory) {
      setError("Please select a category.");
      return;
    }

    if (selectedCategory === "Other" && !customCategory.trim()) {
      setError("Please enter a custom category.");
      return;
    }

    /* 💰 Remaining calculations (RAW) */
    const rawRemainingBudget =
      budget != null ? budget - totalSpent : null;

    const rawRemainingIncome =
      income != null ? income - totalSpent : null;

    /* 🚫 HARD BLOCKS (ONLY when exceeding) */
    if (rawRemainingBudget != null && numericAmount > rawRemainingBudget) {
      setError(
        `You only have ₹${Math.max(0, rawRemainingBudget)} remaining in your budget.`
      );
      return;
    }

    if (rawRemainingIncome != null && numericAmount > rawRemainingIncome) {
      setError(
        `You only have ₹${Math.max(0, rawRemainingIncome)} remaining from your income.`
      );
      return;
    }

    /* ⚠️ SOFT WARNING (still allow submit) */
    if (
      rawRemainingBudget != null &&
      numericAmount >= rawRemainingBudget * 0.8 &&
      numericAmount <= rawRemainingBudget
    ) {
      setWarning("⚠ You are close to exceeding your budget.");
    }

    const finalCategory =
      selectedCategory === "Other"
        ? customCategory.trim()
        : selectedCategory;

    const token = await getToken();

    await fetch("http://localhost:5000/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: numericAmount,
        category: finalCategory,
        note,
      }),
    });

    navigate("/dashboard");
  };

  return (
    <DashboardLayout>
      <Sidebar active="add-expense" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto mt-10"
      >
        <Card className="shadow-lg">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <PlusCircle />
              <h2 className="text-xl font-semibold">Add Expense</h2>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Warning */}
            {warning && !error && (
              <div className="flex items-center gap-2 text-yellow-600 text-sm">
                <AlertCircle size={16} />
                {warning}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="number"
                placeholder="Amount (₹)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border rounded-lg p-2 focus:outline-blue-500"
              />

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedCategory === "Other" && (
                <input
                  placeholder="Enter custom category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              )}

              <input
                placeholder="Note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border rounded-lg p-2"
              />

              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Add Expense
              </button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
