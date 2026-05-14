import * as React from "react"
import { cn } from "@/lib/utils"

export interface VouchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const VouchInput = React.forwardRef<HTMLInputElement, VouchInputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full h-10 px-3 py-2 text-sm rounded-vouch-sm",
            "bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)]",
            "placeholder:text-[var(--text-muted)]",
            "outline-none transition-all duration-200",
            "focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]/20",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-[var(--error)]">{error}</p>
        )}
      </div>
    )
  }
)
VouchInput.displayName = "VouchInput"

export { VouchInput }
