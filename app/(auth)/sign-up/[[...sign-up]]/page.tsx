import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div
      style={{ backgroundColor: "#0A0A0F", minHeight: "100vh" }}
      className="flex"
    >
      <div
        className="hidden lg:flex flex-col justify-center px-16 w-1/2 relative overflow-hidden"
        style={{ backgroundColor: "#111118", borderRight: "1px solid #2A2A38" }}
      >
        <div
          className="absolute top-1/4 -left-20 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: "#6C63FF" }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-60 h-60 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: "#00D4AA" }}
        />
        <div className="relative z-10">
          <div className="mb-12">
            <span className="font-display text-3xl font-bold" style={{ color: "#F0F0FF" }}>
              vouch<span style={{ color: "#6C63FF" }}>.</span>
            </span>
          </div>
          <h1 className="font-display text-5xl font-bold leading-tight mb-6" style={{ color: "#F0F0FF" }}>
            Join the<br />
            <span style={{ color: "#6C63FF" }}>Referral Network.</span>
          </h1>
          <p className="text-lg mb-16" style={{ color: "#8888AA" }}>
            Whether you want referrals or want to give them — Vouch makes it seamless.
          </p>
          <div className="flex flex-col gap-6">
            {[
              { icon: "🎯", title: "Find the Right Insider", desc: "Browse referrers at thousands of top companies" },
              { icon: "💰", title: "Earn by Referring", desc: "Monetize your network and help great candidates" },
              { icon: "🌟", title: "Build Your Reputation", desc: "Ratings and badges that grow with every successful deal" },
            ].map((point) => (
              <div key={point.title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-vouch-sm flex items-center justify-center text-lg shrink-0"
                  style={{ backgroundColor: "#6C63FF20", color: "#6C63FF" }}>
                  {point.icon}
                </div>
                <div>
                  <p className="font-display font-semibold mb-0.5" style={{ color: "#F0F0FF" }}>{point.title}</p>
                  <p className="text-sm" style={{ color: "#8888AA" }}>{point.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <span className="font-display text-2xl font-bold" style={{ color: "#F0F0FF" }}>
              vouch<span style={{ color: "#6C63FF" }}>.</span>
            </span>
          </div>
          <SignUp
            fallbackRedirectUrl="/onboarding/role"
            appearance={{
              variables: {
                colorBackground: "#111118",
                colorInputBackground: "#0A0A0F",
                colorInputText: "#F0F0FF",
                colorText: "#F0F0FF",
                colorTextSecondary: "#8888AA",
                colorPrimary: "#6C63FF",
                colorDanger: "#FF4D6A",
                borderRadius: "8px",
              },
              elements: {
                card: "bg-transparent shadow-none border-none",
                headerTitle: "font-display",
                formButtonPrimary: "bg-[#6C63FF] hover:bg-[#7C74FF]",
                rootBox: "w-full",
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}