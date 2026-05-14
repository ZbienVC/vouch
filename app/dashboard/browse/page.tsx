import type { ReferrerCardData } from "@/components/referrers/ReferrerCard"
import BrowseReferrers from "@/components/referrers/BrowseReferrers"

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function BrowsePage({ searchParams }: PageProps) {
  const params = await searchParams

  const buildQuery = () => {
    const p = new URLSearchParams()
    if (params.company) p.set("company", String(params.company))
    if (params.industry) p.set("industry", String(params.industry))
    p.set("minPrice", String(params.minPrice ?? "25"))
    p.set("maxPrice", String(params.maxPrice ?? "1000"))
    if (params.minRating) p.set("minRating", String(params.minRating))
    if (params.verifiedOnly) p.set("verifiedOnly", String(params.verifiedOnly))
    p.set("sort", String(params.sort ?? "referrals"))
    p.set("page", "1")
    p.set("limit", "12")
    return p.toString()
  }

  let initialListings: ReferrerCardData[] = []
  let initialTotal = 0

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000")

    const res = await fetch(`${baseUrl}/api/listings?${buildQuery()}`, {
      cache: "no-store",
    })

    if (res.ok) {
      const data = await res.json() as { listings: ReferrerCardData[]; total: number; page: number }
      initialListings = data.listings
      initialTotal = data.total
    }
  } catch {
    initialListings = []
    initialTotal = 0
  }

  return (
    <BrowseReferrers
      initialListings={initialListings}
      initialTotal={initialTotal}
    />
  )
}