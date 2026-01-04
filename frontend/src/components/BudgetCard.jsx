import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

export default function BudgetCard({ totalSpent, budget, setBudget }) {
  
    const [input, setInput] = useState("");
  
    const { getToken } = useAuth();
  
    const saveBudget = async () => {
      const token = await getToken();
  
      await fetch("http://localhost:5000/api/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ monthlyLimit: Number(input) }),
      });
  
      setBudget(Number(input));
      setInput("");
    };
  
    return (
      <div className="bg-blue-800 p-4 rounded-xl text-white shadow-xl">
        <h2 className="text-2xl mb-2"><b>MONTHLY BUDGET</b></h2>
  
        {budget ? (
          <>
            <p>Budget: ₹{budget}</p>
            <p>Remaining: ₹{budget - totalSpent}</p>
          </>
        ) : (
          <>
            <input
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Set budget"
              className="p-1 rounded text-white"
            />
            <button
              onClick={saveBudget}
              className="ml-2 bg-blue-500 px-2 py-1 rounded text-white"
            >
              Save
            </button>
          </>
        )}
      </div>
    );
  }
  