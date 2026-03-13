import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function analyzeJournal(text: string) {
  console.log("🔍 analyzeJournal called with text length:", text?.length)
  console.log("🔍 First 100 chars:", text?.substring(0, 100))
  
  if (!text || text.trim().length === 0) {
    console.log("❌ Empty text received")
    return "I couldn't analyze your journal because it's empty. Write something first! ✍️"
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a productivity coach analyzing personal journals. Provide insightful, personalized feedback based on the actual content of the journal. Be conversational and encouraging."
        },
        {
          role: "user",
          content: `
Analyze this journal entry. Make sure your response is SPECIFIC to what the user wrote, not generic.

Journal entry:
"${text}"

Return in this format:
1. Mood: [specific mood based on their writing]
2. Key insight: [one specific observation from their entry]
3. One improvement suggestion: [one actionable suggestion related to what they wrote]

Keep it concise but personalized.`
        }
      ],
      temperature: 0.7, // Add some variety
      max_tokens: 300
    })

    const result = completion.choices[0].message.content
    console.log("✅ Groq response received:", result?.substring(0, 100))
    return result

  } catch (error) {
    console.error("❌ Groq API error:", error)
    
    // Personalized fallback based on the text
    const wordCount = text.trim().split(/\s+/).length
    
    if (wordCount < 10) {
      return `1. Mood: Hard to detect (short entry)
2. Key insight: You wrote ${wordCount} words
3. Suggestion: Try writing a bit more next time for deeper insights! 📝`
    }
    
    // Simple keyword-based fallback
    if (text.toLowerCase().includes('happy') || text.toLowerCase().includes('great') || text.toLowerCase().includes('good')) {
      return `1. Mood: Positive and uplifted 😊
2. Key insight: You're experiencing positive emotions
3. Suggestion: What specifically made you feel this way? Note it down to replicate it!`
    } else if (text.toLowerCase().includes('sad') || text.toLowerCase().includes('tired') || text.toLowerCase().includes('stressed')) {
      return `1. Mood: Reflective / Challenged
2. Key insight: You're acknowledging difficult emotions
3. Suggestion: Consider one small self-care activity you can do today`
    } else {
      return `1. Mood: Neutral / Reflective
2. Key insight: You're building a consistent journaling habit
3. Suggestion: Try adding more emotional details to your entries`
    }
  }
}