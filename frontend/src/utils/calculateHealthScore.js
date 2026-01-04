export function calculateHealthScore({
    totalSpent,
    budget,
    expenses,
  }) {
    let score = 0;
  
    // 1️⃣ Budget Discipline (50)
    if (!budget) score += 0;
    else {
      const percent = totalSpent / budget;
      if (percent <= 0.5) score += 50;
      else if (percent <= 0.8) score += 40;
      else if (percent <= 1) score += 25;
      else score += 0;
    }
  
    // 2️⃣ Expense Frequency (30)
    const days = new Set(
      expenses.map((e) =>
        new Date(e.createdAt).toDateString()
      )
    ).size;
  
    const avgPerDay = expenses.length / (days || 1);
  
    if (avgPerDay <= 1) score += 30;
    else if (avgPerDay <= 3) score += 20;
    else score += 10;
  
    // 3️⃣ Category Balance (20)
    const categoryMap = {};
    expenses.forEach((e) => {
      categoryMap[e.category] =
        (categoryMap[e.category] || 0) + e.amount;
    });
  
    const maxCategory = Math.max(
      ...Object.values(categoryMap),
      0
    );
  
    if (maxCategory / totalSpent <= 0.6) score += 20;
    else score += 10;
  
    return Math.min(score, 100);
  }
  