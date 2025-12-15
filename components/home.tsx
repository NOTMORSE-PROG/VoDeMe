"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 md:py-5 backdrop-blur-sm bg-white/80 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <Image src="/images/vodeme_logo.png" alt="VoDeMe Logo" width={40} height={40} className="drop-shadow-md sm:w-12 sm:h-12" />
          <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
            VoDeMe
          </h1>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => router.push("/auth/signin")}
            className="px-3 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base text-gray-700 font-semibold hover:text-orange-600 transition-all hover:scale-105"
          >
            Log In
          </button>
          <button
            onClick={() => router.push("/auth/signup")}
            className="px-4 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="max-w-5xl mx-auto w-full">
          {/* Hero Content */}
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <div className="inline-block mb-4 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-xs sm:text-sm font-semibold">
              For Grade 10 Students
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
              Master Your
              <span className="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent"> Vocabulary</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
              Learn synonyms, collocations, and word parts through engaging games, quizzes, and interactive lessons.
              <span className="block mt-2 font-semibold text-gray-700">Level up your language skills today!</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-4">
              <button
                onClick={() => router.push("/auth/signup")}
                className="px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all text-base sm:text-lg shadow-lg"
              >
                Get Started Free
              </button>
              <button
                onClick={() => router.push("/auth/signin")}
                className="px-8 sm:px-10 py-3 sm:py-4 bg-white text-gray-900 font-bold rounded-full hover:shadow-xl hover:scale-105 transition-all text-base sm:text-lg border-2 border-gray-200"
              >
                Sign In
              </button>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">No credit card required • Free forever</p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16 md:mb-20 px-4">
            <div className="group p-6 sm:p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">🎮</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Interactive Games</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Learn through fun word games and challenges designed to make vocabulary stick
              </p>
            </div>
            <div className="group p-6 sm:p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">📊</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Track Progress</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                See your improvement with detailed analytics and personalized insights
              </p>
            </div>
            <div className="group p-6 sm:p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100 sm:col-span-2 md:col-span-1">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">🏆</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Compete & Win</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Climb the leaderboard and earn badges to showcase your achievements
              </p>
            </div>
          </div>

          {/* Research Team Section */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-100 mx-4">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Research Team</h3>
              <p className="text-sm sm:text-base text-gray-600">Student Researchers who made this project possible</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="text-center p-4 sm:p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-all">
                <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">🔬</div>
                <p className="font-bold text-gray-900 text-base sm:text-lg">Jane Caroline DC. Aquino</p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Student Researcher</p>
              </div>
              <div className="text-center p-4 sm:p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-all">
                <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">🔬</div>
                <p className="font-bold text-gray-900 text-base sm:text-lg">Jenica Mae M. Clemente</p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Student Researcher</p>
              </div>
              <div className="text-center p-4 sm:p-6 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-lg transition-all sm:col-span-2 md:col-span-1">
                <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">🔬</div>
                <p className="font-bold text-gray-900 text-base sm:text-lg">Nicole Anne M. Logan</p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Student Researcher</p>
              </div>
            </div>
            <div className="text-center pt-4 sm:pt-6 border-t border-gray-200">
              <p className="text-sm sm:text-base text-gray-600 mb-2">Developed by</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">Mark Andrei A. Condino</p>
              <p className="text-xs sm:text-sm text-gray-600">Full Stack Developer</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 px-4 sm:px-6 py-6 sm:py-8 text-center mt-12 sm:mt-16 md:mt-20">
        <p className="mb-1 text-sm sm:text-base font-semibold">© 2025 VoDeMe</p>
        <p className="text-xs sm:text-sm text-gray-400">Empowering students to master vocabulary through innovation</p>
      </footer>
    </div>
  )
}
