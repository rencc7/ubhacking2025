import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/get-user";
import { generateWeeklyReport } from "@/lib/openrouter";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { weekNumber, completedWorkouts, totalWorkouts, achievements } = body;

    const report = await generateWeeklyReport(weekNumber, completedWorkouts, totalWorkouts, achievements || []);

    return NextResponse.json({ report });
  } catch (error) {
    console.error("Error generating weekly report:", error);
    return NextResponse.json(
      { error: "Failed to generate weekly report" },
      { status: 500 }
    );
  }
}

