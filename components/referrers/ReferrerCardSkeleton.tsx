import { VouchSkeleton } from "@/components/ui/vouch"

export default function ReferrerCardSkeleton() {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "20px",
        paddingBottom: "60px",
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Top: avatar + text */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <VouchSkeleton style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0 }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <VouchSkeleton style={{ height: 14, width: "60%", borderRadius: 6 }} />
          <VouchSkeleton style={{ height: 12, width: "40%", borderRadius: 6 }} />
        </div>
      </div>

      {/* Middle: response time chip + stars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <VouchSkeleton style={{ height: 22, width: 120, borderRadius: 999 }} />
        <VouchSkeleton style={{ height: 12, width: "50%", borderRadius: 6 }} />
      </div>

      {/* Badges */}
      <div style={{ display: "flex", gap: 8 }}>
        <VouchSkeleton style={{ height: 20, width: 60, borderRadius: 999 }} />
        <VouchSkeleton style={{ height: 20, width: 70, borderRadius: 999 }} />
      </div>

      {/* Price */}
      <VouchSkeleton style={{ height: 20, width: 80, borderRadius: 6, marginTop: "auto" }} />

      {/* Button placeholder */}
      <VouchSkeleton style={{ height: 36, width: "100%", borderRadius: 8 }} />
    </div>
  )
}