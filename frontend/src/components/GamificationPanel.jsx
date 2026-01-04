import { motion } from "framer-motion";
import {
  Award,
  Star,
  TrendingUp,
} from "lucide-react";

import DashboardLayout from "./DashboardLayout";
import Sidebar from "./Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function GamificationPanel({
  xp = 0,
  level = 1,
  badges = [],
}) {
  const xpForNextLevel = level * 100;
  const progress = Math.min((xp / xpForNextLevel) * 100, 100);

  return (
    <DashboardLayout>
      <Sidebar active="badges" />

      <main className="flex-1 px-8 py-6 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Header */}
          <div className="flex mt-7 items-center gap-3 text-blue-600">
            <Award size={28} />
            <h1 className="text-2xl font-bold">Your Progress</h1>
          </div>

          {/* Level Card */}
          <Card className="shadow">
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">Current Level</p>
                  <h2 className="text-3xl font-bold text-blue-600">
                    Level {level}
                  </h2>
                </div>

                <TrendingUp className="text-blue-400" size={36} />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">
                  XP Progress ({xp}/{xpForNextLevel})
                </p>
                <Progress value={progress} />
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card className="shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3 text-blue-600">
                <Star />
                <h3 className="text-lg font-semibold">Badges Earned</h3>
              </div>

              {badges.length ? (
                <div className="flex flex-wrap gap-3">
                  {badges.map((badge) => (
                    <span
                      key={badge}
                      className="px-4 py-2 rounded-full bg-purple-100 text-blue-700 text-sm font-medium"
                    >
                      🏅 {badge}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No badges yet — keep tracking your expenses!
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </DashboardLayout>
  );
}
