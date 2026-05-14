"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useUser } from "@clerk/nextjs"
import { Upload, X, AlertTriangle, CheckCircle, Camera } from "lucide-react"
import Image from "next/image"
import { VouchButton } from "@/components/ui/vouch"
import { toast } from "@/components/ui/vouch"
import { useOnboardingStore } from "@/lib/onboarding-store"
import { getSupabase } from "@/lib/supabase"

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  linkedinUsername: z.string().optional(),
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
      <label className="text-sm font-medium" style={{ color: "var(--text-secondary)", fontSize: 13, fontWeight: 500 }}>
        {label}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span
            className="absolute left-3 text-sm select-none pointer-events-none"
            style={{ color: "var(--text-tertiary)", whiteSpace: "nowrap" }}
          >
            {prefix}
          </span>
        )}
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          placeholder={placeholder}
          className="w-full py-2 text-sm placeholder:text-[var(--text-tertiary)] outline-none"
          style={{
            height: 46,
            paddingLeft: prefix ? "calc(8.5ch + 12px)" : 12,
            paddingRight: 12,
            background: "var(--bg-elevated)",
            border: error
              ? "1px solid var(--warning)"
              : focused
              ? "1px solid var(--border-focus)"
              : "1px solid var(--border-subtle)",
            borderRadius: "10px",
            boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
            color: "var(--text-primary)",
            fontSize: 14,
            transition: "all 0.2s ease",
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
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false)
  const [resumeUpload, setResumeUpload] = useState<UploadState>(emptyUpload)
  const [isDraggingResume, setIsDraggingResume] = useState(false)
  const [isHoveringResume, setIsHoveringResume] = useState(false)

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const resumeInputRef = useRef<HTMLInputElement>(null)

  // Task 15: Animated progress bar
  const progressPct = Math.round(((CURRENT_STEP - 1) / STEP_COUNT) * 100)
  const [barWidth, setBarWidth] = useState(0)
  useEffect(() => {
    const timer = setTimeout(() => setBarWidth(progressPct), 100)
    return () => clearTimeout(timer)
  }, [progressPct])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
  })

  const fullNameValue = watch("fullName") ?? ""

  const uploadToSupabase = async (
    bucket: string,
    path: string,
    file: File,
    setState: (s: UploadState) => void
  ): Promise<string> => {
    setState({ uploading: true, progress: 10, url: "", fileName: file.name, fileSize: file.size })
    const { data, error } = await getSupabase().storage
      .from(bucket)
      .upload(path, file, { upsert: true })
    if (error) {
      setState(emptyUpload)
      throw error
    }
    const { data: urlData } = getSupabase().storage.from(bucket).getPublicUrl(data.path)
    setState({
      uploading: false,
      progress: 100,
      url: urlData.publicUrl,
      fileName: file.name,
      fileSize: file.size,
    })
    return urlData.publicUrl
  }

  // Task 14: Avatar with local preview
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Immediate local preview
    const reader = new FileReader()
    reader.onloadend = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)

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

  const onSubmit = (values: ProfileFormValues) => {
    const rawLinkedin = (values.linkedinUsername ?? "").trim()
    let linkedinUrl = ""
    if (rawLinkedin) {
      const match = rawLinkedin.match(/linkedin\.com\/in\/([^/?#]+)/)
      const username = match ? match[1].replace(/\/$/, "") : rawLinkedin.replace(/^\/|\/$/g, "")
      linkedinUrl = "https://www.linkedin.com/in/" + username
    }
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

  // Get initials for avatar placeholder
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ")
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start px-6 py-12"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      {/* Task 15: Animated progress bar */}
      <div className="w-full max-w-[640px] mb-4 mt-4">
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Step {CURRENT_STEP} of {STEP_COUNT}</span>
          <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-accent)" }}>{barWidth}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${barWidth}%` }} />
        </div>
      </div>

      {/* Task 2: Card container */}
      <div
        className="w-full max-w-[640px] mt-4"
        style={{
          background: "var(--bg-surface)",
          border: "0.5px solid var(--border-subtle)",
          borderRadius: "14px",
          padding: "32px",
        }}
      >
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

          {/* Task 14: Profile Photo with preview */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)", fontSize: 13, fontWeight: 500 }}>
              Profile Photo
            </span>
            <div className="flex items-center gap-4">
              {/* Avatar circle */}
              <div
                className="relative cursor-pointer rounded-full overflow-hidden flex items-center justify-center"
                style={{
                  width: 80,
                  height: 80,
                  border: "2px dashed var(--border-subtle)",
                  flexShrink: 0,
                  borderRadius: "50%",
                }}
                onClick={() => avatarInputRef.current?.click()}
                onMouseEnter={() => setIsHoveringAvatar(true)}
                onMouseLeave={() => setIsHoveringAvatar(false)}
              >
                {avatarPreview || avatarUpload.url ? (
                  <>
                    <Image
                      src={avatarPreview || avatarUpload.url}
                      alt="Profile"
                      fill
                      className="object-cover rounded-full"
                    />
                    {isHoveringAvatar && (
                      <div
                        className="absolute inset-0 flex items-center justify-center rounded-full"
                        style={{ background: "rgba(0,0,0,0.5)" }}
                      >
                        <Camera size={20} style={{ color: "white" }} />
                      </div>
                    )}
                  </>
                ) : avatarUpload.uploading ? (
                  <div className="text-xs text-center" style={{ color: "var(--text-secondary)" }}>
                    {avatarUpload.progress}%
                  </div>
                ) : fullNameValue.trim().length >= 2 ? (
                  <span
                    className="font-bold text-sm text-white"
                    style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}
                  >
                    {getInitials(fullNameValue)}
                  </span>
                ) : (
                  <Upload size={24} style={{ color: "var(--text-tertiary)" }} />
                )}
              </div>
              <div>
                <button
                  type="button"
                  className="text-sm transition-colors hover:text-[var(--accent-hover)]"
                  style={{ color: "var(--accent)" }}
                  onClick={() => avatarInputRef.current?.click()}
                >
                  {avatarPreview || avatarUpload.url ? "Change photo" : "Upload photo"}
                </button>
                <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
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

          {/* Task 13: Resume Upload with hover states */}
          {showResume && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium" style={{ color: "var(--text-secondary)", fontSize: 13, fontWeight: 500 }}>
                Resume
              </span>
              {resumeUpload.url ? (
                <div
                  className="flex items-center justify-between p-4 rounded-xl border"
                  style={{
                    background: "rgba(45,212,191,0.05)",
                    borderColor: "var(--accent-secondary)",
                    borderRadius: "12px",
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
                  className="flex flex-col items-center justify-center gap-3 p-8 cursor-pointer transition-all duration-200 relative overflow-hidden"
                  style={{
                    background: isDraggingResume ? "rgba(99,102,241,0.06)" : isHoveringResume ? "var(--bg-hover)" : "var(--bg-elevated)",
                    borderColor: isDraggingResume ? "var(--border-focus)" : isHoveringResume ? "var(--border-default)" : "var(--border-subtle)",
                    borderStyle: "dashed",
                    borderWidth: "1px",
                    borderRadius: "12px",
                  }}
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingResume(true) }}
                  onDragLeave={() => setIsDraggingResume(false)}
                  onDrop={handleResumeDrop}
                  onClick={() => resumeInputRef.current?.click()}
                  onMouseEnter={() => setIsHoveringResume(true)}
                  onMouseLeave={() => setIsHoveringResume(false)}
                >
                  {resumeUpload.uploading ? (
                    <>
                      <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        Uploading... {resumeUpload.progress}%
                      </div>
                      {/* Progress bar */}
                      <div
                        className="absolute bottom-0 left-0 right-0"
                        style={{ height: 3, background: "var(--border-subtle)" }}
                      >
                        <div
                          style={{
                            height: "100%",
                            background: "linear-gradient(90deg, #6366F1, #818CF8)",
                            width: `${resumeUpload.progress}%`,
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload
                        size={32}
                        style={{
                          color: "var(--text-tertiary)",
                          transform: isDraggingResume || isHoveringResume ? "translateY(-4px)" : "translateY(0)",
                          transition: "transform 0.2s ease",
                        }}
                      />
                      <div className="text-center">
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                          Drag &amp; drop your resume here
                        </p>
                        <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
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
