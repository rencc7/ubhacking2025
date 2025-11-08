import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/get-user";
import { generateNutritionTip } from "@/lib/openrouter";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tip = await generateNutritionTip();

    return NextResponse.json({ tip });
  } catch (error) {
    console.error("Error generating nutrition tip:", error);
    return NextResponse.json(
      { error: "Failed to generate nutrition tip" },
      { status: 500 }
    );
  }
}

