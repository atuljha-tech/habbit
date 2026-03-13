import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Journal from "@/models/Journal"

export async function GET() {
  await connectDB()

  const journals = await Journal.find().sort({ date: -1 })

  return NextResponse.json(journals)
}