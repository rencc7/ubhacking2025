import OpenAI from "openai";

// OpenRouter uses OpenAI-compatible API
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.AUTH0_BASE_URL || "http://localhost:3000",
    "X-Title": "FitAI - Fitness App",
  },
});

export async function generateWorkoutPlan(
  bodyTypeGoal: string,
  fitnessLevel: string,
  durationWeeks: number,
  preferences?: string
): Promise<string> {
  const prompt = `You are an expert fitness trainer. Create a detailed ${durationWeeks}-week workout plan for someone who wants to achieve a "${bodyTypeGoal}" body type.

User Details:
- Fitness Level: ${fitnessLevel}
- Goal: ${bodyTypeGoal}
- Duration: ${durationWeeks} weeks
${preferences ? `- Preferences: ${preferences}` : ""}

Create a comprehensive workout plan that includes:
1. Weekly schedule with specific exercises for each day
2. Exercise details (name, sets, reps, duration, rest periods)
3. Progressive overload (increase intensity over weeks)
4. Rest day recommendations
5. Exercise variations for different fitness levels

Format the response as a JSON object with this structure:
{
  "weeks": [
    {
      "weekNumber": 1,
      "days": [
        {
          "dayNumber": 1,
          "dayName": "Monday",
          "focus": "Upper Body",
          "exercises": [
            {
              "name": "Push-ups",
              "type": "strength",
              "muscleGroups": ["chest", "shoulders", "triceps"],
              "sets": 3,
              "reps": 10,
              "restSeconds": 60,
              "instructions": "Keep your body in a straight line..."
            }
          ]
        }
      ]
    }
  ]
}

Make sure the plan is realistic, progressive, and tailored to achieve the "${bodyTypeGoal}" body type.`;

  try {
    const completion = await openrouter.chat.completions.create({
      model: "anthropic/claude-3.5-sonnet",
      messages: [
        {
          role: "system",
          content:
            "You are an expert fitness trainer. Always respond with valid JSON only, no additional text or markdown formatting.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    // Clean up the response (remove markdown code blocks if present)
    const cleanedContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    return cleanedContent;
  } catch (error) {
    console.error("Error generating workout plan:", error);
    throw new Error("Failed to generate workout plan");
  }
}

export async function generateMotivationalMessage(userName?: string): Promise<string> {
  const prompt = `Generate a short, inspiring motivational message for a fitness journey. ${userName ? `Address the user as ${userName}.` : ""} Keep it under 100 words and make it warm and encouraging.`;

  try {
    const completion = await openrouter.chat.completions.create({
      model: "anthropic/claude-3.5-sonnet",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 150,
    });

    return completion.choices[0]?.message?.content || "Keep going! You've got this!";
  } catch (error) {
    console.error("Error generating motivational message:", error);
    return "Keep going! You've got this!";
  }
}

export async function generateWeeklyReport(
  weekNumber: number,
  completedWorkouts: number,
  totalWorkouts: number,
  achievements: string[]
): Promise<string> {
  const prompt = `Create a weekly fitness report for week ${weekNumber}. The user completed ${completedWorkouts} out of ${totalWorkouts} workouts. ${achievements.length > 0 ? `Achievements: ${achievements.join(", ")}.` : ""} Make it encouraging and provide insights for the next week. Keep it under 200 words.`;

  try {
    const completion = await openrouter.chat.completions.create({
      model: "anthropic/claude-3.5-sonnet",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return completion.choices[0]?.message?.content || "Great progress this week!";
  } catch (error) {
    console.error("Error generating weekly report:", error);
    return "Great progress this week!";
  }
}

export async function generateNutritionTip(): Promise<string> {
  const prompt = "Provide a helpful, practical nutrition tip for someone on a fitness journey. Keep it under 50 words and make it actionable.";

  try {
    const completion = await openrouter.chat.completions.create({
      model: "anthropic/claude-3.5-sonnet",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 100,
    });

    return completion.choices[0]?.message?.content || "Stay hydrated and eat balanced meals!";
  } catch (error) {
    console.error("Error generating nutrition tip:", error);
    return "Stay hydrated and eat balanced meals!";
  }
}

