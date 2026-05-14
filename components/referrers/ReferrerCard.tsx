"use client"

import Link from "next/link"
import { Star } from "lucide-react"
import { VouchCard, VouchAvatar, VouchBadge, VouchButton } from "@/components/ui/vouch"

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
}

interface ReferrerCardProps {
  data: ReferrerCardData
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const partial = rating - full
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={
            i < full
              ? "text-[#FFB547] fill-[#FFB547]"
              : i === full && partial >= 0.5
                ? "text-[#FFB547] fill-[#FFB547]/50"
                : "text-[var(--border)] fill-transparent"
          }
        />
      ))}
    </span>
  )
}

export default function ReferrerCard({ data }: ReferrerCardProps) {
  const displayName = `${data.firstName} ${data.lastInitial}.`
  const price = `$${Math.floor(data.priceCents / 100)}`

  return (
    <VouchCard
      className="flex flex-col gap-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(108,99,255,0.2)]"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <VouchAvatar
          src={data.avatarUrl ?? undefined}
          name={displayName}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-[var(--text-primary)] text-sm truncate">
            {displayName}
          </p>
          <p className="text-xs text-[var(--text-secondary)] truncate">{data.jobTitle}</p>
          <p className="text-xs text-[var(--accent)] font-medium truncate">{data.company}</p>
        </div>
      </div>

      {/* Middle */}
      <div className="flex items-center justify-between">
        <VouchBadge variant="purple">{price} per referral</VouchBadge>
        <div className="flex items-center gap-1.5">
          {data.avgRating !== null ? (
            <>
              <StarRating rating={data.avgRating} />
              <span className="text-xs text-[var(--text-secondary)]">
                ({data.totalReferrals})
              </span>
            </>
          ) : (
            <span className="text-xs text-[var(--text-secondary)]">
              {data.totalReferrals} referrals
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div>
          {data.isVerified && (
            <VouchBadge variant="success">✓ Verified</VouchBadge>
          )}
        </div>
        <Link href={`/referrer/${data.id}`}>
          <VouchButton variant="secondary" size="sm">
            View Profile
          </VouchButton>
        </Link>
      </div>
    </VouchCard>
  )
}