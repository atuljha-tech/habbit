import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Journal from "@/models/Journal"

export async function POST(req: Request) {
  await connectDB()

  const body = await req.json()

  const entry = await Journal.create(body)

  return NextResponse.json(entry)
}