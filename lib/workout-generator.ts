import { generateWorkoutPlan } from "./openrouter";
import { db } from "./db";
import { addWeeks, startOfDay } from "date-fns";
import { processExerciseData } from "./exercise-processor";

export interface Exercise {
  name: string;
  type: string;
  muscleGroups: string[];
  sets: number;
  reps?: number | string;
  duration?: number | string;
  restSeconds?: number;
  intervalWork?: number | string;
  intervalRest?: number | string;
  instructions: string;
}

function parseIntervalPattern(repsOrDuration: string): { work?: number; rest?: number } {
  // Match patterns like "30 seconds sprint, 30 seconds rest" or "45s work, 15s rest"
  const pattern = /(\d+)\s*(?:seconds|s|mins?|minutes?)?\s*(?:sprint|work)?,?\s*(\d+)\s*(?:seconds|s|mins?|minutes?)?\s*(?:rest)/i;
  const match = repsOrDuration.match(pattern);
  
  if (match) {
    const workSeconds = parseDurationToSeconds(match[1] + " seconds");
    const restSeconds = parseDurationToSeconds(match[2] + " seconds");
    return {
      work: workSeconds,
      rest: restSeconds
    };
  }
  return {};
}

function parseDurationToSeconds(duration: string): number {
  // Simple implementation: extract number and unit
  const match = duration.match(/(\d+)\s*(seconds|s|mins?|minutes?)/i);
  if (!match) return 0;
  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  if (unit.startsWith('min')) return value * 60;
  return value;
}

export interface WorkoutDay {
  dayNumber: number;
  dayName: string;
  focus: string;
  exercises: Exercise[];
}

export interface WorkoutWeek {
  weekNumber: number;
  days: WorkoutDay[];
}

export interface WorkoutPlanResponse {
  weeks: WorkoutWeek[];
}

export async function createWorkoutPlan(
  userId: string,
  bodyTypeGoal: string,
  fitnessLevel: string,
  durationWeeks: number,
  daysPerWeek: number,
  preferences?: string
) {
  // Generate workout plan using AI
  const aiResponse = await generateWorkoutPlan(bodyTypeGoal, fitnessLevel, durationWeeks, daysPerWeek, preferences);

  // Parse AI response
  let workoutData: WorkoutPlanResponse;
  try {
    workoutData = JSON.parse(aiResponse);
  } catch (error) {
    console.error("Error parsing AI response:", error);
    console.error("Raw AI response:", aiResponse);
    // If response is empty, retry with a shorter prompt
    if (!aiResponse || aiResponse.length < 50) {
      throw new Error("AI response was empty or incomplete. Please try again or reduce the number of weeks.");
    }
    throw new Error("Failed to parse workout plan from AI");
  }

  // Ensure workoutData.weeks matches durationWeeks
  let weeks = workoutData.weeks;
  // No backend randomization. If weeks are missing, just trim or throw error.
  if (weeks.length < durationWeeks) {
    throw new Error(`AI did not return ${durationWeeks} unique weeks. Please try again or adjust your prompt.`);
  }
  // If too many weeks, trim
  if (weeks.length > durationWeeks) {
    weeks = weeks.slice(0, durationWeeks);
  }

  // Create workout plan in database
  const startDate = startOfDay(new Date());
  const endDate = addWeeks(startDate, durationWeeks);

  const workoutPlan = await db.workoutPlan.create({
    data: {
      userId,
      goal: bodyTypeGoal,
      durationWeeks,
      startDate,
      endDate,
      aiGenerated: true,
    },
  });

  // Create workout sessions for each week and day
  const sessions = [];
  for (const week of weeks) {
    for (const day of week.days) {
      // Store exercises as JSON string
      const exercisesJson = JSON.stringify(day.exercises);

      const session = await db.workoutSession.create({
        data: {
          workoutPlanId: workoutPlan.id,
          weekNumber: week.weekNumber,
          dayNumber: day.dayNumber,
          exercises: exercisesJson,
        },
      });

      sessions.push(session);
    }
  }

  // Also create Exercise records for the exercise library
  const uniqueExercises = new Map<string, Exercise>();
  for (const week of workoutData.weeks) {
    for (const day of week.days) {
      for (const exercise of day.exercises) {
        if (!uniqueExercises.has(exercise.name)) {
          uniqueExercises.set(exercise.name, exercise);

          // Check if exercise already exists
          const existingExercise = await db.exercise.findFirst({
            where: { name: exercise.name },
          });

          if (!existingExercise) {
            const processedData = processExerciseData(exercise);
            await db.exercise.create({
              data: processedData
            });
          }
        }
      }
    }
  }

  return { workoutPlan, sessions };
}

export async function expandWorkoutPlan(
  workoutPlanId: string,
  additionalWeeks: number
) {
  const existingPlan = await db.workoutPlan.findUnique({
    where: { id: workoutPlanId },
    include: { sessions: true },
  });

  if (!existingPlan) {
    throw new Error("Workout plan not found");
  }

  // Get user profile for context
  const user = await db.user.findUnique({
    where: { id: existingPlan.userId },
    include: { profile: true },
  });

  if (!user || !user.profile) {
    throw new Error("User profile not found");
  }

  const currentWeeks = existingPlan.durationWeeks;
  const totalWeeks = currentWeeks + additionalWeeks;

  // Generate additional weeks
  const aiResponse = await generateWorkoutPlan(
    user.profile.bodyTypeGoal || "fitness",
    user.profile.fitnessLevel || "intermediate",
    totalWeeks,
    user.profile.preferences || undefined
  );

  let workoutData: WorkoutPlanResponse;
  try {
    workoutData = JSON.parse(aiResponse);
  } catch (error) {
    console.error("Error parsing AI response:", error);
    throw new Error("Failed to parse workout plan from AI");
  }

  // Update workout plan duration
  const updatedPlan = await db.workoutPlan.update({
    where: { id: workoutPlanId },
    data: {
      durationWeeks: totalWeeks,
      endDate: addWeeks(existingPlan.startDate, totalWeeks),
    },
  });

  // Add only the new weeks (weeks after currentWeeks)
  const newWeeks = workoutData.weeks.filter((week) => week.weekNumber > currentWeeks);
  const sessions = [];

  for (const week of newWeeks) {
    for (const day of week.days) {
      const exercisesJson = JSON.stringify(day.exercises);

      const session = await db.workoutSession.create({
        data: {
          workoutPlanId: updatedPlan.id,
          weekNumber: week.weekNumber,
          dayNumber: day.dayNumber,
          exercises: exercisesJson,
        },
      });

      sessions.push(session);
    }
  }

  return { workoutPlan: updatedPlan, newSessions: sessions };
}

