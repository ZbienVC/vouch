import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import DealDetailClient from "./DealDetailClient"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function DealPage({ params }: PageProps) {
  const { id } = await params
  const { userId } = await auth()

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
        <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">Not authenticated</h2>
        <Link href="/sign-in" className="text-[var(--accent)] underline">Sign in</Link>
      </div>
    )
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, userType: true, fullName: true },
  })

  const deal = await prisma.deal.findUnique({
    where: { id },
    include: {
      seeker: { select: { id: true, fullName: true, avatarUrl: true } },
      referrer: { select: { id: true, fullName: true, avatarUrl: true } },
      listing: { select: { companyName: true, roleTypes: true } },
      request: { select: { targetRole: true, targetCompany: true } },
    },
  })

  if (!deal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(99,102,241,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
            <path
              d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8"
              stroke="var(--text-muted)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">Deal not found</h2>
        <p className="text-[var(--text-secondary)] max-w-sm">
          This deal may have been removed or you may not have access to it.
        </p>
        <Link
          href="/dashboard/deals"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
          style={{
            background: "var(--surface-raised)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            textDecoration: "none",
          }}
        >
          ← Back to Deals
        </Link>
      </div>
    )
  }

  const isSeeker = dbUser?.id === deal.seekerId
  const isReferrer = dbUser?.id === deal.referrerId

  const serializedDeal = {
    id: deal.id,
    status: deal.status,
    agreedPriceCents: deal.agreedPriceCents,
    platformFeeCents: deal.platformFeeCents,
    referrerPayoutCents: deal.referrerPayoutCents,
    createdAt: deal.createdAt.toISOString(),
    completedAt: deal.completedAt?.toISOString() ?? null,
    seekerName: deal.seeker?.fullName ?? "Seeker",
    referrerName: deal.referrer?.fullName ?? "Referrer",
    companyName: deal.listing?.companyName ?? deal.request?.targetCompany ?? "Company",
    targetRole: deal.listing?.roleTypes?.[0] ?? deal.request?.targetRole ?? null,
  }

  return <DealDetailClient deal={serializedDeal} isSeeker={isSeeker} isReferrer={isReferrer} />
}