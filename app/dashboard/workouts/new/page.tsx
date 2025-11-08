"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";

const bodyTypeGoals = [
  "Athletic",
  "Lean",
  "Muscular",
  "Toned",
  "Slim",
  "Strong",
  "Fit",
];

const fitnessLevels = ["Beginner", "Intermediate", "Advanced"];

export default function NewWorkoutPlan() {
  const router = useRouter();
  const [bodyTypeGoal, setBodyTypeGoal] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState("Intermediate");
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [preferences, setPreferences] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/workouts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bodyTypeGoal,
          fitnessLevel,
          durationWeeks,
          preferences: preferences || undefined,
        }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to generate workout plan");
      }
    } catch (error) {
      console.error("Error generating workout plan:", error);
      setError("Failed to generate workout plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create Workout Plan</h1>
        <p className="text-warm-gray mt-1">
          Tell us your goals and we'll create a personalized workout plan
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              What body type do you want to achieve?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {bodyTypeGoals.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setBodyTypeGoal(goal)}
                  className={`px-4 py-3 rounded-lg border transition-colors ${
                    bodyTypeGoal === goal
                      ? "bg-primary text-white border-primary"
                      : "bg-background border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Fitness Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {fitnessLevels.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFitnessLevel(level)}
                  className={`px-4 py-3 rounded-lg border transition-colors ${
                    fitnessLevel === level
                      ? "bg-primary text-white border-primary"
                      : "bg-background border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Duration (weeks)
            </label>
            <input
              type="number"
              min="1"
              max="52"
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-sm text-warm-gray mt-1">
              You can always extend your plan later
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Preferences (optional)
            </label>
            <textarea
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
              placeholder="e.g., prefer home workouts, focus on upper body, avoid running..."
            />
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!bodyTypeGoal || isGenerating} className="flex-1">
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2 inline" />
                  Generate Workout Plan
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

