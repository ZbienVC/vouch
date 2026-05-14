export default function OnboardingRolePage() {
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
            backgroundColor: "#6C63FF20",
            border: "1px solid #6C63FF40",
            color: "#6C63FF",
          }}
        >
          Step 1 of 3 — Choose Your Role
        </div>

        <h1
          className="font-display text-4xl font-bold mb-4"
          style={{ color: "#F0F0FF" }}
        >
          Phase 2: Choose Your Role
        </h1>
        <p
          className="text-base mb-8"
          style={{ color: "#8888AA" }}
        >
          This onboarding flow will be implemented in Phase 2.
          Users will choose between Job Seeker, Referrer, or Both.
        </p>

        <div
          className="p-6 rounded-vouch text-left"
          style={{
            backgroundColor: "#111118",
            border: "1px solid #2A2A38",
          }}
        >
          <p className="text-sm font-mono" style={{ color: "#55556A" }}>
            {"// TODO: Phase 2"}
          </p>
          <p className="text-sm font-mono mt-1" style={{ color: "#8888AA" }}>
            Role selection → Profile setup → Verification
          </p>
        </div>
      </div>
    </div>
  )
}