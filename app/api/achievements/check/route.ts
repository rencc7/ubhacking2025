import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/get-user";
import { checkAchievements } from "@/lib/achievements";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await checkAchievements(user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error checking achievements:", error);
    return NextResponse.json(
      { error: "Failed to check achievements" },
      { status: 500 }
    );
  }
}

