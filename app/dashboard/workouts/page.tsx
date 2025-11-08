"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import WorkoutCard from "@/components/WorkoutCard";
import ExerciseDetail from "@/components/ExerciseDetail";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { Plus, Calendar } from "lucide-react";

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

interface Exercise {
  name: string;
  type: string;
  muscleGroups: string[];
  sets: number;
  reps?: number;
  duration?: number;
  restSeconds: number;
  instructions: string;
}

export default function WorkoutsPage() {
  const { user, loading: isLoading } = useAuth();
  const router = useRouter();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      loadWorkouts();
    }
  }, [user]);

  const loadWorkouts = async () => {
    try {
      const response = await fetch("/api/workouts");
      if (response.ok) {
        const data = await response.json();
        setWorkoutPlans(data);
        if (data.length > 0) {
          // Set default week to current week or week 1
          const currentWeek = Math.floor(
            (new Date().getTime() - new Date(data[0].startDate).getTime()) /
              (7 * 24 * 60 * 60 * 1000)
          ) + 1;
          setSelectedWeek(Math.max(1, currentWeek));
        }
      }
    } catch (error) {
      console.error("Error loading workouts:", error);
    }
  };

  const handleViewExercise = (session: WorkoutSession, exerciseIndex: number) => {
    const exercises: Exercise[] = JSON.parse(session.exercises);
    setSelectedExercise(exercises[exerciseIndex]);
  };

  const getSessionsForWeek = (weekNumber: number) => {
    if (workoutPlans.length === 0) return [];
    return workoutPlans[0].sessions.filter((s) => s.weekNumber === weekNumber);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-warm-gray">Loading...</div>
      </div>
    );
  }

  const currentSessions = selectedWeek ? getSessionsForWeek(selectedWeek) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Workouts</h1>
          <p className="text-warm-gray mt-1">Your workout plans and sessions</p>
        </div>
        <Button onClick={() => router.push("/dashboard/workouts/new")}>
          <Plus className="w-4 h-4 mr-2" />
          New Plan
        </Button>
      </div>

      {workoutPlans.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-warm-gray-light mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">No workout plans yet</h2>
            <p className="text-warm-gray mb-6">
              Create your first AI-powered workout plan to get started
            </p>
            <Button onClick={() => router.push("/dashboard/workouts/new")}>
              Create Workout Plan
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {workoutPlans.map((plan) => (
            <div key={plan.id} className="space-y-4">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">{plan.goal}</h2>
                    <p className="text-warm-gray">
                      {plan.durationWeeks} weeks • {plan.sessions.length} sessions
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {Array.from({ length: plan.durationWeeks }, (_, i) => i + 1).map((week) => (
                    <button
                      key={week}
                      onClick={() => setSelectedWeek(week)}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        selectedWeek === week
                          ? "bg-primary text-white"
                          : "bg-muted text-warm-gray hover:bg-accent"
                      }`}
                    >
                      Week {week}
                    </button>
                  ))}
                </div>
              </Card>

              {selectedWeek && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentSessions.map((session) => (
                    <WorkoutCard
                      key={session.id}
                      session={session}
                      onComplete={loadWorkouts}
                      onView={(id) => {
                        const exercises: Exercise[] = JSON.parse(session.exercises);
                        if (exercises.length > 0) {
                          handleViewExercise(session, 0);
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {selectedExercise && (
        <ExerciseDetail
          exercise={selectedExercise}
          isOpen={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </div>
  );
}

