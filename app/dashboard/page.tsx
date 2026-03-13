"use client"

import { useEffect, useState } from "react"
import WeeklyReflection from "@/components/WeeklyReflection"
import { 
  Flame, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  Sparkles, 
  Zap, 
  Target, 
  Award,
  Activity,
  Coffee,
  Moon,
  Sun,
  Star
} from "lucide-react"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

/* ---------------- TYPES ---------------- */

interface Habit {
  _id: string
  name: string
}

interface HabitLog {
  _id: string
  habitId: string
  date: string
  completed: boolean
}

interface ProgressPoint {
  date: string
  completed: number
}

interface JournalEntry {
  _id: string
  date: string
  content: string
}

/* ---------------- COMPONENT ---------------- */

export default function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [progress, setProgress] = useState<ProgressPoint[]>([])
  const [recentJournal, setRecentJournal] = useState<JournalEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedMood, setSelectedMood] = useState<"energetic" | "chill" | "focused">("energetic")

  const today = new Date().toISOString().split("T")[0]

  /* ---------------- DATA FETCHING ---------------- */

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      setLoading(true)

      const [habitsRes, logsRes, progressRes, journalRes] = await Promise.all([
        fetch("/api/habits"),
        fetch("/api/habitlogs"),
        fetch("/api/progress"),
        fetch("/api/journal/history")
      ])

      const habitsData = await habitsRes.json()
      const logsData = await logsRes.json()
      const progressData = await progressRes.json()
      const journalData = await journalRes.json()

      setHabits(habitsData)
      setLogs(logsData)
      setProgress(progressData)

      if (journalData.length > 0) {
        setRecentJournal(journalData[0])
      }

    } catch (err) {
      console.error(err)
      setError("Failed to load dashboard")
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- METRICS ---------------- */

  const todayLogs = logs.filter(
    (log) => log.date === today && log.completed
  )

  const completedToday = todayLogs.length
  const totalHabits = habits.length
  const activeStreaks = completedToday

  // Calculate weekly average
  const weeklyAverage = progress.length > 0 
    ? Math.round(progress.reduce((acc, curr) => acc + curr.completed, 0) / progress.length)
    : 0

  // Find best day
  const bestDay = progress.length > 0
    ? progress.reduce((max, curr) => curr.completed > max.completed ? curr : max)
    : { date: today, completed: 0 }

  /* ---------------- UI STATES ---------------- */

  if (loading) {
    return (
      <div className="relative p-12 border-8 border-black bg-white shadow-[16px_16px_0px_0px_#111111] animate-pulse-slow">
        {/* Decorative loading elements */}
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#FF7AC6] border-4 border-black rounded-full animate-bounce-slow" />
        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#8C6CFF] border-4 border-black rotate-12" />
        
        <div className="flex flex-col items-center justify-center gap-6 py-20">
          <div className="relative">
            <div className="w-20 h-20 border-8 border-[#FF7AC6] border-t-black rounded-full animate-spin" />
            <Zap className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-black animate-pulse" />
          </div>
          <p className="font-black text-2xl tracking-tighter bg-black text-white px-6 py-3 transform rotate-1">
            LOADING YOUR HABITS...
          </p>
          <div className="flex gap-2">
            <span className="w-3 h-3 bg-[#FF7AC6] border-2 border-black rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-3 h-3 bg-[#8C6CFF] border-2 border-black rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-3 h-3 bg-[#6DD3FF] border-2 border-black rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative border-8 border-black bg-[#FF7AC6] p-12 shadow-[12px_12px_0px_0px_#111111]">
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#FFD84D] border-4 border-black rounded-full animate-ping" />
        
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-black flex items-center justify-center">
            <span className="text-white text-5xl font-black">!</span>
          </div>
          <div>
            <h2 className="font-black text-3xl mb-2">OOPS! GLITCH DETECTED</h2>
            <p className="font-bold text-xl">{error}</p>
          </div>
        </div>
        
        <button 
          onClick={loadDashboard}
          className="mt-6 border-4 border-black bg-white px-8 py-4 font-black text-lg hover:bg-black hover:text-white transition-colors shadow-[6px_6px_0px_0px_#111111] hover:shadow-[2px_2px_0px_0px_#111111] hover:translate-x-[4px] hover:translate-y-[4px]"
        >
          TRY AGAIN 🔄
        </button>
      </div>
    )
  }

  return (
    <div className="relative space-y-10 pb-20">
      {/* BACKGROUND DECORATIONS - EXPLOSION OF SHAPES */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#FF7AC6] opacity-20 border-4 border-black rounded-full animate-float-slow" />
        <div className="absolute bottom-40 right-10 w-48 h-48 bg-[#8C6CFF] opacity-20 border-4 border-black rotate-12" />
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-[#FFD84D] opacity-20 border-4 border-black" 
             style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
        <div className="absolute bottom-1/4 left-20 w-40 h-40 bg-[#6DD3FF] opacity-20 border-4 border-black rounded-full" />
        
        {/* Floating zig-zag lines */}
        <div className="absolute top-40 left-1/2 text-8xl text-black opacity-10 transform -rotate-12 select-none">
          ~~~~~
        </div>
        <div className="absolute bottom-60 right-40 text-8xl text-black opacity-10 transform rotate-45 select-none">
          ⚡⚡⚡
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 space-y-10">
        {/* PAGE HEADER WITH RETRO VIBE */}
        <div className="relative">
          {/* Floating decorative elements */}
          <div className="absolute -top-6 -left-6 w-16 h-16 bg-[#FF7AC6] border-4 border-black rounded-full animate-bounce-slow" />
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-[#8C6CFF] border-4 border-black -rotate-12" />
          
          <div className="relative border-8 border-black bg-white p-8 shadow-[16px_16px_0px_0px_#111111]">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-6xl font-black tracking-tighter mb-2 flex items-center gap-4">
                  <span className="bg-black text-white px-6 py-2 transform -rotate-1 inline-block">
                    DASHBOARD
                  </span>
                  <Sparkles className="w-12 h-12 text-[#FF7AC6] animate-pulse-slow" />
                </h1>
                
                <div className="flex items-center gap-4 mt-4">
                  <p className="text-xl font-bold bg-[#FFD84D] border-4 border-black px-6 py-3 transform rotate-1">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-xl font-bold bg-[#6DD3FF] border-4 border-black px-6 py-3 transform -rotate-1">
                    WEEK {Math.ceil(new Date().getDate() / 7)}
                  </p>
                </div>
              </div>

              {/* Mood selector */}
              <div className="flex gap-3">
                {[
                  { mood: 'energetic', icon: Zap, color: '#FF7AC6' },
                  { mood: 'chill', icon: Coffee, color: '#7FFFD4' },
                  { mood: 'focused', icon: Target, color: '#8C6CFF' }
                ].map((m) => (
                  <button
                    key={m.mood}
                    onClick={() => setSelectedMood(m.mood as any)}
                    className={`w-16 h-16 border-4 border-black transition-all hover:-translate-y-2 ${
                      selectedMood === m.mood ? `shadow-[6px_6px_0px_0px_#111111]` : ''
                    }`}
                    style={{ backgroundColor: selectedMood === m.mood ? m.color : 'white' }}
                  >
                    <m.icon className="w-8 h-8 mx-auto" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* METRICS CARDS - EXPLOSION OF COLOR */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Active Streaks Card */}
          <div className="group relative">
            <div className="absolute -inset-2 bg-[#FF7AC6] border-4 border-black rotate-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative border-4 border-black bg-white p-8 shadow-[10px_10px_0px_0px_#111111] hover:shadow-[4px_4px_0px_0px_#111111] hover:translate-x-[6px] hover:translate-y-[6px] transition-all">
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#FFD84D] border-4 border-black rounded-full flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              
              <Flame className="w-12 h-12 mb-4 text-[#FF7AC6]" />
              <p className="text-sm font-bold uppercase tracking-wider text-gray-600">ACTIVE STREAKS</p>
              <p className="text-5xl font-black mt-2">{activeStreaks}</p>
              
              <div className="mt-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`h-2 flex-1 border-2 border-black ${
                    i < activeStreaks ? 'bg-[#FF7AC6]' : 'bg-gray-200'
                  }`} />
                ))}
              </div>
            </div>
          </div>

          {/* Habits Completed Today */}
          <div className="group relative">
            <div className="absolute -inset-2 bg-[#6DD3FF] border-4 border-black -rotate-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative border-4 border-black bg-white p-8 shadow-[10px_10px_0px_0px_#111111] hover:shadow-[4px_4px_0px_0px_#111111] hover:translate-x-[6px] hover:translate-y-[6px] transition-all">
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#7FFFD4] border-4 border-black rotate-12 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              
              <Calendar className="w-12 h-12 mb-4 text-[#6DD3FF]" />
              <p className="text-sm font-bold uppercase tracking-wider text-gray-600">TODAY'S HABITS</p>
              <p className="text-5xl font-black mt-2">{completedToday} <span className="text-2xl text-gray-400">/ {totalHabits}</span></p>
              
              <div className="mt-4">
                <div className="h-4 border-2 border-black bg-gray-100">
                  <div 
                    className="h-full bg-[#6DD3FF] border-r-2 border-black transition-all"
                    style={{ width: `${totalHabits ? (completedToday / totalHabits) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Journal Indicator */}
          <div className="group relative">
            <div className="absolute -inset-2 bg-[#8C6CFF] border-4 border-black rotate-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative border-4 border-black bg-white p-8 shadow-[10px_10px_0px_0px_#111111] hover:shadow-[4px_4px_0px_0px_#111111] hover:translate-x-[6px] hover:translate-y-[6px] transition-all">
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#FF7AC6] border-4 border-black -rotate-12 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              
              <BookOpen className="w-12 h-12 mb-4 text-[#8C6CFF]" />
              <p className="text-sm font-bold uppercase tracking-wider text-gray-600">JOURNAL TODAY</p>
              <div className="flex items-center gap-3 mt-2">
                <p className="text-5xl font-black">
                  {recentJournal ? "✓" : "○"}
                </p>
                <p className="font-bold text-xl">
                  {recentJournal ? "WRITTEN" : "NOT YET"}
                </p>
              </div>
              
              {!recentJournal && (
                <button className="mt-4 border-2 border-black bg-[#FFD84D] px-4 py-2 font-bold text-sm w-full hover:bg-[#FF7AC6] transition-colors">
                  WRITE NOW →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* QUICK STATS ROW */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'WEEKLY AVG', value: weeklyAverage, icon: Activity, color: '#FF7AC6' },
            { label: 'BEST DAY', value: bestDay.completed, icon: Award, color: '#8C6CFF' },
            { label: 'TOTAL HABITS', value: totalHabits, icon: Target, color: '#6DD3FF' },
            { label: 'STREAK DAYS', value: activeStreaks, icon: Flame, color: '#FFD84D' }
          ].map((stat, index) => (
            <div key={index} className="border-4 border-black bg-white p-4 shadow-[6px_6px_0px_0px_#111111] hover:shadow-[2px_2px_0px_0px_#111111] hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
              <div className="flex items-center gap-3">
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                <p className="text-xs font-bold">{stat.label}</p>
              </div>
              <p className="text-3xl font-black mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* WEEKLY PROGRESS CHART */}
        <div className="relative group">
          <div className="absolute -inset-3 bg-[#FFD84D] border-4 border-black rotate-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative border-4 border-black bg-white p-8 shadow-[12px_12px_0px_0px_#111111]">
            {/* Chart header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#6DD3FF] border-4 border-black flex items-center justify-center transform -rotate-3">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-black tracking-tighter">
                  WEEKLY PROGRESS
                </h2>
              </div>
              
              <div className="flex gap-2">
                <span className="w-3 h-3 bg-[#FF7AC6] border-2 border-black rounded-full" />
                <span className="w-3 h-3 bg-[#8C6CFF] border-2 border-black rounded-full" />
                <span className="w-3 h-3 bg-[#6DD3FF] border-2 border-black rounded-full" />
              </div>
            </div>

            {progress.length === 0 ? (
              <div className="border-4 border-dashed border-black p-16 text-center">
                <p className="font-black text-2xl mb-2">📊 NO DATA YET</p>
                <p className="text-lg opacity-60">Start logging habits to see your progress!</p>
              </div>
            ) : (
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progress}>
                    <CartesianGrid 
                      strokeDasharray="5 5" 
                      stroke="#000" 
                      strokeWidth={2}
                    />
                    <XAxis 
                      dataKey="date" 
                      stroke="#000"
                      strokeWidth={2}
                      tick={{ fill: '#000', fontWeight: 'bold' }}
                    />
                    <YAxis 
                      allowDecimals={false}
                      stroke="#000"
                      strokeWidth={2}
                      tick={{ fill: '#000', fontWeight: 'bold' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        border: '4px solid black',
                        borderRadius: 0,
                        backgroundColor: '#FFD84D',
                        boxShadow: '6px 6px 0px 0px #111111'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke="#FF7AC6"
                      strokeWidth={4}
                      dot={{ 
                        stroke: '#000', 
                        strokeWidth: 2,
                        fill: '#fff',
                        r: 6
                      }}
                      activeDot={{ 
                        stroke: '#000', 
                        strokeWidth: 2,
                        fill: '#8C6CFF',
                        r: 8
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Chart footer */}
            <div className="mt-6 pt-4 border-t-4 border-black flex justify-between items-center">
              <div className="flex gap-4">
                <span className="flex items-center gap-2 text-sm font-bold">
                  <div className="w-4 h-4 bg-[#FF7AC6] border-2 border-black" /> Completed
                </span>
              </div>
              <p className="text-xs font-mono opacity-50">
                LAST 7 DAYS • REAL-TIME SYNC
              </p>
            </div>
          </div>
        </div>

        {/* RECENT JOURNAL ENTRY */}
        <div className="relative group">
          <div className="absolute -inset-3 bg-[#7FFFD4] border-4 border-black -rotate-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative border-4 border-black bg-white p-8 shadow-[12px_12px_0px_0px_#111111]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#FF7AC6] border-4 border-black flex items-center justify-center transform rotate-3">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h2 className="text-3xl font-black tracking-tighter">
                  RECENT JOURNAL
                </h2>
              </div>
              
              <button className="border-4 border-black bg-[#FFD84D] px-6 py-3 font-bold hover:bg-[#FF7AC6] transition-colors shadow-[4px_4px_0px_0px_#111111] hover:shadow-[2px_2px_0px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px]">
                VIEW ALL →
              </button>
            </div>

            {recentJournal ? (
              <div className="relative">
                {/* Decorative quote marks */}
                <span className="absolute -top-4 -left-2 text-8xl text-black opacity-10 font-serif">"</span>
                
                <div className="border-4 border-black bg-[linear-gradient(135deg,#FFF9E6,#FFF)] p-8">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b-4 border-black">
                    <div className="flex gap-2">
                      <Star className="w-5 h-5 fill-[#FFD84D] text-[#FFD84D]" />
                      <Star className="w-5 h-5 fill-[#FFD84D] text-[#FFD84D]" />
                      <Star className="w-5 h-5 fill-[#FFD84D] text-[#FFD84D]" />
                    </div>
                    <p className="font-mono text-sm bg-black text-white px-3 py-1">
                      {recentJournal.date}
                    </p>
                  </div>
                  
                  <p className="text-lg font-medium leading-relaxed pl-8 border-l-8 border-[#8C6CFF]">
                    {recentJournal.content}
                  </p>
                  
                  <div className="mt-6 flex gap-2">
                    <button className="border-3 border-black bg-[#6DD3FF] px-4 py-2 font-bold text-sm hover:bg-[#7FFFD4] transition-colors">
                      ✏️ EDIT
                    </button>
                    <button className="border-3 border-black bg-[#FF7AC6] px-4 py-2 font-bold text-sm hover:bg-[#FFD84D] transition-colors">
                      📤 SHARE
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-4 border-dashed border-black p-16 text-center">
                <BookOpen className="w-20 h-20 mx-auto mb-4 opacity-30" />
                <p className="font-black text-2xl mb-2">NO JOURNAL ENTRIES</p>
                <p className="text-lg opacity-60 mb-6">Start writing your thoughts and reflections!</p>
                <button className="border-4 border-black bg-[#FF7AC6] px-8 py-4 font-black text-lg hover:bg-[#8C6CFF] transition-colors shadow-[6px_6px_0px_0px_#111111] hover:shadow-[2px_2px_0px_0px_#111111] hover:translate-x-[4px] hover:translate-y-[4px]">
                  ✨ WRITE FIRST ENTRY ✨
                </button>
              </div>
            )}
          </div>
        </div>

        {/* AI WEEKLY REFLECTION */}
        <div className="relative">
          <div className="absolute -inset-4 bg-[#8C6CFF] border-4 border-black rotate-2 opacity-20" />
          <WeeklyReflection />
        </div>

        {/* MOTIVATIONAL FOOTER */}
        <div className="relative border-4 border-black bg-[#FFD84D] p-6 shadow-[8px_8px_0px_0px_#111111]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Zap className="w-8 h-8" />
              <p className="font-black text-xl">
                {completedToday === totalHabits && totalHabits > 0 
                  ? "🎉 PERFECT DAY! YOU'RE ON FIRE!" 
                  : completedToday > 0 
                  ? "🔥 KEEP THE MOMENTUM GOING!" 
                  : "💪 START SMALL, GROW BIG!"}
              </p>
            </div>
            
            <div className="flex gap-1">
              <Sun className="w-5 h-5" />
              <Moon className="w-5 h-5" />
              <Star className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}