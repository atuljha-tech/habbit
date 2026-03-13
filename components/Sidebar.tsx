"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Calendar, 
  Target, 
  BookOpen, 
  History, 
  Settings,
  Sparkles,
  LogOut,
  Flame
} from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, color: "#FF7AC6" },
    { name: "Today", href: "/today", icon: Calendar, color: "#8C6CFF" },
    { name: "Habits", href: "/habits", icon: Target, color: "#FFD84D" },
    { name: "Journal", href: "/journal", icon: BookOpen, color: "#7FFFD4" },
    { name: "History", href: "/history", icon: History, color: "#6DD3FF" },
    { name: "Journal History", href: "/journal/history", icon: History, color: "#FF7AC6" },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <div className="relative w-72 h-screen bg-white border-r-4 border-black shadow-[8px_0px_0px_0px_#111111] flex flex-col">
      
      {/* Decorative elements */}
      <div className="absolute -top-3 -right-3 w-12 h-12 bg-[#FF7AC6] border-4 border-black rounded-full animate-pulse-slow" />
      <div className="absolute bottom-20 -left-4 w-16 h-16 bg-[#8C6CFF] border-4 border-black rotate-12 opacity-30" 
           style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
      
      {/* Zig-zag top border */}
      <div className="h-3 w-full bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:10px_10px] border-b-4 border-black" />
      
      {/* App Header */}
      <div className="p-6 border-b-4 border-black">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-2 bg-[#FFD84D] border-3 border-black rotate-3" />
            <div className="relative w-12 h-12 bg-[#FF7AC6] border-3 border-black flex items-center justify-center">
              <Flame className="w-6 h-6 text-black" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter">
              <span className="bg-black text-white px-2 py-1">DAILY</span>
              <span className="text-black">ROUTINE</span>
            </h1>
            <p className="text-[10px] font-bold opacity-60 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> v2.0 • 90s EDITION
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const active = isActive(link.href)
          const Icon = link.icon
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group relative block"
            >
              {/* Active indicator background */}
              {active && (
                <div className="absolute -inset-2 bg-[#FFD84D] border-3 border-black -rotate-1 opacity-30" />
              )}
              
              <div className={`
                relative flex items-center gap-4 px-5 py-4 border-3 border-black
                transition-all duration-200
                ${active 
                  ? 'bg-white shadow-[6px_6px_0px_0px_#111111]' 
                  : 'bg-white hover:shadow-[4px_4px_0px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px]'
                }
              `}>
                {/* Icon container */}
                <div 
                  className="w-10 h-10 border-3 border-black flex items-center justify-center"
                  style={{ backgroundColor: active ? link.color : '#F0F0F0' }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                
                {/* Link name */}
                <span className={`font-black text-base ${active ? 'text-black' : 'text-black'}`}>
                  {link.name}
                </span>
                
                {/* Active indicator dot */}
                {active && (
                  <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-[#FF7AC6] border-2 border-black rounded-full animate-ping-slow" />
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Settings & Footer */}
      <div className="p-4 border-t-4 border-black">
        {/* Settings link */}
      

        {/* Footer */}
        <div className="relative">
          {/* Decorative squiggle */}
          <div className="absolute -top-2 left-4 text-xl text-black opacity-20 select-none">
            ~~~~~
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FF7AC6] border border-black rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-[#8C6CFF] border border-black rounded-full animate-pulse delay-100" />
              <div className="w-2 h-2 bg-[#6DD3FF] border border-black rounded-full animate-pulse delay-200" />
            </div>
            
            <p className="text-xs font-black flex items-center gap-1">
              <span>BUILD CONSISTENCY</span>
              <Flame className="w-3 h-3 text-[#FF7AC6]" />
            </p>
          </div>
          
          <p className="text-[10px] font-bold text-center mt-2 opacity-40">
            © 2024 • MADE WITH ☕ & 90s VIBES
          </p>
        </div>
      </div>

      {/* Bottom zig-zag border */}
      <div className="h-3 w-full bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:10px_10px] border-t-4 border-black" />

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes ping-slow {
          75%, 100% {
            transform: scale(1.5) translateY(-50%);
            opacity: 0;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  )
}