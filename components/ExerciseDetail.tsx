"use client";

import { X, Clock, Repeat, Dumbbell } from "lucide-react";

interface Exercise {
  name: string;
  type: string;
  muscleGroups: string[];
  sets: number;
  reps?: number;
  duration?: number;
  restSeconds?: number;
  intervalWork?: number;
  intervalRest?: number;
  instructions: string;
}

interface ExerciseDetailProps {
  exercises: Exercise[];
  isOpen: boolean;
  onClose: () => void;
}

export default function ExerciseDetail({ exercises, isOpen, onClose }: ExerciseDetailProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-foreground">Workout Details</h2>
          <button
            onClick={onClose}
            className="text-warm-gray hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {(exercises ?? []).map((exercise, idx) => (
            <div key={idx} className="border-b border-muted pb-4 mb-4 last:border-b-0 last:mb-0 last:pb-0">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-accent text-warm-gray text-sm">
                  {exercise.type}
                </span>
                {(exercise.muscleGroups || []).map((group, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-muted text-warm-gray text-sm"
                  >
                    {group}
                  </span>
                ))}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">{exercise.name}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  {/* Show sets only if sets is a number and not null, and not for foam rolling/stretching */}
                  {typeof exercise.sets === 'number' && exercise.sets > 0 && exercise.name.toLowerCase().indexOf('foam rolling') === -1 && exercise.name.toLowerCase().indexOf('stretch') === -1 && (
                    <div className="flex items-center gap-2 text-warm-gray">
                      <Dumbbell className="w-5 h-5" />
                      <span>{exercise.sets} sets</span>
                    </div>
                  )}
                  {/* If sets are used for seconds (e.g. Side Plank), show as seconds if duration is present */}
                  {exercise.name.toLowerCase().indexOf('plank') !== -1 && exercise.duration && (
                    <div className="flex items-center gap-2 text-warm-gray">
                      <Clock className="w-5 h-5" />
                      <span>{exercise.sets} x {Math.round(Number(exercise.duration))} seconds</span>
                    </div>
                  )}
                  {exercise.reps && (
                    <div className="flex items-center gap-2 text-warm-gray">
                      <Repeat className="w-5 h-5" />
                      <span>{exercise.reps} reps</span>
                    </div>
                  )}
                  {exercise.duration && exercise.name.toLowerCase().indexOf('plank') === -1 && (
                    <div className="flex items-center gap-2 text-warm-gray">
                      <Clock className="w-5 h-5" />
                      <span>{Math.round(Number(exercise.duration) / 60)} min</span>
                    </div>
                  )}
                </div>
                {exercise.restSeconds ? (
                  <div className="text-sm text-warm-gray">
                    Rest: {exercise.restSeconds}s between sets
                  </div>
                ) : null}
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Instructions</h3>
                <p className="text-warm-gray whitespace-pre-wrap">{exercise.instructions}</p>
              </div>
            </div>
          ))}
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

