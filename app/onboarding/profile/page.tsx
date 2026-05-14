"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useUser } from "@clerk/nextjs"
import { Upload, FileText, X } from "lucide-react"
import { VouchButton, VouchInput, VouchAvatar } from "@/components/ui/vouch"
import { toast } from "@/components/ui/vouch"
import { useOnboardingStore } from "@/lib/onboarding-store"
import { supabase } from "@/lib/supabase"

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  linkedinUrl: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || val.startsWith("https://linkedin.com/in/"),
      { message: "LinkedIn URL must start with https://linkedin.com/in/" }
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
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Avatar must be under 5MB")
      return
    }
    if (!user?.id) {
      toast.error("Not authenticated")
      return
    }
    try {
      await uploadToSupabase("avatars", `${user.id}/${file.name}`, file, setAvatarUpload)
      toast.success("Profile photo uploaded!")
    } catch {
      toast.error("Failed to upload photo")
    }
  }

  const handleResumeFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Resume must be a PDF file")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Resume must be under 10MB")
      return
    }
    if (!user?.id) {
      toast.error("Not authenticated")
      return
    }
    try {
      await uploadToSupabase("resumes", `${user.id}/${file.name}`, file, setResumeUpload)
      toast.success("Resume uploaded!")
    } catch {
      toast.error("Failed to upload resume")
    }
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
    setProfile({
      fullName: values.fullName,
      linkedinUrl: values.linkedinUrl ?? "",
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
      style={{ backgroundColor: "#0A0A0F" }}
    >
      {/* Progress bar */}
      <div className="w-full max-w-[640px] mb-8">
        <div
          className="w-full h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: "#111118" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: "66%", backgroundColor: "#6C63FF" }}
          />
        </div>
        <p className="text-xs mt-2" style={{ color: "#8888AA" }}>
          Step 2 of 3
        </p>
      </div>

      <div className="w-full max-w-[640px]">
        {/* Back link */}
        <Link
          href="/onboarding/role"
          className="inline-flex items-center text-sm mb-8 transition-colors hover:text-[#F0F0FF]"
          style={{ color: "#8888AA" }}
        >
          ← Back
        </Link>

        {/* Headline */}
        <h1
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: "var(--font-syne)", color: "#F0F0FF" }}
        >
          Set up your profile
        </h1>
        <p className="text-sm mb-8" style={{ color: "#8888AA" }}>
          This is how other users will see you on Vouch.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Full Name */}
          <VouchInput
            label="Full Name"
            placeholder="Jane Smith"
            error={errors.fullName?.message}
            {...register("fullName")}
          />

          {/* Profile Photo */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium" style={{ color: "#8888AA" }}>
              Profile Photo
            </span>
            <div className="flex items-center gap-4">
              <div
                className="relative cursor-pointer rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all duration-200 hover:border-[#6C63FF]"
                style={{
                  width: 80,
                  height: 80,
                  borderColor: "#2A2A38",
                  flexShrink: 0,
                }}
                onClick={() => avatarInputRef.current?.click()}
              >
                {avatarUpload.url ? (
                  <VouchAvatar src={avatarUpload.url} size="lg" />
                ) : avatarUpload.uploading ? (
                  <div className="text-xs text-center" style={{ color: "#8888AA" }}>
                    {avatarUpload.progress}%
                  </div>
                ) : (
                  <Upload size={24} color="#8888AA" />
                )}
              </div>
              <div>
                <button
                  type="button"
                  className="text-sm transition-colors hover:text-[#7C74FF]"
                  style={{ color: "#6C63FF" }}
                  onClick={() => avatarInputRef.current?.click()}
                >
                  {avatarUpload.url ? "Change photo" : "Upload photo"}
                </button>
                <p className="text-xs mt-1" style={{ color: "#55556A" }}>
                  JPG, PNG, GIF — max 5MB
                </p>
              </div>
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* LinkedIn URL */}
          <VouchInput
            label="LinkedIn URL (optional)"
            placeholder="https://linkedin.com/in/yourprofile"
            error={errors.linkedinUrl?.message}
            {...register("linkedinUrl")}
          />

          {/* Location */}
          <VouchInput
            label="Location (optional)"
            placeholder="San Francisco, CA"
            {...register("location")}
          />

          {/* Resume Upload (seeker/both only) */}
          {showResume && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium" style={{ color: "#8888AA" }}>
                Resume
              </span>
              {resumeUpload.url ? (
                <div
                  className="flex items-center justify-between p-4 rounded-vouch border"
                  style={{ backgroundColor: "#111118", borderColor: "#6C63FF" }}
                >
                  <div className="flex items-center gap-3">
                    <FileText size={20} color="#6C63FF" />
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#F0F0FF" }}>
                        {resumeUpload.fileName}
                      </p>
                      <p className="text-xs" style={{ color: "#8888AA" }}>
                        {formatBytes(resumeUpload.fileSize)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setResumeUpload(emptyUpload)}
                    className="transition-colors hover:text-[#F0F0FF]"
                    style={{ color: "#8888AA" }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div
                  className={`flex flex-col items-center justify-center gap-3 p-8 rounded-vouch border-2 border-dashed cursor-pointer transition-all duration-200 ${
                    isDraggingResume ? "border-[#6C63FF] bg-[#6C63FF]/10" : "hover:border-[#6C63FF]/50"
                  }`}
                  style={{ borderColor: isDraggingResume ? "#6C63FF" : "#2A2A38" }}
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingResume(true) }}
                  onDragLeave={() => setIsDraggingResume(false)}
                  onDrop={handleResumeDrop}
                  onClick={() => resumeInputRef.current?.click()}
                >
                  {resumeUpload.uploading ? (
                    <div className="text-sm" style={{ color: "#8888AA" }}>
                      Uploading... {resumeUpload.progress}%
                    </div>
                  ) : (
                    <>
                      <Upload size={32} color="#8888AA" />
                      <div className="text-center">
                        <p className="text-sm font-medium" style={{ color: "#F0F0FF" }}>
                          Drag &amp; drop your resume here
                        </p>
                        <p className="text-xs mt-1" style={{ color: "#8888AA" }}>
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