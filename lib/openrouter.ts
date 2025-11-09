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
  daysPerWeek: number,
  preferences?: string
): Promise<string> {
  const prompt = `You are an expert fitness trainer. Create a detailed ${durationWeeks}-week workout plan for someone who wants to achieve a "${bodyTypeGoal}" body type.

User Details:
- Fitness Level: ${fitnessLevel}
- Goal: ${bodyTypeGoal}
- Duration: ${durationWeeks} weeks
- Days per week to workout: ${daysPerWeek}
${preferences ? `- Preferences: ${preferences}` : ""}

Create a comprehensive workout plan that includes:
1. Weekly schedule with exactly ${daysPerWeek} workout days per week (no more, no less)
2. Exercise details (name, sets, reps, duration, rest periods)
3. Progressive overload (increase intensity over weeks)
4. Rest day recommendations
5. Exercise variations for different fitness levels

Important requirements:
1. Each workout day MUST contain 3 to 5 exercises, no more and no less
2. Every week MUST have unique workouts, with different exercises, order, or focus. Do NOT repeat the same week multiple times. Each week should be tailored and progressively overloaded.
3. Include detailed exercises for EVERY week, not just the first week. Do NOT return only one week and repeat it. The JSON must contain ${durationWeeks} unique weeks, each with exactly ${daysPerWeek} workout days.
4. For plank-type exercises (e.g. Side Plank), show sets as seconds (e.g. "3 sets x 30 seconds").
5. For foam rolling or stretching exercises, do NOT show sets if not relevant.
6. Instructions must be complete, clear, and never abbreviated. Do not use ellipses or incomplete sentences. Always provide full step-by-step instructions for each exercise.
7. Each exercise must be complete with all details.

Format the response as a JSON object with this structure:
{
  "weeks": [
    {
      "weekNumber": 1,
      "days": [
        {
          "dayNumber": 1, // MUST have user input duration number of weeks, no more or no less
          "dayName": "Monday",
          "focus": "Upper Body",
          "exercises": [  // MUST include 4-6 exercises for each day
            {
              "name": "Push-ups",
              "type": "strength",
              "muscleGroups": ["chest", "shoulders", "triceps"],
              "sets": 3,
              "reps": 10,
              "restSeconds": 60,
              "instructions": "Keep your body in a straight line with your hands shoulder-width apart. Lower your body until your chest nearly touches the floor, then push back up. Repeat for the prescribed number of reps."
            }
          ]
        }
      ]
    }
  ]
}

Make sure the plan is realistic, progressive, and tailored to achieve the "${bodyTypeGoal}" body type. DO NOT repeat the same week for multiple weeks. Each week must be unique.`;

  try {
    const completion = await openrouter.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
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
  max_tokens: 15000,
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

