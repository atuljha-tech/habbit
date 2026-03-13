// // // // import { NextResponse } from "next/server"
// // // // import { connectDB } from "@/lib/mongodb"
// // // // import HabitLog from "@/models/HabitLog"
// // // // import Habit from "@/models/Habit"
// // // // import Groq from "groq-sdk"

// // // // const groq = new Groq({
// // // //   apiKey: process.env.GROQ_API_KEY
// // // // })

// // // // export async function POST(req: Request) {
// // // //   try {
// // // //     await connectDB()
    
// // // //     const { habitId, imageUrl } = await req.json()
    
// // // //     if (!habitId || !imageUrl) {
// // // //       return NextResponse.json(
// // // //         { error: "Habit ID and image URL are required" },
// // // //         { status: 400 }
// // // //       )
// // // //     }

// // // //     // Fetch the habit details to get the name
// // // //     const habit = await Habit.findById(habitId)
// // // //     if (!habit) {
// // // //       return NextResponse.json(
// // // //         { error: "Habit not found" },
// // // //         { status: 404 }
// // // //       )
// // // //     }

// // // //     const habitName = habit.title

// // // //     console.log(`🔍 Verifying habit: ${habitName} with image: ${imageUrl.substring(0, 50)}...`)

// // // //     // Create a specific prompt based on habit type
// // // //     const getHabitSpecificPrompt = (habit: string) => {
// // // //       const lowerHabit = habit.toLowerCase()
      
// // // //       if (lowerHabit.includes('exercise') || lowerHabit.includes('workout') || lowerHabit.includes('gym')) {
// // // //         return `Look for: workout clothes, gym equipment, fitness tracker, sweat, exercise mat, running shoes, or someone exercising.`
// // // //       }
// // // //       if (lowerHabit.includes('read') || lowerHabit.includes('book') || lowerHabit.includes('pages')) {
// // // //         return `Look for: an open book, book pages, e-reader, or someone reading.`
// // // //       }
// // // //       if (lowerHabit.includes('water') || lowerHabit.includes('drink')) {
// // // //         return `Look for: a water bottle, glass of water, multiple water bottles, or hydration tracker.`
// // // //       }
// // // //       if (lowerHabit.includes('meditat') || lowerHabit.includes('mind')) {
// // // //         return `Look for: someone meditating, meditation app, peaceful setting, yoga mat, or calm environment.`
// // // //       }
// // // //       if (lowerHabit.includes('code') || lowerHabit.includes('program')) {
// // // //         return `Look for: computer screen with code, IDE, coding environment, or programming setup.`
// // // //       }
// // // //       if (lowerHabit.includes('brush') || lowerHabit.includes('teeth')) {
// // // //         return `Look for: toothbrush, toothpaste, someone brushing teeth, or bathroom sink setup.`
// // // //       }
      
// // // //       return `Look for clear evidence of completing this specific habit.`
// // // //     }

// // // //     const habitSpecificGuidance = getHabitSpecificPrompt(habitName)

// // // //     // Step 1: Verify the image with AI
// // // //     const completion = await groq.chat.completions.create({
// // // //       model: "llava-v1.5-7b", // or "llama-3.2-11b-vision-preview"
// // // //       messages: [
// // // //         {
// // // //           role: "system",
// // // //           content: `You are a strict but fair habit verification AI. 
// // // //           Your job is to check if the image provides reasonable proof of completing the habit.
          
// // // //           Rules:
// // // //           - Be reasonable - don't expect professional photos
// // // //           - Look for relevant items/context in the image
// // // //           - If you can see ANY evidence of the habit, lean towards PASS
// // // //           - Only FAIL if the image is completely unrelated
          
// // // //           Reply ONLY with:
// // // //           PASS
// // // //           or
// // // //           FAIL`
// // // //         },
// // // //         {
// // // //           role: "user",
// // // //           content: [
// // // //             { 
// // // //               type: "text", 
// // // //               text: `Habit to verify: "${habitName}"
              
// // // // ${habitSpecificGuidance}

// // // // Question: Does this image show reasonable proof of completing this habit?`
// // // //             },
// // // //             { type: "image_url", image_url: { url: imageUrl } }
// // // //           ]
// // // //         }
// // // //       ],
// // // //       temperature: 0.2,
// // // //       max_tokens: 10
// // // //     })

// // // //     const result = completion.choices[0]?.message?.content?.trim() || "FAIL"
// // // //     console.log(`📸 Verification result for ${habitName}: ${result}`)

// // // //     // Step 2: Handle PASS or FAIL
// // // //     if (result.includes("PASS")) {
// // // //       // Create habit log for successful verification
// // // //       const today = new Date().toISOString().split('T')[0]
      
// // // //       const habitLog = await HabitLog.create({
// // // //         habitId,
// // // //         date: today,
// // // //         completed: true,
// // // //         proofImage: imageUrl,
// // // //         verifiedAt: new Date()
// // // //       })

// // // //       console.log(`✅ Habit verified and logged: ${habitName}`)

// // // //       return NextResponse.json({
// // // //         success: true,
// // // //         message: "Habit verified! Great job! 🎉",
// // // //         log: habitLog
// // // //       })

// // // //     } else {
// // // //       console.log(`❌ Verification failed for ${habitName}`)
      
// // // //       // Get a more specific failure reason
// // // //       const feedbackCompletion = await groq.chat.completions.create({
// // // //         model: "llama-3.3-70b-versatile",
// // // //         messages: [
// // // //           {
// // // //             role: "system",
// // // //             content: "You are a helpful AI that explains why an image doesn't prove a habit. Be brief and slightly humorous."
// // // //           },
// // // //           {
// // // //             role: "user",
// // // //             content: `The user tried to prove they completed "${habitName}" with an image, but it wasn't accepted. 
// // // //             Give a short, funny reason why their image might not work. Keep it to 1 sentence.`
// // // //           }
// // // //         ],
// // // //         temperature: 0.8,
// // // //         max_tokens: 50
// // // //       })

// // // //       const failureReason = feedbackCompletion.choices[0]?.message?.content || "That doesn't look like proof!"
      
// // // //       // Call the enforcer API to get a sarcastic rejection
// // // //       const enforcerRes = await fetch(
// // // //         "http://localhost:3000/api/agents/enforcer",
// // // //         {
// // // //           method: "POST",
// // // //           headers: { 
// // // //             "Content-Type": "application/json" 
// // // //           },
// // // //           body: JSON.stringify({
// // // //             habitName
// // // //           })
// // // //         }
// // // //       )

// // // //       const enforcerData = await enforcerRes.json()
// // // //       const roastMessage = enforcerData.message || failureReason

// // // //       return NextResponse.json({
// // // //         success: false,
// // // //         message: roastMessage,
// // // //         result: "FAIL",
// // // //         reason: failureReason
// // // //       })
// // // //     }

// // // //   } catch (error) {
// // // //     console.error("❌ Verification error:", error)
// // // //     return NextResponse.json(
// // // //       { error: "Verification failed" },
// // // //       { status: 500 }
// // // //     )
// // // //   }
// // // // }

// // // import { NextResponse } from "next/server"
// // // import { connectDB } from "@/lib/mongodb"
// // // import HabitLog from "@/models/HabitLog"
// // // import Habit from "@/models/Habit"
// // // import Groq from "groq-sdk"

// // // const groq = new Groq({
// // //   apiKey: process.env.GROQ_API_KEY
// // // })

// // // export async function POST(req: Request) {
// // //   try {
// // //     await connectDB()
    
// // //     const { habitId, imageUrl } = await req.json()
    
// // //     if (!habitId || !imageUrl) {
// // //       return NextResponse.json(
// // //         { error: "Habit ID and image URL are required" },
// // //         { status: 400 }
// // //       )
// // //     }

// // //     // Fetch the habit details
// // //     const habit = await Habit.findById(habitId)
// // //     if (!habit) {
// // //       return NextResponse.json(
// // //         { error: "Habit not found" },
// // //         { status: 404 }
// // //       )
// // //     }

// // //     const habitName = habit.title
// // //     console.log(`🔍 Verifying: ${habitName} with image: ${imageUrl.substring(0, 50)}...`)

// // //     // Step 1: Download the image and convert to base64
// // //     const imageResponse = await fetch(imageUrl)
// // //     const imageBuffer = await imageResponse.arrayBuffer()
// // //     const base64Image = Buffer.from(imageBuffer).toString('base64')
    
// // //     // Step 2: Verify with Groq vision model
// // //     const completion = await groq.chat.completions.create({
// // //       model: "llama-3.2-11b-vision-preview", // Make sure this model is available
// // //       messages: [
// // //         {
// // //           role: "system",
// // //           content: `You are a strict habit verification AI. 
// // //           Your ONLY job is to check if the image provides proof of completing the habit.
          
// // //           Rules:
// // //           - If the image shows ANY evidence of the habit, return PASS
// // //           - If the image is unrelated, return FAIL
// // //           - Be reasonable - don't expect professional photos
          
// // //           Reply with EXACTLY one word: PASS or FAIL`
// // //         },
// // //         {
// // //           role: "user",
// // //           content: [
// // //             {
// // //               type: "text",
// // //               text: `Does this image show proof that someone completed: "${habitName}"?`
// // //             },
// // //             {
// // //               type: "image_url",
// // //               image_url: {
// // //                 url: `data:image/jpeg;base64,${base64Image}`
// // //               }
// // //             }
// // //           ]
// // //         }
// // //       ],
// // //       temperature: 0.2,
// // //       max_tokens: 10
// // //     })

// // //     const result = completion.choices[0]?.message?.content?.trim().toUpperCase() || "FAIL"
// // //     console.log(`📸 Groq says: ${result}`)

// // //     // Step 3: Handle result
// // //     if (result === "PASS") {
// // //       const today = new Date().toISOString().split('T')[0]
      
// // //       await HabitLog.create({
// // //         habitId,
// // //         date: today,
// // //         completed: true,
// // //         proofImage: imageUrl,
// // //         verifiedAt: new Date()
// // //       })

// // //       return NextResponse.json({
// // //         success: true,
// // //         message: "✅ Habit verified! Great job!",
// // //         result: "PASS"
// // //       })
// // //     } else {
// // //       // Get a sarcastic rejection from enforcer
// // //       const enforcerRes = await fetch(
// // //         "http://localhost:3000/api/agents/enforcer",
// // //         {
// // //           method: "POST",
// // //           headers: { "Content-Type": "application/json" },
// // //           body: JSON.stringify({ habitName })
// // //         }
// // //       )

// // //       const enforcerData = await enforcerRes.json()
      
// // //       return NextResponse.json({
// // //         success: false,
// // //         message: enforcerData.message || "That doesn't look like proof!",
// // //         result: "FAIL"
// // //       })
// // //     }

// // //   } catch (error) {
// // //     console.error("❌ Verification error:", error)
// // //     return NextResponse.json(
// // //       { success: false, message: "Verification failed", result: "FAIL" },
// // //       { status: 200 } // Return 200 so frontend shows the message
// // //     )
// // //   }
// // // }


// // import { NextResponse } from "next/server"
// // import { connectDB } from "@/lib/mongodb"
// // import HabitLog from "@/models/HabitLog"
// // import Habit from "@/models/Habit"
// // import Groq from "groq-sdk"

// // const groq = new Groq({
// //   apiKey: process.env.GROQ_API_KEY
// // })

// // export async function POST(req: Request) {
// //   try {
// //     await connectDB()
    
// //     const { habitId, imageUrl } = await req.json()
    
// //     if (!habitId || !imageUrl) {
// //       return NextResponse.json(
// //         { error: "Habit ID and image URL are required" },
// //         { status: 400 }
// //       )
// //     }

// //     const habit = await Habit.findById(habitId)
// //     if (!habit) {
// //       return NextResponse.json(
// //         { error: "Habit not found" },
// //         { status: 404 }
// //       )
// //     }

// //     const habitName = habit.title
// //     console.log(`🔍 Verifying: ${habitName} with image: ${imageUrl.substring(0, 50)}...`)

// //     // Download and convert image to base64 (required for local processing)
// //     const imageResponse = await fetch(imageUrl)
// //     const imageBuffer = await imageResponse.arrayBuffer()
// //     const base64Image = Buffer.from(imageBuffer).toString('base64')
    
// //     // Use the CURRENT supported vision model
// //     const completion = await groq.chat.completions.create({
// //       model: "meta-llama/llama-4-scout-17b-16e-instruct", // ✅ This is the current working model
// //       messages: [
// //         {
// //           role: "user",
// //           content: [
// //             {
// //               type: "text",
// //               text: `You are a strict habit verification AI. Does this image show proof that someone completed: "${habitName}"? Reply with ONLY one word: PASS or FAIL. Be strict but fair.`
// //             },
// //             {
// //               type: "image_url",
// //               image_url: {
// //                 url: `data:image/jpeg;base64,${base64Image}`
// //               }
// //             }
// //           ]
// //         }
// //       ],
// //       temperature: 0.2,
// //       max_tokens: 10
// //     })

// //     const result = completion.choices[0]?.message?.content?.trim().toUpperCase() || "FAIL"
// //     console.log(`📸 Groq says: ${result}`)

// //     if (result === "PASS") {
// //       const today = new Date().toISOString().split('T')[0]
      
// //       await HabitLog.create({
// //         habitId,
// //         date: today,
// //         completed: true,
// //         proofImage: imageUrl,
// //         verifiedAt: new Date()
// //       })

// //       return NextResponse.json({
// //         success: true,
// //         message: "✅ Habit verified! Great job!",
// //         result: "PASS"
// //       })
// //     } else {
// //       // Get a sarcastic rejection from enforcer
// //       const enforcerRes = await fetch(
// //         "http://localhost:3000/api/agents/enforcer",
// //         {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({ habitName })
// //         }
// //       )

// //       const enforcerData = await enforcerRes.json()
      
// //       return NextResponse.json({
// //         success: false,
// //         message: enforcerData.message || "That doesn't look like proof!",
// //         result: "FAIL"
// //       })
// //     }

// //   } catch (error) {
// //     console.error("❌ Verification error:", error)
// //     return NextResponse.json(
// //       { success: false, message: "Verification failed", result: "FAIL" },
// //       { status: 200 }
// //     )
// //   }
// // }

// import { NextResponse } from "next/server"
// import { connectDB } from "@/lib/mongodb"
// import HabitLog from "@/models/HabitLog"
// import Habit from "@/models/Habit"
// import Groq from "groq-sdk"

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY
// })

// export async function POST(req: Request) {
//   try {
//     await connectDB()
    
//     const { habitId, imageUrl } = await req.json()
    
//     if (!habitId || !imageUrl) {
//       return NextResponse.json(
//         { error: "Habit ID and image URL are required" },
//         { status: 400 }
//       )
//     }

//     const habit = await Habit.findById(habitId)
//     if (!habit) {
//       return NextResponse.json(
//         { error: "Habit not found" },
//         { status: 404 }
//       )
//     }

//     const habitName = habit.title
//     console.log(`🔍 Verifying: ${habitName} with image: ${imageUrl.substring(0, 50)}...`)

//     // Download and convert image to base64
//     const imageResponse = await fetch(imageUrl)
//     const imageBuffer = await imageResponse.arrayBuffer()
//     const base64Image = Buffer.from(imageBuffer).toString('base64')
    
//     // Create habit-specific prompts
//     const getHabitPrompt = (habit: string) => {
//       const lower = habit.toLowerCase()
//       if (lower.includes('brush')) {
//         return `Look for: a toothbrush, toothpaste, someone brushing teeth, a bathroom sink with toothbrush visible. Is this image related to brushing teeth?`
//       }
//       if (lower.includes('water') || lower.includes('drink')) {
//         return `Look for: a water bottle, glass of water, multiple water bottles, someone drinking water. Is this image related to drinking water?`
//       }
//       if (lower.includes('exercise') || lower.includes('workout') || lower.includes('gym')) {
//         return `Look for: workout clothes, gym equipment, someone exercising, running shoes, fitness tracker. Is this image related to exercise?`
//       }
//       if (lower.includes('read') || lower.includes('book')) {
//         return `Look for: an open book, book pages, e-reader, someone reading. Is this image related to reading?`
//       }
//       if (lower.includes('meditat')) {
//         return `Look for: someone meditating, yoga mat, peaceful setting, meditation app. Is this image related to meditation?`
//       }
//       return `Does this image show proof of completing the habit: "${habit}"?`
//     }

//     const completion = await groq.chat.completions.create({
//       model: "meta-llama/llama-4-scout-17b-16e-instruct",
//       messages: [
//         {
//           role: "system",
//           content: "You are a habit verification AI. Be REASONABLE - if the image shows ANY evidence of the habit, reply PASS. Only reply FAIL if the image is completely unrelated. Reply with exactly one word: PASS or FAIL."
//         },
//         {
//           role: "user",
//           content: [
//             {
//               type: "text",
//               text: getHabitPrompt(habitName)
//             },
//             {
//               type: "image_url",
//               image_url: {
//                 url: `data:image/jpeg;base64,${base64Image}`
//               }
//             }
//           ]
//         }
//       ],
//       temperature: 0.3,
//       max_tokens: 10
//     })

//     const result = completion.choices[0]?.message?.content?.trim().toUpperCase() || "FAIL"
//     console.log(`📸 Groq says: ${result} for ${habitName}`)

//     if (result === "PASS") {
//       const today = new Date().toISOString().split('T')[0]
      
//       await HabitLog.create({
//         habitId,
//         date: today,
//         completed: true,
//         proofImage: imageUrl,
//         verifiedAt: new Date()
//       })

//       return NextResponse.json({
//         success: true,
//         message: "✅ Habit verified! Great job!",
//         result: "PASS"
//       })
//     } else {
//       // Call enforcer for FAIL
//       const enforcerRes = await fetch(
//         "http://localhost:3000/api/agents/enforcer",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ habitName })
//         }
//       )

//       const enforcerData = await enforcerRes.json()
      
//       return NextResponse.json({
//         success: false,
//         message: enforcerData.message || "That doesn't look like proof!",
//         result: "FAIL"
//       })
//     }

//   } catch (error) {
//     console.error("❌ Verification error:", error)
//     return NextResponse.json(
//       { success: false, message: "Verification failed", result: "FAIL" },
//       { status: 200 }
//     )
//   }
// }
import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import HabitLog from "@/models/HabitLog"
import Habit from "@/models/Habit"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(req: Request) {
  try {
    await connectDB()
    
    const { habitId, imageUrl } = await req.json()
    
    if (!habitId || !imageUrl) {
      return NextResponse.json(
        { error: "Habit ID and image URL are required" },
        { status: 400 }
      )
    }

    const habit = await Habit.findById(habitId)
    if (!habit) {
      return NextResponse.json(
        { error: "Habit not found" },
        { status: 404 }
      )
    }

    const habitName = habit.title
    console.log(`🔍 Verifying: ${habitName} with image: ${imageUrl.substring(0, 50)}...`)

    // Download and convert image to base64
    const imageResponse = await fetch(imageUrl)
    const imageBuffer = await imageResponse.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')
    
    // Create habit-specific prompts
    const getHabitPrompt = (habit: string) => {
      const lower = habit.toLowerCase()
      if (lower.includes('brush')) {
        return `Look for: a toothbrush, toothpaste, someone brushing teeth, a bathroom sink with toothbrush visible. Is this image related to brushing teeth?`
      }
      if (lower.includes('water') || lower.includes('drink')) {
        return `Look for: a water bottle, glass of water, multiple water bottles, someone drinking water. Is this image related to drinking water?`
      }
      if (lower.includes('exercise') || lower.includes('workout') || lower.includes('gym')) {
        return `Look for: workout clothes, gym equipment, someone exercising, running shoes, fitness tracker. Is this image related to exercise?`
      }
      if (lower.includes('read') || lower.includes('book')) {
        return `Look for: an open book, book pages, e-reader, someone reading. Is this image related to reading?`
      }
      if (lower.includes('meditat')) {
        return `Look for: someone meditating, yoga mat, peaceful setting, meditation app. Is this image related to meditation?`
      }
      return `Does this image show proof of completing the habit: "${habit}"?`
    }

    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "system",
          content: "You are a habit verification AI. Be REASONABLE - if the image shows ANY evidence of the habit, reply PASS. Only reply FAIL if the image is completely unrelated. Reply with exactly one word: PASS or FAIL."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: getHabitPrompt(habitName)
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      temperature: 0.3,
      max_tokens: 10
    })

    const result = completion.choices[0]?.message?.content?.trim().toUpperCase() || "FAIL"
    console.log(`📸 Groq says: ${result} for ${habitName}`)

    if (result === "PASS") {
      const today = new Date().toISOString().split('T')[0]
      
      await HabitLog.create({
        habitId,
        date: today,
        completed: true,
        proofImage: imageUrl,
        verifiedAt: new Date()
      })

      return NextResponse.json({
        success: true,
        message: "✅ Habit verified! Great job!",
        result: "PASS"
      })
    } else {
      // Call enforcer for FAIL
      const enforcerRes = await fetch(
        "http://localhost:3000/api/agents/enforcer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ habitName })
        }
      )

      const enforcerData = await enforcerRes.json()
      
      return NextResponse.json({
        success: false,
        message: enforcerData.message || "That doesn't look like proof!",
        result: "FAIL"
      })
    }

  } catch (error) {
    console.error("❌ Verification error:", error)
    return NextResponse.json(
      { success: false, message: "Verification failed", result: "FAIL" },
      { status: 200 }
    )
  }
}