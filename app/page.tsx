'use client'

import Link from "next/link"
import { useState, useEffect } from "react"
import {
  FileText,
  Users,
  Rocket,
  Shield,
  CreditCard,
  CheckCircle,
  Wallet,
  Lock,
  ArrowRight,
} from "lucide-react"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

// ---- useCountUp hook ----
function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return count
}

// ---- Company marquee ----
const companies = [
  'Google', 'Meta', 'Amazon', 'Netflix', 'Stripe', 'Airbnb', 'Uber', 'Apple',
  'Microsoft', 'OpenAI', 'Figma', 'Notion', 'Linear', 'Vercel', 'Shopify', 'Coinbase',
]

function CompanyMarquee() {
  const doubled = [...companies, ...companies]
  return (
    <section className="py-16 overflow-hidden">
      <p className="text-center text-sm font-medium mb-6" style={{ color: 'var(--text-muted)' }}>
        Referrals at the world&apos;s top companies
      </p>
      <div className="marquee-fade">
        {/* Row 1 — left */}
        <div className="marquee-container overflow-hidden mb-4">
          <div className="animate-marquee flex gap-8 w-max">
            {doubled.map((c, i) => (
              <span
                key={i}
                className="font-mono text-sm px-4 py-2 rounded-lg transition-opacity duration-200 cursor-default select-none"
                style={{
                  color: 'rgba(241, 245, 249, 0.4)',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(241,245,249,0.8)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(241,245,249,0.4)' }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
        {/* Row 2 — right */}
        <div className="marquee-container overflow-hidden">
          <div className="animate-marquee-reverse flex gap-8 w-max">
            {doubled.map((c, i) => (
              <span
                key={i}
                className="font-mono text-sm px-4 py-2 rounded-lg transition-opacity duration-200 cursor-default select-none"
                style={{
                  color: 'rgba(241, 245, 249, 0.4)',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(241,245,249,0.8)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(241,245,249,0.4)' }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ---- Testimonials ----
const seekerTestimonials = [
  { name: "Alex Chen", company: "Google", role: "Software Engineer", quote: "Got a referral within 48 hours. Had a recruiter reach out the same week. Vouch is the real deal for breaking into FAANG.", rating: 5, initials: "AC" },
  { name: "Priya Sharma", company: "Stripe", role: "Product Manager", quote: "I'd been applying cold for months with no responses. One referral from Vouch and I had 3 interviews lined up in 2 weeks.", rating: 5, initials: "PS" },
  { name: "Marcus Johnson", company: "Airbnb", role: "Data Scientist", quote: "Worth every penny. The referral got my resume past the ATS and directly to the hiring manager.", rating: 5, initials: "MJ" },
]

const referrerTestimonials = [
  { name: "Sarah Kim", company: "Meta", role: "Senior Engineer", quote: "I've made $1,200 in my first month just referring candidates I actually believe in. It's passive income that helps people.", rating: 5, initials: "SK" },
  { name: "David Park", company: "Netflix", role: "Engineering Manager", quote: "The platform makes the whole process seamless. I review resumes on my lunch break and refer strong candidates.", rating: 5, initials: "DP" },
  { name: "Emily Torres", company: "Uber", role: "Product Designer", quote: "I get to help people break into tech while earning money. The escrow system means I only get paid when it works.", rating: 5, initials: "ET" },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mb-3">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="#F59E0B">
          <path d="M8 1l1.94 4.28 4.72.69-3.43 3.33.81 4.7L8 11.77l-4.04 2.23.81-4.7L1.34 5.97l4.72-.69L8 1z" />
        </svg>
      ))}
    </div>
  )
}

function TestimonialColumn({ testimonials, label }: { testimonials: typeof seekerTestimonials; label: string }) {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrent((c) => (c + 1) % testimonials.length)
        setVisible(true)
      }, 300)
    }, 4000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  const t = testimonials[current]

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>
        {label}
      </p>
      <div
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          background: 'rgba(15,23,41,0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(99,102,241,0.2)',
          boxShadow: '0 0 30px rgba(99,102,241,0.06) inset',
          borderRadius: '16px',
          padding: '24px',
        }}
      >
        <StarRating count={t.rating} />
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-primary)' }}>
          &ldquo;{t.quote}&rdquo;
        </p>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}
          >
            {t.initials}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t.role} · {t.company}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs" style={{ color: 'var(--accent-secondary)' }}>
            <Shield size={12} />
            <span>Verified Vouch User</span>
          </div>
        </div>
      </div>
      {/* Dot indicators */}
      <div className="flex gap-1.5 justify-center">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => { setVisible(false); setTimeout(() => { setCurrent(i); setVisible(true) }, 300) }}
            className="rounded-full transition-all duration-200"
            style={{
              width: i === current ? 20 : 6,
              height: 6,
              background: i === current ? 'var(--accent)' : 'var(--surface-high)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ---- Escrow Trust Section ----
const escrowSteps = [
  { icon: CreditCard, label: "Seeker Pays", color: "#6366F1" },
  { icon: Shield, label: "Vouch Holds", color: "#818CF8" },
  { icon: CheckCircle, label: "Referral Confirmed", color: "#2DD4BF" },
  { icon: Wallet, label: "Referrer Paid", color: "#2DD4BF" },
]

function EscrowSection() {
  return (
    <section className="py-24 max-w-4xl mx-auto px-6">
      <ScrollReveal>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4" style={{ color: 'var(--accent)' }}>
            <Shield size={24} />
            <h2 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Your money is always protected
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Our escrow system ensures you only pay when results are delivered.
          </p>
        </div>
      </ScrollReveal>

      {/* Flow nodes */}
      <ScrollReveal delay={100}>
        <div className="relative flex items-center justify-between mb-12">
          {escrowSteps.map((step, i) => {
            const IconComp = step.icon
            return (
              <div key={i} className="flex flex-col items-center gap-3 relative z-10">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: 'var(--surface)',
                    border: `2px solid ${step.color}`,
                    boxShadow: `0 0 20px ${step.color}33`,
                  }}
                >
                  <IconComp size={24} color="white" />
                </div>
                <span className="text-xs text-center font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {step.label}
                </span>
                {/* SVG connecting line */}
                {i < escrowSteps.length - 1 && (
                  <div
                    className="absolute"
                    style={{
                      top: 28,
                      left: '50%',
                      width: 'calc(100vw / 4.5)',
                      height: 2,
                    }}
                  >
                    <svg width="100%" height="2" style={{ overflow: 'visible' }}>
                      <line
                        x1="0" y1="1" x2="100%" y2="1"
                        stroke={step.color}
                        strokeWidth="2"
                        strokeDasharray="8,4"
                        className="dash-animated"
                        strokeOpacity="0.6"
                      />
                    </svg>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </ScrollReveal>

      {/* Trust bullets */}
      <ScrollReveal delay={200}>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Lock, text: "Funds held in escrow until referral is confirmed — never released early" },
            { icon: Shield, text: "Full refund if your referral isn't submitted within 48 hours" },
            { icon: CheckCircle, text: "Verified referrers with work email authentication on every deal" },
          ].map((item, i) => {
            const ItemIcon = item.icon
            return (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <ItemIcon size={18} style={{ color: 'var(--accent-secondary)', flexShrink: 0, marginTop: 2 }} />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.text}</p>
              </div>
            )
          })}
        </div>
      </ScrollReveal>
    </section>
  )
}

// ---- How it works steps ----
const howItWorksSteps = [
  {
    icon: FileText,
    title: "Post your request",
    desc: "Tell us which company you want to get into and your budget.",
  },
  {
    icon: Users,
    title: "Match with an insider",
    desc: "We connect you with a verified employee at your target company.",
  },
  {
    icon: Rocket,
    title: "Get referred",
    desc: "Payment is held in escrow and released once your referral is confirmed.",
  },
]

export default function HomePage() {
  const stat3x = useCountUp(3)
  const stat48 = useCountUp(48)

  return (
    <div
      style={{ backgroundColor: 'var(--page-bg)', minHeight: '100vh' }}
      className="relative overflow-hidden"
    >
      {/* Hero background orbs */}
      <div className="orb-purple" />
      <div className="orb-teal" />
      <div className="noise-overlay" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <span className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          vouch<span style={{ color: 'var(--accent)' }}>.</span>
        </span>
        <div className="flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-sm font-medium transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="btn-shimmer px-4 py-2 text-sm font-medium text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
              borderRadius: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.4)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = ''
              e.currentTarget.style.transform = ''
            }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-32 max-w-4xl mx-auto">
        {/* Beta badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
          style={{
            backgroundColor: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.3)',
            color: 'var(--accent)',
          }}
        >
          <span className="animate-pulse inline-block w-2 h-2 bg-green-400 rounded-full" />
          Beta — limited early access
        </div>

        {/* Headline */}
        <h1
          className="text-6xl md:text-7xl font-bold leading-tight mb-6"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}
        >
          <span className="block animate-fade-up" style={{ animationDelay: '0ms' }}>
            Get Referred.
          </span>
          <span
            className="block animate-fade-up gradient-text-animated"
            style={{ animationDelay: '300ms' }}
          >
            Get Hired.
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-xl md:text-2xl max-w-2xl mb-12 leading-relaxed animate-fade-up"
          style={{ color: 'var(--text-secondary)', animationDelay: '500ms' }}
        >
          The two-sided marketplace connecting job seekers with company insiders.
          Skip the application pile. Get your resume seen.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20 animate-fade-up" style={{ animationDelay: '600ms' }}>
          <Link
            href="/sign-up"
            className="btn-shimmer flex items-center gap-2 px-8 py-4 text-base font-semibold text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
              borderRadius: '8px',
              boxShadow: '0 0 32px rgba(99,102,241,0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.5)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 32px rgba(99,102,241,0.3)'
              e.currentTarget.style.transform = ''
            }}
          >
            Find a Referral <ArrowRight size={16} />
          </Link>
          <Link
            href="/sign-up"
            className="flex items-center gap-2 px-8 py-4 text-base font-semibold transition-all"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
              border: '1px solid var(--accent)',
              borderRadius: '8px',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-hover)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
          >
            Earn by Referring
          </Link>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-3 gap-8 w-full max-w-lg py-8 animate-fade-up"
          style={{
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            animationDelay: '700ms',
          }}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="font-display text-3xl font-bold" style={{ color: 'var(--accent)' }}>
              {stat3x}x
            </span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Higher interview rate</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-display text-3xl font-bold" style={{ color: 'var(--accent)' }}>
              {stat48}h
            </span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Average turnaround</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-display text-3xl font-bold" style={{ color: 'var(--accent)' }}>
              100%
            </span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Escrow protected</span>
          </div>
        </div>
      </main>

      {/* Company Marquee */}
      <div className="relative z-10">
        <CompanyMarquee />
      </div>

      {/* How it works */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-32">
        <ScrollReveal>
          <h2 className="font-display text-3xl font-bold text-center mb-12" style={{ color: 'var(--text-primary)' }}>
            How it works
          </h2>
        </ScrollReveal>
        <div className="relative grid md:grid-cols-3 gap-6">
          {/* Dashed connector line (desktop) */}
          <div
            className="hidden md:block absolute top-10 left-[calc(33%+24px)] right-[calc(33%+24px)] h-0"
            style={{ borderTop: '2px dashed rgba(99,102,241,0.25)', zIndex: 0 }}
          />
          {howItWorksSteps.map((feature, index) => {
            const IconComp = feature.icon
            return (
              <ScrollReveal key={feature.title} delay={index * 100}>
                <div
                  className="group relative p-6 rounded-xl border cursor-default"
                  style={{
                    background: 'var(--surface)',
                    borderColor: 'rgba(148, 163, 184, 0.12)',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.12)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(148,163,184,0.12)'
                    e.currentTarget.style.transform = ''
                    e.currentTarget.style.boxShadow = ''
                  }}
                >
                  {/* Step number watermark */}
                  <div
                    className="absolute top-4 right-4 text-7xl font-bold select-none"
                    style={{ opacity: 0.05, fontFamily: 'var(--font-syne)', lineHeight: 1 }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Icon container */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <IconComp size={24} style={{ color: 'var(--accent)' }} />
                  </div>

                  <div
                    className="font-mono text-xs font-medium mb-2"
                    style={{ color: 'var(--accent)' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {feature.desc}
                  </p>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <ScrollReveal>
          <h2 className="font-display text-3xl font-bold text-center mb-4" style={{ color: 'var(--text-primary)' }}>
            Real stories. Real results.
          </h2>
          <p className="text-center mb-12" style={{ color: 'var(--text-secondary)' }}>
            Join thousands of job seekers and referrers already using Vouch.
          </p>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 gap-8">
          <ScrollReveal delay={0}>
            <TestimonialColumn testimonials={seekerTestimonials} label="Job Seekers" />
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <TestimonialColumn testimonials={referrerTestimonials} label="Referrers" />
          </ScrollReveal>
        </div>
      </section>

      {/* Escrow Trust */}
      <div className="relative z-10">
        <EscrowSection />
      </div>

      {/* CTA Banner */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-32">
        <ScrollReveal>
          <div
            className="rounded-2xl p-12 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(45,212,191,0.08))',
              border: '1px solid rgba(99,102,241,0.25)',
              boxShadow: '0 0 60px rgba(99,102,241,0.08)',
            }}
          >
            <h2
              className="text-4xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}
            >
              Ready to skip the line?
            </h2>
            <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
              Join Vouch and get your resume in front of the right people.
            </p>
            <Link
              href="/sign-up"
              className="btn-shimmer inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white"
              style={{
                background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                borderRadius: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.4)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = ''
                e.currentTarget.style.transform = ''
              }}
            >
              Get Started Free <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer
        className="relative z-10 text-center py-8 text-sm"
        style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}
      >
        <p>© 2025 Vouch. All rights reserved.</p>
      </footer>
    </div>
  )
}
