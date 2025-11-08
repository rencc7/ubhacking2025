"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import ExerciseDetail from "@/components/ExerciseDetail";
import Card from "@/components/Card";
import { Search, Dumbbell } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  type: string;
  muscleGroups: string;
  instructions: string | null;
  sets: number | null;
  reps: number | null;
  duration: number | null;
}

export default function ExercisesPage() {
  const { user, loading: isLoading } = useAuth();
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      loadExercises();
    }
  }, [user, search, filterType]);

  const loadExercises = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filterType) params.append("type", filterType);
      params.append("limit", "50");

      const response = await fetch(`/api/exercises?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setExercises(data);
      }
    } catch (error) {
      console.error("Error loading exercises:", error);
    }
  };

  const handleViewExercise = (exercise: Exercise) => {
    const muscleGroups = JSON.parse(exercise.muscleGroups || "[]");
    setSelectedExercise({
      ...exercise,
      muscleGroups,
      sets: exercise.sets || 0,
      reps: exercise.reps || undefined,
      duration: exercise.duration || undefined,
      restSeconds: 60,
      instructions: exercise.instructions || "No instructions available.",
    } as any);
  };

  const exerciseTypes = Array.from(new Set(exercises.map((e) => e.type)));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-warm-gray">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Exercise Library</h1>
        <p className="text-warm-gray mt-1">Browse exercises with detailed instructions</p>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-gray w-5 h-5" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Types</option>
              {exerciseTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exercises.map((exercise) => {
          const muscleGroups = JSON.parse(exercise.muscleGroups || "[]");
          return (
            <Card key={exercise.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <div onClick={() => handleViewExercise(exercise)}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Dumbbell className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{exercise.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-2 py-1 rounded-full bg-accent text-warm-gray text-xs">
                        {exercise.type}
                      </span>
                      {muscleGroups.slice(0, 2).map((group: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded-full bg-muted text-warm-gray text-xs"
                        >
                          {group}
                        </span>
                      ))}
                    </div>
                    {exercise.sets && exercise.reps && (
                      <p className="text-sm text-warm-gray">
                        {exercise.sets} sets × {exercise.reps} reps
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {exercises.length === 0 && (
        <Card>
          <div className="text-center py-12 text-warm-gray">
            No exercises found. Complete some workouts to build your exercise library!
          </div>
        </Card>
      )}

      {selectedExercise && (
        <ExerciseDetail
          exercise={selectedExercise as any}
          isOpen={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </div>
  );
}

