export function calculateLevel(xp) {
    return Math.floor(xp / 100) + 1;
  }
  
  export function unlockBadges(stats) {
    const badges = new Set(stats.badges);
  
    if (stats.saverDays >= 7) badges.add("🥇 Saver");
    if (stats.happyDays >= 5) badges.add("🐾 Buddy");
    if (stats.level >= 5) badges.add("💎 Elite");
  
    return Array.from(badges);
  }
  