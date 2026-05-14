"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { CheckCircle, Upload } from "lucide-react"
import {
  VouchButton,
  VouchInput,
  VouchBadge,
  VouchAvatar,
} from "@/components/ui/vouch"
import { toast } from "@/components/ui/vouch"
import { useOnboardingStore } from "@/lib/onboarding-store"
import { supabase } from "@/lib/supabase"

export default function OnboardingVerifyPage() {
  const router = useRouter()
  const { user } = useUser()
  const { userType, linkedinUrl, fullName, avatarUrl, location, resumeUrl } =
    useOnboardingStore()

  const [workEmail, setWorkEmail] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpValue, setOtpValue] = useState("")
  const [emailVerified, setEmailVerified] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)

  const [idUploading, setIdUploading] = useState(false)
  const [idUploaded, setIdUploaded] = useState(false)

  const [completing, setCompleting] = useState(false)

  const handleSendOtp = async () => {
    if (!workEmail) {
      toast.error("Please enter your work email")
      return
    }
    setSendingOtp(true)
    try {
      const res = await fetch("/api/onboarding/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: workEmail }),
      })
      if (!res.ok) throw new Error("Failed to send code")
      setOtpSent(true)
      toast.info("Code sent! (check console in dev)")
    } catch {
      toast.error("Failed to send verification code")
    } finally {
      setSendingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otpValue || otpValue.length < 6) {
      toast.error("Please enter the 6-digit code")
      return
    }
    setVerifyingOtp(true)
    try {
      const res = await fetch("/api/onboarding/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: workEmail, otp: otpValue }),
      })
      const data = (await res.json()) as { success?: boolean; error?: string }
      if (!res.ok || !data.success) {
        toast.error(data.error ?? "Invalid code")
        return
      }
      setEmailVerified(true)
      toast.success("Work email verified!")
    } catch {
      toast.error("Verification failed")
    } finally {
      setVerifyingOtp(false)
    }
  }

  const handleIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10MB")
      return
    }
    if (!user?.id) {
      toast.error("Not authenticated")
      return
    }
    setIdUploading(true)
    try {
      const { error } = await supabase.storage
        .from("id-verification")
        .upload(`${user.id}/${file.name}`, file, { upsert: true })
      if (error) throw error
      setIdUploaded(true)
      toast.success("Document uploaded!")
    } catch {
      toast.error("Failed to upload document")
    } finally {
      setIdUploading(false)
    }
  }

  const handleComplete = async () => {
    setCompleting(true)
    try {
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userType,
          fullName,
          avatarUrl,
          linkedinUrl,
          location,
          resumeUrl,
        }),
      })
      const data = (await res.json()) as { success?: boolean; error?: string }
      if (!res.ok || !data.success) {
        toast.error(data.error ?? "Something went wrong")
        return
      }
      toast.success("Welcome to Vouch!")
      router.push("/dashboard")
    } catch {
      toast.error("Failed to complete onboarding")
    } finally {
      setCompleting(false)
    }
  }

  const showReferrerSection = userType === "referrer" || userType === "both"
  const showSeekerSection = userType === "seeker"

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start px-6 py-12"
      style={{ backgroundColor: "#0A0A0F" }}
    >
      {/* Progress bar */}
      <div className="w-full max-w-[640px] mb-8">
        <div
          className="w-full h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: "#111118" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: "100%", backgroundColor: "#6C63FF" }}
          />
        </div>
        <p className="text-xs mt-2" style={{ color: "#8888AA" }}>
          Step 3 of 3
        </p>
      </div>

      <div className="w-full max-w-[640px]">
        {/* Back link */}
        <Link
          href="/onboarding/profile"
          className="inline-flex items-center text-sm mb-8 transition-colors hover:text-[#F0F0FF]"
          style={{ color: "#8888AA" }}
        >
          ← Back
        </Link>

        {/* Headline */}
        <h1
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: "var(--font-syne)", color: "#F0F0FF" }}
        >
          Verify your identity
        </h1>
        <p className="text-sm mb-8" style={{ color: "#8888AA" }}>
          This helps us keep Vouch trusted and safe for everyone.
        </p>

        {/* Referrer / Both: Work email + LinkedIn */}
        {showReferrerSection && (
          <div className="flex flex-col gap-6 mb-6">
            <div
              className="p-6 rounded-vouch border"
              style={{ backgroundColor: "#111118", borderColor: "#2A2A38" }}
            >
              <h2
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: "var(--font-syne)", color: "#F0F0FF" }}
              >
                Work Email Verification
              </h2>

              {emailVerified ? (
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} color="#00D4AA" />
                  <span className="text-sm font-medium" style={{ color: "#00D4AA" }}>
                    Work email verified ✓
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex items-end gap-3 mb-4">
                    <div className="flex-1">
                      <VouchInput
                        label="Work Email Address"
                        type="email"
                        placeholder="you@company.com"
                        value={workEmail}
                        onChange={(e) => setWorkEmail(e.target.value)}
                        disabled={otpSent}
                      />
                    </div>
                    <VouchButton
                      variant="secondary"
                      size="md"
                      onClick={handleSendOtp}
                      disabled={otpSent || sendingOtp}
                      loading={sendingOtp}
                      className="shrink-0"
                    >
                      {otpSent ? "Sent ✓" : "Send Code"}
                    </VouchButton>
                  </div>

                  {otpSent && (
                    <div className="flex flex-col gap-3">
                      <VouchInput
                        label="Verification Code"
                        placeholder="123456"
                        maxLength={6}
                        value={otpValue}
                        onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                      />
                      <VouchButton
                        variant="primary"
                        size="md"
                        onClick={handleVerifyOtp}
                        disabled={verifyingOtp || otpValue.length < 6}
                        loading={verifyingOtp}
                      >
                        Verify Code
                      </VouchButton>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* LinkedIn confirmation */}
            <div
              className="p-6 rounded-vouch border"
              style={{ backgroundColor: "#111118", borderColor: "#2A2A38" }}
            >
              <h2
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: "var(--font-syne)", color: "#F0F0FF" }}
              >
                LinkedIn Profile
              </h2>
              <div className="flex items-center gap-3 mb-3">
                <VouchAvatar src={avatarUrl} name={fullName} size="sm" />
                <div>
                  <p className="text-sm font-medium" style={{ color: "#F0F0FF" }}>
                    {fullName || "Your Name"}
                  </p>
                  {linkedinUrl && (
                    <p className="text-xs" style={{ color: "#8888AA" }}>
                      {linkedinUrl}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-sm mb-3" style={{ color: "#8888AA" }}>
                Your LinkedIn will be reviewed by our team within 24 hours.
              </p>
              <VouchBadge variant="warning">Under Review</VouchBadge>
            </div>
          </div>
        )}

        {/* Seeker only: ID Verification */}
        {showSeekerSection && (
          <div className="flex flex-col gap-6 mb-6">
            <div
              className="p-6 rounded-vouch border"
              style={{ backgroundColor: "#111118", borderColor: "#2A2A38" }}
            >
              <h2
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: "var(--font-syne)", color: "#F0F0FF" }}
              >
                Government ID Verification
              </h2>

              <div
                className="p-4 rounded-vouch mb-4 border text-sm"
                style={{
                  backgroundColor: "#1A1A24",
                  borderColor: "#2A2A38",
                  color: "#8888AA",
                }}
              >
                Your identity is verified privately and never shared with referrers. We use this to prevent fraud.
              </div>

              {idUploaded ? (
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} color="#00D4AA" />
                  <span className="text-sm font-medium mr-2" style={{ color: "#F0F0FF" }}>
                    Document uploaded ✓
                  </span>
                  <VouchBadge variant="success">Uploaded</VouchBadge>
                </div>
              ) : (
                <label
                  className="flex flex-col items-center justify-center gap-3 p-8 rounded-vouch border-2 border-dashed cursor-pointer transition-all duration-200 hover:border-[#6C63FF]/50"
                  style={{ borderColor: "#2A2A38" }}
                >
                  {idUploading ? (
                    <span className="text-sm" style={{ color: "#8888AA" }}>
                      Uploading...
                    </span>
                  ) : (
                    <>
                      <Upload size={32} color="#8888AA" />
                      <div className="text-center">
                        <p className="text-sm font-medium" style={{ color: "#F0F0FF" }}>
                          Upload Government ID
                        </p>
                        <p className="text-xs mt-1" style={{ color: "#8888AA" }}>
                          JPG, PNG, or PDF — max 10MB
                        </p>
                      </div>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    className="hidden"
                    onChange={handleIdUpload}
                    disabled={idUploading}
                  />
                </label>
              )}

              <p className="text-xs mt-3" style={{ color: "#55556A" }}>
                Verification is reviewed within 1 business day.
              </p>
            </div>
          </div>
        )}

        {/* Complete button */}
        <VouchButton
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleComplete}
          loading={completing}
        >
          Complete Setup →
        </VouchButton>
      </div>
    </div>
  )
}