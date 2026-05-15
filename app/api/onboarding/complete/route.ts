import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { userType, fullName, avatarUrl, linkedinUrl, location, resumeUrl } = body

    let userName = fullName || "there"

    // Try to save to DB — but don't fail onboarding if DB isn't ready
    try {
      // Get Clerk user email
      const { currentUser } = await import("@clerk/nextjs/server")
      const clerkUser = await currentUser()
      const email = clerkUser?.emailAddresses?.[0]?.emailAddress || ""

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
          linkedinUrl: linkedinUrl || null,
          userType: userType || "seeker",
        },
      })

      // Create seeker profile if needed
      if (userType === "seeker" || userType === "both") {
        await prisma.seekerProfile.upsert({
          where: { userId: user.id },
          update: { currentLocation: location || null, resumeUrl: resumeUrl || null },
          create: {
            userId: user.id,
            currentLocation: location || null,
            resumeUrl: resumeUrl || null,
          },
        })
      }

      // Create referrer profile if needed
      if (userType === "referrer" || userType === "both") {
        await prisma.referrerProfile.upsert({
          where: { userId: user.id },
          update: {},
          create: { userId: user.id },
        })
      }

      if (user.fullName) userName = user.fullName
      else if (email) userName = email.split("@")[0] || "there"
    } catch (dbError) {
      // DB not ready yet — log but don't block onboarding
      console.error("DB save failed (non-blocking):", dbError)
    }

    return NextResponse.json({ success: true, userName })
  } catch (error) {
    console.error("Onboarding complete error:", error)
    return NextResponse.json({ error: "Failed to complete onboarding" }, { status: 500 })
  }
}
