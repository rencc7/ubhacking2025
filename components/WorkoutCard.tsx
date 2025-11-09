"use client";

import { Calendar, Clock, CheckCircle2, Circle } from "lucide-react";
import { format } from "date-fns";

interface Exercise {
  name: string;
  sets: number;
  reps?: number;
  duration?: number;
  restSeconds?: number;
  intervalWork?: number;
  intervalRest?: number;
}

interface WorkoutSession {
  id: string;
  weekNumber: number;
  dayNumber: number;
  exercises: string;
  completed: boolean;
  completedAt: string | null;
}

interface WorkoutCardProps {
  session: WorkoutSession;
  onComplete?: (sessionId: string) => void;
  onView?: (sessionId: string) => void;
}

export default function WorkoutCard({ session, onComplete, onView }: WorkoutCardProps) {
  const exercises: Exercise[] = JSON.parse(session.exercises);
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const handleComplete = async () => {
    if (onComplete) {
      try {
        const response = await fetch(`/api/workouts/${session.id}/complete`, {
          method: "POST",
        });
        if (response.ok && onComplete) {
          onComplete(session.id);
        }
      } catch (error) {
        console.error("Error completing workout:", error);
      }
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Week {session.weekNumber} - {dayNames[session.dayNumber - 1] || `Day ${session.dayNumber}`}
          </h3>
          <p className="text-sm text-warm-gray mt-1">
            {exercises.length} {exercises.length === 1 ? "exercise" : "exercises"}
          </p>
        </div>
        <button
          onClick={handleComplete}
          className={`p-2 rounded-full transition-colors ${
            session.completed
              ? "bg-primary text-white"
              : "bg-muted text-warm-gray hover:bg-accent"
          }`}
        >
          {session.completed ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="space-y-2 mb-4">
        {exercises.map((exercise, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-foreground">{exercise.name}</span>
            <span className="text-warm-gray">
              {exercise.sets} sets
              {exercise.reps && ` × ${exercise.reps} reps`}
              {exercise.duration && ` × ${Math.round(exercise.duration / 60)}min`}
            </span>
          </div>
        ))}
      </div>

      {session.completed && session.completedAt && (
        <p className="text-xs text-warm-gray-light">
          Completed {format(new Date(session.completedAt), "MMM d, yyyy")}
        </p>
      )}

      {onView && (
        <button
          onClick={() => onView(session.id)}
          className="mt-4 w-full px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-accent transition-colors text-sm font-medium"
        >
          View Details
        </button>
      )}
    </div>
  );
}

