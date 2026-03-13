"use client"

import Link from "next/link"
import { 
  Flame, 
  Heart, 
  Github, 
  Twitter, 
  Instagram,
  Mail,
  Sparkles,
  Zap
} from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="relative w-full">
      {/* Decorative elements */}
      <div className="absolute -top-3 left-1/4 w-12 h-12 bg-[#8C6CFF] border-4 border-black rounded-full animate-pulse-slow z-0" />
      <div className="absolute -bottom-3 right-1/4 w-10 h-10 bg-[#FFD84D] border-4 border-black rotate-12 z-0" />
      
      {/* Main footer - full width no horizontal margins */}
      <div className="relative border-t-4 border-black bg-white shadow-[0_-8px_0px_0px_#111111]">
        {/* Top zig-zag border */}
        <div className="h-3 w-full bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:10px_10px] border-b-4 border-black" />
        
        <div className="p-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute -inset-2 bg-[#FF7AC6] border-3 border-black rotate-3" />
                  <div className="relative w-10 h-10 bg-[#FFD84D] border-3 border-black flex items-center justify-center">
                    <Flame className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-black text-2xl">DAILYROUTINE</h3>
              </div>
              <p className="font-bold text-sm opacity-70">
                Your 90s-inspired productivity companion. Build habits with style and nostalgia.
              </p>
              <div className="flex gap-2">
                {[Github, Twitter, Instagram].map((Icon, i) => (
                  <Link
                    key={i}
                    href="#"
                    className="border-3 border-black p-2 hover:bg-[#FF7AC6] transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="font-black text-lg mb-4 border-b-3 border-black pb-2 inline-block">
                QUICK LINKS
              </h4>
              <ul className="space-y-2">
                {['Dashboard', 'Today', 'Habits', 'Journal', 'History'].map((link) => (
                  <li key={link}>
                    <Link
                      href={`/${link.toLowerCase()}`}
                      className="font-bold text-sm hover:text-[#FF7AC6] transition-colors flex items-center gap-2"
                    >
                      <Zap className="w-3 h-3" />
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-black text-lg mb-4 border-b-3 border-black pb-2 inline-block">
                RESOURCES
              </h4>
              <ul className="space-y-2">
                {['About', 'Blog', 'Help Center', 'Contact', 'Privacy'].map((link) => (
                  <li key={link}>
                    <Link
                      href={`/${link.toLowerCase().replace(' ', '-')}`}
                      className="font-bold text-sm hover:text-[#8C6CFF] transition-colors flex items-center gap-2"
                    >
                      <Sparkles className="w-3 h-3" />
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-black text-lg mb-4 border-b-3 border-black pb-2 inline-block">
                STAY RAD
              </h4>
              <p className="font-bold text-sm mb-3">
                Get 90s vibes and productivity tips in your inbox!
              </p>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border-3 border-black p-3 pr-12 font-medium"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 border-3 border-black bg-[#FF7AC6] p-2 hover:bg-[#8C6CFF] transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 pt-6 border-t-4 border-black">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-bold">
                <span>© {currentYear} DAILYROUTINE</span>
                <span className="w-1 h-1 bg-black rounded-full" />
                <span>ALL RIGHTS RESERVED</span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-xs border-2 border-black px-2 py-1 bg-[#FFD84D] font-black">
                  v2.0.1
                </span>
                <span className="text-xs flex items-center gap-1">
                  MADE WITH <Heart className="w-3 h-3 text-[#FF7AC6]" /> & 90s VIBES
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom zig-zag border */}
        <div className="h-3 w-full bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:10px_10px] border-t-4 border-black" />
      </div>
    </div>
  )
}