import { LucideIcon } from 'lucide-react'

interface IconProps {
  icon: LucideIcon
  size?: 16 | 20 | 24 | 32
  className?: string
  glow?: boolean
}

export function Icon({ icon: LucideIconComp, size = 20, className, glow }: IconProps) {
  const IconComponent = LucideIconComp as React.ComponentType<{ size: number; className?: string; 'aria-hidden': boolean }>
  if (glow) {
    return (
      <div
        className="flex items-center justify-center w-10 h-10 rounded-full"
        style={{ background: 'rgba(99, 102, 241, 0.15)' }}
      >
        <IconComponent size={size} className={className} aria-hidden={true} />
      </div>
    )
  }
  return <IconComponent size={size} className={className} aria-hidden={true} />
}
