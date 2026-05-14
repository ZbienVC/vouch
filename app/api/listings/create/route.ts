import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { z } from "zod"

const createListingSchema = z.object({
  companyName: z.string().min(1),
  roleTypes: z.array(z.string()).min(1),
  departments: z.string().optional(),
  priceCents: z.number().int().min(2500),
  description: z.string().min(50).max(1000),
  duration: z.enum(["always", "30", "14", "7"]),
})

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { referrerProfile: true },
  })

  if (!user || !user.referrerProfile) {
    return NextResponse.json({ error: "Referrer profile not found" }, { status: 404 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = createListingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 })
  }

  const { companyName, roleTypes, departments, priceCents, description, duration } = parsed.data

  let expiresAt: Date | null = null
  if (duration !== "always") {
    const days = parseInt(duration, 10)
    expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
  }

  const listing = await prisma.listing.create({
    data: {
      referrerId: user.referrerProfile.id,
      companyName,
      roleTypes,
      priceCents,
      description: departments ? `${description}\n\nDepartments: ${departments}` : description,
      isActive: true,
    },
  })

  void expiresAt

  return NextResponse.json({ listing }, { status: 201 })
}