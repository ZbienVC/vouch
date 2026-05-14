"use client"

import Link from "next/link"
import { FileText, Clock, CheckCircle, GitMerge, Inbox } from "lucide-react"
import { VouchCard, VouchButton, VouchSkeleton } from "@/components/ui/vouch"
import ReferrerCard, { type ReferrerCardData } from "@/components/referrers/ReferrerCard"

interface ActivityItem {
  id: string
  icon: "deal" | "complete" | "message"
  description: string
  timeAgo: string
}

interface SeekerDashboardProps {
  firstName: string
  stats: {
    activeRequests: number
    inProgress: number
    completed: number
  }
  topListings: ReferrerCardData[]
  recentActivity: ActivityItem[]
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export default function SeekerDashboard({
  firstName,
  stats,
  topListings,
  recentActivity,
}: SeekerDashboardProps) {
  const greeting = getGreeting()

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">
          {greeting}, {firstName} 👋
        </h1>
        <p className="mt-1 text-[var(--text-secondary)]">
          {"Here's what's happening with your referral search."}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <VouchCard className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
            <FileText size={22} className="text-[var(--accent)]" />
          </div>
          <div>
            <p className="text-3xl font-bold font-display text-[var(--text-primary)]">
              {stats.activeRequests}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">Active Requests</p>
          </div>
        </VouchCard>

        <VouchCard className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FFB547]/10 flex items-center justify-center shrink-0">
            <Clock size={22} className="text-[#FFB547]" />
          </div>
          <div>
            <p className="text-3xl font-bold font-display text-[var(--text-primary)]">
              {stats.inProgress}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">In Progress</p>
          </div>
        </VouchCard>

        <VouchCard className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#00D4AA]/10 flex items-center justify-center shrink-0">
            <CheckCircle size={22} className="text-[#00D4AA]" />
          </div>
          <div>
            <p className="text-3xl font-bold font-display text-[var(--text-primary)]">
              {stats.completed}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">Completed</p>
          </div>
        </VouchCard>
      </div>

      {/* Post Request CTA */}
      <div
        className="relative rounded-xl overflow-hidden p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{
          background: "linear-gradient(135deg, #6C63FF15 0%, #00D4AA10 100%)",
          border: "1px solid #6C63FF30",
          boxShadow: "0 0 40px rgba(108,99,255,0.08)",
        }}
      >
        <div>
          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
            Ready to find your referral?
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Post a request and get matched with verified referrers at top companies.
          </p>
        </div>
        <Link href="/dashboard/requests/new" className="shrink-0">
          <VouchButton variant="primary" size="md">
            Post a Request →
          </VouchButton>
        </Link>
      </div>

      {/* Top Referrers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
            Top Referrers
          </h2>
          <Link
            href="/dashboard/browse"
            className="text-sm text-[var(--accent)] hover:underline"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topListings.length > 0
            ? topListings.map((listing) => (
                <ReferrerCard key={listing.id} data={listing} />
              ))
            : Array.from({ length: 3 }).map((_, i) => (
                <VouchCard key={i} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <VouchSkeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <VouchSkeleton className="h-4 w-28" />
                      <VouchSkeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <VouchSkeleton className="h-3 w-full" />
                  <VouchSkeleton className="h-3 w-3/4" />
                  <VouchSkeleton className="h-8 w-full rounded-lg" />
                </VouchCard>
              ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
          Recent Activity
        </h2>

        {recentActivity.length === 0 ? (
          <VouchCard className="flex flex-col items-center justify-center py-12 text-center">
            <Inbox size={40} className="text-[var(--text-secondary)] mb-3" />
            <p className="text-[var(--text-secondary)]">
              No activity yet. Post your first request to get started.
            </p>
            <Link href="/dashboard/requests/new" className="mt-4">
              <VouchButton variant="secondary" size="sm">
                Post a Request
              </VouchButton>
            </Link>
          </VouchCard>
        ) : (
          <VouchCard className="divide-y divide-[var(--border)]">
            {recentActivity.map((item) => {
              const Icon = item.icon === "complete"
                ? CheckCircle
                : item.icon === "deal"
                  ? GitMerge
                  : FileText
              const iconColor = item.icon === "complete"
                ? "text-[#00D4AA]"
                : item.icon === "deal"
                  ? "text-[var(--accent)]"
                  : "text-[#FFB547]"

              return (
                <div key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <div className={`mt-0.5 ${iconColor}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--text-primary)]">{item.description}</p>
                  </div>
                  <span className="text-xs text-[var(--text-secondary)] shrink-0">{item.timeAgo}</span>
                </div>
              )
            })}
          </VouchCard>
        )}
      </div>
    </div>
  )
}