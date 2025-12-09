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
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-sky-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📚</span>
            <h1 className="text-2xl font-bold text-orange-600">VoDeMe</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="font-semibold text-gray-800">Welcome, {user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl mb-2">⭐</div>
            <p className="text-gray-600 text-sm">Total Points</p>
            <p className="text-3xl font-bold text-orange-600">2,450</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl mb-2">🔥</div>
            <p className="text-gray-600 text-sm">Current Streak</p>
            <p className="text-3xl font-bold text-orange-600">12 days</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl mb-2">🎮</div>
            <p className="text-gray-600 text-sm">Games Played</p>
            <p className="text-3xl font-bold text-orange-600">45</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-gray-600 text-sm">Rank</p>
            <p className="text-3xl font-bold text-orange-600">#8</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab("games")}
            className={`pb-4 px-6 font-semibold transition ${
              activeTab === "games"
                ? "text-orange-600 border-b-4 border-orange-600 -mb-2"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            🎮 Games
          </button>
          <button
            onClick={() => setActiveTab("quizzes")}
            className={`pb-4 px-6 font-semibold transition ${
              activeTab === "quizzes"
                ? "text-orange-600 border-b-4 border-orange-600 -mb-2"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            📝 Quizzes
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`pb-4 px-6 font-semibold transition ${
              activeTab === "leaderboard"
                ? "text-orange-600 border-b-4 border-orange-600 -mb-2"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            🏅 Leaderboard
          </button>
        </div>

        {/* Games Section */}
        {activeTab === "games" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Synonym Sprint",
                desc: "Find matching synonyms",
                emoji: "⚡",
                color: "from-orange-500 to-orange-600",
                onClick: () => onPlayGame("synohit"),
              },
              {
                title: "Word Builder",
                desc: "Learn word parts & prefixes",
                emoji: "🔨",
                color: "from-purple-500 to-purple-600",
                onClick: () => onPlayGame("wordstudyjournal"),
              },
              {
                title: "Collocation Match",
                desc: "Master word combinations",
                emoji: "🎯",
                color: "from-blue-500 to-blue-600",
                onClick: () => onPlayGame("hopright"),
              },
            ].map((game, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${game.color} rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition transform hover:scale-105 cursor-pointer`}
              >
                <p className="text-5xl mb-4">{game.emoji}</p>
                <h3 className="text-2xl font-bold mb-2">{game.title}</h3>
                <p className="text-sm mb-6 opacity-90">{game.desc}</p>
                <button
                  onClick={game.onClick}
                  className="bg-white text-blue-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition"
                >
                  Play Now
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Quizzes Section */}
        {activeTab === "quizzes" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition cursor-pointer"
                onClick={quiz.onClick}
              >
                <div className="text-4xl mb-4">{quiz.emoji}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{quiz.title}</h3>
                <p className="text-gray-600 mb-6">{quiz.desc}</p>
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition">
                  Start Quiz
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Leaderboard Section */}
        {activeTab === "leaderboard" && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Rank</th>
                    <th className="px-6 py-4 text-left font-semibold">Player</th>
                    <th className="px-6 py-4 text-left font-semibold">Points</th>
                    <th className="px-6 py-4 text-left font-semibold">Streak</th>
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
                      <td className="px-6 py-4 font-bold text-gray-800">#{player.rank}</td>
                      <td className="px-6 py-4 font-semibold text-gray-800">{player.name}</td>
                      <td className="px-6 py-4 text-orange-600 font-bold">{player.points}</td>
                      <td className="px-6 py-4 text-gray-600">🔥 {player.streak}</td>
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
