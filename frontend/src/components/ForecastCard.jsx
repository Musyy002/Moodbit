import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Calendar, BrainIcon } from "lucide-react";

export default function ForecastCard({
  title,
  amount,
  budget,
  insight,
  reliability,
  icon: Icon = Calendar,
}) {
  if (amount == null) {
    return (
      <div className="p-6 rounded-xl bg-gray-100 text-gray-500 text-center">
        <p className="text-sm">Not enough data to predict</p>
      </div>
    );
  }

  const danger = budget && amount > budget;

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`p-6 rounded-xl shadow-md ${
        danger ? "bg-red-50" : "bg-blue-50"
      }`}
    >
      <div className="flex items-center gap-2 text-blue-700 mb-2">
        <Icon size={20} />
        <h2 className="text-md font-semibold">{title}</h2>
      </div>

      <p className="text-3xl font-bold text-gray-900">₹{amount}</p>

      {budget && (
        <p
          className={`mt-1 text-sm ${
            danger ? "text-red-600" : "text-green-600"
          }`}
        >
          {danger
            ? "⚠️ May exceed your budget"
            : "✅ Within safe limit"}
        </p>
      )}

      {/* Insight */}
      {insight && (
        <p className="mt-3 text-sm text-gray-600">
           {insight}
        </p>
      )}

      {/* Reliability */}
      {reliability && (
        <p className="mt-1 text-xs text-gray-500">
          Prediction reliability: <b>{reliability}</b>
        </p>
      )}
    </motion.div>
  );
}
