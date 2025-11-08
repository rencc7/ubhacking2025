import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/get-user";
import { db } from "@/lib/db";
import { startOfDay, endOfDay } from "date-fns";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const checkIn = await db.dailyCheckIn.findFirst({
      where: {
        userId: user.id,
        date: {
          gte: today,
          lte: todayEnd,
        },
      },
    });

    return NextResponse.json({ checkIn, hasCheckedIn: !!checkIn });
  } catch (error) {
    console.error("Error fetching today's check-in:", error);
    return NextResponse.json(
      { error: "Failed to fetch check-in" },
      { status: 500 }
    );
  }
}

