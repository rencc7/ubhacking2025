import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/get-user";
import { createWorkoutPlan } from "@/lib/workout-generator";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bodyTypeGoal, fitnessLevel, durationWeeks, preferences } = body;

    if (!bodyTypeGoal || !fitnessLevel || !durationWeeks) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update or create user profile
    if (user.profile) {
      await db.userProfile.update({
        where: { userId: user.id },
        data: {
          bodyTypeGoal,
          fitnessLevel,
          preferences: preferences ? JSON.stringify(preferences) : null,
        },
      });
    } else {
      await db.userProfile.create({
        data: {
          userId: user.id,
          bodyTypeGoal,
          fitnessLevel,
          preferences: preferences ? JSON.stringify(preferences) : null,
        },
      });
    }

    // Create workout plan
    const result = await createWorkoutPlan(
      user.id,
      bodyTypeGoal,
      fitnessLevel,
      durationWeeks,
      preferences
    );

    return NextResponse.json({
      success: true,
      workoutPlan: result.workoutPlan,
      sessionsCount: result.sessions.length,
    });
  } catch (error) {
    console.error("Error generating workout plan:", error);
    return NextResponse.json(
      { error: "Failed to generate workout plan" },
      { status: 500 }
    );
  }
}

