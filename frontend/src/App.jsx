import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AddExpense from "./components/AddExpense";
import Landing from "./pages/Landing";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import GamificationPanel from "./components/GamificationPanel";
import Settings from "./components/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <>
            <SignedIn>
              <Dashboard />
            </SignedIn>
            <SignedOut>
              <Landing />
            </SignedOut>
          </>
          }
        />

      <Route path="/dashboard/add-expense" element={<AddExpense />} />
      <Route path="/dashboard/badges" element={<GamificationPanel />} />
      <Route path="/dashboard/settings" element={<Settings />} />

      </Routes>
    </BrowserRouter>
  );
}
