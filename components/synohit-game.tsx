"use client"

import { useState, useEffect } from "react"
import React from "react"
import { saveLevelProgress, getLevelStatus, getStarRating, MIN_SCORE_TO_PASS } from "@/lib/game-progress"
import { toast } from "sonner"

interface Question {
  target: string
  sentence?: string
  underlinedWord?: string
  options: string[]
  correct: number
}

const levelData = {
  level1: [
    { target: "Diligent", options: ["Hard-working", "Idle", "Indolent"], correct: 0 },
    { target: "Sinister", options: ["Evil", "Strange", "Mysterious"], correct: 0 },
    { target: "Weary", options: ["Exhausted", "Bored", "Sleepy"], correct: 0 },
    { target: "Colossal", options: ["Massive", "Wide", "Ancient"], correct: 0 },
    { target: "Deceit", options: ["Deception", "Misunderstanding", "Illusion"], correct: 0 },
    { target: "Captivate", options: ["Attract", "Capture", "Bore"], correct: 0 },
    { target: "Awful", options: ["Terrible", "Unusual", "Weak"], correct: 0 },
    { target: "Beneficial", options: ["Favorable", "Unimportant", "Detrimental"], correct: 0 },
    { target: "Contrary", options: ["Opposite", "Other", "Conflicting"], correct: 0 },
    { target: "Infamous", options: ["Notorious", "Not Famous", "Unpopular"], correct: 0 },
  ],
  level2: [
    { target: "Gullible", options: ["Naive", "Suspicious", "Doubtful", "Careful"], correct: 0 },
    { target: "Jaunt", options: ["Trip", "Errand", "Wander", "Stay"], correct: 0 },
    { target: "Meticulous", options: ["Careful", "Neat", "Perfect", "Sloppy"], correct: 0 },
    { target: "Perpetual", options: ["Lasting", "Frequent", "Recurring", "Temporary"], correct: 0 },
    { target: "Bigotry", options: ["Injustice", "Hostility", "Disagreement", "Tolerance"], correct: 0 },
    { target: "Covet", options: ["Desire", "Keep", "Secret", "Hold"], correct: 0 },
    { target: "Detrimental", options: ["Harmful", "Important", "Crucial", "Unimportant"], correct: 0 },
    { target: "Efficacy", options: ["Effectiveness", "Inability", "Reliability", "Accuracy"], correct: 0 },
    { target: "Enormity", options: ["Badness", "Hugeness", "Goodness", "Intensity"], correct: 0 },
    { target: "Impounded", options: ["Confiscated", "Crushed", "Destroyed", "Injured"], correct: 0 },
  ],
  level3: [
    {
      sentence: "The bright light engulfed him.",
      underlinedWord: "engulfed",
      options: ["covered", "blocked", "blinded"],
      correct: 0,
    },
    {
      sentence: "By lying, she was jeopardizing her friend's trust.",
      underlinedWord: "jeopardizing",
      options: ["risking", "threatening", "ignoring"],
      correct: 0,
    },
    {
      sentence: "Zen has a knack for solving puzzles quickly.",
      underlinedWord: "knack",
      options: ["skill", "hobby", "interest"],
      correct: 0,
    },
    {
      sentence: "She perceives Switzerland to be the most beautiful country ever.",
      underlinedWord: "perceives",
      options: ["considers", "prefers", "disregards"],
      correct: 0,
    },
    {
      sentence: "The hikers were amazed by the pristine beauty of the mountain.",
      underlinedWord: "pristine",
      options: ["immaculate", "incredible", "awesome"],
      correct: 0,
    },
    {
      sentence: "His deference to her wishes was very flattering.",
      underlinedWord: "deference",
      options: ["compliance", "ignorance", "defiance"],
      correct: 0,
    },
    {
      sentence: "Ysaac's mother espouses the idea that vaping should be banned in the Philippines.",
      underlinedWord: "espouses",
      options: ["supports", "opposes", "appreciates"],
      correct: 0,
    },
    {
      sentence: "The police impounded cars and other personal property belonging to the drug dealers.",
      underlinedWord: "impounded",
      options: ["confiscated", "destroyed", "crushed"],
      correct: 0,
    },
    {
      sentence: "Many hours of meticulous preparation have gone into writing the book.",
      underlinedWord: "meticulous",
      options: ["careful", "great", "careless"],
      correct: 0,
    },
    {
      sentence: "Just be a little careful, and you are perfectly out of peril.",
      underlinedWord: "peril",
      options: ["danger", "safety", "challenge"],
      correct: 0,
    },
  ],
}

// Tropical Background Component with Enhanced Visuals
function TropicalBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Sky with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-amber-100" />

      {/* Sun with glow effect */}
      <div className="absolute top-8 right-16 w-24 h-24">
        <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl opacity-60 animate-pulse" />
        <div className="absolute inset-2 bg-yellow-200 rounded-full shadow-2xl" />
      </div>

      {/* Animated clouds */}
      <div className="absolute top-12 left-20 w-40 h-14 opacity-90 animate-float-slow">
        <div className="absolute top-0 left-0 w-20 h-12 bg-white rounded-full" />
        <div className="absolute top-2 left-12 w-28 h-10 bg-white rounded-full" />
        <div className="absolute top-4 left-8 w-16 h-8 bg-white rounded-full" />
      </div>
      <div className="absolute top-20 right-32 w-36 h-12 opacity-80 animate-float-slower">
        <div className="absolute top-0 right-0 w-18 h-10 bg-white rounded-full" />
        <div className="absolute top-2 right-10 w-24 h-8 bg-white rounded-full" />
      </div>
      <div className="absolute top-32 left-1/3 w-32 h-12 opacity-75 animate-float-slow">
        <div className="absolute top-0 left-0 w-16 h-10 bg-white rounded-full" />
        <div className="absolute top-2 left-10 w-20 h-8 bg-white rounded-full" />
      </div>

      {/* Flying birds */}
      <div className="absolute top-24 right-1/4 text-2xl animate-fly-bird opacity-70" style={{ animationDelay: '0s' }}>
        🐦
      </div>
      <div className="absolute top-28 right-1/3 text-xl animate-fly-bird opacity-60" style={{ animationDelay: '0.5s' }}>
        🐦
      </div>
      <div className="absolute top-20 left-1/4 text-lg animate-fly-bird-reverse opacity-50" style={{ animationDelay: '1s' }}>
        🐦
      </div>

      {/* Distant mountains */}
      <div className="absolute bottom-40 left-0 right-0 opacity-40">
        <svg viewBox="0 0 1200 150" className="w-full h-24">
          <path d="M0,150 L0,90 Q200,40 400,70 Q600,100 800,50 Q1000,20 1200,80 L1200,150 Z" fill="#4a7c4e" />
        </svg>
      </div>

      {/* Rice terraces with curved lines */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* Terrace layers */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-amber-700 via-green-700 to-green-500" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-amber-800 via-green-600 to-transparent opacity-70" />

        {/* Terrace lines */}
        <div className="absolute bottom-44 left-0 right-0 h-0.5 bg-green-900 opacity-30" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
        <div className="absolute bottom-36 left-0 right-0 h-0.5 bg-green-900 opacity-40" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
        <div className="absolute bottom-28 left-0 right-0 h-0.5 bg-green-900 opacity-50" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
        <div className="absolute bottom-20 left-0 right-0 h-0.5 bg-amber-900 opacity-40" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
      </div>

      {/* Traditional hut on the left with details */}
      <div className="absolute bottom-32 left-8 md:left-16 z-10 transform hover:scale-105 transition-transform duration-300">
        <div className="relative">
          {/* Roof with texture */}
          <div className="relative">
            <div className="w-0 h-0 border-l-[35px] border-r-[35px] border-b-[30px] border-l-transparent border-r-transparent border-b-amber-900" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-6 opacity-60">
              <div className="w-full h-0.5 bg-amber-950 mb-1" />
              <div className="w-full h-0.5 bg-amber-950 mb-1" />
              <div className="w-full h-0.5 bg-amber-950" />
            </div>
          </div>
          {/* House body */}
          <div className="w-16 h-12 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 -mt-1 ml-[2px] shadow-lg" />
          {/* Window */}
          <div className="absolute bottom-5 left-5 w-4 h-4 bg-amber-950 border border-amber-900" />
          {/* Door */}
          <div className="absolute bottom-0 right-2 w-3 h-6 bg-amber-950 rounded-t" />
          {/* Flowers nearby */}
          <div className="absolute -bottom-2 -left-3 text-sm">🌺</div>
          <div className="absolute -bottom-1 left-16 text-xs">🌺</div>
        </div>
      </div>

      {/* Traditional hut on the right */}
      <div className="absolute bottom-36 right-8 md:right-16 z-10 transform hover:scale-105 transition-transform duration-300">
        <div className="relative">
          {/* Roof */}
          <div className="relative">
            <div className="w-0 h-0 border-l-[40px] border-r-[40px] border-b-[35px] border-l-transparent border-r-transparent border-b-amber-900" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-7 opacity-60">
              <div className="w-full h-0.5 bg-amber-950 mb-1" />
              <div className="w-full h-0.5 bg-amber-950 mb-1" />
              <div className="w-full h-0.5 bg-amber-950" />
            </div>
          </div>
          {/* House body */}
          <div className="w-18 h-14 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 -mt-1 ml-[2px] shadow-lg" />
          {/* Window */}
          <div className="absolute bottom-6 left-6 w-4 h-4 bg-amber-950 border border-amber-900" />
          {/* Flowers */}
          <div className="absolute -bottom-2 -right-2 text-sm">🌸</div>
          <div className="absolute -bottom-1 -left-3 text-xs">🌺</div>
        </div>
      </div>

      {/* Palm tree left with shadow */}
      <div className="absolute bottom-32 left-20 md:left-32 z-10">
        <div className="relative">
          {/* Shadow */}
          <div className="absolute -bottom-1 left-0 w-16 h-2 bg-black opacity-20 blur-sm rounded-full" />
          {/* Trunk */}
          <div className="w-4 h-24 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 rounded-sm shadow-md" />
          {/* Fronds */}
          <div className="absolute -top-6 -left-8 text-5xl filter drop-shadow-lg transform hover:scale-110 transition-transform">
            🌴
          </div>
        </div>
      </div>

      {/* Palm tree right */}
      <div className="absolute bottom-36 right-24 md:right-40 z-10">
        <div className="relative">
          {/* Shadow */}
          <div className="absolute -bottom-1 left-0 w-16 h-2 bg-black opacity-20 blur-sm rounded-full" />
          {/* Trunk */}
          <div className="w-4 h-28 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 rounded-sm shadow-md" />
          {/* Fronds */}
          <div className="absolute -top-6 -left-8 text-5xl filter drop-shadow-lg transform hover:scale-110 transition-transform">
            🌴
          </div>
        </div>
      </div>

      {/* Animated butterflies with floating effect */}
      <div className="absolute top-1/4 right-1/4 text-2xl animate-butterfly" style={{ animationDelay: '0s' }}>
        🦋
      </div>
      <div className="absolute top-1/3 left-1/3 text-xl animate-butterfly" style={{ animationDelay: '1s' }}>
        🦋
      </div>
      <div className="absolute top-2/5 right-1/3 text-lg animate-butterfly" style={{ animationDelay: '2s' }}>
        🦋
      </div>

      {/* Fireflies/sparkles */}
      <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-yellow-200 rounded-full animate-twinkle" style={{ animationDelay: '0s' }} />
      <div className="absolute top-1/3 right-1/5 w-1 h-1 bg-yellow-200 rounded-full animate-twinkle" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-2/3 left-1/2 w-1 h-1 bg-yellow-200 rounded-full animate-twinkle" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(30px) translateY(-10px); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-40px) translateY(-15px); }
        }
        @keyframes fly-bird {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(100vw) translateY(-50px); }
        }
        @keyframes fly-bird-reverse {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(-100vw) translateY(-30px); }
        }
        @keyframes butterfly {
          0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
          25% { transform: translateX(20px) translateY(-15px) rotate(5deg); }
          50% { transform: translateX(0) translateY(-25px) rotate(-5deg); }
          75% { transform: translateX(-20px) translateY(-15px) rotate(5deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        .animate-float-slow {
          animation: float-slow 15s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 20s ease-in-out infinite;
        }
        .animate-fly-bird {
          animation: fly-bird 25s linear infinite;
        }
        .animate-fly-bird-reverse {
          animation: fly-bird-reverse 30s linear infinite;
        }
        .animate-butterfly {
          animation: butterfly 6s ease-in-out infinite;
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

// Enhanced Wooden Sign Component with Realistic Wood Texture
function WoodenSign({ children, size = "large" }: { children: React.ReactNode; size?: "large" | "medium" }) {
  const sizeClasses = size === "large"
    ? "px-4 sm:px-6 md:px-8 py-3 sm:py-4 min-w-[150px] sm:min-w-[180px] md:min-w-[200px]"
    : "px-4 sm:px-6 py-2 sm:py-3 min-w-[120px] sm:min-w-[150px]"

  return (
    <div className="flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
      {/* Rope/Chain with more detail */}
      <div className="flex justify-center gap-16 sm:gap-20 md:gap-24 -mb-2">
        <div className="relative">
          <div className="w-1.5 h-4 sm:h-6 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 rounded shadow-md" />
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 border-2 border-amber-900 bg-gray-600 rounded-full" />
        </div>
        <div className="relative">
          <div className="w-1.5 h-4 sm:h-6 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 rounded shadow-md" />
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 border-2 border-amber-900 bg-gray-600 rounded-full" />
        </div>
      </div>
      {/* Sign board with enhanced wood texture */}
      <div className={`relative ${sizeClasses} bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 rounded-lg shadow-2xl border-2 sm:border-4 border-amber-950`}>
        {/* Wood grain effect - enhanced */}
        <div className="absolute inset-0 opacity-30">
          <div className="h-0.5 sm:h-1 bg-amber-950 mt-1.5 sm:mt-2 mx-2 rounded" />
          <div className="h-0.5 sm:h-1 bg-amber-900 mt-2 sm:mt-3 mx-4 rounded" />
          <div className="h-0.5 sm:h-1 bg-amber-950 mt-2 sm:mt-3 mx-2 rounded" />
          <div className="h-0.5 sm:h-1 bg-amber-900 mt-1.5 sm:mt-2 mx-5 rounded" />
        </div>
        {/* Content */}
        <div className="relative text-center z-10">
          {children}
        </div>
        {/* Nails with shine */}
        <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 rounded-full shadow-md" />
        <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 rounded-full shadow-md" />
        <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 rounded-full shadow-md" />
        <div className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 rounded-full shadow-md" />
      </div>
      {/* Wooden posts with shadow */}
      <div className="flex justify-center gap-20 sm:gap-24 md:gap-28 -mt-1">
        <div className="relative">
          <div className="w-3 sm:w-4 h-10 sm:h-12 md:h-16 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 rounded-b shadow-lg" />
          <div className="absolute -bottom-1 left-0 w-4 h-2 bg-black opacity-20 blur-sm rounded-full" />
        </div>
        <div className="relative">
          <div className="w-3 sm:w-4 h-10 sm:h-12 md:h-16 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 rounded-b shadow-lg" />
          <div className="absolute -bottom-1 left-0 w-4 h-2 bg-black opacity-20 blur-sm rounded-full" />
        </div>
      </div>
    </div>
  )
}

// Enhanced Trash Can Component - Entire can is the trash image
function PaintCan({
  color,
  label,
  onClick,
  disabled,
  isCorrect,
  isWrong,
  answered,
  index
}: {
  color: string
  label: string
  onClick: () => void
  disabled: boolean
  isCorrect: boolean
  isWrong: boolean
  answered: boolean
  index: number
}) {
  const [isClicking, setIsClicking] = React.useState(false)

  const handleClick = () => {
    if (!disabled) {
      setIsClicking(true)
      setTimeout(() => setIsClicking(false), 300)
      onClick()
    }
  }

  // Determine which trash image to show
  const getTrashImage = () => {
    if (!answered) {
      return "/neutral.png"
    } else if (isCorrect) {
      return "/happy_trash.png"
    } else {
      // Show sad for all wrong answers (whether clicked or not)
      return "/sad_trash.png"
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        group flex flex-col items-center gap-2 transition-all duration-300 ease-out
        animate-can-entrance
        ${!disabled && !answered ? "animate-can-float" : ""}
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        ${isCorrect ? "animate-success-pulse" : ""}
        ${isWrong && answered ? "animate-shake" : ""}
        ${answered && !isCorrect ? "opacity-70" : ""}
        ${isClicking ? "animate-can-click" : ""}
      `}
      style={{
        animationDelay: `${index * 0.1}s`
      }}
    >
      {/* Trash Can Image */}
      <div className={`
        relative w-32 h-36 xs:w-36 xs:h-40 sm:w-28 sm:h-32 md:w-32 md:h-36 lg:w-36 lg:h-40
        transition-all duration-500
        ${!disabled && !answered ? "group-hover:scale-110 group-hover:-translate-y-3 group-hover:rotate-2" : ""}
        ${isCorrect ? "scale-110 -translate-y-3 animate-face-happy" : ""}
        ${isWrong && answered ? "animate-face-sad" : ""}
      `}
      style={{
        filter: isCorrect
          ? 'drop-shadow(0 10px 25px rgba(250,204,21,0.6)) drop-shadow(0 0 30px rgba(250,204,21,0.4))'
          : 'drop-shadow(0 8px 20px rgba(0,0,0,0.3))'
      }}>
        <img
          src={getTrashImage()}
          alt={!answered ? "neutral" : isCorrect ? "happy" : isWrong ? "sad" : "neutral"}
          className={`
            w-full h-full object-contain
            transition-all duration-500
            ${!answered ? "animate-face-neutral" : ""}
          `}
        />

        {/* Click ripple effect */}
        {isClicking && (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-white rounded-lg animate-ripple opacity-0" />
          </div>
        )}

        {/* Idle sparkles */}
        {!answered && !disabled && (
          <>
            <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-yellow-200 rounded-full opacity-70 animate-sparkle-1" />
            <div className="absolute top-4 right-3 w-1 h-1 bg-yellow-200 rounded-full opacity-60 animate-sparkle-2" />
            <div className="absolute bottom-6 left-4 w-1 h-1 bg-yellow-200 rounded-full opacity-50 animate-sparkle-3" />
          </>
        )}

        {/* Correct checkmark badge */}
        {isCorrect && (
          <div className="absolute -top-2 -right-2 w-10 h-10 xs:w-12 xs:h-12 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xl xs:text-2xl sm:text-2xl md:text-3xl shadow-lg animate-bounce-in border-3 border-white">
            ✓
          </div>
        )}

        {/* Wrong X badge */}
        {isWrong && answered && (
          <div className="absolute -top-2 -right-2 w-10 h-10 xs:w-12 xs:h-12 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white text-xl xs:text-2xl sm:text-2xl md:text-3xl shadow-lg animate-shake border-3 border-white">
            ✗
          </div>
        )}
      </div>

      {/* Label below the trash can */}
      <div className={`
        bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50
        rounded-lg px-2 py-1.5 xs:px-3 xs:py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3
        border-2 border-amber-300 shadow-md
        transition-all duration-300
        ${!disabled && !answered ? "group-hover:border-amber-400 group-hover:shadow-lg group-hover:scale-105" : ""}
        ${isCorrect ? "border-green-400 bg-green-50" : ""}
        ${isWrong && answered ? "border-red-300 bg-red-50" : ""}
      `}>
        <span className={`
          text-amber-900 font-bold text-[9px] xs:text-[10px] sm:text-sm md:text-base
          text-center block whitespace-nowrap
          ${isCorrect ? "text-green-700" : ""}
          ${isWrong && answered ? "text-red-700" : ""}
        `}>
          {label}
        </span>
      </div>

      {/* Hover instruction text */}
      {!disabled && !answered && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs sm:text-sm text-amber-800 font-semibold hidden sm:block">
          Click me!
        </div>
      )}
    </button>
  )
}

// Sentence Display Component for Level 3 with Enhanced Styling
function SentenceDisplay({ sentence, underlinedWord }: { sentence: string; underlinedWord: string }) {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-4 border-amber-800 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl max-w-[95%] sm:max-w-2xl mx-auto transform hover:scale-102 transition-transform duration-300">
      <p className="text-sm sm:text-base md:text-lg text-amber-900 leading-relaxed text-center font-medium">
        {sentence.split(" ").map((word, idx) => {
          const cleanWord = word.replace(/[.,!?]/g, "")
          const punctuation = word.match(/[.,!?]/g)?.[0] || ""
          const isUnderlined = cleanWord.toLowerCase() === underlinedWord.toLowerCase()
          return (
            <span key={idx}>
              <span className={isUnderlined ? "underline decoration-2 decoration-orange-600 font-bold text-orange-700 bg-yellow-200 px-1 sm:px-2 py-0.5 rounded shadow-sm" : ""}>
                {cleanWord}
              </span>
              {punctuation}{" "}
            </span>
          )
        })}
      </p>
    </div>
  )
}

interface SynohitGameProps {
  onBack?: () => void
}

export default function SynohitGame({ onBack }: SynohitGameProps) {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState<"start" | "levelSelect" | "playing" | "levelComplete" | "gameComplete">("start")
  const [feedback, setFeedback] = useState<string>("")
  const [answered, setAnswered] = useState(false)
  const [levelScores, setLevelScores] = useState({ 1: 0, 2: 0, 3: 0 })
  const [showConfetti, setShowConfetti] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([])
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([])
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0)
  const [levelStatuses, setLevelStatuses] = useState<Record<number, "locked" | "unlocked" | "completed">>({
    1: "unlocked",
    2: "locked",
    3: "locked"
  })
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('synohit-muted')
      return saved === 'true'
    }
    return false
  })

  const toggleMute = () => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    if (typeof window !== 'undefined') {
      localStorage.setItem('synohit-muted', String(newMuted))
    }
  }

  // Load level statuses when entering level select
  useEffect(() => {
    if (gameState === "levelSelect") {
      const loadStatuses = async () => {
        const status1 = await getLevelStatus("synohit", 1)
        const status2 = await getLevelStatus("synohit", 2)
        const status3 = await getLevelStatus("synohit", 3)
        setLevelStatuses({
          1: status1,
          2: status2,
          3: status3
        })
      }
      loadStatuses()
    }
  }, [gameState])

  // Shuffle function using Fisher-Yates algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Get questions for current level
  const getLevelQuestions = (level: number): Question[] => {
    const levelQuestions = (
      {
        1: levelData.level1,
        2: levelData.level2,
        3: levelData.level3,
      } as const
    )[level] as Question[]
    return shuffleArray(levelQuestions)
  }

  // Shuffle options for current question
  const shuffleQuestionOptions = (question: Question) => {
    const correctAnswer = question.options[question.correct]
    const shuffled = shuffleArray(question.options)
    const newCorrectIndex = shuffled.indexOf(correctAnswer)
    setShuffledOptions(shuffled)
    setCorrectAnswerIndex(newCorrectIndex)
  }

  const question = shuffledQuestions[currentQuestion]

  const handleStartGame = () => {
    setGameState("levelSelect")
  }

  const handleLevelSelect = async (level: number) => {
    const levelStatus = await getLevelStatus("synohit", level)

    // Check if level is unlocked
    if (levelStatus === "locked") {
      toast.error(`Level ${level} is locked! You need to score at least ${MIN_SCORE_TO_PASS * 10} pts in Level ${level - 1} to unlock it.`)
      return
    }

    setGameState("playing")
    setCurrentLevel(level)
    setCurrentQuestion(0)
    setScore(0)
    setAnswered(false)
    setSelectedAnswer(null)
    setFeedback("")
    const questions = getLevelQuestions(level)
    setShuffledQuestions(questions)
    if (questions[0]) {
      shuffleQuestionOptions(questions[0])
    }
  }

  const handleAnswerClick = (index: number) => {
    if (answered) return

    setAnswered(true)
    setSelectedAnswer(index)

    if (index === correctAnswerIndex) {
      setFeedback("Correct!")
      setScore(score + 1)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
      // Play success sound
      if (!isMuted) {
        const audio = new Audio("https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3")
        audio.play().catch(() => {})
      }
    } else {
      setFeedback(`Wrong! The correct answer is "${shuffledOptions[correctAnswerIndex]}"`)
      // Play wrong sound
      if (!isMuted) {
        const wrongAudio = new Audio("https://www.soundjay.com/buttons/sounds/button-10.mp3")
        wrongAudio.volume = 0.3
        wrongAudio.play().catch(() => {})
      }
    }
  }

  const handleNext = async () => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      const nextQuestionIndex = currentQuestion + 1
      setCurrentQuestion(nextQuestionIndex)
      setFeedback("")
      setAnswered(false)
      setSelectedAnswer(null)
      shuffleQuestionOptions(shuffledQuestions[nextQuestionIndex])
    } else {
      // Level complete - Save progress
      const finalScore = answered && selectedAnswer === correctAnswerIndex ? score + 1 : score
      setLevelScores({ ...levelScores, [currentLevel]: finalScore })

      try {
        const result = await saveLevelProgress("synohit", currentLevel, finalScore, 10)

        if (!result.isFirstAttempt) {
          toast.info(
            `Practice attempt completed! Recorded score: ${(result.recordedScore ?? 0) * 10} pts. Current score: ${(result.currentScore ?? 0) * 10} pts`,
            { duration: 5000 }
          )
        }
      } catch (error) {
        console.error('Error saving progress:', error)
        toast.error('Failed to save progress')
      }

      if (currentLevel < 3) {
        setGameState("levelComplete")
      } else {
        setGameState("gameComplete")
      }
    }
  }

  const handleNextLevel = async () => {
    const nextLevel = currentLevel + 1
    const levelStatus = await getLevelStatus("synohit", nextLevel)

    // Check if next level is unlocked
    if (levelStatus === "locked") {
      toast.error(`Level ${nextLevel} is locked! You need to score at least ${MIN_SCORE_TO_PASS * 10} pts in Level ${nextLevel - 1} to unlock it.`)
      return
    }

    setCurrentLevel(nextLevel)
    setCurrentQuestion(0)
    setScore(0)
    setFeedback("")
    setAnswered(false)
    setSelectedAnswer(null)
    setGameState("playing")
    const questions = getLevelQuestions(nextLevel)
    setShuffledQuestions(questions)
    if (questions[0]) {
      shuffleQuestionOptions(questions[0])
    }
  }

  const handleGoBack = () => {
    setGameState("start")
    setCurrentLevel(1)
    setCurrentQuestion(0)
    setScore(0)
    setFeedback("")
    setAnswered(false)
    setSelectedAnswer(null)
    setLevelScores({ 1: 0, 2: 0, 3: 0 })
    setShuffledQuestions([])
    setShuffledOptions([])
  }

  const handleBackToLevelSelect = () => {
    setGameState("levelSelect")
    setCurrentQuestion(0)
    setScore(0)
    setFeedback("")
    setAnswered(false)
    setSelectedAnswer(null)
  }

  const canColors = ["orange", "green", "blue", "teal"]

  if (gameState === "start") {
    return (
      <TropicalBackground>
        <div className="min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 relative">
          {/* Back Button - Top Left (only show if onBack is provided) */}
          {onBack && (
            <button
              onClick={onBack}
              className="absolute top-3 left-3 sm:top-4 sm:left-4 z-30 bg-gray-700/80 hover:bg-gray-800 text-white font-bold px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-lg transition-all flex items-center gap-1 sm:gap-2 text-sm sm:text-base backdrop-blur-sm active:scale-95"
            >
              <span>←</span> <span className="hidden sm:inline">Back</span>
            </button>
          )}

          {/* Mute Button - Top Right */}
          <button
            onClick={toggleMute}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 bg-gray-700/90 hover:bg-gray-800 text-white font-bold px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-lg transition-all text-lg sm:text-xl backdrop-blur-sm"
            title={isMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>

          {/* Title Sign */}
          <div className="mb-4 sm:mb-8 animate-fade-in">
            <WoodenSign size="large">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg tracking-wide">SynoHit</h1>
            </WoodenSign>
          </div>

          {/* Instructions Card */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-4 border-amber-800 rounded-2xl p-4 sm:p-6 md:p-8 max-w-[95%] sm:max-w-2xl shadow-2xl animate-slide-up">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-amber-900">How to Play</h2>
            <p className="text-center text-amber-800 mb-4 sm:mb-6 text-sm sm:text-base font-medium">Click the paint can with the correct synonym!</p>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="flex items-start gap-2 sm:gap-3 bg-gradient-to-r from-orange-100 to-orange-50 p-3 sm:p-4 rounded-lg border-l-4 border-orange-500 shadow-md transform hover:scale-102 transition-transform">
                <span className="text-xl sm:text-2xl font-bold text-orange-600">1</span>
                <div>
                  <h3 className="font-bold text-amber-900 text-sm sm:text-base">Level 1: Simple Synonyms</h3>
                  <p className="text-xs sm:text-sm text-amber-700">10 questions with 3 options each</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 bg-gradient-to-r from-green-100 to-green-50 p-3 sm:p-4 rounded-lg border-l-4 border-green-500 shadow-md transform hover:scale-102 transition-transform">
                <span className="text-xl sm:text-2xl font-bold text-green-600">2</span>
                <div>
                  <h3 className="font-bold text-amber-900 text-sm sm:text-base">Level 2: Complex Synonyms</h3>
                  <p className="text-xs sm:text-sm text-amber-700">10 advanced questions with 4 options</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 bg-gradient-to-r from-blue-100 to-blue-50 p-3 sm:p-4 rounded-lg border-l-4 border-blue-500 shadow-md transform hover:scale-102 transition-transform">
                <span className="text-xl sm:text-2xl font-bold text-blue-600">3</span>
                <div>
                  <h3 className="font-bold text-amber-900 text-sm sm:text-base">Level 3: Contextual Synonyms</h3>
                  <p className="text-xs sm:text-sm text-amber-700">Find synonyms within sentences</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartGame}
              className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all text-lg sm:text-xl shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95"
            >
              🎮 Start Game
            </button>
          </div>
        </div>
      </TropicalBackground>
    )
  }

  // Level Selection Screen
  if (gameState === "levelSelect") {
    const levelConfig = [
      { level: 1, title: "Level 1", subtitle: "Simple Synonyms", emoji: "🌱", color: "from-green-400 to-green-600", status: levelStatuses[1] },
      { level: 2, title: "Level 2", subtitle: "Complex Synonyms", emoji: "🌿", color: "from-yellow-400 to-orange-500", status: levelStatuses[2] },
      { level: 3, title: "Level 3", subtitle: "Contextual Synonyms", emoji: "🌳", color: "from-red-400 to-red-600", status: levelStatuses[3] },
    ]

    return (
      <TropicalBackground>
        <div className="min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 relative">
          {/* Back Button */}
          <button
            onClick={handleGoBack}
            className="absolute top-3 left-3 sm:top-4 sm:left-4 z-30 bg-gray-700/80 hover:bg-gray-800 text-white font-bold px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-lg transition-all flex items-center gap-1 sm:gap-2 text-sm sm:text-base backdrop-blur-sm active:scale-95"
          >
            <span>←</span> <span className="hidden sm:inline">Back</span>
          </button>

          {/* Mute Button - Top Right */}
          <button
            onClick={toggleMute}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 bg-gray-700/90 hover:bg-gray-800 text-white font-bold px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-lg transition-all text-lg sm:text-xl backdrop-blur-sm"
            title={isMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>

          {/* Title */}
          <div className="mb-6 sm:mb-8 animate-fade-in">
            <WoodenSign size="large">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg tracking-wide">Select Level</h1>
            </WoodenSign>
          </div>

          {/* Level Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl w-full px-4">
            {levelConfig.map((config, index) => {
              const isLocked = config.status === "locked"
              const isCompleted = config.status === "completed"

              return (
                <button
                  key={config.level}
                  onClick={() => handleLevelSelect(config.level)}
                  disabled={isLocked}
                  className={`
                    relative bg-gradient-to-br from-amber-50 to-amber-100 border-4 border-amber-800 rounded-2xl p-6 shadow-2xl
                    transform transition-all duration-300
                    ${isLocked ? "opacity-60 cursor-not-allowed grayscale" : "hover:scale-105 hover:shadow-xl cursor-pointer active:scale-95"}
                    animate-slide-up
                  `}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Lock Icon */}
                  {isLocked && (
                    <div className="absolute top-4 right-4 text-3xl sm:text-4xl">🔒</div>
                  )}

                  {/* Completed Badge */}
                  {isCompleted && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl shadow-lg">
                      ✓
                    </div>
                  )}

                  {/* Emoji */}
                  <div className="text-5xl sm:text-6xl mb-4">{config.emoji}</div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-2">{config.title}</h3>
                  <p className="text-sm sm:text-base text-amber-700 mb-4">{config.subtitle}</p>

                  {/* Difficulty Badge */}
                  <div className={`inline-block px-4 py-2 rounded-full text-white font-bold text-sm bg-gradient-to-r ${config.color}`}>
                    {isLocked ? "Locked" : isCompleted ? "Completed" : "Play"}
                  </div>

                  {/* Lock Message */}
                  {isLocked && (
                    <p className="text-xs text-amber-600 mt-3">
                      Complete Level {config.level - 1} with {MIN_SCORE_TO_PASS}/10 to unlock
                    </p>
                  )}
                </button>
              )
            })}
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-amber-50/90 backdrop-blur border-2 border-amber-700 rounded-xl p-4 max-w-2xl mx-4 text-center">
            <p className="text-amber-900 font-semibold text-sm sm:text-base">
              🎯 Complete each level with at least {MIN_SCORE_TO_PASS}/10 to unlock the next one!
            </p>
          </div>
        </div>
      </TropicalBackground>
    )
  }

  if (gameState === "levelComplete") {
    const passed = score >= MIN_SCORE_TO_PASS
    const stars = getStarRating(score, 10)
    const nextLevelStatus = getLevelStatus("synohit", currentLevel + 1)

    return (
      <TropicalBackground>
        <div className="min-h-screen flex flex-col items-center justify-center p-2 sm:p-4">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-4 border-amber-800 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl text-center max-w-[95%] sm:max-w-md animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-amber-900">Level {currentLevel} Complete!</h2>
            <div className="text-6xl sm:text-8xl mb-3 sm:mb-4 animate-bounce-in">{passed ? "🎉" : "😔"}</div>

            {/* Star Rating */}
            <div className="flex justify-center gap-1 sm:gap-2 mb-3 sm:mb-4">
              {[1, 2, 3].map((star) => (
                <span key={star} className={`text-3xl sm:text-4xl ${star <= stars ? "text-yellow-400" : "text-gray-300"}`}>
                  ⭐
                </span>
              ))}
            </div>

            <div className={`bg-gradient-to-r rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border-2 ${passed ? "from-green-100 to-green-50 border-green-300" : "from-red-100 to-red-50 border-red-300"}`}>
              <p className={`text-4xl sm:text-6xl font-bold ${passed ? "text-green-600" : "text-red-600"}`}>{score * 10} pts</p>
              <p className={`text-sm sm:text-base font-semibold mt-2 ${passed ? "text-green-700" : "text-red-700"}`}>
                {passed ? `🎊 Level ${currentLevel + 1} Unlocked!` : `Need ${MIN_SCORE_TO_PASS * 10} pts to unlock next level`}
              </p>
            </div>

            {!passed && (
              <p className="text-sm sm:text-base text-amber-800 mb-4 sm:mb-6 bg-amber-50 p-3 rounded-lg border border-amber-300">
                Keep trying! You need at least {MIN_SCORE_TO_PASS} correct answers to unlock Level {currentLevel + 1}.
              </p>
            )}

            {passed && (
              <p className="text-base sm:text-lg text-amber-700 mb-4 sm:mb-6 font-medium">Ready for the next challenge?</p>
            )}

            <div className="space-y-2 sm:space-y-3">
              {passed && currentLevel < 3 && (
                <button
                  onClick={handleNextLevel}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-all text-base sm:text-lg shadow-lg hover:shadow-xl active:scale-95 transform hover:scale-102"
                >
                  Continue to Level {currentLevel + 1} →
                </button>
              )}
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => handleLevelSelect(currentLevel)}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition-all shadow-lg text-sm sm:text-base active:scale-95"
                >
                  Retry
                </button>
                <button
                  onClick={handleBackToLevelSelect}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition-all shadow-lg text-sm sm:text-base active:scale-95"
                >
                  Levels
                </button>
                <button
                  onClick={handleGoBack}
                  className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition-all shadow-lg text-sm sm:text-base active:scale-95"
                >
                  Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      </TropicalBackground>
    )
  }

  if (gameState === "gameComplete") {
    const totalScore = levelScores[1] + levelScores[2] + levelScores[3]
    return (
      <TropicalBackground>
        <div className="min-h-screen flex flex-col items-center justify-center p-2 sm:p-4">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-4 border-amber-800 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl text-center max-w-[95%] sm:max-w-md animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-amber-900">Game Complete!</h2>
            <div className="text-6xl sm:text-8xl mb-3 sm:mb-4 animate-bounce-in">🏆</div>
            <div className="bg-gradient-to-r from-yellow-200 via-orange-200 to-yellow-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border-2 border-yellow-400">
              <p className="text-xs sm:text-sm text-amber-700 mb-1 sm:mb-2 font-semibold">Final Score</p>
              <p className="text-4xl sm:text-5xl font-bold text-orange-600">{totalScore * 10} pts</p>
            </div>
            <div className="bg-amber-100 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 text-left space-y-1.5 sm:space-y-2 border-2 border-amber-300">
              <p className="text-amber-800 flex justify-between text-sm sm:text-base"><span>Level 1:</span> <span className="font-bold">{levelScores[1] * 10} pts</span></p>
              <p className="text-amber-800 flex justify-between text-sm sm:text-base"><span>Level 2:</span> <span className="font-bold">{levelScores[2] * 10} pts</span></p>
              <p className="text-amber-800 flex justify-between text-sm sm:text-base"><span>Level 3:</span> <span className="font-bold">{levelScores[3] * 10} pts</span></p>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={handleBackToLevelSelect}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-all text-base sm:text-lg shadow-lg active:scale-95 transform hover:scale-102"
              >
                Select Level
              </button>
              <button
                onClick={handleGoBack}
                className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-all text-base sm:text-lg shadow-lg active:scale-95"
              >
                Main Menu
              </button>
            </div>
          </div>
        </div>
      </TropicalBackground>
    )
  }

  if (gameState === "playing") {
    return (
      <TropicalBackground>
        <div className="min-h-screen flex flex-col items-center px-2 sm:px-4 pt-4 sm:pt-8 relative">
          {/* Enhanced Confetti with Stars and Sparkles */}
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none z-50">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-2xl sm:text-3xl"
                  style={{
                    left: Math.random() * 100 + "%",
                    top: -20,
                    animation: `confettiFall ${1.5 + Math.random()}s linear forwards`,
                    animationDelay: `${Math.random() * 0.3}s`,
                  }}
                >
                  {["🎊", "🎉", "⭐", "✨", "🌟", "💫"][Math.floor(Math.random() * 6)]}
                </div>
              ))}
            </div>
          )}

          {/* Go Back Button - Top Left */}
          <button
            onClick={handleBackToLevelSelect}
            className="absolute top-3 left-3 sm:top-4 sm:left-4 z-30 bg-gray-700/90 hover:bg-gray-800 text-white font-bold px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-lg transition-all flex items-center gap-1 sm:gap-2 text-sm sm:text-base backdrop-blur-sm"
          >
            <span>←</span> <span className="hidden sm:inline">Levels</span>
          </button>

          {/* Mute Button - Top Right */}
          <button
            onClick={toggleMute}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 bg-gray-700/90 hover:bg-gray-800 text-white font-bold px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-lg transition-all text-lg sm:text-xl backdrop-blur-sm"
            title={isMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>

          {/* Header Stats with Enhanced Design */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-4 sm:mb-6 mt-2">
            <div className="bg-gradient-to-r from-amber-100 to-amber-50 border-2 border-amber-700 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 shadow-md">
              <span className="text-amber-900 font-bold text-sm sm:text-base">📚 Level {currentLevel}</span>
            </div>
            <div className="bg-gradient-to-r from-amber-100 to-amber-50 border-2 border-amber-700 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 shadow-md">
              <span className="text-amber-900 font-bold text-sm sm:text-base">❓ {currentQuestion + 1}/10</span>
            </div>
            <div className="bg-gradient-to-r from-orange-100 to-orange-50 border-2 border-orange-700 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 shadow-md">
              <span className="text-orange-900 font-bold text-sm sm:text-base">⭐ {score * 10} pts</span>
            </div>
          </div>

          {/* Target Word or Sentence */}
          <div className="mb-4 sm:mb-8 w-full flex justify-center px-2">
            {currentLevel === 3 && question.sentence ? (
              <SentenceDisplay sentence={question.sentence} underlinedWord={question.underlinedWord!} />
            ) : (
              <WoodenSign>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg uppercase tracking-wider">
                  {question.target}
                </p>
              </WoodenSign>
            )}
          </div>

          {/* Instruction */}
          <p className="text-white text-sm sm:text-lg mb-4 sm:mb-6 text-center drop-shadow-lg bg-amber-900/60 px-4 py-2 sm:px-6 sm:py-3 rounded-full mx-2 font-semibold backdrop-blur-sm border-2 border-amber-700">
            {currentLevel === 3 ? "🎯 Find the synonym for the underlined word" : "🎯 Find the synonym"}
          </p>

          {/* Paint Cans - Responsive Grid */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-4">
            <div className="flex flex-wrap justify-center items-end gap-4 xs:gap-5 sm:gap-6 md:gap-8 lg:gap-10 mb-4 sm:mb-8">
              {shuffledOptions.map((option, index) => (
                <PaintCan
                  key={index}
                  index={index}
                  color={canColors[index]}
                  label={option}
                  onClick={() => handleAnswerClick(index)}
                  disabled={answered}
                  isCorrect={answered && index === correctAnswerIndex}
                  isWrong={answered && selectedAnswer === index && index !== correctAnswerIndex}
                  answered={answered}
                />
              ))}
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`text-center mb-4 sm:mb-6 text-base sm:text-xl font-bold px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-2xl mx-2 border-2 transform scale-105 ${
              feedback.includes("Correct")
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-300 animate-success-pulse"
                : "bg-gradient-to-r from-red-500 to-red-600 text-white border-red-300 animate-shake"
            }`}>
              {feedback}
            </div>
          )}

          {/* Next Button */}
          {answered && (
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:via-amber-800 hover:to-amber-900 text-white font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-xl transition-all text-base sm:text-lg shadow-lg transform hover:scale-105 active:scale-95 border-2 border-amber-900"
            >
              {currentQuestion < shuffledQuestions.length - 1 ? "Next Question →" : "Complete Level →"}
            </button>
          )}
        </div>

        <style jsx>{`
          /* Hide scrollbar */
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }

          @keyframes confettiFall {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
          @keyframes success-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes bounce-in {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* Paint Can Animations */
          @keyframes can-entrance {
            0% {
              opacity: 0;
              transform: translateY(50px) scale(0.5) rotate(-10deg);
            }
            60% {
              transform: translateY(-10px) scale(1.05) rotate(2deg);
            }
            80% {
              transform: translateY(5px) scale(0.98) rotate(-1deg);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1) rotate(0deg);
            }
          }

          @keyframes can-float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-8px);
            }
          }

          @keyframes can-click {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(0.92);
            }
            100% {
              transform: scale(1);
            }
          }

          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(200%);
            }
          }

          @keyframes ripple {
            0% {
              opacity: 0.6;
              transform: scale(0);
            }
            100% {
              opacity: 0;
              transform: scale(2);
            }
          }

          @keyframes sparkle-1 {
            0%, 100% {
              opacity: 0.6;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.5);
            }
          }

          @keyframes sparkle-2 {
            0%, 100% {
              opacity: 0.5;
              transform: scale(1);
            }
            50% {
              opacity: 0.9;
              transform: scale(1.3);
            }
          }

          @keyframes sparkle-3 {
            0%, 100% {
              opacity: 0.4;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.4);
            }
          }

          /* Emoji Face Animations */
          @keyframes face-neutral {
            0%, 100% {
              transform: scale(1) rotate(0deg);
            }
            50% {
              transform: scale(1.05) rotate(2deg);
            }
          }

          @keyframes face-happy {
            0% {
              transform: scale(1) rotate(0deg);
            }
            25% {
              transform: scale(1.3) rotate(-15deg);
            }
            50% {
              transform: scale(1.4) rotate(10deg);
            }
            75% {
              transform: scale(1.3) rotate(-5deg);
            }
            100% {
              transform: scale(1.2) rotate(0deg);
            }
          }

          @keyframes face-sad {
            0% {
              transform: scale(1) translateY(0) rotate(0deg);
            }
            25% {
              transform: scale(0.9) translateY(3px) rotate(-5deg);
            }
            50% {
              transform: scale(0.95) translateY(5px) rotate(5deg);
            }
            75% {
              transform: scale(0.92) translateY(4px) rotate(-3deg);
            }
            100% {
              transform: scale(0.9) translateY(5px) rotate(0deg);
            }
          }

          .animate-success-pulse {
            animation: success-pulse 0.6s ease-in-out;
          }
          .animate-bounce-in {
            animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
          .animate-fade-in {
            animation: fade-in 0.8s ease-out;
          }
          .animate-slide-up {
            animation: slide-up 0.8s ease-out;
          }
          .animate-can-entrance {
            animation: can-entrance 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
          }
          .animate-can-float {
            animation: can-float 3s ease-in-out infinite;
          }
          .animate-can-click {
            animation: can-click 0.3s ease-out;
          }
          .animate-shimmer {
            animation: shimmer 1.5s ease-in-out;
          }
          .animate-ripple {
            animation: ripple 0.6s ease-out;
          }
          .animate-sparkle-1 {
            animation: sparkle-1 2s ease-in-out infinite;
          }
          .animate-sparkle-2 {
            animation: sparkle-2 2.5s ease-in-out infinite 0.5s;
          }
          .animate-sparkle-3 {
            animation: sparkle-3 3s ease-in-out infinite 1s;
          }
          .animate-face-neutral {
            animation: face-neutral 3s ease-in-out infinite;
          }
          .animate-face-happy {
            animation: face-happy 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          }
          .animate-face-sad {
            animation: face-sad 0.6s ease-out forwards;
          }
        `}</style>
      </TropicalBackground>
    )
  }

  return null
}
