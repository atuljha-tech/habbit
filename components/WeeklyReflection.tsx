"use client"

import { useState } from "react"
import { Brain, Calendar, Sparkles, RefreshCw, Star, Zap, Coffee, Moon, Sun, XCircle } from "lucide-react"

export default function WeeklyReflection() {
  const [reflection, setReflection] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [mood, setMood] = useState<"happy" | "chill" | "chaos">("chill")
  const [isVisible, setIsVisible] = useState(true)

  async function generateReflection() {
    setLoading(true)
    setError("")
    
    try {
      const res = await fetch("/api/ai/weekly-reflection")
      
      if (!res.ok) throw new Error("AI therapist is on a coffee break! ☕")
      
      const data = await res.json()
      setReflection(data.reflection)
    } catch (error) {
      setError("🤖 *circuit overload* Reflection machine needs a moment!")
      console.error("Error generating reflection:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isVisible) return null

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Explosion of retro decorative elements */}
      <div className="absolute -top-8 -left-8 w-24 h-24 bg-[#FF7AC6] border-4 border-black rounded-full opacity-30 animate-pulse-slow z-0" />
      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#8C6CFF] border-4 border-black z-0 rotate-12"
           style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
      <div className="absolute top-1/3 -left-12 w-16 h-16 bg-[#FFD84D] border-4 border-black animate-bounce-slow z-0" 
           style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
      <div className="absolute bottom-1/4 -right-10 w-20 h-20 bg-[#6DD3FF] border-4 border-black rounded-full opacity-40 z-0" />
      
      {/* Floating retro shapes */}
      <div className="absolute top-10 right-20 text-5xl text-black opacity-20 select-none transform rotate-12">
        ✦ ✦ ✦
      </div>
      <div className="absolute bottom-20 left-10 text-6xl text-black opacity-20 select-none">
        ⌇ ⌇ ⌇
      </div>
      
      {/* Retro sunburst */}
      <div className="absolute -top-4 right-1/4 w-16 h-16 bg-[#FFD84D] border-4 border-black rounded-full animate-ping-slow opacity-30 z-0" />

      {/* Main brutalist container */}
      <div className="relative z-10 border-4 border-black bg-white shadow-[12px_12px_0px_0px_#111111] hover:shadow-[8px_8px_0px_0px_#111111] transition-all duration-200">
        
        {/* Retro TV static header */}
        <div className="h-6 w-full bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:16px_16px] border-b-4 border-black" />
        
        <div className="p-8">
          {/* Header with retro computer vibe */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-6">
              {/* AI Monitor icon */}
              <div className="relative">
                <div className="absolute -inset-3 bg-[#8C6CFF] border-4 border-black rotate-3" />
                <div className="absolute -inset-2 bg-[#FFD84D] border-4 border-black -rotate-2" />
                <div className="relative w-24 h-24 bg-[#7FFFD4] border-4 border-black flex items-center justify-center overflow-hidden">
                  <Brain className="w-12 h-12 text-black relative z-10" />
                  {/* Screen scan line effect */}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-4xl font-black tracking-tighter bg-black text-white px-4 py-2 inline-block transform -rotate-1">
                    WEEKLY REFLECTION
                  </h2>
                  <span className="bg-[#FF7AC6] border-4 border-black px-3 py-1 font-bold text-sm transform rotate-2">
                    BETA
                  </span>
                </div>
                
                {/* Retro badge strip */}
                <div className="flex gap-2 flex-wrap">
                  <span className="text-sm font-bold bg-[#6DD3FF] border-3 border-black px-3 py-1 flex items-center gap-1">
                    <Moon className="w-3 h-3" /> DEEP THOUGHTS
                  </span>
                  <span className="text-sm font-bold bg-[#FFD84D] border-3 border-black px-3 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3" /> WEEK IN REVIEW
                  </span>
                  <span className="text-sm font-bold bg-[#7FFFD4] border-3 border-black px-3 py-1 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> AI POWERED
                  </span>
                </div>
              </div>
            </div>

            {/* Close button with retro radar */}
            <button
              onClick={() => setIsVisible(false)}
              className="relative w-14 h-14 border-4 border-black bg-white hover:bg-[#FF7AC6] transition-colors flex items-center justify-center group"
            >
              <XCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#FFD84D] border-2 border-black rounded-full animate-ping" />
              <span className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#6DD3FF] border-2 border-black rounded-full" />
            </button>
          </div>

          {/* Retro TV intro message */}
          <div className="relative mb-8 border-4 border-black bg-black text-white p-4 font-mono">
            <div className="absolute -top-3 left-6 bg-[#FF7AC6] px-3 py-1 border-4 border-black text-black font-bold text-sm transform -rotate-2">
              SYSTEM STATUS
            </div>
            <p className="text-center text-lg tracking-wider">
              &gt; INITIALIZING WEEKLY REFLECTION PROTOCOL...
              <span className="inline-block w-2 h-5 bg-white ml-2 animate-pulse" />
            </p>
          </div>

          {/* Mood selector - retro radio buttons */}
          <div className="flex gap-4 mb-8">
            {[
              { id: 'happy', icon: Sun, label: 'HAPPY', color: '#FFD84D' },
              { id: 'chill', icon: Coffee, label: 'CHILL', color: '#7FFFD4' },
              { id: 'chaos', icon: Zap, label: 'CHAOS', color: '#FF7AC6' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMood(m.id as any)}
                className={`flex-1 border-4 border-black p-4 font-bold text-lg transition-all hover:translate-y-[-4px] ${
                  mood === m.id ? `bg-[${m.color}] shadow-[6px_6px_0px_0px_#111111]` : 'bg-white'
                }`}
                style={{ backgroundColor: mood === m.id ? m.color : 'white' }}
              >
                <div className="flex items-center justify-center gap-2">
                  <m.icon className="w-5 h-5" />
                  {m.label}
                </div>
              </button>
            ))}
          </div>

          {/* Main generate button */}
          <div className="relative mb-6">
            <button
              onClick={generateReflection}
              disabled={loading}
              className="group relative w-full border-4 border-black bg-[#8C6CFF] text-black font-black text-2xl py-8 px-8 shadow-[10px_10px_0px_0px_#111111] hover:shadow-[4px_4px_0px_0px_#111111] hover:translate-x-[6px] hover:translate-y-[6px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              
              <div className="flex items-center justify-center gap-4">
                {loading ? (
                  <>
                    <RefreshCw className="w-10 h-10 animate-spin" />
                    <span className="tracking-tighter">ANALYZING YOUR WEEK...</span>
                    <div className="flex gap-1">
                      <span className="w-3 h-3 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-3 h-3 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-3 h-3 bg-black rounded-full animate-bounce" />
                    </div>
                  </>
                ) : (
                  <>
                    <Calendar className="w-10 h-10 group-hover:rotate-12 transition-transform" />
                    <span className="tracking-tighter">✨ REFLECT ON MY WEEK ✨</span>
                    <Sparkles className="w-10 h-10 group-hover:scale-110 transition-transform" />
                  </>
                )}
              </div>

              {/* Crazy corner decorations */}
              <span className="absolute -top-5 -left-5 w-7 h-7 bg-[#FF7AC6] border-4 border-black rotate-12" />
              <span className="absolute -bottom-5 -right-5 w-7 h-7 bg-[#6DD3FF] border-4 border-black -rotate-12" />
              <span className="absolute top-1/2 -left-3 w-5 h-5 bg-[#FFD84D] border-3 border-black rounded-full" />
              <span className="absolute bottom-1/3 -right-3 w-5 h-5 bg-[#7FFFD4] border-3 border-black" 
                     style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
            </button>

            {/* Week counter */}
            <div className="absolute -bottom-4 right-6 bg-black text-white px-4 py-2 border-4 border-black font-bold text-sm transform rotate-1">
              WEEK {Math.floor(Math.random() * 52)} • 2024
            </div>
          </div>

          {/* Error message with retro glitch effect */}
          {error && (
            <div className="relative mb-6 border-4 border-black bg-[#FF7AC6] p-6 animate-shake">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-white border-2 border-black" 
                       style={{ transform: `rotate(${i * 15}deg)` }} />
                ))}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-black flex items-center justify-center">
                  <span className="text-white text-3xl font-bold animate-pulse">!</span>
                </div>
                <p className="font-black text-xl flex-1">
                  {error}
                </p>
                <button 
                  onClick={() => setError("")}
                  className="w-12 h-12 border-4 border-black bg-white hover:bg-black hover:text-white transition-colors font-bold text-2xl"
                >
                  ×
                </button>
              </div>
              
              {/* Glitch lines */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="w-full h-1 bg-black opacity-20 absolute top-1/3 transform -rotate-2" />
                <div className="w-full h-1 bg-black opacity-20 absolute bottom-1/3 transform rotate-1" />
              </div>
            </div>
          )}

          {/* Reflection result - MAIN EVENT */}
          {reflection && (
            <div className="relative mt-8 animate-slideUp">
              {/* Retro computer screen effect */}
              <div className="absolute -inset-2 bg-[#8C6CFF] border-4 border-black rotate-1 z-0" />
              <div className="absolute -inset-1 bg-[#FFD84D] border-4 border-black -rotate-1 z-0" />
              
              <div className="relative border-4 border-black bg-[linear-gradient(135deg,#FFF9E6,#FFF)] z-10">
                {/* Screen header with retro elements */}
                <div className="bg-black p-4 border-b-4 border-black">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-[#FF7AC6] border-2 border-white animate-pulse" />
                      <h3 className="font-mono text-xl text-white tracking-wider">
                        &gt; reflection_2024.txt
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-3 h-3 rounded-full border-2 border-white"
                             style={{ backgroundColor: i === 0 ? '#FF7AC6' : i === 1 ? '#7FFFD4' : '#FFD84D' }} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reflection content */}
                <div className="p-8">
                  {/* Retro cursor effect */}
                  <div className="relative">
                    <div className="absolute -left-2 top-0 w-4 h-6 bg-[#8C6CFF] border-3 border-black animate-pulse" />
                    
                    <div className="whitespace-pre-wrap text-lg font-bold leading-relaxed pl-8 border-l-8 border-[#8C6CFF] min-h-[200px]">
                      {reflection}
                    </div>
                  </div>

                  {/* Reflection footer with stats */}
                  <div className="mt-8 pt-6 border-t-4 border-black">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="border-4 border-black bg-[#FFD84D] p-3 text-center">
                        <div className="font-mono text-2xl font-black">42</div>
                        <div className="text-xs font-bold">INSIGHTS</div>
                      </div>
                      <div className="border-4 border-black bg-[#7FFFD4] p-3 text-center">
                        <div className="font-mono text-2xl font-black">7</div>
                        <div className="text-xs font-bold">DAYS</div>
                      </div>
                      <div className="border-4 border-black bg-[#FF7AC6] p-3 text-center">
                        <div className="font-mono text-2xl font-black">∞</div>
                        <div className="text-xs font-bold">GROWTH</div>
                      </div>
                    </div>

                    {/* Mood-based advice */}
                    <div className="mt-4 border-4 border-black p-4 bg-[#6DD3FF]">
                      <p className="text-sm font-bold flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        {mood === 'happy' && "Your positive energy is contagious! Keep riding that wave 🌊"}
                        {mood === 'chill' && "Zen mode activated. The best insights come from calm minds 🧘"}
                        {mood === 'chaos' && "Embrace the chaos! Great things never come from comfort zones 🚀"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Screen footer */}
                <div className="border-t-4 border-black bg-[linear-gradient(45deg,black_25%,transparent_25%)] bg-[length:20px_20px] p-3">
                  <p className="text-center text-sm font-mono text-white mix-blend-difference">
                    &lt; AI_REFLECTION_SYSTEM_v2.0 • 1998-2024 • MADE WITH ☕ & 90s NOSTALGIA &gt;
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex gap-4">
                <button
                  onClick={generateReflection}
                  disabled={loading}
                  className="flex-1 border-4 border-black bg-[#7FFFD4] text-black font-bold py-4 px-6 shadow-[6px_6px_0px_0px_#111111] hover:shadow-[2px_2px_0px_0px_#111111] hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>REFLECT AGAIN</span>
                </button>
                
                <button className="flex-1 border-4 border-black bg-[#FFD84D] text-black font-bold py-4 px-6 shadow-[6px_6px_0px_0px_#111111] hover:shadow-[2px_2px_0px_0px_#111111] hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-2">
                  <Star className="w-5 h-5" />
                  <span>SAVE REFLECTION</span>
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!reflection && !error && !loading && (
            <div className="relative mt-8 border-4 border-dashed border-black p-12 text-center group hover:bg-[linear-gradient(45deg,#FF7AC6_25%,transparent_25%)] hover:bg-[length:40px_40px] transition-all">
              <div className="absolute inset-0 bg-white opacity-50 group-hover:opacity-0 transition-opacity" />
              <div className="relative z-10">
                <Brain className="w-20 h-20 mx-auto mb-4 text-black opacity-30" />
                <p className="font-black text-2xl mb-2">NO REFLECTIONS YET</p>
                <p className="text-lg opacity-60">Click the big purple button to reflect on your week!</p>
                <p className="text-sm mt-4 font-mono opacity-40">_ ready for input _</p>
              </div>
            </div>
          )}
        </div>

        {/* Retro TV static footer */}
        <div className="h-6 w-full bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:16px_16px] border-t-4 border-black" />
      </div>
    </div>
  )
}