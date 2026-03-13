import { NextResponse } from "next/server"
import Groq from "groq-sdk"
import { connectDB } from "@/lib/mongodb"
import HabitLog from "@/models/HabitLog"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!
})

export async function GET() {

  try {

    // Connect database
    await connectDB()

    // Get last 7 days
    const today = new Date()
    const lastWeek = new Date()
    lastWeek.setDate(today.getDate() - 7)

    // Fetch habit logs
    const logs = await HabitLog.find({
      createdAt: { $gte: lastWeek }
    })

    // Calculate stats
    const totalLogs = logs.length
    const completed = logs.filter((log) => log.completed).length
    const missed = totalLogs - completed

    // Group logs by date
    const dailyStats: Record<string, number> = {}

    logs.forEach((log) => {

      const date = log.date

      if (!dailyStats[date]) {
        dailyStats[date] = 0
      }

      if (log.completed) {
        dailyStats[date] += 1
      }

    })

    // AI Prompt
    const prompt = `
You are a productivity coach.

Analyze the user's weekly habit data.

Total habits completed: ${completed}
Total missed: ${missed}

Daily completion:
${JSON.stringify(dailyStats)}

Provide:

1. Productivity summary
2. Positive feedback
3. Suggestions for improvement

Keep the response friendly and motivating.
`

    // Generate AI response using Groq
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a helpful productivity coach."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })

    const reflection = completion.choices[0].message.content

    return NextResponse.json({
      stats: {
        totalLogs,
        completed,
        missed,
        dailyStats
      },
      reflection
    })

  } catch (error) {

    console.error("AI Weekly Reflection Error:", error)

    return NextResponse.json(
      { error: "Failed to generate reflection" },
      { status: 500 }
    )

  }

}