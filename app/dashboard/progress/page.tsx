"use client";

import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import ProgressChart from "@/components/ProgressChart";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { Plus, Scale } from "lucide-react";

interface ProgressLog {
  id: string;
  date: string;
  weight: number | null;
  notes: string | null;
}

export default function ProgressPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/api/auth/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user]);

  const loadProgress = async () => {
    try {
      const response = await fetch("/api/progress");
      if (response.ok) {
        const data = await response.json();
        setProgressLogs(data);
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weight: weight ? parseFloat(weight) : null,
          notes: notes || null,
        }),
      });

      if (response.ok) {
        setWeight("");
        setNotes("");
        setShowForm(false);
        loadProgress();
      }
    } catch (error) {
      console.error("Error saving progress:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressData = progressLogs
    .filter((p) => p.weight)
    .map((p) => ({
      date: p.date,
      weight: p.weight!,
    }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-warm-gray">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Progress Tracking</h1>
          <p className="text-warm-gray mt-1">Monitor your fitness journey</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Log Progress
        </Button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Weight (lbs)
              </label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your weight"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                placeholder="How are you feeling? Any observations?"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setWeight("");
                  setNotes("");
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Progress"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <ProgressChart data={progressData} />

      <Card>
        <h2 className="text-xl font-semibold text-foreground mb-4">Progress History</h2>
        {progressLogs.length > 0 ? (
          <div className="space-y-3">
            {progressLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Scale className="w-5 h-5 text-warm-gray" />
                  <div>
                    <p className="font-medium text-foreground">
                      {log.weight ? `${log.weight} lbs` : "No weight logged"}
                    </p>
                    <p className="text-sm text-warm-gray">
                      {new Date(log.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {log.notes && <p className="text-sm text-warm-gray">{log.notes}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-warm-gray">
            No progress logged yet. Start tracking your journey!
          </div>
        )}
      </Card>
    </div>
  );
}

