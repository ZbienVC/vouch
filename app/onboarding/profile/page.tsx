"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useUser } from "@clerk/nextjs"
import { Upload, X, AlertTriangle, CheckCircle } from "lucide-react"
import { VouchButton, VouchAvatar } from "@/components/ui/vouch"
import { toast } from "@/components/ui/vouch"
import { useOnboardingStore } from "@/lib/onboarding-store"
import { supabase } from "@/lib/supabase"

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  linkedinUsername: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || /^[a-zA-Z0-9\-_]+$/.test(val),
      { message: "Enter just your LinkedIn username (letters, numbers, hyphens)" }
    ),
  location: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface UploadState {
  uploading: boolean
  progress: number
  url: string
  fileName: string
  fileSize: number
}

const emptyUpload: UploadState = {
  uploading: false,
  progress: 0,
  url: "",
  fileName: "",
  fileSize: 0,
}

const STEP_COUNT = 3
const CURRENT_STEP = 2

function StyledInput({
  label,
  placeholder,
  error,
  prefix,
  inputProps,
}: {
  label: string
  placeholder?: string
  error?: string
  prefix?: string
  inputProps: React.InputHTMLAttributes<HTMLInputElement> & { ref?: React.Ref<HTMLInputElement> }
}) {
  const [focused, setFocused] = useState(false)

  const { onBlur, onFocus, ref, ...rest } = inputProps

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
        {label}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span
            className="absolute left-3 text-sm select-none pointer-events-none"
            style={{ color: "var(--text-muted)", whiteSpace: "nowrap" }}
          >
            {prefix}
          </span>
        )}
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          placeholder={placeholder}
          className="w-full py-2 text-sm rounded-lg placeholder:text-[var(--text-muted)] outline-none"
          style={{
            height: 46,
            paddingLeft: prefix ? "calc(8.5ch + 12px)" : 12,
            paddingRight: 12,
            background: "var(--surface-raised)",
            border: error
              ? "1px solid var(--warning)"
              : focused
              ? "1px solid var(--accent)"
              : "1px solid rgba(148,163,184,0.12)",
            boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.15)" : "none",
            color: "var(--text-primary)",
            transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
          }}
          onFocus={(e) => {
            setFocused(true)
            onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            onBlur?.(e)
          }}
          {...rest}
        />
      </div>
      {error && (
        <div className="flex items-center gap-1.5">
          <AlertTriangle size={12} style={{ color: "var(--warning)", flexShrink: 0 }} />
          <p className="text-xs" style={{ color: "var(--warning)" }}>{error}</p>
        </div>
      )}
    </div>
  )
}

export default function OnboardingProfilePage() {
  const router = useRouter()
  const { user } = useUser()
  const { userType, setProfile } = useOnboardingStore()

  const [avatarUpload, setAvatarUpload] = useState<UploadState>(emptyUpload)
  const [resumeUpload, setResumeUpload] = useState<UploadState>(emptyUpload)
  const [isDraggingResume, setIsDraggingResume] = useState(false)

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const resumeInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
  })

  const uploadToSupabase = async (
    bucket: string,
    path: string,
    file: File,
    setState: (s: UploadState) => void
  ): Promise<string> => {
    setState({ uploading: true, progress: 10, url: "", fileName: file.name, fileSize: file.size })
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true })
    if (error) {
      setState(emptyUpload)
      throw error
    }
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)
    setState({
      uploading: false,
      progress: 100,
      url: urlData.publicUrl,
      fileName: file.name,
      fileSize: file.size,
    })
    return urlData.publicUrl
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error("Avatar must be under 5MB"); return }
    if (!user?.id) { toast.error("Not authenticated"); return }
    try {
      await uploadToSupabase("avatars", `${user.id}/${file.name}`, file, setAvatarUpload)
      toast.success("Profile photo uploaded!")
    } catch { toast.error("Failed to upload photo") }
  }

  const handleResumeFile = async (file: File) => {
    if (file.type !== "application/pdf") { toast.error("Resume must be a PDF file"); return }
    if (file.size > 10 * 1024 * 1024) { toast.error("Resume must be under 10MB"); return }
    if (!user?.id) { toast.error("Not authenticated"); return }
    try {
      await uploadToSupabase("resumes", `${user.id}/${file.name}`, file, setResumeUpload)
      toast.success("Resume uploaded!")
    } catch { toast.error("Failed to upload resume") }
  }

  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) await handleResumeFile(file)
  }

  const handleResumeDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDraggingResume(false)
    const file = e.dataTransfer.files[0]
    if (file) await handleResumeFile(file)
  }

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const progressPct = Math.round(((CURRENT_STEP - 1) / STEP_COUNT) * 100)

  const onSubmit = (values: ProfileFormValues) => {
    const linkedinUrl = values.linkedinUsername
      ? `https://www.linkedin.com/in/${values.linkedinUsername}`
      : ""
    setProfile({
      fullName: values.fullName,
      linkedinUrl,
      location: values.location ?? "",
      avatarUrl: avatarUpload.url,
      resumeUrl: resumeUpload.url,
    })
    router.push("/onboarding/verify")
  }

  const showResume = userType === "seeker" || userType === "both"

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start px-6 py-12"
      style={{ backgroundColor: "var(--page-bg)" }}
    >
      {/* Animated progress bar */}
      <div className="w-full max-w-[640px] mb-8">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Step {CURRENT_STEP} of {STEP_COUNT}</p>
          <p className="text-xs font-medium" style={{ color: "var(--accent)" }}>{progressPct}%</p>
        </div>
        <div
          className="w-full rounded-full overflow-hidden"
          style={{ height: 4, background: "var(--surface-raised)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${progressPct}%`,
              background: "linear-gradient(90deg, var(--accent), var(--accent-hover))",
              transition: "width 0.5s ease",
            }}
          />
        </div>
      </div>

      <div className="w-full max-w-[640px]">
        {/* Back link */}
        <Link
          href="/onboarding/role"
          className="inline-flex items-center text-sm mb-8 transition-colors hover:text-[var(--text-primary)]"
          style={{ color: "var(--text-secondary)" }}
        >
          ← Back
        </Link>

        {/* Headline */}
        <h1
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: "var(--font-syne)", color: "var(--text-primary)" }}
        >
          Set up your profile
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
          This is how other users will see you on Vouch.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Full Name */}
          <StyledInput
            label="Full Name"
            placeholder="Jane Smith"
            error={errors.fullName?.message}
            inputProps={register("fullName")}
          />

          {/* Profile Photo */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Profile Photo
            </span>
            <div className="flex items-center gap-4">
              <div
                className="relative cursor-pointer rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all duration-200 hover:border-[var(--accent)]"
                style={{ width: 80, height: 80, borderColor: "rgba(148,163,184,0.2)", flexShrink: 0 }}
                onClick={() => avatarInputRef.current?.click()}
              >
                {avatarUpload.url ? (
                  <VouchAvatar src={avatarUpload.url} size="lg" />
                ) : avatarUpload.uploading ? (
                  <div className="text-xs text-center" style={{ color: "var(--text-secondary)" }}>
                    {avatarUpload.progress}%
                  </div>
                ) : (
                  <Upload size={24} style={{ color: "var(--text-secondary)" }} />
                )}
              </div>
              <div>
                <button
                  type="button"
                  className="text-sm transition-colors hover:text-[var(--accent-hover)]"
                  style={{ color: "var(--accent)" }}
                  onClick={() => avatarInputRef.current?.click()}
                >
                  {avatarUpload.url ? "Change photo" : "Upload photo"}
                </button>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  JPG, PNG, GIF — max 5MB
                </p>
              </div>
            </div>
            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          {/* LinkedIn with prefix lock */}
          <StyledInput
            label="LinkedIn Username (optional)"
            placeholder="yourprofile"
            error={errors.linkedinUsername?.message}
            prefix="linkedin.com/in/"
            inputProps={register("linkedinUsername")}
          />

          {/* Location */}
          <StyledInput
            label="Location (optional)"
            placeholder="San Francisco, CA"
            inputProps={register("location")}
          />

          {/* Resume Upload */}
          {showResume && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                Resume
              </span>
              {resumeUpload.url ? (
                <div
                  className="flex items-center justify-between p-4 rounded-xl border"
                  style={{
                    background: "rgba(45,212,191,0.05)",
                    borderColor: "var(--accent-secondary)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle size={20} style={{ color: "var(--accent-secondary)" }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        {resumeUpload.fileName}
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        {formatBytes(resumeUpload.fileSize)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setResumeUpload(emptyUpload)}
                    className="transition-colors hover:text-[var(--text-primary)]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200"
                  style={{
                    borderColor: isDraggingResume ? "var(--accent)" : "rgba(148,163,184,0.2)",
                    background: isDraggingResume ? "rgba(99,102,241,0.05)" : "transparent",
                  }}
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingResume(true) }}
                  onDragLeave={() => setIsDraggingResume(false)}
                  onDrop={handleResumeDrop}
                  onClick={() => resumeInputRef.current?.click()}
                >
                  {resumeUpload.uploading ? (
                    <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      Uploading... {resumeUpload.progress}%
                    </div>
                  ) : (
                    <>
                      <Upload
                        size={32}
                        style={{
                          color: "var(--text-secondary)",
                          transform: isDraggingResume ? "translateY(-4px)" : "translateY(0)",
                          transition: "transform 0.2s ease",
                        }}
                      />
                      <div className="text-center">
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                          Drag &amp; drop your resume here
                        </p>
                        <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                          PDF only — max 10MB
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
              <input
                ref={resumeInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleResumeChange}
              />
            </div>
          )}

          <VouchButton
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            disabled={!isValid}
          >
            Continue →
          </VouchButton>
        </form>
      </div>
    </div>
  )
}
