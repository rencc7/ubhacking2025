import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/get-user";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const workoutPlanId = searchParams.get("workoutPlanId");
    const weekNumber = searchParams.get("weekNumber");

    if (workoutPlanId) {
      // Get specific workout plan with sessions
      const workoutPlan = await db.workoutPlan.findUnique({
        where: { id: workoutPlanId, userId: user.id },
        include: {
          sessions: {
            where: weekNumber ? { weekNumber: parseInt(weekNumber) } : undefined,
            orderBy: [{ weekNumber: "asc" }, { dayNumber: "asc" }],
          },
        },
      });

      if (!workoutPlan) {
        return NextResponse.json({ error: "Workout plan not found" }, { status: 404 });
      }

      return NextResponse.json(workoutPlan);
    }

    // Get all workout plans for user
    const workoutPlans = await db.workoutPlan.findMany({
      where: { userId: user.id },
      include: {
        sessions: {
          orderBy: [{ weekNumber: "asc" }, { dayNumber: "asc" }],
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(workoutPlans);
  } catch (error) {
    console.error("Error fetching workout plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch workout plans" },
      { status: 500 }
    );
  }
}

