import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, AlertCircle } from "lucide-react";
import PreviousTransactions from "./PreviousTransactions";

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

  const [allExpenses, setAllExpenses] = useState([]);

  /* ================= FETCH DATA ================= */
  const fetchAllData = async () => {
    const token = await getToken();

    const [budgetRes, incomeRes, expensesRes, allRes] = await Promise.all([
      fetch("http://localhost:5000/api/budget", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://localhost:5000/api/income", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://localhost:5000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://localhost:5000/api/expenses/all", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const budget = await budgetRes.json();
    const income = await incomeRes.json();
    const expenses = await expensesRes.json();
    const all = await allRes.json();

    setBudget(budget?.monthlyLimit ?? null);
    setIncome(income?.amount ?? null);
    setAllExpenses(all);

    const spent = expenses.reduce((s, e) => s + Number(e.amount), 0);
    setTotalSpent(spent);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const remainingBudget =
  budget !== null ? budget - totalSpent : null;


  /* ================= ADD EXPENSE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setWarning("");
  
    const numericAmount = Number(amount);
  
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
  
    // 🔒 BLOCK if budget/income missing
    if (budget === null || income === null) {
      setError("Please set your budget and income before adding expenses.");
      return;
    }
  
    // 🚫 HARD BLOCK: exceeding budget
    if (numericAmount > remainingBudget) {
      setError("This expense exceeds your remaining budget.");
      return;
    }
  
    // ⚠️ SOFT WARNING: close to budget (80%)
    if (numericAmount >= remainingBudget * 0.8) {
      setWarning("⚠ You are close to exhausting your budget.");
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
  

  /* ================= DELETE SINGLE EXPENSE ================= */
  const deleteExpense = async (id) => {
    const token = await getToken();
    await fetch(`http://localhost:5000/api/expenses/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAllData();
  };

  /* ================= UPDATE CATEGORY ================= */
  const updateExpenseCategory = async (id, category) => {
    const token = await getToken();
  
    // 🔥 CLEAR ALL
    if (id === "CLEAR_ALL") {
      await fetch("http://localhost:5000/api/expenses/clear-all", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAllData();
      return;
    }
  
    await fetch(`http://localhost:5000/api/expenses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ category }),
    });
  
    fetchAllData();
  };
  

  return (
    <DashboardLayout>
      <Sidebar active="add-expense" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto mt-10"
      >
        {/* ADD EXPENSE CARD */}
        <Card className="shadow-lg">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <PlusCircle />
              <h2 className="text-xl font-semibold">Add Expense</h2>
            </div>

            {error && (
              <div className="text-red-600 text-sm flex gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {warning && !error && (
              <div className="text-yellow-600 text-sm flex gap-2">
                <AlertCircle size={16} /> {warning}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="number"
                placeholder="Amount (₹)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border rounded-lg p-2"
              />

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
                  placeholder="Custom category"
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

              <button
                disabled={budget === null || income === null}
                className={`w-full py-2 rounded-lg text-white ${
                  budget === null || income === null
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Add Expense
              </button>

            </form>
          </CardContent>
        </Card>

        <br />

        {/* PREVIOUS TRANSACTIONS */}
        <PreviousTransactions
          expenses={allExpenses}
          onDelete={deleteExpense}
          onEdit={updateExpenseCategory}
        />
      </motion.div>
    </DashboardLayout>
  );
}
