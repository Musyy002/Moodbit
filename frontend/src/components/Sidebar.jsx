import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  Award,
  Settings,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { useState } from "react";

const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard",
    key: "dashboard",
  },
  {
    icon: PlusCircle,
    label: "Add Expense",
    path: "/dashboard/add-expense",
    key: "add-expense",
  },
  {
    icon: Award,
    label: "Badges",
    path: "/dashboard/badges",
    key: "badges",
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/dashboard/settings",
    key: "settings",
  },
];

export default function Sidebar({ active }) {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <>
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white min-h-[calc(100vh-4rem)] px-4 py-6">
        <nav className="space-y-2">
          {navItems.map(({ icon: Icon, label, path, key }) => {
            const isActive = active === key;

            return (
              <motion.div
                key={label}
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate(path)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
              >
                <Icon size={20} className="text-blue-500" />
                <span className="font-medium">{label}</span>
              </motion.div>
            );
          })}

          {/* Logout Button */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            onClick={() => setShowLogout(true)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-red-50 text-red-600 mt-8"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </motion.div>
        </nav>
      </aside>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogout && (
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
              className="bg-white rounded-xl p-6 w-80 shadow-xl"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                Logout?
              </h3>

              <p className="text-sm text-gray-600 mt-2">
                Are you sure you want to logout of Moodbit?
              </p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowLogout(false)}
                  className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
