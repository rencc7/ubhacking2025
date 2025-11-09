"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import DailyCheckIn from "@/components/DailyCheckIn";
import WorkoutCard from "@/components/WorkoutCard";
import ProgressChart from "@/components/ProgressChart";
import AchievementBadge from "@/components/AchievementBadge";
import Card from "@/components/Card";
import { Calendar, Flame, TrendingUp, Target } from "lucide-react";
import { format, startOfWeek, addDays } from "date-fns";

interface WorkoutPlan {
  id: string;
  goal: string;
  durationWeeks: number;
  startDate: string;
  endDate: string;
  sessions: WorkoutSession[];
}

interface WorkoutSession {
  id: string;
  weekNumber: number;
  dayNumber: number;
  exercises: string;
  completed: boolean;
  completedAt: string | null;
}

interface ProgressData {
  date: string;
  weight: number;
}

interface Achievement {
  id: string;
  type: string;
  description: string | null;
  unlockedAt: string;
}

export default function Dashboard() {
  const { user, loading: isLoading } = useAuth();
  const router = useRouter();
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
      checkTodayCheckIn();
      loadStreak();
    }
  }, [user]);

  const loadStreak = async () => {
    try {
      const response = await fetch("/api/checkins");
      if (response.ok) {
        const checkIns = await response.json();
        // Calculate streak
        let currentStreak = 0;
        if (checkIns.length > 0) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          let currentDate = new Date(today);

          for (const checkIn of checkIns) {
            const checkInDate = new Date(checkIn.date);
            checkInDate.setHours(0, 0, 0, 0);
            const daysDiff = Math.floor(
              (currentDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            if (daysDiff === currentStreak && checkIn.completed) {
              currentStreak++;
              currentDate = checkInDate;
            } else {
              break;
            }
          }
        }
        setStreak(currentStreak);
      }
    } catch (error) {
      console.error("Error loading streak:", error);
    }
  };

  const loadDashboardData = async () => {
    try {
      const [workoutsRes, progressRes, achievementsRes] = await Promise.all([
        fetch("/api/workouts"),
        fetch("/api/progress?limit=30"),
        fetch("/api/achievements"),
      ]);

      if (workoutsRes.ok) {
        const workouts = await workoutsRes.json();
        setWorkoutPlans(workouts);
      }

      if (progressRes.ok) {
        const progress = await progressRes.json();
        const weightData = progress
          .filter((p: any) => p.weight)
          .map((p: any) => ({
            date: p.date,
            weight: p.weight,
          }));
        setProgressData(weightData);
      }

      if (achievementsRes.ok) {
        const achievementsData = await achievementsRes.json();
        setAchievements(achievementsData.slice(0, 5));
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkTodayCheckIn = async () => {
    try {
      const response = await fetch("/api/checkins/today");
      if (response.ok) {
        const data = await response.json();
        setHasCheckedIn(data.hasCheckedIn);
        if (!data.hasCheckedIn) {
          // Show check-in modal after a delay
          setTimeout(() => setShowCheckIn(true), 1000);
        }
      }
    } catch (error) {
      console.error("Error checking today's check-in:", error);
    }
  };

  const handleCheckInComplete = () => {
    setHasCheckedIn(true);
    loadDashboardData();
  };

  const getCurrentWeekSessions = () => {
    if (workoutPlans.length === 0) return [];
    const activePlan = workoutPlans[0]; // Get the most recent plan
    const currentDate = new Date();
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    const weekNumber = Math.floor(
      (currentDate.getTime() - new Date(activePlan.startDate).getTime()) /
        (7 * 24 * 60 * 60 * 1000)
    ) + 1;

    return activePlan.sessions.filter(
      (session) => session.weekNumber === weekNumber
    );
  };

  const currentWeekSessions = getCurrentWeekSessions();
  // Helper to check if a session has valid exercises
  const hasValidExercises = (session: WorkoutSession) => {
    try {
      const exercises = JSON.parse(session.exercises);
      return Array.isArray(exercises) && exercises.length > 0;
    } catch {
      return false;
    }
  };

  const filteredWeekSessions = currentWeekSessions.filter(hasValidExercises);
  const completedWorkouts = filteredWeekSessions.filter((s) => s.completed).length;

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-warm-gray">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
          </h1>
          <p className="text-warm-gray mt-1">Let's continue your fitness journey</p>
        </div>
        <button
          onClick={() => setShowCheckIn(true)}
          className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
        >
          {hasCheckedIn ? "Update Check-In" : "Daily Check-In"}
        </button>
      </div>

      <DailyCheckIn
        isOpen={showCheckIn && !hasCheckedIn}
        onClose={() => setShowCheckIn(false)}
        onComplete={handleCheckInComplete}
      />

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Flame className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-warm-gray">Current Streak</p>
              <p className="text-2xl font-bold text-foreground">{streak} days</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-warm-gray">This Week</p>
              <p className="text-2xl font-bold text-foreground">
                {completedWorkouts}/{currentWeekSessions.length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent/50 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-warm-gray" />
            </div>
            <div>
              <p className="text-sm text-warm-gray">Active Plans</p>
              <p className="text-2xl font-bold text-foreground">{workoutPlans.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {workoutPlans.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-warm-gray-light mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              No workout plan yet
            </h2>
            <p className="text-warm-gray mb-6">
              Create your first AI-powered workout plan to get started
            </p>
            <button
              onClick={() => router.push("/dashboard/workouts/new")}
              className="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
            >
              Create Workout Plan
            </button>
          </div>
        </Card>
      ) : (
        <>
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">This Week's Workouts</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWeekSessions.slice(0, 6).map((session) => (
                <WorkoutCard
                  key={session.id}
                  session={session}
                  onComplete={() => loadDashboardData()}
                />
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <ProgressChart data={progressData} />

            <Card>
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Achievements</h3>
              {achievements.length > 0 ? (
                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <AchievementBadge key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-warm-gray">
                  No achievements yet. Keep working towards your goals!
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

