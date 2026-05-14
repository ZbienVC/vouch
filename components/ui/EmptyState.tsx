"use client"

import type { LucideIcon } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center"
      style={{ padding: "48px 24px" }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "rgba(99,102,241,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <Icon size={36} color="var(--text-muted)" strokeWidth={1.5} />
      </div>
      <h3
        className="font-display font-semibold"
        style={{ fontSize: 18, color: "var(--text-primary)", marginBottom: 8 }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 14,
          color: "var(--text-secondary)",
          maxWidth: 320,
          marginBottom: action ? 24 : 0,
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
      {action && (
        action.href ? (
          <Link
            href={action.href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: 40,
              padding: "0 20px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              color: "var(--text-primary)",
              background: "var(--surface-raised)",
              border: "1px solid var(--border)",
              textDecoration: "none",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.borderColor = "rgba(99,102,241,0.4)"
              el.style.background = "var(--surface-high)"
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.borderColor = "var(--border)"
              el.style.background = "var(--surface-raised)"
            }}
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: 40,
              padding: "0 20px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              color: "var(--text-primary)",
              background: "var(--surface-raised)",
              border: "1px solid var(--border)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.borderColor = "rgba(99,102,241,0.4)"
              el.style.background = "var(--surface-high)"
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.borderColor = "var(--border)"
              el.style.background = "var(--surface-raised)"
            }}
          >
            {action.label}
          </button>
        )
      )}
    </div>
  )
}