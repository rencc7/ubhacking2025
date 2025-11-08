export interface User {
  id: string;
  auth0Id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  bodyTypeGoal: string | null;
  currentWeight: number | null;
  targetWeight: number | null;
  fitnessLevel: string | null;
  preferences: string | null;
}

export interface DailyCheckIn {
  id: string;
  userId: string;
  date: Date;
  mood: number;
  motivation: number;
  notes: string | null;
  completed: boolean;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  goal: string;
  durationWeeks: number;
  startDate: Date;
  endDate: Date;
  aiGenerated: boolean;
}

export interface WorkoutSession {
  id: string;
  workoutPlanId: string;
  weekNumber: number;
  dayNumber: number;
  exercises: string; // JSON string
  completed: boolean;
  completedAt: Date | null;
}

export interface Exercise {
  id: string;
  name: string;
  type: string;
  muscleGroups: string;
  instructions: string | null;
  sets: number | null;
  reps: number | null;
  duration: number | null;
}

export interface ProgressLog {
  id: string;
  userId: string;
  date: Date;
  weight: number | null;
  photos: string | null;
  measurements: string | null;
  notes: string | null;
}

export interface Achievement {
  id: string;
  userId: string;
  type: string;
  unlockedAt: Date;
  description: string | null;
}

