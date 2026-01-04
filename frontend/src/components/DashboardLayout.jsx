import { motion } from "framer-motion";
import { UserButton } from "@clerk/clerk-react";
import { LayoutGrid } from "lucide-react";
import logo from "../assets/moodbitlogo.png";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur border-b">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-xl">
            <img src={logo} height={100} width={100}/>
          </div>
          <UserButton />
        </div>
      </header>

      {/* Body */}
      <div className="flex pt-19">
        {children}
      </div>
    </div>
  );
}
