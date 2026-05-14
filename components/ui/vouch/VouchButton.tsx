import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none",
  {
    variants: {
      variant: {
        primary:
          "btn-shimmer text-white active:scale-[0.98]",
        secondary:
          "bg-transparent text-[var(--text-primary)] border border-[var(--accent)] hover:text-[var(--accent-hover)]",
        ghost:
          "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline",
        destructive:
          "bg-[var(--error)] text-white hover:opacity-90 active:scale-[0.98]",
      },
      size: {
        sm: "h-9 px-3 text-sm gap-1.5",
        md: "h-11 px-4 text-sm gap-2",
        lg: "h-11 px-6 text-base gap-2",
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
  ({ className, variant, size, loading, disabled, style, children, ...props }, ref) => {
    const isPrimary = !variant || variant === "primary"
    const isSecondary = variant === "secondary"
    const isGhost = variant === "ghost"

    const getBorderRadius = () => {
      if (isPrimary) return "50px"
      if (isSecondary || isGhost) return "10px"
      return "10px"
    }

    const primaryStyle: React.CSSProperties = isPrimary
      ? {
          background: "linear-gradient(135deg, #6366F1, #4F46E5)",
          borderRadius: getBorderRadius(),
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          outline: "none",
        }
      : {
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          outline: "none",
          borderRadius: getBorderRadius(),
        }

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        style={{ ...primaryStyle, ...style }}
        onMouseEnter={(e) => {
          if (isPrimary && !(disabled || loading)) {
            const el = e.currentTarget
            el.style.boxShadow = "0 4px 20px rgba(99, 102, 241, 0.4)"
            el.style.transform = "translateY(-1px)"
          }
          props.onMouseEnter?.(e)
        }}
        onMouseLeave={(e) => {
          if (isPrimary) {
            const el = e.currentTarget
            el.style.boxShadow = ""
            el.style.transform = ""
          }
          props.onMouseLeave?.(e)
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = "2px solid rgba(99, 102, 241, 0.6)"
          e.currentTarget.style.outlineOffset = "2px"
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = "none"
          props.onBlur?.(e)
        }}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          children
        )}
      </button>
    )
  }
)
VouchButton.displayName = "VouchButton"

export { VouchButton, buttonVariants }
