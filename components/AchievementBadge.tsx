"use client";

import { Trophy, Award, Star, Target, Flame } from "lucide-react";
import { format } from "date-fns";

interface Achievement {
  id: string;
  type: string;
  description: string | null;
  unlockedAt: Date;
}

interface AchievementBadgeProps {
  achievement: Achievement;
}

const achievementIcons: Record<string, React.ReactNode> = {
  streak: <Flame className="w-6 h-6" />,
  workout_complete: <Target className="w-6 h-6" />,
  weight_loss: <Trophy className="w-6 h-6" />,
  milestone: <Award className="w-6 h-6" />,
  default: <Star className="w-6 h-6" />,
};

const achievementColors: Record<string, string> = {
  streak: "bg-orange-100 text-orange-600",
  workout_complete: "bg-blue-100 text-blue-600",
  weight_loss: "bg-green-100 text-green-600",
  milestone: "bg-purple-100 text-purple-600",
  default: "bg-accent text-warm-gray",
};

export default function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const icon = achievementIcons[achievement.type] || achievementIcons.default;
  const colorClass = achievementColors[achievement.type] || achievementColors.default;

  return (
    <div className="bg-card rounded-xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full ${colorClass}`}>{icon}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground capitalize">
            {achievement.type.replace(/_/g, " ")}
          </h3>
          {achievement.description && (
            <p className="text-sm text-warm-gray mt-1">{achievement.description}</p>
          )}
          <p className="text-xs text-warm-gray-light mt-2">
            Unlocked {format(new Date(achievement.unlockedAt), "MMM d, yyyy")}
          </p>
        </div>
      </div>
    </div>
  );
}

