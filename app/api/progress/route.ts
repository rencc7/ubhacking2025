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
    const limit = searchParams.get("limit");

    const progressLogs = await db.progressLog.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(progressLogs);
  } catch (error) {
    console.error("Error fetching progress logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress logs" },
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
    const { date, weight, photos, measurements, notes } = body;

    const progressLog = await db.progressLog.create({
      data: {
        userId: user.id,
        date: date ? new Date(date) : new Date(),
        weight,
        photos: photos ? JSON.stringify(photos) : null,
        measurements: measurements ? JSON.stringify(measurements) : null,
        notes,
      },
    });

    return NextResponse.json(progressLog);
  } catch (error) {
    console.error("Error creating progress log:", error);
    return NextResponse.json(
      { error: "Failed to create progress log" },
      { status: 500 }
    );
  }
}

