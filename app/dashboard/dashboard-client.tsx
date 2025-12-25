"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Dashboard from "@/components/dashboard"
import SynohitGame from "@/components/synohit-game"
import HopRightGame from "@/components/hopright-game"
import WordPartsGame from "@/components/word-parts-game"
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
  hasQuiz?: boolean
  quizCompleted?: boolean
}

interface DashboardClientProps {
  user: User
  lessons: Lesson[]
  lessonsCompleted: number
  quizzesCompleted: number
  totalPoints: number
}

export default function DashboardClient({ user, lessons, lessonsCompleted, quizzesCompleted, totalPoints }: DashboardClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [page, setPage] = useState<"dashboard" | "synohit" | "hopright" | "wordstudyjournal">("dashboard")
  const initialTab = searchParams.get('tab') as "games" | "lessons" | "leaderboard" | null

  const handleLogout = async () => {
    await signOutAction()
  }

  const handleNavigateToProfile = () => {
    router.push("/profile")
  }

  const handleBackFromGame = () => {
    setPage("dashboard")
    router.push("/dashboard?tab=games")
  }

  if (page === "synohit") {
    return <SynohitGame onBack={handleBackFromGame} />
  }

  if (page === "hopright") {
    return <HopRightGame onBack={handleBackFromGame} />
  }

  if (page === "wordstudyjournal") {
    return <WordPartsGame onBack={handleBackFromGame} />
  }

  return (
    <Dashboard
      user={user}
      onLogout={handleLogout}
      onPlayGame={(gameName) => setPage(gameName as any)}
      onNavigateToProfile={handleNavigateToProfile}
      lessons={lessons}
      lessonsCompleted={lessonsCompleted}
      quizzesCompleted={quizzesCompleted}
      totalPoints={totalPoints}
      initialTab={initialTab || undefined}
    />
  )
}
