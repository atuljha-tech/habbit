"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Search, 
  Bell, 
  User, 
  Menu, 
  X, 
  Sparkles, 
  Flame,
  Settings,
  LogOut,
  HelpCircle
} from "lucide-react"

export default function Navbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Mock notifications
  const notifications = [
    { id: 1, text: "🔥 5-day streak achieved!", time: "2 min ago" },
    { id: 2, text: "✨ New habit suggestion ready", time: "1 hour ago" },
    { id: 3, text: "📝 Don't forget to journal today", time: "3 hours ago" }
  ]

  return (
    <div className="relative w-full mb-6">
      {/* Decorative floating elements */}
      <div className="absolute -top-2 -left-2 w-8 h-8 bg-[#FF7AC6] border-2 border-black rounded-full animate-bounce-slow z-0" />
      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#8C6CFF] border-2 border-black rotate-12 z-0" 
           style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
      
      {/* Main navbar */}
      <div className="relative border-4 border-black bg-white shadow-[8px_8px_0px_0px_#111111]">
        {/* Top zig-zag border */}
        <div className="h-2 w-full bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:8px_8px] border-b-4 border-black" />
        
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden border-3 border-black p-2 hover:bg-[#FF7AC6] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Search Bar - Retro style */}
            <div className="flex-1 max-w-2xl relative">
              <div className={`absolute -inset-1 bg-[#FFD84D] border-3 border-black transition-opacity ${isSearchFocused ? 'opacity-100' : 'opacity-0'}`} />
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search habits, journal entries..."
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full border-3 border-black py-3 pl-12 pr-4 font-medium focus:outline-none bg-white"
                />
                <div className="absolute right-3 text-xs border-2 border-black px-2 py-1 bg-[#7FFFD4] font-bold">
                  ⌘ K
                </div>
              </div>
            </div>

            {/* Right side icons */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative border-3 border-black p-2 hover:bg-[#FF7AC6] transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#FF7AC6] border-2 border-black rounded-full text-xs flex items-center justify-center font-black">
                    3
                  </span>
                </button>

                {/* Notifications dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 border-4 border-black bg-white shadow-[8px_8px_0px_0px_#111111] z-50">
                    <div className="p-3 border-b-4 border-black bg-[#FFD84D]">
                      <h3 className="font-black flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        NOTIFICATIONS
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div key={notif.id} className="p-4 border-b-3 border-black hover:bg-[#FFF9E6] transition-colors">
                          <p className="font-bold text-sm">{notif.text}</p>
                          <p className="text-xs opacity-50 mt-1">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t-4 border-black text-center">
                      <button className="font-bold text-sm hover:text-[#FF7AC6] transition-colors">
                        VIEW ALL
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="border-3 border-black p-1 hover:bg-[#8C6CFF] transition-colors"
                >
                  <div className="w-8 h-8 bg-[#FFD84D] border-2 border-black flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                </button>

                {/* User dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 border-4 border-black bg-white shadow-[8px_8px_0px_0px_#111111] z-50">
                    <div className="p-4 border-b-4 border-black bg-[#7FFFD4]">
                      <p className="font-black">HELLO, USER!</p>
                      <p className="text-xs">user@example.com</p>
                    </div>
                    <div className="p-2">
                      {[
                        { icon: User, label: 'Profile', href: '/profile' },
                        { icon: Settings, label: 'Settings', href: '/settings' },
                        { icon: HelpCircle, label: 'Help', href: '/help' },
                      ].map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex items-center gap-3 p-3 hover:bg-[#FF7AC6] transition-colors font-bold"
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      ))}
                      <button className="w-full flex items-center gap-3 p-3 hover:bg-[#FF7AC6] transition-colors font-bold text-left border-t-3 border-black mt-2 pt-3">
                        <LogOut className="w-4 h-4" />
                        LOGOUT
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom zig-zag border */}
        <div className="h-2 w-full bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:8px_8px] border-t-4 border-black" />
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute left-0 top-0 h-full w-64 border-r-4 border-black bg-white shadow-[8px_8px_0px_0px_#111111]">
            <div className="p-4 border-b-4 border-black">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="float-right border-3 border-black p-1 hover:bg-[#FF7AC6]"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="font-black text-xl">MENU</h2>
            </div>
            <div className="p-4">
              {/* Mobile nav links would go here */}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}