import { motion } from "framer-motion";
import { Wallet, Plus, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BudgetCard({
  income,
  budget,
  totalSpent,
}) {
  const navigate = useNavigate();

  // 🔒 Clamp values (never negative)
  const remainingIncome =
    income != null ? Math.max(0, income - totalSpent) : null;

  const remainingBudget =
    budget != null ? Math.max(0, budget - totalSpent) : null;

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="p-6 rounded-xl shadow-xl bg-blue-50 relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-blue-700">
          <Wallet />
          <h2 className="text-lg font-semibold">
            Financial Overview
          </h2>
        </div>

        {/* Add / Edit Budget */}
        <button
          onClick={() => navigate("/dashboard/settings")}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition"
        >
          {budget ? (
            <>
              <Pencil size={14} /> Edit
            </>
          ) : (
            <>
              <Plus size={14} /> Add
            </>
          )}
        </button>
      </div>

      {/* Body */}
      <div className="space-y-2 text-sm">
        {/* Income */}
        <div className="flex justify-between">
          <span className="text-gray-600">Income</span>
          <span className="font-semibold">
            {income != null ? `₹${income}` : "—"}
          </span>
        </div>

        {/* Budget */}
        <div className="flex justify-between">
          <span className="text-gray-600">Budget</span>
          <span className="font-semibold">
            {budget != null ? `₹${budget}` : "—"}
          </span>
        </div>

        {/* Spent */}
        <div className="flex justify-between">
          <span className="text-gray-600">Spent</span>
          <span className="font-semibold text-red-600">
            ₹{totalSpent}
          </span>
        </div>

        {/* Remaining Budget */}
        {remainingBudget != null && (
          <div className="flex justify-between border-t pt-2 mt-2">
            <span className="text-gray-700 font-medium">
              Remaining Budget
            </span>
            <span className="font-bold text-green-600">
              ₹{remainingBudget}
            </span>
          </div>
        )}

        {/* Remaining Income */}
        {remainingIncome != null && (
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">
              Remaining Income
            </span>
            <span className="font-bold text-green-600">
              ₹{remainingIncome}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
