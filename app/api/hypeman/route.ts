import { NextResponse } from "next/server"

export async function POST(request: Request) {
  console.log("🎙️ HYPEMAN API CALLED - WORKING!")
  
  try {
    const body = await request.json()
    const { action, itemName } = body
    
    console.log("📦 Action:", action, "Item:", itemName)
    
    const messages = {
      created: [
        `🔥 A KING HAS CREATED "${itemName}"! 👑`,
        `✨ LEGENDARY! "${itemName}" HAS BEEN SUMMONED!`,
        `⚔️ "${itemName}" BOWS BEFORE YOUR GREATNESS!`,
        `🎮 CRITICAL HIT! "${itemName}" ADDED!`,
        `🏆 ACHIEVEMENT UNLOCKED: "${itemName}"!`,
      ],
      deleted: [
        `💀 VANQUISHED! "${itemName}" IS NO MORE!`,
        `⚔️ "${itemName}" HAS BEEN ELIMINATED!`,
        `🔥 DESTROYED! "${itemName}" NEVER STOOD A CHANCE!`,
        `✨ POOF! "${itemName}" GONE!`,
        `👋 FAREWELL, "${itemName}"!`,
      ]
    }
    
    const actionMessages = messages[action as keyof typeof messages] || messages.created
    const randomMessage = actionMessages[Math.floor(Math.random() * actionMessages.length)]
    
    return NextResponse.json({ 
      message: randomMessage,
      success: true 
    })
    
  } catch (error) {
    console.error("❌ Error:", error)
    return NextResponse.json({ 
      message: "✨ YOU DID A THING! BE PROUD!",
      success: true 
    })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: "🎙️ HYPEMAN IS READY!",
    status: "active" 
  })
}