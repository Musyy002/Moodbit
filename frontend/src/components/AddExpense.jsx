import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import DashboardLayout from "./DashboardLayout";
import Sidebar from "./Sidebar";

export default function AddExpense() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = await getToken();

    await fetch("http://localhost:5000/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: Number(amount),
        category,
        note,
      }),
    });

    navigate("/dashboard"); 
  };

  return (
    <DashboardLayout>
    <Sidebar active="add-expense"/>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="number"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded-lg p-2 focus:outline-blue-500"
              required
            />

            <input
              placeholder="Category (Food, Travel...)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-lg p-2 focus:outline-blue-500"
              required
            />

            <input
              placeholder="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border rounded-lg p-2 focus:outline-blue-500"
            />

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Add Expense
            </button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
    </DashboardLayout>
  );
}
