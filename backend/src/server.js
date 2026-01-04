import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import expenseRoutes from "./routes/expense.routes.js";
import budgetRoutes from "./routes/budget.routes.js";
import statsRoutes from "./routes/stats.js";
import aiRoutes from "./routes/ai.js"

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use(ClerkExpressWithAuth());

app.use("/api/expenses", expenseRoutes);

app.use("/api/budget", budgetRoutes);

app.use("/api/stats", statsRoutes);

app.use("/api/ai", aiRoutes);


app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Moodbit Budget API running!");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
