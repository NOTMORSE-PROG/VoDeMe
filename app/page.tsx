"use client"

import { useState } from "react"
import Home from "@/components/home"
import SignIn from "@/components/sign-in"
import SignUp from "@/components/sign-up"
import Dashboard from "@/components/dashboard"
import SynohitGame from "@/components/synohit-game"
import HopRightGame from "@/components/hopright-game"
import WordStudyJournal from "@/components/word-study-journal"
import QuizGame from "@/components/quiz-game"

export default function AppPage() {
  const [page, setPage] = useState<
    "home" | "signin" | "signup" | "dashboard" | "synohit" | "hopright" | "wordstudyjournal" | "quiz"
  >("home")
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)

  const handleSignIn = (email: string) => {
    setUser({ email, name: email.split("@")[0] })
    setPage("dashboard")
  }

  const handleSignUp = (email: string, name: string) => {
    setUser({ email, name })
    setPage("dashboard")
  }

  const handleLogout = () => {
    setUser(null)
    setPage("home")
  }

  if (page === "home") {
    return <Home onNavigate={(p) => setPage(p)} />
  }

  if (page === "synohit") {
    return <SynohitGame onBack={() => setPage("dashboard")} />
  }

  if (page === "hopright") {
    return (
      <div>
        <button
          onClick={() => setPage("dashboard")}
          className="absolute top-4 left-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        >
          ← Back to Dashboard
        </button>
        <HopRightGame />
      </div>
    )
  }

  if (page === "wordstudyjournal") {
    return (
      <div>
        <button
          onClick={() => setPage("dashboard")}
          className="absolute top-4 left-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        >
          ← Back to Dashboard
        </button>
        <WordStudyJournal />
      </div>
    )
  }

  if (page === "quiz") {
    return <QuizGame onBack={() => setPage("dashboard")} />
  }

  if (page === "dashboard" && user) {
    return <Dashboard user={user} onLogout={handleLogout} onPlayGame={() => setPage("synohit")} />
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {page === "signin" ? (
        <SignIn onSignIn={handleSignIn} onToggleSignUp={() => setPage("signup")} />
      ) : (
        <SignUp onSignUp={handleSignUp} onToggleSignIn={() => setPage("signin")} />
      )}
    </div>
  )
}
