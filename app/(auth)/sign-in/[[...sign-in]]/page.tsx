import { SignIn } from "@clerk/nextjs"
import { Shield, Zap, Users } from "lucide-react"

export default function SignInPage() {
  return (
    <div
      style={{ backgroundColor: "var(--page-bg)", minHeight: "100vh" }}
      className="flex"
    >
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-center px-16 w-1/2 relative overflow-hidden"
        style={{ backgroundColor: "var(--surface)", borderRight: "1px solid var(--border)" }}
      >
        <div className="orb-purple" style={{ opacity: 0.5 }} />
        <div className="orb-teal" style={{ opacity: 0.4 }} />
        <div className="noise-overlay" />
        <div className="relative z-10">
          <div className="mb-12">
            <span className="font-display text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
              vouch<span style={{ color: "var(--accent)" }}>.</span>
            </span>
          </div>
          <h1
            className="text-5xl font-bold leading-tight mb-6"
            style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}
          >
            Get Referred.<br />
            <span style={{ color: "var(--accent)" }}>Get Hired.</span>
          </h1>
          <p className="text-lg mb-16" style={{ color: "var(--text-secondary)" }}>
            Connect with company insiders who can get your resume to the top of the pile.
          </p>
          <div className="flex flex-col gap-6">
            {[
              { Icon: Shield, title: "Verified Referrers", desc: "Every referrer is verified with work email authentication" },
              { Icon: Zap, title: "Fast Results", desc: "Get your referral submitted within 48 hours or full refund" },
              { Icon: Users, title: "Escrow Protection", desc: "Payment held securely until referral is confirmed" },
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
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <span className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              vouch<span style={{ color: "var(--accent)" }}>.</span>
            </span>
          </div>
          <div
            className="relative rounded-2xl p-8"
            style={{
              background: "rgba(15, 23, 41, 0.8)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(148, 163, 184, 0.12)",
            }}
          >
            <SignIn
              fallbackRedirectUrl="/dashboard"
              appearance={{
                variables: {
                  colorBackground: "#0F1729",
                  colorInputBackground: "#141E35",
                  colorInputText: "#F1F5F9",
                  colorText: "#F1F5F9",
                  colorTextSecondary: "#94A3B8",
                  colorPrimary: "#6366F1",
                  colorDanger: "#F43F5E",
                  borderRadius: "8px",
                  fontFamily: "Inter, sans-serif",
                },
                elements: {
                  card: "bg-transparent shadow-none border-none",
                  headerTitle: "text-xl font-semibold text-[#F1F5F9]",
                  headerSubtitle: "text-[#94A3B8]",
                  formButtonPrimary: "bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:opacity-90 transition-opacity",
                  socialButtonsBlockButton: "border border-[rgba(148,163,184,0.12)] bg-[#141E35] hover:bg-[#1A2540] text-[#F1F5F9]",
                  dividerLine: "bg-[rgba(148,163,184,0.12)]",
                  dividerText: "text-[#94A3B8]",
                  formFieldInput: "bg-[#141E35] border-[rgba(148,163,184,0.12)] text-[#F1F5F9] focus:border-[#6366F1]",
                  formFieldLabel: "text-[#94A3B8]",
                  footerActionLink: "text-[#6366F1]",
                  identityPreviewText: "text-[#F1F5F9]",
                  rootBox: "w-full",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
