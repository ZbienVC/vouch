"use client"

import { useState, useCallback } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { VouchCard, VouchButton, VouchInput } from "@/components/ui/vouch"
import ReferrerCard, { type ReferrerCardData } from "@/components/referrers/ReferrerCard"
import ReferrerCardSkeleton from "@/components/referrers/ReferrerCardSkeleton"
import EmptyState from "@/components/ui/EmptyState"

interface Filters {
  search: string
  company: string
  industry: string
  minPrice: number
  maxPrice: number
  minRating: string
  verifiedOnly: boolean
}

const defaultFilters: Filters = {
  search: "",
  company: "",
  industry: "",
  minPrice: 25,
  maxPrice: 1000,
  minRating: "0",
  verifiedOnly: false,
}

const industries = [
  "Engineering",
  "Marketing",
  "Finance",
  "Sales",
  "Design",
  "Operations",
  "Legal",
  "Other",
]

const sortOptions = [
  { value: "referrals", label: "Most Referrals" },
  { value: "rating", label: "Highest Rated" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
]

interface BrowseReferrersProps {
  initialListings: ReferrerCardData[]
  initialTotal: number
}

export default function BrowseReferrers({ initialListings, initialTotal }: BrowseReferrersProps) {
  const [listings, setListings] = useState<ReferrerCardData[]>(initialListings)
  const [total, setTotal] = useState(initialTotal)
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState("referrals")
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [pendingFilters, setPendingFilters] = useState<Filters>(defaultFilters)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const buildQuery = useCallback(
    (f: Filters, s: string, p: number) => {
      const params = new URLSearchParams()
      if (f.search) params.set("company", f.search)
      if (f.company) params.set("company", f.company)
      if (f.industry) params.set("industry", f.industry)
      params.set("minPrice", String(f.minPrice))
      params.set("maxPrice", String(f.maxPrice))
      if (f.minRating !== "0") params.set("minRating", f.minRating)
      if (f.verifiedOnly) params.set("verifiedOnly", "true")
      params.set("sort", s)
      params.set("page", String(p))
      params.set("limit", "12")
      return params.toString()
    },
    []
  )

  const applyFilters = async () => {
    setLoading(true)
    setFilters(pendingFilters)
    setPage(1)
    try {
      const res = await fetch(`/api/listings?${buildQuery(pendingFilters, sort, 1)}`)
      const data = await res.json() as { listings: ReferrerCardData[]; total: number; page: number }
      setListings(data.listings)
      setTotal(data.total)
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = async () => {
    setPendingFilters(defaultFilters)
    setFilters(defaultFilters)
    setPage(1)
    setLoading(true)
    try {
      const res = await fetch(`/api/listings?${buildQuery(defaultFilters, sort, 1)}`)
      const data = await res.json() as { listings: ReferrerCardData[]; total: number; page: number }
      setListings(data.listings)
      setTotal(data.total)
    } finally {
      setLoading(false)
    }
  }

  const handleSortChange = async (newSort: string) => {
    setSort(newSort)
    setLoading(true)
    setPage(1)
    try {
      const res = await fetch(`/api/listings?${buildQuery(filters, newSort, 1)}`)
      const data = await res.json() as { listings: ReferrerCardData[]; total: number; page: number }
      setListings(data.listings)
      setTotal(data.total)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = async () => {
    setLoadingMore(true)
    const nextPage = page + 1
    try {
      const res = await fetch(`/api/listings?${buildQuery(filters, sort, nextPage)}`)
      const data = await res.json() as { listings: ReferrerCardData[]; total: number; page: number }
      setListings((prev) => [...prev, ...data.listings])
      setPage(nextPage)
    } finally {
      setLoadingMore(false)
    }
  }

  const FilterPanel = () => (
    <VouchCard className="space-y-5 sticky top-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-[var(--text-primary)]">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-[var(--accent)] hover:underline"
        >
          Clear
        </button>
      </div>

      {/* Search */}
      <VouchInput
        label="Search"
        placeholder="Company or job title..."
        value={pendingFilters.search}
        onChange={(e) =>
          setPendingFilters((p) => ({ ...p, search: e.target.value }))
        }
      />

      {/* Company */}
      <VouchInput
        label="Company"
        placeholder="e.g. Google"
        value={pendingFilters.company}
        onChange={(e) =>
          setPendingFilters((p) => ({ ...p, company: e.target.value }))
        }
      />

      {/* Industry */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Industry</label>
        <select
          className="w-full h-10 px-3 py-2 text-sm rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors"
          value={pendingFilters.industry}
          onChange={(e) =>
            setPendingFilters((p) => ({ ...p, industry: e.target.value }))
          }
        >
          <option value="">All Industries</option>
          {industries.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[var(--text-secondary)]">
          Price Range:{" "}
          <span className="text-[var(--text-primary)]">
            ${pendingFilters.minPrice} — ${pendingFilters.maxPrice}
          </span>
        </label>
        <div className="flex gap-2">
          <div className="flex-1">
            <VouchInput
              type="number"
              placeholder="Min $"
              value={String(pendingFilters.minPrice)}
              min={25}
              max={pendingFilters.maxPrice}
              onChange={(e) =>
                setPendingFilters((p) => ({
                  ...p,
                  minPrice: Math.max(25, Number(e.target.value)),
                }))
              }
            />
          </div>
          <div className="flex-1">
            <VouchInput
              type="number"
              placeholder="Max $"
              value={String(pendingFilters.maxPrice)}
              min={pendingFilters.minPrice}
              max={1000}
              onChange={(e) =>
                setPendingFilters((p) => ({
                  ...p,
                  maxPrice: Math.min(1000, Number(e.target.value)),
                }))
              }
            />
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Rating</label>
        <select
          className="w-full h-10 px-3 py-2 text-sm rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors"
          value={pendingFilters.minRating}
          onChange={(e) =>
            setPendingFilters((p) => ({ ...p, minRating: e.target.value }))
          }
        >
          <option value="0">Any Rating</option>
          <option value="4">4+ stars</option>
          <option value="4.5">4.5+ stars</option>
          <option value="5">5 stars only</option>
        </select>
      </div>

      {/* Verified Only */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[var(--text-primary)]">Verified Only</label>
        <button
          onClick={() =>
            setPendingFilters((p) => ({ ...p, verifiedOnly: !p.verifiedOnly }))
          }
          className={[
            "relative w-10 h-5 rounded-full transition-colors duration-200",
            pendingFilters.verifiedOnly ? "bg-[var(--accent)]" : "bg-[var(--border)]",
          ].join(" ")}
          aria-pressed={pendingFilters.verifiedOnly}
        >
          <span
            className={[
              "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200",
              pendingFilters.verifiedOnly ? "translate-x-5" : "translate-x-0",
            ].join(" ")}
          />
        </button>
      </div>

      <VouchButton variant="primary" className="w-full" onClick={applyFilters} loading={loading}>
        Apply Filters
      </VouchButton>
    </VouchCard>
  )

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">
          Browse Referrers
        </h1>
        <button
          className="md:hidden flex items-center gap-2 text-sm text-[var(--text-secondary)] border border-[var(--border)] rounded-lg px-3 py-2"
          onClick={() => setMobileFiltersOpen((v) => !v)}
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      {mobileFiltersOpen && (
        <div className="md:hidden mb-6">
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <X size={20} />
            </button>
          </div>
          <FilterPanel />
        </div>
      )}

      <div className="flex gap-6">
        {/* Desktop filter sidebar */}
        <aside className="hidden md:block w-[260px] shrink-0">
          <FilterPanel />
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-[var(--text-secondary)]">
              <span className="text-[var(--text-primary)] font-medium">{total}</span> referrers
            </p>
            <div className="flex items-center gap-2">
              <label className="text-sm text-[var(--text-secondary)] hidden sm:block">Sort:</label>
              <select
                className="h-9 px-3 text-sm rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors"
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <ReferrerCardSkeleton key={i} />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No referrers match your filters"
              description="Try adjusting your search criteria or clearing the filters."
              action={{ label: "Clear Filters", onClick: clearFilters }}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.map((listing) => (
                  <ReferrerCard key={listing.id} data={listing} />
                ))}
              </div>

              {/* Load more */}
              {listings.length < total && (
                <div className="mt-8 flex flex-col items-center gap-3">
                  <p className="text-sm text-[var(--text-secondary)]">
                    Showing {listings.length} of {total} referrers
                  </p>
                  <VouchButton
                    variant="secondary"
                    onClick={loadMore}
                    loading={loadingMore}
                  >
                    Load More
                  </VouchButton>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}