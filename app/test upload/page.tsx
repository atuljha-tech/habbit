"use client"

import ProofUploader from "@/components/ProofUploader"

export default function TestUploadPage() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-black mb-8">Test Upload</h1>
      <ProofUploader habitId="test-123" habitName="Test Habit" />
    </div>
  )
}