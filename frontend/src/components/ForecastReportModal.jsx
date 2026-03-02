import { X } from "lucide-react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#ef4444", "#22c55e"];

export default function ForecastReportModal({
  forecast,
  budget,
  type, // "weekly" | "monthly" | "yearly"
  onClose,
}) {
  if (!forecast || !budget || !type) return null;

  /* =========================
     DYNAMIC FORECAST VALUES
  ========================== */

  const amount =
    type === "weekly"
      ? forecast.weekly
      : type === "monthly"
      ? forecast.monthly
      : forecast.yearly;

  const timeLabel =
    type === "weekly"
      ? "This Week's"
      : type === "monthly"
      ? "This Month's"
      : "This Year's";

  const remaining = Math.max(0, budget - amount);
  const overrun = Math.max(0, amount - budget);

  const pieData = [
    { name: "Predicted Spend", value: amount },
    { name: "Remaining Budget", value: remaining },
  ];

  /* =========================
     RISK TEXT
  ========================== */

  const riskText =
    forecast.budgetRisk === "High"
      ? "High risk of budget overrun"
      : forecast.budgetRisk === "Medium"
      ? "Moderate risk, spending needs control"
      : "Low risk, spending is under control";

  /* =========================
     TREND DESCRIPTION
  ========================== */

  const trendDescription =
    forecast.trend === "Increasing"
      ? "Your expenses are rising over time, which may cause financial stress if not controlled."
      : forecast.trend === "Decreasing"
      ? "Your spending is gradually reducing, indicating better financial discipline."
      : "Your spending pattern is stable with no major fluctuations.";

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-4xl rounded-xl shadow-xl p-6 relative overflow-y-auto max-h-[90vh]"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          <X size={22} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-blue-700 mb-2">
          {timeLabel} Financial Forecast Report
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          AI-generated spending analysis based on your historical expenses
        </p>

        {/* =========================
           SUMMARY CARDS
        ========================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-600">Predicted Spend</p>
            <p className="font-bold text-xl">₹{amount}</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-gray-600">Remaining Budget</p>
            <p className="font-bold text-xl">₹{remaining}</p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-gray-600">Health Score</p>
            <p className="font-bold text-xl">
              {forecast.healthScore}/100
            </p>
          </div>
        </div>

        {/* =========================
           ALL FORECAST RANGE
        ========================== */}
        <div className="grid grid-cols-3 gap-4 mb-6 text-sm text-center">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Weekly</p>
            <p className="font-bold">₹{forecast.weekly}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Monthly</p>
            <p className="font-bold">₹{forecast.monthly}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Yearly</p>
            <p className="font-bold">₹{forecast.yearly}</p>
          </div>
        </div>

        {/* =========================
           PIE CHART
        ========================== */}
        <div className="h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={60}
                outerRadius={90}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* =========================
           TREND ANALYSIS
        ========================== */}
        <div className="p-4 bg-blue-50 rounded-lg mb-4 text-sm">
          <p className="font-semibold mb-1">📈 Spending Trend</p>
          <p>{trendDescription}</p>
          <p className="mt-1 text-xs text-gray-600">
            Trend slope value: {forecast.slope}
          </p>
        </div>

        {/* =========================
           BUDGET UTILIZATION
        ========================== */}
        <div className="p-4 bg-purple-50 rounded-lg mb-4 text-sm">
          <p className="font-semibold mb-1">🧮 Budget Utilization</p>
          <p>
            You have used <b>{forecast.budgetUsage}%</b> of your budget.
          </p>
          <p className="mt-1">{riskText}</p>
        </div>

        {/* =========================
           RISK SCENARIO
        ========================== */}
        <div className="p-4 bg-red-50 rounded-lg mb-4 text-sm">
          <p className="font-semibold mb-1">⚠️ Risk Scenario</p>
          <ul className="list-disc ml-5">
            <li>
              Expected spend {timeLabel.toLowerCase()}: ₹{amount}
            </li>
            <li>Budget risk level: {forecast.budgetRisk}</li>
            {overrun > 0 && (
              <li className="text-red-600">
                Possible budget overrun: ₹{overrun}
              </li>
            )}
          </ul>
        </div>

        {/* =========================
   FORECAST COMPARISON TABLE
========================== */}
        <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Forecast Comparison
        </h3>

        <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
                <tr>
                <th className="p-2 border">Period</th>
                <th className="p-2 border">Predicted Spend</th>
                <th className="p-2 border">Budget</th>
                <th className="p-2 border">Remaining</th>
                <th className="p-2 border">Risk</th>
                </tr>
            </thead>
            <tbody>
                {[
                { label: "Weekly", value: forecast.weekly },
                { label: "Monthly", value: forecast.monthly },
                { label: "Yearly", value: forecast.yearly },
                ].map((row) => {
                const rem = Math.max(0, budget - row.value);
                const risk =
                    row.value > budget
                    ? "High"
                    : row.value > budget * 0.8
                    ? "Medium"
                    : "Low";

                return (
                    <tr key={row.label} className="text-center">
                    <td className="p-2 border">{row.label}</td>
                    <td className="p-2 border font-semibold">
                        ₹{row.value}
                    </td>
                    <td className="p-2 border">₹{budget}</td>
                    <td className="p-2 border">₹{rem}</td>
                    <td
                        className={`p-2 border font-medium ${
                        risk === "High"
                            ? "text-red-600"
                            : risk === "Medium"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                    >
                        {risk}
                    </td>
                    </tr>
                );
                })}
            </tbody>
            </table>
        </div>
        </div>

            {/* =========================
                FINANCIAL HEALTH BREAKDOWN
                ========================== */}
        <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Financial Health Breakdown
        </h3>

        <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
                <tr>
                <th className="p-2 border">Metric</th>
                <th className="p-2 border">Value</th>
                <th className="p-2 border">Interpretation</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td className="p-2 border">Health Score</td>
                <td className="p-2 border text-center font-semibold">
                    {forecast.healthScore}/100
                </td>
                <td className="p-2 border">
                    {forecast.healthScore >= 80
                    ? "Excellent financial condition"
                    : forecast.healthScore >= 60
                    ? "Moderate financial stability"
                    : "Financial stress detected"}
                </td>
                </tr>

                <tr>
                <td className="p-2 border">Spending Trend</td>
                <td className="p-2 border text-center">
                    {forecast.trend}
                </td>
                <td className="p-2 border">
                    {forecast.trend === "Increasing"
                    ? "Expenses rising over time"
                    : forecast.trend === "Decreasing"
                    ? "Expenses reducing gradually"
                    : "Stable spending pattern"}
                </td>
                </tr>

                <tr>
                <td className="p-2 border">Budget Usage</td>
                <td className="p-2 border text-center">
                    {forecast.budgetUsage}%
                </td>
                <td className="p-2 border">
                    {forecast.budgetUsage > 90
                    ? "Very high budget consumption"
                    : forecast.budgetUsage > 70
                    ? "Budget usage is high"
                    : "Healthy budget usage"}
                </td>
                </tr>

                <tr>
                <td className="p-2 border">Prediction Reliability</td>
                <td className="p-2 border text-center">
                    {forecast.reliability}
                </td>
                <td className="p-2 border">
                    Based on amount of historical data available
                </td>
                </tr>
            </tbody>
            </table>
        </div>
        </div>



      </motion.div>
    </div>
  );
}
