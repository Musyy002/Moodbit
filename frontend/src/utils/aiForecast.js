import * as tf from "@tensorflow/tfjs";

/**
 * AI-powered spending forecast
 * Used by:
 * - Forecast cards (summary)
 * - Full forecast report (detailed)
 */
export async function aiForecast(expenses, budget) {
  if (!expenses || expenses.length === 0 || !budget) {
    return null;
  }

  /* =========================
     BASIC METRICS
  ========================== */

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const budgetUsage = totalSpent / budget;

  /* ⛔ Minimum data rule */
  if (expenses.length < 5 && budgetUsage < 0.5) {
    return {
      weekly: null,
      monthly: null,
      yearly: null,
      insight: "Not enough spending data yet",
      reliability: "Low",

      // New fields (safe defaults)
      trend: "Unknown",
      slope: 0,
      budgetRisk: "Low",
      healthScore: 80,
      chartData: [],
    };
  }

  /* =========================
     PREPARE TRAINING DATA
  ========================== */

  const data = expenses.map((e) => ({
    x: new Date(e.createdAt).getDate(),
    y: e.amount,
  }));

  const xs = tf.tensor2d(data.map((d) => [d.x]));
  const ys = tf.tensor2d(data.map((d) => [d.y]));

  /* =========================
     LINEAR REGRESSION MODEL
  ========================== */

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

  /* =========================
     PREDICTION HELPER
  ========================== */

  const predictForDays = (days) => {
    const input = tf.tensor2d(
      Array.from({ length: days }, (_, i) => [i + 1])
    );
    const prediction = model.predict(input);
    const values = prediction.dataSync();
    const total = values.reduce((s, v) => s + Math.max(0, v), 0);

    tf.dispose([input, prediction]);
    return Math.round(total);
  };

  /* =========================
     FORECAST RESULTS
  ========================== */

  const weekly = predictForDays(7);
  const monthly = predictForDays(30);
  const yearly = monthly * 12;

  /* =========================
     TREND & INSIGHTS
  ========================== */

  const slope = model.getWeights()[0].dataSync()[0];

  let trend = "Stable";
  let insight = "Your spending is stable";

  if (slope > 0.3) {
    trend = "Increasing";
    insight = "You’re spending faster as time progresses";
  } else if (slope < -0.3) {
    trend = "Decreasing";
    insight = "Your spending is slowing down";
  }

  /* =========================
     BUDGET RISK
  ========================== */

  let budgetRisk = "Low";
  if (monthly > budget) budgetRisk = "High";
  else if (monthly > budget * 0.8) budgetRisk = "Medium";

  /* =========================
     MONEY HEALTH SCORE (0–100)
  ========================== */

  let healthScore = 100;

  if (budgetUsage > 1) healthScore = 30;
  else if (budgetUsage > 0.8) healthScore = 50;
  else if (budgetUsage > 0.6) healthScore = 70;

  if (trend === "Increasing") healthScore -= 10;
  if (expenses.length < 5) healthScore -= 10;

  healthScore = Math.max(0, Math.min(100, healthScore));

  /* =========================
     CHART DATA (for reports)
  ========================== */

  const chartData = expenses.map((e) => ({
    date: new Date(e.createdAt).toLocaleDateString(),
    amount: e.amount,
  }));

  /* =========================
     RELIABILITY
  ========================== */

  let reliability = "Medium";
  if (expenses.length >= 12) reliability = "High";
  if (expenses.length < 5) reliability = "Low";

  tf.dispose([xs, ys]);

  /* =========================
     FINAL RETURN
  ========================== */

  return {
    // Existing (cards depend on these)
    weekly,
    monthly,
    yearly,
    insight,
    reliability,

    // NEW (full report)
    trend,
    slope: Number(slope.toFixed(2)),
    budgetRisk,
    healthScore,
    budgetUsage: Number((budgetUsage * 100).toFixed(1)),
    chartData,
  };
}
