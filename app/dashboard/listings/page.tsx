import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import MyListingsClient from "@/components/dashboard/MyListingsClient"

export default async function MyListingsPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { referrerProfile: { include: { listings: { orderBy: { createdAt: "desc" } } } } },
  })

  if (!user || !user.referrerProfile) {
    redirect("/onboarding/role")
  }

  const listings = user.referrerProfile.listings.map((l) => ({
    id: l.id,
    companyName: l.companyName,
    roleTypes: l.roleTypes,
    priceCents: l.priceCents,
    isActive: l.isActive,
    createdAt: l.createdAt.toISOString(),
  }))

  return <MyListingsClient initialListings={listings} />
}