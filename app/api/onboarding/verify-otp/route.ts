import { NextRequest, NextResponse } from "next/server"

interface OtpEntry {
  otp: string
  expiresAt: number
}

declare global {
  // eslint-disable-next-line no-var
  var __otpStore: Map<string, OtpEntry> | undefined
}

// Use a global to share state across module reloads in dev
const otpStore: Map<string, OtpEntry> =
  global.__otpStore ?? (global.__otpStore = new Map<string, OtpEntry>())

interface VerifyOtpBody {
  email: string
  otp: string
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as VerifyOtpBody
  const { email, otp } = body

  if (!email || !otp) {
    return NextResponse.json({ error: "Missing email or otp" }, { status: 400 })
  }

  const entry = otpStore.get(email)
  if (!entry) {
    return NextResponse.json(
      { error: "No code found for this email", code: "INVALID_OTP" },
      { status: 400 }
    )
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(email)
    return NextResponse.json(
      { error: "Code has expired", code: "INVALID_OTP" },
      { status: 400 }
    )
  }

  if (entry.otp !== otp) {
    return NextResponse.json(
      { error: "Invalid code", code: "INVALID_OTP" },
      { status: 400 }
    )
  }

  otpStore.delete(email)
  return NextResponse.json({ success: true })
}