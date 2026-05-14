import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { referrerProfile: true },
  })

  if (!user?.referrerProfile) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const listing = await prisma.listing.findFirst({
    where: { id, referrerId: user.referrerProfile.id },
  })

  if (!listing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await prisma.listing.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { referrerProfile: true },
  })

  if (!user?.referrerProfile) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const isActive = (body as { isActive?: boolean })?.isActive

  const listing = await prisma.listing.findFirst({
    where: { id, referrerId: user.referrerProfile.id },
  })

  if (!listing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const updated = await prisma.listing.update({
    where: { id },
    data: { isActive: Boolean(isActive) },
  })

  return NextResponse.json({ listing: updated })
}