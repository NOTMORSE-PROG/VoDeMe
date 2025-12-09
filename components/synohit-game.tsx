"use client"

import { useState } from "react"

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

// Tropical Background Component
function TropicalBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-orange-200" />

      {/* Sun */}
      <div className="absolute top-8 right-16 w-20 h-20 bg-yellow-300 rounded-full shadow-lg opacity-80" />

      {/* Clouds */}
      <div className="absolute top-12 left-20 w-32 h-12 bg-white rounded-full opacity-90" />
      <div className="absolute top-16 left-28 w-24 h-10 bg-white rounded-full opacity-90" />
      <div className="absolute top-20 right-40 w-28 h-10 bg-white rounded-full opacity-80" />
      <div className="absolute top-24 right-48 w-20 h-8 bg-white rounded-full opacity-80" />

      {/* Mountains/Hills in background */}
      <div className="absolute bottom-32 left-0 right-0">
        <svg viewBox="0 0 1200 200" className="w-full h-32 opacity-60">
          <path d="M0,200 L0,120 Q150,60 300,100 Q450,140 600,80 Q750,20 900,100 Q1050,140 1200,80 L1200,200 Z" fill="#228B22" />
        </svg>
      </div>

      {/* Rice terraces / fields */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-amber-600 via-green-600 to-green-500" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-700 via-amber-600 to-transparent opacity-60" />

      {/* Rice field lines */}
      <div className="absolute bottom-20 left-0 right-0 h-1 bg-green-700 opacity-40" />
      <div className="absolute bottom-28 left-0 right-0 h-1 bg-green-700 opacity-30" />
      <div className="absolute bottom-36 left-0 right-0 h-1 bg-green-700 opacity-20" />

      {/* Hut on the left */}
      <div className="absolute bottom-32 left-8 z-10">
        <div className="relative">
          {/* Roof */}
          <div className="w-0 h-0 border-l-[30px] border-r-[30px] border-b-[25px] border-l-transparent border-r-transparent border-b-amber-800" />
          {/* House body */}
          <div className="w-14 h-10 bg-amber-700 -mt-1 ml-[2px]" />
          {/* Window */}
          <div className="absolute bottom-4 left-4 w-3 h-3 bg-amber-900" />
        </div>
      </div>

      {/* Hut on the right */}
      <div className="absolute bottom-36 right-12 z-10">
        <div className="relative">
          {/* Roof */}
          <div className="w-0 h-0 border-l-[35px] border-r-[35px] border-b-[30px] border-l-transparent border-r-transparent border-b-amber-800" />
          {/* House body */}
          <div className="w-16 h-12 bg-amber-700 -mt-1 ml-[4px]" />
          {/* Window */}
          <div className="absolute bottom-5 left-5 w-4 h-4 bg-amber-900" />
        </div>
      </div>

      {/* Palm tree left */}
      <div className="absolute bottom-32 left-24 z-10">
        <div className="w-3 h-20 bg-amber-800 rounded" />
        <div className="absolute -top-4 -left-6 text-4xl">🌴</div>
      </div>

      {/* Palm tree right */}
      <div className="absolute bottom-36 right-32 z-10">
        <div className="w-3 h-24 bg-amber-800 rounded" />
        <div className="absolute -top-4 -left-6 text-4xl">🌴</div>
      </div>

      {/* Butterflies */}
      <div className="absolute top-32 right-24 text-2xl animate-bounce" style={{ animationDuration: '2s' }}>🦋</div>
      <div className="absolute top-48 left-32 text-xl animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>🦋</div>

      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  )
}

// Wooden Sign Component
function WoodenSign({ children, size = "large" }: { children: React.ReactNode; size?: "large" | "medium" }) {
  const sizeClasses = size === "large"
    ? "px-4 sm:px-6 md:px-8 py-3 sm:py-4 min-w-[150px] sm:min-w-[180px] md:min-w-[200px]"
    : "px-4 sm:px-6 py-2 sm:py-3 min-w-[120px] sm:min-w-[150px]"

  return (
    <div className="flex flex-col items-center">
      {/* Rope/Chain */}
      <div className="flex justify-center gap-16 sm:gap-20 md:gap-24 -mb-2">
        <div className="w-1 h-4 sm:h-6 bg-amber-900 rounded" />
        <div className="w-1 h-4 sm:h-6 bg-amber-900 rounded" />
      </div>
      {/* Sign board */}
      <div className={`relative ${sizeClasses} bg-gradient-to-b from-amber-600 via-amber-700 to-amber-800 rounded-lg shadow-2xl border-2 sm:border-4 border-amber-900`}>
        {/* Wood grain effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-0.5 sm:h-1 bg-amber-900 mt-1.5 sm:mt-2 mx-2 rounded" />
          <div className="h-0.5 sm:h-1 bg-amber-900 mt-2 sm:mt-3 mx-4 rounded" />
          <div className="h-0.5 sm:h-1 bg-amber-900 mt-2 sm:mt-3 mx-2 rounded" />
        </div>
        {/* Content */}
        <div className="relative text-center">
          {children}
        </div>
        {/* Nails */}
        <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-400 rounded-full shadow" />
        <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-400 rounded-full shadow" />
      </div>
      {/* Wooden posts */}
      <div className="flex justify-center gap-20 sm:gap-24 md:gap-28 -mt-1">
        <div className="w-3 sm:w-4 h-10 sm:h-12 md:h-16 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 rounded-b" />
        <div className="w-3 sm:w-4 h-10 sm:h-12 md:h-16 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 rounded-b" />
      </div>
    </div>
  )
}

// Paint Can Component
function PaintCan({
  color,
  label,
  onClick,
  disabled,
  isCorrect,
  isWrong,
  answered
}: {
  color: string
  label: string
  onClick: () => void
  disabled: boolean
  isCorrect: boolean
  isWrong: boolean
  answered: boolean
}) {
  const colorClasses: Record<string, string> = {
    orange: "from-orange-400 via-orange-500 to-orange-600",
    green: "from-green-400 via-green-500 to-green-600",
    blue: "from-blue-400 via-blue-500 to-blue-600",
    red: "from-red-400 via-red-500 to-red-600",
    teal: "from-teal-400 via-teal-500 to-teal-600",
  }

  const highlightClasses: Record<string, string> = {
    orange: "bg-orange-300",
    green: "bg-green-300",
    blue: "bg-blue-300",
    red: "bg-red-300",
    teal: "bg-teal-300",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center transition-all duration-200 ${
        disabled ? "cursor-not-allowed" : "cursor-pointer hover:scale-105 sm:hover:scale-110 hover:-translate-y-1 sm:hover:-translate-y-2 active:scale-95"
      } ${isCorrect ? "scale-105 sm:scale-110 -translate-y-1 sm:-translate-y-2" : ""} ${isWrong && answered ? "opacity-60" : ""}`}
    >
      {/* Paint Can */}
      <div className={`relative w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-32 rounded-lg bg-gradient-to-b ${colorClasses[color]} shadow-xl ${
        isCorrect ? "ring-2 sm:ring-4 ring-yellow-400 ring-offset-1 sm:ring-offset-2" : ""
      } ${isWrong && answered ? "ring-2 sm:ring-4 ring-gray-400" : ""}`}>
        {/* Can rim/top */}
        <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-14 sm:w-16 md:w-20 h-2 sm:h-3 rounded-t-lg bg-gradient-to-b ${colorClasses[color]} border-t-2 border-x-2 border-gray-600`} />

        {/* Highlight streak */}
        <div className={`absolute top-3 sm:top-4 left-1.5 sm:left-2 w-1.5 sm:w-2 h-14 sm:h-16 md:h-20 ${highlightClasses[color]} opacity-40 rounded-full`} />

        {/* Label area */}
        <div className="absolute inset-x-1.5 sm:inset-x-2 top-5 sm:top-6 bottom-3 sm:bottom-4 bg-amber-100 rounded flex items-center justify-center p-0.5 sm:p-1 border border-amber-300">
          <span className="text-amber-900 font-bold text-[10px] sm:text-xs md:text-sm text-center leading-tight break-words">
            {label}
          </span>
        </div>

        {/* Correct checkmark */}
        {isCorrect && (
          <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm sm:text-lg shadow-lg">
            ✓
          </div>
        )}
      </div>
    </button>
  )
}

// Sentence Display Component for Level 3
function SentenceDisplay({ sentence, underlinedWord }: { sentence: string; underlinedWord: string }) {
  return (
    <div className="bg-amber-100 border-2 sm:border-4 border-amber-700 rounded-xl p-3 sm:p-4 md:p-6 shadow-xl max-w-[95%] sm:max-w-2xl mx-auto">
      <p className="text-sm sm:text-base md:text-lg text-amber-900 leading-relaxed text-center">
        {sentence.split(" ").map((word, idx) => {
          const cleanWord = word.replace(/[.,!?]/g, "")
          const punctuation = word.match(/[.,!?]/g)?.[0] || ""
          const isUnderlined = cleanWord.toLowerCase() === underlinedWord.toLowerCase()
          return (
            <span key={idx}>
              <span className={isUnderlined ? "underline decoration-2 font-bold text-orange-600 bg-yellow-200 px-0.5 sm:px-1 rounded" : ""}>
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
  const [gameState, setGameState] = useState<"start" | "playing" | "levelComplete" | "gameComplete">("start")
  const [feedback, setFeedback] = useState<string>("")
  const [answered, setAnswered] = useState(false)
  const [levelScores, setLevelScores] = useState({ 1: 0, 2: 0, 3: 0 })
  const [showConfetti, setShowConfetti] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  const questions = (
    {
      1: levelData.level1,
      2: levelData.level2,
      3: levelData.level3,
    } as const
  )[currentLevel] as Question[]

  const question = questions[currentQuestion]

  const handleStartGame = () => {
    setGameState("playing")
    setCurrentLevel(1)
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
  }

  const handleAnswerClick = (index: number) => {
    if (answered) return

    setAnswered(true)
    setSelectedAnswer(index)

    if (index === question.correct) {
      setFeedback("Correct!")
      setScore(score + 1)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 1500)
      // Play success sound
      const audio = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_d3d346ba65.mp3")
      audio.play().catch(() => {})
    } else {
      setFeedback(`Wrong! The correct answer is "${question.options[question.correct]}"`)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setFeedback("")
      setAnswered(false)
      setSelectedAnswer(null)
    } else {
      // Level complete
      setLevelScores({ ...levelScores, [currentLevel]: score })

      if (currentLevel < 3) {
        setGameState("levelComplete")
      } else {
        setGameState("gameComplete")
      }
    }
  }

  const handleNextLevel = () => {
    setCurrentLevel(currentLevel + 1)
    setCurrentQuestion(0)
    setScore(0)
    setFeedback("")
    setAnswered(false)
    setSelectedAnswer(null)
    setGameState("playing")
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

          {/* Title Sign */}
          <div className="mb-4 sm:mb-8">
            <WoodenSign size="large">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg tracking-wide">SynoHit</h1>
            </WoodenSign>
          </div>

          {/* Instructions Card */}
          <div className="bg-amber-50 border-2 sm:border-4 border-amber-700 rounded-2xl p-4 sm:p-6 md:p-8 max-w-[95%] sm:max-w-2xl shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-amber-900">How to Play</h2>
            <p className="text-center text-amber-800 mb-4 sm:mb-6 text-sm sm:text-base">Click the paint can with the correct synonym!</p>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="flex items-start gap-2 sm:gap-3 bg-orange-100 p-2 sm:p-3 rounded-lg border-l-4 border-orange-500">
                <span className="text-xl sm:text-2xl">1</span>
                <div>
                  <h3 className="font-bold text-amber-900 text-sm sm:text-base">Level 1: Simple Synonyms</h3>
                  <p className="text-xs sm:text-sm text-amber-700">10 questions with 3 options each</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 bg-green-100 p-2 sm:p-3 rounded-lg border-l-4 border-green-500">
                <span className="text-xl sm:text-2xl">2</span>
                <div>
                  <h3 className="font-bold text-amber-900 text-sm sm:text-base">Level 2: Complex Synonyms</h3>
                  <p className="text-xs sm:text-sm text-amber-700">10 advanced questions with 4 options</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 bg-blue-100 p-2 sm:p-3 rounded-lg border-l-4 border-blue-500">
                <span className="text-xl sm:text-2xl">3</span>
                <div>
                  <h3 className="font-bold text-amber-900 text-sm sm:text-base">Level 3: Contextual Synonyms</h3>
                  <p className="text-xs sm:text-sm text-amber-700">Find synonyms within sentences</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartGame}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all text-lg sm:text-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95"
            >
              Start Game
            </button>
          </div>
        </div>
      </TropicalBackground>
    )
  }

  if (gameState === "levelComplete") {
    return (
      <TropicalBackground>
        <div className="min-h-screen flex flex-col items-center justify-center p-2 sm:p-4">
          <div className="bg-amber-50 border-2 sm:border-4 border-amber-700 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl text-center max-w-[95%] sm:max-w-md">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-amber-900">Level {currentLevel} Complete!</h2>
            <div className="text-5xl sm:text-7xl mb-3 sm:mb-4">🎉</div>
            <div className="bg-orange-100 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
              <p className="text-4xl sm:text-6xl font-bold text-orange-600">{score}/10</p>
            </div>
            <p className="text-base sm:text-lg text-amber-700 mb-4 sm:mb-6">Ready for the next challenge?</p>
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={handleNextLevel}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-all text-base sm:text-lg shadow-lg active:scale-95"
              >
                Continue to Level {currentLevel + 1}
              </button>
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={handleStartGame}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition-all shadow-lg text-sm sm:text-base active:scale-95"
                >
                  Play Again
                </button>
                <button
                  onClick={handleGoBack}
                  className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition-all shadow-lg text-sm sm:text-base active:scale-95"
                >
                  Go Back
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
          <div className="bg-amber-50 border-2 sm:border-4 border-amber-700 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl text-center max-w-[95%] sm:max-w-md">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-amber-900">Game Complete!</h2>
            <div className="text-5xl sm:text-7xl mb-3 sm:mb-4">🏆</div>
            <div className="bg-gradient-to-r from-yellow-200 to-orange-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm text-amber-700 mb-1 sm:mb-2">Final Score</p>
              <p className="text-4xl sm:text-5xl font-bold text-orange-600">{totalScore}/30</p>
            </div>
            <div className="bg-amber-100 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 text-left space-y-1.5 sm:space-y-2">
              <p className="text-amber-800 flex justify-between text-sm sm:text-base"><span>Level 1:</span> <span className="font-bold">{levelScores[1]}/10</span></p>
              <p className="text-amber-800 flex justify-between text-sm sm:text-base"><span>Level 2:</span> <span className="font-bold">{levelScores[2]}/10</span></p>
              <p className="text-amber-800 flex justify-between text-sm sm:text-base"><span>Level 3:</span> <span className="font-bold">{levelScores[3]}/10</span></p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handleStartGame}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition-all text-base sm:text-lg shadow-lg active:scale-95"
              >
                Play Again
              </button>
              <button
                onClick={handleGoBack}
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition-all text-base sm:text-lg shadow-lg active:scale-95"
              >
                Go Back
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
          {/* Confetti */}
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none z-50">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-2xl"
                  style={{
                    left: Math.random() * 100 + "%",
                    top: -20,
                    animation: `confettiFall ${1.5 + Math.random()}s linear forwards`,
                  }}
                >
                  {["🎊", "🎉", "⭐", "✨"][Math.floor(Math.random() * 4)]}
                </div>
              ))}
            </div>
          )}

          {/* Go Back Button - Top Left */}
          <button
            onClick={handleGoBack}
            className="absolute top-3 left-3 sm:top-4 sm:left-4 z-30 bg-gray-700/80 hover:bg-gray-800 text-white font-bold px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-lg transition-all flex items-center gap-1 sm:gap-2 text-sm sm:text-base backdrop-blur-sm"
          >
            <span>←</span> <span className="hidden sm:inline">Back</span>
          </button>

          {/* Header Stats */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-4 sm:mb-6 mt-2">
            <div className="bg-amber-100 border-2 border-amber-600 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 shadow">
              <span className="text-amber-900 font-bold text-sm sm:text-base">Level {currentLevel}</span>
            </div>
            <div className="bg-amber-100 border-2 border-amber-600 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 shadow">
              <span className="text-amber-900 font-bold text-sm sm:text-base">{currentQuestion + 1}/10</span>
            </div>
            <div className="bg-orange-100 border-2 border-orange-600 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 shadow">
              <span className="text-orange-900 font-bold text-sm sm:text-base">Score: {score}</span>
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
          <p className="text-amber-100 text-sm sm:text-lg mb-4 sm:mb-6 text-center drop-shadow-lg bg-amber-900/40 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mx-2">
            {currentLevel === 3 ? "Find the synonym for the underlined word" : "Find the synonym"}
          </p>

          {/* Paint Cans */}
          <div className={`flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-8 px-2 ${question.options.length === 4 ? "max-w-xs sm:max-w-lg" : "max-w-xs sm:max-w-md"}`}>
            {question.options.map((option, index) => (
              <PaintCan
                key={index}
                color={canColors[index]}
                label={option}
                onClick={() => handleAnswerClick(index)}
                disabled={answered}
                isCorrect={answered && index === question.correct}
                isWrong={answered && selectedAnswer === index && index !== question.correct}
                answered={answered}
              />
            ))}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`text-center mb-4 sm:mb-6 text-base sm:text-xl font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg mx-2 ${
              feedback.includes("Correct")
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}>
              {feedback}
            </div>
          )}

          {/* Next Button */}
          {answered && (
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl transition-all text-base sm:text-lg shadow-lg transform hover:scale-105"
            >
              {currentQuestion < questions.length - 1 ? "Next →" : "Complete →"}
            </button>
          )}
        </div>

        <style jsx>{`
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
        `}</style>
      </TropicalBackground>
    )
  }

  return null
}
