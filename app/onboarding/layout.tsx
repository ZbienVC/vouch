import { VouchToaster } from "@/components/ui/vouch"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#0A0A0F" }}
    >
      {children}
      <VouchToaster />
    </div>
  )
}