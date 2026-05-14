import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import type { ReferrerCardData } from "@/components/referrers/ReferrerCard"

const mockListings: ReferrerCardData[] = [
  {
    id: "mock-1",
    firstName: "Jordan",
    lastInitial: "M",
    company: "Google",
    jobTitle: "Software Engineer",
    priceCents: 50000,
    avgRating: 4.9,
    totalReferrals: 23,
    isVerified: true,
    avatarUrl: null,
  },
  {
    id: "mock-2",
    firstName: "Alex",
    lastInitial: "R",
    company: "Meta",
    jobTitle: "Product Manager",
    priceCents: 40000,
    avgRating: 4.7,
    totalReferrals: 15,
    isVerified: true,
    avatarUrl: null,
  },
  {
    id: "mock-3",
    firstName: "Sam",
    lastInitial: "K",
    company: "Stripe",
    jobTitle: "Software Engineer",
    priceCents: 35000,
    avgRating: 5.0,
    totalReferrals: 8,
    isVerified: true,
    avatarUrl: null,
  },
  {
    id: "mock-4",
    firstName: "Casey",
    lastInitial: "L",
    company: "Airbnb",
    jobTitle: "Product Designer",
    priceCents: 25000,
    avgRating: 4.5,
    totalReferrals: 12,
    isVerified: false,
    avatarUrl: null,
  },
  {
    id: "mock-5",
    firstName: "Morgan",
    lastInitial: "T",
    company: "Goldman Sachs",
    jobTitle: "Financial Analyst",
    priceCents: 30000,
    avgRating: 4.8,
    totalReferrals: 6,
    isVerified: true,
    avatarUrl: null,
  },
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const company = searchParams.get("company") ?? ""
  const minPrice = Number(searchParams.get("minPrice") ?? "0")
  const maxPrice = Number(searchParams.get("maxPrice") ?? "1000")
  const minRating = Number(searchParams.get("minRating") ?? "0")
  const verifiedOnly = searchParams.get("verifiedOnly") === "true"
  const sort = searchParams.get("sort") ?? "referrals"
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"))
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? "12")))

  let dbListings: ReferrerCardData[] = []

  try {
    const rawListings = await prisma.listing.findMany({
      where: {
        isActive: true,
        ...(company
          ? { companyName: { contains: company, mode: "insensitive" } }
          : {}),
        priceCents: {
          gte: minPrice * 100,
          lte: maxPrice * 100,
        },
        ...(verifiedOnly
          ? { referrer: { workEmailVerified: true } }
          : {}),
      },
      include: {
        referrer: {
          include: {
            user: { select: { fullName: true, avatarUrl: true } },
          },
        },
      },
      orderBy:
        sort === "price_asc"
          ? { priceCents: "asc" }
          : sort === "price_desc"
            ? { priceCents: "desc" }
            : sort === "newest"
              ? { createdAt: "desc" }
              : { createdAt: "desc" },
    })

    dbListings = rawListings
      .filter((l) => {
        if (minRating > 0 && !l.referrer.avgRating) return false
        if (minRating > 0 && Number(l.referrer.avgRating) < minRating) return false
        return true
      })
      .map((l) => {
        const fullName = l.referrer.user.fullName ?? "Unknown"
        const parts = fullName.trim().split(/\s+/)
        const firstName = parts[0] ?? "Unknown"
        const lastInitial = parts.length > 1 ? parts[parts.length - 1].charAt(0) : ""
        return {
          id: l.referrer.id,
          firstName,
          lastInitial,
          company: l.companyName,
          jobTitle: l.referrer.jobTitle ?? "",
          priceCents: l.priceCents,
          avgRating: l.referrer.avgRating ? Number(l.referrer.avgRating) : null,
          totalReferrals: l.referrer.totalReferrals,
          isVerified: l.referrer.workEmailVerified,
          avatarUrl: l.referrer.user.avatarUrl,
        }
      })
  } catch {
    dbListings = []
  }

  let combined = dbListings.length > 0 ? dbListings : mockListings

  if (sort === "referrals") {
    combined = combined.sort((a, b) => b.totalReferrals - a.totalReferrals)
  } else if (sort === "rating") {
    combined = combined.sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0))
  } else if (sort === "price_asc") {
    combined = combined.sort((a, b) => a.priceCents - b.priceCents)
  } else if (sort === "price_desc") {
    combined = combined.sort((a, b) => b.priceCents - a.priceCents)
  }

  const total = combined.length
  const start = (page - 1) * limit
  const listings = combined.slice(start, start + limit)

  return NextResponse.json({ listings, total, page })
}