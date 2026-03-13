"use client"

import { useEffect, useState } from "react"
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Flame, 
  Sparkles, 
  Zap, 
  TrendingUp,
  Activity,
  Award,
  Clock,
  Filter,
  ChevronLeft,
  ChevronRight,
  Star,
  Target
} from "lucide-react"

interface Habit {
  _id: string
  title: string
}

interface HabitLog {
  _id: string
  habitId: string
  habitName?: string
  date: string
  completed: boolean
  streak?: number
}

export default function HistoryPage() {
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<HabitLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "completed" | "missed">("all")
  const [view, setView] = useState<"list" | "calendar" | "heatmap">("list")
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    missed: 0,
    streak: 0,
    bestDay: "",
    completionRate: 0
  })

  useEffect(() => {
    fetchLogs()
  }, [])

  useEffect(() => {
    if (logs.length > 0) {
      applyFilter()
      calculateStats()
    }
  }, [logs, filter])

  async function fetchLogs() {
    setLoading(true)
    try {
      // Fetch both logs and habits in parallel
      const [logsRes, habitsRes] = await Promise.all([
        fetch("/api/habitlogs"),
        fetch("/api/habits")
      ])
      
      if (!logsRes.ok || !habitsRes.ok) {
        throw new Error("Failed to fetch data")
      }
      
      const logsData = await logsRes.json()
      const habitsData = await habitsRes.json()
      
      // Create a map of habitId -> habitName
      const habitMap = new Map()
      habitsData.forEach((habit: Habit) => {
        habitMap.set(habit._id, habit.title)
      })
      
      // Map habit names to logs
      const logsWithNames = logsData.map((log: HabitLog) => ({
        ...log,
        habitName: habitMap.get(log.habitId) || "Unknown Habit"
      }))
      
      console.log("Habit Map:", Object.fromEntries(habitMap)) // Debug log
      console.log("Logs with names:", logsWithNames) // Debug log
      
      setLogs(logsWithNames)
    } catch (error) {
      console.error("Error fetching logs:", error)
    } finally {
      setLoading(false)
    }
  }

  function applyFilter() {
    let filtered = [...logs]
    
    if (filter === "completed") {
      filtered = filtered.filter(log => log.completed)
    } else if (filter === "missed") {
      filtered = filtered.filter(log => !log.completed)
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    setFilteredLogs(filtered)
  }

  function calculateStats() {
    const completed = logs.filter(l => l.completed).length
    const missed = logs.filter(l => !l.completed).length
    const total = logs.length
    
    // Find best day
    const dateCounts: Record<string, number> = {}
    logs.forEach(log => {
      if (log.completed) {
        dateCounts[log.date] = (dateCounts[log.date] || 0) + 1
      }
    })
    
    let bestDate = ""
    let maxCount = 0
    Object.entries(dateCounts).forEach(([date, count]) => {
      if (count > maxCount) {
        maxCount = count
        bestDate = date
      }
    })
    
    // Calculate current streak (simplified)
    let currentStreak = 0
    const uniqueDates = [...new Set(logs.map(l => l.date))].sort()
    
    for (let i = uniqueDates.length - 1; i >= 0; i--) {
      const dateLogs = logs.filter(l => l.date === uniqueDates[i])
      const allCompleted = dateLogs.every(l => l.completed)
      
      if (allCompleted) {
        currentStreak++
      } else {
        break
      }
    }
    
    setStats({
      total,
      completed,
      missed,
      streak: currentStreak,
      bestDay: bestDate ? formatDate(bestDate) : "N/A",
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    })
  }

  function getDaysInMonth(month: number, year: number) {
    return new Date(year, month + 1, 0).getDate()
  }

  function getLogsForDate(date: string) {
    return logs.filter(log => log.date === date)
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Rest of your component remains the same...
  if (loading) {
    return (
      <div className="relative p-12 border-8 border-black bg-white shadow-[16px_16px_0px_0px_#111111]">
        <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#FF7AC6] border-4 border-black rounded-full animate-bounce-slow" />
        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-[#8C6CFF] border-4 border-black rotate-12" />
        
        <div className="flex flex-col items-center justify-center gap-6 py-20">
          <div className="relative">
            <div className="w-20 h-20 border-8 border-[#7FFFD4] border-t-black rounded-full animate-spin" />
            <Clock className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-black" />
          </div>
          <p className="font-black text-2xl bg-black text-white px-6 py-3">
            LOADING HISTORY...
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

  return (
    <div className="relative max-w-6xl mx-auto p-8">
      {/* BACKGROUND DECORATIONS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-40 left-20 w-48 h-48 bg-[#FF7AC6] opacity-10 border-4 border-black rounded-full animate-float-slow" />
        <div className="absolute bottom-60 right-20 w-64 h-64 bg-[#8C6CFF] opacity-10 border-4 border-black rotate-12" />
        <div className="absolute top-1/3 right-60 w-32 h-32 bg-[#FFD84D] opacity-10 border-4 border-black" 
             style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
        
        {/* Retro patterns */}
        <div className="absolute top-80 left-1/3 text-9xl text-black opacity-5 transform -rotate-12 select-none">
          ⌇ ⌇ ⌇ ⌇
        </div>
        <div className="absolute bottom-40 right-1/4 text-9xl text-black opacity-5 select-none">
          ✦ ✦ ✦ ✦
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
                <div className="relative">
                  <div className="absolute -inset-3 bg-[#FFD84D] border-4 border-black rotate-3" />
                  <div className="relative w-20 h-20 bg-[#FF7AC6] border-4 border-black flex items-center justify-center">
                    <Calendar className="w-10 h-10 text-black" />
                  </div>
                </div>
                
                <div>
                  <h1 className="text-5xl font-black tracking-tighter mb-2 flex items-center gap-4">
                    <span className="bg-black text-white px-6 py-3 transform -rotate-1">
                      HISTORY ARCHIVE
                    </span>
                    <Sparkles className="w-10 h-10 text-[#FFD84D]" />
                  </h1>
                  
                  <div className="flex gap-4 mt-4">
                    <div className="border-4 border-black bg-[#7FFFD4] px-4 py-2">
                      <span className="text-xs font-bold">TOTAL LOGS</span>
                      <p className="text-2xl font-black">{stats.total}</p>
                    </div>
                    <div className="border-4 border-black bg-[#FF7AC6] px-4 py-2">
                      <span className="text-xs font-bold">COMPLETION</span>
                      <p className="text-2xl font-black">{stats.completionRate}%</p>
                    </div>
                    <div className="border-4 border-black bg-[#8C6CFF] px-4 py-2">
                      <span className="text-xs font-bold">STREAK</span>
                      <p className="text-2xl font-black">{stats.streak} 🔥</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'COMPLETED', value: stats.completed, icon: CheckCircle, color: '#7FFFD4' },
            { label: 'MISSED', value: stats.missed, icon: XCircle, color: '#FF7AC6' },
            { label: 'BEST DAY', value: stats.bestDay.split(' ')[0], icon: Award, color: '#FFD84D' },
            { label: 'ACTIVE', value: logs.length > 0 ? 'ON TRACK' : 'START', icon: Target, color: '#8C6CFF' }
          ].map((stat, index) => (
            <div key={index} className="border-4 border-black bg-white p-4 shadow-[6px_6px_0px_0px_#111111] hover:shadow-[2px_2px_0px_0px_#111111] hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                <span className="text-xs font-bold">{stat.label}</span>
              </div>
              <p className="text-2xl font-black">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* CONTROLS BAR */}
        <div className="flex items-center justify-between border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_#111111]">
          {/* View toggles */}
          <div className="flex gap-2">
            {[
              { value: 'list', label: '📋 LIST', color: '#FF7AC6' },
              { value: 'calendar', label: '📅 CALENDAR', color: '#8C6CFF' },
              { value: 'heatmap', label: '🔥 HEATMAP', color: '#FFD84D' }
            ].map((v) => (
              <button
                key={v.value}
                onClick={() => setView(v.value as any)}
                className={`border-3 border-black px-4 py-2 font-bold text-sm transition-all hover:-translate-y-1 ${
                  view === v.value ? `shadow-[4px_4px_0px_0px_#111111]` : ''
                }`}
                style={{ backgroundColor: view === v.value ? v.color : 'white' }}
              >
                {v.label}
              </button>
            ))}
          </div>

          {/* Filter buttons */}
          <div className="flex gap-2">
            <Filter className="w-5 h-5 mr-2" />
            {[
              { value: 'all', label: 'ALL' },
              { value: 'completed', label: '✅ DONE' },
              { value: 'missed', label: '❌ MISSED' }
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value as any)}
                className={`border-3 border-black px-4 py-2 font-bold text-sm transition-all hover:-translate-y-1 ${
                  filter === f.value ? 'bg-[#6DD3FF] shadow-[4px_4px_0px_0px_#111111]' : 'bg-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT - VIEWS */}
        {view === 'list' && (
          <div className="space-y-4">
            {filteredLogs.length === 0 ? (
              <div className="border-4 border-black bg-white p-16 text-center shadow-[12px_12px_0px_0px_#111111]">
                <div className="text-8xl mb-6 opacity-50">📭</div>
                <h2 className="font-black text-3xl mb-2">NO LOGS FOUND</h2>
                <p className="text-lg">No habit logs match your filter criteria</p>
              </div>
            ) : (
              filteredLogs.map((log, index) => (
                <div
                  key={log._id}
                  className="relative group animate-slideUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="absolute -inset-2 bg-[#8C6CFF] border-4 border-black rotate-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#111111] group-hover:shadow-[4px_4px_0px_0px_#111111] group-hover:translate-x-[4px] group-hover:translate-y-[4px] transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        {/* Date block */}
                        <div className="border-4 border-black bg-[#FFD84D] p-3 text-center min-w-[100px]">
                          <div className="text-xs font-bold">{new Date(log.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                          <div className="text-3xl font-black">{new Date(log.date).getDate()}</div>
                        </div>
                        
                        {/* Habit info */}
                        <div>
                          <h3 className="font-black text-xl">{log.habitName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs font-bold">
                              {new Date(log.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Status badge */}
                      <div className={`border-4 border-black px-6 py-3 font-bold text-lg ${
                        log.completed ? 'bg-[#7FFFD4]' : 'bg-[#FF7AC6]'
                      }`}>
                        {log.completed ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            COMPLETED
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <XCircle className="w-5 h-5" />
                            MISSED
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Decorative streak indicator */}
                    {log.completed && (
                      <div className="absolute -top-2 -right-2 flex gap-1">
                        <Flame className="w-4 h-4 text-[#FF7AC6]" />
                        <span className="text-xs font-bold">+1</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {view === 'calendar' && (
          <div className="border-4 border-black bg-white p-8 shadow-[12px_12px_0px_0px_#111111]">
            {/* Calendar header */}
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => {
                  if (selectedMonth === 0) {
                    setSelectedMonth(11)
                    setSelectedYear(selectedYear - 1)
                  } else {
                    setSelectedMonth(selectedMonth - 1)
                  }
                }}
                className="border-3 border-black p-3 hover:bg-[#FF7AC6] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <h2 className="font-black text-3xl">
                {new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              
              <button 
                onClick={() => {
                  if (selectedMonth === 11) {
                    setSelectedMonth(0)
                    setSelectedYear(selectedYear + 1)
                  } else {
                    setSelectedMonth(selectedMonth + 1)
                  }
                }}
                className="border-3 border-black p-3 hover:bg-[#6DD3FF] transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                <div key={day} className="text-center font-black text-sm bg-black text-white p-2 border-2 border-black">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => i + 1).map(day => {
                const date = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const dayLogs = getLogsForDate(date)
                const completedCount = dayLogs.filter(l => l.completed).length
                const totalCount = dayLogs.length
                
                return (
                  <div key={day} className="border-4 border-black p-3 min-h-[100px] hover:bg-[#FFF9E6] transition-colors">
                    <div className="font-black text-lg mb-2">{day}</div>
                    {dayLogs.length > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-[#7FFFD4]" />
                          <span className="text-xs font-bold">{completedCount}/{totalCount}</span>
                        </div>
                        <div className="h-1 w-full border border-black bg-gray-100">
                          <div 
                            className="h-full bg-[#7FFFD4]"
                            style={{ width: `${(completedCount / totalCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {view === 'heatmap' && (
          <div className="border-4 border-black bg-white p-8 shadow-[12px_12px_0px_0px_#111111]">
            <h2 className="font-black text-2xl mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6" />
              ACTIVITY HEATMAP
            </h2>
            
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 52 }, (_, week) => (
                <div key={week} className="space-y-1">
                  {Array.from({ length: 7 }, (_, day) => {
                    const intensity = Math.random() // This should be replaced with actual data
                    return (
                      <div 
                        key={day}
                        className="w-6 h-6 border-2 border-black transition-transform hover:scale-150"
                        style={{
                          backgroundColor: intensity > 0.7 ? '#FF7AC6' : 
                                         intensity > 0.4 ? '#8C6CFF' : 
                                         intensity > 0.1 ? '#7FFFD4' : '#F0F0F0'
                        }}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="mt-6 flex items-center justify-end gap-4 border-t-4 border-black pt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black bg-[#F0F0F0]" />
                <span className="text-xs font-bold">No activity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black bg-[#7FFFD4]" />
                <span className="text-xs font-bold">Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black bg-[#8C6CFF]" />
                <span className="text-xs font-bold">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black bg-[#FF7AC6]" />
                <span className="text-xs font-bold">High</span>
              </div>
            </div>
          </div>
        )}

        {/* SUMMARY FOOTER */}
        {logs.length > 0 && (
          <div className="border-4 border-black bg-[#8C6CFF] p-6 shadow-[8px_8px_0px_0px_#111111]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <TrendingUp className="w-8 h-8" />
                <div>
                  <p className="font-black text-xl">
                    {stats.completionRate >= 80 ? "🌟 EXCELLENT CONSISTENCY!" :
                     stats.completionRate >= 50 ? "📈 GOOD PROGRESS!" :
                     "💪 KEEP BUILDING MOMENTUM!"}
                  </p>
                  <p className="font-bold text-sm opacity-75">
                    You've completed {stats.completed} out of {stats.total} habit logs
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