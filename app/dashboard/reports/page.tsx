"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import { Calendar, TrendingUp, Target, Award } from "lucide-react";

export default function ReportsPage() {
  const { user, loading: isLoading } = useAuth();
  const router = useRouter();
  const [weeklyReport, setWeeklyReport] = useState<string>("");
  const [nutritionTip, setNutritionTip] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      loadReports();
    }
  }, [user]);

  const loadReports = async () => {
    try {
      // Generate weekly report
      const workoutsRes = await fetch("/api/workouts");
      const progressRes = await fetch("/api/progress?limit=7");
      const achievementsRes = await fetch("/api/achievements");

      const workouts = workoutsRes.ok ? await workoutsRes.json() : [];
      const progress = progressRes.ok ? await progressRes.json() : [];
      const achievements = achievementsRes.ok ? await achievementsRes.json() : [];

      if (workoutsRes.ok && progressRes.ok && achievementsRes.ok) {

        // Calculate weekly stats
        const activePlan = workouts[0];
        if (activePlan) {
          const thisWeekSessions = activePlan.sessions.filter((s: any) => {
            const weekNumber = Math.floor(
              (new Date().getTime() - new Date(activePlan.startDate).getTime()) /
                (7 * 24 * 60 * 60 * 1000)
            ) + 1;
            return s.weekNumber === weekNumber;
          });

          const completedWorkouts = thisWeekSessions.filter((s: any) => s.completed).length;
          const totalWorkouts = thisWeekSessions.length;
          const recentAchievements = achievements.slice(0, 3).map((a: any) => a.type);

          // Generate AI report
          const reportRes = await fetch("/api/reports/weekly", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              weekNumber: Math.floor(
                (new Date().getTime() - new Date(activePlan.startDate).getTime()) /
                  (7 * 24 * 60 * 60 * 1000)
              ) + 1,
              completedWorkouts,
              totalWorkouts,
              achievements: recentAchievements,
            }),
          });

          if (reportRes.ok) {
            const data = await reportRes.json();
            setWeeklyReport(data.report);
          }
        }
      }

      // Generate nutrition tip
      const nutritionRes = await fetch("/api/nutrition/tip");
      if (nutritionRes.ok) {
        const data = await nutritionRes.json();
        setNutritionTip(data.tip);
      }
    } catch (error) {
      console.error("Error loading reports:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-warm-gray">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports & Insights</h1>
        <p className="text-warm-gray mt-1">Weekly summaries and nutrition tips</p>
      </div>

      {weeklyReport && (
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Weekly Report</h2>
          </div>
          <div className="prose prose-sm max-w-none">
            <p className="text-warm-gray whitespace-pre-wrap">{weeklyReport}</p>
          </div>
        </Card>
      )}

      {nutritionTip && (
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-secondary" />
            <h2 className="text-2xl font-semibold text-foreground">Nutrition Tip</h2>
          </div>
          <p className="text-warm-gray">{nutritionTip}</p>
        </Card>
      )}

      {!weeklyReport && !nutritionTip && (
        <Card>
          <div className="text-center py-12 text-warm-gray">
            No reports available yet. Complete some workouts to generate insights!
          </div>
        </Card>
      )}
    </div>
  );
}

