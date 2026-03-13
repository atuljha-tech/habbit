import mongoose from "mongoose"

const JournalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  content: String,
  date: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.Journal ||
  mongoose.model("Journal", JournalSchema)