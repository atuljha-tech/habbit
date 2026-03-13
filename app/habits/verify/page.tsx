"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import ProofUploader from "@/components/ProofUploader"
import { ArrowLeft, AlertCircle, Sparkles } from "lucide-react"

export default function VerifyHabitPage() {
  const searchParams = useSearchParams()
  const habitId = searchParams.get("habitId")
  const habitName = searchParams.get("habitName")
  
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "failed">("idle")

  if (!habitId || !habitName) {
    return (
      <div className="relative max-w-4xl mx-auto p-8">
        <div className="border-8 border-black bg-white p-12 shadow-[16px_16px_0px_0px_#111111] text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-[#FF7AC6]" />
          <h1 className="text-4xl font-black mb-4">INVALID HABIT</h1>
          <p className="text-xl mb-8">No habit selected for verification.</p>
          <Link 
            href="/habits"
            className="inline-block border-4 border-black bg-[#FF7AC6] px-8 py-4 font-black text-lg hover:bg-[#FFD84D] transition-colors"
          >
            ← BACK TO HABITS
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative max-w-4xl mx-auto p-8">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-40 left-20 w-64 h-64 bg-[#FF7AC6] opacity-10 border-4 border-black rounded-full animate-float-slow" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-[#8C6CFF] opacity-10 border-4 border-black rotate-12" />
      </div>

      {/* Main content */}
      <div className="relative z-10 space-y-6">
        {/* Back button */}
        <Link 
          href="/habits"
          className="inline-flex items-center gap-2 border-4 border-black bg-white px-6 py-3 font-bold hover:bg-[#FFD84D] transition-colors shadow-[4px_4px_0px_0px_#111111] hover:shadow-[2px_2px_0px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px]"
        >
          <ArrowLeft className="w-5 h-5" />
          BACK TO HABITS
        </Link>

        {/* Header */}
        <div className="relative">
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#FFD84D] border-4 border-black rounded-full animate-ping-slow opacity-30" />
          
          <div className="relative border-8 border-black bg-white p-8 shadow-[16px_16px_0px_0px_#111111]">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-[#FF7AC6] border-4 border-black flex items-center justify-center">
                <span className="text-3xl">📸</span>
              </div>
              <div>
                <h1 className="text-5xl font-black tracking-tighter">
                  VERIFY HABIT
                </h1>
                <p className="text-lg font-bold border-l-4 border-[#FF7AC6] pl-4 mt-2">
                  Upload proof for: <span className="bg-black text-white px-3 py-1">{habitName}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Uploader Section */}
        <div className="relative">
          <div className="absolute -inset-3 bg-[#8C6CFF] border-4 border-black rotate-1 opacity-20" />
          
          <div className="relative border-4 border-black bg-white p-8 shadow-[12px_12px_0px_0px_#111111]">
            <ProofUploader 
              habitId={habitId}
              habitName={habitName}
              onVerificationComplete={(success) => {
                setVerificationStatus(success ? "success" : "failed")
              }}
            />
          </div>
        </div>

        {/* Success Message */}
        {verificationStatus === "success" && (
          <div className="border-4 border-black bg-[#7FFFD4] p-6 shadow-[8px_8px_0px_0px_#111111] animate-slideUp">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white border-4 border-black flex items-center justify-center text-2xl">
                ✅
              </div>
              <div>
                <h3 className="font-black text-xl">HABIT VERIFIED!</h3>
                <p className="font-bold">Great job! Your streak continues. 🎉</p>
              </div>
              <Link 
                href="/habits"
                className="ml-auto border-4 border-black bg-white px-6 py-3 font-bold hover:bg-[#FFD84D] transition-colors"
              >
                DONE
              </Link>
            </div>
          </div>
        )}

        {/* Tips Box */}
        <div className="border-4 border-black bg-[#6DD3FF] p-4 shadow-[6px_6px_0px_0px_#111111]">
          <p className="text-sm font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>📸 Take a clear photo showing you completed "{habitName}". The AI will verify it!</span>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes ping-slow {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}