"use client"

import { useState } from "react"
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
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"
import { VouchAvatar } from "@/components/ui/vouch"

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  section?: string
}

const seekerNav: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: House, section: "MARKETPLACE" },
  { href: "/dashboard/browse", label: "Browse Referrers", icon: Search, section: "MARKETPLACE" },
  { href: "/dashboard/requests", label: "My Requests", icon: FileText, section: "MARKETPLACE" },
  { href: "/dashboard/deals", label: "My Deals", icon: GitMerge, section: "MARKETPLACE" },
  { href: "/dashboard/messages", label: "Messages", icon: MessageCircle, section: "ACCOUNT" },
  { href: "/dashboard/profile", label: "Profile", icon: User, section: "ACCOUNT" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, section: "ACCOUNT" },
]

const referrerNav: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: House, section: "MARKETPLACE" },
  { href: "/dashboard/browse-requests", label: "Browse Requests", icon: Search, section: "MARKETPLACE" },
  { href: "/dashboard/listings", label: "My Listings", icon: List, section: "MARKETPLACE" },
  { href: "/dashboard/deals", label: "My Deals", icon: GitMerge, section: "MARKETPLACE" },
  { href: "/dashboard/earnings", label: "Earnings", icon: DollarSign, section: "MARKETPLACE" },
  { href: "/dashboard/messages", label: "Messages", icon: MessageCircle, section: "ACCOUNT" },
  { href: "/dashboard/profile", label: "Profile", icon: User, section: "ACCOUNT" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, section: "ACCOUNT" },
]

interface SidebarProps {
  userType: "seeker" | "referrer" | "both"
  userName: string
  userEmail: string
  avatarUrl?: string | null
  notifications?: Record<string, number>
}

export default function Sidebar({
  userType,
  userName,
  userEmail,
  avatarUrl,
  notifications = {},
}: SidebarProps) {
  const pathname = usePathname()
  const { signOut } = useClerk()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const navItems = userType === "referrer" ? referrerNav : seekerNav

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  const handleSignOut = () => {
    signOut(() => router.push("/"))
  }

  // Group nav items by section
  const sections: { label: string; items: NavItem[] }[] = []
  let currentSection = ""
  for (const item of navItems) {
    const sec = item.section ?? ""
    if (sec !== currentSection) {
      currentSection = sec
      sections.push({ label: sec, items: [item] })
    } else {
      sections[sections.length - 1].items.push(item)
    }
  }

  return (
    <div
      className="flex flex-col h-full relative"
      style={{
        width: collapsed ? 64 : 240,
        transition: "width 0.2s ease",
        overflow: "hidden",
      }}
    >
      {/* Logo + collapse toggle */}
      <div
        className="flex items-center border-b border-[var(--border)] shrink-0"
        style={{
          height: 64,
          padding: collapsed ? "0 0 0 16px" : "0 12px 0 24px",
          justifyContent: collapsed ? "center" : "space-between",
        }}
      >
        {!collapsed && (
          <Link
            href="/dashboard"
            className="font-display text-xl font-bold text-[var(--text-primary)] whitespace-nowrap"
          >
            vouch<span className="text-[var(--accent)]">.</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex items-center justify-center w-7 h-7 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-all duration-150 shrink-0"
          style={{ marginLeft: collapsed ? 0 : "auto" }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        {sections.map((section) => (
          <div key={section.label}>
            {/* Section label */}
            {!collapsed && section.label && (
              <p
                className="px-4 py-2 mt-3 first:mt-0"
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                {section.label}
              </p>
            )}
            {!collapsed && <div style={{ height: collapsed ? 8 : 0 }} />}
            {section.items.map((item) => {
              const active = isActive(item.href)
              const Icon = item.icon
              const notifCount = notifications[item.href] ?? 0
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={[
                    "flex items-center gap-3 text-sm font-medium transition-all duration-150 relative",
                    active
                      ? "text-[var(--text-primary)] bg-[rgba(99,102,241,0.08)]"
                      : "text-[var(--text-secondary)] opacity-70 hover:opacity-100 hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]",
                  ].join(" ")}
                  style={{
                    height: 40,
                    padding: collapsed ? "0 0 0 20px" : "0 12px 0 16px",
                    borderLeft: active ? "3px solid var(--accent)" : "3px solid transparent",
                    justifyContent: collapsed ? "center" : "flex-start",
                  }}
                >
                  <span className="relative shrink-0">
                    <Icon size={18} />
                    {notifCount > 0 && (
                      <span
                        className="absolute -top-1 -right-1 bg-[var(--error)] rounded-full"
                        style={{ width: 8, height: 8, display: "block" }}
                      />
                    )}
                  </span>
                  {!collapsed && (
                    <span className="whitespace-nowrap truncate">{item.label}</span>
                  )}
                  {!collapsed && notifCount > 0 && (
                    <span
                      className="ml-auto text-xs font-semibold bg-[var(--error)] text-white rounded-full px-1.5"
                      style={{ minWidth: 18, textAlign: "center", fontSize: 10 }}
                    >
                      {notifCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div
        className="border-t border-[var(--border)] shrink-0"
        style={{ padding: collapsed ? "12px 0" : "12px 12px" }}
      >
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <VouchAvatar src={avatarUrl ?? undefined} name={userName} size="sm" />
            <button
              onClick={handleSignOut}
              title="Sign out"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--surface-raised)] transition-all duration-150"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-2 px-2">
              <VouchAvatar src={avatarUrl ?? undefined} name={userName} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{userName}</p>
                <p className="text-xs text-[var(--text-secondary)] truncate">{userEmail}</p>
              </div>
              <Link
                href="/dashboard/settings"
                className="shrink-0 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                title="Settings"
              >
                <Settings size={15} />
              </Link>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--error)] transition-colors rounded-lg hover:bg-[var(--surface-raised)]"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}