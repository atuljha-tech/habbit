"use client"

import { useState } from "react"

export default function DemoModeButton() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function loadDemoData() {
    setLoading(true)
    setMessage("")
    
    try {
      const res = await fetch("/api/demo/seed", { method: "POST" })
      const data = await res.json()
      
      if (res.ok) {
        setMessage("✅ Demo data loaded! Refreshing...")
        setTimeout(() => window.location.reload(), 1500)
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setMessage("❌ Failed to load demo data")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative group">
        {message && (
          <div className="absolute bottom-full right-0 mb-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-sm whitespace-nowrap">
            {message}
          </div>
        )}
        
        <button
          onClick={loadDemoData}
          disabled={loading}
          className="relative overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px] transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <div className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 rounded-full transition-all duration-300 group-hover:bg-transparent">
            {loading ? (
              <svg className="w-5 h-5 animate-spin text-gray-900 dark:text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-900 dark:text-white group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
            <span className="font-semibold text-gray-900 dark:text-white group-hover:text-white">
              {loading ? "Loading Demo..." : "🚀 Load Demo Data"}
            </span>
          </div>
        </button>
      </div>
    </div>
  )
}