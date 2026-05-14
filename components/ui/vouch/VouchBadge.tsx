import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-vouch-pill transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#1A1A24] text-[#8888AA]",
        success: "bg-[#00D4AA]/15 text-[#00D4AA]",
        warning: "bg-[#FFB547]/15 text-[#FFB547]",
        error: "bg-[#FF4D6A]/15 text-[#FF4D6A]",
        purple: "bg-[#6C63FF]/15 text-[#6C63FF]",
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
  ({ className, variant, ...props }, ref) => {
    return (
      <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
    )
  }
)
VouchBadge.displayName = "VouchBadge"

export { VouchBadge, badgeVariants }