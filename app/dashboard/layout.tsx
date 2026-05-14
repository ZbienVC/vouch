import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import DashboardShell from "@/components/dashboard/DashboardShell"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      avatarUrl: true,
      userType: true,
    },
  })

  if (!user) {
    redirect("/onboarding/role")
  }

  if (!user.userType) {
    redirect("/onboarding/role")
  }

  return (
    <DashboardShell
      userType={user.userType}
      userName={user.fullName ?? user.email}
      userEmail={user.email}
      avatarUrl={user.avatarUrl}
    >
      {children}
    </DashboardShell>
  )
}