"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Users, Check } from "lucide-react"
import { VouchButton } from "@/components/ui/vouch"
import { useOnboardingStore } from "@/lib/onboarding-store"

type Role = "seeker" | "referrer" | "both"

const STEP_COUNT = 3
const CURRENT_STEP = 1

export default function OnboardingRolePage() {
  const router = useRouter()
  const { setUserType } = useOnboardingStore()
  const [selected, setSelected] = useState<Role | null>(null)

  // Task 15: Animated progress bar
  const progressPct = Math.round(((CURRENT_STEP - 1) / STEP_COUNT) * 100) + 33
  const [barWidth, setBarWidth] = useState(0)
  useEffect(() => {
    const timer = setTimeout(() => setBarWidth(progressPct), 100)
    return () => clearTimeout(timer)
  }, [progressPct])

  const handleContinue = () => {
    if (!selected) return
    setUserType(selected)
    router.push("/onboarding/profile")
  }

  const handleBoth = () => {
    setUserType("both")
    router.push("/onboarding/profile")
  }

  const cards = [
    {
      role: "seeker" as Role,
      Icon: Search,
      title: "I'm Looking for a Referral",
      desc: "Find employees at your target companies who can refer you directly.",
    },
    {
      role: "referrer" as Role,
      Icon: Users,
      title: "I Can Refer People",
      desc: "Earn money by referring qualified candidates at your company.",
    },
  ]

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <div className="w-full max-w-[640px]">
        {/* Task 15: Progress bar */}
        <div className="w-full max-w-[640px] mb-4 mt-4">
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Step {CURRENT_STEP} of {STEP_COUNT}</span>
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-accent)" }}>{barWidth}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${barWidth}%` }} />
          </div>
        </div>

        {/* Task 2: Card wrapper */}
        <div
          style={{
            background: "var(--bg-surface)",
            border: "0.5px solid var(--border-subtle)",
            borderRadius: "14px",
            padding: "32px",
            marginTop: "16px",
          }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <span
              className="font-display text-3xl font-bold tracking-[0.2em] uppercase"
              style={{ color: "var(--accent)", fontFamily: "var(--font-syne)" }}
            >
              VOUCH
            </span>
          </div>

          {/* Headline */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ fontFamily: "var(--font-syne)", color: "var(--text-primary)" }}
            >
              How will you use Vouch?
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              You can always add the other role later from your settings.
            </p>
          </div>

          {/* Role cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {cards.map(({ role, Icon, title, desc }, idx) => {
              const isSelected = selected === role
              const otherSelected = selected !== null && selected !== role && selected !== "both"
              return (
                <div
                  key={role}
                  className="group relative cursor-pointer min-h-[200px] flex flex-col items-start gap-4 p-6 rounded-xl border"
                  style={{
                    background: isSelected ? "rgba(99,102,241,0.08)" : "var(--bg-elevated)",
                    borderColor: isSelected ? "var(--accent)" : "var(--border-subtle)",
                    boxShadow: isSelected ? "0 0 24px rgba(99,102,241,0.2)" : "none",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    opacity: otherSelected ? 0.6 : 1,
                    animationDelay: `${idx * 100}ms`,
                    animation: "fade-up 0.4s ease forwards",
                  }}
                  onClick={() => setSelected(role)}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.transform = "scale(1.02)"
                      e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.transform = ""
                      e.currentTarget.style.borderColor = isSelected ? "var(--accent)" : "var(--border-subtle)"
                    }
                  }}
                >
                  {isSelected && (
                    <div
                      className="absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "var(--accent)" }}
                    >
                      <Check size={12} color="white" />
                    </div>
                  )}
                  <div
                    className="transition-all duration-200"
                    style={{ color: isSelected ? "var(--accent)" : "var(--text-secondary)" }}
                  >
                    <Icon
                      size={48}
                      style={{
                        transform: "scale(1)",
                        transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    />
                  </div>
                  <div>
                    <h2
                      className="text-xl font-semibold mb-2"
                      style={{ fontFamily: "var(--font-syne)", color: "var(--text-primary)" }}
                    >
                      {title}
                    </h2>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Both option */}
          <div className="text-center mb-8">
            <button
              onClick={handleBoth}
              className="text-sm underline-offset-4 hover:underline transition-all duration-200"
              style={{ color: "var(--accent)" }}
            >
              I want to do both →
            </button>
          </div>

          {/* Continue button */}
          <div style={{ opacity: selected ? 1 : 0.5, transition: "opacity 0.2s ease" }}>
            <VouchButton
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!selected}
              onClick={handleContinue}
              style={{ cursor: selected ? "pointer" : "not-allowed" }}
            >
              Continue →
            </VouchButton>
          </div>
        </div>
      </div>
    </div>
  )
}
