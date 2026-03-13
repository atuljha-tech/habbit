import { NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!
})

export async function GET() {

  try {

    const prompt = `
Suggest 5 productivity habits for a person
trying to improve focus and mental health.
`

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a productivity expert."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })

    const suggestions = completion.choices[0].message.content

    return NextResponse.json({
      suggestions
    })

  } catch (error) {

    console.error("AI Habit Suggestion Error:", error)

    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    )

  }

}