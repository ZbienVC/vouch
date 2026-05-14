import { NextRequest, NextResponse } from "next/server"

export interface MockRequest {
  id: string
  initials: string
  targetCompany: string | null
  targetIndustry: string | null
  targetRole: string
  yearsExperience: number
  budgetCents: number
  description: string
  postedAt: string
  roleTypes: string[]
  requestType: "targeted" | "open"
}

const MOCK_REQUESTS: MockRequest[] = [
  {
    id: "req-001",
    initials: "JD",
    targetCompany: "Google",
    targetIndustry: null,
    targetRole: "Software Engineer",
    yearsExperience: 4,
    budgetCents: 30000,
    description: "Looking for an internal referral at Google for a SWE role on the Search team. I have strong experience in distributed systems and Go.",
    postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    roleTypes: ["Engineering"],
    requestType: "targeted",
  },
  {
    id: "req-002",
    initials: "SK",
    targetCompany: "Meta",
    targetIndustry: null,
    targetRole: "Product Manager",
    yearsExperience: 6,
    budgetCents: 40000,
    description: "Seeking a referral at Meta for a PM role. 6 years in product at B2B SaaS companies, strong on analytics and growth.",
    postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    roleTypes: ["Product"],
    requestType: "targeted",
  },
  {
    id: "req-003",
    initials: "AM",
    targetCompany: null,
    targetIndustry: "Fintech",
    targetRole: "Data Analyst",
    yearsExperience: 2,
    budgetCents: 25000,
    description: "Open to referrals at any fintech company. 2 years of experience in SQL, Python, and financial data modeling.",
    postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    roleTypes: ["Data"],
    requestType: "open",
  },
  {
    id: "req-004",
    initials: "TW",
    targetCompany: "Stripe",
    targetIndustry: null,
    targetRole: "Solutions Engineer",
    yearsExperience: 3,
    budgetCents: 35000,
    description: "Looking for a Stripe referral for a Solutions Engineer role. Strong API integration experience, worked with payments infrastructure.",
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    roleTypes: ["Engineering", "Sales"],
    requestType: "targeted",
  },
  {
    id: "req-005",
    initials: "RK",
    targetCompany: null,
    targetIndustry: "Technology",
    targetRole: "Marketing Manager",
    yearsExperience: 5,
    budgetCents: 30000,
    description: "Seeking referrals at any top tech company for a marketing manager role. Specializing in growth, paid acquisition, and brand strategy.",
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    roleTypes: ["Marketing"],
    requestType: "open",
  },
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const search = (searchParams.get("search") ?? "").toLowerCase()
  const industry = searchParams.get("industry") ?? ""
  const minBudget = Number(searchParams.get("minBudget") ?? "0") * 100
  const maxBudget = Number(searchParams.get("maxBudget") ?? "9999") * 100
  const sort = searchParams.get("sort") ?? "newest"

  let results = MOCK_REQUESTS.filter((r) => {
    if (search) {
      const haystack = [
        r.targetCompany ?? "",
        r.targetRole,
        r.targetIndustry ?? "",
        ...r.roleTypes,
      ]
        .join(" ")
        .toLowerCase()
      if (!haystack.includes(search)) return false
    }
    if (industry && r.targetIndustry !== industry) return false
    if (r.budgetCents < minBudget || r.budgetCents > maxBudget) return false
    return true
  })

  if (sort === "newest") {
    results = results.sort((a, b) => (a.postedAt < b.postedAt ? 1 : -1))
  } else if (sort === "highest_budget") {
    results = results.sort((a, b) => b.budgetCents - a.budgetCents)
  }

  return NextResponse.json({ requests: results, total: results.length })
}