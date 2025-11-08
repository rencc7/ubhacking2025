import { db } from "./db";

export interface AchievementCheck {
  type: string;
  description: string;
  shouldUnlock: boolean;
}

export async function checkAchievements(userId: string): Promise<void> {
  // Check for various achievements
  const checks: AchievementCheck[] = [];

  // Check workout completion achievements
  const completedWorkouts = await db.workoutSession.count({
    where: {
      workoutPlan: { userId },
      completed: true,
    },
  });

  if (completedWorkouts >= 1) {
    checks.push({
      type: "first_workout",
      description: "Completed your first workout!",
      shouldUnlock: !(await db.achievement.findFirst({
        where: { userId, type: "first_workout" },
      })),
    });
  }

  if (completedWorkouts >= 10) {
    checks.push({
      type: "workout_milestone_10",
      description: "Completed 10 workouts!",
      shouldUnlock: !(await db.achievement.findFirst({
        where: { userId, type: "workout_milestone_10" },
      })),
    });
  }

  if (completedWorkouts >= 50) {
    checks.push({
      type: "workout_milestone_50",
      description: "Completed 50 workouts!",
      shouldUnlock: !(await db.achievement.findFirst({
        where: { userId, type: "workout_milestone_50" },
      })),
    });
  }

  // Check check-in streak
  const checkIns = await db.dailyCheckIn.findMany({
    where: { userId, completed: true },
    orderBy: { date: "desc" },
  });

  let streak = 0;
  if (checkIns.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let currentDate = new Date(today);

    for (const checkIn of checkIns) {
      const checkInDate = new Date(checkIn.date);
      checkInDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor(
        (currentDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === streak) {
        streak++;
        currentDate = checkInDate;
      } else {
        break;
      }
    }
  }

  if (streak >= 7) {
    checks.push({
      type: "streak_7",
      description: "7-day check-in streak!",
      shouldUnlock: !(await db.achievement.findFirst({
        where: { userId, type: "streak_7" },
      })),
    });
  }

  if (streak >= 30) {
    checks.push({
      type: "streak_30",
      description: "30-day check-in streak!",
      shouldUnlock: !(await db.achievement.findFirst({
        where: { userId, type: "streak_30" },
      })),
    });
  }

  // Check weight loss achievements
  const progressLogs = await db.progressLog.findMany({
    where: { userId },
    orderBy: { date: "asc" },
  });

  if (progressLogs.length > 0) {
    const firstWeight = progressLogs[0].weight;
    const lastWeight = progressLogs[progressLogs.length - 1].weight;

    if (firstWeight && lastWeight && firstWeight > lastWeight) {
      const weightLoss = firstWeight - lastWeight;

      if (weightLoss >= 5) {
        checks.push({
          type: "weight_loss_5",
          description: "Lost 5 lbs!",
          shouldUnlock: !(await db.achievement.findFirst({
            where: { userId, type: "weight_loss_5" },
          })),
        });
      }

      if (weightLoss >= 10) {
        checks.push({
          type: "weight_loss_10",
          description: "Lost 10 lbs!",
          shouldUnlock: !(await db.achievement.findFirst({
            where: { userId, type: "weight_loss_10" },
          })),
        });
      }
    }
  }

  // Unlock achievements
  for (const check of checks) {
    if (check.shouldUnlock) {
      await db.achievement.create({
        data: {
          userId,
          type: check.type,
          description: check.description,
        },
      });
    }
  }
}

