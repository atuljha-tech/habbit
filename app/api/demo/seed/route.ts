import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Journal from "@/models/Journal"
import HabitLog from "@/models/HabitLog"
import Habit from "@/models/Habit"
import User from "@/models/User"

const journalEntries = [
  "Today I woke up early and completed my morning workout. Felt energized!",
  "Focused deeply on coding today and finished an important feature.",
  "Had trouble focusing but managed to finish my main tasks.",
  "Meditation helped me stay calm and productive.",
  "Worked on improving my habits and tracking my progress.",
  "Felt slightly tired today but still completed most habits.",
  "Spent time learning Next.js and building new features.",
  "Improved my focus by reducing social media distractions.",
  "Great day for productivity and planning the week ahead.",
  "Worked consistently on my personal development.",
  "Completed all habits and maintained my streak!",
  "Learned something new about backend APIs.",
  "Felt motivated seeing my habit streak grow.",
  "Reflected on my progress and planned next steps."
]

const habitNames = [
  "Morning Exercise",
  "Meditation", 
  "Coding Practice",
  "Drink Water",
  "Read 10 Pages"
]

export async function POST() {
  try {
    await connectDB()
    
    // Find demo user
    const user = await User.findOne({ email: "demo@dailyroutine.app" })
    
    if (!user) {
      return NextResponse.json(
        { error: "Demo user not found. Run seedUser.ts first." },
        { status: 404 }
      )
    }

    // Clear existing data
    await Journal.deleteMany({ userId: user._id })
    await HabitLog.deleteMany({ userId: user._id })
    await Habit.deleteMany({ userId: user._id })

    // Create habits
    const habits = await Promise.all(
      habitNames.map(name => 
        Habit.create({
          title: name,
          userId: user._id,
          createdAt: new Date()
        })
      )
    )

    // Generate 14 days of data
    for (let i = 0; i < 14; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      // Journal entry
      if (i < journalEntries.length) {
        await Journal.create({
          text: journalEntries[i],
          userId: user._id,
          date: dateStr,
          createdAt: date
        })
      }

      // Habit logs
      for (const habit of habits) {
        const completed = Math.random() > 0.2 // 80% completion rate
        await HabitLog.create({
          habitId: habit._id,
          userId: user._id,
          completed,
          date: dateStr,
          createdAt: date
        })
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Demo data loaded successfully!" 
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load demo data" },
      { status: 500 }
    )
  }
}