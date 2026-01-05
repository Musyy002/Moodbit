import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

const COLORS = [
  "#7C3AED", 
  "#A855F7",
  "#C084FC",
  "#E9D5FF",
  "#6D28D9",
  "#9333EA",
  "#D8B4FE",
];

export default function CategoryChart({ expenses }) {
  const { getToken } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      const res = await fetch(
        "http://localhost:5000/api/expenses/summary",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setData(await res.json());
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold text-blue-700 mb-2">
        Spending by Category
      </h2>

      <div className="w-full h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <p className="text-center">
        <i>"A budget is telling your money where to go, instead of wondering where it went." -Dave Ramsey</i>
      </p>
    </div>
  );
}
