import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Habit from "@/models/Habit"
import HabitLog from "@/models/HabitLog"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const habitId = params.id
    
    // Delete the habit
    const deletedHabit = await Habit.findByIdAndDelete(habitId)
    
    if (!deletedHabit) {
      return NextResponse.json(
        { error: "Habit not found" },
        { status: 404 }
      )
    }
    
    // Also delete all logs associated with this habit
    await HabitLog.deleteMany({ habitId })
    
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