import mongoose from "mongoose"

const HabitLogSchema = new mongoose.Schema({
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Habit",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: true,
  },
})

export default mongoose.models.HabitLog ||
  mongoose.model("HabitLog", HabitLogSchema)