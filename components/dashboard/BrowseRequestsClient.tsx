"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import {
  VouchCard,
  VouchButton,
  VouchBadge,
  VouchInput,
} from "@/components/ui/vouch"
import { toast } from "@/components/ui/vouch"
import type { MockRequest } from "@/app/api/requests/route"

const AVATAR_COLORS = [
  "#6C63FF",
  "#00D4AA",
  "#FFB547",
  "#FF4D6A",
  "#00BFFF",
  "#FF6B35",
  "#9B59B6",
]

function getAvatarColor(initials: string): string {
  const idx = initials.charCodeAt(0) % AVATAR_COLORS.length
  return AVATAR_COLORS[idx]
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const INDUSTRY_OPTIONS = [
  "Technology",
  "Fintech",
  "Healthcare",
  "Finance",
  "Media",
  "E-Commerce",
  "Education",
  "Other",
]

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "highest_budget", label: "Highest Budget" },
  { value: "best_match", label: "Best Match" },
]

interface RequestDetailModalProps {
  request: MockRequest
  onClose: () => void
}

function RequestDetailModal({ request, onClose }: RequestDetailModalProps) {
  const router = useRouter()
  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const receivedAmount = Math.floor((request.budgetCents / 100) * 0.9)
  const budgetDollars = Math.floor(request.budgetCents / 100)

  const handleAccept = async () => {
    if (!confirmed) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/deals/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: request.id,
          agreedPriceCents: request.budgetCents,
        }),
      })
      if (!res.ok) {
        const err = await res.json() as { error?: string }
        throw new Error(err.error ?? "Failed to create deal")
      }
      const data = await res.json() as { dealId: string }
      toast("Deal accepted! Redirecting...", "success")
      onClose()
      router.push(`/deals/${data.dealId}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong"
      toast(msg, "error")
    } finally {
      setSubmitting(false)
    }
  }

  const companyLabel = request.targetCompany ?? request.targetIndustry ?? "this company"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6 shadow-2xl"
        style={{ boxShadow: "0 0 80px rgba(108,99,255,0.15)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
              {request.targetCompany
                ? `Referral at ${request.targetCompany}`
                : `Open Referral — ${request.targetIndustry}`}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {request.targetRole} · {request.yearsExperience} years experience
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-[var(--text-secondary)]">Description</p>
          <p className="text-sm text-[var(--text-primary)]">{request.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {request.roleTypes.map((rt) => (
            <VouchBadge key={rt} variant="purple">
              {rt}
            </VouchBadge>
          ))}
          <VouchBadge variant="success">${budgetDollars} budget</VouchBadge>
        </div>

        {/* Resume section */}
        <div
          className="rounded-lg border border-[var(--border)] border-dashed p-4 flex items-center justify-center"
          style={{ background: "rgba(108,99,255,0.03)" }}
        >
          <p className="text-sm text-[var(--text-secondary)] text-center">
            📄 Resume available after deal accepted
          </p>
        </div>

        {/* Confirmation checkbox */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#6C63FF] shrink-0"
          />
          <span className="text-sm text-[var(--text-primary)]">
            I confirm I work at{" "}
            <span className="font-medium text-[var(--accent)]">{companyLabel}</span> and
            can submit a referral within 5 business days.
          </span>
        </label>

        {/* Price section */}
        <div
          className="rounded-lg p-4 space-y-2"
          style={{
            background: "linear-gradient(135deg, #6C63FF10 0%, #00D4AA08 100%)",
            border: "1px solid #6C63FF20",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">Seeker&apos;s budget</span>
            <span className="font-display font-semibold text-[var(--text-primary)]">
              ${budgetDollars}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">You&apos;ll receive (after 10% fee)</span>
            <span className="font-display font-bold text-[#00D4AA]">${receivedAmount}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <VouchButton
            variant="primary"
            size="lg"
            className="flex-1"
            disabled={!confirmed || submitting}
            loading={submitting}
            onClick={handleAccept}
          >
            Accept Deal
          </VouchButton>
          <VouchButton variant="secondary" size="lg" onClick={onClose}>
            Close
          </VouchButton>
        </div>
      </div>
    </div>
  )
}

interface BrowseRequestsClientProps {
  initialRequests: MockRequest[]
  initialTotal: number
}

export default function BrowseRequestsClient({
  initialRequests,
  initialTotal,
}: BrowseRequestsClientProps) {
  const [requests, setRequests] = useState<MockRequest[]>(initialRequests)
  const [total, setTotal] = useState(initialTotal)
  const [search, setSearch] = useState("")
  const [industry, setIndustry] = useState("")
  const [minBudget, setMinBudget] = useState("")
  const [maxBudget, setMaxBudget] = useState("")
  const [sort, setSort] = useState("newest")
  const [loading, setLoading] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<MockRequest | null>(null)

  const fetchRequests = useCallback(
    async (params: {
      search: string
      industry: string
      minBudget: string
      maxBudget: string
      sort: string
    }) => {
      setLoading(true)
      try {
        const qs = new URLSearchParams()
        if (params.search) qs.set("search", params.search)
        if (params.industry) qs.set("industry", params.industry)
        if (params.minBudget) qs.set("minBudget", params.minBudget)
        if (params.maxBudget) qs.set("maxBudget", params.maxBudget)
        qs.set("sort", params.sort)

        const res = await fetch(`/api/requests?${qs.toString()}`)
        if (res.ok) {
          const data = await res.json() as { requests: MockRequest[]; total: number }
          setRequests(data.requests)
          setTotal(data.total)
        }
      } catch {
        // keep previous results
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const handleApplyFilters = () => {
    void fetchRequests({ search, industry, minBudget, maxBudget, sort })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">
        Browse Requests
      </h1>

      {/* Filter Bar */}
      <VouchCard className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApplyFilters()
              }}
              placeholder="Search company or role..."
              className="w-full h-10 pl-9 pr-3 py-2 text-sm rounded-lg bg-[#0A0A0F] border border-[#2A2A38] text-[#F0F0FF] placeholder:text-[#55556A] outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all"
            />
          </div>

          {/* Industry */}
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="h-10 px-3 text-sm rounded-lg bg-[#0A0A0F] border border-[#2A2A38] text-[#F0F0FF] outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all"
          >
            <option value="">All Industries</option>
            {INDUSTRY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          {/* Budget range */}
          <div className="flex items-center gap-2">
            <VouchInput
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
              placeholder="Min $"
              type="number"
              className="flex-1"
            />
            <span className="text-[var(--text-secondary)] text-sm shrink-0">–</span>
            <VouchInput
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              placeholder="Max $"
              type="number"
              className="flex-1"
            />
          </div>

          {/* Sort + Apply */}
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="flex-1 h-10 px-3 text-sm rounded-lg bg-[#0A0A0F] border border-[#2A2A38] text-[#F0F0FF] outline-none focus:border-[#6C63FF] transition-all"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <VouchButton
              variant="primary"
              size="md"
              onClick={handleApplyFilters}
              loading={loading}
            >
              Filter
            </VouchButton>
          </div>
        </div>
      </VouchCard>

      {/* Results count */}
      <p className="text-sm text-[var(--text-secondary)]">
        {total} request{total !== 1 ? "s" : ""} found
      </p>

      {/* Request list */}
      <div className="space-y-4">
        {requests.length === 0 ? (
          <VouchCard className="flex flex-col items-center justify-center py-16 text-center space-y-3">
            <Search size={36} className="text-[var(--text-secondary)]" />
            <p className="font-display font-semibold text-[var(--text-primary)]">
              No requests found
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              Try adjusting your filters or check back later.
            </p>
          </VouchCard>
        ) : (
          requests.map((req) => {
            const avatarBg = getAvatarColor(req.initials)
            const budgetDollars = Math.floor(req.budgetCents / 100)

            return (
              <VouchCard
                key={req.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: avatarBg }}
                >
                  <span className="font-display font-bold text-white text-sm">
                    {req.initials}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <p className="font-semibold text-[var(--text-primary)]">
                    {req.targetCompany
                      ? `Looking for referral at ${req.targetCompany}`
                      : `Open to any company in ${req.targetIndustry}`}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {req.targetRole} · {req.yearsExperience} yrs exp · Posted{" "}
                    {timeAgo(req.postedAt)}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <VouchBadge variant="success">${budgetDollars} budget</VouchBadge>
                    {req.roleTypes.map((rt) => (
                      <VouchBadge key={rt} variant="purple">
                        {rt}
                      </VouchBadge>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="shrink-0">
                  <VouchButton
                    variant="primary"
                    size="md"
                    onClick={() => setSelectedRequest(req)}
                  >
                    View & Accept
                  </VouchButton>
                </div>
              </VouchCard>
            )
          })
        )}
      </div>

      {/* Modal */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  )
}