import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/get-user";
import { db } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionId = params.id;

    // Verify session belongs to user
    const session = await db.workoutSession.findFirst({
      where: {
        id: sessionId,
        workoutPlan: {
          userId: user.id,
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Mark session as completed
    const updatedSession = await db.workoutSession.update({
      where: { id: sessionId },
      data: {
        completed: true,
        completedAt: new Date(),
      },
    });

    // Check for achievements
    const { checkAchievements } = await import("@/lib/achievements");
    await checkAchievements(user.id);

    return NextResponse.json({ success: true, session: updatedSession });
  } catch (error) {
    console.error("Error completing workout session:", error);
    return NextResponse.json(
      { error: "Failed to complete workout session" },
      { status: 500 }
    );
  }
}

