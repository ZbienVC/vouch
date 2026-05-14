import * as React from "react"
import { cn } from "@/lib/utils"

const VouchSkeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("rounded-vouch-sm skeleton-shimmer", className)}
        {...props}
      />
    )
  }
)
VouchSkeleton.displayName = "VouchSkeleton"

export { VouchSkeleton }