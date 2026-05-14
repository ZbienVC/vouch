import * as React from "react"
import { cn } from "@/lib/utils"

export type VouchCardVariant = "flat" | "elevated" | "interactive"

export interface VouchCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean
  elevated?: boolean
  variant?: VouchCardVariant
}

const VouchCard = React.forwardRef<HTMLDivElement, VouchCardProps>(
  ({ className, glow, elevated, variant = "flat", children, style, ...props }, ref) => {
    const resolvedVariant = elevated ? "elevated" : variant

    const baseStyle: React.CSSProperties = {
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      ...(resolvedVariant === "elevated" && {
        background: "var(--surface-raised)",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.3)",
      }),
      ...(glow && { boxShadow: "0 0 24px rgba(99, 102, 241, 0.15)" }),
    }

    return (
      <div
        ref={ref}
        className={cn("p-6", className)}
        style={{ ...baseStyle, ...style }}
        onMouseEnter={(e) => {
          if (resolvedVariant === "interactive") {
            e.currentTarget.style.transform = "translateY(-4px)"
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(99, 102, 241, 0.12)"
            e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.3)"
          }
          props.onMouseEnter?.(e)
        }}
        onMouseLeave={(e) => {
          if (resolvedVariant === "interactive") {
            e.currentTarget.style.transform = ""
            e.currentTarget.style.boxShadow = ""
            e.currentTarget.style.borderColor = "var(--border)"
          }
          props.onMouseLeave?.(e)
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
VouchCard.displayName = "VouchCard"

const VouchCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props} />
  )
)
VouchCardHeader.displayName = "VouchCardHeader"

const VouchCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-display text-lg font-semibold text-[var(--text-primary)]", className)}
      {...props}
    />
  )
)
VouchCardTitle.displayName = "VouchCardTitle"

const VouchCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-[var(--text-secondary)] text-sm", className)} {...props} />
  )
)
VouchCardContent.displayName = "VouchCardContent"

export { VouchCard, VouchCardHeader, VouchCardTitle, VouchCardContent }
