"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 backdrop-blur-sm bg-white/80 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <Image src="/images/vodeme_logo.png" alt="VoDeMe Logo" width={48} height={48} className="drop-shadow-md" />
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
            VoDeMe
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/auth/signin")}
            className="px-6 py-2.5 text-gray-700 font-semibold hover:text-orange-600 transition-all hover:scale-105"
          >
            Log In
          </button>
          <button
            onClick={() => router.push("/auth/signup")}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-5xl mx-auto w-full">
          {/* Hero Content */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block mb-4 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
              For Grade 10 Students
            </div>
            <h2 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
              Master Your
              <span className="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent"> Vocabulary</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Learn synonyms, collocations, and word parts through engaging games, quizzes, and interactive lessons.
              <span className="block mt-2 font-semibold text-gray-700">Level up your language skills today!</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center mb-8">
              <button
                onClick={() => router.push("/auth/signup")}
                className="px-10 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all text-lg shadow-lg"
              >
                Get Started Free
              </button>
              <button
                onClick={() => router.push("/auth/signin")}
                className="px-10 py-4 bg-white text-gray-900 font-bold rounded-full hover:shadow-xl hover:scale-105 transition-all text-lg border-2 border-gray-200"
              >
                Sign In
              </button>
            </div>
            <p className="text-sm text-gray-500">No credit card required • Free forever</p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🎮</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Interactive Games</h3>
              <p className="text-gray-600 leading-relaxed">
                Learn through fun word games and challenges designed to make vocabulary stick
              </p>
            </div>
            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Track Progress</h3>
              <p className="text-gray-600 leading-relaxed">
                See your improvement with detailed analytics and personalized insights
              </p>
            </div>
            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🏆</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Compete & Win</h3>
              <p className="text-gray-600 leading-relaxed">
                Climb the leaderboard and earn badges to showcase your achievements
              </p>
            </div>
          </div>

          {/* Research Team Section */}
          <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Research Team</h3>
              <p className="text-gray-600">Student Researchers who made this project possible</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-all">
                <div className="text-5xl mb-3">🔬</div>
                <p className="font-bold text-gray-900 text-lg">Jane Caroline DC. Aquino</p>
                <p className="text-sm text-gray-600 mt-1">Student Researcher</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-all">
                <div className="text-5xl mb-3">🔬</div>
                <p className="font-bold text-gray-900 text-lg">Jenica Mae M. Clemente</p>
                <p className="text-sm text-gray-600 mt-1">Student Researcher</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-lg transition-all">
                <div className="text-5xl mb-3">🔬</div>
                <p className="font-bold text-gray-900 text-lg">Nicole Anne M. Logan</p>
                <p className="text-sm text-gray-600 mt-1">Student Researcher</p>
              </div>
            </div>
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-gray-600 mb-2">Developed by</p>
              <p className="text-xl font-bold text-gray-900">Mark Andrei A. Condino</p>
              <p className="text-sm text-gray-600">Full Stack Developer</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 px-6 py-8 text-center mt-20">
        <p className="mb-1 font-semibold">© 2025 VoDeMe</p>
        <p className="text-sm text-gray-400">Empowering students to master vocabulary through innovation</p>
      </footer>
    </div>
  )
}
