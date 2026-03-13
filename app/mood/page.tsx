"use client"

import { useEffect, useState } from "react"
import MoodChart from "@/components/MoodChart"
import { 
  Brain, 
  Heart, 
  Sparkles, 
  TrendingUp, 
  Calendar,
  Zap,
  Smile,
  Meh,
  Moon,
  Sun,
  Activity
} from "lucide-react"

interface MoodDataPoint {
  date: string
  mood: number
  fullDate: string
}

export default function MoodPage() {
  const [data, setData] = useState<MoodDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRange, setSelectedRange] = useState<"7" | "14" | "30">("14")
  const [averageMood, setAverageMood] = useState<string>("")

  useEffect(() => {
    fetchMood()
  }, [selectedRange])

  async function fetchMood() {
    setLoading(true)
    try {
      const res = await fetch(`/api/mood/trends?days=${selectedRange}`)
      if (!res.ok) throw new Error("Failed to fetch")
      
      const json = await res.json()

      const formatted = json.map((d: any) => {
        const dateObj = d.date ? new Date(d.date) : new Date()
        return {
          date: dateObj.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short"
          }),
          mood: d.mood || 2, // Default to neutral if missing
          fullDate: dateObj.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short"
          })
        }
      })

      setData(formatted)
      
      // Calculate average mood
      if (formatted.length > 0) {
        const moodValues = formatted
          .map((d: MoodDataPoint) => d.mood)
          .filter((m: number) => typeof m === 'number' && !isNaN(m))

        const avg = moodValues.length > 0
          ? moodValues.reduce((a: number, b: number) => a + b, 0) / moodValues.length
          : 0

        if (avg > 2.5) setAverageMood("POSITIVE 😊")
        else if (avg > 1.8) setAverageMood("NEUTRAL 😐")
        else setAverageMood("REFLECTIVE 🌧️")
      }
    } catch (error) {
      console.error("Error fetching mood data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Mood insights based on data
  const getMoodInsight = () => {
    if (data.length === 0) return "Not enough data yet. Keep journaling!"
    
    const moods = data
      .map(d => d.mood)
      .filter((m): m is number => typeof m === 'number' && !isNaN(m))
      
    if (moods.length === 0) return "Start journaling to see your mood trends!"
    
    const highest = Math.max(...moods)
    const lowest = Math.min(...moods)
    
    // Map numeric mood to text
    const getMoodText = (val: number) => {
      if (val >= 3) return "positive"
      if (val >= 2) return "neutral"
      return "reflective"
    }
    
    const recent = moods.slice(-3)
    let trend = "stable"
    if (recent.length >= 3) {
      if (recent[2] > recent[0]) trend = "improving"
      else if (recent[2] < recent[0]) trend = "varying"
    }
    
    return `Your mood has been ${trend} lately. Peak: ${getMoodText(highest)} (${highest}/3) • Low: ${getMoodText(lowest)} (${lowest}/3)`
  }

  // Get mood icon based on average
  const getMoodIcon = () => {
    if (averageMood.includes("POSITIVE")) return Smile
    if (averageMood.includes("NEUTRAL")) return Meh
    return Moon
  }
  
  const MoodIcon = getMoodIcon()

  // Calculate range for display
  const getMoodRange = () => {
    if (data.length === 0) return "—"
    const moods = data
      .map(d => d.mood)
      .filter((m): m is number => typeof m === 'number' && !isNaN(m))
    if (moods.length === 0) return "—"
    const min = Math.min(...moods)
    const max = Math.max(...moods)
    
    // Convert to descriptive labels
    const getLabel = (val: number) => {
      if (val >= 3) return "😊"
      if (val >= 2) return "😐"
      return "🌧️"
    }
    
    return `${getLabel(min)} - ${getLabel(max)}`
  }

  // Get trend direction
  const getTrend = () => {
    if (data.length < 3) return "—"
    const moods = data
      .map(d => d.mood)
      .filter((m): m is number => typeof m === 'number' && !isNaN(m))
    if (moods.length < 3) return "—"
    
    const first = moods[0]
    const last = moods[moods.length - 1]
    
    if (last > first) return '📈 UP'
    if (last < first) return '📉 DOWN'
    return '➡️ FLAT'
  }

  if (loading && data.length === 0) {
    return (
      <div className="relative max-w-6xl mx-auto p-8">
        <div className="border-8 border-black bg-white shadow-[16px_16px_0px_0px_#111111] p-12">
          <div className="flex flex-col items-center justify-center gap-6 py-20">
            <div className="relative">
              <div className="w-20 h-20 border-8 border-[#FF7AC6] border-t-black rounded-full animate-spin" />
              <Heart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-black" />
            </div>
            <p className="font-black text-2xl bg-black text-white px-6 py-3">
              ANALYZING YOUR EMOTIONS...
            </p>
            <div className="flex gap-2">
              <span className="w-3 h-3 bg-[#FF7AC6] border-2 border-black rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-3 h-3 bg-[#8C6CFF] border-2 border-black rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-3 h-3 bg-[#6DD3FF] border-2 border-black rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative max-w-6xl mx-auto p-8">
      {/* BACKGROUND DECORATIONS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-40 left-20 w-64 h-64 bg-[#FF7AC6] opacity-10 border-4 border-black rounded-full animate-float-slow" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-[#8C6CFF] opacity-10 border-4 border-black rotate-12" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-[#FFD84D] opacity-10 border-4 border-black" 
             style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
        
        {/* Floating mood patterns */}
        <div className="absolute top-60 left-1/3 text-9xl text-black opacity-5 transform -rotate-12 select-none">
          ☺ ☹ 😐
        </div>
        <div className="absolute bottom-60 right-1/3 text-9xl text-black opacity-5 select-none">
          ~~~~~
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 space-y-8">
        {/* HEADER */}
        <div className="relative group">
          <div className="absolute -top-6 -left-6 w-16 h-16 bg-[#FF7AC6] border-4 border-black rounded-full animate-bounce-slow" />
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#6DD3FF] border-4 border-black rotate-12" />
          
          <div className="relative border-8 border-black bg-white p-8 shadow-[16px_16px_0px_0px_#111111]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {/* Brain icon */}
                <div className="relative">
                  <div className="absolute -inset-3 bg-[#FFD84D] border-4 border-black rotate-3" />
                  <div className="absolute -inset-2 bg-[#7FFFD4] border-4 border-black -rotate-2" />
                  <div className="relative w-24 h-24 bg-[#FF7AC6] border-4 border-black flex items-center justify-center">
                    <Brain className="w-12 h-12 text-black" />
                  </div>
                </div>
                
                <div>
                  <h1 className="text-6xl font-black tracking-tighter mb-3 flex items-center gap-4">
                    <span className="bg-black text-white px-6 py-3 transform -rotate-1 inline-block">
                      EMOTIONAL DASHBOARD
                    </span>
                    <Heart className="w-10 h-10 text-[#FF7AC6] fill-[#FF7AC6]" />
                  </h1>
                  
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-bold border-4 border-black bg-[#FFF9E6] p-3">
                      Track your emotional journey
                    </p>
                    
                    {/* Range selector */}
                    <div className="flex border-4 border-black">
                      {[
                        { value: "7", label: "7D" },
                        { value: "14", label: "14D" },
                        { value: "30", label: "30D" }
                      ].map((range) => (
                        <button
                          key={range.value}
                          onClick={() => setSelectedRange(range.value as any)}
                          className={`px-4 py-2 font-bold text-sm transition-colors ${
                            selectedRange === range.value
                              ? 'bg-[#8C6CFF] text-white'
                              : 'bg-white hover:bg-[#FFD84D]'
                          }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MOOD STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Average Mood */}
          <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#111111] hover:shadow-[4px_4px_0px_0px_#111111] hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#FF7AC6] border-3 border-black flex items-center justify-center">
                <MoodIcon className="w-5 h-5" />
              </div>
              <span className="font-black text-sm">AVERAGE MOOD</span>
            </div>
            <p className="text-3xl font-black">{averageMood || "—"}</p>
          </div>

          {/* Total Entries */}
          <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#111111] hover:shadow-[4px_4px_0px_0px_#111111] hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#8C6CFF] border-3 border-black flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="font-black text-sm">ENTRIES</span>
            </div>
            <p className="text-3xl font-black">{data.length}</p>
          </div>

          {/* Mood Range */}
          <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#111111] hover:shadow-[4px_4px_0px_0px_#111111] hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#FFD84D] border-3 border-black flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="font-black text-sm">RANGE</span>
            </div>
            <p className="text-3xl font-black">{getMoodRange()}</p>
          </div>

          {/* Current Trend */}
          <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#111111] hover:shadow-[4px_4px_0px_0px_#111111] hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#6DD3FF] border-3 border-black flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-black text-sm">TREND</span>
            </div>
            <p className="text-3xl font-black">{getTrend()}</p>
          </div>
        </div>

        {/* MAIN CHART CARD */}
        <div className="relative group">
          <div className="absolute -inset-3 bg-[#8C6CFF] border-4 border-black rotate-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative border-4 border-black bg-white p-8 shadow-[12px_12px_0px_0px_#111111]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#FF7AC6] border-4 border-black flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black tracking-tighter">
                MOOD TRENDS
              </h2>
              <span className="text-xs border-2 border-black px-2 py-1 bg-[#FFD84D] font-mono">
                LAST {selectedRange} DAYS
              </span>
            </div>

            {data.length === 0 ? (
              <div className="border-4 border-dashed border-black p-16 text-center">
                <div className="text-8xl mb-4 opacity-30">📊</div>
                <p className="font-black text-2xl mb-2">NO MOOD DATA YET</p>
                <p className="text-lg opacity-60">Journal entries will appear here with mood analysis!</p>
              </div>
            ) : (
              <div className="h-96">
                <MoodChart data={data} />
              </div>
            )}

            {/* Chart footer */}
            <div className="mt-6 pt-4 border-t-4 border-black flex justify-between items-center">
              <div className="flex gap-4">
                <span className="flex items-center gap-2 text-xs font-bold">
                  <div className="w-3 h-3 bg-[#FF7AC6] border-2 border-black" /> Mood (1-3)
                </span>
                <span className="flex items-center gap-2 text-xs font-bold">
                  <div className="w-3 h-3 bg-[#8C6CFF] border-2 border-black" /> Trend Line
                </span>
              </div>
              <p className="text-xs font-mono opacity-50">
                {getMoodInsight()}
              </p>
            </div>
          </div>
        </div>

        {/* MOOD INSIGHTS */}
        {data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Best Day */}
            <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#111111]">
              <h3 className="font-black text-xl mb-4 flex items-center gap-2">
                <Sun className="w-5 h-5 text-[#FFD84D]" />
                BEST DAY
              </h3>
              {(() => {
                const validEntries = data.filter(d => 
                  typeof d.mood === 'number' && !isNaN(d.mood)
                )
                
                if (validEntries.length === 0) {
                  return <p className="text-sm opacity-60">No mood data yet</p>
                }
                
                const bestEntry = validEntries.reduce((best, curr) => 
                  curr.mood > best.mood ? curr : best
                , validEntries[0])
                
                const moodText = bestEntry.mood >= 3 ? "😊" : bestEntry.mood >= 2 ? "😐" : "🌧️"
                
                return (
                  <div>
                    <p className="text-2xl font-black text-[#FF7AC6]">{moodText} {bestEntry.mood}/3</p>
                    <p className="font-bold text-sm opacity-70">{bestEntry.fullDate}</p>
                  </div>
                )
              })()}
            </div>

            {/* Needs Attention */}
            <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#111111]">
              <h3 className="font-black text-xl mb-4 flex items-center gap-2">
                <Moon className="w-5 h-5 text-[#8C6CFF]" />
                NEEDS ATTENTION
              </h3>
              {(() => {
                const validEntries = data.filter(d => 
                  typeof d.mood === 'number' && !isNaN(d.mood)
                )
                
                if (validEntries.length === 0) {
                  return <p className="text-sm opacity-60">No mood data yet</p>
                }
                
                const worstEntry = validEntries.reduce((worst, curr) => 
                  curr.mood < worst.mood ? curr : worst
                , validEntries[0])
                
                const moodText = worstEntry.mood >= 3 ? "😊" : worstEntry.mood >= 2 ? "😐" : "🌧️"
                
                return (
                  <div>
                    <p className="text-2xl font-black text-[#8C6CFF]">{moodText} {worstEntry.mood}/3</p>
                    <p className="font-bold text-sm opacity-70">{worstEntry.fullDate}</p>
                  </div>
                )
              })()}
            </div>
          </div>
        )}

        {/* QUICK TIP */}
        <div className="border-4 border-black bg-[#6DD3FF] p-4 shadow-[6px_6px_0px_0px_#111111]">
          <p className="text-sm font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>✨ Mood is auto-detected from your journal entries! Write about your feelings to track patterns.</span>
          </p>
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
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}