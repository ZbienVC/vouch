"use client"

import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { VouchCard, VouchButton, VouchBadge } from "@/components/ui/vouch"
import { toast } from "@/components/ui/vouch"

interface SerializedDeal {
  id: string
  status: string
  agreedPriceCents: number
  platformFeeCents: number
  referrerPayoutCents: number
  createdAt: string
  completedAt: string | null
  seekerName: string
  referrerName: string
  companyName: string
  targetRole: string | null
}

interface Props {
  deal: SerializedDeal
  isSeeker: boolean
  isReferrer: boolean
}

const timelineSteps = [
  {
    id: "created",
    label: "Deal Created",
    description: "Both parties agreed on terms",
  },
  {
    id: "paid",
    label: "Payment Received",
    description: "Funds held securely in escrow",
  },
  {
    id: "referral_submitted",
    label: "Referral Submitted",
    description: "Referrer submitted proof",
  },
  {
    id: "seeker_confirmed",
    label: "Seeker Confirmed",
    description: "Seeker confirmed contact",
  },
  {
    id: "completed",
    label: "Completed",
    description: "Funds released to referrer",
  },
]

const statusToStep: Record<string, string> = {
  pending_payment: "created",
  paid: "paid",
  referral_submitted: "referral_submitted",
  seeker_confirmed: "seeker_confirmed",
  completed: "completed",
  disputed: "referral_submitted",
  refunded: "paid",
}

function getStepState(stepId: string, dealStatus: string): "completed" | "current" | "upcoming" {
  const currentStepId = statusToStep[dealStatus] ?? "created"
  const stepIdx = timelineSteps.findIndex((s) => s.id === stepId)
  const currentIdx = timelineSteps.findIndex((s) => s.id === currentStepId)

  if (stepIdx < currentIdx) return "completed"
  if (stepIdx === currentIdx) return "current"
  return "upcoming"
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function EscrowBadge({ status }: { status: string }) {
  if (status === "completed") return <VouchBadge variant="success">Released</VouchBadge>
  if (status === "disputed") return <VouchBadge variant="error">Disputed</VouchBadge>
  if (status === "refunded") return <VouchBadge variant="warning">Refunded</VouchBadge>
  return <VouchBadge variant="warning">Held</VouchBadge>
}

export default function DealDetailClient({ deal, isSeeker, isReferrer }: Props) {
  const amountDollars = (deal.agreedPriceCents / 100).toFixed(2)
  const referrerDollars = (deal.referrerPayoutCents / 100).toFixed(2)
  const feeDollars = (deal.platformFeeCents / 100).toFixed(2)

  const handleUploadProof = () => {
    toast.info("Proof upload coming soon")
  }

  const handleConfirmContact = () => {
    toast.success("Contact confirmed!")
  }

  const handleOpenDispute = () => {
    toast.warning("Dispute flow coming soon")
  }

  const handleLeaveReview = () => {
    toast.info("Review flow coming soon")
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back link */}
      <Link
        href="/dashboard/deals"
        className="inline-flex items-center gap-2 text-sm mb-6"
        style={{ color: "var(--text-secondary)", textDecoration: "none" }}
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Deals
      </Link>

      {/* Page title */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">
          {deal.companyName} {deal.targetRole ? `· ${deal.targetRole}` : ""}
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          {deal.seekerName} &amp; {deal.referrerName} · Started {formatDate(deal.createdAt)}
        </p>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Timeline (left, 2/3) */}
        <div className="flex-1 md:flex-[2]">
          <VouchCard>
            <h2
              className="font-display font-semibold mb-6"
              style={{ fontSize: 16, color: "var(--text-primary)" }}
            >
              Deal Timeline
            </h2>
            <div className="relative">
              {timelineSteps.map((step, idx) => {
                const state = getStepState(step.id, deal.status)
                const isLast = idx === timelineSteps.length - 1

                return (
                  <div key={step.id} className="flex gap-4">
                    {/* Circle + line */}
                    <div className="flex flex-col items-center" style={{ width: 28, flexShrink: 0 }}>
                      {state === "completed" ? (
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background: "var(--success)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <CheckCircle2 size={16} color="#0A0F1C" />
                        </div>
                      ) : state === "current" ? (
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background: "var(--accent)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            boxShadow: "0 0 12px rgba(99,102,241,0.5)",
                          }}
                          className="animate-pulse"
                        >
                          <div
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              background: "white",
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            border: "2px solid var(--border)",
                            background: "var(--surface)",
                            flexShrink: 0,
                          }}
                        />
                      )}
                      {!isLast && (
                        <div
                          style={{
                            flex: 1,
                            width: 2,
                            marginTop: 4,
                            marginBottom: 4,
                            background:
                              state === "completed"
                                ? "var(--success)"
                                : "var(--border)",
                            borderRadius: 1,
                            minHeight: 32,
                            ...(state !== "completed" && {
                              backgroundImage:
                                "repeating-linear-gradient(to bottom, var(--border) 0, var(--border) 4px, transparent 4px, transparent 8px)",
                              backgroundSize: "2px 8px",
                              background: "none",
                            }),
                          }}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="pb-6 flex-1 min-w-0">
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color:
                            state === "completed"
                              ? "var(--success)"
                              : state === "current"
                                ? "var(--text-primary)"
                                : "var(--text-muted)",
                          marginBottom: 2,
                        }}
                      >
                        {step.label}
                      </p>
                      <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                        {step.description}
                      </p>
                      {state === "completed" && step.id === "created" && (
                        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                          {formatDate(deal.createdAt)}
                        </p>
                      )}
                      {state === "completed" && step.id === "completed" && deal.completedAt && (
                        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                          {formatDate(deal.completedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Action buttons */}
            {deal.status === "paid" && isReferrer && (
              <div className="mt-2">
                <VouchButton variant="primary" onClick={handleUploadProof}>
                  Upload Referral Proof
                </VouchButton>
              </div>
            )}
            {deal.status === "referral_submitted" && isSeeker && (
              <div className="mt-2 flex gap-3">
                <VouchButton variant="primary" onClick={handleConfirmContact}>
                  Confirm I Was Contacted
                </VouchButton>
                <VouchButton variant="ghost" onClick={handleOpenDispute}>
                  <span style={{ color: "var(--error)" }}>Open Dispute</span>
                </VouchButton>
              </div>
            )}
            {deal.status === "completed" && (
              <div className="mt-2">
                <VouchButton variant="secondary" onClick={handleLeaveReview}>
                  Leave a Review
                </VouchButton>
              </div>
            )}
          </VouchCard>
        </div>

        {/* Escrow widget (right, 1/3) */}
        <div className="md:w-80 shrink-0">
          <VouchCard elevated>
            <h2
              className="font-display font-semibold mb-4"
              style={{ fontSize: 16, color: "var(--text-primary)" }}
            >
              Escrow Status
            </h2>

            <p
              className="font-display font-bold mb-1"
              style={{ fontSize: 32, color: "var(--accent)" }}
            >
              ${amountDollars}
            </p>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
              Amount held in escrow
            </p>

            <div
              className="rounded-lg p-4 mb-4 flex flex-col gap-2"
              style={{ background: "var(--surface-high)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  Referrer receives
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                  ${referrerDollars}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Vouch fee</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                  ${feeDollars}
                </span>
              </div>
            </div>

            <p
              className="mb-4"
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                background: "rgba(99,102,241,0.06)",
                borderRadius: 8,
                padding: "8px 12px",
                border: "1px solid rgba(99,102,241,0.12)",
              }}
            >
              Releases when both parties confirm
            </p>

            <div className="flex items-center justify-between">
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Status</span>
              <EscrowBadge status={deal.status} />
            </div>
          </VouchCard>
        </div>
      </div>
    </div>
  )
}