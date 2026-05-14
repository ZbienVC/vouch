"use client"

import { useState } from "react"
import Link from "next/link"
import { List } from "lucide-react"
import { VouchButton, VouchCard } from "@/components/ui/vouch"
import { ListingManageCard } from "@/components/dashboard/ListingManageCard"
import { toast } from "@/components/ui/vouch"

interface ListingData {
  id: string
  companyName: string
  roleTypes: string[]
  priceCents: number
  isActive: boolean
  createdAt: string
}

interface MyListingsClientProps {
  initialListings: ListingData[]
}

export default function MyListingsClient({ initialListings }: MyListingsClientProps) {
  const [listings, setListings] = useState<ListingData[]>(initialListings)

  const handleToggle = async (id: string, newActive: boolean) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isActive: newActive } : l))
    )
    try {
      const res = await fetch(`/api/listings/${id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newActive }),
      })
      if (!res.ok) throw new Error("Failed to update listing")
      toast(newActive ? "Listing activated" : "Listing paused", "success")
    } catch {
      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, isActive: !newActive } : l))
      )
      toast("Failed to update listing", "error")
    }
  }

  const handleDelete = async (id: string) => {
    const backup = listings.find((l) => l.id === id)
    setListings((prev) => prev.filter((l) => l.id !== id))
    try {
      const res = await fetch(`/api/listings/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete listing")
      toast("Listing deleted", "success")
    } catch {
      if (backup) {
        setListings((prev) => [...prev, backup].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)))
      }
      toast("Failed to delete listing", "error")
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">
          My Listings
        </h1>
        <Link href="/dashboard/listings/new">
          <VouchButton variant="primary" size="md">
            Create New Listing
          </VouchButton>
        </Link>
      </div>

      {listings.length === 0 ? (
        <VouchCard className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
            <List size={28} className="text-[var(--accent)]" />
          </div>
          <div>
            <p className="font-display font-semibold text-[var(--text-primary)] text-lg">
              You haven&apos;t created any listings yet
            </p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Create a listing to start earning by referring great candidates.
            </p>
          </div>
          <Link href="/dashboard/listings/new">
            <VouchButton variant="primary" size="md">
              Create Your First Listing
            </VouchButton>
          </Link>
        </VouchCard>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <ListingManageCard
              key={listing.id}
              listing={listing}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}