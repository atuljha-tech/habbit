import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Journal from "@/models/Journal"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(req: Request) {
  try {
    await connectDB()

    const { habitName } = await req.json()
    
    // ADD THIS LOG
    console.log("🔴 ENFORCER API CALLED WITH HABIT:", habitName)

    if (!habitName) {
      return NextResponse.json(
        { error: "Habit name is required" },
        { status: 400 }
      )
    }

    // Fetch recent journal entries
    const journals = await Journal.find({})
      .sort({ date: -1 })
      .limit(5)

    const journalText = journals.map(j => j.content).join("\n\n---\n\n")

    // Random coach personality styles
    const styles = [
      "sarcastic coach",
      "disappointed mentor",
      "brutally honest trainer",
      "dark humor accountability coach",
      "psychological drill sergeant",
      "passive-aggressive life coach",
      "motivational speaker with attitude",
      "retro 90s gym teacher",
      "tough love therapist",
      "chaotic neutral accountability demon",
      "disappointed parent figure",
      "military-style discipline officer",
      "sassy wellness guru",
      "existentialist philosopher",
      "robotic AI with sass"
    ]

    // Select random style
    const style = styles[Math.floor(Math.random() * styles.length)]
    
    // Debug log to see which style was selected
    console.log("🎭 Coach style used:", style)
    console.log("📋 Failed habit:", habitName)
    console.log("📝 Recent journals count:", journals.length)

    // Generate coaching message with random personality
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.9, // Higher temperature for more variety
      top_p: 0.95,
      max_tokens: 200,
      messages: [
        {
          role: "system",
          content: `You are a ${style} who shames users into fixing broken habits. 
          Your messages should be short, punchy, and match your personality style.
          Be creative with your insults/motivation - make it entertaining but effective.
          Never be mean-spirited - keep it funny and motivating.`
        },
        {
          role: "user",
          content: `
Habit failed: ${habitName}

Here are the user's recent journal entries (last 5):
${journalText || "No recent journal entries found."}

Write a short, impactful accountability message (2-3 sentences max) that:
1. Calls out the failed habit
2. References something from their journals if available
3. Motivates them to get back on track
4. Matches your ${style} personality

Make it memorable and in character!
`
        }
      ]
    })

    const message = completion.choices[0]?.message?.content || "Get back on track! 💪"

    console.log("💬 Generated message:", message)

    return NextResponse.json({ 
      message,
      style, // Optional: return the style used
      success: true 
    })

  } catch (error) {
    console.error("❌ Enforcer API error:", error)
    
    // Fallback messages based on random style if API fails
    const fallbackMessages = [
      "Your habits aren't going to build themselves! Get to work! 💪",
      "Future you is really disappointed right now. Just saying.",
      "Remember that goal you set? Yeah, it's not going to achieve itself.",
      "Your toothbrush has seen more consistency than you this week.",
      "The best time to start was yesterday. The second best time is now. GO!",
      "Discipline is doing what you said you'd do, even when you don't want to.",
      "Your future self is counting on you. Don't let them down.",
      "Success is just a bunch of small efforts, repeated day after day.",
      "You've got this! But only if you actually DO the thing.",
      "No more excuses. Time to lock in and get it done! 🔥"
    ]
    
    const randomFallback = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)]
    
    return NextResponse.json(
      { 
        message: randomFallback,
        style: "motivational friend",
        success: true,
        fallback: true 
      },
      { status: 200 } // Return 200 even on error with fallback
    )
  }
}