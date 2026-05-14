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
            className="text-sm font-medium text-[#8888AA]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full h-10 px-3 py-2 text-sm rounded-vouch-sm",
            "bg-[#111118] border border-[#2A2A38] text-[#F0F0FF]",
            "placeholder:text-[#55556A]",
            "outline-none transition-all duration-200",
            "focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-[#FF4D6A] focus:border-[#FF4D6A] focus:ring-[#FF4D6A]/20",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-[#FF4D6A]">{error}</p>
        )}
      </div>
    )
  }
)
VouchInput.displayName = "VouchInput"

export { VouchInput }