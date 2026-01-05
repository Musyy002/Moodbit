import * as tf from "@tensorflow/tfjs";

/**
 * AI-powered spending forecast
 * Generates Weekly, Monthly, Yearly predictions
 */
export async function aiForecast(expenses, budget) {
  if (!expenses || expenses.length === 0 || !budget) {
    return null;
  }

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const budgetUsage = totalSpent / budget;

  // ⛔ Minimum data rule
  if (expenses.length < 5 && budgetUsage < 0.5) {
    return {
      weekly: null,
      monthly: null,
      yearly: null,
      insight: "Not enough spending data yet",
      reliability: "Low",
    };
  }

  // Convert expenses → (dayOfMonth, amount)
  const data = expenses.map((e) => ({
    x: new Date(e.createdAt).getDate(),
    y: e.amount,
  }));

  const xs = tf.tensor2d(data.map((d) => [d.x]));
  const ys = tf.tensor2d(data.map((d) => [d.y]));

  // Linear Regression model
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

  model.compile({
    optimizer: tf.train.sgd(0.01),
    loss: "meanSquaredError",
  });

  await model.fit(xs, ys, {
    epochs: 50,
    verbose: 0,
  });

  // Helper function to predict for N days
  const predictForDays = (days) => {
    const input = tf.tensor2d(
      Array.from({ length: days }, (_, i) => [i + 1])
    );
    const prediction = model.predict(input);
    const total = prediction.sum().dataSync()[0];
    tf.dispose([input, prediction]);
    return Math.max(0, Math.round(total));
  };

  // 🔮 Predictions
  const weekly = predictForDays(7);
  const monthly = predictForDays(30);
  const yearly = monthly * 12;

  // 📈 Trend insight
  const slope = model.getWeights()[0].dataSync()[0];
  let insight = "Your spending is stable";
  if (slope > 0.3)
    insight = "You’re spending faster as time progresses";
  else if (slope < -0.3)
    insight = "Your spending is slowing down";

  // 🎯 Reliability (human readable)
  let reliability = "Medium";
  if (expenses.length >= 12) reliability = "High";
  if (expenses.length < 5) reliability = "Low";

  tf.dispose([xs, ys]);

  return {
    weekly,
    monthly,
    yearly,
    insight,
    reliability,
  };
}
