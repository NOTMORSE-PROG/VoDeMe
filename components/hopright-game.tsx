"use client"

import { useState, useEffect } from "react"
import React from "react"

interface Stage {
  targetWord?: string
  sentence?: string
  options: string[]
  correct: number
}

const levelData = {
  easy: [
    { targetWord: "breakfast", options: ["have a breakfast", "make breakfast", "eat a breakfast"], correct: 1 },
    { targetWord: "rain", options: ["heavy rain", "loud rain", "soft rain"], correct: 0 },
    {
      sentence: "Arthur needs to ________ before going out.",
      options: ["take homework", "do homework", "make homework"],
      correct: 1,
    },
    { targetWord: "cold", options: ["big cold", "strong cold", "catch a cold"], correct: 2 },
    {
      sentence: "Everyone makes a ________, so don't be too hard on yourself.",
      options: ["makes a mistaken", "makes a mistakes", "make a mistake"],
      correct: 2,
    },
    { targetWord: "food", options: ["quick food", "fast food", "slow food"], correct: 1 },
    {
      sentence: "Peter Parker need ________ to wake up this morning.",
      options: ["soft coffee", "strong coffee", "weak coffee"],
      correct: 1,
    },
    { targetWord: "promise", options: ["say a promise", "have a promise", "break a promise"], correct: 2 },
    {
      sentence: "Some teenagers prefer to ________ to organize their thoughts.",
      options: ["keep a diary", "do a diary", "create a diary"],
      correct: 0,
    },
    {
      sentence: "The students in room 404 made a ________ outside the classroom.",
      options: ["strong noise", "soft noise", "loud noise"],
      correct: 2,
    },
  ],
  medium: [
    {
      sentence: "The students are starting to ________ in their vocabulary learning.",
      options: ["do progress", "make progress", "have progress"],
      correct: 1,
    },
    { targetWord: "energy", options: ["high energy", "nuclear energy", "powerful energy"], correct: 0 },
    { targetWord: "vocabulary", options: ["wide vocabulary", "thick vocabulary", "broad vocabulary"], correct: 2 },
    { targetWord: "research", options: ["carry up research", "conduct research", "carry out research"], correct: 1 },
    {
      sentence: "The researchers will ________ to collect data.",
      options: ["conduct a survey", "create a survey", "do a survey"],
      correct: 0,
    },
    {
      sentence: "The softball team felt ________ after losing the finals.",
      options: ["strong disappointment", "bitter disappointment", "loud disappointment"],
      correct: 1,
    },
    {
      targetWord: "appointment",
      options: ["keep an appointment", "take an appointment", "do an appointment"],
      correct: 0,
    },
    {
      sentence: "I ________ that education changes lives.",
      options: ["softly believe", "begly believe", "firmly believe"],
      correct: 2,
    },
    { targetWord: "follow", options: ["slowly follow", "strictly follow", "loudly follow"], correct: 1 },
    {
      sentence: "Teachers were ________ about the sudden drop in attendance.",
      options: ["lightly concerned", "strongly concerned", "deeply concerned"],
      correct: 2,
    },
  ],
  hard: [
    {
      targetWord: "regulations",
      options: ["comply in regulations", "comply with regulations", "obey regulations quickly"],
      correct: 1,
    },
    {
      sentence: "All athletes must ________ to avoid penalties.",
      options: ["follow in rules", "obey rules strongly", "adhere to rules"],
      correct: 2,
    },
    {
      sentence: "Teachers often have to ________ when deadlines are tight.",
      options: ["look on the problem", "grapple with a problem", "push a problem"],
      correct: 1,
    },
    { targetWord: "conflict", options: ["resolve a conflict", "dissolve a conflict", "break a conflict"], correct: 0 },
    { targetWord: "debate", options: ["hotted debate", "heated debate", "warmed debate"], correct: 1 },
    {
      sentence: "The rise of fake news continues to ________ to society.",
      options: ["have a danger", "make a threat", "pose a threat"],
      correct: 2,
    },
    {
      sentence: "The two sides reached a ________ during negotiations.",
      options: ["strong agreement", "tentative agreement", "cold agreement"],
      correct: 1,
    },
    { targetWord: "pressure", options: ["mounting pressure", "thicking pressure", "widening pressure"], correct: 0 },
    { targetWord: "damaged", options: ["greatly damaged", "hardly damaged", "severely damaged"], correct: 2 },
    {
      sentence: "It is ________ that the school will cancel classes today.",
      options: ["barely unlikely", "softly unlikely", "highly unlikely"],
      correct: 2,
    },
  ],
}

// High School Background Component
function HighSchoolBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Sky with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-green-200" />

      {/* Sun */}
      <div className="absolute top-8 right-16 w-20 h-20">
        <div className="absolute inset-0 bg-yellow-300 rounded-full blur-lg opacity-60 animate-pulse" />
        <div className="absolute inset-2 bg-yellow-200 rounded-full shadow-xl" />
      </div>

      {/* Clouds */}
      <div className="absolute top-12 left-20 w-32 h-12 opacity-90 animate-float-slow">
        <div className="absolute top-0 left-0 w-16 h-10 bg-white rounded-full" />
        <div className="absolute top-2 left-10 w-24 h-8 bg-white rounded-full" />
      </div>
      <div className="absolute top-20 right-32 w-28 h-10 opacity-80 animate-float-slower">
        <div className="absolute top-0 right-0 w-14 h-8 bg-white rounded-full" />
        <div className="absolute top-2 right-8 w-20 h-6 bg-white rounded-full" />
      </div>

      {/* Large Modern School Building in background */}
      <div className="absolute bottom-64 left-1/2 -translate-x-1/2 z-5">
        <div className="relative">
          {/* Main Building - Large and modern */}
          <div className="relative w-96 h-56 bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600 rounded-lg border-6 border-orange-700 shadow-2xl">
            {/* Building accents - horizontal lines */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-orange-800"></div>
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-orange-800"></div>

            {/* Windows Grid - 3 floors */}
            <div className="grid grid-cols-6 gap-3 p-6">
              {/* First Floor Windows */}
              {[...Array(6)].map((_, i) => (
                <div key={`f1-${i}`} className="w-12 h-14 bg-gradient-to-b from-sky-300 to-sky-400 border-3 border-blue-900 rounded-sm shadow-md relative overflow-hidden">
                  {/* Window cross */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-900 -translate-y-1/2"></div>
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-900 -translate-x-1/2"></div>
                  {/* Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
                </div>
              ))}
              {/* Second Floor Windows */}
              {[...Array(6)].map((_, i) => (
                <div key={`f2-${i}`} className="w-12 h-14 bg-gradient-to-b from-sky-300 to-sky-400 border-3 border-blue-900 rounded-sm shadow-md relative overflow-hidden">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-900 -translate-y-1/2"></div>
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-900 -translate-x-1/2"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
                </div>
              ))}
              {/* Third Floor Windows */}
              {[...Array(6)].map((_, i) => (
                <div key={`f3-${i}`} className="w-12 h-14 bg-gradient-to-b from-sky-300 to-sky-400 border-3 border-blue-900 rounded-sm shadow-md relative overflow-hidden">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-900 -translate-y-1/2"></div>
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-900 -translate-x-1/2"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
                </div>
              ))}
            </div>

            {/* Entrance - Double doors */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              <div className="w-16 h-32 bg-gradient-to-b from-red-700 to-red-900 border-3 border-red-950 rounded-t-lg shadow-xl relative">
                {/* Door window */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-10 h-16 bg-gradient-to-b from-sky-200 to-sky-300 border-2 border-sky-500 rounded"></div>
                {/* Door handle */}
                <div className="w-2 h-3 bg-yellow-500 rounded-full absolute bottom-12 right-2 shadow-md"></div>
              </div>
              <div className="w-16 h-32 bg-gradient-to-b from-red-700 to-red-900 border-3 border-red-950 rounded-t-lg shadow-xl relative">
                {/* Door window */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-10 h-16 bg-gradient-to-b from-sky-200 to-sky-300 border-2 border-sky-500 rounded"></div>
                {/* Door handle */}
                <div className="w-2 h-3 bg-yellow-500 rounded-full absolute bottom-12 left-2 shadow-md"></div>
              </div>
            </div>

            {/* Entrance overhang */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-8 bg-gradient-to-b from-orange-600 to-orange-700 border-3 border-orange-800 rounded shadow-lg -z-10"></div>
          </div>

          {/* Roof */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[210px] border-r-[210px] border-b-[40px] border-l-transparent border-r-transparent border-b-red-800 drop-shadow-2xl"></div>

          {/* Chimney */}
          <div className="absolute -top-16 left-3/4 w-8 h-16 bg-gradient-to-r from-red-900 to-red-950 border-2 border-red-950 shadow-lg"></div>

          {/* Flag pole */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2">
            <div className="w-2 h-28 bg-gradient-to-b from-gray-600 to-gray-800 shadow-md"></div>
            <div className="absolute top-3 left-2 w-14 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-r shadow-lg animate-flag-wave"></div>
          </div>

          {/* Front steps */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="w-40 h-2 bg-gray-400 border-2 border-gray-500 shadow-md"></div>
            <div className="w-44 h-2 bg-gray-500 border-2 border-gray-600 shadow-md"></div>
            <div className="w-48 h-2 bg-gray-600 border-2 border-gray-700 shadow-md"></div>
          </div>
        </div>
      </div>

      {/* CSS Animation for flag */}
      <style jsx>{`
        @keyframes flag-wave {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.95); }
        }
        .animate-flag-wave {
          animation: flag-wave 2s ease-in-out infinite;
        }
      `}</style>

      {/* Pathway - Curved path leading to viewer */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 800 300" className="w-full h-64" preserveAspectRatio="none">
          {/* Grass on sides */}
          <path d="M0,0 L0,300 L250,300 Q400,200 400,100 L400,0 Z" fill="#7cb342" />
          <path d="M800,0 L800,300 L550,300 Q400,200 400,100 L400,0 Z" fill="#7cb342" />
          {/* Path */}
          <path d="M250,300 Q400,200 400,100 Q400,200 550,300 Z" fill="#d4a574" />
          {/* Path edge lines */}
          <path d="M250,300 Q400,200 400,100" stroke="#a57c52" strokeWidth="3" fill="none" />
          <path d="M550,300 Q400,200 400,100" stroke="#a57c52" strokeWidth="3" fill="none" />
        </svg>
      </div>

      {/* Trees on far left */}
      <div className="absolute bottom-32 left-4 sm:left-8 z-10 hidden sm:block">
        <div className="relative">
          <div className="w-4 sm:w-6 h-20 sm:h-28 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 mx-auto rounded" />
          <div className="absolute -top-10 sm:-top-14 left-1/2 -translate-x-1/2 w-16 sm:w-24 h-16 sm:h-24 bg-green-700 rounded-full" />
          <div className="absolute -top-6 sm:-top-10 left-1/2 -translate-x-1/2 w-12 sm:w-18 h-12 sm:h-18 bg-green-600 rounded-full" />
        </div>
      </div>

      {/* Trees on left */}
      <div className="absolute bottom-28 left-12 sm:left-24 z-10">
        <div className="relative">
          <div className="w-5 sm:w-8 h-16 sm:h-32 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 mx-auto rounded" />
          <div className="absolute -top-10 sm:-top-16 left-1/2 -translate-x-1/2 w-20 sm:w-32 h-20 sm:h-32 bg-green-600 rounded-full" />
          <div className="absolute -top-6 sm:-top-12 left-1/2 -translate-x-1/2 w-16 sm:w-24 h-16 sm:h-24 bg-green-500 rounded-full" />
          <div className="absolute -top-14 sm:-top-20 left-1/2 -translate-x-1/2 w-10 sm:w-16 h-10 sm:h-16 bg-green-700 rounded-full" />
        </div>
      </div>

      {/* Trees on far right */}
      <div className="absolute bottom-32 right-4 sm:right-8 z-10 hidden sm:block">
        <div className="relative">
          <div className="w-4 sm:w-6 h-20 sm:h-28 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 mx-auto rounded" />
          <div className="absolute -top-10 sm:-top-14 left-1/2 -translate-x-1/2 w-16 sm:w-24 h-16 sm:h-24 bg-green-700 rounded-full" />
          <div className="absolute -top-6 sm:-top-10 left-1/2 -translate-x-1/2 w-12 sm:w-18 h-12 sm:h-18 bg-green-600 rounded-full" />
        </div>
      </div>

      {/* Trees on right */}
      <div className="absolute bottom-28 right-12 sm:right-24 z-10">
        <div className="relative">
          <div className="w-5 sm:w-8 h-16 sm:h-32 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 mx-auto rounded" />
          <div className="absolute -top-10 sm:-top-16 left-1/2 -translate-x-1/2 w-20 sm:w-32 h-20 sm:h-32 bg-green-600 rounded-full" />
          <div className="absolute -top-6 sm:-top-12 left-1/2 -translate-x-1/2 w-16 sm:w-24 h-16 sm:h-24 bg-green-500 rounded-full" />
          <div className="absolute -top-14 sm:-top-20 left-1/2 -translate-x-1/2 w-10 sm:w-16 h-10 sm:h-16 bg-green-700 rounded-full" />
        </div>
      </div>

      {/* Bushes on left side */}
      <div className="absolute bottom-20 left-8 sm:left-40 z-10">
        <div className="flex gap-1">
          <div className="w-8 sm:w-12 h-6 sm:h-10 bg-green-500 rounded-full" />
          <div className="w-10 sm:w-16 h-8 sm:h-12 bg-green-600 rounded-full -ml-2" />
          <div className="w-8 sm:w-12 h-6 sm:h-10 bg-green-500 rounded-full -ml-2" />
        </div>
      </div>

      {/* Bushes on right side */}
      <div className="absolute bottom-20 right-8 sm:right-40 z-10">
        <div className="flex gap-1">
          <div className="w-8 sm:w-12 h-6 sm:h-10 bg-green-500 rounded-full" />
          <div className="w-10 sm:w-16 h-8 sm:h-12 bg-green-600 rounded-full -ml-2" />
          <div className="w-8 sm:w-12 h-6 sm:h-10 bg-green-500 rounded-full -ml-2" />
        </div>
      </div>

      {/* Fence on left */}
      <div className="absolute bottom-16 left-2 sm:left-16 z-8 hidden md:flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={`fence-l-${i}`} className="relative">
            <div className="w-3 h-12 bg-gradient-to-b from-amber-600 to-amber-800 rounded-t" />
            <div className="absolute top-2 left-0 right-0 h-1.5 bg-amber-700" />
            <div className="absolute top-6 left-0 right-0 h-1.5 bg-amber-700" />
          </div>
        ))}
      </div>

      {/* Fence on right */}
      <div className="absolute bottom-16 right-2 sm:right-16 z-8 hidden md:flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={`fence-r-${i}`} className="relative">
            <div className="w-3 h-12 bg-gradient-to-b from-amber-600 to-amber-800 rounded-t" />
            <div className="absolute top-2 left-0 right-0 h-1.5 bg-amber-700" />
            <div className="absolute top-6 left-0 right-0 h-1.5 bg-amber-700" />
          </div>
        ))}
      </div>

      {/* Flowers scattered - responsive */}
      <div className="absolute bottom-32 left-20 sm:left-32 text-xl sm:text-2xl animate-sway">🌺</div>
      <div className="absolute bottom-28 right-24 sm:right-40 text-lg sm:text-xl animate-sway" style={{ animationDelay: '0.5s' }}>🌸</div>
      <div className="absolute bottom-36 left-1/4 text-base sm:text-lg animate-sway" style={{ animationDelay: '1s' }}>🌼</div>
      <div className="absolute bottom-24 left-1/3 text-lg sm:text-xl animate-sway hidden sm:block" style={{ animationDelay: '1.5s' }}>🌷</div>
      <div className="absolute bottom-30 right-1/3 text-base sm:text-lg animate-sway hidden sm:block" style={{ animationDelay: '2s' }}>🌻</div>

      {/* Butterflies */}
      <div className="absolute top-1/3 left-1/4 text-xl sm:text-2xl animate-butterfly opacity-70">🦋</div>
      <div className="absolute top-1/2 right-1/4 text-lg sm:text-xl animate-butterfly opacity-60" style={{ animationDelay: '1s' }}>🦋</div>

      {/* Birds */}
      <div className="absolute top-16 left-1/3 text-sm sm:text-base animate-float-slow opacity-80">🐦</div>
      <div className="absolute top-24 right-1/3 text-sm sm:text-base animate-float-slower opacity-70" style={{ animationDelay: '0.5s' }}>🐦</div>

      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(20px) translateY(-8px); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-30px) translateY(-10px); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 15s ease-in-out infinite;
        }
        .animate-sway {
          animation: sway 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

// Character Component
function Character({ gender = "boy" }: { gender?: "boy" | "girl" }) {
  return (
    <div className="relative w-32 h-40 mx-auto">
      <img
        src={gender === "boy" ? "/school_boy.png" : "/school_girl.png"}
        alt={`School ${gender}`}
        className="w-full h-full object-contain animate-character-bounce"
      />
      <style jsx>{`
        @keyframes character-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-character-bounce {
          animation: character-bounce 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

// Word Bubble Component - Simple rounded blue box like Figure 5
function WordBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-br from-sky-300 to-sky-400 rounded-3xl px-8 py-4 shadow-xl border-4 border-sky-500 max-w-md mx-auto mb-8">
      {children}
    </div>
  )
}

// Stone Button Component - Rock-shaped buttons like Figure 5 - Larger
function StoneButton({
  label,
  onClick,
  disabled,
  isCorrect,
  isWrong
}: {
  label: string
  onClick: () => void
  disabled: boolean
  isCorrect: boolean
  isWrong: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative transform transition-all duration-300 ${
        !disabled ? "hover:scale-105 cursor-pointer" : "cursor-not-allowed"
      }`}
    >
      {/* Stone shape background - wider, flatter and LARGER like Figure 5 */}
      <div className={`relative rounded-[40%] px-8 sm:px-12 py-10 sm:py-12 shadow-2xl transition-all ${
        isCorrect
          ? "bg-gradient-to-b from-green-400 to-green-600 scale-110"
          : isWrong
            ? "bg-gradient-to-b from-red-400 to-red-600 opacity-70"
            : "bg-gradient-to-b from-gray-500 via-gray-600 to-gray-700 hover:from-gray-400 hover:via-gray-500 hover:to-gray-600"
      }`}>
        {/* Stone texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/20 rounded-[40%] pointer-events-none" />

        {/* Bottom shadow for 3D effect */}
        <div className="absolute inset-x-2 bottom-0 h-4 bg-black/30 rounded-[40%] blur-md -z-10" />

        {/* Text - Larger */}
        <p className={`relative text-center font-bold text-base sm:text-lg md:text-xl leading-tight ${
          isCorrect || isWrong ? "text-white" : "text-yellow-100"
        }`}>
          {label}
        </p>

        {/* Checkmark or X - Larger */}
        {isCorrect && (
          <div className="absolute -top-3 -right-3 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
            <span className="text-white text-3xl font-bold">✓</span>
          </div>
        )}
        {isWrong && (
          <div className="absolute -top-3 -right-3 w-14 h-14 bg-red-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
            <span className="text-white text-3xl font-bold">✗</span>
          </div>
        )}
      </div>
    </button>
  )
}

interface HopRightGameProps {
  onBack?: () => void
}

export default function HopRightGame({ onBack }: HopRightGameProps) {
  const [currentLevel, setCurrentLevel] = useState<"easy" | "medium" | "hard" | "start" | "selectCharacter" | "selectLevel" | "complete">("start")
  const [currentStage, setCurrentStage] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [completedLevels, setCompletedLevels] = useState({ easy: false, medium: false, hard: false })
  const [showReminder, setShowReminder] = useState(false)
  const [characterGender, setCharacterGender] = useState<"boy" | "girl">("boy")

  const levelKey = currentLevel as "easy" | "medium" | "hard"
  const stages =
    currentLevel === "easy" || currentLevel === "medium" || currentLevel === "hard"
      ? levelData[levelKey]
      : []
  const currentStageData = stages[currentStage]

  // Timer for 1-minute reminder
  useEffect(() => {
    if (currentLevel === "start" || currentLevel === "complete" || !currentStageData || answered) {
      setTimeElapsed(0)
      setShowReminder(false)
      return
    }

    const timer = setInterval(() => {
      setTimeElapsed((prev) => {
        if (prev === 59) {
          // Show reminder at 60 seconds
          setShowReminder(true)
          // Hide after 3 seconds
          setTimeout(() => setShowReminder(false), 3000)
        }
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentLevel, currentStage, answered, currentStageData])

  const handleAnswerClick = (index: number) => {
    if (answered) return

    setAnswered(true)

    if (index === currentStageData.correct) {
      setFeedback("✓ Correct! +1 point")
      setScore(score + 1)
      // Play success sound
      const audio = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_d3d346ba65.mp3")
      audio.play().catch(() => {})
    } else {
      setFeedback(`✗ Wrong! You must repeat this stage. Correct answer: "${currentStageData.options[currentStageData.correct]}"`)
      // Play wrong sound
      const wrongAudio = new Audio("https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3")
      wrongAudio.volume = 0.3
      wrongAudio.play().catch(() => {})
    }
  }

  const handleNext = () => {
    // Check if answer was correct
    const wasCorrect = feedback.includes("Correct")

    if (wasCorrect) {
      // Move to next stage
      if (currentStage < stages.length - 1) {
        setCurrentStage(currentStage + 1)
        setFeedback("")
        setAnswered(false)
        setTimeElapsed(0)
      } else {
        // Level complete
        setCompletedLevels({ ...completedLevels, [levelKey]: true })
        setCurrentLevel("complete")
      }
    } else {
      // Repeat the same stage
      setFeedback("")
      setAnswered(false)
      setTimeElapsed(0)
    }
  }

  const handleStartLevel = (level: "easy" | "medium" | "hard") => {
    // Check if level is locked
    if (level === "medium" && !completedLevels.easy) {
      alert("Please complete Easy level first!")
      return
    }
    if (level === "hard" && !completedLevels.medium) {
      alert("Please complete Medium level first!")
      return
    }

    setCurrentLevel(level)
    setCurrentStage(0)
    setScore(0)
    setFeedback("")
    setAnswered(false)
    setTimeElapsed(0)
  }

  const handlePlayAgain = () => {
    setCurrentLevel("start")
    setCurrentStage(0)
    setScore(0)
    setFeedback("")
    setAnswered(false)
    setTimeElapsed(0)
  }

  const handleBackToStart = () => {
    // Always go back to start screen when in game
    setCurrentLevel("start")
    setCurrentStage(0)
    setScore(0)
    setFeedback("")
    setAnswered(false)
    setTimeElapsed(0)
  }

  if (currentLevel === "start") {
    return (
      <HighSchoolBackground>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
          {/* Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="absolute top-4 left-4 z-30 bg-gray-700/80 hover:bg-gray-800 text-white font-bold px-4 py-2 rounded-full shadow-lg transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              <span>←</span> <span className="hidden sm:inline">Back</span>
            </button>
          )}

          {/* Title Banner - Styled like Figure 4 */}
          <div className="relative mb-8 animate-fade-in">
            {/* Banner background with arrow ends */}
            <div className="relative bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 px-12 py-4 shadow-2xl">
              {/* Left arrow */}
              <div className="absolute left-0 top-0 bottom-0 w-0 h-0 border-t-[30px] border-t-transparent border-b-[30px] border-b-transparent border-l-[20px] border-l-green-700 -translate-x-full"></div>
              {/* Right arrow */}
              <div className="absolute right-0 top-0 bottom-0 w-0 h-0 border-t-[30px] border-t-transparent border-b-[30px] border-b-transparent border-r-[20px] border-r-green-700 translate-x-full"></div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white text-center drop-shadow-lg tracking-wider" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.4)' }}>
                HOPRIGHT: COLLOCATION EDITION
              </h1>
            </div>
          </div>

          {/* Instructions Sign - Large centered box like Figure 4 */}
          <div className="bg-gradient-to-br from-sky-200 via-blue-100 to-sky-200 rounded-3xl p-8 sm:p-10 shadow-2xl mb-8 max-w-3xl border-8 border-blue-400 animate-slide-up">
            <div className="space-y-4 text-gray-800">
              <p className="text-base sm:text-lg leading-relaxed">
                <span className="font-bold">1.</span> A target word or sentence will appear above your character — one at a time and in random order.
              </p>
              <p className="text-base sm:text-lg leading-relaxed">
                <span className="font-bold">2.</span> Choose the correct collocation pair from three options below.
              </p>
              <p className="text-base sm:text-lg leading-relaxed">
                <span className="font-bold">3.</span> Correct answers earn +1 point. Wrong answers get 0 points and require you to repeat the stage.
              </p>
              <p className="text-base sm:text-lg leading-relaxed">
                <span className="font-bold">4.</span> There is no timer, but if you stay on a stage for more than 1 minute, you will hear a reminder: "You can do it. Help me hop right!"
              </p>
              <p className="text-base sm:text-lg leading-relaxed">
                <span className="font-bold">5.</span> The game consists of three levels: Easy, Medium, and Hard, each with ten (10) stages. All stages within a level must be completed to unlock and proceed to the next level.
              </p>
            </div>
          </div>

          {/* START GAME Button - Styled like Figure 4 */}
          <button
            onClick={() => setCurrentLevel("selectCharacter")}
            className="bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400 hover:from-cyan-500 hover:via-teal-500 hover:to-cyan-500 text-white font-black text-2xl sm:text-3xl py-4 px-12 rounded-2xl shadow-2xl transition-all transform hover:scale-105 active:scale-95 border-4 border-teal-600 animate-pulse-slow"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
          >
            START GAME
          </button>

          {/* Squirrel mascot (optional - can be replaced with an image) */}
          <div className="absolute bottom-8 left-8 text-6xl opacity-80 animate-bounce-slow hidden sm:block">
            🐿️
          </div>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(-30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse-slow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.85; }
          }
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          .animate-fade-in {
            animation: fade-in 1s ease-out;
          }
          .animate-slide-up {
            animation: slide-up 1s ease-out;
          }
          .animate-pulse-slow {
            animation: pulse-slow 2s ease-in-out infinite;
          }
          .animate-bounce-slow {
            animation: bounce-slow 3s ease-in-out infinite;
          }
        `}</style>
      </HighSchoolBackground>
    )
  }

  if (currentLevel === "selectCharacter") {
    return (
      <HighSchoolBackground>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
          {/* Back Button */}
          <button
            onClick={() => setCurrentLevel("start")}
            className="absolute top-4 left-4 z-30 bg-gray-700/80 hover:bg-gray-800 text-white font-bold px-4 py-2 rounded-full shadow-lg transition-all flex items-center gap-2 backdrop-blur-sm"
          >
            <span>←</span> <span className="hidden sm:inline">Back</span>
          </button>

          {/* Character Selection */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-lg border-4 border-purple-300 animate-slide-up">
            <h3 className="text-3xl font-bold mb-6 text-center text-purple-800">Choose Your Character</h3>
            <div className="flex justify-center gap-8">
              <button
                onClick={() => {
                  setCharacterGender("boy")
                  setCurrentLevel("selectLevel")
                }}
                className="p-6 rounded-lg transition bg-gray-100 border-4 border-gray-300 hover:scale-110 hover:border-blue-500 hover:bg-blue-50"
              >
                <div className="w-32 h-40">
                  <img src="/school_boy.png" alt="School Boy" className="w-full h-full object-contain" />
                </div>
                <p className="text-center mt-4 font-bold text-xl">Boy</p>
              </button>
              <button
                onClick={() => {
                  setCharacterGender("girl")
                  setCurrentLevel("selectLevel")
                }}
                className="p-6 rounded-lg transition bg-gray-100 border-4 border-gray-300 hover:scale-110 hover:border-pink-500 hover:bg-pink-50"
              >
                <div className="w-32 h-40">
                  <img src="/school_girl.png" alt="School Girl" className="w-full h-full object-contain" />
                </div>
                <p className="text-center mt-4 font-bold text-xl">Girl</p>
              </button>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-up {
            animation: slide-up 0.5s ease-out;
          }
        `}</style>
      </HighSchoolBackground>
    )
  }

  if (currentLevel === "selectLevel") {
    return (
      <HighSchoolBackground>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
          {/* Back Button */}
          <button
            onClick={() => setCurrentLevel("selectCharacter")}
            className="absolute top-4 left-4 z-30 bg-gray-700/80 hover:bg-gray-800 text-white font-bold px-4 py-2 rounded-full shadow-lg transition-all flex items-center gap-2 backdrop-blur-sm"
          >
            <span>←</span> <span className="hidden sm:inline">Back</span>
          </button>

          {/* Level Selection */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md border-4 border-green-300 animate-slide-up">
            <h2 className="text-3xl font-bold mb-6 text-center text-green-800">Select Your Level</h2>
            <div className="space-y-4">
              <button
                onClick={() => handleStartLevel("easy")}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition text-lg shadow-lg flex items-center justify-between transform hover:scale-105"
              >
                <span>🟢 Easy Level</span>
                {completedLevels.easy && <span className="text-yellow-300">✓ Completed</span>}
              </button>
              <button
                onClick={() => handleStartLevel("medium")}
                disabled={!completedLevels.easy}
                className={`w-full font-bold py-4 px-6 rounded-xl transition text-lg shadow-lg flex items-center justify-between transform hover:scale-105 ${
                  completedLevels.easy
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <span>🟡 Medium Level</span>
                {!completedLevels.easy && <span className="text-sm">🔒 Locked</span>}
                {completedLevels.medium && <span className="text-yellow-300">✓ Completed</span>}
              </button>
              <button
                onClick={() => handleStartLevel("hard")}
                disabled={!completedLevels.medium}
                className={`w-full font-bold py-4 px-6 rounded-xl transition text-lg shadow-lg flex items-center justify-between transform hover:scale-105 ${
                  completedLevels.medium
                    ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <span>🔴 Hard Level</span>
                {!completedLevels.medium && <span className="text-sm">🔒 Locked</span>}
                {completedLevels.hard && <span className="text-yellow-300">✓ Completed</span>}
              </button>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-up {
            animation: slide-up 0.5s ease-out;
          }
        `}</style>
      </HighSchoolBackground>
    )
  }

  if (currentLevel === "complete") {
    return (
      <HighSchoolBackground>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md border-4 border-yellow-400">
            <h2 className="text-4xl font-bold mb-4 text-green-700">Level Complete! 🎉</h2>
            <div className="text-8xl mb-6">🏆</div>
            <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl p-6 mb-6 border-2 border-yellow-400">
              <p className="text-sm text-gray-600 mb-2">Your Score</p>
              <p className="text-6xl font-bold text-green-600">{score}/10</p>
            </div>
            <p className="text-xl text-gray-700 mb-8 font-semibold">Great hopping! Keep learning!</p>
            <div className="space-y-3">
              <button
                onClick={handlePlayAgain}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition text-lg shadow-lg"
              >
                Select Another Level
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-xl transition text-lg shadow-lg"
                >
                  Back to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </HighSchoolBackground>
    )
  }

  if (!currentStageData) return null

  return (
    <HighSchoolBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        {/* Back Button */}
        <button
          onClick={handleBackToStart}
          className="absolute top-4 left-4 z-30 bg-gray-700/80 hover:bg-gray-800 text-white font-bold px-4 py-2 rounded-full shadow-lg transition-all flex items-center gap-2 backdrop-blur-sm"
        >
          <span>←</span> <span className="hidden sm:inline">Back</span>
        </button>

        {/* Header Stats - Larger */}
        <div className="flex gap-4 sm:gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 sm:px-8 py-3 sm:py-4 shadow-xl border-3 border-blue-400">
            <span className="font-bold text-blue-800 text-lg sm:text-xl">📊 Level: {currentLevel.toUpperCase()}</span>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 sm:px-8 py-3 sm:py-4 shadow-xl border-3 border-purple-400">
            <span className="font-bold text-purple-800 text-lg sm:text-xl">🎯 Stage: {currentStage + 1}/10</span>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 sm:px-8 py-3 sm:py-4 shadow-xl border-3 border-green-400">
            <span className="font-bold text-green-800 text-lg sm:text-xl">⭐ Score: {score}</span>
          </div>
        </div>

        {/* 1-Minute Reminder */}
        {showReminder && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-8 py-4 rounded-full shadow-xl border-4 border-yellow-500 font-bold text-xl animate-bounce z-40">
            💪 You can do it. Help me hop right!
          </div>
        )}

        {/* Game Area - Larger to fill space */}
        <div className="max-w-5xl w-full">
          {/* Word Bubble with Target Word/Sentence - Figure 5 Design - Larger */}
          <div className="mb-8">
            <WordBubble>
              {currentStageData.targetWord ? (
                <div className="text-center py-4">
                  <p className="text-5xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-lg">{currentStageData.targetWord}</p>
                </div>
              ) : (
                <div className="text-center py-3">
                  <p className="text-xl sm:text-2xl md:text-3xl text-white font-semibold leading-relaxed">{currentStageData.sentence}</p>
                </div>
              )}
            </WordBubble>
          </div>

          {/* Character - Much Larger */}
          <div className="transform scale-150 sm:scale-175 my-12">
            <Character gender={characterGender} />
          </div>

          {/* Stone Button Options - Figure 5 Design - One row - Larger */}
          <div className="flex justify-center gap-4 sm:gap-8 mt-12">
            {currentStageData.options.map((option, index) => (
              <StoneButton
                key={index}
                label={option}
                onClick={() => handleAnswerClick(index)}
                disabled={answered}
                isCorrect={answered && index === currentStageData.correct}
                isWrong={answered && index !== currentStageData.correct}
              />
            ))}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`text-center mt-6 p-4 rounded-xl font-bold text-lg shadow-lg border-4 ${
              feedback.includes("Correct")
                ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-400"
                : "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-400"
            }`}>
              {feedback}
            </div>
          )}

          {/* Next/Repeat Button */}
          {answered && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleNext}
                className={`font-bold py-3 px-8 rounded-xl transition-all text-lg shadow-lg transform hover:scale-105 ${
                  feedback.includes("Correct")
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                }`}
              >
                {feedback.includes("Correct")
                  ? currentStage < stages.length - 1
                    ? "Next Stage →"
                    : "Complete Level →"
                  : "Try Again 🔄"}
              </button>
            </div>
          )}
        </div>
      </div>
    </HighSchoolBackground>
  )
}
