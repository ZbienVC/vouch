import type { MockRequest } from "@/app/api/requests/route"
import BrowseRequestsClient from "@/components/dashboard/BrowseRequestsClient"

export default async function BrowseRequestsPage() {
  let initialRequests: MockRequest[] = []
  let initialTotal = 0

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000")

    const res = await fetch(`${baseUrl}/api/requests?sort=newest`, {
      cache: "no-store",
    })

    if (res.ok) {
      const data = await res.json() as { requests: MockRequest[]; total: number }
      initialRequests = data.requests
      initialTotal = data.total
    }
  } catch {
    initialRequests = []
    initialTotal = 0
  }

  return (
    <BrowseRequestsClient
      initialRequests={initialRequests}
      initialTotal={initialTotal}
    />
  )
}