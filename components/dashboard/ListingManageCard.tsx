"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, MessageSquare, Pencil, Trash2 } from "lucide-react"
import { VouchCard, VouchButton, VouchBadge } from "@/components/ui/vouch"

interface ListingData {
  id: string
  companyName: string
  roleTypes: string[]
  priceCents: number
  isActive: boolean
  createdAt: string
}

interface ListingManageCardProps {
  listing: ListingData
  onToggle: (id: string, newActive: boolean) => void
  onDelete: (id: string) => void
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function ListingManageCard({ listing, onToggle, onDelete }: ListingManageCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const receivedAmount = Math.floor((listing.priceCents / 100) * 0.9)

  return (
    <VouchCard className="space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-display font-semibold text-[var(--text-primary)]">
              {listing.companyName}
            </p>
            <VouchBadge variant={listing.isActive ? "success" : "default"}>
              {listing.isActive ? "Active" : "Paused"}
            </VouchBadge>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {listing.roleTypes.map((rt) => (
              <VouchBadge key={rt} variant="purple">
                {rt}
              </VouchBadge>
            ))}
          </div>
        </div>

        {/* Status toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm text-[var(--text-secondary)]">
            {listing.isActive ? "Active" : "Paused"}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={listing.isActive}
            onClick={() => onToggle(listing.id, !listing.isActive)}
            className={[
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200",
              listing.isActive ? "bg-[#00D4AA]" : "bg-[#2A2A38]",
            ].join(" ")}
          >
            <span
              className={[
                "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200",
                listing.isActive ? "translate-x-6" : "translate-x-1",
              ].join(" ")}
            />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6 flex-wrap text-sm">
        <div>
          <span className="text-[var(--text-secondary)]">Price: </span>
          <span className="text-[var(--text-primary)] font-medium">
            ${Math.floor(listing.priceCents / 100)}
          </span>
          <span className="text-[var(--text-secondary)] ml-1">
            (you receive ${receivedAmount})
          </span>
        </div>
        <div className="flex items-center gap-1 text-[var(--text-secondary)]">
          <Eye size={14} />
          <span>0 views</span>
        </div>
        <div className="flex items-center gap-1 text-[var(--text-secondary)]">
          <MessageSquare size={14} />
          <span>0 inquiries</span>
        </div>
        <div className="text-[var(--text-secondary)]">
          Created {formatDate(listing.createdAt)}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2 border-t border-[var(--border)]">
        <Link href={`/dashboard/listings/${listing.id}/edit`}>
          <VouchButton variant="secondary" size="sm" className="flex items-center gap-1.5">
            <Pencil size={14} />
            Edit
          </VouchButton>
        </Link>

        {!showDeleteConfirm ? (
          <VouchButton
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5 text-[#FF4D6A] hover:text-[#ff6680]"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 size={14} />
            Delete
          </VouchButton>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-secondary)]">Are you sure?</span>
            <VouchButton
              variant="destructive"
              size="sm"
              onClick={() => {
                onDelete(listing.id)
                setShowDeleteConfirm(false)
              }}
            >
              Delete
            </VouchButton>
            <VouchButton
              variant="secondary"
              size="sm"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </VouchButton>
          </div>
        )}
      </div>
    </VouchCard>
  )
}