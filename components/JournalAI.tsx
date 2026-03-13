"use client"

import { useState } from "react"
import { Sparkles, Brain, AlertCircle, BookOpen, Feather, Zap, XCircle, RefreshCw } from "lucide-react"

interface JournalAIProps {
  content: string
}

export default function JournalAI({ content }: JournalAIProps) {
  const [analysis, setAnalysis] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [showTips, setShowTips] = useState<boolean>(false)

  async function analyze() {
    if (!content.trim()) {
      setError("📝 Your journal is empty! Write something first!")
      return
    }

    if (content.trim().split(/\s+/).length < 10) {
      setError("📝 Write at least 10 words for better analysis!")
      return
    }

    try {
      setLoading(true)
      setError("")
      setAnalysis("")

      const res = await fetch("/api/ai/analyze-journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: content // Make sure this is being sent
        })
      })

      if (!res.ok) {
        throw new Error("Failed to analyze journal")
      }

      const data = await res.json()
      setAnalysis(data.analysis)

    } catch (err) {
      console.error(err)
      setError("🤖 *fizzles* AI brain had a glitch! Please try again!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative mt-8">
      {/* Floating decorative elements */}
      <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#FF7AC6] rounded-full opacity-30 animate-pulse-slow z-0 border-2 border-black" />
      <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-[#8C6CFF] z-0 border-4 border-black rotate-12"
           style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
      
      {/* Main container */}
      <div className="relative z-10 border-4 border-black bg-white shadow-[10px_10px_0px_0px_#111111]">
        
        {/* Top zig-zag border */}
        <div className="h-3 w-full bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:10px_10px] bg-top border-b-4 border-black" />
        
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-2 bg-[#6DD3FF] rounded-full blur-md opacity-40 animate-pulse" />
                <div className="relative w-16 h-16 bg-[#FF7AC6] border-4 border-black flex items-center justify-center transform -rotate-3 hover:rotate-0 transition-transform">
                  <Brain className="w-8 h-8 text-black" />
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl font-black tracking-tighter bg-[linear-gradient(135deg,#FF7AC6,#8C6CFF,#6DD3FF)] bg-clip-text text-transparent">
                  JOURNAL AI
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Feather className="w-4 h-4 text-black" />
                  <span className="text-sm font-bold bg-[#FFD84D] px-3 py-1 border-2 border-black transform -rotate-1">
                    MIND READER v1.0
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowTips(!showTips)}
              className="group relative w-10 h-10 border-3 border-black bg-[#7FFFD4] hover:bg-[#6DD3FF] transition-colors flex items-center justify-center"
            >
              <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="absolute -bottom-2 -right-2 w-3 h-3 bg-[#FF7AC6] border-2 border-black rounded-full" />
            </button>
          </div>

          {/* Tips panel */}
          {showTips && (
            <div className="mb-6 border-4 border-black bg-[#FFD84D] p-4 relative animate-slideDown">
              <div className="absolute -top-2 left-4 w-4 h-4 bg-white border-2 border-black rotate-45" />
              <p className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                PRO TIP: Write at least 50 words for better AI insights!
              </p>
            </div>
          )}

          {/* Content preview */}
          <div className="mb-4 p-3 border-3 border-black bg-[#FFF9E6]">
            <p className="text-xs font-bold mb-1">CURRENT JOURNAL LENGTH:</p>
            <div className="flex justify-between items-center">
              <span className="font-mono">{content.length} characters • {content.trim().split(/\s+/).filter(w => w.length > 0).length} words</span>
              {content.length < 50 && (
                <span className="text-[#FF7AC6] font-bold text-xs">⚠️ Add more for better analysis</span>
              )}
            </div>
          </div>

          {/* Analyze button */}
          <button
            onClick={analyze}
            disabled={loading || !content.trim()}
            className="group relative w-full border-4 border-black bg-[#8C6CFF] text-black font-black text-xl py-5 px-8 shadow-[8px_8px_0px_0px_#111111] hover:shadow-[4px_4px_0px_0px_#111111] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-4">
              {loading ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  <span>🔮 AI IS THINKING...</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-6 h-6" />
                  <span>🔮 ANALYZE MY THOUGHTS 🔮</span>
                </>
              )}
            </div>
            
            {/* Content length indicator */}
            <div className="absolute -bottom-3 right-4 bg-white border-2 border-black px-3 py-1 text-xs font-bold">
              {content.length} CHARACTERS
            </div>
          </button>

          {/* Error message */}
          {error && (
            <div className="relative mt-6 border-4 border-black bg-[#FF7AC6] p-5 animate-shake">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-black flex-shrink-0" />
                <p className="font-bold text-black">{error}</p>
                <button 
                  onClick={() => setError("")}
                  className="ml-auto w-6 h-6 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors flex items-center justify-center font-bold"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Analysis result */}
          {analysis && (
            <div className="relative mt-8 animate-slideUp">
              <div className="border-4 border-black bg-[linear-gradient(135deg,#FFF9E6,#FFF)] p-6 shadow-[6px_6px_0px_0px_#111111]">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b-4 border-black">
                  <div className="w-8 h-8 bg-[#FF7AC6] border-2 border-black flex items-center justify-center transform rotate-3">
                    🤖
                  </div>
                  <h3 className="font-black text-xl tracking-tight">
                    AI INSIGHT
                  </h3>
                </div>

                <div className="whitespace-pre-wrap text-base leading-relaxed font-medium pl-4 border-l-4 border-[#8C6CFF]">
                  {analysis}
                </div>

                <div className="mt-6 flex items-center justify-between pt-3 border-t-4 border-black">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-[#FFD84D] border-2 border-black transform rotate-3" />
                    ))}
                  </div>
                  <span className="text-xs font-bold bg-black text-white px-3 py-1">
                    AI CONFIDENCE: HIGH
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 justify-end">
                <button className="border-3 border-black bg-white px-4 py-2 font-bold text-sm hover:bg-[#FF7AC6] transition-colors shadow-[4px_4px_0px_0px_#111111] hover:shadow-[2px_2px_0px_0px_#111111]">
                  SAVE INSIGHT
                </button>
                <button className="border-3 border-black bg-[#6DD3FF] px-4 py-2 font-bold text-sm hover:bg-[#7FFFD4] transition-colors shadow-[4px_4px_0px_0px_#111111] hover:shadow-[2px_2px_0px_0px_#111111]">
                  SHARE ✨
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!analysis && !error && !loading && (
            <div className="mt-8 border-4 border-dashed border-black p-8 text-center opacity-50">
              <Feather className="w-12 h-12 mx-auto mb-3" />
              <p className="font-bold">✨ Ready to analyze your thoughts ✨</p>
              <p className="text-sm mt-2">Write in your journal above and click analyze</p>
            </div>
          )}
        </div>

        {/* Bottom zig-zag border */}
        <div className="h-3 w-full bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:10px_10px] bg-top border-t-4 border-black" />
      </div>
    </div>
  )
}