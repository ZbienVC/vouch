import { create } from "zustand"
import { persist } from "zustand/middleware"

interface OnboardingData {
  userType: "seeker" | "referrer" | "both" | null
  fullName: string
  avatarUrl: string
  linkedinUrl: string
  location: string
  resumeUrl: string
}

interface OnboardingState extends OnboardingData {
  setUserType: (type: "seeker" | "referrer" | "both") => void
  setProfile: (data: Partial<OnboardingData>) => void
  reset: () => void
}

const initialData: OnboardingData = {
  userType: null,
  fullName: "",
  avatarUrl: "",
  linkedinUrl: "",
  location: "",
  resumeUrl: "",
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialData,
      setUserType: (type) => set({ userType: type }),
      setProfile: (data) => set((state) => ({ ...state, ...data })),
      reset: () => set(initialData),
    }),
    {
      name: "vouch-onboarding",
    }
  )
)