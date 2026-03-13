"use client"

import { useEffect, useState } from "react"
import { Sparkles, X, Zap } from "lucide-react"

interface HypemanBannerProps {
  message: string
  duration?: number
  onClose?: () => void
}

export default function HypemanBanner({ message, duration = 4000, onClose }: HypemanBannerProps) {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.max(0, prev - 100 / (duration / 100)))
    }, 100)

    const timer = setTimeout(() => {
      setVisible(false)
      if (onClose) onClose()
    }, duration)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [duration, onClose])

  if (!visible) return null

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-slideDown">
      <div className="relative border-4 border-black bg-white shadow-[8px_8px_0px_0px_#111111] overflow-hidden">
        {/* Progress bar */}
        <div 
          className="absolute bottom-0 left-0 h-1 bg-[#FF7AC6] transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
        
        {/* Top zig-zag */}
        <div className="h-2 w-full bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:8px_8px] border-b-4 border-black" />
        
        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Hype icon */}
            <div className="relative">
              <div className="absolute -inset-1 bg-[#FFD84D] border-2 border-black rotate-6" />
              <div className="relative w-10 h-10 bg-[#FF7AC6] border-3 border-black flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
            </div>

            {/* Message */}
            <div className="flex-1">
              <p className="font-black text-lg leading-tight">
                {message}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Sparkles className="w-3 h-3 text-[#FFD84D]" />
                <span className="text-xs font-bold">HYPEMAN</span>
                <Sparkles className="w-3 h-3 text-[#FFD84D]" />
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => {
                setVisible(false)
                if (onClose) onClose()
              }}
              className="border-2 border-black w-6 h-6 flex items-center justify-center hover:bg-[#FF7AC6] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom zig-zag */}
        <div className="h-2 w-full bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:8px_8px] border-t-4 border-black" />
      </div>
    </div>
  )
}