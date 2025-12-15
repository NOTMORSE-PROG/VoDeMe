"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Dashboard from "@/components/dashboard"
import SynohitGame from "@/components/synohit-game"
import HopRightGame from "@/components/hopright-game"
import WordPartsGame from "@/components/word-parts-game"
import QuizGame from "@/components/quiz-game"
import { signOutAction } from "@/app/auth/actions"

interface User {
  email: string
  name: string
  profilePicture: string | null
}

interface DashboardClientProps {
  user: User
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const router = useRouter()
  const [page, setPage] = useState<"dashboard" | "synohit" | "hopright" | "wordstudyjournal" | "quiz">("dashboard")

  const handleLogout = async () => {
    await signOutAction()
  }

  const handleNavigateToProfile = () => {
    router.push("/profile")
  }

  if (page === "synohit") {
    return <SynohitGame onBack={() => setPage("dashboard")} />
  }

  if (page === "hopright") {
    return <HopRightGame onBack={() => setPage("dashboard")} />
  }

  if (page === "wordstudyjournal") {
    return <WordPartsGame onBack={() => setPage("dashboard")} />
  }

  if (page === "quiz") {
    return <QuizGame onBack={() => setPage("dashboard")} />
  }

  return (
    <Dashboard
      user={user}
      onLogout={handleLogout}
      onPlayGame={(gameName) => setPage(gameName as any)}
      onNavigateToProfile={handleNavigateToProfile}
    />
  )
}
