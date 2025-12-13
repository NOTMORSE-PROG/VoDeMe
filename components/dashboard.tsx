"use client"

import { useState } from "react"

interface DashboardProps {
  user: { email: string; name: string }
  onLogout: () => void
  onPlayGame: (gameName: string) => void
}

export default function Dashboard({ user, onLogout, onPlayGame }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("games")

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-br from-sky-100 via-blue-50 to-sky-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl">📚</span>
              <h1 className="text-xl sm:text-2xl font-bold text-orange-600">VoDeMe</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-6">
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-gray-800">Welcome, {user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={onLogout}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition text-sm sm:text-base"
              >
                Logout
              </button>
            </div>
          </div>
          {/* Mobile user info */}
          <div className="mt-2 sm:hidden">
            <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
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
            <p className="text-xl sm:text-3xl font-bold text-orange-600">2,450</p>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
            <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🔥</div>
            <p className="text-gray-600 text-xs sm:text-sm">Current Streak</p>
            <p className="text-xl sm:text-3xl font-bold text-orange-600">12 days</p>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
            <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🎮</div>
            <p className="text-gray-600 text-xs sm:text-sm">Games Played</p>
            <p className="text-xl sm:text-3xl font-bold text-orange-600">45</p>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
            <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🏆</div>
            <p className="text-gray-600 text-xs sm:text-sm">Rank</p>
            <p className="text-xl sm:text-3xl font-bold text-orange-600">#8</p>
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
            onClick={() => setActiveTab("quizzes")}
            className={`pb-3 sm:pb-4 px-4 sm:px-6 font-semibold transition whitespace-nowrap text-sm sm:text-base ${
              activeTab === "quizzes"
                ? "text-orange-600 border-b-4 border-orange-600 -mb-[2px]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            📝 Quizzes
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

                <p className="text-xs sm:text-sm mb-4 sm:mb-6 text-amber-900 font-semibold text-center bg-amber-50/80 rounded-lg py-2 px-2 sm:px-3 w-full">
                  Find matching synonyms in a tropical village!
                </p>

                <button className="w-full bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:via-amber-800 hover:to-amber-900 text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition shadow-lg border-2 border-amber-900 text-sm sm:text-base">
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

            {/* Other Games */}
            {[
              {
                title: "Word Builder",
                desc: "Learn word parts & prefixes",
                emoji: "🔨",
                color: "from-purple-500 to-purple-600",
                onClick: () => onPlayGame("wordstudyjournal"),
              },
              {
                title: "HopRight",
                desc: "Master word combinations",
                emoji: "🎯",
                color: "from-blue-500 to-blue-600",
                onClick: () => onPlayGame("hopright"),
              },
            ].map((game, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${game.color} rounded-2xl p-6 sm:p-8 text-white shadow-lg hover:shadow-xl transition transform hover:scale-105 cursor-pointer`}
              >
                <p className="text-4xl sm:text-5xl mb-3 sm:mb-4">{game.emoji}</p>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">{game.title}</h3>
                <p className="text-xs sm:text-sm mb-4 sm:mb-6 opacity-90">{game.desc}</p>
                <button
                  onClick={game.onClick}
                  className="bg-white text-blue-600 font-bold py-2 px-4 sm:px-6 rounded-lg hover:bg-gray-100 transition text-sm sm:text-base"
                >
                  Play Now
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Quizzes Section */}
        {activeTab === "quizzes" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                title: "Synonyms Quiz",
                desc: "Test your synonym knowledge",
                emoji: "⚡",
                onClick: () => onPlayGame("quiz"),
              },
              {
                title: "Collocations Quiz",
                desc: "Master word combinations",
                emoji: "🎯",
                onClick: () => onPlayGame("quiz"),
              },
              {
                title: "Word Parts Quiz",
                desc: "Learn prefixes and suffixes",
                emoji: "🔨",
                onClick: () => onPlayGame("quiz"),
              },
            ].map((quiz, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-5 sm:p-6 shadow-md hover:shadow-lg transition cursor-pointer"
                onClick={quiz.onClick}
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{quiz.emoji}</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{quiz.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{quiz.desc}</p>
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition text-sm sm:text-base">
                  Start Quiz
                </button>
              </div>
            ))}
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
