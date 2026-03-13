"use client"

import { useEffect, useState } from "react"
import { 
  Plus, 
  Flame, 
  Trophy, 
  Calendar, 
  Sparkles, 
  Zap, 
  Target,
  Coffee,
  Dumbbell,
  BookOpen,
  Moon,
  Sun,
  Star,
  Award,
  TrendingUp,
  XCircle
} from "lucide-react"

interface Habit {
  _id: string
  title: string
  createdAt: string
}

interface Streak {
  habitId: string
  currentStreak: number
  longestStreak: number
  lastCompletedDate?: string
}

// Fun habit icons mapping based on title keywords
const getHabitIcon = (title: string) => {
  const icons = [
    { keywords: ['meditat', 'mind', 'breathe'], icon: Coffee, color: '#8C6CFF' },
    { keywords: ['workout', 'gym', 'exercise', 'run'], icon: Dumbbell, color: '#FF7AC6' },
    { keywords: ['read', 'book', 'learn'], icon: BookOpen, color: '#6DD3FF' },
    { keywords: ['sleep', 'rest', 'bed'], icon: Moon, color: '#FFD84D' },
    { keywords: ['water', 'drink', 'hydrate'], icon: Target, color: '#7FFFD4' },
    { keywords: ['write', 'journal'], icon: Sparkles, color: '#8C6CFF' },
  ]
  
  const matched = icons.find(({ keywords }) => 
    keywords.some(keyword => title.toLowerCase().includes(keyword))
  )
  
  return matched || { icon: Zap, color: '#FF7AC6' }
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [streaks, setStreaks] = useState<Streak[]>([])
  const [title, setTitle] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [filter, setFilter] = useState<"all" | "active" | "streak">("all")
  const [showCreateTip, setShowCreateTip] = useState(true)

  useEffect(() => {
    fetchHabits()
    fetchStreaks()
  }, [])

  async function fetchHabits() {
    const res = await fetch("/api/habits")
    const data = await res.json()
    setHabits(data)
  }

  async function fetchStreaks() {
    const res = await fetch("/api/streaks")
    const data = await res.json()
    setStreaks(data)
  }

  async function createHabit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    
    setIsCreating(true)
    try {
      await fetch("/api/habits", {
        method: "POST",
        body: JSON.stringify({ title }),
      })

      setTitle("")
      await fetchHabits()
      await fetchStreaks()
    } finally {
      setIsCreating(false)
    }
  }

  function getStreak(habitId: string) {
    return streaks.find((s) => s.habitId === habitId)
  }

  // Filter habits based on selection
  const filteredHabits = habits.filter(habit => {
    const streak = getStreak(habit._id)
    if (filter === "active") return streak?.currentStreak && streak.currentStreak > 0
    if (filter === "streak") return streak?.currentStreak && streak.currentStreak >= 5
    return true
  })

  // Calculate stats
  const totalStreaks = streaks.filter(s => s.currentStreak > 0).length
  const totalLongest = Math.max(...streaks.map(s => s.longestStreak), 0)

  return (
    <div className="relative max-w-6xl mx-auto p-8">
      {/* EXPLOSION OF BACKGROUND DECORATIONS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-48 h-48 bg-[#FF7AC6] opacity-10 border-4 border-black rounded-full animate-float-slow" />
        <div className="absolute bottom-40 right-10 w-64 h-64 bg-[#8C6CFF] opacity-10 border-4 border-black rotate-12" />
        <div className="absolute top-1/3 right-40 w-32 h-32 bg-[#FFD84D] opacity-10 border-4 border-black" 
             style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
        <div className="absolute bottom-1/4 left-40 w-56 h-56 bg-[#6DD3FF] opacity-10 border-4 border-black rounded-full" />
        
        {/* Floating 90s patterns */}
        <div className="absolute top-60 left-1/4 text-9xl text-black opacity-5 transform -rotate-12 select-none">
          ~~~~~~~~~~
        </div>
        <div className="absolute bottom-80 right-1/3 text-9xl text-black opacity-5 transform rotate-45 select-none">
          ⚡⚡⚡⚡⚡
        </div>
        <div className="absolute top-40 right-1/4 text-9xl text-black opacity-5 select-none">
          ✦ ✦ ✦ ✦
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 space-y-8">
        {/* HEADER WITH RETRO COMPUTER VIBE */}
        <div className="relative group">
          {/* Floating decorative elements */}
          <div className="absolute -top-8 -left-8 w-20 h-20 bg-[#FF7AC6] border-4 border-black rounded-full animate-bounce-slow z-0" />
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#8C6CFF] border-4 border-black -rotate-12 z-0" 
               style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
          
          {/* Main header card */}
          <div className="relative border-8 border-black bg-white p-8 shadow-[20px_20px_0px_0px_#111111]">
            {/* TV static top border */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:8px_8px] border-4 border-black" />
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                {/* Retro computer icon */}
                <div className="relative">
                  <div className="absolute -inset-3 bg-[#FFD84D] border-4 border-black rotate-3" />
                  <div className="absolute -inset-2 bg-[#7FFFD4] border-4 border-black -rotate-2" />
                  <div className="relative w-24 h-24 bg-[#6DD3FF] border-4 border-black flex items-center justify-center overflow-hidden">
                    <Target className="w-12 h-12 text-black" />
                    {/* Screen scan line effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none" />
                  </div>
                </div>
                
                <div>
                  <h1 className="text-6xl font-black tracking-tighter mb-3 flex items-center gap-4">
                    <span className="bg-black text-white px-6 py-3 transform -rotate-1 inline-block">
                      HABIT TERMINAL
                    </span>
                    <Flame className="w-12 h-12 text-[#FF7AC6]" />
                  </h1>
                  
                  {/* Retro stats bar */}
                  <div className="flex gap-4 mt-4">
                    <div className="border-4 border-black bg-[#FF7AC6] px-4 py-2 font-bold">
                      <span className="text-sm">TOTAL HABITS</span>
                      <p className="text-2xl font-black">{habits.length}</p>
                    </div>
                    <div className="border-4 border-black bg-[#8C6CFF] px-4 py-2 font-bold">
                      <span className="text-sm">ACTIVE STREAKS</span>
                      <p className="text-2xl font-black">{totalStreaks}</p>
                    </div>
                    <div className="border-4 border-black bg-[#6DD3FF] px-4 py-2 font-bold">
                      <span className="text-sm">BEST STREAK</span>
                      <p className="text-2xl font-black">{totalLongest}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter buttons */}
              <div className="flex gap-3">
                {[
                  { value: 'all', label: 'ALL', icon: Star, color: '#FF7AC6' },
                  { value: 'active', label: 'ACTIVE', icon: Flame, color: '#8C6CFF' },
                  { value: 'streak', label: 'HOT', icon: Zap, color: '#FFD84D' }
                ].map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value as any)}
                    className={`border-4 border-black p-4 font-bold text-lg transition-all hover:-translate-y-2 ${
                      filter === f.value ? `shadow-[8px_8px_0px_0px_#111111]` : ''
                    }`}
                    style={{ backgroundColor: filter === f.value ? f.color : 'white' }}
                  >
                    <f.icon className="w-6 h-6 mx-auto mb-1" />
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CREATE HABIT FORM - PLAYFUL INPUT */}
        <div className="relative group">
          <div className="absolute -inset-3 bg-[#8C6CFF] border-4 border-black rotate-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <form onSubmit={createHabit} className="relative border-4 border-black bg-white p-8 shadow-[12px_12px_0px_0px_#111111]">
            {/* Form header with tip */}
            {showCreateTip && (
              <div className="absolute -top-5 left-8 bg-[#FFD84D] border-4 border-black px-6 py-2 font-bold text-sm animate-bounce-slow">
                💡{showCreateTip && (
  <div className="absolute -top-5 left-8 bg-[#FFD84D] border-4 border-black px-6 py-2 font-bold text-sm animate-bounce-slow">
    💡 TIP: Be specific! &quot;Morning meditation&quot; &gt; &quot;meditate&quot;
    <button 
      type="button"
      onClick={() => setShowCreateTip(false)}
      className="ml-3 font-black hover:text-[#FF7AC6]"
    >
      ✕
    </button>
  </div>
)}
                <button 
                  type="button"
                  onClick={() => setShowCreateTip(false)}
                  className="ml-3 font-black hover:text-[#FF7AC6]"
                >
                  ✕
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <input
                  className="w-full border-4 border-black p-6 text-2xl font-bold bg-[linear-gradient(135deg,#FFF9E6,#FFF)] focus:outline-none focus:bg-white"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ENTER NEW HABIT..."
                  disabled={isCreating}
                />
                {/* Decorative cursor */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-black animate-pulse" />
              </div>
              
              <button
                type="submit"
                disabled={isCreating || !title.trim()}
                className="group/btn relative border-4 border-black bg-[#FF7AC6] text-black font-black text-2xl p-6 shadow-[8px_8px_0px_0px_#111111] hover:shadow-[4px_4px_0px_0px_#111111] hover:translate-x-[4px] hover:translate-y-[4px] transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
              >
                <div className="flex items-center justify-center gap-3">
                  {isCreating ? (
                    <>
                      <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin" />
                      <span>ADDING...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform" />
                      <span>ADD HABIT</span>
                    </>
                  )}
                </div>
                
                {/* Decorative corners */}
                <span className="absolute -top-3 -left-3 w-4 h-4 bg-[#FFD84D] border-3 border-black rotate-12" />
                <span className="absolute -bottom-3 -right-3 w-4 h-4 bg-[#6DD3FF] border-3 border-black -rotate-12" />
              </button>
            </div>
          </form>
        </div>

        {/* HABITS GRID */}
        {filteredHabits.length === 0 ? (
          <div className="relative border-4 border-black bg-white p-20 shadow-[12px_12px_0px_0px_#111111] text-center">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#FF7AC6] border-4 border-black rounded-full animate-ping opacity-50" />
            
            <div className="max-w-md mx-auto">
              <div className="text-9xl mb-8 animate-bounce-slow">✨</div>
              <h2 className="font-black text-4xl mb-4 bg-black text-white inline-block px-8 py-4 transform -rotate-1">
                NO HABITS FOUND
              </h2>
              <p className="text-xl font-bold mt-6">
                {habits.length === 0 
                  ? "Create your first habit above to start your journey!" 
                  : "No habits match your filter. Try another filter!"}
              </p>
              
              {habits.length > 0 && (
                <button
                  onClick={() => setFilter("all")}
                  className="mt-8 border-4 border-black bg-[#8C6CFF] px-8 py-4 font-black text-lg hover:bg-[#7FFFD4] transition-colors shadow-[6px_6px_0px_0px_#111111] hover:shadow-[2px_2px_0px_0px_#111111] hover:translate-x-[4px] hover:translate-y-[4px]"
                >
                  SHOW ALL HABITS →
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredHabits.map((habit, index) => {
              const streak = getStreak(habit._id)
              const { icon: Icon, color } = getHabitIcon(habit.title)
              const isHot = (streak?.currentStreak || 0) >= 5
              
              return (
                <div
                  key={habit._id}
                  className="relative group animate-slideUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Decorative background layers */}
                  <div className="absolute -inset-2 bg-[#8C6CFF] border-4 border-black rotate-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute -inset-1 bg-[#FFD84D] border-4 border-black -rotate-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Main habit card */}
                  <div className="relative border-4 border-black bg-white shadow-[8px_8px_0px_0px_#111111] group-hover:shadow-[4px_4px_0px_0px_#111111] group-hover:translate-x-[4px] group-hover:translate-y-[4px] transition-all">
                    
                    {/* Card header with color strip */}
                    <div 
                      className="h-4 w-full border-b-4 border-black"
                      style={{ backgroundColor: color }}
                    />
                    
                    <div className="p-6">
                      {/* Habit title and hot badge */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-14 h-14 border-4 border-black flex items-center justify-center transform -rotate-3 group-hover:rotate-0 transition-transform"
                            style={{ backgroundColor: color }}
                          >
                            <Icon className="w-7 h-7" />
                          </div>
                          <h2 className="font-black text-xl tracking-tight max-w-[150px]">
                            {habit.title.toUpperCase()}
                          </h2>
                        </div>
                        
                        {isHot && (
                          <div className="relative">
                            <div className="absolute -inset-1 bg-[#FF7AC6] border-2 border-black rotate-3" />
                            <div className="relative bg-[#FFD84D] border-2 border-black px-3 py-1 font-bold text-xs flex items-center gap-1">
                              <Flame className="w-3 h-3" />
                              HOT!
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Stats grid */}
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="border-4 border-black bg-[#FF7AC6] p-4 transform -rotate-1 hover:rotate-0 transition-transform">
                          <div className="flex items-center gap-2 mb-2">
                            <Flame className="w-4 h-4" />
                            <span className="text-xs font-bold">CURRENT</span>
                          </div>
                          <p className="text-3xl font-black">{streak?.currentStreak || 0}</p>
                        </div>
                        
                        <div className="border-4 border-black bg-[#6DD3FF] p-4 transform rotate-1 hover:rotate-0 transition-transform">
                          <div className="flex items-center gap-2 mb-2">
                            <Trophy className="w-4 h-4" />
                            <span className="text-xs font-bold">LONGEST</span>
                          </div>
                          <p className="text-3xl font-black">{streak?.longestStreak || 0}</p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      {streak?.currentStreak && streak.currentStreak > 0 && (
                        <div className="mt-4">
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span>STREAK PROGRESS</span>
                            <span>{streak.currentStreak}/30</span>
                          </div>
                          <div className="h-4 border-4 border-black bg-gray-100">
                            <div 
                              className="h-full bg-[#7FFFD4] border-r-4 border-black transition-all"
                              style={{ width: `${Math.min((streak.currentStreak / 30) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Footer with date and actions */}
                      <div className="mt-6 pt-4 border-t-4 border-black flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(habit.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <button className="border-3 border-black bg-white px-3 py-1 text-xs font-bold hover:bg-[#FF7AC6] transition-colors">
                            LOG
                          </button>
                          <button className="border-3 border-black bg-white px-3 py-1 text-xs font-bold hover:bg-[#8C6CFF] transition-colors">
                            ⋮
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* MOTIVATIONAL FOOTER */}
        {habits.length > 0 && (
          <div className="relative border-4 border-black bg-[#FFD84D] p-6 shadow-[8px_8px_0px_0px_#111111]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Award className="w-10 h-10" />
                <div>
                  <p className="font-black text-2xl">
                    {totalStreaks === habits.length 
                      ? "🎯 PERFECT! ALL HABITS ACTIVE!" 
                      : totalStreaks > habits.length / 2 
                      ? "🔥 YOU'RE ON A ROLL! KEEP GOING!" 
                      : "💪 BUILD THOSE STREAKS!"}
                  </p>
                  <p className="font-bold text-sm opacity-75">
                    {totalStreaks} active streaks • {totalLongest} days longest streak
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <TrendingUp className="w-6 h-6" />
                <Star className="w-6 h-6" />
                <Zap className="w-6 h-6" />
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
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