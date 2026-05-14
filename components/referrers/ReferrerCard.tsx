"use client"

import Link from "next/link"
import { Star, Clock, BadgeCheck } from "lucide-react"
import { VouchAvatar, VouchBadge } from "@/components/ui/vouch"

export interface ReferrerCardData {
  id: string
  firstName: string
  lastInitial: string
  company: string
  jobTitle: string
  priceCents: number
  avgRating: number | null
  totalReferrals: number
  isVerified: boolean
  avatarUrl: string | null
  responseTime?: string
  isAvailable?: boolean
  roleTypes?: string[]
}

interface ReferrerCardProps {
  data: ReferrerCardData
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <div className="flex items-center gap-1.5">
      <span className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={12}
            className={
              i < full
                ? "text-[#FFB547] fill-[#FFB547]"
                : i === full && half
                  ? "text-[#FFB547] fill-[#FFB547]/50"
                  : "fill-transparent"
            }
            style={{ color: i < full || (i === full && half) ? "#FFB547" : "var(--border)" }}
          />
        ))}
      </span>
      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
        {rating.toFixed(1)} ({count})
      </span>
    </div>
  )
}

export default function ReferrerCard({ data }: ReferrerCardProps) {
  const displayName = `${data.firstName} ${data.lastInitial}.`
  const priceDisplay = `From $${Math.floor(data.priceCents / 100)}`
  const available = data.isAvailable !== false

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    card.style.transform = "translateY(-4px)"
    card.style.boxShadow = "0 8px 32px rgba(99,102,241,0.15)"
    card.style.borderColor = "rgba(99,102,241,0.4)"
    const cta = card.querySelector<HTMLDivElement>("[data-cta]")
    if (cta) {
      cta.style.opacity = "1"
      cta.style.transform = "translateY(0)"
    }
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    card.style.transform = ""
    card.style.boxShadow = ""
    card.style.borderColor = "var(--border)"
    const cta = card.querySelector<HTMLDivElement>("[data-cta]")
    if (cta) {
      cta.style.opacity = "0"
      cta.style.transform = "translateY(8px)"
    }
  }

  return (
    <div
      className="relative overflow-hidden flex flex-col"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "20px",
        paddingBottom: "60px",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        minHeight: 200,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* TOP SECTION */}
      <div className="flex items-start gap-3 mb-4">
        <VouchAvatar src={data.avatarUrl ?? undefined} name={displayName} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
              }}
            >
              {displayName}
            </span>
            {data.isVerified && (
              <BadgeCheck size={14} color="var(--accent)" aria-label="Verified" />
            )}
          </div>
          <p
            className="truncate"
            style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}
          >
            {data.jobTitle}
            {data.company ? ` · ${data.company}` : ""}
          </p>
        </div>
        {/* Availability */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: available ? "var(--success)" : "var(--warning)",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: available ? "var(--success)" : "var(--warning)",
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            {available ? "Available" : "Busy"}
          </span>
        </div>
      </div>

      {/* MIDDLE SECTION */}
      <div className="flex flex-col gap-2 mb-4">
        {data.responseTime && (
          <div
            className="flex items-center gap-1.5 w-fit"
            style={{
              background: "var(--surface-raised)",
              borderRadius: 999,
              padding: "3px 10px",
            }}
          >
            <Clock size={11} color="var(--text-muted)" />
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              {data.responseTime} response
            </span>
          </div>
        )}

        {data.avgRating !== null && data.avgRating !== undefined ? (
          <StarRating rating={data.avgRating} count={data.totalReferrals} />
        ) : (
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {data.totalReferrals} referrals · No reviews yet
          </span>
        )}

        {data.roleTypes && data.roleTypes.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {data.roleTypes.slice(0, 3).map((role) => (
              <VouchBadge key={role} variant="default" className="text-[10px] px-2 py-0.5">
                {role}
              </VouchBadge>
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM price */}
      <div className="mt-auto">
        <span
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "var(--accent)",
          }}
        >
          {priceDisplay}
        </span>
      </div>

      {/* CTA Button - slides up on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 px-5 pb-4"
        style={{
          background: "linear-gradient(to top, var(--surface) 60%, transparent)",
          paddingTop: 16,
        }}
      >
        <Link href={`/referrer/${data.id}`}>
          <div
            data-cta
            className="w-full flex items-center justify-center font-medium text-sm text-white"
            style={{
              height: 36,
              background: "linear-gradient(135deg, #6366F1, #4F46E5)",
              borderRadius: 8,
              opacity: 0,
              transform: "translateY(8px)",
              transition: "opacity 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.2s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            Request Referral
          </div>
        </Link>
      </div>
    </div>
  )
}