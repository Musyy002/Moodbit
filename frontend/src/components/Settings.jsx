import { useEffect, useState } from "react";
import { useAuth, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings as SettingsIcon,
  Trash2,
  Save, Wallet
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "./DashboardLayout";
import Sidebar from "./Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Settings() {
  const { getToken } = useAuth();
  const { user } = useClerk();
  const navigate = useNavigate();

  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeSource, setIncomeSource] = useState("");
  const [incomeSourceType, setIncomeSourceType] = useState("");
  const [incomeFrequency, setIncomeFrequency] = useState("monthly");
  const [error, setError] = useState("");



  useEffect(() => {
    const fetchBudget = async () => {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/budget", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setBudget(data?.monthlyLimit || "");
    };

    fetchBudget();
  }, []);

  useEffect(() => {
    const fetchIncome = async () => {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/income", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const data = await res.json();
      if (data) {
        setIncomeAmount(data.amount);
        setIncomeFrequency(data.frequency || "monthly");
      
        const knownSources = ["salary", "freelance", "business", "scholarship","pocket-money"];
      
        if (knownSources.includes(data.source)) {
          setIncomeSourceType(data.source);
          setIncomeSource(data.source);
        } else {
          setIncomeSourceType("other");
          setIncomeSource(data.source || "");
        }
      }
      
    };
  
    fetchIncome();
  }, []);
  

  const saveBudget = async () => {
    setError("");
  
    const budgetValue = Number(budget);
    const incomeValue = Number(incomeAmount);
  
    if (!incomeValue || incomeValue <= 0) {
      setError("Please set your income before setting a budget.");
      return;
    }
  
    if (!budgetValue || budgetValue <= 0) {
      setError("Budget must be greater than zero.");
      return;
    }
  
    if (budgetValue > incomeValue) {
      setError("Budget cannot exceed your income.");
      return;
    }
  
    setLoading(true);
    const token = await getToken();
  
    await fetch("http://localhost:5000/api/budget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ monthlyLimit: budgetValue }),
    });
  
    setLoading(false);
    navigate("/dashboard");
  };
  
  const saveIncome = async () => {
    setError("");
  
    const amount = Number(incomeAmount);
  
    if (!amount || amount <= 0) {
      setError("Income must be greater than zero.");
      return;
    }
  
    if (!incomeSource) {
      setError("Please select or enter an income source.");
      return;
    }
  
    const token = await getToken();
  
    await fetch("http://localhost:5000/api/income", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount,
        source: incomeSource,
        frequency: incomeFrequency,
      }),
    });
  
    navigate("/dashboard");
  };
  
  

  const deleteProfile = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      await fetch("http://localhost:5000/api/user/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await user.delete();

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to delete account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Sidebar active="settings" />

      <main className="flex-1 px-8 py-6 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          {/* Header */}
          <div className="flex mt-5 items-center gap-3 text-blue-600">
            <SettingsIcon size={28} />
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Income Settings */}
          <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Wallet size={20} />
              <h2 className="text-lg font-semibold">Income</h2>
            </div>

            {/* Income Amount */}
            <input
              type="number"
              placeholder="Income Amount"
              value={incomeAmount}
              onChange={(e) => setIncomeAmount(e.target.value)}
              className="w-full border rounded-lg p-2 focus:outline-blue-500"
            />

            {/* Income Source Dropdown */}
            <Select
              value={incomeSourceType}
              onValueChange={(value) => {
                setIncomeSourceType(value);
                if (value !== "other") {
                  setIncomeSource(value);
                } else {
                  setIncomeSource("");
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select income source" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="scholarship">Scholarship</SelectItem>
                <SelectItem value="scholarship">Pocket Money</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            {/* Show input only if Other */}
            {incomeSourceType === "other" && (
              <input
                placeholder="Enter income source"
                value={incomeSource}
                onChange={(e) => setIncomeSource(e.target.value)}
                className="w-full border rounded-lg p-2 focus:outline-blue-500"
              />
            )}

            {/* Frequency */}
            <Select
              value={incomeFrequency}
              onValueChange={setIncomeFrequency}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="weekly">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={saveIncome}
              className="bg-blue-600 hover:bg-blue-700 transition"
            >
              Save Income
            </Button>
          </CardContent>
          </Card>

          {/* Budget Settings */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-blue-600">
                Set Budget
              </h2>

              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full border rounded-lg p-2 focus:outline-blue-500"
                placeholder="Enter budget"
              />

              <Button
                onClick={saveBudget}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="mr-2" size={16} />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          

          <Card className="border-red-200">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-red-600">
                Danger Zone
              </h2>

              <p className="text-sm text-gray-500">
                Deleting your account will permanently remove all
                your expenses, budget, and progress.
              </p>

              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => setShowDelete(true)}
              >
                <Trash2 className="mr-2" size={16} />
                Delete Profile
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <AnimatePresence>
        {showDelete && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-96 shadow-xl"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Account?
              </h3>

              <p className="text-sm text-gray-600 mt-2">
                This action is <b>permanent</b>.  
                All your data will be deleted forever.
              </p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowDelete(false)}
                  className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-100"
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  onClick={deleteProfile}
                  disabled={loading}
                  className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  {loading ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
