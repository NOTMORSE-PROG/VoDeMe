"use client"

import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"

const games = [
  {
    name: "SynoHit",
    description:
      "Hit the can with the correct synonym in this Tumbang Preso-inspired game. Three levels of increasing difficulty to test your synonym mastery.",
    icon: "🎮",
    color: "from-orange-400 to-orange-600",
  },
  {
    name: "HopRight: Collocation Edition",
    description:
      "Help the character hop to the right collocation pairs. Navigate through Easy, Medium, and Hard levels to become a collocation expert.",
    icon: "🦘",
    color: "from-teal-400 to-teal-600",
  },
  {
    name: "The Word Study Journal",
    description:
      "Deconstruct words into prefixes, bases, and suffixes. Learn derived and inflected forms through interactive notebook activities.",
    icon: "📓",
    color: "from-blue-400 to-blue-600",
  },
]

export default function Games() {
  return (
    <section id="games" className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Play & Learn with Our{" "}
          <span className="bg-gradient-to-r from-orange-500 to-teal-600 bg-clip-text text-transparent">Games</span>
        </h2>
        <p className="text-xl text-slate-600">Master vocabulary through three unique, engaging games</p>
      </div>

      <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
        {games.map((game, index) => (
          <div key={index} className="group relative">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${game.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition`}
            ></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              <div className="text-5xl mb-4">{game.icon}</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{game.name}</h3>
              <p className="text-slate-600 leading-relaxed mb-6 flex-grow">{game.description}</p>
              <Button
                className={`w-full bg-gradient-to-r ${game.color} text-white font-semibold flex items-center justify-center gap-2`}
              >
                <Play size={18} /> Play Now
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
