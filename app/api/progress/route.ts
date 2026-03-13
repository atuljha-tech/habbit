import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import HabitLog from "@/models/HabitLog"

export async function GET() {
  await connectDB()

  const logs = await HabitLog.find()

  const progressMap: any = {}

  logs.forEach((log) => {
    if (!progressMap[log.date]) {
      progressMap[log.date] = 0
    }

    if (log.completed) {
      progressMap[log.date] += 1
    }
  })

  const result = Object.keys(progressMap).map((date) => ({
    date,
    completed: progressMap[date],
  }))

  return NextResponse.json(result)
}