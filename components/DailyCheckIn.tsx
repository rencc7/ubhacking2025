"use client";

import { useState, useEffect } from "react";
import { X, Smile, Frown, Meh } from "lucide-react";

interface DailyCheckInProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function DailyCheckIn({ isOpen, onClose, onComplete }: DailyCheckInProps) {
  const [mood, setMood] = useState<number>(3);
  const [motivation, setMotivation] = useState<number>(3);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, motivation, notes }),
      });

      if (response.ok) {
        onComplete();
        onClose();
        setMood(3);
        setMotivation(3);
        setNotes("");
      }
    } catch (error) {
      console.error("Error submitting check-in:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Daily Check-In</h2>
          <button
            onClick={onClose}
            className="text-warm-gray hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              How are you feeling today?
            </label>
            <div className="flex gap-4 justify-center">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMood(value)}
                  className={`p-3 rounded-full transition-all ${
                    mood === value
                      ? "bg-primary text-white scale-110"
                      : "bg-muted text-warm-gray hover:bg-accent"
                  }`}
                >
                  {value <= 2 ? (
                    <Frown className="w-6 h-6" />
                  ) : value === 3 ? (
                    <Meh className="w-6 h-6" />
                  ) : (
                    <Smile className="w-6 h-6" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Motivation Level (1-5)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMotivation(value)}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    motivation === value
                      ? "bg-primary text-white"
                      : "bg-muted text-warm-gray hover:bg-accent"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="How are you feeling about your fitness journey?"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg bg-muted text-warm-gray hover:bg-accent transition-colors"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

