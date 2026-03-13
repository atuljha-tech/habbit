"use client"

import { useEffect, useState } from "react"
import { Bot, Sparkles, X, AlertCircle, Coffee, Zap, RefreshCw } from "lucide-react"

interface AgentAlertProps {
  onNewNotification?: (notification: any) => void
}

export default function AgentAlert({ onNewNotification }: AgentAlertProps) {
  const [message, setMessage] = useState("")
  const [visible, setVisible] = useState(false)
  const [habitName, setHabitName] = useState("")
  const [type, setType] = useState<"warning" | "tip" | "celebration">("tip")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkHabits()
    
    // Check every 30 seconds for new broken habits
    const interval = setInterval(() => {
      checkHabits()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

async function checkHabits() {
  if (loading) return
  
  setLoading(true)
  try {
    console.log("🔵 CHECKING HABITS...")
    
    // This will now return ONLY habits with no logs in last 24 hours
    const auditRes = await fetch("/api/agents/auditor?days=1")
    const brokenHabits = await auditRes.json()
    
    console.log("🔵 TRULY BROKEN HABITS:", brokenHabits)

    if (!brokenHabits || brokenHabits.length === 0) {
      console.log("🔵 NO BROKEN HABITS FOUND - all habits completed!")
      setVisible(false) // Hide the coach if no broken habits
      setLoading(false)
      return
    }

    // Randomly select from truly broken habits
    const randomIndex = Math.floor(Math.random() * brokenHabits.length)
    const name = brokenHabits[randomIndex].title || brokenHabits[randomIndex].name
    
    console.log("🔵 SELECTED BROKEN HABIT:", name)
    
    setHabitName(name)

      // Step 2 — call enforcer agent
      console.log("🔵 CALLING ENFORCER WITH HABIT:", name)
      
      const res = await fetch("/api/agents/enforcer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ habitName: name }),
      })

      const data = await res.json()
      console.log("🔵 ENFORCER RESPONSE:", data)

      setMessage(data.message)
      
      // Determine alert type based on message content
      if (data.message.includes("🔥") || data.message.includes("crushed") || data.message.includes("perfect")) {
        setType("celebration")
      } else if (data.message.includes("⚠️") || data.message.includes("missed") || data.message.includes("forgot")) {
        setType("warning")
      } else {
        setType("tip")
      }
      
      setVisible(true)
      
      // Determine alert type based on message content
let newType: "warning" | "tip" | "celebration" = "tip"
if (data.message.includes("🔥") || data.message.includes("crushed") || data.message.includes("perfect")) {
  newType = "celebration"
} else if (data.message.includes("⚠️") || data.message.includes("missed") || data.message.includes("forgot")) {
  newType = "warning"
} else {
  newType = "tip"
}

setType(newType)

// Send to navbar notifications
if (onNewNotification) {
  onNewNotification({
    id: Date.now(),
    text: data.message,
    time: "just now",
    type: newType,     // ← USE the new type directly
    habitName: name,
    agent: "accountability-coach"
  })
}
      
    } catch (error) {
      console.error("Agent system error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!visible) return null

  // Get styles based on type
  const getTypeStyles = () => {
    switch(type) {
      case "warning":
        return {
          border: "border-[#FF7AC6]",
          bg: "bg-[#FF7AC6]",
          icon: <AlertCircle className="w-5 h-5" />
        }
      case "celebration":
        return {
          border: "border-[#FFD84D]",
          bg: "bg-[#FFD84D]",
          icon: <Sparkles className="w-5 h-5" />
        }
      default:
        return {
          border: "border-[#6DD3FF]",
          bg: "bg-[#6DD3FF]",
          icon: <Bot className="w-5 h-5" />
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <div className={`fixed bottom-6 right-6 z-50 max-w-sm border-4 border-black bg-white shadow-[10px_10px_0px_0px_#111111] animate-slideUp ${styles.border}`}>
      {/* Top zig-zag strip */}
      <div className={`h-2 w-full bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:8px_8px] border-b-4 border-black ${styles.bg}`} />
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 border-3 border-black flex items-center justify-center ${styles.bg}`}>
              {type === "celebration" ? <Sparkles className="w-4 h-4" /> : 
               type === "warning" ? <AlertCircle className="w-4 h-4" /> : 
               <Bot className="w-4 h-4" />}
            </div>
            <h3 className="font-black text-lg tracking-tighter">
              ACCOUNTABILITY COACH
            </h3>
          </div>

          <div className="flex gap-1">
            {/* Manual refresh button */}
            <button
              onClick={checkHabits}
              disabled={loading}
              className="border-2 border-black w-6 h-6 flex items-center justify-center hover:bg-[#7FFFD4] transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={() => setVisible(false)}
              className="border-2 border-black w-6 h-6 flex items-center justify-center hover:bg-[#FF7AC6] transition-colors font-bold"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Habit name badge */}
        {habitName && (
          <div className="mb-3 border-2 border-black bg-[#8C6CFF] px-2 py-1 inline-block">
            <span className="text-xs font-black text-white">HABIT: {habitName.toUpperCase()}</span>
          </div>
        )}

        <p className="font-bold text-sm leading-relaxed border-l-4 border-black pl-3 py-1">
          {message}
        </p>

        {/* Action buttons */}
        <div className="mt-4 flex gap-2">
          <button className="border-3 border-black bg-white px-3 py-1 text-xs font-bold hover:bg-[#FFD84D] transition-colors">
            FIX IT
          </button>
          <button className="border-3 border-black bg-white px-3 py-1 text-xs font-bold hover:bg-[#7FFFD4] transition-colors">
            REMIND LATER
          </button>
        </div>

        {/* Agent signature */}
        <div className="mt-3 flex items-center gap-1 text-[10px] font-mono opacity-50">
          <Zap className="w-3 h-3" />
          <span>AI AGENT • REAL-TIME</span>
        </div>
      </div>

      {/* Bottom zig-zag strip */}
      <div className={`h-2 w-full bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:8px_8px] border-t-4 border-black ${styles.bg}`} />
    </div>
  )
}