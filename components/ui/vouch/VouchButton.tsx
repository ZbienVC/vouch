import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]",
  {
    variants: {
      variant: {
        primary:
          "bg-[#6C63FF] text-white hover:bg-[#7C74FF] active:scale-[0.98]",
        secondary:
          "bg-transparent text-[#F0F0FF] border border-[#2A2A38] hover:border-[#6C63FF] hover:text-[#6C63FF]",
        ghost:
          "bg-transparent text-[#8888AA] hover:text-[#F0F0FF] hover:bg-[#1A1A24]",
        destructive:
          "bg-[#FF4D6A] text-white hover:bg-[#ff6680] active:scale-[0.98]",
      },
      size: {
        sm: "h-8 px-3 text-sm rounded-vouch-sm gap-1.5",
        md: "h-10 px-4 text-sm rounded-vouch gap-2",
        lg: "h-12 px-6 text-base rounded-vouch gap-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface VouchButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

const VouchButton = React.forwardRef<HTMLButtonElement, VouchButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : null}
        {children}
      </button>
    )
  }
)
VouchButton.displayName = "VouchButton"

export { VouchButton, buttonVariants }