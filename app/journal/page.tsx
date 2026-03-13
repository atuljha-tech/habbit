"use client"

import { useState } from "react"
import JournalAI from "@/components/JournalAI"
import { 
  BookOpen, 
  Save, 
  Sparkles, 
  Feather, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Coffee,
  Moon,
  Sun,
  Edit3,
  Brain,
  Star,
  RefreshCw
} from "lucide-react"

export default function JournalPage() {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [mood, setMood] = useState<"happy" | "reflective" | "energetic" | "calm" | "inspired">("reflective")
  const [wordCount, setWordCount] = useState(0)

  const today = new Date().toISOString().split("T")[0]
  const formattedDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  // Update word count when content changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    setWordCount(newContent.trim().split(/\s+/).filter(w => w.length > 0).length)
  }

  async function saveJournal() {
    if (!content.trim()) {
      setError("📝 Your journal is feeling lonely... Write something!")
      return
    }

    try {
      setLoading(true)
      setError("")
      setSuccess("")

      const res = await fetch("/api/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          date: new Date(),
          content,
          mood
        })
      })

      if (!res.ok) {
        throw new Error("Failed to save journal")
      }

      setSuccess("✨ Journal saved successfully! Your thoughts are now immortalized! ✨")
      setContent("")
      setWordCount(0)

    } catch (err) {
      console.error(err)
      setError("💥 Oops! The journal gremlins are acting up. Try again!")

    } finally {
      setLoading(false)
    }
  }

  // Mood options
  const moodOptions = [
    { value: 'happy', icon: Sun, label: 'HAPPY', color: '#FFD84D' },
    { value: 'reflective', icon: Moon, label: 'REFLECTIVE', color: '#8C6CFF' },
    { value: 'energetic', icon: Zap, label: 'ENERGETIC', color: '#FF7AC6' },
    { value: 'calm', icon: Coffee, label: 'CALM', color: '#7FFFD4' },
    { value: 'inspired', icon: Star, label: 'INSPIRED', color: '#6DD3FF' }
  ]

  return (
    <div className="relative max-w-4xl mx-auto p-8">
      {/* BACKGROUND DECORATIONS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-40 left-20 w-48 h-48 bg-[#FF7AC6] opacity-10 border-4 border-black rounded-full animate-float-slow" />
        <div className="absolute bottom-60 right-20 w-64 h-64 bg-[#8C6CFF] opacity-10 border-4 border-black rotate-12" />
        <div className="absolute top-1/3 right-60 w-32 h-32 bg-[#FFD84D] opacity-10 border-4 border-black" 
             style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
        
        {/* Floating journal decorations */}
        <div className="absolute top-80 left-1/3 text-9xl text-black opacity-5 transform -rotate-12 select-none">
          ✎ ✎ ✎
        </div>
        <div className="absolute bottom-40 right-1/4 text-9xl text-black opacity-5 select-none">
          ~~~~~~~~~~
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 space-y-8">
        {/* HEADER - RETRO JOURNAL COVER */}
        <div className="relative group">
          <div className="absolute -top-6 -left-6 w-16 h-16 bg-[#FF7AC6] border-4 border-black rounded-full animate-bounce-slow" />
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#6DD3FF] border-4 border-black rotate-12" />
          
          <div className="relative border-8 border-black bg-white p-8 shadow-[16px_16px_0px_0px_#111111]">
            <div className="flex items-center gap-6">
              {/* Retro journal icon with layers */}
              <div className="relative">
                <div className="absolute -inset-3 bg-[#FFD84D] border-4 border-black rotate-3" />
                <div className="absolute -inset-2 bg-[#7FFFD4] border-4 border-black -rotate-2" />
                <div className="relative w-24 h-24 bg-[#FF7AC6] border-4 border-black flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-black" />
                </div>
              </div>
              
              <div>
                <h1 className="text-6xl font-black tracking-tighter mb-3 flex items-center gap-4">
                  <span className="bg-black text-white px-6 py-3 transform -rotate-1 inline-block">
                    JOURNAL
                  </span>
                  <Feather className="w-10 h-10 text-[#FFD84D]" />
                </h1>
                
                <p className="text-lg font-bold border-4 border-black bg-[#FFF9E6] p-3 inline-block">
                  "Write your story, one day at a time"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN JOURNAL CARD */}
        <div className="relative group">
          <div className="absolute -inset-3 bg-[#8C6CFF] border-4 border-black rotate-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative border-4 border-black bg-white shadow-[12px_12px_0px_0px_#111111] group-hover:shadow-[8px_8px_0px_0px_#111111] group-hover:translate-x-[4px] group-hover:translate-y-[4px] transition-all">
            
            {/* Top decorative strip */}
            <div className="h-4 w-full bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:12px_12px] border-b-4 border-black" />
            
            <div className="p-8">
              {/* Date header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="border-4 border-black bg-[#FFD84D] p-3 text-center min-w-[120px]">
                    <div className="text-xs font-bold">
                      {new Date().toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                    <div className="text-3xl font-black">
                      {new Date().getDate()}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span className="font-bold text-sm">{formattedDate}</span>
                  </div>
                </div>
                
                {/* Word counter */}
                <div className="border-4 border-black bg-[#6DD3FF] px-4 py-2 font-bold">
                  <span className="text-sm">{wordCount} WORDS</span>
                </div>
              </div>

              {/* MOOD SELECTOR */}
              <div className="mb-6">
                <label className="block text-xs font-bold mb-2">HOW ARE YOU FEELING?</label>
                <div className="flex gap-3">
                  {moodOptions.map((m) => {
                    const Icon = m.icon
                    const isSelected = mood === m.value
                    
                    return (
                      <button
                        key={m.value}
                        onClick={() => setMood(m.value as any)}
                        className={`flex-1 border-4 border-black p-4 font-bold text-sm transition-all hover:-translate-y-1 ${
                          isSelected ? `shadow-[6px_6px_0px_0px_#111111]` : ''
                        }`}
                        style={{ backgroundColor: isSelected ? m.color : 'white' }}
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1" />
                        {m.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* JOURNAL TEXTAREA - styled like a vintage paper */}
              <div className="relative mb-6">
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-[#FF7AC6] border-4 border-black rounded-full opacity-50" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#8C6CFF] border-4 border-black rotate-12" />
                
                <textarea
                  value={content}
                  onChange={handleContentChange}
                  placeholder="Write about your day, your thoughts, your dreams... ✨"
                  rows={8}
                  className="w-full border-4 border-black p-6 text-lg bg-[linear-gradient(135deg,#FFF9E6,#FFF)] focus:outline-none focus:bg-white transition-colors resize-y"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 29px, rgba(0,0,0,0.1) 30px)',
                    lineHeight: '30px'
                  }}
                />
                
                {/* Decorative quote marks */}
                <div className="absolute top-2 left-2 text-6xl text-black opacity-10 font-serif">"</div>
                <div className="absolute bottom-2 right-2 text-6xl text-black opacity-10 font-serif rotate-180">"</div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={saveJournal}
                  disabled={loading}
                  className="group relative flex-1 border-4 border-black bg-[#FF7AC6] text-black font-black text-xl py-5 px-8 shadow-[8px_8px_0px_0px_#111111] hover:shadow-[4px_4px_0px_0px_#111111] hover:translate-x-[4px] hover:translate-y-[4px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <RefreshCw className="w-6 h-6 animate-spin" />
                        <span>SAVING YOUR THOUGHTS...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span>✨ SAVE JOURNAL ENTRY ✨</span>
                      </>
                    )}
                  </div>
                  
                  {/* Decorative corners */}
                  <span className="absolute -top-3 -left-3 w-4 h-4 bg-[#FFD84D] border-3 border-black rotate-12" />
                  <span className="absolute -bottom-3 -right-3 w-4 h-4 bg-[#6DD3FF] border-3 border-black -rotate-12" />
                </button>
                
                <button className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#111111] hover:shadow-[2px_2px_0px_0px_#111111] hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
                  <Edit3 className="w-6 h-6" />
                </button>
              </div>

              {/* MESSAGES */}
              {success && (
                <div className="relative border-4 border-black bg-[#7FFFD4] p-5 animate-slideDown">
                  <div className="absolute -top-2 left-6 flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-white border-2 border-black rounded-full" />
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-black flex-shrink-0" />
                    <p className="font-bold text-black flex-1">{success}</p>
                    <button 
                      onClick={() => setSuccess("")}
                      className="w-6 h-6 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors flex items-center justify-center font-bold"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="relative border-4 border-black bg-[#FF7AC6] p-5 animate-shake">
                  <div className="absolute -top-2 left-6 flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-white border-2 border-black rounded-full" />
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-black flex-shrink-0" />
                    <p className="font-bold text-black flex-1">{error}</p>
                    <button 
                      onClick={() => setError("")}
                      className="w-6 h-6 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors flex items-center justify-center font-bold"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Bottom decorative strip */}
            <div className="h-4 w-full bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:12px_12px] border-t-4 border-black" />
          </div>
        </div>

        {/* AI JOURNAL ANALYSIS SECTION */}
        <div className="relative group">
          <div className="absolute -inset-3 bg-[#FFD84D] border-4 border-black -rotate-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative border-4 border-black bg-white shadow-[12px_12px_0px_0px_#111111] group-hover:shadow-[8px_8px_0px_0px_#111111] group-hover:translate-x-[4px] group-hover:translate-y-[4px] transition-all">
            
            <div className="h-4 w-full bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:12px_12px] border-b-4 border-black" />
            
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                {/* AI Icon */}
                <div className="relative">
                  <div className="absolute -inset-2 bg-[#8C6CFF] border-4 border-black rotate-3" />
                  <div className="relative w-16 h-16 bg-[#FF7AC6] border-4 border-black flex items-center justify-center">
                    <Brain className="w-8 h-8 text-black" />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                    AI JOURNAL ANALYSIS
                    <Sparkles className="w-6 h-6 text-[#FFD84D]" />
                  </h2>
                  <p className="font-bold text-sm mt-1 border-l-4 border-[#8C6CFF] pl-3">
                    Let AI analyze your mood, productivity, and give improvement suggestions
                  </p>
                </div>
              </div>

              {/* Quick tips */}
              <div className="border-4 border-black bg-[#FFF9E6] p-4 mb-6">
                <p className="text-sm font-bold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#FF7AC6]" />
                  <span className="text-black">✨ PRO TIP: Write at least 50 words for better AI insights!</span>
                </p>
              </div>

              {/* Journal AI Component */}
              <JournalAI content={content} />
            </div>
            
            <div className="h-4 w-full bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:12px_12px] border-t-4 border-black" />
          </div>
        </div>

        {/* MOTIVATIONAL FOOTER */}
        <div className="border-4 border-black bg-[#FFD84D] p-6 shadow-[8px_8px_0px_0px_#111111]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Star className="w-8 h-8" />
              <div>
                <p className="font-black text-xl">
                  {content.length > 100 
                    ? "🌟 LOOK AT YOU, BEING ALL REFLECTIVE!" 
                    : content.length > 0 
                    ? "📝 KEEP WRITING, YOUR STORY MATTERS!" 
                    : "✨ READY TO CAPTURE YOUR THOUGHTS?"}
                </p>
                <p className="font-bold text-sm opacity-75">
                  {wordCount > 50 
                    ? "That's some deep thinking! AI is ready to analyze." 
                    : "The best time to start writing is now."}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Sun className="w-5 h-5" />
              <Moon className="w-5 h-5" />
              <Star className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}