"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="bg-gradient-to-br from-orange-500 via-orange-400 to-teal-600 rounded-3xl p-12 md:p-20 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Start Your Vocabulary Journey Today</h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
            Join thousands of Grade 10 students who are already improving their vocabulary depth through engaging games,
            quizzes, and interactive lessons.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-orange-600 hover:bg-sky-50 text-lg h-12 px-8 font-semibold flex items-center justify-center gap-2">
              Get Started Free <ArrowRight size={20} />
            </Button>
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 text-lg h-12 px-8 font-semibold bg-transparent"
            >
              Learn More
            </Button>
          </div>

          <div className="mt-12 pt-12 border-t border-white/20">
            <p className="text-sm text-white/80 mb-4">Available across all devices • Optimized for low data usage</p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <span className="text-white/90 font-medium">🌍 Accessible Anywhere</span>
              <span className="text-white/90 font-medium">📱 Mobile Friendly</span>
              <span className="text-white/90 font-medium">⚡ No Ads</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
