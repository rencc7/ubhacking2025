import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/get-user";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await db.userProfile.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json(profile || null);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
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
    const { bodyTypeGoal, currentWeight, targetWeight, fitnessLevel, preferences } = body;

    const profile = await db.userProfile.create({
      data: {
        userId: user.id,
        bodyTypeGoal,
        currentWeight,
        targetWeight,
        fitnessLevel,
        preferences: preferences ? JSON.stringify(preferences) : null,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bodyTypeGoal, currentWeight, targetWeight, fitnessLevel, preferences } = body;

    const profile = await db.userProfile.update({
      where: { userId: user.id },
      data: {
        ...(bodyTypeGoal !== undefined && { bodyTypeGoal }),
        ...(currentWeight !== undefined && { currentWeight }),
        ...(targetWeight !== undefined && { targetWeight }),
        ...(fitnessLevel !== undefined && { fitnessLevel }),
        ...(preferences !== undefined && {
          preferences: preferences ? JSON.stringify(preferences) : null,
        }),
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

