import { SignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center px-4">
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full"
      >
        {/* Left Branding Section */}
        <div className="hidden md:flex flex-col justify-center text-white p-8">
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold mb-4"
          >
            Welcome back to Moodbit 🐾
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="text-gray-300 text-lg"
          >
            Track smarter. Feel better.  
            Let your finances stay emotionally healthy.
          </motion.p>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="w-40 h-40 rounded-full bg-blue-500/20 blur-2xl mt-10"
          />
        </div>

        {/*Login Card */}
        <Card className="bg-slate-900/80 border-slate-800 shadow-xl">
          <CardContent className="p-6 flex justify-center">
            <SignIn fallbackRedirectUrl="/dashboard" />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
