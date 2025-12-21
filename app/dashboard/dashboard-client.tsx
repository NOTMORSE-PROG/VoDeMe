"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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

interface Lesson {
  id: string
  title: string
  description: string
  duration: number
  videoUrl: string
  completed: boolean
  watchedDuration: number
  progress: number
}

interface DashboardClientProps {
  user: User
  lessons: Lesson[]
}

export default function DashboardClient({ user, lessons }: DashboardClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [page, setPage] = useState<"dashboard" | "synohit" | "hopright" | "wordstudyjournal" | "quiz">("dashboard")
  const initialTab = searchParams.get('tab') as "games" | "lessons" | "quizzes" | "leaderboard" | null

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
      lessons={lessons}
      initialTab={initialTab || undefined}
    />
  )
}
