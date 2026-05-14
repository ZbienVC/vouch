"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { FileText, Search, User } from "lucide-react"
import { Suspense } from "react"

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get("name") || "there"
  const [countdown, setCountdown] = useState(5)
  const [showCards, setShowCards] = useState(false)
  const confettiFired = useRef(false)

  useEffect(() => {
    // Fire confetti
    if (!confettiFired.current) {
      confettiFired.current = true
      import("canvas-confetti").then((mod) => {
        const confetti = mod.default
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.4 },
          colors: ["#6366F1", "#2DD4BF", "#818CF8", "#F1F5F9", "#F59E0B"],
        })
        setTimeout(() => {
          confetti({
            particleCount: 60,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.5 },
            colors: ["#6366F1", "#2DD4BF"],
          })
          confetti({
            particleCount: 60,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.5 },
            colors: ["#6366F1", "#2DD4BF"],
          })
        }, 300)
      })
    }

    // Show action cards after checkmark animation
    const cardsTimer = setTimeout(() => setShowCards(true), 1200)

    // Countdown + redirect
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          router.push("/dashboard")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearTimeout(cardsTimer)
      clearInterval(interval)
    }
  }, [router])

  const actionCards = [
    {
      label: "Post your first request",
      href: "/dashboard/requests/new",
      icon: FileText,
      description: "Tell referrers what role you\u2019re looking for",
    },
    {
      label: "Browse referrers",
      href: "/dashboard/browse",
      icon: Search,
      description: "Find insiders at top companies",
    },
    {
      label: "Complete your profile",
      href: "/dashboard/settings",
      icon: User,
      description: "A strong profile gets better referrals",
    },
  ]

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--page-bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Orb backgrounds */}
      <div className="orb-purple" style={{ opacity: 0.4 }} />
      <div className="orb-teal" style={{ opacity: 0.3 }} />

      <div
        style={{
          maxWidth: 520,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Animated checkmark */}
        <div style={{ marginBottom: 8 }}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="var(--success)"
              strokeWidth="3"
              style={{
                strokeDasharray: 226,
                strokeDashoffset: 226,
                animation: "draw-circle 0.6s ease forwards",
              }}
            />
            <path
              d="M24 40 L36 52 L56 30"
              fill="none"
              stroke="var(--success)"
              strokeWidth="3"
              strokeLinecap="round"
              style={{
                strokeDasharray: 40,
                strokeDashoffset: 40,
                animation: "draw-check 0.4s ease 0.5s forwards",
              }}
            />
          </svg>
        </div>

        {/* Headline */}
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "var(--font-syne)",
              fontSize: 36,
              fontWeight: 700,
              color: "var(--text-primary)",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            You&apos;re in, {name}!
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: 16,
              marginTop: 8,
              margin: "8px 0 0",
            }}
          >
            Welcome to Vouch. Let&apos;s get you referred.
          </p>
        </div>

        {/* Action cards */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginTop: 8,
          }}
        >
          {actionCards.map((card, i) => {
            const Icon = card.icon
            return (
              <Link
                key={card.href}
                href={card.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 20px",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  textDecoration: "none",
                  opacity: showCards ? 1 : 0,
                  transform: showCards ? "translateY(0)" : "translateY(12px)",
                  transition: `opacity 0.4s ease ${i * 0.1 + 0.1}s, transform 0.4s ease ${i * 0.1 + 0.1}s`,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = "rgba(99,102,241,0.4)"
                  el.style.background = "var(--surface-raised)"
                  el.style.transform = "translateY(-2px)"
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = "var(--border)"
                  el.style.background = "var(--surface)"
                  el.style.transform = "translateY(0)"
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "rgba(99,102,241,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} color="var(--accent)" />
                </div>
                <div>
                  <p
                    style={{
                      color: "var(--text-primary)",
                      fontSize: 14,
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    {card.label}
                  </p>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: 12,
                      margin: "2px 0 0",
                    }}
                  >
                    {card.description}
                  </p>
                </div>
                <div style={{ marginLeft: "auto", color: "var(--text-muted)" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M6 3l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Countdown */}
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: 13,
            marginTop: 8,
            opacity: showCards ? 1 : 0,
            transition: "opacity 0.4s ease 0.5s",
          }}
        >
          Redirecting to dashboard in{" "}
          <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
            {countdown}s
          </span>
          {" · "}
          <Link
            href="/dashboard"
            style={{ color: "var(--accent)", textDecoration: "underline" }}
          >
            Go now
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function OnboardingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: "var(--page-bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      }
    >
      <SuccessContent />
    </Suspense>
  )
}