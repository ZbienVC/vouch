"use client"

import { VouchCard, VouchButton, VouchBadge } from "@/components/ui/vouch"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface TransactionRow {
  id: string
  date: string
  amountCents: number
  feeCents: number
  receivedCents: number
  status: "pending" | "completed" | "refunded"
}

interface EarningsClientProps {
  hasStripeConnect: boolean
  transactions: TransactionRow[]
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

function truncateId(id: string): string {
  return id.length > 12 ? `${id.slice(0, 8)}...` : id
}

function getMonthlyData() {
  const months = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    months.push({
      name: d.toLocaleString("en-US", { month: "short" }),
      earnings: 0,
    })
  }
  return months
}

export default function EarningsClient({
  hasStripeConnect,
  transactions,
}: EarningsClientProps) {
  const totalEarned = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.receivedCents, 0)

  const pendingEarned = transactions
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + t.receivedCents, 0)

  const monthlyData = getMonthlyData()

  const firstMonth = monthlyData[0]?.name ?? ""
  const lastMonth = monthlyData[monthlyData.length - 1]?.name ?? ""
  const year = new Date().getFullYear()

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">
        Earnings
      </h1>

      {/* Balance Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <VouchCard className="space-y-1">
          <p className="text-sm text-[var(--text-secondary)]">Total Earned</p>
          <p className="font-display text-3xl font-bold text-[#00D4AA]">
            {formatCents(totalEarned)}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">All time</p>
        </VouchCard>

        <VouchCard className="space-y-1">
          <p className="text-sm text-[var(--text-secondary)]">Pending (In Escrow)</p>
          <p className="font-display text-3xl font-bold text-[#FFB547]">
            {formatCents(pendingEarned)}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">Awaiting completion</p>
        </VouchCard>

        <VouchCard className="space-y-2">
          <p className="text-sm text-[var(--text-secondary)]">Available to Withdraw</p>
          <p className="font-display text-3xl font-bold text-[var(--accent)]">$0.00</p>
          <VouchButton
            variant="secondary"
            size="sm"
            disabled
            className="w-full"
          >
            Withdraw
          </VouchButton>
        </VouchCard>
      </div>

      {/* Stripe Connect Banner */}
      {!hasStripeConnect && (
        <div
          className="rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{
            background: "linear-gradient(135deg, #FFB54710 0%, #6C63FF08 100%)",
            border: "1px solid #FFB54730",
          }}
        >
          <div>
            <p className="font-display font-semibold text-[var(--text-primary)]">
              Set up payouts
            </p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Set up payouts to receive your earnings directly to your bank account.
            </p>
          </div>
          <VouchButton variant="primary" size="md" className="shrink-0">
            Connect Bank Account
          </VouchButton>
        </div>
      )}

      {/* Transaction History */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
          Transaction History
        </h2>

        {transactions.length === 0 ? (
          <VouchCard className="flex flex-col items-center justify-center py-12 text-center space-y-3">
            <p className="text-[var(--text-secondary)]">
              No transactions yet. Complete your first referral to see earnings here.
            </p>
          </VouchCard>
        ) : (
          <VouchCard className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left px-4 py-3 text-[var(--text-secondary)] font-medium">
                    Deal ID
                  </th>
                  <th className="text-left px-4 py-3 text-[var(--text-secondary)] font-medium">
                    Date
                  </th>
                  <th className="text-right px-4 py-3 text-[var(--text-secondary)] font-medium">
                    Amount
                  </th>
                  <th className="text-right px-4 py-3 text-[var(--text-secondary)] font-medium">
                    Fee
                  </th>
                  <th className="text-right px-4 py-3 text-[var(--text-secondary)] font-medium">
                    You Received
                  </th>
                  <th className="text-left px-4 py-3 text-[var(--text-secondary)] font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#1A1A24] transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-[var(--text-secondary)]">
                        {truncateId(tx.id)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {formatDate(tx.date)}
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--text-primary)]">
                      {formatCents(tx.amountCents)}
                    </td>
                    <td className="px-4 py-3 text-right text-[#FF4D6A]">
                      -{formatCents(tx.feeCents)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-[#00D4AA]">
                      {formatCents(tx.receivedCents)}
                    </td>
                    <td className="px-4 py-3">
                      {tx.status === "completed" && (
                        <VouchBadge variant="success">Completed</VouchBadge>
                      )}
                      {tx.status === "pending" && (
                        <VouchBadge variant="warning">Pending</VouchBadge>
                      )}
                      {tx.status === "refunded" && (
                        <VouchBadge variant="error">Refunded</VouchBadge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </VouchCard>
        )}
      </div>

      {/* Monthly Earnings Chart */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
            Monthly Earnings
          </h2>
          <span className="text-sm text-[var(--text-secondary)]">
            {firstMonth} – {lastMonth} {year}
          </span>
        </div>

        <VouchCard>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={monthlyData}
              margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#2A2A38"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "#8888AA", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#8888AA", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `$${v}`}
              />
              <Tooltip
                contentStyle={{
                  background: "#111118",
                  border: "1px solid #2A2A38",
                  borderRadius: "8px",
                  color: "#F0F0FF",
                  fontSize: 13,
                }}
                formatter={(value: number) => [`$${value}`, "Earnings"]}
                cursor={{ fill: "#6C63FF10" }}
              />
              <Bar
                dataKey="earnings"
                fill="#6C63FF"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </VouchCard>
      </div>
    </div>
  )
}