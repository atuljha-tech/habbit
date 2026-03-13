import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Habit from "@/models/Habit"
import HabitLog from "@/models/HabitLog"

// For Next.js 15+, params is a Promise
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    // Await the params
    const { id } = await params
    
    // Delete the habit
    const deletedHabit = await Habit.findByIdAndDelete(id)
    
    if (!deletedHabit) {
      return NextResponse.json(
        { error: "Habit not found" },
        { status: 404 }
      )
    }
    
    // Also delete all logs associated with this habit
    await HabitLog.deleteMany({ habitId: id })
    
    console.log(`✅ Deleted habit: ${deletedHabit.title}`)
    
    return NextResponse.json({ 
      success: true,
      message: "Habit deleted successfully" 
    })
    
  } catch (error) {
    console.error("❌ Delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete habit" },
      { status: 500 }
    )
  }
}
