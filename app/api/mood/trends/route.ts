
import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Journal from "@/models/Journal"

// Detect mood from journal text
function detectMood(text?: string) {

  if (!text || typeof text !== "string") {
    return 2 // neutral fallback
  }

  const lower = text.toLowerCase()

  // positive mood
  if (
    lower.includes("happy") ||
    lower.includes("great") ||
    lower.includes("good") ||
    lower.includes("productive") ||
    lower.includes("excited")
  ) {
    return 3
  }

  // negative mood
  if (
    lower.includes("sad") ||
    lower.includes("tired") ||
    lower.includes("stressed") ||
    lower.includes("bad") ||
    lower.includes("angry")
  ) {
    return 1
  }

  return 2 // neutral
}

export async function GET(req: Request) {
  try {

    await connectDB()

    const { searchParams } = new URL(req.url)
    const days = Number(searchParams.get("days")) || 14

    const journals = await Journal.find({})
      .sort({ date: -1 })
      .limit(days)

    const data = journals
      .map((j) => ({
        date: j.date ? new Date(j.date).toISOString().split("T")[0] : "Unknown",
        mood: detectMood(j.content || "")
      }))
      .reverse()

    return NextResponse.json(data)

  } catch (error) {

    console.error("Mood trends API error:", error)

    return NextResponse.json(
      { error: "Failed to fetch mood trends" },
      { status: 500 }
    )
  }
}