import { useState, useEffect } from "react";
import { Trash2, Pencil, X } from "lucide-react";

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

export default function PreviousTransactions({
  expenses,
  onDelete,
  onEdit,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editedCategory, setEditedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const [visibleExpenses, setVisibleExpenses] = useState([]);
  const [clearedAll, setClearedAll] = useState(false);

  /* 🔁 Sync only NON-DELETED expenses */
  useEffect(() => {
    const activeExpenses = expenses.filter((e) => !e.isDeleted);

    // After clear-all, stay empty until a new expense is added
    if (clearedAll && activeExpenses.length === 0) return;

    if (activeExpenses.length > 0) {
      setClearedAll(false); // unlock when new data appears
      setVisibleExpenses(activeExpenses);
    } else {
      setVisibleExpenses([]);
    }
  }, [expenses, clearedAll]);

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditedCategory(expense.category);
    setCustomCategory("");
  };

  const saveEdit = (id) => {
    const finalCategory =
      editedCategory === "Other"
        ? customCategory.trim()
        : editedCategory;

    if (!finalCategory) return;

    onEdit(id, finalCategory);
    setEditingId(null);
  };

  return (
    <div className="mt-6 border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">Previous Transactions</h3>

        {/* CLEAR ALL */}
        <button
          onClick={() => {
            setClearedAll(true);
            setVisibleExpenses([]);
            onEdit("CLEAR_ALL");
          }}
          className="text-sm text-red-600 hover:underline"
        >
          Clear All
        </button>
      </div>

      {visibleExpenses.length === 0 && (
        <p className="text-sm text-gray-500 text-center">
          No transactions found
        </p>
      )}

      <div className="space-y-2">
        {visibleExpenses.map((e) => (
          <div
            key={e.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            {/* LEFT */}
            {editingId === e.id ? (
              <div className="flex-1 space-y-2">
                <select
                  value={editedCategory}
                  onChange={(ev) => setEditedCategory(ev.target.value)}
                  className="w-full border rounded p-1"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                {editedCategory === "Other" && (
                  <input
                    placeholder="Custom category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full border rounded p-1"
                  />
                )}
              </div>
            ) : (
              <span>
                {e.category} – ₹{e.amount}
              </span>
            )}

            {/* RIGHT */}
            <div className="flex gap-2">
              {editingId === e.id ? (
                <>
                  <button
                    onClick={() => saveEdit(e.id)}
                    className="text-green-600 text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-500"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(e)}>
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => onDelete(e.id)}>
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
