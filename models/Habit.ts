import mongoose from "mongoose"

const HabitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  title: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.Habit ||
  mongoose.model("Habit", HabitSchema)