"use client"

import { useState } from "react"
import { Sparkles, Brain, RefreshCw, Lightbulb, XCircle, Zap } from "lucide-react"

export default function AISuggestions() {
  const [tips, setTips] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isVisible, setIsVisible] = useState(true)

  async function loadTips() {
    setIsLoading(true)
    setError("")
    
    try {
      const res = await fetch("/api/ai/habit-suggestions")
      
      if (!res.ok) {
        throw new Error("AI brain needs a coffee break!")
      }
      
      const data = await res.json()
      setTips(data.suggestions)
    } catch (err) {
      setError("🤖 *sparks fly* AI suggestions temporarily fried!")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isVisible) return null

  return (
    <div className="relative w-full">
      {/* Decorative floating elements */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#FF7AC6] border-2 border-black rounded-full animate-bounce-slow z-0" />
      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#8C6CFF] border-2 border-black rotate-12 z-0" 
           style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
      
      {/* Main container */}
      <div className="relative border-4 border-black bg-white shadow-[8px_8px_0px_0px_#111111] hover:shadow-[6px_6px_0px_0px_#111111] transition-all duration-200">
        {/* Zig-zag top border */}
        <div className="h-2 w-full bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:8px_8px] border-b-4 border-black" />
        
        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-[#FFD84D] rounded-full blur-sm opacity-50 animate-pulse" />
                <Brain className="relative w-6 h-6 text-black" />
              </div>
              <h2 className="text-lg font-black tracking-tighter bg-[linear-gradient(135deg,#FF7AC6,#8C6CFF)] bg-clip-text text-transparent border-b-2 border-black pb-1">
                AI BRAIN
              </h2>
            </div>
            
            <button 
              onClick={() => setIsVisible(false)}
              className="group w-7 h-7 border-2 border-black bg-white hover:bg-[#FF7AC6] transition-colors flex items-center justify-center"
              aria-label="Close"
            >
              <XCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Generate button */}
          <button
            onClick={loadTips}
            disabled={isLoading}
            className="group relative w-full border-3 border-black bg-[#FF7AC6] text-black font-black text-base py-3 px-4 shadow-[5px_5px_0px_0px_#111111] hover:shadow-[3px_3px_0px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>GENERATING...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span>✨ GENERATE SUGGESTIONS ✨</span>
                </>
              )}
            </div>
          </button>

          {/* Error message */}
          {error && (
            <div className="mt-4 border-3 border-black bg-[#FF7AC6] p-3 animate-shake">
              <p className="text-xs font-bold flex items-center gap-2">
                <Zap className="w-3 h-3" />
                {error}
              </p>
            </div>
          )}

          {/* Tips display */}
          {tips && (
            <div className="relative mt-4 animate-slideUp">
              <div className="border-3 border-black bg-[linear-gradient(135deg,#FFF9E6,#FFF)] p-4 shadow-[4px_4px_0px_0px_#111111]">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 flex-shrink-0 text-[#FFD84D]" />
                  <p className="whitespace-pre-wrap text-sm font-medium">
                    {tips}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom zig-zag border */}
        <div className="h-2 w-full bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:8px_8px] border-t-4 border-black" />
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        .animate-slideUp {
          animation: slideUp 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  )
}