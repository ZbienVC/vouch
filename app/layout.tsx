import type { Metadata } from "next"
import { Syne, DM_Sans } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { VouchToaster } from "@/components/ui/vouch"
import "./globals.css"

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Vouch — Get Referred. Get Hired.",
  description:
    "The two-sided referral marketplace. Connect with insiders at top companies who can get your resume to the top of the pile.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
        <body
          style={{
            backgroundColor: "#0A0A0F",
            color: "#F0F0FF",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {children}
          <VouchToaster />
        </body>
      </html>
    </ClerkProvider>
  )
}