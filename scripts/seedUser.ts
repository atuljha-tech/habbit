import mongoose from "mongoose"
import dotenv from "dotenv"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Check multiple possible locations
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

// Type assertion to tell TypeScript it's definitely a string
const uri: string = MONGODB_URI as string

console.log("MongoDB URI found, attempting to connect...")

// Define User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model("User", userSchema)

async function seed() {
  try {
    // Use the asserted uri variable
    await mongoose.connect(uri)
    console.log("✅ Connected to MongoDB successfully")

    const existingUser = await User.findOne({ email: "demo@dailyroutine.app" })
    
    if (existingUser) {
      console.log("✅ Demo user already exists:", existingUser)
    } else {
      const newUser = await User.create({
        name: "Demo User",
        email: "demo@dailyroutine.app"
      })
      console.log("✅ Demo user created successfully:", newUser)
    }

    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error("❌ Error:", error)
    process.exit(1)
  }
}

seed()