import { NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

interface CompleteBody {
  userType: "seeker" | "referrer" | "both"
  fullName: string
  avatarUrl: string
  linkedinUrl: string
  location: string
  resumeUrl: string
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const clerkUser = await currentUser()
  if (!clerkUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const body = (await req.json()) as CompleteBody
  const { userType, fullName, avatarUrl, linkedinUrl, location, resumeUrl } = body

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? ""

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: {
      email,
      fullName: fullName || null,
      avatarUrl: avatarUrl || null,
      userType: userType ?? undefined,
      linkedinUrl: linkedinUrl || null,
    },
    create: {
      clerkId: userId,
      email,
      fullName: fullName || null,
      avatarUrl: avatarUrl || null,
      userType: userType ?? undefined,
      linkedinUrl: linkedinUrl || null,
    },
  })

  if (userType === "referrer" || userType === "both") {
    await prisma.referrerProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    })
  }

  if (userType === "seeker" || userType === "both") {
    await prisma.seekerProfile.upsert({
      where: { userId: user.id },
      update: {
        resumeUrl: resumeUrl || null,
        currentLocation: location || null,
      },
      create: {
        userId: user.id,
        resumeUrl: resumeUrl || null,
        currentLocation: location || null,
      },
    })
  }

  const userName = fullName || email.split("@")[0] || "there"

  return NextResponse.json({ success: true, userId: user.id, userName })
}