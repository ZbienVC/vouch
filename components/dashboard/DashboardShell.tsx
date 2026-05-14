"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import Sidebar from "./Sidebar"

interface DashboardShellProps {
  children: React.ReactNode
  userType: "seeker" | "referrer" | "both"
  userName: string
  userEmail: string
  avatarUrl?: string | null
}

export default function DashboardShell({
  children,
  userType,
  userName,
  userEmail,
  avatarUrl,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const pageTitleMap: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/browse": "Browse Referrers",
    "/dashboard/browse-requests": "Browse Requests",
    "/dashboard/requests": "My Requests",
    "/dashboard/deals": "My Deals",
    "/dashboard/messages": "Messages",
    "/dashboard/profile": "Profile",
    "/dashboard/settings": "Settings",
    "/dashboard/listings": "My Listings",
    "/dashboard/earnings": "Earnings",
  }

  const pageTitle = pageTitleMap[pathname] ?? "Dashboard"

  return (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col shrink-0 bg-[var(--surface)] border-r border-[var(--border)]" style={{ transition: "width 0.2s ease" }}>
        <Sidebar
          userType={userType}
          userName={userName}
          userEmail={userEmail}
          avatarUrl={avatarUrl}
        />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative flex flex-col w-[240px] h-full bg-[var(--surface)] border-r border-[var(--border)]">
            <Sidebar
              userType={userType}
              userName={userName}
              userEmail={userEmail}
              avatarUrl={avatarUrl}
            />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 h-14 bg-[var(--surface)] border-b border-[var(--border)] shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Open menu"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <span className="font-display text-lg font-bold text-[var(--text-primary)]">
            vouch<span className="text-[var(--accent)]">.</span>
          </span>
          <div className="w-6" />
        </header>

        {/* Desktop top bar */}
        <header className="hidden md:flex items-center justify-between px-8 h-16 bg-[var(--surface)] border-b border-[var(--border)] shrink-0">
          <h1 className="font-display text-lg font-semibold text-[var(--text-primary)]">{pageTitle}</h1>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto bg-[var(--background)] p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}