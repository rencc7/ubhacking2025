"use client";

import { X, Clock, Repeat, Dumbbell } from "lucide-react";

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

interface ExerciseDetailProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExerciseDetail({ exercise, isOpen, onClose }: ExerciseDetailProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">{exercise.name}</h2>
          <button
            onClick={onClose}
            className="text-warm-gray hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-accent text-warm-gray text-sm">
            {exercise.type}
          </span>
          {exercise.muscleGroups.map((group, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full bg-muted text-warm-gray text-sm"
            >
              {group}
            </span>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-warm-gray">
              <Dumbbell className="w-5 h-5" />
              <span>{exercise.sets} sets</span>
            </div>
            {exercise.reps && (
              <div className="flex items-center gap-2 text-warm-gray">
                <Repeat className="w-5 h-5" />
                <span>{exercise.reps} reps</span>
              </div>
            )}
            {exercise.duration && (
              <div className="flex items-center gap-2 text-warm-gray">
                <Clock className="w-5 h-5" />
                <span>{Math.round(exercise.duration / 60)} min</span>
              </div>
            )}
          </div>
          <div className="text-sm text-warm-gray">
            Rest: {exercise.restSeconds}s between sets
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-2">Instructions</h3>
          <p className="text-warm-gray whitespace-pre-wrap">{exercise.instructions}</p>
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

