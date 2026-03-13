import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Habit from "@/models/Habit"

export async function POST(req: Request) {
  await connectDB()

  const body = await req.json()

  const habit = await Habit.create(body)

  return NextResponse.json(habit)
}
export async function GET() {
  await connectDB()

  const habits = await Habit.find()

  return NextResponse.json(habits)
}