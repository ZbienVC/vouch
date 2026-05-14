import Link from "next/link"

export default function HomePage() {
  return (
    <div
      style={{ backgroundColor: "#0A0A0F", minHeight: "100vh" }}
      className="relative overflow-hidden"
    >
      {/* Background glows */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: "#6C63FF" }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ backgroundColor: "#00D4AA" }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-48 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ backgroundColor: "#6C63FF" }}
      />

      {/* Nav */}
      <nav
        className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto"
      >
        <span
          className="font-display text-2xl font-bold"
          style={{ color: "#F0F0FF" }}
        >
          vouch<span style={{ color: "#6C63FF" }}>.</span>
        </span>
        <div className="flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-sm font-medium transition-colors"
            style={{ color: "#8888AA" }}
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="px-4 py-2 text-sm font-medium rounded-vouch transition-all"
            style={{
              backgroundColor: "#6C63FF",
              color: "#fff",
            }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-32 max-w-4xl mx-auto">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-vouch-pill text-sm font-medium mb-8"
          style={{
            backgroundColor: "#6C63FF20",
            border: "1px solid #6C63FF40",
            color: "#6C63FF",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#6C63FF] animate-pulse" />
          Now in beta — limited early access
        </div>

        {/* Headline */}
        <h1
          className="font-display text-6xl md:text-7xl font-bold leading-tight mb-6"
          style={{ color: "#F0F0FF" }}
        >
          Get Referred.
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Get Hired.
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-xl md:text-2xl max-w-2xl mb-12 leading-relaxed"
          style={{ color: "#8888AA" }}
        >
          The two-sided marketplace connecting job seekers with company insiders.
          Skip the application pile. Get your resume seen.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link
            href="/sign-up"
            className="px-8 py-4 text-base font-semibold rounded-vouch transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: "#6C63FF",
              color: "#fff",
              boxShadow: "0 0 32px rgba(108,99,255,0.4)",
            }}
          >
            Find a Referral →
          </Link>
          <Link
            href="/sign-up"
            className="px-8 py-4 text-base font-semibold rounded-vouch transition-all hover:border-[#6C63FF] hover:text-[#6C63FF]"
            style={{
              backgroundColor: "transparent",
              color: "#F0F0FF",
              border: "1px solid #2A2A38",
            }}
          >
            Earn by Referring
          </Link>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-3 gap-8 w-full max-w-lg py-8"
          style={{ borderTop: "1px solid #2A2A38", borderBottom: "1px solid #2A2A38" }}
        >
          {[
            { value: "3x", label: "Higher interview rate" },
            { value: "48h", label: "Average turnaround" },
            { value: "100%", label: "Escrow protected" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span
                className="font-display text-3xl font-bold"
                style={{ color: "#6C63FF" }}
              >
                {stat.value}
              </span>
              <span className="text-xs" style={{ color: "#8888AA" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </main>

      {/* Features section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-32">
        <h2
          className="font-display text-3xl font-bold text-center mb-12"
          style={{ color: "#F0F0FF" }}
        >
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Post your request",
              desc: "Tell us which company you want to get into and your budget.",
              icon: "📋",
            },
            {
              step: "02",
              title: "Match with an insider",
              desc: "We connect you with a verified employee at your target company.",
              icon: "🤝",
            },
            {
              step: "03",
              title: "Get referred",
              desc: "Payment is held in escrow and released once your referral is confirmed.",
              icon: "🚀",
            },
          ].map((feature) => (
            <div
              key={feature.step}
              className="relative p-6 rounded-vouch"
              style={{
                backgroundColor: "#111118",
                border: "1px solid #2A2A38",
              }}
            >
              <div
                className="text-3xl mb-4"
              >
                {feature.icon}
              </div>
              <div
                className="font-mono text-xs font-medium mb-2"
                style={{ color: "#6C63FF" }}
              >
                {feature.step}
              </div>
              <h3
                className="font-display text-lg font-semibold mb-2"
                style={{ color: "#F0F0FF" }}
              >
                {feature.title}
              </h3>
              <p className="text-sm" style={{ color: "#8888AA" }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative z-10 text-center py-8 text-sm"
        style={{
          color: "#55556A",
          borderTop: "1px solid #2A2A38",
        }}
      >
        <p>© 2025 Vouch. All rights reserved.</p>
      </footer>
    </div>
  )
}