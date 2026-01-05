import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  
  export default function IncomeExpenseChart({
    income,
    totalSpent,
  }) {
    if (!income) {
      return (
        <div className="p-6 rounded-xl bg-gray-50 text-gray-500">
          Set income to view insights
        </div>
      );
    }
  
    const savings = income - totalSpent;
  
    const data = [
      { name: "Income", value: income },
      { name: "Expenses", value: totalSpent },
      { name: "Savings", value: savings },
    ];
  
    return (
      <div className="p-6 rounded-xl shadow-sm bg-white">
        <h2 className="text-lg font-semibold mb-4 text-blue-700">
          Income vs Expenses
        </h2>
  
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  