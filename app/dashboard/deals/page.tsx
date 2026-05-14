"use client"

import { Handshake } from "lucide-react"
import EmptyState from "@/components/ui/EmptyState"

export default function DealsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1
        className="font-display text-2xl font-bold mb-6"
        style={{ color: "var(--text-primary)" }}
      >
        My Deals
      </h1>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
        }}
      >
        <EmptyState
          icon={Handshake}
          title="No active deals yet"
          description="When you start a deal with a referrer, it will appear here. Browse referrers to get started."
          action={{ label: "Browse Referrers", href: "/dashboard/browse" }}
        />
      </div>
    </div>
  )
}