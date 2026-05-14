import { SignUp } from "@clerk/nextjs"
import { Shield, Zap, Users } from "lucide-react"

export default function SignUpPage() {
  return (
    <div
      style={{ backgroundColor: "var(--bg-base)", minHeight: "100vh" }}
      className="flex"
    >
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-center px-20 w-1/2 relative overflow-hidden min-h-screen"
        style={{ backgroundColor: "var(--bg-surface)", borderRight: "1px solid var(--border-subtle)" }}
      >
        <div className="orb-purple" style={{ opacity: 0.5 }} />
        <div className="orb-teal" style={{ opacity: 0.4 }} />
        <div className="noise-overlay" />
        <div className="relative z-10">
          <div className="mb-16">
            <span style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)" }}>
              vouch<span style={{ color: "var(--text-accent)" }}>.</span>
            </span>
          </div>
          <h1
            className="font-bold leading-tight mb-6"
            style={{ fontSize: "clamp(40px, 5vw, 72px)", letterSpacing: "-0.02em", lineHeight: 1.05, fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}
          >
            Join the<br />
            <span style={{ color: "var(--accent)" }}>Referral Network.</span>
          </h1>
          <p className="text-lg mb-16" style={{ color: "var(--text-secondary)" }}>
            Whether you want referrals or want to give them — Vouch makes it seamless.
          </p>
          <div className="flex flex-col gap-8">
            {[
              { Icon: Users, title: "Find the Right Insider", desc: "Browse referrers at thousands of top companies" },
              { Icon: Zap, title: "Earn by Referring", desc: "Monetize your network and help great candidates" },
              { Icon: Shield, title: "Build Your Reputation", desc: "Ratings and badges that grow with every successful deal" },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(99,102,241,0.15)", color: "var(--accent)" }}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-display font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>{title}</p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="auth-card">
          <div className="lg:hidden mb-8 text-center">
            <span style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)" }}>
              vouch<span style={{ color: "var(--text-accent)" }}>.</span>
            </span>
          </div>
          <div className="mb-6">
            <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
              Create your account
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Start getting referred today
            </p>
          </div>
          <SignUp
            fallbackRedirectUrl="/onboarding/role"
            appearance={{
              variables: {
                colorBackground: "#0D1525",
                colorInputBackground: "#131E33",
                colorInputText: "#F1F5F9",
                colorText: "#F1F5F9",
                colorTextSecondary: "#94A3B8",
                colorPrimary: "#6366F1",
                colorDanger: "#F43F5E",
                borderRadius: "10px",
                fontFamily: "Inter, sans-serif",
              },
              elements: {
                card: "bg-transparent shadow-none border-none",
                headerTitle: "text-xl font-semibold text-[#F1F5F9]",
                headerSubtitle: "text-[#94A3B8]",
                formButtonPrimary: "bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:opacity-90 transition-opacity",
                socialButtonsBlockButton: "bg-[#131E33] border border-[rgba(148,163,184,0.18)] text-[#F1F5F9] h-[46px] rounded-[10px] hover:bg-[#1A2744]",
                dividerLine: "bg-[rgba(148,163,184,0.10)] h-px",
                dividerText: "text-[#64748B] text-xs",
                formFieldInput: "bg-[#131E33] border border-[rgba(148,163,184,0.10)] text-[#F1F5F9] rounded-[10px] h-[46px] focus:border-[rgba(99,102,241,0.60)] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]",
                formFieldLabel: "text-[#94A3B8] text-xs font-medium",
                footerActionLink: "text-[#6366F1]",
                identityPreviewText: "text-[#F1F5F9]",
                rootBox: "w-full",
                alert: "hidden",
                alertText: "hidden",
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
