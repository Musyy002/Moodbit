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
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    const withColors = data.map((e) => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        ...e,
        bgColor: color,
        textColor: getTextColor(color),
      };
    });

    setExpenses(withColors);
  };

  const deleteExpense = async (id) => {
    const token = await getToken();

    await fetch(`http://localhost:5000/api/expenses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchExpenses();
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="mt-4 space-y-3">
      {expenses.map((e) => (
        <div
          key={e.id}
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
            onClick={() => deleteExpense(e.id)}
            className="hover:opacity-70 transition"
            title="Delete expense"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
