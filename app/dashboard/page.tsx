import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import SeekerDashboard from "@/components/dashboard/SeekerDashboard"
import type { ReferrerCardData } from "@/components/referrers/ReferrerCard"

interface ActivityItem {
  id: string
  icon: "deal" | "complete" | "message"
  description: string
  timeAgo: string
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      seekerProfile: true,
      referrerProfile: true,
    },
  })

  if (!user || !user.userType) {
    redirect("/onboarding/role")
  }

  if (user.userType === "referrer") {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-3">
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">
            Referrer Dashboard
          </h2>
          <p className="text-[var(--text-secondary)]">Phase 4 — Coming soon</p>
        </div>
      </div>
    )
  }

  if (!user.seekerProfile) {
    redirect("/onboarding/role")
  }

  const [activeRequests, inProgressDeals, completedDeals, recentDeals] = await Promise.all([
    prisma.request.count({
      where: {
        seekerId: user.seekerProfile.id,
        status: "open",
      },
    }),
    prisma.deal.count({
      where: {
        seekerId: user.id,
        status: { in: ["paid", "referral_submitted"] },
      },
    }),
    prisma.deal.count({
      where: {
        seekerId: user.id,
        status: "completed",
      },
    }),
    prisma.deal.findMany({
      where: { seekerId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        referrer: { select: { fullName: true } },
      },
    }),
  ])

  const topListingsRaw = await prisma.listing.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: {
      referrer: {
        include: {
          user: {
            select: { fullName: true, avatarUrl: true },
          },
        },
      },
    },
  })

  const topListings: ReferrerCardData[] = topListingsRaw.map((l) => {
    const fullName = l.referrer.user.fullName ?? "Unknown"
    const parts = fullName.trim().split(/\s+/)
    const firstName = parts[0] ?? "Unknown"
    const lastInitial = parts.length > 1 ? parts[parts.length - 1].charAt(0) : ""
    return {
      id: l.referrer.id,
      firstName,
      lastInitial,
      company: l.companyName,
      jobTitle: l.referrer.jobTitle ?? "",
      priceCents: l.priceCents,
      avgRating: l.referrer.avgRating ? Number(l.referrer.avgRating) : null,
      totalReferrals: l.referrer.totalReferrals,
      isVerified: l.referrer.workEmailVerified,
      avatarUrl: l.referrer.user.avatarUrl,
    }
  })

  const recentActivity: ActivityItem[] = recentDeals.map((deal) => ({
    id: deal.id,
    icon:
      deal.status === "completed"
        ? "complete"
        : deal.status === "paid" || deal.status === "referral_submitted"
          ? "deal"
          : "message",
    description:
      deal.status === "completed"
        ? `Referral with ${deal.referrer.fullName ?? "a referrer"} completed`
        : deal.status === "paid"
          ? `Deal with ${deal.referrer.fullName ?? "a referrer"} payment confirmed`
          : deal.status === "referral_submitted"
            ? `${deal.referrer.fullName ?? "Referrer"} submitted your referral`
            : `New deal started with ${deal.referrer.fullName ?? "a referrer"}`,
    timeAgo: timeAgo(deal.createdAt),
  }))

  const firstName =
    (user.fullName ?? user.email).trim().split(/\s+/)[0] ?? "there"

  return (
    <SeekerDashboard
      firstName={firstName}
      stats={{ activeRequests, inProgress: inProgressDeals, completed: completedDeals }}
      topListings={topListings}
      recentActivity={recentActivity}
    />
  )
}