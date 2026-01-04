export function predictMonthlySpend(expenses) {
    if (expenses.length === 0) return 0;
  
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  
    const dates = expenses.map(e => new Date(e.createdAt));
    const first = Math.min(...dates);
    const daysPassed =
      Math.max(
        1,
        Math.ceil(
          (Date.now() - first) / (1000 * 60 * 60 * 24)
        )
      );
  
    const avgPerDay = total / daysPassed;
    const daysInMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    ).getDate();
  
    return Math.round(avgPerDay * daysInMonth);
  }
  