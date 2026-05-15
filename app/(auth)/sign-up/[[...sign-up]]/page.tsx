import { SignUp } from "@clerk/nextjs"
import { Shield, Zap, Users } from "lucide-react"

export default function SignUpPage() {
  return (
    <div style={{ backgroundColor: "var(--bg-base)", minHeight: "100vh" }}>
      {/* Mobile: single centered column | Desktop: split layout */}
      <div className="flex min-h-screen">

        {/* Left panel — desktop only */}
        <div
          className="hidden lg:flex flex-col justify-center px-20 w-1/2 relative overflow-hidden"
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
              style={{ fontSize: "clamp(40px, 5vw, 64px)", letterSpacing: "-0.02em", lineHeight: 1.05, fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}
            >
              Get Referred.<br />
              <span style={{ background: "linear-gradient(135deg, #818CF8, #6EE7B7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Get Hired.
              </span>
            </h1>
            <p className="text-lg mb-16" style={{ color: "var(--text-secondary)" }}>
              Connect with company insiders who can get your resume to the top of the pile.
            </p>
            <div className="flex flex-col gap-8">
              {[
                { Icon: Shield, title: "Verified Referrers", desc: "Every referrer is verified with work email authentication" },
                { Icon: Zap, title: "Fast Results", desc: "Get your referral submitted within 48 hours or full refund" },
                { Icon: Users, title: "Escrow Protection", desc: "Payment held securely until referral is confirmed" },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(99,102,241,0.15)", color: "var(--accent)" }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>{title}</p>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel — full width on mobile, half on desktop */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 lg:px-12">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <span style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>
              vouch<span style={{ color: "var(--text-accent)" }}>.</span>
            </span>
          </div>

          {/* Auth card */}
          <div style={{
            background: "var(--bg-surface)",
            border: "0.5px solid var(--border-default)",
            borderRadius: 20,
            padding: "36px 28px",
            width: "100%",
            maxWidth: 400,
            boxShadow: "0 0 0 1px rgba(99,102,241,0.08), 0 24px 48px rgba(0,0,0,0.40), 0 0 80px rgba(99,102,241,0.06)",
          }}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
                Create your account
              </h2>
              <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                Start getting referred today
              </p>
            </div>
            <SignUp
              fallbackRedirectUrl="/onboarding/role"
              appearance={{
                variables: {
                  colorBackground: "transparent",
                  colorInputBackground: "#1A2744",
                  colorInputText: "#F1F5F9",
                  colorText: "#F1F5F9",
                  colorTextSecondary: "#CBD5E1",
                  colorPrimary: "#6366F1",
                  colorDanger: "#F43F5E",
                  borderRadius: "10px",
                  fontFamily: "Inter, sans-serif",
                },
                elements: {
                  card: "bg-transparent shadow-none border-none p-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  header: "hidden",
                  alert: "hidden",
                  alertText: "hidden",
                  formButtonPrimary: "bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:opacity-90 transition-opacity rounded-full h-[46px]",
                  socialButtonsBlockButton: "bg-[#1A2744] border border-[rgba(148,163,184,0.20)] text-[#F1F5F9] h-[46px] rounded-[10px] hover:bg-[#243355]",
                  dividerLine: "bg-[rgba(148,163,184,0.12)] h-px",
                  dividerText: "text-[#64748B] text-xs",
                  formFieldLabel: "text-[#CBD5E1] text-[13px] font-medium",
                  formFieldInput: "bg-[#1A2744] border border-[rgba(148,163,184,0.20)] text-[#F1F5F9] rounded-[10px] h-[46px]",
                  footerActionLink: "text-[#818CF8] hover:text-[#A5B4FC] font-medium",
                  footerActionText: "text-[#94A3B8]",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}