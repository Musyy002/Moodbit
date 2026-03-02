import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Pencil } from "lucide-react";
import { motion } from "framer-motion";

/* ---------- Constants ---------- */
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

const PASTEL_COLORS = [
  "bg-yellow-100",
  "bg-blue-100",
  "bg-green-100",
  "bg-pink-100",
  "bg-purple-100",
  "bg-orange-100",
];

/* ---------- Edit Modal ---------- */
function EditExpenseGroupModal({
  category,
  total,
  onClose,
  onSave,
}) {
  const [newCategory, setNewCategory] = useState(category);
  const [customCategory, setCustomCategory] = useState("");
  const [newAmount, setNewAmount] = useState(total);

  const finalCategory =
    newCategory === "Other" ? customCategory.trim() : newCategory;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-5 w-full max-w-sm space-y-4"
      >
        <h3 className="font-semibold text-lg">Edit Expense Group</h3>

        {/* Category */}
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="w-full border rounded p-2"
        >
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {newCategory === "Other" && (
          <input
            placeholder="Custom category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="w-full border rounded p-2"
          />
        )}

        {/* Amount */}
        <input
          type="number"
          value={newAmount}
          onChange={(e) => setNewAmount(Number(e.target.value))}
          className="w-full border rounded p-2"
          placeholder="Total amount"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">
            Cancel
          </button>
          <button
            onClick={() => onSave(finalCategory, newAmount)}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- Dashboard Expense List ---------- */
export default function ExpenseList({ expenses }) {
  const { getToken } = useAuth();
  const [grouped, setGrouped] = useState({});
  const [editing, setEditing] = useState(null);

  /* ---------- Grouping ---------- */
  useEffect(() => {
    const map = {};

    expenses.forEach((e) => {
      if (e.isDeleted) return;

      if (!map[e.category]) {
        map[e.category] = { total: 0, ids: [] };
      }
      map[e.category].total += Number(e.amount);
      map[e.category].ids.push(e.id);
    });

    setGrouped(map);
  }, [expenses]);

  /* ---------- Save Edit ---------- */
  const saveEdit = async (newCategory, newAmount) => {
    const token = await getToken();
    const { category, ids, total } = editing;

    const ratio = newAmount / total;

    await fetch("http://localhost:5000/api/expenses/update-group", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ids,
        oldCategory: category,
        newCategory,
        ratio,
      }),
    });

    setEditing(null);
    window.location.reload(); // safe + simple
  };

  return (
    <>
      <div className="space-y-3">
        {Object.entries(grouped).map(([category, data], i) => (
          <div
            key={category}
            className={`flex justify-between items-center p-4 rounded-xl ${
              PASTEL_COLORS[i % PASTEL_COLORS.length]
            }`}
          >
            <div>
              <p className="font-medium">{category}</p>
              <p className="text-sm text-gray-600">
                ₹{data.total}
              </p>
            </div>

            <button
              onClick={() =>
                setEditing({
                  category,
                  total: data.total,
                  ids: data.ids,
                })
              }
            >
              <Pencil size={16} />
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <EditExpenseGroupModal
          category={editing.category}
          total={editing.total}
          onClose={() => setEditing(null)}
          onSave={saveEdit}
        />
      )}
    </>
  );
}
