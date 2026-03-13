import mongoose from "mongoose"
import dotenv from "dotenv"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"

// Import your models - WITHOUT the .ts extension
import Journal from "../models/Journal"
import HabitLog from "../models/HabitLog"
import Habit from "../models/Habit"
import User from "../models/User"

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Check multiple possible locations for .env.local
const possiblePaths = [
  path.resolve(__dirname, "../.env.local"),
  path.resolve(process.cwd(), ".env.local"),
  path.resolve(__dirname, "../../.env.local"),
]

let envLoaded = false
for (const envPath of possiblePaths) {
  console.log("Checking for .env.local at:", envPath)
  if (fs.existsSync(envPath)) {
    console.log("Found .env.local at:", envPath)
    dotenv.config({ path: envPath })
    envLoaded = true
    break
  }
}

if (!envLoaded) {
  console.error("Error: Could not find .env.local file in any of these locations:", possiblePaths)
  process.exit(1)
}

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined in .env.local file")
  process.exit(1)
}

// Type assertion
const uri: string = MONGODB_URI as string

console.log("MongoDB URI found, attempting to connect...")

// Sample journal entries (realistic reflections)
const journalEntries = [
  "Today I woke up early and completed my morning workout. Felt energized and ready to tackle the day's challenges.",
  "Focused deeply on coding today and finished an important feature for the project. Progress feels good.",
  "Had trouble focusing but managed to finish my main tasks. Need to improve concentration tomorrow.",
  "Meditation helped me stay calm and productive throughout the day. Definitely adding this to my daily routine.",
  "Worked on improving my habits and tracking my progress. The streak feature is really motivating me!",
  "Felt slightly tired today but still completed most habits. Consistency over perfection!",
  "Spent time learning Next.js and building new features. Love how fast development is with this stack.",
  "Improved my focus by reducing social media distractions. Scrolling through Twitter was killing my productivity.",
  "Great day for productivity and planning the week ahead. Feeling organized and in control.",
  "Worked consistently on my personal development. Small daily improvements lead to big results.",
  "Completed all habits and maintained my streak! 7 days and going strong 💪",
  "Learned something new about backend APIs today. Implementing better error handling in my routes.",
  "Felt motivated seeing my habit streak grow. The visual progress is really encouraging.",
  "Reflected on my progress and planned next steps. Setting clear intentions for the coming week.",
  "Had a productive morning but got distracted in the afternoon. Need to work on maintaining focus.",
  "Exercise really boosts my mood. Going to make this a non-negotiable part of my day.",
  "Coding session was intense but rewarding. Solved a tricky bug that's been bothering me for days.",
  "Mindfulness practice is getting easier. Starting to notice benefits in my daily life.",
  "Productivity was high today. Finished all tasks before noon and had free time in the evening.",
  "Learning to be kinder to myself on days when I don't hit all my goals. Progress not perfection."
]

// Sample habits
const habitNames = [
  "Morning Exercise",
  "Meditation", 
  "Coding Practice",
  "Drink 8 Glasses of Water",
  "Read 10 Pages",
  "Journal Writing",
  "No Social Media Morning",
  "Evening Stretch",
  "Plan Next Day",
  "Healthy Meal Prep"
]

// Demo user email
const DEMO_USER_EMAIL = "demo@dailyroutine.app"

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(uri)
    console.log("✅ Connected to MongoDB successfully")

    // Find or create demo user
    let user = await User.findOne({ email: DEMO_USER_EMAIL })
    
    if (!user) {
      console.log("Demo user not found, creating one...")
      user = await User.create({
        name: "Demo User",
        email: DEMO_USER_EMAIL
      })
      console.log("✅ Demo user created")
    } else {
      console.log("✅ Found existing demo user:", user.email)
    }

    // Clear existing demo data for this user
    console.log("Clearing existing demo data...")
    await Journal.deleteMany({ userId: user._id })
    await HabitLog.deleteMany({ userId: user._id })
    await Habit.deleteMany({ userId: user._id })
    console.log("✅ Cleared existing data")

    // Create habits for the user (first 5 habits)
    console.log("Creating habits...")
    const createdHabits = []
    for (const habitName of habitNames.slice(0, 5)) {
      const habit = await Habit.create({
        title: habitName,
        userId: user._id,
        createdAt: new Date()
      })
      createdHabits.push(habit)
      console.log(`   Created habit: ${habitName}`)
    }
    console.log(`✅ Created ${createdHabits.length} habits`)

    // Generate 30 days of data
    console.log("Generating 30 days of journal entries and habit logs...")
    
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(12, 0, 0, 0) // Set to noon to avoid timezone issues
      
      const dateStr = date.toISOString().split("T")[0]
      
      // Create journal entry (not for every day to make it realistic)
      if (i < journalEntries.length && Math.random() > 0.3) { // 70% chance of journal entry
        await Journal.create({
          text: journalEntries[i % journalEntries.length],
          userId: user._id,
          createdAt: date,
          date: dateStr
        })
      }

      // Create habit logs for each habit with realistic completion patterns
      for (const habit of createdHabits) {
        // Create realistic completion patterns based on how many days ago
        let completionRate = 0.8 // Base 80% completion
        
        if (i < 7) {
          completionRate = 0.9 // First week: 90% completion (motivated)
        } else if (i < 14) {
          completionRate = 0.6 // Second week: 60% completion (struggle phase)
        } else if (i < 21) {
          completionRate = 0.7 // Third week: 70% completion (recovery)
        } else {
          completionRate = 0.85 // Recent: 85% completion (building streak)
        }
        
        // Add some randomness
        const completed = Math.random() < completionRate
        
        await HabitLog.create({
          habitId: habit._id,
          userId: user._id,
          completed,
          date: dateStr,
          createdAt: date
        })
      }
      
      // Progress indicator
      if ((i + 1) % 5 === 0) {
        console.log(`   Generated ${i + 1} days of data...`)
      }
    }

    console.log("\n✅ Demo data seeding completed successfully!")
    console.log("\n📊 Summary:")
    console.log(`   - User: ${user.name} (${user.email})`)
    console.log(`   - Habits: ${createdHabits.length}`)
    console.log(`   - Days of data: 30`)
    console.log(`   - Journal entries: ~${Math.floor(30 * 0.7)}`)
    console.log(`   - Habit logs: ${createdHabits.length * 30}`)
    
    await mongoose.connection.close()
    console.log("✅ Database connection closed")
    
    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding data:", error)
    process.exit(1)
  }
}

// Run the seed function
seed()