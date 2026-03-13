// "use client"

// import { UploadButton } from "@uploadthing/react"
// import type { OurFileRouter } from "@/app/api/uploadthing/core"
// import { useState } from "react"
// import { Sparkles, X, AlertCircle, CheckCircle, Loader2, Camera } from "lucide-react"

// interface ProofUploaderProps {
//   habitId: string
//   habitName?: string
//   onVerificationComplete?: (success: boolean) => void
// }

// export default function ProofUploader({ 
//   habitId, 
//   habitName,
//   onVerificationComplete 
// }: ProofUploaderProps) {
//   const [isUploading, setIsUploading] = useState(false)
//   const [isVerifying, setIsVerifying] = useState(false)
//   const [uploadError, setUploadError] = useState<string | null>(null)
//   const [verificationResult, setVerificationResult] = useState<{
//     success: boolean
//     message: string
//   } | null>(null)

//   const handleUploadComplete = async (res: any) => {
//     if (!res?.[0]?.url) {
//       setUploadError("No file uploaded")
//       return
//     }

//     const imageUrl = res[0].url
//     setIsVerifying(true)
//     setVerificationResult(null)
    
//     try {
//       const verifyRes = await fetch("/api/habits/verify-proof", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           habitId,
//           imageUrl
//         })
//       })
      
//       const data = await verifyRes.json()
      
//       setVerificationResult({
//         success: data.success || false,
//         message: data.message || (data.success ? "Habit verified! ✅" : "Verification failed ❌")
//       })
      
//       if (onVerificationComplete) {
//         onVerificationComplete(data.success || false)
//       }
      
//     } catch (error) {
//       console.error("Verification error:", error)
//       setUploadError("Failed to verify proof")
//     } finally {
//       setIsVerifying(false)
//       setIsUploading(false)
//     }
//   }

//   const resetState = () => {
//     setVerificationResult(null)
//     setUploadError(null)
//   }

//   return (
//     <div className="relative w-full max-w-2xl mx-auto">
//       {/* Decorative elements */}
//       <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#FF7AC6] border-2 border-black rounded-full animate-bounce-slow z-0" />
//       <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-[#8C6CFF] border-2 border-black rotate-12 z-0" 
//            style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
      
//       {/* Main container */}
//       <div className="relative z-10 border-4 border-black bg-white shadow-[8px_8px_0px_0px_#111111]">
//         {/* Top zig-zag */}
//         <div className="h-2 w-full bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:8px_8px] border-b-4 border-black" />
        
//         <div className="p-6">
//           {/* Header */}
//           <div className="flex items-center gap-3 mb-6">
//             <div className="w-10 h-10 bg-[#FF7AC6] border-3 border-black flex items-center justify-center">
//               <Camera className="w-5 h-5" />
//             </div>
//             <h3 className="font-black text-xl">UPLOAD PROOF</h3>
//             {habitName && (
//               <span className="text-xs border-2 border-black bg-[#FFD84D] px-2 py-1 font-bold">
//                 {habitName}
//               </span>
//             )}
//           </div>

//           {/* Upload Button */}
//           <div className="border-4 border-black bg-white p-4 text-center">
//             <UploadButton<OurFileRouter, "habitProof">
//               endpoint="habitProof"
//               onUploadBegin={() => {
//                 setIsUploading(true)
//                 setUploadError(null)
//                 setVerificationResult(null)
//               }}
//               onClientUploadComplete={handleUploadComplete}
//               onUploadError={(error) => {
//                 setIsUploading(false)
//                 setUploadError(error.message)
//               }}
//               appearance={{
//                 button: "w-full border-4 border-black bg-[#FF7AC6] text-black font-bold py-3 px-4 hover:bg-[#FFD84D] transition-colors shadow-[4px_4px_0px_0px_#111111] hover:shadow-[2px_2px_0px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px]",
//                 container: "w-full",
//                 allowedContent: "text-xs font-bold text-gray-600 mt-2"
//               }}
//             />
//           </div>

//           {/* Status Messages */}
//           <div className="mt-4 space-y-3">
//             {isUploading && !isVerifying && (
//               <div className="border-4 border-black bg-white p-4 flex items-center justify-center gap-2">
//                 <Loader2 className="w-5 h-5 animate-spin text-[#FF7AC6]" />
//                 <span className="font-bold">Uploading...</span>
//               </div>
//             )}

//             {isVerifying && (
//               <div className="border-4 border-black bg-white p-4 flex items-center justify-center gap-2">
//                 <Loader2 className="w-5 h-5 animate-spin text-[#8C6CFF]" />
//                 <span className="font-bold">AI verifying...</span>
//               </div>
//             )}

//             {verificationResult && (
//               <div className={`border-4 border-black p-4 ${
//                 verificationResult.success ? 'bg-[#7FFFD4]' : 'bg-[#FF7AC6]'
//               }`}>
//                 <div className="flex items-start gap-2">
//                   {verificationResult.success ? (
//                     <CheckCircle className="w-5 h-5 flex-shrink-0" />
//                   ) : (
//                     <AlertCircle className="w-5 h-5 flex-shrink-0" />
//                   )}
//                   <div className="flex-1">
//                     <p className="font-bold">{verificationResult.message}</p>
//                     {!verificationResult.success && (
//                       <button
//                         onClick={resetState}
//                         className="mt-2 border-2 border-black bg-white px-3 py-1 text-xs font-bold hover:bg-[#FFD84D]"
//                       >
//                         TRY AGAIN
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {uploadError && (
//               <div className="border-4 border-black bg-[#FF7AC6] p-4 flex items-center gap-2">
//                 <X className="w-5 h-5 flex-shrink-0" />
//                 <p className="font-bold text-sm flex-1">{uploadError}</p>
//                 <button onClick={() => setUploadError(null)} className="text-xl font-bold">×</button>
//               </div>
//             )}
//           </div>

//           {/* Tip */}
//           <div className="mt-4 border-4 border-black bg-[#6DD3FF] p-3">
//             <p className="text-xs font-bold flex items-center gap-1">
//               <Sparkles className="w-3 h-3" />
//               Take a clear photo showing proof of your habit
//             </p>
//           </div>
//         </div>

//         {/* Bottom zig-zag */}
//         <div className="h-2 w-full bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:8px_8px] border-t-4 border-black" />
//       </div>
//     </div>
//   )
// }

"use client"

import { UploadButton } from "@uploadthing/react"
import type { OurFileRouter } from "@/app/api/uploadthing/core"
import { useState } from "react"
import { Sparkles, X, AlertCircle, CheckCircle, Loader2, Camera } from "lucide-react"

interface ProofUploaderProps {
  habitId: string
  habitName?: string
  onVerificationComplete?: (success: boolean) => void
}

export default function ProofUploader({ 
  habitId, 
  habitName,
  onVerificationComplete 
}: ProofUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const handleUploadComplete = async (res: any) => {
    console.log("📸 UPLOAD COMPLETE CALLBACK TRIGGERED", res)
    
    if (!res) {
      console.error("❌ No response object")
      setUploadError("Upload failed - no response")
      setIsUploading(false)
      return
    }

    if (!res[0]?.url) {
      console.error("❌ No URL in response", res)
      setUploadError("Upload failed - no file URL")
      setIsUploading(false)
      return
    }

    const imageUrl = res[0].url
    console.log("✅ Upload successful, image URL:", imageUrl)
    console.log("✅ File details:", {
      name: res[0].name,
      size: res[0].size,
      key: res[0].key
    })
    
    setIsUploading(false)
    setIsVerifying(true)
    setUploadError(null)
    setVerificationResult(null)
    
    try {
      console.log("🔵 Calling verification API with:", { 
        habitId, 
        imageUrl: imageUrl.substring(0, 50) + "..." 
      })
      
      const verifyRes = await fetch("/api/habits/verify-proof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          habitId,
          imageUrl
        })
      })
      
      console.log("🔵 Verification API response status:", verifyRes.status)
      
      const data = await verifyRes.json()
      console.log("🔍 Verification result data:", data)
      
      setVerificationResult({
        success: data.success || false,
        message: data.message || (data.success ? "Habit verified! ✅" : "Verification failed ❌")
      })
      
      if (onVerificationComplete) {
        onVerificationComplete(data.success || false)
      }
      
    } catch (error) {
      console.error("❌ Verification fetch error:", error)
      setUploadError(`Failed to verify proof: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsVerifying(false)
    }
  }

  const resetState = () => {
    setVerificationResult(null)
    setUploadError(null)
    setIsUploading(false)
    setIsVerifying(false)
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Decorative floating elements */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#FF7AC6] border-2 border-black rounded-full animate-bounce-slow z-0" />
      <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-[#8C6CFF] border-2 border-black rotate-12 z-0" 
           style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
      
      {/* Main container */}
      <div className="relative z-10 border-4 border-black bg-white shadow-[8px_8px_0px_0px_#111111]">
        {/* Top zig-zag border */}
        <div className="h-2 w-full bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:8px_8px] border-b-4 border-black" />
        
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#FF7AC6] border-3 border-black flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="font-black text-xl">UPLOAD PROOF</h3>
            {habitName && (
              <span className="text-xs border-2 border-black bg-[#FFD84D] px-2 py-1 font-bold">
                {habitName}
              </span>
            )}
          </div>

          {/* Upload Button Area */}
          <div className="border-4 border-black bg-white p-4 text-center">
            <UploadButton<OurFileRouter, "habitProof">
              endpoint="habitProof"
              onUploadBegin={() => {
                console.log("📤 UPLOAD BEGAN")
                setIsUploading(true)
                setUploadError(null)
                setVerificationResult(null)
              }}
              onClientUploadComplete={handleUploadComplete}
              onUploadError={(error) => {
                console.error("❌ UPLOAD ERROR:", error)
                setIsUploading(false)
                setUploadError(error.message || "Upload failed")
              }}
              appearance={{
                button: "w-full border-4 border-black bg-[#FF7AC6] text-black font-bold py-3 px-4 hover:bg-[#FFD84D] transition-colors shadow-[4px_4px_0px_0px_#111111] hover:shadow-[2px_2px_0px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px]",
                container: "w-full",
                allowedContent: "text-xs font-bold text-gray-600 mt-2"
              }}
            />
          </div>

          {/* Status Messages */}
          <div className="mt-4 space-y-3">
            {/* Uploading State */}
            {isUploading && !isVerifying && (
              <div className="border-4 border-black bg-white p-4 flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-[#FF7AC6]" />
                <span className="font-bold">Uploading image to server...</span>
              </div>
            )}

            {/* Verifying State */}
            {isVerifying && (
              <div className="border-4 border-black bg-white p-4 flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-[#8C6CFF]" />
                <span className="font-bold">Groq AI is verifying your habit...</span>
              </div>
            )}

            {/* Verification Result */}
            {verificationResult && !isUploading && !isVerifying && (
              <div className={`border-4 border-black p-4 ${
                verificationResult.success ? 'bg-[#7FFFD4]' : 'bg-[#FF7AC6]'
              }`}>
                <div className="flex items-start gap-2">
                  {verificationResult.success ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-bold">{verificationResult.message}</p>
                    {!verificationResult.success && (
                      <button
                        onClick={resetState}
                        className="mt-2 border-2 border-black bg-white px-3 py-1 text-xs font-bold hover:bg-[#FFD84D]"
                      >
                        TRY AGAIN
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Upload Error */}
            {uploadError && (
              <div className="border-4 border-black bg-[#FF7AC6] p-4">
                <div className="flex items-center gap-2">
                  <X className="w-5 h-5 flex-shrink-0" />
                  <p className="font-bold text-sm flex-1">{uploadError}</p>
                  <button 
                    onClick={() => setUploadError(null)} 
                    className="border-2 border-black bg-white w-6 h-6 flex items-center justify-center font-bold hover:bg-black hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tips Box */}
          <div className="mt-4 border-4 border-black bg-[#6DD3FF] p-3">
            <p className="text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Take a clear photo showing proof of your habit. Groq AI will verify it!
            </p>
          </div>

          {/* Debug Button - Remove after testing */}
          <div className="mt-2 text-center">
            <button
              onClick={() => {
                console.log("🧪 Test button clicked")
                handleUploadComplete([{ 
                  url: "https://utfs.io/f/test-image.jpg",
                  name: "test.jpg",
                  size: 12345,
                  key: "test-key"
                }])
              }}
              className="text-xs border border-black px-2 py-1 opacity-50 hover:opacity-100"
            >
              Debug: Test Callback
            </button>
          </div>
        </div>

        {/* Bottom zig-zag border */}
        <div className="h-2 w-full bg-[linear-gradient(45deg,black_25%,transparent_25%),linear-gradient(-45deg,black_25%,transparent_25%)] bg-[length:8px_8px] border-t-4 border-black" />
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}