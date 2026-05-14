import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { z } from "zod"

const createDealSchema = z.object({
  requestId: z.string().min(1),
  agreedPriceCents: z.number().int().min(1),
})

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { referrerProfile: true },
  })

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = createDealSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 })
  }

  const { requestId, agreedPriceCents } = parsed.data

  // For mock requests (IDs starting with "req-"), create a minimal deal without DB request lookup
  const isMockRequest = requestId.startsWith("req-")

  if (isMockRequest) {
    const platformFeeCents = Math.round(agreedPriceCents * 0.1)
    const referrerPayoutCents = agreedPriceCents - platformFeeCents

    // For mock requests we need a real seeker - use the referrer as a placeholder seeker
    // In production this would be the seeker's user ID
    const seekerId = user.id

    const deal = await prisma.deal.create({
      data: {
        seekerId,
        referrerId: user.id,
        agreedPriceCents,
        platformFeeCents,
        referrerPayoutCents,
        status: "pending_payment",
      },
    })

    return NextResponse.json({ dealId: deal.id }, { status: 201 })
  }

  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: { seeker: { include: { user: true } } },
  })

  if (!request || request.status !== "open") {
    return NextResponse.json({ error: "Request not found or no longer available" }, { status: 404 })
  }

  const platformFeeCents = Math.round(agreedPriceCents * 0.1)
  const referrerPayoutCents = agreedPriceCents - platformFeeCents

  const [deal] = await prisma.$transaction([
    prisma.deal.create({
      data: {
        requestId,
        seekerId: request.seeker.user.id,
        referrerId: user.id,
        agreedPriceCents,
        platformFeeCents,
        referrerPayoutCents,
        status: "pending_payment",
      },
    }),
    prisma.request.update({
      where: { id: requestId },
      data: { status: "matched" },
    }),
  ])

  return NextResponse.json({ dealId: deal.id }, { status: 201 })
}