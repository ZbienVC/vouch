import * as React from "react"
import { cn } from "@/lib/utils"

export interface VouchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const VouchInput = React.forwardRef<HTMLInputElement, VouchInputProps>(
  ({ className, label, error, id, style, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium"
            style={{ color: "var(--text-secondary)", fontSize: 13, fontWeight: 500 }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-3 py-2 text-sm",
            "text-[var(--text-primary)]",
            "outline-none",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          style={{
            height: "46px",
            background: "var(--bg-elevated)",
            border: error
              ? "1px solid var(--warning)"
              : "1px solid var(--border-subtle)",
            borderRadius: "10px",
            fontSize: "14px",
            color: "var(--text-primary)",
            transition: "all 0.2s ease",
            ...style,
          }}
          placeholder={props.placeholder}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--border-focus)"
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.12)"
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error
              ? "var(--warning)"
              : "var(--border-subtle)"
            e.currentTarget.style.boxShadow = ""
            props.onBlur?.(e)
          }}
          {...props}
        />
        {error && (
          <p className="text-xs" style={{ color: "var(--warning)" }}>{error}</p>
        )}
      </div>
    )
  }
)
VouchInput.displayName = "VouchInput"

export { VouchInput }
