"use client"

import Link from "next/link"
import {
  List,
  Clock,
  CheckCircle,
  TrendingUp,
  Inbox,
  GitMerge,
  FileText,
  ArrowUpRight,
} from "lucide-react"
import { VouchCard, VouchButton, VouchBadge, VouchAvatar } from "@/components/ui/vouch"

interface ActivityItem {
  id: string
  icon: "deal" | "complete" | "message"
  description: string
  timeAgo: string
}

interface ReferrerStats {
  activeListings: number
  inProgressDeals: number
  completedReferrals: number
  successRate: number
}

interface MockRequest {
  id: string
  initials: string
  yearsExperience: number
  targetRole: string
  budgetCents: number
  postedAgo: string
  company: string
  industry: string
}

const mockOpenRequests: MockRequest[] = [
  {
    id: "mock-req-1",
    initials: "JD",
    yearsExperience: 4,
    targetRole: "Software Engineer",
    budgetCents: 30000,
    postedAgo: "2 hours ago",
    company: "Google",
    industry: "Technology",
  },
  {
    id: "mock-req-2",
    initials: "SK",
    yearsExperience: 6,
    targetRole: "Product Manager",
    budgetCents: 40000,
    postedAgo: "5 hours ago",
    company: "Meta",
    industry: "Technology",
  },
  {
    id: "mock-req-3",
    initials: "AM",
    yearsExperience: 2,
    targetRole: "Data Analyst",
    budgetCents: 25000,
    postedAgo: "1 day ago",
    company: "Stripe",
    industry: "Fintech",
  },
]

const avatarColors = [
  "bg-[#6C63FF]",
  "bg-[#00D4AA]",
  "bg-[#FFB547]",
  "bg-[#FF4D6A]",
  "bg-[#00BFFF]",
]

function getInitialsColor(initials: string): string {
  const idx = initials.charCodeAt(0) % avatarColors.length
  return avatarColors[idx]
}

interface ReferrerDashboardProps {
  firstName: string
  stats: ReferrerStats
  recentActivity: ActivityItem[]
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export default function ReferrerDashboard({
  firstName,
  stats,
  recentActivity,
}: ReferrerDashboardProps) {
  const greeting = getGreeting()

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">
          {greeting}, {firstName} 👋
        </h1>
        <p className="mt-1 text-[var(--text-secondary)]">
          {"Here's your referrer overview."}
        </p>
      </div>

      {/* Earnings Summary Card */}
      <div
        className="relative rounded-xl overflow-hidden p-6"
        style={{
          background: "linear-gradient(135deg, #6C63FF20 0%, #00D4AA10 100%)",
          border: "1px solid #6C63FF30",
          boxShadow: "0 0 60px rgba(108,99,255,0.12)",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-sm text-[var(--text-secondary)] mb-1">Total Earned</p>
              <p className="font-display text-4xl font-bold text-[var(--text-primary)]">
                $0.00
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)] mb-1">Pending (Escrow)</p>
              <p className="font-display text-2xl font-semibold text-[#FFB547]">$0.00</p>
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)] mb-1">Available to Withdraw</p>
              <p className="font-display text-2xl font-semibold text-[#00D4AA]">$0.00</p>
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)] mb-1">This Month</p>
              <div className="flex items-center gap-1.5">
                <p className="font-display text-2xl font-semibold text-[var(--text-primary)]">$0.00</p>
                <ArrowUpRight size={16} className="text-[#00D4AA]" />
              </div>
            </div>
          </div>
          <div className="shrink-0">
            <Link href="/dashboard/earnings">
              <VouchButton variant="secondary" size="md" disabled>
                Withdraw
              </VouchButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <VouchCard className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
            <List size={22} className="text-[var(--accent)]" />
          </div>
          <div>
            <p className="text-3xl font-bold font-display text-[var(--text-primary)]">
              {stats.activeListings}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">Active Listings</p>
          </div>
        </VouchCard>

        <VouchCard className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FFB547]/10 flex items-center justify-center shrink-0">
            <Clock size={22} className="text-[#FFB547]" />
          </div>
          <div>
            <p className="text-3xl font-bold font-display text-[var(--text-primary)]">
              {stats.inProgressDeals}
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
              {stats.completedReferrals}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">Completed</p>
          </div>
        </VouchCard>

        <VouchCard className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
            <TrendingUp size={22} className="text-[var(--accent)]" />
          </div>
          <div>
            <p className="text-3xl font-bold font-display text-[var(--text-primary)]">
              {stats.successRate}%
            </p>
            <p className="text-sm text-[var(--text-secondary)]">Success Rate</p>
          </div>
        </VouchCard>
      </div>

      {/* Create Listing CTA */}
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
            Start earning by referring great candidates
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Create a listing and get matched with seekers at your company.
          </p>
        </div>
        <Link href="/dashboard/listings/new" className="shrink-0">
          <VouchButton variant="primary" size="md">
            Create a Listing →
          </VouchButton>
        </Link>
      </div>

      {/* Open Requests Near You */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
            Open Requests Near You
          </h2>
          <Link
            href="/dashboard/browse-requests"
            className="text-sm text-[var(--accent)] hover:underline"
          >
            Browse All →
          </Link>
        </div>

        <div className="space-y-3">
          {mockOpenRequests.map((req) => (
            <VouchCard key={req.id} className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${getInitialsColor(req.initials)}`}
              >
                <span className="font-display font-bold text-white text-sm">
                  {req.initials}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  Looking for referral at{" "}
                  <span className="text-[var(--accent)]">{req.company}</span>
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {req.targetRole} · {req.yearsExperience} yrs exp · Posted {req.postedAgo}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <VouchBadge variant="success">
                  ${Math.floor(req.budgetCents / 100)} budget
                </VouchBadge>
                <Link href="/dashboard/browse-requests">
                  <VouchButton variant="secondary" size="sm">
                    View Request
                  </VouchButton>
                </Link>
              </div>
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
              No activity yet. Create your first listing to get started.
            </p>
            <Link href="/dashboard/listings/new" className="mt-4">
              <VouchButton variant="secondary" size="sm">
                Create a Listing
              </VouchButton>
            </Link>
          </VouchCard>
        ) : (
          <VouchCard className="divide-y divide-[var(--border)]">
            {recentActivity.map((item) => {
              const Icon =
                item.icon === "complete"
                  ? CheckCircle
                  : item.icon === "deal"
                    ? GitMerge
                    : FileText
              const iconColor =
                item.icon === "complete"
                  ? "text-[#00D4AA]"
                  : item.icon === "deal"
                    ? "text-[var(--accent)]"
                    : "text-[#FFB547]"

              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className={`mt-0.5 ${iconColor}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--text-primary)]">{item.description}</p>
                  </div>
                  <span className="text-xs text-[var(--text-secondary)] shrink-0">
                    {item.timeAgo}
                  </span>
                </div>
              )
            })}
          </VouchCard>
        )}
      </div>
    </div>
  )
}