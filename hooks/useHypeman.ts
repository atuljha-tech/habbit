"use client"

import { useState, useCallback } from "react"

interface HypemanMessage {
  id: string
  message: string
  action: string
}

export function useHypeman() {
  const [currentMessage, setCurrentMessage] = useState<HypemanMessage | null>(null)

  const hype = useCallback(async (action: string, itemName?: string) => {
    try {
      console.log("🎙️ Hype called for:", { action, itemName })
      
      const res = await fetch("/api/hypeman", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ action, itemName })
      })
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      
      const data = await res.json()
      console.log("🎙️ Hype response:", data)
      
      setCurrentMessage({
        id: Date.now().toString(),
        message: data.message,
        action: data.action
      })
      
    } catch (error) {
      console.error("❌ Hypeman error:", error)
      // Fallback message
      setCurrentMessage({
        id: Date.now().toString(),
        message: action === "deleted" 
          ? "VANQUISHED! THE HABIT IS NO MORE! ⚔️" 
          : "YOU DID A THING! BE PROUD! ✨",
        action
      })
    }
  }, [])

  const clearHype = useCallback(() => {
    setCurrentMessage(null)
  }, [])

  return {
    currentMessage,
    hype,
    clearHype
  }
}