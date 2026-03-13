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
      temperature: 0.9, // Increased for more creativity
      top_p: 0.95, // Added for more diverse responses
      max_tokens: 350, // Slightly increased for more detailed responses
      messages: [
        {
          role: "system",
          content: `You are a creative and insightful productivity coach who analyzes personal journals. 
          Your feedback should be:
          - Personalized and specific to what the user wrote
          - Conversational and encouraging
          - Occasionally witty but always supportive
          - Varied in tone and style (not repetitive)
          
          Each analysis should feel unique and tailored to the individual.`
        },
        {
          role: "user",
          content: `
Analyze this journal entry with creativity and insight:

Journal entry:
"${text}"

Return your analysis in this format (but feel free to be creative with the wording):
1. Mood: [specific mood based on their writing - be descriptive, not just one word]
2. Key insight: [one specific observation from their entry that shows you actually read it]
3. One improvement suggestion: [one actionable suggestion related to what they wrote]

Keep it concise (3-4 sentences total) but make it feel personal and unique to them.`
        }
      ],
    })

    const result = completion.choices[0]?.message?.content
    console.log("✅ Groq response received:", result?.substring(0, 100))
    
    if (!result) {
      throw new Error("Empty response from Groq")
    }
    
    return result

  } catch (error) {
    console.error("❌ Groq API error:", error)
    
    // Enhanced fallback responses with more variety
    const wordCount = text.trim().split(/\s+/).length
    
    // Creative fallback responses based on content
    const fallbackResponses = [
      {
        keywords: ['happy', 'great', 'good', 'awesome', 'amazing', 'excited'],
        response: (text: string) => {
          if (text.toLowerCase().includes('because') || text.toLowerCase().includes('due to')) {
            return `1. Mood: Genuinely positive and self-aware 😊\n2. Key insight: You not only feel good, but you're identifying WHY - that's emotional intelligence in action!\n3. Suggestion: Tomorrow, try to create one small moment that might trigger this same positive feeling.`
          }
          return `1. Mood: Bright and optimistic ✨\n2. Key insight: Your brain is firing those feel-good neurotransmitters - cherish this!\n3. Suggestion: Jot down three things that contributed to this mood so you can recreate them.`
        }
      },
      {
        keywords: ['sad', 'tired', 'stressed', 'anxious', 'overwhelmed', 'exhausted'],
        response: (text: string) => {
          if (wordCount > 30) {
            return `1. Mood: Heavy but processing 🫂\n2. Key insight: You're doing the hard work of acknowledging difficult emotions instead of burying them.\n3. Suggestion: What's ONE tiny thing you could remove from your plate tomorrow? Just one.`
          }
          return `1. Mood: Weighed down by circumstances\n2. Key insight: You're aware enough to name what you're feeling - that's the first step.\n3. Suggestion: Five minutes of doing absolutely nothing. Just breathe. You deserve it.`
        }
      },
      {
        keywords: ['work', 'project', 'deadline', 'meeting', 'job', 'career'],
        response: (text: string) => {
          if (text.toLowerCase().includes('finished') || text.toLowerCase().includes('completed')) {
            return `1. Mood: Accomplished and productive 🎯\n2. Key insight: That feeling of finishing? That's your brain's reward system working perfectly.\n3. Suggestion: Before diving into the next thing, take 10 minutes to acknowledge what you just achieved.`
          }
          return `1. Mood: Driven but maybe stretched thin\n2. Key insight: You're showing up and putting in the work, even when it's tough.\n3. Suggestion: What's one task you could delegate, postpone, or drop entirely?`
        }
      }
    ]
    
    // Find matching fallback or use generic
    for (const fb of fallbackResponses) {
      if (fb.keywords.some(keyword => text.toLowerCase().includes(keyword))) {
        return fb.response(text)
      }
    }
    
    // Generic fallbacks with variety
    const genericFallbacks = [
      `1. Mood: Reflective and thoughtful 🧠\n2. Key insight: You're building a consistent journaling practice - that's discipline in action!\n3. Suggestion: Try ending with one question for tomorrow's self.`,
      
      `1. Mood: Present and aware 🌱\n2. Key insight: You took time to write today, which means you prioritized yourself.\n3. Suggestion: Add a "win of the day" to your entries - even on hard days.`,
      
      `1. Mood: In progress (like all humans) 🔄\n2. Key insight: Your ${wordCount}-word entry shows you have thoughts worth capturing.\n3. Suggestion: Next time, try writing about how you want to feel tomorrow.`,
      
      `1. Mood: Real (not filtered for social media) 👊\n2. Key insight: You're showing up authentically on the page.\n3. Suggestion: What would you tell a friend who wrote this entry? Now tell yourself.`,
      
      `1. Mood: Human (which means complex) 🌈\n2. Key insight: You're doing the work of self-reflection, which most people avoid.\n3. Suggestion: Notice any patterns across your last 3 entries? Write about that.`
    ]
    
    const randomIndex = Math.floor(Math.random() * genericFallbacks.length)
    return genericFallbacks[randomIndex]
  }
}

// Optional: Add a helper function for different analysis types
export async function analyzeJournalWithStyle(text: string, style: 'coach' | 'therapist' | 'friend' | 'philosopher' = 'coach') {
  const stylePrompts = {
    coach: "You are a motivating productivity coach who pushes users to be their best selves.",
    therapist: "You are a gentle, insightful therapist who helps users understand their emotions.",
    friend: "You are a supportive friend who listens and offers encouragement.",
    philosopher: "You are a thoughtful philosopher who finds deeper meaning in daily experiences."
  }
  
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.9,
      top_p: 0.95,
      messages: [
        {
          role: "system",
          content: stylePrompts[style]
        },
        {
          role: "user",
          content: `Journal entry: "${text}"\n\nProvide a brief, insightful response.`
        }
      ]
    })
    
    return completion.choices[0]?.message?.content
    
  } catch (error) {
    console.error(`❌ ${style} analysis error:`, error)
    return analyzeJournal(text) // Fallback to regular analysis
  }
}