"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 leading-tight">
              Master Your{" "}
              <span className="bg-gradient-to-r from-orange-500 to-teal-600 bg-clip-text text-transparent">
                Vocabulary
              </span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Learn synonyms, collocations, and word parts through engaging games, interactive quizzes, and video
              lessons. Make vocabulary learning fun and effective.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg h-12 px-8 font-semibold flex items-center gap-2">
              Get Started <ArrowRight size={20} />
            </Button>
            <Button
              variant="outline"
              className="text-lg h-12 px-8 border-2 border-teal-600 text-teal-600 hover:bg-teal-50 bg-transparent"
            >
              Watch Demo
            </Button>
          </div>

          <div className="flex items-center gap-8">
            <div>
              <p className="text-3xl font-bold text-orange-600">1000+</p>
              <p className="text-slate-600">Active Learners</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-teal-600">50+</p>
              <p className="text-slate-600">Lessons</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">3</p>
              <p className="text-slate-600">Epic Games</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-br from-orange-300 to-teal-300 rounded-2xl blur-2xl opacity-30"></div>
          <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
            <img src="/images/image.png" alt="VoDeMe Hero" className="w-full h-auto rounded-lg" />
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <span className="font-semibold text-slate-700">Interactive Learning</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <span className="font-semibold text-slate-700">Real-time Progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
