import * as React from "react"
import { cn } from "@/lib/utils"

export interface VouchCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean
  elevated?: boolean
}

const VouchCard = React.forwardRef<HTMLDivElement, VouchCardProps>(
  ({ className, glow, elevated, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-vouch border border-[var(--border)] p-6 transition-all duration-200",
          elevated ? "bg-[var(--surface-raised)]" : "bg-[var(--surface)]",
          glow && "shadow-[0_0_24px_rgba(99,102,241,0.15)]",
          className
        )}
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
