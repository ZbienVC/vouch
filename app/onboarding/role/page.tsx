"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Users, Check } from "lucide-react"
import { VouchButton, VouchCard } from "@/components/ui/vouch"
import { useOnboardingStore } from "@/lib/onboarding-store"
import { cn } from "@/lib/utils"

type Role = "seeker" | "referrer" | "both"

export default function OnboardingRolePage() {
  const router = useRouter()
  const { setUserType } = useOnboardingStore()
  const [selected, setSelected] = useState<Role | null>(null)

  const handleContinue = () => {
    if (!selected) return
    setUserType(selected)
    router.push("/onboarding/profile")
  }

  const handleBoth = () => {
    setUserType("both")
    router.push("/onboarding/profile")
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{ backgroundColor: "#0A0A0F" }}
    >
      <div className="w-full max-w-[640px]">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "#6C63FF" }}
          />
          <div
            className="w-2 h-2 rounded-full border"
            style={{ borderColor: "#2A2A38" }}
          />
          <div
            className="w-2 h-2 rounded-full border"
            style={{ borderColor: "#2A2A38" }}
          />
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <span
            className="font-display text-3xl font-bold tracking-[0.2em] uppercase"
            style={{ color: "#6C63FF", fontFamily: "var(--font-syne)" }}
          >
            VOUCH
          </span>
        </div>

        {/* Headline */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "var(--font-syne)", color: "#F0F0FF" }}
          >
            How will you use Vouch?
          </h1>
          <p className="text-sm" style={{ color: "#8888AA" }}>
            You can always add the other role later from your settings.
          </p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Seeker card */}
          <VouchCard
            className={cn(
              "relative cursor-pointer min-h-[200px] flex flex-col items-start gap-4 p-6 transition-all duration-200",
              selected === "seeker"
                ? "border-[#6C63FF] shadow-[0_0_24px_rgba(108,99,255,0.25)] bg-[#6C63FF]/10"
                : "hover:border-[#6C63FF]/50 hover:bg-[#111118]"
            )}
            onClick={() => setSelected("seeker")}
          >
            {selected === "seeker" && (
              <div
                className="absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#6C63FF" }}
              >
                <Check size={12} color="white" />
              </div>
            )}
            <Search size={48} color="#6C63FF" />
            <div>
              <h2
                className="text-xl font-semibold mb-2"
                style={{ fontFamily: "var(--font-syne)", color: "#F0F0FF" }}
              >
                I&apos;m Looking for a Referral
              </h2>
              <p className="text-sm" style={{ color: "#8888AA" }}>
                Find employees at your target companies who can refer you directly.
              </p>
            </div>
          </VouchCard>

          {/* Referrer card */}
          <VouchCard
            className={cn(
              "relative cursor-pointer min-h-[200px] flex flex-col items-start gap-4 p-6 transition-all duration-200",
              selected === "referrer"
                ? "border-[#6C63FF] shadow-[0_0_24px_rgba(108,99,255,0.25)] bg-[#6C63FF]/10"
                : "hover:border-[#6C63FF]/50 hover:bg-[#111118]"
            )}
            onClick={() => setSelected("referrer")}
          >
            {selected === "referrer" && (
              <div
                className="absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#6C63FF" }}
              >
                <Check size={12} color="white" />
              </div>
            )}
            <Users size={48} color="#6C63FF" />
            <div>
              <h2
                className="text-xl font-semibold mb-2"
                style={{ fontFamily: "var(--font-syne)", color: "#F0F0FF" }}
              >
                I Can Refer People
              </h2>
              <p className="text-sm" style={{ color: "#8888AA" }}>
                Earn money by referring qualified candidates at your company.
              </p>
            </div>
          </VouchCard>
        </div>

        {/* Both option */}
        <div className="text-center mb-8">
          <button
            onClick={handleBoth}
            className="text-sm underline-offset-4 hover:underline transition-all duration-200"
            style={{ color: "#6C63FF" }}
          >
            I want to do both →
          </button>
        </div>

        {/* Continue button */}
        <VouchButton
          variant="primary"
          size="lg"
          className="w-full"
          disabled={!selected}
          onClick={handleContinue}
        >
          Continue →
        </VouchButton>
      </div>
    </div>
  )
}