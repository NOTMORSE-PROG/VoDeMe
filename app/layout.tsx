import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "VoDeMe - Master Your Vocabulary",
  description:
    "Learn synonyms, collocations, and word parts through engaging games, quizzes, and video lessons designed for Grade 10 students.",
  generator: "v0.app",
  icons: {
    icon: "/images/vodeme_logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
