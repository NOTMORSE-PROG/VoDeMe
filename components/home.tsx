"use client"

import Image from "next/image"

interface HomeProps {
  onNavigate: (page: "signin" | "signup") => void
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="VoDeMe Logo" width={40} height={40} />
          <h1 className="text-2xl font-bold text-gray-900">VoDeMe</h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => onNavigate("signin")}
            className="px-6 py-2 text-gray-700 font-medium hover:text-gray-900 transition"
          >
            Log In
          </button>
          <button
            onClick={() => onNavigate("signup")}
            className="px-6 py-2 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 transition"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Master Your Vocabulary</h2>
          <p className="text-xl text-gray-600 mb-8">
            Learn synonyms, collocations, and word parts through engaging games, quizzes, and interactive lessons
            designed for Grade 10 students.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-6 mb-12 mt-12">
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="text-3xl mb-3">🎮</div>
              <h3 className="font-bold text-gray-900 mb-2">Interactive Games</h3>
              <p className="text-sm text-gray-600">Learn through fun word games and challenges</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold text-gray-900 mb-2">Track Progress</h3>
              <p className="text-sm text-gray-600">See your improvement with detailed analytics</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="text-3xl mb-3">🏆</div>
              <h3 className="font-bold text-gray-900 mb-2">Compete & Win</h3>
              <p className="text-sm text-gray-600">Climb the leaderboard and earn badges</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => onNavigate("signup")}
              className="px-8 py-3 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition text-lg"
            >
              Get Started Free
            </button>
            <button
              onClick={() => onNavigate("signin")}
              className="px-8 py-3 bg-gray-200 text-gray-900 font-bold rounded-full hover:bg-gray-300 transition text-lg"
            >
              Sign In
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 px-6 py-8 text-center text-gray-600 text-sm">
        <p>© 2025 VoDeMe. Master your vocabulary today.</p>
      </footer>
    </div>
  )
}
