"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useClerk } from "@clerk/nextjs"
import type { LucideIcon } from "lucide-react"
import {
  House,
  Search,
  FileText,
  GitMerge,
  MessageCircle,
  User,
  Settings,
  List,
  DollarSign,
} from "lucide-react"
import { VouchAvatar } from "@/components/ui/vouch"

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

const seekerNav: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: House },
  { href: "/dashboard/browse", label: "Browse Referrers", icon: Search },
  { href: "/dashboard/requests", label: "My Requests", icon: FileText },
  { href: "/dashboard/deals", label: "My Deals", icon: GitMerge },
  { href: "/dashboard/messages", label: "Messages", icon: MessageCircle },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

const referrerNav: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: House },
  { href: "/dashboard/browse-requests", label: "Browse Requests", icon: Search },
  { href: "/dashboard/listings", label: "My Listings", icon: List },
  { href: "/dashboard/deals", label: "My Deals", icon: GitMerge },
  { href: "/dashboard/earnings", label: "Earnings", icon: DollarSign },
  { href: "/dashboard/messages", label: "Messages", icon: MessageCircle },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

interface SidebarProps {
  userType: "seeker" | "referrer" | "both"
  userName: string
  userEmail: string
  avatarUrl?: string | null
}

export default function Sidebar({ userType, userName, userEmail, avatarUrl }: SidebarProps) {
  const pathname = usePathname()
  const { signOut } = useClerk()
  const router = useRouter()

  const navItems = userType === "referrer" ? referrerNav : seekerNav

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  const handleSignOut = () => {
    signOut(() => router.push("/"))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[var(--border)]">
        <Link href="/dashboard" className="font-display text-xl font-bold text-[var(--text-primary)]">
          vouch<span className="text-[var(--accent)]">.</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                active
                  ? "bg-[var(--accent)]/10 text-[var(--accent)] border-l-4 border-[var(--accent)] pl-[calc(0.75rem-4px)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]",
              ].join(" ")}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-[var(--border)]">
        <div className="flex items-center gap-3 mb-3">
          <VouchAvatar src={avatarUrl ?? undefined} name={userName} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">{userName}</p>
            <p className="text-xs text-[var(--text-secondary)] truncate">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full text-sm text-[var(--text-secondary)] hover:text-[var(--error)] transition-colors text-left px-1 py-1"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}