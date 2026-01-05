export function generateSavingsInsights({
    income,
    totalSpent,
  }) {
    if (!income) return null;
  
    const savings = income - totalSpent;
    const ratio = savings / income;
  
    let insight = "";
    let type = "neutral";
  
    if (ratio >= 0.3) {
      insight =
        "Excellent savings! You're saving more than 30% of your income.";
      type = "positive";
    } else if (ratio >= 0.15) {
      insight =
        "Good job! Your savings are healthy, but there's room to improve.";
      type = "good";
    } else if (ratio >= 0) {
      insight =
        "You're saving very little. Consider reducing non-essential expenses.";
      type = "warning";
    } else {
      insight =
        "You're spending more than you earn. Immediate budget adjustment recommended.";
      type = "danger";
    }
  
    return {
      savings,
      ratio: Math.round(ratio * 100),
      insight,
      type,
    };
  }
  