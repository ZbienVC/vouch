import * as React from "react"
import { cn } from "@/lib/utils"

const VouchSkeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-vouch-sm bg-[#1A1A24] animate-pulse",
          "relative overflow-hidden",
          "after:absolute after:inset-0 after:translate-x-[-100%]",
          "after:bg-gradient-to-r after:from-transparent after:via-[#2A2A38]/40 after:to-transparent",
          "after:animate-[shimmer_2s_infinite]",
          className
        )}
        {...props}
      />
    )
  }
)
VouchSkeleton.displayName = "VouchSkeleton"

export { VouchSkeleton }