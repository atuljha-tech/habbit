import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Habit from "@/models/Habit"
import HabitLog from "@/models/HabitLog"
import { calculateStreak } from "@/lib/calculateStreak"

export async function GET() {
  await connectDB()

  const habits = await Habit.find()

  const results = []

  for (const habit of habits) {
    const logs = await HabitLog.find({ habitId: habit._id })

    const streak = calculateStreak(logs)

    results.push({
      habitId: habit._id,
      title: habit.title,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
    })
  }

  return NextResponse.json(results)
}