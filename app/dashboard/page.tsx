export default function DashboardPage() {
  return (
    <div
      style={{ backgroundColor: "#0A0A0F", minHeight: "100vh" }}
      className="flex items-center justify-center px-6"
    >
      <div className="text-center max-w-lg">
        <div className="mb-8">
          <span
            className="font-display text-2xl font-bold"
            style={{ color: "#F0F0FF" }}
          >
            vouch<span style={{ color: "#6C63FF" }}>.</span>
          </span>
        </div>

        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-vouch-pill text-xs font-medium mb-6"
          style={{
            backgroundColor: "#00D4AA20",
            border: "1px solid #00D4AA40",
            color: "#00D4AA",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]" />
          Authenticated
        </div>

        <h1
          className="font-display text-4xl font-bold mb-4"
          style={{ color: "#F0F0FF" }}
        >
          Phase 3: Dashboard
        </h1>
        <p
          className="text-base mb-8"
          style={{ color: "#8888AA" }}
        >
          The full dashboard experience is coming in Phase 3 — listings,
          requests, deals, messages, and earnings.
        </p>

        <div
          className="p-6 rounded-vouch text-left space-y-2"
          style={{
            backgroundColor: "#111118",
            border: "1px solid #2A2A38",
          }}
        >
          <p className="text-sm font-mono" style={{ color: "#55556A" }}>
            {"// TODO: Phase 3"}
          </p>
          {[
            "Browse referrer listings",
            "Post referral requests",
            "Manage active deals",
            "Escrow & payments",
            "Messaging (Stream Chat)",
            "Earnings & payouts",
          ].map((item) => (
            <p key={item} className="text-sm font-mono" style={{ color: "#8888AA" }}>
              — {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}