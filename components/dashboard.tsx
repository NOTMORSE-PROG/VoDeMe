"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { getProgress, getLevelStatus } from "@/lib/game-progress"
import { getWordOfDay } from "@/lib/word-data"
import { VideoLessonCard } from "@/components/video-lesson-card"

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

interface DashboardProps {
  user: { email: string; name: string; profilePicture?: string }
  onLogout: () => void
  onPlayGame: (gameName: string) => void
  onNavigateToProfile: () => void
  lessons: Lesson[]
  lessonsCompleted: number
  quizzesCompleted: number
  totalPoints: number
  initialTab?: "games" | "lessons" | "quizzes" | "leaderboard"
}

// Level Progress Indicator Component
function LevelIndicator({ gameName }: { gameName: string }) {
  const [levels, setLevels] = useState<("locked" | "unlocked" | "completed")[]>([])

  useEffect(() => {
    const loadStatuses = async () => {
      const status1 = await getLevelStatus(gameName, 1)
      const status2 = await getLevelStatus(gameName, 2)
      const status3 = await getLevelStatus(gameName, 3)
      setLevels([status1, status2, status3])
    }
    loadStatuses()
  }, [gameName])

  return (
    <div className="flex gap-1 sm:gap-1.5 justify-center mt-2">
      {levels.map((status, index) => (
        <div
          key={index}
          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all ${
            status === "completed"
              ? "bg-green-500 border-green-600 text-white"
              : status === "unlocked"
              ? "bg-yellow-400 border-yellow-500 text-yellow-900"
              : "bg-gray-300 border-gray-400 text-gray-500"
          }`}
          title={`Level ${index + 1}: ${status}`}
        >
          {status === "completed" ? "✓" : status === "unlocked" ? (index + 1) : "🔒"}
        </div>
      ))}
    </div>
  )
}

export default function Dashboard({ user, onLogout, onPlayGame, onNavigateToProfile, lessons, lessonsCompleted, quizzesCompleted, totalPoints, initialTab }: DashboardProps) {
  const [activeTab, setActiveTab] = useState(initialTab || "games")
  const [gameProgress, setGameProgress] = useState<{
    synohit: ReturnType<typeof getProgress>
    hopright: ReturnType<typeof getProgress>
    wordstudyjournal: ReturnType<typeof getProgress>
  }>({
    synohit: { currentLevel: 1, levels: [] },
    hopright: { currentLevel: 1, levels: [] },
    wordstudyjournal: { currentLevel: 1, levels: [] }
  })

  // Update active tab when initialTab prop changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  // Load game progress on mount
  useEffect(() => {
    setGameProgress({
      synohit: getProgress("synohit"),
      hopright: getProgress("hopright"),
      wordstudyjournal: getProgress("wordstudyjournal")
    })
  }, [])

  // Grass styles for HopRight card (client-side only to avoid hydration mismatch)
  const [grassStyles, setGrassStyles] = useState<{ height: number; rotation: number }[]>([])

  useEffect(() => {
    setGrassStyles(
      [...Array(20)].map(() => ({
        height: 10 + Math.random() * 15,
        rotation: Math.random() * 10 - 5,
      }))
    )
  }, [])

  // Get word of the day
  const wordOfDay = getWordOfDay()

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-br from-sky-100 via-blue-50 to-sky-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Image src="/images/vodeme_logo.png" alt="VoDeMe Logo" width={40} height={40} />
              <h1 className="text-xl sm:text-2xl font-bold text-orange-600">VoDeMe</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-3 hidden sm:flex">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-orange-300 shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-right">
                  <p className="font-semibold text-gray-800">Welcome, {user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={onNavigateToProfile}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition text-sm sm:text-base flex items-center gap-2"
                title="Profile Settings"
              >
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-5 h-5 rounded-full object-cover sm:hidden"
                  />
                ) : (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
                <span className="hidden sm:inline">Profile</span>
              </button>
              <button
                onClick={onLogout}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition text-sm sm:text-base"
              >
                Logout
              </button>
            </div>
          </div>
          {/* Mobile user info */}
          <div className="mt-2 sm:hidden flex items-center gap-2">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-orange-300"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-12">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
            <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">⭐</div>
            <p className="text-gray-600 text-xs sm:text-sm">Total Points</p>
            <p className="text-xl sm:text-3xl font-bold text-orange-600">{totalPoints.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
            <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">📚</div>
            <p className="text-gray-600 text-xs sm:text-sm">Lessons Completed</p>
            <p className="text-xl sm:text-3xl font-bold text-orange-600">{lessonsCompleted}</p>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
            <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">✅</div>
            <p className="text-gray-600 text-xs sm:text-sm">Quizzes Completed</p>
            <p className="text-xl sm:text-3xl font-bold text-orange-600">{quizzesCompleted}</p>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
            <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🏆</div>
            <p className="text-gray-600 text-xs sm:text-sm">Rank</p>
            <p className="text-xl sm:text-3xl font-bold text-orange-600">#8</p>
          </div>
        </div>

        {/* Word of the Day Section */}
        <div className="mb-8 bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-orange-600 font-semibold mb-1">Word {wordOfDay.index} of 52</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{wordOfDay.word}</h2>
              <p className="text-sm sm:text-base text-gray-600">{wordOfDay.pronunciation} • {wordOfDay.wordClass}</p>
            </div>
            <div className="hidden sm:block text-4xl">📚</div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-orange-600 uppercase mb-1">Meaning</p>
              <p className="text-sm text-gray-700">{wordOfDay.meaning}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase mb-1">Example</p>
              <p className="text-sm text-gray-600 italic">"{wordOfDay.example}"</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <div>
                <p className="text-xs font-semibold text-green-600 uppercase mb-2">Synonyms</p>
                <div className="flex flex-wrap gap-1">
                  {wordOfDay.synonyms.slice(0, 4).map((syn, i) => (
                    <span key={i} className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs border border-green-200">
                      {syn}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-rose-600 uppercase mb-2">Antonyms</p>
                <div className="flex flex-wrap gap-1">
                  {wordOfDay.antonyms.slice(0, 4).map((ant, i) => (
                    <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded text-xs border border-rose-200">
                      {ant}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 border-b-2 border-gray-200 overflow-x-auto overflow-y-clip">
          <button
            onClick={() => setActiveTab("games")}
            className={`pb-3 sm:pb-4 px-4 sm:px-6 font-semibold transition whitespace-nowrap text-sm sm:text-base ${
              activeTab === "games"
                ? "text-orange-600 border-b-4 border-orange-600 -mb-[2px]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            🎮 Games
          </button>
          <button
            onClick={() => setActiveTab("lessons")}
            className={`pb-3 sm:pb-4 px-4 sm:px-6 font-semibold transition whitespace-nowrap text-sm sm:text-base ${
              activeTab === "lessons"
                ? "text-orange-600 border-b-4 border-orange-600 -mb-[2px]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            🎬 Video Lessons
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`pb-3 sm:pb-4 px-4 sm:px-6 font-semibold transition whitespace-nowrap text-sm sm:text-base ${
              activeTab === "leaderboard"
                ? "text-orange-600 border-b-4 border-orange-600 -mb-[2px]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            🏅 Leaderboard
          </button>
        </div>

        {/* Games Section */}
        {activeTab === "games" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* SynoHit Card - Special Tropical Theme */}
            <div
              className="relative bg-gradient-to-b from-sky-400 via-sky-300 to-amber-100 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition transform hover:scale-105 cursor-pointer overflow-hidden"
              onClick={() => onPlayGame("synohit")}
            >
              {/* Background decorative elements */}
              {/* Sun with glow and float animation */}
              <div className="absolute top-4 right-4 w-16 h-16 sm:w-20 sm:h-20 animate-sun-float">
                <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl opacity-60" />
                <div className="absolute inset-2 bg-yellow-200 rounded-full" />
              </div>

              {/* Animated butterflies */}
              <div className="absolute top-1/4 left-1/4 text-xl sm:text-2xl animate-butterfly opacity-60" style={{ animationDelay: '0s' }}>
                🦋
              </div>
              <div className="absolute top-1/2 right-1/3 text-lg sm:text-xl animate-butterfly opacity-50" style={{ animationDelay: '1s' }}>
                🦋
              </div>
              <div className="absolute bottom-1/3 left-1/2 text-base sm:text-lg animate-butterfly opacity-40" style={{ animationDelay: '2s' }}>
                🦋
              </div>

              {/* Palm trees */}
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-lg sm:text-xl">🌴</div>
              <div className="absolute bottom-3 right-6 sm:bottom-4 sm:right-8 text-lg sm:text-xl">🌴</div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center">
                {/* Wooden sign style title */}
                <div className="bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 rounded-lg px-3 py-2 sm:px-4 sm:py-3 mb-2 sm:mb-3 border-3 sm:border-4 border-amber-950 shadow-xl relative">
                  <div className="absolute top-1 left-1 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-400 rounded-full"></div>
                  <div className="absolute top-1 right-1 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-400 rounded-full"></div>
                  <div className="absolute bottom-1 left-1 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-400 rounded-full"></div>
                  <div className="absolute bottom-1 right-1 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-400 rounded-full"></div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white text-center drop-shadow-lg">SynoHit</h3>
                </div>

                <p className="text-xs sm:text-sm mb-3 sm:mb-4 text-amber-900 font-semibold text-center bg-amber-50/80 rounded-lg py-2 px-2 sm:px-3 w-full">
                  Find matching synonyms in a tropical village!
                </p>

                {/* Level Progress */}
                <LevelIndicator gameName="synohit" />

                <button className="w-full bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:via-amber-800 hover:to-amber-900 text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition shadow-lg border-2 border-amber-900 text-sm sm:text-base mt-3 sm:mt-4">
                  Play Now
                </button>
              </div>

              {/* CSS Animation for butterflies and sun */}
              <style jsx>{`
                @keyframes butterfly {
                  0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
                  25% { transform: translateX(10px) translateY(-10px) rotate(5deg); }
                  50% { transform: translateX(0) translateY(-15px) rotate(-5deg); }
                  75% { transform: translateX(-10px) translateY(-10px) rotate(5deg); }
                }
                .animate-butterfly {
                  animation: butterfly 6s ease-in-out infinite;
                }

                @keyframes sun-float {
                  0%, 100% { transform: translateX(0) translateY(0) scale(1); }
                  25% { transform: translateX(-8px) translateY(-8px) scale(1.05); }
                  50% { transform: translateX(0) translateY(-12px) scale(1.1); }
                  75% { transform: translateX(8px) translateY(-8px) scale(1.05); }
                }
                .animate-sun-float {
                  animation: sun-float 8s ease-in-out infinite;
                }
              `}</style>
            </div>

            {/* HopRight Card - Nature Theme */}
            <div
              className="relative bg-gradient-to-b from-cyan-400 via-sky-300 to-emerald-200 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition transform hover:scale-105 cursor-pointer overflow-hidden"
              onClick={() => onPlayGame("hopright")}
            >
              {/* Background decorative elements */}
              {/* Sun with glow animation */}
              <div className="absolute top-4 right-4 w-12 h-12 sm:w-16 sm:h-16 animate-sun-float">
                <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl opacity-60 animate-pulse" />
                <div className="absolute inset-2 bg-yellow-200 rounded-full shadow-2xl" />
              </div>

              {/* Animated clouds */}
              <div className="absolute top-8 left-8 opacity-70 animate-cloud-slow hidden sm:block">
                <div className="relative w-16 h-8">
                  <div className="absolute top-0 left-0 w-8 h-6 bg-white rounded-full" />
                  <div className="absolute top-1 left-5 w-10 h-5 bg-white rounded-full" />
                  <div className="absolute top-2 left-3 w-6 h-4 bg-white rounded-full" />
                </div>
              </div>

              {/* Grass at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-green-600 via-green-500 to-transparent pointer-events-none" />

              {/* Grass texture */}
              <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden opacity-20 pointer-events-none">
                {grassStyles.map((style, i) => (
                  <div
                    key={i}
                    className="absolute bottom-0 w-0.5 bg-green-800 rounded-t-full"
                    style={{
                      left: `${i * 5}%`,
                      height: `${style.height}px`,
                      transform: `rotate(${style.rotation}deg)`,
                    }}
                  />
                ))}
              </div>

              {/* Flowers */}
              <div className="absolute bottom-16 left-4 text-xl sm:text-2xl animate-sway">🌸</div>
              <div className="absolute bottom-14 right-6 text-lg sm:text-xl animate-sway" style={{ animationDelay: '0.5s' }}>🌼</div>

              {/* Butterflies */}
              <div className="absolute top-1/3 left-1/4 text-lg sm:text-xl animate-butterfly opacity-60" style={{ animationDelay: '0s' }}>
                🦋
              </div>
              <div className="absolute top-1/2 right-1/4 text-base sm:text-lg animate-butterfly opacity-50" style={{ animationDelay: '1.5s' }}>
                🦋
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center">
                {/* Main character - Frog */}
                <div className="text-4xl sm:text-5xl mb-2 sm:mb-3 animate-bounce-gentle filter drop-shadow-lg">
                  🐸
                </div>

                {/* Title with nature-themed styling */}
                <div className="bg-white/95 backdrop-blur rounded-xl px-3 py-2 sm:px-4 sm:py-3 mb-2 sm:mb-3 border-3 sm:border-4 border-teal-400 shadow-xl">
                  <h3 className="text-xl sm:text-2xl font-bold text-teal-700 text-center">HopRight</h3>
                </div>

                <p className="text-xs sm:text-sm mb-3 sm:mb-4 text-emerald-900 font-semibold text-center bg-white/80 rounded-lg py-2 px-2 sm:px-3 w-full">
                  Master word collocations with a hopping frog!
                </p>

                {/* Level Progress */}
                <LevelIndicator gameName="hopright" />

                <button className="w-full bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 hover:from-teal-600 hover:via-emerald-600 hover:to-teal-700 text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition shadow-lg border-2 border-teal-700 text-sm sm:text-base mt-3 sm:mt-4">
                  Play Now
                </button>
              </div>

              {/* CSS Animations */}
              <style jsx>{`
                @keyframes cloud-slow {
                  0%, 100% { transform: translateX(0); }
                  50% { transform: translateX(15px); }
                }
                @keyframes sway {
                  0%, 100% { transform: rotate(-5deg); }
                  50% { transform: rotate(5deg); }
                }
                @keyframes butterfly {
                  0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
                  25% { transform: translateX(15px) translateY(-10px) rotate(10deg); }
                  50% { transform: translateX(0) translateY(-17px) rotate(-5deg); }
                  75% { transform: translateX(-15px) translateY(-10px) rotate(10deg); }
                }
                @keyframes bounce-gentle {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-8px); }
                }
                @keyframes sun-float {
                  0%, 100% { transform: translateX(0) translateY(0) scale(1); }
                  25% { transform: translateX(-5px) translateY(-5px) scale(1.05); }
                  50% { transform: translateX(0) translateY(-8px) scale(1.1); }
                  75% { transform: translateX(5px) translateY(-5px) scale(1.05); }
                }
                .animate-cloud-slow {
                  animation: cloud-slow 10s ease-in-out infinite;
                }
                .animate-sway {
                  animation: sway 3s ease-in-out infinite;
                }
                .animate-butterfly {
                  animation: butterfly 6s ease-in-out infinite;
                }
                .animate-bounce-gentle {
                  animation: bounce-gentle 2s ease-in-out infinite;
                }
                .animate-sun-float {
                  animation: sun-float 8s ease-in-out infinite;
                }
              `}</style>
            </div>

            {/* Word Study Journal Card - Classroom Theme */}
            <div
              className="relative bg-gradient-to-b from-amber-100 via-amber-50 to-orange-100 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition transform hover:scale-105 cursor-pointer overflow-hidden"
              onClick={() => onPlayGame("wordstudyjournal")}
            >
              {/* Chalkboard at top */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[85%] h-16 bg-gradient-to-b from-emerald-800 via-emerald-900 to-emerald-950 rounded border-4 border-amber-700 shadow-lg">
                <div className="absolute inset-1 border border-amber-600/30 rounded" />
                {/* Chalk text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm font-bold opacity-80">ABC 123</span>
                </div>
              </div>

              {/* Desk surface at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-800 via-amber-700 to-amber-600 opacity-80" />

              {/* Notebook decorations */}
              <div className="absolute bottom-14 left-4 text-xl sm:text-2xl">📓</div>
              <div className="absolute bottom-16 right-4 text-lg sm:text-xl">✏️</div>
              <div className="absolute top-20 right-4 text-lg sm:text-xl animate-float-slow">📝</div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center mt-12">
                {/* Notebook icon */}
                <div className="text-4xl sm:text-5xl mb-2 sm:mb-3 filter drop-shadow-lg animate-float-slow">
                  📖
                </div>

                {/* Title with notebook styling */}
                <div className="bg-white/95 backdrop-blur rounded-xl px-3 py-2 sm:px-4 sm:py-3 mb-2 sm:mb-3 border-3 sm:border-4 border-amber-400 shadow-xl">
                  <h3 className="text-lg sm:text-xl font-bold text-amber-700 text-center">Word Study Journal</h3>
                </div>

                <p className="text-xs sm:text-sm mb-3 sm:mb-4 text-amber-900 font-semibold text-center bg-white/80 rounded-lg py-2 px-2 sm:px-3 w-full">
                  Master prefixes, suffixes & word forms!
                </p>

                {/* Level Progress */}
                <LevelIndicator gameName="wordstudyjournal" />

                <button className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition shadow-lg border-2 border-amber-700 text-sm sm:text-base mt-3 sm:mt-4">
                  Play Now
                </button>
              </div>

              {/* CSS Animations */}
              <style jsx>{`
                @keyframes float-slow {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-5px); }
                }
                .animate-float-slow {
                  animation: float-slow 3s ease-in-out infinite;
                }
              `}</style>
            </div>
          </div>
        )}

        {/* Video Lessons Section */}
        {activeTab === "lessons" && (
          <div className="space-y-4">
            {lessons.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-md">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Video Lessons Yet</h3>
                <p className="text-gray-600">Check back soon for vocabulary learning videos!</p>
              </div>
            ) : (
              lessons.map((lesson) => (
                <VideoLessonCard
                  key={lesson.id}
                  lesson={lesson}
                  videoUrl={lesson.videoUrl}
                />
              ))
            )}
          </div>
        )}

        {/* Leaderboard Section */}
        {activeTab === "leaderboard" && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-sm sm:text-base">Rank</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-sm sm:text-base">Player</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-sm sm:text-base">Points</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-sm sm:text-base">Streak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { rank: 1, name: "Alex Chen", points: 5230, streak: 28 },
                    { rank: 2, name: "Sarah Miller", points: 4890, streak: 21 },
                    { rank: 3, name: "You", points: 2450, streak: 12, highlight: true },
                    { rank: 8, name: "Jordan Lee", points: 1950, streak: 8 },
                    { rank: 9, name: "Emma Davis", points: 1820, streak: 6 },
                  ].map((player, idx) => (
                    <tr key={idx} className={player.highlight ? "bg-orange-50" : ""}>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 font-bold text-gray-800 text-sm sm:text-base">#{player.rank}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-800 text-sm sm:text-base">{player.name}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-orange-600 font-bold text-sm sm:text-base">{player.points}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 text-sm sm:text-base">🔥 {player.streak}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
