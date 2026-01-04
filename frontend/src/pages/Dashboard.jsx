import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";

import BudgetCard from "../components/BudgetCard";
import MoodBit from "../components/Moodbit";
import HealthScore from "../components/HealthScore";
import CategoryChart from "../components/CategoryChart";
import ExpenseList from "../components/ExpenseList";
import ForecastCard from "../components/ForecastCard";
import MoodbitChat from "../components/MoodbitChat";

import DashboardLayout from "../components/DashboardLayout";
import Sidebar from "../components/Sidebar";

import { calculateHealthScore } from "../utils/calculateHealthScore";
import { predictMonthlySpend } from "../utils/forecast";

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [budget, setBudget] = useState(null);
  const [healthScore, setHealthScore] = useState(0);
  const [predictedSpend, setPredictedSpend] = useState(0);

  //Sync user
  useEffect(() => {
    if (!isLoaded || !user) return;

    const syncUser = async () => {
      const token = await getToken();
      await fetch("http://localhost:5000/api/user/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: user.primaryEmailAddress.emailAddress,
        }),
      });
    };

    syncUser();
  }, [isLoaded, user]);

  //Fetch expenses
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchExpenses = async () => {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setExpenses(data);

      const sum = data.reduce((acc, e) => acc + e.amount, 0);
      setTotalSpent(sum);
    };

    fetchExpenses();
  }, [isLoaded, user]);


  //Fetch budget
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchBudget = async () => {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/budget", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setBudget(data?.monthlyLimit || null);
    };

    fetchBudget();
  }, [isLoaded, user]);

  //Calculate health score
  useEffect(() => {
    if (!budget || expenses.length === 0) return;

    const score = calculateHealthScore({
      totalSpent,
      budget,
      expenses,
    });

    setHealthScore(score);
  }, [budget, expenses, totalSpent]);

  //Update gamification stats (XP, badges)
  useEffect(() => {
  if (!budget || expenses.length === 0) return;

  const updateStats = async () => {
    const token = await getToken();

    await fetch("http://localhost:5000/api/stats/xp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        xp: 20, // base XP for activity
        saver: totalSpent <= budget,
        happy: healthScore > 70,
      }),
    });
  };

  updateStats();
}, [budget, expenses, healthScore, totalSpent]);


  //Forecast spending
  useEffect(() => {
    if (expenses.length === 0) return;

    const prediction = predictMonthlySpend(expenses);
    setPredictedSpend(prediction);
  }, [expenses]);

  return (
    <DashboardLayout>
      <Sidebar active="dashboard"/>

      <main className="flex-1 px-8 py-6 space-y-10 bg-white">
        {/* Top Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <BudgetCard
            budget={budget}
            totalSpent={totalSpent}
          />

          <MoodBit
            budget={budget}
            totalSpent={totalSpent}
          />

          <HealthScore score={healthScore} />
        </motion.div>

        {/* Charts + Expenses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategoryChart expenses={expenses} />
          <ExpenseList expenses={expenses} />
        </div>

        {/* Forecast */}
          <ForecastCard
            predictedSpend={predictedSpend}
            budget={budget}
          />


        {/* Footer */}
        <footer className="text-center text-sm text-gray-400 pt-6">
          © {new Date().getFullYear()} Moodbit Budget · Made By Muskan & Juveriya.
        </footer>
      </main>

      {/* Floating AI Assistant */}
      <MoodbitChat
        budget={budget}
        totalSpent={totalSpent}
        healthScore={healthScore}
        mood={healthScore > 70 ? "happy" : "stressed"}
      />
    </DashboardLayout>
  );
}
