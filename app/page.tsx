"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Flame,
  Target,
  Calendar,
  Sparkles,
  Zap,
  Star,
  ArrowRight,
  CheckCircle,
  Clock,
  TrendingUp,
  Coffee,
  Rocket
} from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* BACKGROUND EXPLOSION - 90s style */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Large floating shapes */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#FF7AC6] opacity-20 border-8 border-black rounded-full animate-float-slow" />
        <div className="absolute bottom-40 right-10 w-80 h-80 bg-[#8C6CFF] opacity-20 border-8 border-black rotate-12 animate-float-slower" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-[#FFD84D] opacity-20 border-8 border-black animate-spin-slow"
          style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
        <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-[#6DD3FF] opacity-20 border-8 border-black rounded-full animate-pulse-slow" />

        {/* Floating patterns */}
        <div className="absolute top-40 left-1/3 text-[200px] text-black opacity-5 transform -rotate-12 select-none font-mono">
          {`{;}`}
        </div>
        <div className="absolute bottom-40 right-1/3 text-[200px] text-black opacity-5 transform rotate-12 select-none">
          ✦ ✦ ✦
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,black_2px,transparent_2px),linear-gradient(-45deg,black_1px,transparent_1px)] bg-[length:40px_40px] opacity-5" />

        {/* Zig-zag lines */}
        <div className="absolute top-60 left-0 w-full h-8 bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:20px_20px] opacity-10" />
        <div className="absolute bottom-60 left-0 w-full h-8 bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:20px_20px] opacity-10 transform rotate-180" />
      </div>

      <main className="relative z-10 min-h-screen w-full max-w-6xl mx-auto py-20 px-6 sm:px-12">

        {/* TOP BAR - Retro Computer Style */}
        <div className="relative mb-20">
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#FF7AC6] border-4 border-black rounded-full animate-bounce-slow" />
          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#8C6CFF] border-4 border-black rotate-12" />

          <div className="relative border-8 border-black bg-white p-6 shadow-[16px_16px_0px_0px_#111111]">
            <div className="flex items-center justify-between">
              {/* Logo and Brand */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-3 bg-[#FFD84D] border-4 border-black rotate-3" />
                  <div className="absolute -inset-2 bg-[#7FFFD4] border-4 border-black -rotate-2" />
                  <div className="relative w-20 h-20 bg-[#FF7AC6] border-4 border-black flex items-center justify-center">
                    <Flame className="w-10 h-10 text-black" />
                  </div>
                </div>

                <div>
                  <h1 className="text-5xl font-black tracking-tighter">
                    <span className="bg-black text-white px-4 py-2 transform -rotate-1 inline-block mr-2">
                      DAILY
                    </span>
                    <span className="text-black">ROUTINE</span>
                  </h1>
                  <p className="text-sm font-bold border-4 border-black bg-[#FFF9E6] p-2 mt-2 inline-block">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#FF7AC6]" />
                      YOUR 90s PRODUCTIVITY COMPANION
                      <Sparkles className="w-4 h-4 text-[#8C6CFF]" />
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HERO SECTION - Main Attraction */}
        <div className="relative mb-20">
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#FFD84D] border-4 border-black rounded-full animate-ping-slow opacity-30" />

          <div className="relative border-8 border-black bg-white p-12 shadow-[20px_20px_0px_0px_#111111]">
            <div className="max-w-3xl mx-auto text-center">
              {/* Hero badge */}
              <div className="inline-block border-4 border-black bg-[#8C6CFF] px-6 py-3 mb-8 transform -rotate-2">
                <span className="font-black text-white text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  NEW • VERSION 2.0 • 90s EDITION
                  <Zap className="w-4 h-4" />
                </span>
              </div>

              <h2 className="text-7xl font-black leading-tight tracking-tighter mb-6">
                BUILD BETTER
                <span className="block bg-[linear-gradient(135deg,#FF7AC6,#8C6CFF,#6DD3FF)] bg-clip-text text-transparent">
                  HABITS
                </span>
              </h2>

              <p className="text-2xl font-bold mb-8 border-l-8 border-[#FF7AC6] pl-6 text-left">
                One day at a time, with a splash of 90s nostalgia and
                brutalist charm. Your daily routine never looked so rad!
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 pt-4 sm:flex-row justify-center">
                <Link
                  href="/signup"
                  className="group relative border-4 border-black bg-[#FF7AC6] text-black font-black text-xl py-5 px-10 shadow-[10px_10px_0px_0px_#111111] hover:shadow-[4px_4px_0px_0px_#111111] hover:translate-x-[6px] hover:translate-y-[6px] transition-all"
                >
                  <span className="flex items-center gap-3">
                    GET STARTED
                    <Rocket className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute -top-3 -left-3 w-4 h-4 bg-[#FFD84D] border-3 border-black rotate-12" />
                  <span className="absolute -bottom-3 -right-3 w-4 h-4 bg-[#6DD3FF] border-3 border-black -rotate-12" />
                </Link>

                <Link
                  href="/about"
                  className="border-4 border-black bg-white text-black font-black text-xl py-5 px-10 shadow-[8px_8px_0px_0px_#111111] hover:shadow-[4px_4px_0px_0px_#111111] hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-2"
                >
                  LEARN MORE
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURES GRID - Retro Cards */}
        <div className="relative mb-20">
          <div className="absolute -left-8 top-1/2 w-16 h-16 bg-[#7FFFD4] border-4 border-black rounded-full animate-bounce-slow" />

          <h3 className="text-4xl font-black mb-12 text-center flex items-center justify-center gap-4">
            <span className="w-8 h-8 bg-[#FF7AC6] border-4 border-black transform rotate-45" />
            <span className="bg-black text-white px-6 py-3 transform -rotate-1">
              TOTALLY RAD FEATURES
            </span>
            <span className="w-8 h-8 bg-[#8C6CFF] border-4 border-black transform rotate-12" />
          </h3>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {/* Feature 1 */}
            <div className="group relative">
              <div className="absolute -inset-3 bg-[#FF7AC6] border-4 border-black rotate-1 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative border-4 border-black bg-white p-8 shadow-[10px_10px_0px_0px_#111111] group-hover:shadow-[6px_6px_0px_0px_#111111] group-hover:translate-x-[4px] group-hover:translate-y-[4px] transition-all">
                <div className="text-5xl mb-4 border-4 border-black bg-[#FFD84D] w-20 h-20 flex items-center justify-center transform -rotate-3 group-hover:rotate-0 transition-transform">
                  📋
                </div>
                <h4 className="text-2xl font-black mb-3">CREATE ROUTINES</h4>
                <p className="font-bold text-sm opacity-70">
                  Build custom daily routines that work for your schedule,
                  with a style that pops!
                </p>
                <div className="mt-4 flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-[#FF7AC6] border border-black" />
                  ))}
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative">
              <div className="absolute -inset-3 bg-[#8C6CFF] border-4 border-black rotate-1 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative border-4 border-black bg-white p-8 shadow-[10px_10px_0px_0px_#111111] group-hover:shadow-[6px_6px_0px_0px_#111111] group-hover:translate-x-[4px] group-hover:translate-y-[4px] transition-all">
                <div className="text-5xl mb-4 border-4 border-black bg-[#6DD3FF] w-20 h-20 flex items-center justify-center transform rotate-3 group-hover:rotate-0 transition-transform">
                  📊
                </div>
                <h4 className="text-2xl font-black mb-3">TRACK PROGRESS</h4>
                <p className="font-bold text-sm opacity-70">
                  Monitor your consistency with colorful charts and
                  watch your streaks grow!
                </p>
                <div className="mt-4 flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-[#8C6CFF] border border-black" />
                  ))}
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative">
              <div className="absolute -inset-3 bg-[#FFD84D] border-4 border-black rotate-1 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative border-4 border-black bg-white p-8 shadow-[10px_10px_0px_0px_#111111] group-hover:shadow-[6px_6px_0px_0px_#111111] group-hover:translate-x-[4px] group-hover:translate-y-[4px] transition-all">
                <div className="text-5xl mb-4 border-4 border-black bg-[#7FFFD4] w-20 h-20 flex items-center justify-center transform -rotate-6 group-hover:rotate-0 transition-transform">
                  🎯
                </div>
                <h4 className="text-2xl font-black mb-3">ACHIEVE GOALS</h4>
                <p className="font-bold text-sm opacity-70">
                  Turn your daily habits into long-term success with
                  our rad tracking system!
                </p>
                <div className="mt-4 flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-[#FFD84D] border border-black" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>





      </main>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-5deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes ping-slow {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 10s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}