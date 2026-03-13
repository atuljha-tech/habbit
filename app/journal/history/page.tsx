"use client"

import { useEffect, useState } from "react"
import { 
  BookOpen, 
  Calendar, 
  Sparkles, 
  Feather, 
  Star, 
  Heart, 
  MessageCircle,
  Clock,
  Edit3,
  Quote,
  Smile,
  Coffee,
  Moon,
  Sun,
  Zap
} from "lucide-react"

interface JournalEntry {
  _id: string
  date: string
  content: string
  text?: string  // Some APIs might use 'text' instead of 'content'
  mood?: "happy" | "reflective" | "energetic" | "calm" | "inspired"
}

export default function JournalHistory() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number | "all">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMood, setSelectedMood] = useState<string | "all">("all")
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)

  // Mood mapping
  const moodIcons: Record<string, { icon: any, color: string, label: string }> = {
    happy: { icon: Smile, color: '#FFD84D', label: 'Happy' },
    reflective: { icon: Moon, color: '#8C6CFF', label: 'Reflective' },
    energetic: { icon: Zap, color: '#FF7AC6', label: 'Energetic' },
    calm: { icon: Coffee, color: '#7FFFD4', label: 'Calm' },
    inspired: { icon: Star, color: '#6DD3FF', label: 'Inspired' }
  }

  useEffect(() => {
    fetchEntries()
  }, [])

  useEffect(() => {
    filterEntries()
  }, [entries, selectedYear, selectedMonth, searchTerm, selectedMood])

  async function fetchEntries() {
    setLoading(true)
    try {
      const res = await fetch("/api/journal/history")
      if (!res.ok) {
        throw new Error("Failed to fetch entries")
      }
      const data = await res.json()
      
      // Ensure we have an array
      const entriesArray = Array.isArray(data) ? data : []
      
      // Add random mood for demo and ensure content exists
      const moods = ["happy", "reflective", "energetic", "calm", "inspired"]
      const entriesWithMood = entriesArray.map((entry: JournalEntry) => ({
        _id: entry._id || Math.random().toString(),
        date: entry.date || new Date().toISOString(),
        // Use content if available, fallback to text, then default message
        content: entry.content || entry.text || "No content available for this entry.",
        mood: moods[Math.floor(Math.random() * moods.length)] as any
      }))
      
      setEntries(entriesWithMood)
    } catch (error) {
      console.error("Error fetching journal entries:", error)
      setEntries([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  function filterEntries() {
    if (!entries.length) {
      setFilteredEntries([])
      return
    }

    let filtered = [...entries]

    // Filter by year
    if (selectedYear) {
      filtered = filtered.filter(entry => 
        new Date(entry.date).getFullYear() === selectedYear
      )
    }

    // Filter by month
    if (selectedMonth !== "all") {
      filtered = filtered.filter(entry => 
        new Date(entry.date).getMonth() === selectedMonth
      )
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(entry =>
        entry.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by mood
    if (selectedMood !== "all") {
      filtered = filtered.filter(entry => entry.mood === selectedMood)
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    setFilteredEntries(filtered)
  }

  // Get unique years from entries
  const years = [...new Set(entries.map(entry => 
    new Date(entry.date).getFullYear()
  ))].sort((a, b) => b - a)

  // Calculate stats safely
  const totalEntries = entries.length
  
  const entriesThisMonth = entries.filter(entry => {
    const date = new Date(entry.date)
    const now = new Date()
    return date.getMonth() === now.getMonth() &&
           date.getFullYear() === now.getFullYear()
  }).length

  // Safely calculate longest entry with null checks
  const longestEntry = entries.reduce((max, entry) => {
    if (entry?.content && typeof entry.content === 'string') {
      return Math.max(entry.content.length, max)
    }
    return max
  }, 0)

  // Calculate current streak (simplified)
  const currentStreak = entries.length > 0 ? Math.min(7, entries.length) : 0

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    } catch {
      return "Invalid Date"
    }
  }

  if (loading) {
    return (
      <div className="relative p-12 border-8 border-black bg-white shadow-[16px_16px_0px_0px_#111111]">
        <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#FF7AC6] border-4 border-black rounded-full animate-bounce-slow" />
        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-[#8C6CFF] border-4 border-black rotate-12" />
        
        <div className="flex flex-col items-center justify-center gap-6 py-20">
          <div className="relative">
            <div className="w-20 h-20 border-8 border-[#7FFFD4] border-t-black rounded-full animate-spin" />
            <Feather className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-black" />
          </div>
          <p className="font-black text-2xl bg-black text-white px-6 py-3">
            OPENING YOUR JOURNAL...
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
        
        {/* Floating journal pages effect */}
        <div className="absolute top-80 left-1/3 text-9xl text-black opacity-5 transform -rotate-12 select-none">
          ✎ ✎ ✎
        </div>
        <div className="absolute bottom-40 right-1/4 text-9xl text-black opacity-5 select-none">
          ~~~~~
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 space-y-8">
        {/* HEADER - RETRO JOURNAL COVER */}
        <div className="relative group">
          <div className="absolute -top-6 -left-6 w-16 h-16 bg-[#FF7AC6] border-4 border-black rounded-full animate-bounce-slow" />
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#6DD3FF] border-4 border-black rotate-12" />
          
          <div className="relative border-8 border-black bg-white p-8 shadow-[16px_16px_0px_0px_#111111]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {/* Retro journal icon */}
                <div className="relative">
                  <div className="absolute -inset-3 bg-[#FFD84D] border-4 border-black rotate-3" />
                  <div className="absolute -inset-2 bg-[#7FFFD4] border-4 border-black -rotate-2" />
                  <div className="relative w-24 h-24 bg-[#FF7AC6] border-4 border-black flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-black" />
                  </div>
                </div>
                
                <div>
                  <h1 className="text-6xl font-black tracking-tighter mb-3 flex items-center gap-4">
                    <span className="bg-black text-white px-6 py-3 transform -rotate-1">
                      JOURNAL ARCHIVE
                    </span>
                    <Sparkles className="w-10 h-10 text-[#FFD84D]" />
                  </h1>
                  
                  <p className="text-lg font-bold border-4 border-black bg-[#FFF9E6] p-3 inline-block">
                    "{totalEntries} stories • {entriesThisMonth} this month • {longestEntry} chars longest"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'TOTAL ENTRIES', value: totalEntries, icon: BookOpen, color: '#FF7AC6' },
            { label: 'THIS MONTH', value: entriesThisMonth, icon: Calendar, color: '#8C6CFF' },
            { label: 'STREAK', value: `${currentStreak} 🔥`, icon: Zap, color: '#FFD84D' },
            { label: 'MOOD', value: '✨', icon: Heart, color: '#7FFFD4' }
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

        {/* FILTER CONTROLS */}
        <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#111111]">
          <div className="grid grid-cols-4 gap-4">
            {/* Year filter */}
            <div>
              <label className="block text-xs font-bold mb-2">YEAR</label>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full border-4 border-black p-3 font-bold bg-[#FFF9E6]"
                disabled={years.length === 0}
              >
                {years.length > 0 ? (
                  years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))
                ) : (
                  <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                )}
              </select>
            </div>

            {/* Month filter */}
            <div>
              <label className="block text-xs font-bold mb-2">MONTH</label>
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value === "all" ? "all" : Number(e.target.value))}
                className="w-full border-4 border-black p-3 font-bold bg-[#FFF9E6]"
              >
                <option value="all">ALL MONTHS</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {new Date(2000, i).toLocaleDateString('en-US', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            {/* Mood filter */}
            <div>
              <label className="block text-xs font-bold mb-2">MOOD</label>
              <select 
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className="w-full border-4 border-black p-3 font-bold bg-[#FFF9E6]"
              >
                <option value="all">ALL MOODS</option>
                {Object.entries(moodIcons).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-xs font-bold mb-2">SEARCH</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 Search entries..."
                className="w-full border-4 border-black p-3 font-bold bg-[#FFF9E6]"
              />
            </div>
          </div>
        </div>

        {/* ENTRIES LIST */}
        {filteredEntries.length === 0 ? (
          <div className="border-4 border-black bg-white p-20 text-center shadow-[12px_12px_0px_0px_#111111]">
            <div className="text-8xl mb-6 opacity-30">📔</div>
            <h2 className="font-black text-4xl mb-2">NO ENTRIES FOUND</h2>
            <p className="text-xl font-bold opacity-60">Try adjusting your filters or write something new!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEntries.map((entry, index) => {
              const mood = entry.mood || "reflective"
              const MoodIcon = moodIcons[mood]?.icon || MessageCircle
              const moodColor = moodIcons[mood]?.color || '#8C6CFF'
              const isExpanded = expandedEntry === entry._id
              
              return (
                <div
                  key={entry._id}
                  className="relative group animate-slideUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Decorative layers */}
                  <div className="absolute -inset-2 bg-[#8C6CFF] border-4 border-black rotate-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute -inset-1 bg-[#FFD84D] border-4 border-black -rotate-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Main entry card - styled like a journal page */}
                  <div className="relative border-4 border-black bg-white shadow-[8px_8px_0px_0px_#111111] group-hover:shadow-[4px_4px_0px_0px_#111111] group-hover:translate-x-[4px] group-hover:translate-y-[4px] transition-all">
                    
                    {/* Top decorative strip with mood color */}
                    <div 
                      className="h-4 w-full border-b-4 border-black"
                      style={{ backgroundColor: moodColor }}
                    />

                    <div className="p-8">
                      {/* Entry header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          {/* Date block */}
                          <div className="border-4 border-black bg-[#FFD84D] p-3 text-center min-w-[120px]">
                            <div className="text-xs font-bold">
                              {new Date(entry.date).toLocaleDateString('en-US', { month: 'short' })}
                            </div>
                            <div className="text-3xl font-black">
                              {new Date(entry.date).getDate()}
                            </div>
                          </div>

                          {/* Date and mood */}
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <Clock className="w-4 h-4" />
                              <span className="font-bold text-sm">
                                {formatDate(entry.date)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-6 h-6 border-2 border-black flex items-center justify-center"
                                style={{ backgroundColor: moodColor }}
                              >
                                <MoodIcon className="w-3 h-3" />
                              </div>
                              <span className="text-xs font-bold">
                                Feeling {moodIcons[mood]?.label || 'Reflective'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Expand button */}
                        <button
                          onClick={() => setExpandedEntry(isExpanded ? null : entry._id)}
                          className="border-3 border-black px-4 py-2 font-bold text-sm hover:bg-[#FF7AC6] transition-colors"
                        >
                          {isExpanded ? 'SHOW LESS' : 'READ MORE'}
                        </button>
                      </div>

                      {/* Entry content */}
                      <div className="relative">
                        {/* Decorative quote marks */}
                        <Quote className="absolute -top-2 -left-2 w-8 h-8 opacity-20" />
                        
                        <div 
                          className={`font-medium leading-relaxed pl-8 border-l-8 transition-all ${
                            isExpanded ? 'border-[#FF7AC6]' : 'border-[#8C6CFF]'
                          }`}
                          style={{ borderLeftColor: moodColor }}
                        >
                          {isExpanded ? (
                            <p className="whitespace-pre-wrap text-lg">{entry.content}</p>
                          ) : (
                            <p className="text-base">
                              {entry.content.length > 200 
                                ? `${entry.content.substring(0, 200)}...` 
                                : entry.content}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Entry footer */}
                      <div className="mt-6 pt-4 border-t-4 border-black flex items-center justify-between">
                        <div className="flex gap-3">
                          <button className="border-3 border-black px-3 py-1 text-xs font-bold hover:bg-[#7FFFD4] transition-colors">
                            <Edit3 className="w-3 h-3 inline mr-1" />
                            EDIT
                          </button>
                          <button className="border-3 border-black px-3 py-1 text-xs font-bold hover:bg-[#FF7AC6] transition-colors">
                            <Heart className="w-3 h-3 inline mr-1" />
                            FAVORITE
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono opacity-50">
                            {entry.content.length} chars
                          </span>
                          <div className="flex gap-1">
                            {[...Array(3)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-[#FFD84D] text-[#FFD84D]" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* INSPIRATIONAL FOOTER */}
        {entries.length > 0 && (
          <div className="border-4 border-black bg-[#7FFFD4] p-6 shadow-[8px_8px_0px_0px_#111111]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Feather className="w-8 h-8" />
                <div>
                  <p className="font-black text-xl">
                    {filteredEntries.length === entries.length 
                      ? "📖 YOUR COMPLETE JOURNAL" 
                      : `📖 SHOWING ${filteredEntries.length} OF ${entries.length} ENTRIES`}
                  </p>
                  <p className="font-bold text-sm opacity-75">
                    Keep writing your story, one day at a time
                  </p>
                </div>
              </div>
              
              <button className="border-4 border-black bg-white px-6 py-3 font-black text-sm hover:bg-[#FFD84D] transition-colors shadow-[4px_4px_0px_0px_#111111] hover:shadow-[2px_2px_0px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px]">
                ✍️ NEW ENTRY
              </button>
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