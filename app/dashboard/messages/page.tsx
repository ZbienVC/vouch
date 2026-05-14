"use client"

import { MessageCircle } from "lucide-react"
import EmptyState from "@/components/ui/EmptyState"
import "./stream-theme.css"

const hasStreamKey = Boolean(process.env.NEXT_PUBLIC_STREAM_API_KEY)

export default function MessagesPage() {
  if (!hasStreamKey) {
    return (
      <div className="flex flex-col h-full min-h-[60vh]">
        <EmptyState
          icon={MessageCircle}
          title="Messaging coming soon"
          description="Connect with referrers and seekers through our secure in-app messaging system."
          action={{ label: "Find a Referrer", href: "/dashboard/browse" }}
        />
      </div>
    )
  }

  return (
    <div
      className="flex h-full"
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      {/* Conversation list panel */}
      <div
        className="flex flex-col"
        style={{
          width: 240,
          flexShrink: 0,
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
        }}
      >
        <div
          className="px-4 py-3 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <h3
            className="font-display font-semibold"
            style={{ fontSize: 14, color: "var(--text-primary)" }}
          >
            Conversations
          </h3>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <EmptyState
            icon={MessageCircle}
            title="No conversations yet"
            description="Start a deal to begin messaging"
            action={{ label: "Find a Referrer", href: "/dashboard/browse" }}
          />
        </div>
      </div>

      {/* Chat area */}
      <div
        className="flex-1 flex flex-col items-center justify-center"
        style={{ background: "var(--background)" }}
      >
        <div className="text-center">
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(99,102,241,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <MessageCircle size={28} color="var(--text-muted)" />
          </div>
          <p
            className="font-display font-semibold"
            style={{ fontSize: 16, color: "var(--text-primary)", marginBottom: 8 }}
          >
            Select a conversation
          </p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Choose a conversation from the left to start chatting
          </p>
        </div>
      </div>
    </div>
  )
}