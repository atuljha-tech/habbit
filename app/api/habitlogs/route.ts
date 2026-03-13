import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import HabitLog from "@/models/HabitLog"

export async function POST(req: Request) {
  await connectDB()

  const body = await req.json()

  const existing = await HabitLog.findOne({
    habitId: body.habitId,
    date: body.date
  })

  if (existing) {
    return NextResponse.json(existing)
  }

  const log = await HabitLog.create(body)

  return NextResponse.json(log)
}
export async function GET(req: Request) {
  await connectDB()

  const { searchParams } = new URL(req.url)
  const date = searchParams.get("date")

  let logs

  if (date) {
    logs = await HabitLog.find({ date })
  } else {
    logs = await HabitLog.find({})
  }

  return NextResponse.json(logs)
}