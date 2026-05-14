"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Lock, X } from "lucide-react"
import {
  VouchButton,
  VouchCard,
  VouchInput,
  VouchBadge,
  VouchAvatar,
  toast,
} from "@/components/ui/vouch"
import { useUser } from "@clerk/nextjs"

const ROLE_TYPE_OPTIONS = [
  "Engineering",
  "Marketing",
  "Finance",
  "Sales",
  "Design",
  "Operations",
  "Legal",
  "Data",
  "Product",
  "Other",
]

const listingSchema = z.object({
  companyName: z.string().min(1, "Company is required"),
  roleTypes: z.array(z.string()).min(1, "Select at least one role type"),
  departments: z.string().optional(),
  price: z.number({ invalid_type_error: "Price must be a number" }).min(25, "Minimum price is $25"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(1000, "Description must be at most 1000 characters"),
  duration: z.enum(["always", "30", "14", "7"]),
})

type ListingFormValues = z.infer<typeof listingSchema>

const DURATION_OPTIONS: { value: "always" | "30" | "14" | "7"; label: string }[] = [
  { value: "always", label: "Always Active" },
  { value: "30", label: "Expires in 30 days" },
  { value: "14", label: "Expires in 14 days" },
  { value: "7", label: "Expires in 7 days" },
]

interface CreateListingPageInnerProps {
  referrerCompany: string
  isVerified: boolean
}

function CreateListingPageInner({ referrerCompany, isVerified }: CreateListingPageInnerProps) {
  const router = useRouter()
  const { user } = useUser()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    mode: "onChange",
    defaultValues: {
      companyName: referrerCompany,
      roleTypes: [],
      departments: "",
      price: 100,
      description: "",
      duration: "always",
    },
  })

  const watchedValues = watch()

  const receivedAmount = watchedValues.price
    ? Math.floor(watchedValues.price * 0.9)
    : 0

  const onSubmit = async (data: ListingFormValues) => {
    setSubmitting(true)
    try {
      const res = await fetch("/api/listings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: data.companyName,
          roleTypes: data.roleTypes,
          departments: data.departments,
          priceCents: Math.round(data.price * 100),
          description: data.description,
          duration: data.duration,
        }),
      })

      if (!res.ok) {
        const err = await res.json() as { error?: string }
        throw new Error(err.error ?? "Failed to create listing")
      }

      toast("Listing published!", "success")
      router.push("/dashboard/listings")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong"
      toast(msg, "error")
    } finally {
      setSubmitting(false)
    }
  }

  const displayName = user
    ? `${user.firstName ?? ""} ${user.lastName ? user.lastName.charAt(0) + "." : ""}`.trim()
    : "You"

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/listings"
          className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
        >
          ← My Listings
        </Link>
      </div>
      <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">
        Create a Listing
      </h1>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Form */}
        <div className="flex-1 min-w-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Company */}
            <VouchCard className="space-y-4">
              <h2 className="font-display font-semibold text-[var(--text-primary)]">
                Company
              </h2>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#8888AA]">Company</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                    <Lock size={14} />
                  </div>
                  <input
                    {...register("companyName")}
                    readOnly
                    className="w-full h-10 pl-9 pr-3 py-2 text-sm rounded-lg bg-[#111118] border border-[#2A2A38] text-[#8888AA] cursor-not-allowed"
                  />
                  {isVerified && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <VouchBadge variant="success">Verified ✓</VouchBadge>
                    </div>
                  )}
                </div>
                {errors.companyName && (
                  <p className="text-xs text-[#FF4D6A]">{errors.companyName.message}</p>
                )}
              </div>
            </VouchCard>

            {/* Role Types */}
            <VouchCard className="space-y-4">
              <h2 className="font-display font-semibold text-[var(--text-primary)]">
                Role Types
              </h2>
              <Controller
                name="roleTypes"
                control={control}
                render={({ field }) => (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {ROLE_TYPE_OPTIONS.map((opt) => {
                        const selected = field.value.includes(opt)
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              if (selected) {
                                field.onChange(field.value.filter((v) => v !== opt))
                              } else {
                                field.onChange([...field.value, opt])
                              }
                            }}
                            className={[
                              "px-3 py-1.5 text-sm rounded-lg border transition-all duration-150",
                              selected
                                ? "bg-[var(--accent)]/15 border-[var(--accent)] text-[var(--accent)]"
                                : "bg-transparent border-[#2A2A38] text-[var(--text-secondary)] hover:border-[var(--accent)]/50 hover:text-[var(--text-primary)]",
                            ].join(" ")}
                          >
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                    {field.value.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((v) => (
                          <VouchBadge
                            key={v}
                            variant="purple"
                            className="flex items-center gap-1"
                          >
                            {v}
                            <button
                              type="button"
                              onClick={() =>
                                field.onChange(field.value.filter((x) => x !== v))
                              }
                              className="ml-1 hover:text-white"
                            >
                              <X size={10} />
                            </button>
                          </VouchBadge>
                        ))}
                      </div>
                    )}
                    {errors.roleTypes && (
                      <p className="text-xs text-[#FF4D6A]">{errors.roleTypes.message}</p>
                    )}
                  </div>
                )}
              />
            </VouchCard>

            {/* Departments */}
            <VouchCard className="space-y-4">
              <h2 className="font-display font-semibold text-[var(--text-primary)]">
                Departments / Teams{" "}
                <span className="text-xs text-[var(--text-secondary)] font-normal">
                  (optional)
                </span>
              </h2>
              <VouchInput
                {...register("departments")}
                placeholder="e.g. Platform Engineering, Growth Marketing"
              />
            </VouchCard>

            {/* Price */}
            <VouchCard className="space-y-4">
              <h2 className="font-display font-semibold text-[var(--text-primary)]">
                Price
              </h2>
              <div className="space-y-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    min={25}
                    step={5}
                    {...register("price", { valueAsNumber: true })}
                    className="w-full h-10 pl-7 pr-3 py-2 text-sm rounded-lg bg-[#111118] border border-[#2A2A38] text-[#F0F0FF] outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all"
                    placeholder="100"
                  />
                </div>
                {errors.price && (
                  <p className="text-xs text-[#FF4D6A]">{errors.price.message}</p>
                )}
                {watchedValues.price >= 25 && (
                  <p className="text-xs text-[var(--text-secondary)]">
                    You set{" "}
                    <span className="text-[var(--text-primary)] font-medium">
                      ${watchedValues.price}
                    </span>{" "}
                    → You receive{" "}
                    <span className="text-[#00D4AA] font-medium">${receivedAmount}</span>{" "}
                    after 10% Vouch fee
                  </p>
                )}
              </div>
            </VouchCard>

            {/* Description */}
            <VouchCard className="space-y-4">
              <h2 className="font-display font-semibold text-[var(--text-primary)]">
                Listing Description
              </h2>
              <div className="space-y-1.5">
                <div className="relative">
                  <textarea
                    {...register("description")}
                    rows={5}
                    placeholder="Describe what you look for in a great candidate, your typical response time, and any tips for applicants..."
                    className="w-full px-3 py-2 text-sm rounded-lg bg-[#111118] border border-[#2A2A38] text-[#F0F0FF] placeholder:text-[#55556A] outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all resize-none"
                  />
                  <span className="absolute bottom-2 right-3 text-xs text-[var(--text-secondary)]">
                    {(watchedValues.description ?? "").length}/1000
                  </span>
                </div>
                {errors.description && (
                  <p className="text-xs text-[#FF4D6A]">{errors.description.message}</p>
                )}
              </div>
            </VouchCard>

            {/* Duration */}
            <VouchCard className="space-y-4">
              <h2 className="font-display font-semibold text-[var(--text-primary)]">
                Listing Duration
              </h2>
              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-wrap gap-3">
                    {DURATION_OPTIONS.map((opt) => (
                      <label
                        key={opt.value}
                        className={[
                          "flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-all duration-150",
                          field.value === opt.value
                            ? "bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--accent)]"
                            : "bg-transparent border-[#2A2A38] text-[var(--text-secondary)] hover:border-[var(--accent)]/50",
                        ].join(" ")}
                      >
                        <input
                          type="radio"
                          value={opt.value}
                          checked={field.value === opt.value}
                          onChange={() => field.onChange(opt.value)}
                          className="sr-only"
                        />
                        <span className="text-sm">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              />
            </VouchCard>

            <VouchButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!isValid || submitting}
              loading={submitting}
            >
              Publish Listing →
            </VouchButton>
          </form>
        </div>

        {/* Preview Card */}
        <div className="lg:w-[360px] shrink-0 lg:sticky lg:top-8">
          <VouchCard className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-display font-semibold text-[var(--text-primary)] text-sm">
                Preview
              </span>
              <VouchBadge variant="default">Preview</VouchBadge>
            </div>

            <div className="flex items-start gap-3">
              <VouchAvatar
                src={user?.imageUrl}
                name={displayName}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-[var(--text-primary)] text-sm truncate">
                  {displayName}
                </p>
                <p className="text-xs text-[var(--text-secondary)] truncate">
                  {watchedValues.companyName || "Your Company"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {watchedValues.roleTypes && watchedValues.roleTypes.length > 0 ? (
                watchedValues.roleTypes.map((rt) => (
                  <VouchBadge key={rt} variant="purple">
                    {rt}
                  </VouchBadge>
                ))
              ) : (
                <VouchBadge variant="default">No roles selected</VouchBadge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <VouchBadge variant="purple">
                ${watchedValues.price >= 25 ? watchedValues.price : "—"} per referral
              </VouchBadge>
              {isVerified && <VouchBadge variant="success">✓ Verified</VouchBadge>}
            </div>

            {watchedValues.description && (
              <p className="text-xs text-[var(--text-secondary)] line-clamp-3">
                {watchedValues.description}
              </p>
            )}

            <VouchButton
              variant="secondary"
              size="sm"
              className="w-full opacity-50 cursor-not-allowed"
              disabled
            >
              View Profile
            </VouchButton>
          </VouchCard>
        </div>
      </div>
    </div>
  )
}

export default function CreateListingPage() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--text-secondary)]">Loading...</div>
      </div>
    )
  }

  const referrerCompany =
    (user?.publicMetadata as { companyName?: string })?.companyName ?? ""
  const isVerified =
    (user?.publicMetadata as { workEmailVerified?: boolean })?.workEmailVerified ?? false

  return (
    <CreateListingPageInner
      referrerCompany={referrerCompany}
      isVerified={isVerified}
    />
  )
}