"use client"

import { BookOpen, Trophy, Zap, Users, BarChart3, Target } from "lucide-react"

const features = [
  {
    icon: BookOpen,
    title: "Video Lessons",
    description: "Learn synonyms, collocations, and word parts through clear, engaging video content.",
  },
  {
    icon: Zap,
    title: "Daily Words",
    description: "Get a new word every day with IPA transcription, meanings, examples, and more.",
  },
  {
    icon: Trophy,
    title: "Leaderboard",
    description: "Compete with peers and track your ranking across all games and quizzes.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracker",
    description: "Monitor your improvement and see detailed stats on each activity you complete.",
  },
  {
    icon: Users,
    title: "Learning Wall",
    description: "Share insights with classmates and learn from the vocabulary community.",
  },
  {
    icon: Target,
    title: "Gamified Learning",
    description: "Earn points through interactive games designed to boost engagement and retention.",
  },
]

export default function Features() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Everything You Need to{" "}
          <span className="bg-gradient-to-r from-orange-500 to-teal-600 bg-clip-text text-transparent">Succeed</span>
        </h2>
        <p className="text-xl text-slate-600">Comprehensive features designed for effective vocabulary learning</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-sky-100"
            >
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center mb-6">
                <Icon className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
