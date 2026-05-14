import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import EarningsClient from "@/components/dashboard/EarningsClient"

interface TransactionRow {
  id: string
  date: string
  amountCents: number
  feeCents: number
  receivedCents: number
  status: "pending" | "completed" | "refunded"
}

export default async function EarningsPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      referrerProfile: true,
    },
  })

  if (!user) redirect("/sign-in")

  const hasStripeConnect = false

  const mockTransactions: TransactionRow[] = [
    {
      id: "deal-abc123",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      amountCents: 30000,
      feeCents: 3000,
      receivedCents: 27000,
      status: "completed",
    },
    {
      id: "deal-def456",
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      amountCents: 40000,
      feeCents: 4000,
      receivedCents: 36000,
      status: "completed",
    },
    {
      id: "deal-ghi789",
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      amountCents: 25000,
      feeCents: 2500,
      receivedCents: 22500,
      status: "completed",
    },
  ]

  return (
    <EarningsClient
      hasStripeConnect={hasStripeConnect}
      transactions={mockTransactions}
    />
  )
}