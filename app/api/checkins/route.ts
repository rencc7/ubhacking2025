import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/get-user";
import { db } from "@/lib/db";
import { startOfDay, endOfDay } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const checkIns = await db.dailyCheckIn.findMany({
      where: {
        userId: user.id,
        ...(startDate && endDate
          ? {
              date: {
                gte: new Date(startDate),
                lte: new Date(endDate),
              },
            }
          : {}),
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(checkIns);
  } catch (error) {
    console.error("Error fetching check-ins:", error);
    return NextResponse.json(
      { error: "Failed to fetch check-ins" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { mood, motivation, notes } = body;

    if (!mood || !motivation) {
      return NextResponse.json(
        { error: "Mood and motivation are required" },
        { status: 400 }
      );
    }

    const today = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    // Check if check-in already exists for today
    const existingCheckIn = await db.dailyCheckIn.findFirst({
      where: {
        userId: user.id,
        date: {
          gte: today,
          lte: todayEnd,
        },
      },
    });

    if (existingCheckIn) {
      // Update existing check-in
      const updatedCheckIn = await db.dailyCheckIn.update({
        where: { id: existingCheckIn.id },
        data: {
          mood,
          motivation,
          notes,
          completed: true,
        },
      });

      return NextResponse.json(updatedCheckIn);
    }

    // Create new check-in
    const checkIn = await db.dailyCheckIn.create({
      data: {
        userId: user.id,
        date: today,
        mood,
        motivation,
        notes,
        completed: true,
      },
    });

    // Calculate streak
    const streak = await calculateStreak(user.id);

    // Check for achievements
    const { checkAchievements } = await import("@/lib/achievements");
    await checkAchievements(user.id);

    return NextResponse.json({ checkIn, streak });
  } catch (error) {
    console.error("Error creating check-in:", error);
    return NextResponse.json(
      { error: "Failed to create check-in" },
      { status: 500 }
    );
  }
}

async function calculateStreak(userId: string): Promise<number> {
  const checkIns = await db.dailyCheckIn.findMany({
    where: {
      userId,
      completed: true,
    },
    orderBy: { date: "desc" },
  });

  if (checkIns.length === 0) return 0;

  let streak = 0;
  const today = startOfDay(new Date());
  let currentDate = today;

  for (const checkIn of checkIns) {
    const checkInDate = startOfDay(checkIn.date);
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

  return streak;
}

