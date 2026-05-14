/* eslint-disable @next/next/no-img-element */
import * as React from "react"
import { cn } from "@/lib/utils"

type AvatarSize = "sm" | "md" | "lg" | "xl"

const sizeMap: Record<AvatarSize, { px: number; text: string }> = {
  sm: { px: 32, text: "text-xs" },
  md: { px: 40, text: "text-sm" },
  lg: { px: 56, text: "text-base" },
  xl: { px: 80, text: "text-xl" },
}

function getInitials(name?: string): string {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export interface VouchAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  name?: string
  size?: AvatarSize
  alt?: string
}

const VouchAvatar = React.forwardRef<HTMLDivElement, VouchAvatarProps>(
  ({ className, src, name, size = "md", alt, ...props }, ref) => {
    const { px, text } = sizeMap[size]
    const [imgError, setImgError] = React.useState(false)

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0",
          className
        )}
        style={{ width: px, height: px }}
        {...props}
      >
        {src && !imgError ? (
          <img
            src={src}
            alt={alt || name || "avatar"}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className={cn(
              "w-full h-full flex items-center justify-center font-display font-semibold text-white",
              text
            )}
            style={{
              background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%)",
            }}
          >
            {getInitials(name)}
          </div>
        )}
      </div>
    )
  }
)
VouchAvatar.displayName = "VouchAvatar"

export { VouchAvatar }
