"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine
} from "recharts"

interface MoodData {
  date: string
  mood: number
  fullDate?: string
}

interface MoodChartProps {
  data: MoodData[]
}

export default function MoodChart({ data }: MoodChartProps) {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const moodValue = payload[0].value
      let moodEmoji = "😐"
      if (moodValue >= 8) moodEmoji = "🤩"
      else if (moodValue >= 6) moodEmoji = "😊"
      else if (moodValue >= 4) moodEmoji = "😐"
      else moodEmoji = "😔"

      return (
        <div className="border-4 border-black bg-white p-4 shadow-[6px_6px_0px_0px_#111111] animate-slideUp">
          <p className="font-black text-sm border-b-2 border-black pb-1 mb-2">
            {payload[0].payload.fullDate || label}
          </p>
          <p className="font-bold flex items-center gap-2">
            <span className="text-2xl">{moodEmoji}</span>
            <span style={{ color: '#FF7AC6' }} className="text-xl">
              Mood: {moodValue}/10
            </span>
          </p>
        </div>
      )
    }
    return null
  }

  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#111111]">
        <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
          <span className="w-4 h-4 bg-[#FF7AC6] border-2 border-black" />
          EMOTIONAL TREND
        </h2>
        <div className="h-[300px] flex flex-col items-center justify-center border-4 border-dashed border-black bg-[linear-gradient(45deg,#FFF9E6,#FFF)]">
          <span className="text-6xl mb-4 opacity-30">📊</span>
          <p className="font-black text-xl mb-2">NO MOOD DATA</p>
          <p className="text-sm font-bold opacity-60">Journal entries with mood tags will appear here</p>
        </div>
      </div>
    )
  }

  // Find min and max mood for Y axis with some padding
  const moods = data.map(d => d.mood)
  const minMood = Math.max(1, Math.floor(Math.min(...moods) - 0.5))
  const maxMood = Math.min(10, Math.ceil(Math.max(...moods) + 0.5))

  return (
    <div className="relative group">
      {/* Decorative elements */}
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#FFD84D] border-3 border-black rotate-12 z-0" />
      <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-[#6DD3FF] border-3 border-black rounded-full z-0" />
      
      {/* Main chart container */}
      <div className="relative border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#111111] hover:shadow-[6px_6px_0px_0px_#111111] transition-all duration-200">
        {/* Header with retro vibe */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FF7AC6] border-3 border-black flex items-center justify-center transform -rotate-3">
              <span className="text-lg">📈</span>
            </div>
            <h2 className="text-2xl font-black tracking-tighter">
              EMOTIONAL TREND
            </h2>
          </div>
          
          {/* Mood legend */}
          <div className="flex gap-3 text-xs font-bold">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-[#FF7AC6] border-2 border-black" />
              MOOD SCORE
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-[#8C6CFF] border-2 border-black" />
              TREND LINE
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={data} 
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              {/* Background grid */}
              <CartesianGrid 
                strokeDasharray="5 5" 
                stroke="#000" 
                strokeWidth={1.5}
                opacity={0.2}
              />
              
              {/* X Axis */}
              <XAxis 
                dataKey="date" 
                stroke="#000"
                strokeWidth={2}
                tick={{ 
                  fill: '#000', 
                  fontWeight: 'bold', 
                  fontSize: 12,
                  fontFamily: 'monospace'
                }}
                tickLine={{ stroke: '#000', strokeWidth: 2 }}
                axisLine={{ stroke: '#000', strokeWidth: 3 }}
              />
              
              {/* Y Axis */}
              <YAxis 
                domain={[minMood, maxMood]}
                stroke="#000"
                strokeWidth={2}
                tick={{ 
                  fill: '#000', 
                  fontWeight: 'bold', 
                  fontSize: 12,
                  fontFamily: 'monospace'
                }}
                tickLine={{ stroke: '#000', strokeWidth: 2 }}
                axisLine={{ stroke: '#000', strokeWidth: 3 }}
              />
              
              {/* Tooltip */}
              <Tooltip content={<CustomTooltip />} />
              
              {/* Reference lines for mood zones */}
              <ReferenceLine 
                y={7} 
                stroke="#8C6CFF" 
                strokeDasharray="3 3" 
                strokeWidth={2}
                label={{ 
                  value: 'GOOD', 
                  position: 'right',
                  fill: '#8C6CFF',
                  fontSize: 10,
                  fontWeight: 'bold'
                }} 
              />
              <ReferenceLine 
                y={4} 
                stroke="#FF7AC6" 
                strokeDasharray="3 3" 
                strokeWidth={2}
                label={{ 
                  value: 'NEEDS ATTENTION', 
                  position: 'right',
                  fill: '#FF7AC6',
                  fontSize: 10,
                  fontWeight: 'bold'
                }} 
              />
              
              {/* Main line */}
              <Line
                type="monotone"
                dataKey="mood"
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

        {/* Footer with stats */}
        <div className="mt-6 pt-4 border-t-4 border-black flex justify-between items-center">
          <div className="flex gap-4">
            <span className="text-xs font-bold">
              RANGE: {minMood} - {maxMood}
            </span>
            <span className="text-xs font-bold">
              ENTRIES: {data.length}
            </span>
          </div>
          
          {/* Mood summary */}
          {data.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono opacity-50">AVG:</span>
              <span className="font-black text-sm bg-[#FFD84D] border-2 border-black px-2 py-0.5">
                {(data.reduce((acc, curr) => acc + curr.mood, 0) / data.length).toFixed(1)}/10
              </span>
            </div>
          )}
        </div>

        {/* Decorative corner elements */}
        <span className="absolute -top-3 -left-3 w-4 h-4 bg-[#FF7AC6] border-2 border-black rotate-12" />
        <span className="absolute -bottom-3 -right-3 w-4 h-4 bg-[#6DD3FF] border-2 border-black -rotate-12" />
      </div>

      <style jsx>{`
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
        .animate-slideUp {
          animation: slideUp 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  )
}