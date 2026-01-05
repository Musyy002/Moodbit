import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Trash2 } from "lucide-react";

const COLORS = [
  "#fde68a",
  "#bfdbfe",
  "#fecaca",
  "#bbf7d0",
  "#ddd6fe",
  "#fbcfe8",
];

const getTextColor = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150 ? "#1f2937" : "#ffffff";
};

export default function ExpenseList() {
  const { getToken } = useAuth();
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    const token = await getToken();

    const res = await fetch("http://localhost:5000/api/expenses", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    // 🔹 GROUP BY CATEGORY
    const grouped = {};

    data.forEach((e) => {
      if (!grouped[e.category]) {
        grouped[e.category] = {
          total: 0,
          ids: [],
        };
      }
      grouped[e.category].total += e.amount;
      grouped[e.category].ids.push(e.id);
    });

    // 🔹 FORMAT FOR UI
    const formatted = Object.entries(grouped).map(
      ([category, value], index) => {
        const color = COLORS[index % COLORS.length];
        return {
          category,
          amount: value.total,
          ids: value.ids,
          bgColor: color,
          textColor: getTextColor(color),
        };
      }
    );

    setExpenses(formatted);
  };

  // 🗑 Delete all expenses of a category
  const deleteCategory = async (ids) => {
    const token = await getToken();

    await Promise.all(
      ids.map((id) =>
        fetch(`http://localhost:5000/api/expenses/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      )
    );

    fetchExpenses();
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="mt-4 space-y-3">
      {expenses.map((e) => (
        <div
          key={e.category}
          style={{
            backgroundColor: e.bgColor,
            color: e.textColor,
          }}
          className="flex justify-between items-center p-3 rounded-lg shadow-sm"
        >
          <span className="font-medium">
            {e.category} – ₹{e.amount}
          </span>

          <button
            onClick={() => deleteCategory(e.ids)}
            title="Delete category expenses"
            className="hover:opacity-70 transition"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
