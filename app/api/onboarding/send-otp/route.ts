import { NextRequest, NextResponse } from "next/server"

interface OtpEntry {
  otp: string
  expiresAt: number
}

declare global {
  // eslint-disable-next-line no-var
  var __otpStore: Map<string, OtpEntry> | undefined
}

const otpStore: Map<string, OtpEntry> =
  global.__otpStore ?? (global.__otpStore = new Map<string, OtpEntry>())

interface SendOtpBody {
  email: string
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as SendOtpBody
  const { email } = body

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = Date.now() + 10 * 60 * 1000

  otpStore.set(email, { otp, expiresAt })

  console.log(`[DEV] OTP for ${email}: ${otp}`)

  return NextResponse.json({ success: true })
}