import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import HabitLog from "@/models/HabitLog"

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()
    const { habitId, date, completed } = body

    if (!habitId || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    console.log("API received:", { habitId, date, completed })

    if (completed) {
      // Mark as done - create or update log
      const existingLog = await HabitLog.findOne({ habitId, date })
      
      if (existingLog) {
        existingLog.completed = true
        await existingLog.save()
      } else {
        await HabitLog.create({ habitId, date, completed: true })
      }
    } else {
      // Undo - delete the log
      await HabitLog.deleteOne({ habitId, date })
    }

    // Return updated logs
    const updatedLogs = await HabitLog.find({ date })
    return NextResponse.json({ success: true, logs: updatedLogs })

  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const date = searchParams.get("date")

    let logs

    if (date) {
      logs = await HabitLog.find({ date })
    } else {
      logs = await HabitLog.find({}).sort({ date: -1 })
    }

    return NextResponse.json(logs)

  } catch (error) {
    console.error("Error fetching habit logs:", error)
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    )
  }
}