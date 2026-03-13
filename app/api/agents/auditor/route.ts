import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import HabitLog from "@/models/HabitLog"
import Habit from "@/models/Habit"

export async function GET(req: Request) {
  try {
    await connectDB()

    // Get days from URL (default 1)
    const { searchParams } = new URL(req.url)
    const days = Number(searchParams.get("days")) || 1
    
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const habits = await Habit.find({})
    const brokenHabits = []

    for (const habit of habits) {
      const logs = await HabitLog.find({
        habitId: habit._id,
        date: { $gte: cutoffDate }
      })

      // Only add to brokenHabits if NO logs in the time period
      if (logs.length === 0) {
        brokenHabits.push(habit)
      }
    }

    // IMPORTANT: Remove the demo fallback that returns all habits
    // DO NOT add this fallback:
    // if (brokenHabits.length === 0 && habits.length > 0) {
    //   return NextResponse.json([habits[0]])
    // }

    console.log(`📋 Truly broken habits (last ${days} day${days > 1 ? 's' : ''}):`, brokenHabits.length)
    return NextResponse.json(brokenHabits)

  } catch (error) {
    console.error("❌ Auditor API error:", error)
    return NextResponse.json({ error: "Failed to check habits" }, { status: 500 })
  }
}