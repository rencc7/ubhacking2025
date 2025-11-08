"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import AchievementBadge from "@/components/AchievementBadge";
import Card from "@/components/Card";
import { Award } from "lucide-react";

interface Achievement {
  id: string;
  type: string;
  description: string | null;
  unlockedAt: string;
}

export default function AchievementsPage() {
  const { user, loading: isLoading } = useAuth();
  const router = useRouter();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      loadAchievements();
    }
  }, [user]);

  const loadAchievements = async () => {
    try {
      const response = await fetch("/api/achievements");
      if (response.ok) {
        const data = await response.json();
        setAchievements(data);
      }
    } catch (error) {
      console.error("Error loading achievements:", error);
    }
  };

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
        <h1 className="text-3xl font-bold text-foreground">Achievements</h1>
        <p className="text-warm-gray mt-1">Your fitness milestones and badges</p>
      </div>

      {achievements.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <AchievementBadge key={achievement.id} achievement={achievement} />
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-warm-gray-light mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">No achievements yet</h2>
            <p className="text-warm-gray">
              Complete workouts and check-ins to unlock achievements!
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

