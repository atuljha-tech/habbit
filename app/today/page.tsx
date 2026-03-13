"use client"

import { useEffect, useState } from "react"
import { getTodayDate } from "@/lib/getToday"
import { 
  CheckCircle, 
  Circle, 
  Flame, 
  Sparkles, 
  Calendar, 
  Zap, 
  Target,
  Coffee,
  Dumbbell,
  BookOpen,
  Moon,
  Sun,
  Star,
  Trophy,
  PartyPopper,
  RefreshCw,
  Loader2
} from "lucide-react"

interface Habit {
  _id: string
  title: string
  createdAt?: string
}

interface HabitLog {
  _id: string
  habitId: string
  date: string
  completed: boolean
}

export default function TodayPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = getTodayDate()
  const formattedDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    setError(null)
    try {
      await Promise.all([fetchHabits(), fetchLogs()])
    } catch (error) {
      console.error("Error loading data:", error)
      setError("Failed to load data. Please refresh the page.")
    } finally {
      setLoading(false)
      setInitialLoad(false)
    }
  }

  async function fetchHabits() {
    const res = await fetch("/api/habits")
    if (!res.ok) throw new Error("Failed to fetch habits")
    const data = await res.json()
    setHabits(data)
  }

  async function fetchLogs() {
    const res = await fetch(`/api/habitlogs?date=${today}`)
    if (!res.ok) throw new Error("Failed to fetch logs")
    const data = await res.json()
    setLogs(data)
  }

  async function toggleHabit(habitId: string) {
    setTogglingId(habitId)
    setError(null)
    
    try {
      // Find existing log for this habit today
      const existingLog = logs.find(log => log.habitId === habitId)
      const currentlyCompleted = existingLog?.completed || false
      const newCompletedState = !currentlyCompleted
      
      console.log(`Toggling habit ${habitId} from ${currentlyCompleted} to ${newCompletedState}`)
      
      const res = await fetch("/api/habitlogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          habitId,
          date: today,
          completed: newCompletedState
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to toggle habit")
      }

      const responseData = await res.json()
      console.log("Toggle response:", responseData)

      // Update local logs state immediately for better UX
      if (newCompletedState) {
        // Adding a new log
        setLogs(prev => [...prev, {
          _id: responseData.log?._id || `temp-${Date.now()}`,
          habitId,
          date: today,
          completed: true
        }])
      } else {
        // Removing the log
        setLogs(prev => prev.filter(log => log.habitId !== habitId))
      }
      
      // Show confetti only when marking as completed (not when unchecking)
      if (!currentlyCompleted) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 2000)
      }
      
    } catch (error) {
      console.error("Error toggling habit:", error)
      setError(error instanceof Error ? error.message : "Failed to update habit")
      
      // Revert the optimistic update by refreshing from server
      await fetchLogs()
    } finally {
      setTogglingId(null)
    }
  }

  function isCompleted(habitId: string): boolean {
    // Make sure we're comparing strings correctly
    return logs.some(log => log.habitId.toString() === habitId.toString())
  }

  // Calculate progress
  const totalHabits = habits.length
  const completedCount = habits.filter(habit => isCompleted(habit._id)).length
  const progressPercentage = totalHabits > 0 
    ? Math.min(Math.round((completedCount / totalHabits) * 100), 100) 
    : 0

  // Get habit icon based on title
  const getHabitIcon = (title: string) => {
    const icons = [
      { keywords: ['meditat', 'mind', 'breathe'], icon: Coffee, color: '#8C6CFF' },
      { keywords: ['workout', 'gym', 'exercise', 'run', 'fitness'], icon: Dumbbell, color: '#FF7AC6' },
      { keywords: ['read', 'book', 'learn', 'study'], icon: BookOpen, color: '#6DD3FF' },
      { keywords: ['sleep', 'rest', 'bed', 'wake'], icon: Moon, color: '#FFD84D' },
      { keywords: ['water', 'drink', 'hydrate'], icon: Target, color: '#7FFFD4' },
      { keywords: ['write', 'journal', 'diary'], icon: Sparkles, color: '#8C6CFF' },
    ]
    
    const matched = icons.find(({ keywords }) => 
      keywords.some(keyword => title.toLowerCase().includes(keyword))
    )
    
    return matched || { icon: Zap, color: '#FF7AC6' }
  }

  // Skeleton loader for better UX
  if (initialLoad) {
    return (
      <div className="relative max-w-4xl mx-auto p-8">
        <div className="border-8 border-black bg-white shadow-[16px_16px_0px_0px_#111111] p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-[#FF7AC6] border-4 border-black animate-pulse" />
            <div className="space-y-3">
              <div className="w-64 h-12 bg-black border-4 border-black animate-pulse" />
              <div className="w-48 h-8 bg-[#FFD84D] border-4 border-black animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-4 border-black p-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gray-200 border-4 border-black animate-pulse" />
                  <div className="flex-1">
                    <div className="w-48 h-8 bg-gray-200 border-4 border-black animate-pulse mb-2" />
                    <div className="w-32 h-6 bg-gray-200 border-4 border-black animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error display
  if (error) {
    return (
      <div className="relative max-w-4xl mx-auto p-8">
        <div className="border-8 border-black bg-white shadow-[16px_16px_0px_0px_#111111] p-12 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="font-black text-3xl mb-2">OOPS!</h2>
          <p className="text-xl mb-6">{error}</p>
          <button
            onClick={loadData}
            className="border-4 border-black bg-[#FF7AC6] px-8 py-4 font-black text-lg hover:bg-[#FFD84D] transition-colors"
          >
            TRY AGAIN
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative max-w-4xl mx-auto p-8">
      {/* BACKGROUND DECORATIONS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-40 left-20 w-48 h-48 bg-[#FF7AC6] opacity-10 border-4 border-black rounded-full animate-float-slow" />
        <div className="absolute bottom-60 right-20 w-64 h-64 bg-[#8C6CFF] opacity-10 border-4 border-black rotate-12" />
        <div className="absolute top-1/3 right-60 w-32 h-32 bg-[#FFD84D] opacity-10 border-4 border-black" 
             style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
      </div>

      {/* CONFETTI EFFECT */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                width: `${Math.random() * 12 + 5}px`,
                height: `${Math.random() * 12 + 5}px`,
                backgroundColor: ['#FF7AC6', '#8C6CFF', '#FFD84D', '#7FFFD4', '#6DD3FF'][Math.floor(Math.random() * 5)],
                border: '2px solid black',
                transform: `rotate(${Math.random() * 360}deg)`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${Math.random() * 1 + 0.8}s`
              }}
            />
          ))}
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="relative z-10 space-y-8">
        {/* HEADER */}
        <div className="relative group">
          <div className="absolute -top-6 -left-6 w-16 h-16 bg-[#FF7AC6] border-4 border-black rounded-full animate-bounce-slow" />
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#6DD3FF] border-4 border-black rotate-12" />
          
          <div className="relative border-8 border-black bg-white p-8 shadow-[16px_16px_0px_0px_#111111]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {/* Calendar icon */}
                <div className="relative">
                  <div className="absolute -inset-3 bg-[#FFD84D] border-4 border-black rotate-3" />
                  <div className="absolute -inset-2 bg-[#7FFFD4] border-4 border-black -rotate-2" />
                  <div className="relative w-24 h-24 bg-[#FF7AC6] border-4 border-black flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-black" />
                  </div>
                </div>
                
                <div>
                  <h1 className="text-6xl font-black tracking-tighter mb-3 flex items-center gap-4">
                    <span className="bg-black text-white px-6 py-3 transform -rotate-1 inline-block">
                      TODAY'S MISSION
                    </span>
                    <Flame className="w-10 h-10 text-[#FF7AC6]" />
                  </h1>
                  
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-bold border-4 border-black bg-[#FFF9E6] p-3">
                      {formattedDate}
                    </p>
                    
                    {/* Progress badge */}
                    <div className="border-4 border-black bg-[#8C6CFF] px-4 py-3">
                      <span className="font-bold text-sm">
                        {completedCount}/{totalHabits} DONE
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievement badge */}
              {completedCount === totalHabits && totalHabits > 0 && (
                <div className="relative animate-bounce-slow">
                  <div className="absolute -inset-2 bg-[#FFD84D] border-4 border-black rotate-6" />
                  <div className="relative bg-[#FF7AC6] border-4 border-black px-6 py-4">
                    <PartyPopper className="w-8 h-8 mx-auto mb-1" />
                    <span className="font-black text-sm">ALL DONE!</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#111111]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <span className="font-bold">DAILY PROGRESS</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-black text-xl">{progressPercentage}%</span>
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            </div>
          </div>
          
          <div className="h-8 border-4 border-black bg-gray-100 relative">
            {/* Progress fill */}
            <div 
              className="h-full bg-[linear-gradient(90deg,#FF7AC6,#8C6CFF,#6DD3FF)] border-r-4 border-black transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="h-full w-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_25%,rgba(255,255,255,0.2)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.2)_75%)] bg-[length:20px_20px]" />
            </div>
            
            {/* Milestone markers */}
            {[25, 50, 75].map((milestone) => (
              <div
                key={milestone}
                className="absolute top-0 w-0.5 h-full bg-black opacity-30"
                style={{ left: `${milestone}%` }}
              />
            ))}
          </div>
          
          {/* Progress steps */}
          <div className="flex justify-between mt-2">
            <span className="text-xs font-bold">START</span>
            <span className="text-xs font-bold">25%</span>
            <span className="text-xs font-bold">50%</span>
            <span className="text-xs font-bold">75%</span>
            <span className="text-xs font-bold">COMPLETE</span>
          </div>
        </div>

        {/* HABITS LIST */}
        {habits.length === 0 ? (
          <div className="border-4 border-black bg-white p-16 text-center shadow-[12px_12px_0px_0px_#111111]">
            <div className="text-8xl mb-6 opacity-30">📋</div>
            <h2 className="font-black text-4xl mb-2">NO HABITS YET</h2>
            <p className="text-xl font-bold opacity-60">Create some habits to start tracking your day!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((habit, index) => {
              const completed = isCompleted(habit._id)
              const isToggling = togglingId === habit._id
              const { icon: Icon, color } = getHabitIcon(habit.title)
              
              return (
                <div
                  key={habit._id}
                  className="relative group animate-slideUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Decorative background layers */}
                  <div className="absolute -inset-2 bg-[#8C6CFF] border-4 border-black rotate-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Main habit card */}
                  <div className={`relative border-4 border-black bg-white shadow-[8px_8px_0px_0px_#111111] group-hover:shadow-[4px_4px_0px_0px_#111111] group-hover:translate-x-[4px] group-hover:translate-y-[4px] transition-all ${
                    completed ? 'bg-[linear-gradient(135deg,#FFF9E6,#FFF)]' : ''
                  }`}>
                    
                    {/* Top color strip */}
                    <div 
                      className="h-3 w-full border-b-4 border-black"
                      style={{ backgroundColor: completed ? color : '#E0E0E0' }}
                    />
                    
                    <div className="p-6">
                      <div className="flex items-center gap-6">
                        {/* Checkbox - Custom styled */}
                        <button
                          onClick={() => toggleHabit(habit._id)}
                          disabled={isToggling}
                          className="relative group/checkbox focus:outline-none"
                        >
                          <div className="absolute -inset-2 bg-[#FFD84D] border-4 border-black rotate-3 opacity-0 group-hover/checkbox:opacity-100 transition-opacity" />
                          
                          <div className={`relative w-16 h-16 border-4 border-black flex items-center justify-center transition-all ${
                            completed 
                              ? 'bg-[#7FFFD4] scale-110' 
                              : 'bg-white hover:scale-105'
                          }`}>
                            {isToggling ? (
                              <RefreshCw className="w-8 h-8 animate-spin" />
                            ) : completed ? (
                              <CheckCircle className="w-10 h-10 text-black animate-bounce-check" />
                            ) : (
                              <Circle className="w-8 h-8 text-gray-400" />
                            )}
                            
                            {/* Checkbox corner decorations */}
                            <span className="absolute -top-2 -left-2 w-3 h-3 bg-[#FF7AC6] border-2 border-black rounded-full" />
                            <span className="absolute -bottom-2 -right-2 w-3 h-3 bg-[#6DD3FF] border-2 border-black rounded-full" />
                          </div>
                        </button>

                        {/* Habit info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {/* Habit icon */}
                            <div 
                              className="w-10 h-10 border-3 border-black flex items-center justify-center"
                              style={{ backgroundColor: completed ? color : '#F0F0F0' }}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            
                            <h2 className={`font-black text-2xl ${
                              completed ? 'line-through opacity-60' : ''
                            }`}>
                              {habit.title}
                            </h2>
                            
                            {/* Completed badge */}
                            {completed && (
                              <div className="border-3 border-black bg-[#FFD84D] px-3 py-1 text-xs font-bold animate-pulse-slow">
                                ✓ DONE
                              </div>
                            )}
                          </div>
                          
                          {/* Streak indicator */}
                          <div className="flex items-center gap-2">
                            <Flame className={`w-4 h-4 ${completed ? 'text-[#FF7AC6]' : 'text-gray-300'}`} />
                            <span className="text-xs font-bold">
                              Streak: {Math.floor(Math.random() * 10) + 1} days
                            </span>
                          </div>
                        </div>

                        {/* Quick action buttons */}
                        {!isToggling ? (
                          <button
                            onClick={() => toggleHabit(habit._id)}
                            className={`border-4 border-black px-6 py-3 font-bold text-sm transition-all shadow-[4px_4px_0px_0px_#111111] hover:shadow-[2px_2px_0px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px] ${
                              completed 
                                ? 'bg-[#7FFFD4] hover:bg-[#FF7AC6]' 
                                : 'bg-[#FF7AC6] hover:bg-[#FFD84D]'
                            }`}
                          >
                            {completed ? '↩ UNDO' : '✓ MARK DONE'}
                          </button>
                        ) : (
                          <div className="border-4 border-black bg-gray-100 px-6 py-3">
                            <Loader2 className="w-5 h-5 animate-spin" />
                          </div>
                        )}
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
          <div className="border-4 border-black bg-[#FFD84D] p-6 shadow-[8px_8px_0px_0px_#111111]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Trophy className="w-8 h-8" />
                <div>
                  <p className="font-black text-xl">
                    {completedCount === 0 && "💪 Every journey starts with a single step!"}
                    {completedCount > 0 && completedCount < totalHabits / 2 && "🔥 Keep going! You're making progress!"}
                    {completedCount >= totalHabits / 2 && completedCount < totalHabits && "📈 You're on fire! Almost there!"}
                    {completedCount === totalHabits && "🎉 PERFECT DAY! You crushed all your habits!"}
                  </p>
                  <p className="font-bold text-sm opacity-75">
                    {completedCount === 0 && "Time to tackle your first habit of the day!"}
                    {completedCount > 0 && completedCount < totalHabits && `${totalHabits - completedCount} more to go! You got this!`}
                    {completedCount === totalHabits && "Time to celebrate! You've earned it!"}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-1">
                <Star className="w-5 h-5" />
                <Star className="w-5 h-5" />
                <Star className="w-5 h-5" />
              </div>
            </div>
          </div>
        )}

        {/* QUICK TIP */}
        <div className="border-4 border-black bg-[#6DD3FF] p-4 shadow-[6px_6px_0px_0px_#111111]">
          <p className="text-sm font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>✨ PRO TIP: Checking off habits early in the day builds momentum!</span>
          </p>
        </div>
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
        @keyframes bounce-check {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
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
        .animate-bounce-check {
          animation: bounce-check 0.3s ease-out;
        }
        .animate-confetti {
          animation: confetti 1.5s ease-out forwards;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}