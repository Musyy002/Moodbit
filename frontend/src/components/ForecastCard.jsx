export default function ForecastCard({
  predictedSpend,
  budget,
}) {
  const danger =
    budget != null && predictedSpend > budget;

  return (
    <div
      className={`p-6 rounded-xl shadow-sm ${
        danger ? "bg-red-50" : "bg-blue-50"
      }`}
    >
      <h2 className="text-lg font-semibold text-blue-700 mb-2">
        End-of-Month Forecast
      </h2>

      <p className="text-3xl font-bold text-gray-900">
        ₹{predictedSpend}
      </p>

      {budget && (
        <p
          className={`mt-2 text-sm ${
            danger ? "text-red-600" : "text-green-600"
          }`}
        >
          {danger
            ? "⚠️ Budget likely to be exceeded"
            : "✅ Within budget"}
        </p>
      )}
    </div>
  );
}
