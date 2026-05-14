import { VouchSkeleton } from "@/components/ui/vouch"
import ReferrerCardSkeleton from "@/components/referrers/ReferrerCardSkeleton"

export default function DashboardSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* 3 stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <VouchSkeleton style={{ height: 14, width: "50%", borderRadius: 6 }} />
            <VouchSkeleton style={{ height: 32, width: "70%", borderRadius: 8 }} />
            <VouchSkeleton style={{ height: 12, width: "40%", borderRadius: 6 }} />
          </div>
        ))}
      </div>

      {/* Section header */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <VouchSkeleton style={{ height: 22, width: 200, borderRadius: 8 }} />
        <VouchSkeleton style={{ height: 14, width: 300, borderRadius: 6 }} />
      </div>

      {/* 3 referrer card skeletons */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <ReferrerCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}