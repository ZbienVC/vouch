import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[var(--surface-raised)] text-[var(--text-secondary)]",
        success: "bg-[var(--success)]/15 text-[var(--success)]",
        warning: "bg-[var(--warning)]/15 text-[var(--warning)]",
        error: "bg-[var(--error)]/15 text-[var(--error)]",
        purple: "bg-[var(--accent)]/15 text-[var(--accent)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface VouchBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const VouchBadge = React.forwardRef<HTMLSpanElement, VouchBadgeProps>(
  ({ className, variant, style, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        style={{ borderRadius: "20px", ...style }}
        {...props}
      />
    )
  }
)
VouchBadge.displayName = "VouchBadge"

export { VouchBadge, badgeVariants }
