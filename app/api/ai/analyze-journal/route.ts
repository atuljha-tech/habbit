import { NextResponse } from "next/server"
import { analyzeJournal } from "@/lib/groq"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const text = body.text

    console.log("📝 API received journal:", {
      length: text?.length,
      preview: text?.substring(0, 100),
      hasText: !!text
    })

    if (!text || text.trim().length === 0) {
      console.log("❌ No text provided")
      return NextResponse.json(
        { error: "Journal text is required" },
        { status: 400 }
      )
    }

    console.log("🤖 Calling analyzeJournal...")
    const result = await analyzeJournal(text)
    console.log("✅ Analysis complete")

    return NextResponse.json({
      analysis: result
    })

  } catch (error) {
    console.error("❌ AI analysis error:", error)

    return NextResponse.json(
      { error: "AI analysis failed. Please try again." },
      { status: 500 }
    )
  }
}