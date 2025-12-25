"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { saveLevelProgress, getLevelStatus, getStarRating } from "@/lib/game-progress"
import { toast } from "sonner"

// Game data for all 30 stages
interface Stage {
  id: number
  type: "word" | "sentence"
  target?: string
  sentence?: string
  options: string[]
  correct: number
}

const gameData: { easy: Stage[]; medium: Stage[]; hard: Stage[] } = {
  easy: [
    { id: 1, type: "word", target: "breakfast", options: ["have a breakfast", "make breakfast", "eat a breakfast"], correct: 1 },
    { id: 2, type: "word", target: "rain", options: ["heavy rain", "loud rain", "soft rain"], correct: 0 },
    { id: 3, type: "sentence", sentence: "Arthur needs to ________ before going out.", options: ["take homework", "do homework", "make homework"], correct: 1 },
    { id: 4, type: "word", target: "cold", options: ["big cold", "strong cold", "catch a cold"], correct: 2 },
    { id: 5, type: "sentence", sentence: "Everyone makes a ________, so don't be too hard on yourself.", options: ["makes a mistaken", "makes a mistakes", "make a mistake"], correct: 2 },
    { id: 6, type: "word", target: "food", options: ["quick food", "fast food", "slow food"], correct: 1 },
    { id: 7, type: "sentence", sentence: "Peter Parker needs ________ to wake up this morning.", options: ["soft coffee", "strong coffee", "weak coffee"], correct: 1 },
    { id: 8, type: "word", target: "promise", options: ["say a promise", "have a promise", "break a promise"], correct: 2 },
    { id: 9, type: "sentence", sentence: "Some teenagers prefer to ________ to organize their thoughts.", options: ["keep a diary", "do a diary", "create a diary"], correct: 0 },
    { id: 10, type: "sentence", sentence: "The students in room 404 made a ________ outside the classroom.", options: ["strong noise", "soft noise", "loud noise"], correct: 2 },
  ],
  medium: [
    { id: 11, type: "sentence", sentence: "The students are starting to ________ in their vocabulary learning.", options: ["do progress", "make progress", "have progress"], correct: 1 },
    { id: 12, type: "word", target: "energy", options: ["high energy", "nuclear energy", "powerful energy"], correct: 1 },
    { id: 13, type: "word", target: "vocabulary", options: ["wide vocabulary", "thick vocabulary", "broad vocabulary"], correct: 2 },
    { id: 14, type: "word", target: "research", options: ["carry up research", "conduct research", "carry out research"], correct: 2 },
    { id: 15, type: "sentence", sentence: "The researchers will ________ to collect data.", options: ["conduct a survey", "create a survey", "do a survey"], correct: 0 },
    { id: 16, type: "sentence", sentence: "The softball team felt ________ after losing the finals.", options: ["strong disappointment", "bitter disappointment", "loud disappointment"], correct: 1 },
    { id: 17, type: "word", target: "appointment", options: ["keep an appointment", "take an appointment", "do an appointment"], correct: 0 },
    { id: 18, type: "sentence", sentence: "I ________ that education changes lives.", options: ["softly believe", "begly believe", "firmly believe"], correct: 2 },
    { id: 19, type: "word", target: "follow", options: ["slowly follow", "strictly follow", "loudly follow"], correct: 1 },
    { id: 20, type: "sentence", sentence: "Teachers were ________ about the sudden drop in attendance.", options: ["lightly concerned", "strongly concerned", "deeply concerned"], correct: 2 },
  ],
  hard: [
    { id: 21, type: "word", target: "regulations", options: ["comply in regulations", "comply with regulations", "obey regulations quickly"], correct: 1 },
    { id: 22, type: "sentence", sentence: "All athletes must ________ to avoid penalties.", options: ["follow in rules", "obey rules strongly", "adhere to rules"], correct: 2 },
    { id: 23, type: "sentence", sentence: "Teachers often have to ________ when deadlines are tight.", options: ["look on the problem", "grapple with a problem", "push a problem"], correct: 1 },
    { id: 24, type: "word", target: "conflict", options: ["resolve a conflict", "dissolve a conflict", "break a conflict"], correct: 0 },
    { id: 25, type: "word", target: "debate", options: ["hotted debate", "heated debate", "warmed debate"], correct: 1 },
    { id: 26, type: "sentence", sentence: "The rise of fake news continues to ________ to society.", options: ["have a danger", "make a threat", "pose a threat"], correct: 2 },
    { id: 27, type: "sentence", sentence: "The two sides reached a ________ during negotiations.", options: ["strong agreement", "tentative agreement", "cold agreement"], correct: 1 },
    { id: 28, type: "word", target: "pressure", options: ["mounting pressure", "thicking pressure", "widening pressure"], correct: 0 },
    { id: 29, type: "word", target: "damaged", options: ["greatly damaged", "hardly damaged", "severely damaged"], correct: 2 },
    { id: 30, type: "sentence", sentence: "It is ________ that the school will cancel classes today.", options: ["barely unlikely", "softly unlikely", "highly unlikely"], correct: 2 },
  ],
}

// Shuffle function using Fisher-Yates algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Beautiful Nature Background Component
function NatureBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-400 via-sky-300 to-emerald-200" />

      {/* Sun */}
      <div className="absolute top-8 right-12 w-20 h-20">
        <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl opacity-60 animate-pulse" />
        <div className="absolute inset-2 bg-yellow-200 rounded-full shadow-2xl" />
      </div>

      {/* Animated clouds */}
      <div className="absolute top-16 left-16 w-32 h-12 opacity-90 animate-cloud-slow">
        <div className="absolute top-0 left-0 w-16 h-10 bg-white rounded-full" />
        <div className="absolute top-2 left-10 w-20 h-8 bg-white rounded-full" />
        <div className="absolute top-3 left-6 w-12 h-6 bg-white rounded-full" />
      </div>
      <div className="absolute top-24 right-24 w-28 h-10 opacity-80 animate-cloud-slower">
        <div className="absolute top-0 right-0 w-14 h-8 bg-white rounded-full" />
        <div className="absolute top-2 right-8 w-18 h-6 bg-white rounded-full" />
      </div>

      {/* Distant hills */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 320" className="w-full" preserveAspectRatio="none">
          <path fill="#22c55e" fillOpacity="0.3" d="M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,186.7C672,192,768,160,864,149.3C960,139,1056,149,1152,170.7C1248,192,1344,224,1392,240L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Green grass/ground */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-green-600 via-green-500 to-green-400" />

      {/* Grass texture lines */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden opacity-30">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 w-1 bg-green-800 rounded-t-full"
            style={{
              left: `${i * 2 + Math.random() * 2}%`,
              height: `${20 + Math.random() * 30}px`,
              transform: `rotate(${Math.random() * 10 - 5}deg)`,
            }}
          />
        ))}
      </div>

      {/* Flowers scattered */}
      <div className="absolute bottom-36 left-12 text-2xl animate-sway">🌸</div>
      <div className="absolute bottom-32 left-32 text-xl animate-sway" style={{ animationDelay: "0.5s" }}>🌺</div>
      <div className="absolute bottom-40 right-20 text-2xl animate-sway" style={{ animationDelay: "1s" }}>🌼</div>
      <div className="absolute bottom-28 right-40 text-xl animate-sway" style={{ animationDelay: "0.3s" }}>🌷</div>

      {/* Trees */}
      <div className="absolute bottom-36 left-8 text-5xl">🌳</div>
      <div className="absolute bottom-40 right-8 text-6xl">🌲</div>
      <div className="absolute bottom-32 left-1/4 text-4xl hidden md:block">🌴</div>

      {/* Butterflies */}
      <div className="absolute top-1/3 left-1/4 text-xl animate-butterfly" style={{ animationDelay: "0s" }}>🦋</div>
      <div className="absolute top-1/4 right-1/3 text-lg animate-butterfly" style={{ animationDelay: "1.5s" }}>🦋</div>

      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes cloud-slow {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(30px); }
        }
        @keyframes cloud-slower {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-40px); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes butterfly {
          0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
          25% { transform: translateX(30px) translateY(-20px) rotate(10deg); }
          50% { transform: translateX(0) translateY(-35px) rotate(-5deg); }
          75% { transform: translateX(-30px) translateY(-20px) rotate(10deg); }
        }
        .animate-cloud-slow {
          animation: cloud-slow 20s ease-in-out infinite;
        }
        .animate-cloud-slower {
          animation: cloud-slower 25s ease-in-out infinite;
        }
        .animate-sway {
          animation: sway 3s ease-in-out infinite;
        }
        .animate-butterfly {
          animation: butterfly 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

// Hopping Character Component
function HoppingCharacter({
  isHopping,
  isWrong,
  position,
  hoveredIndex,
  jumpKey
}: {
  isHopping: boolean
  isWrong: boolean
  position: number
  hoveredIndex: number | null
  jumpKey: number
}) {
  // Calculate horizontal position based on hovered option
  // Options are positioned at -1 (left), 0 (center), 1 (right)
  const getHoverOffset = () => {
    if (hoveredIndex === null) return 0
    // Map index 0 to -200px (left), index 1 to 0px (center), index 2 to 200px (right)
    return (hoveredIndex - 1) * 200
  }

  return (
    <div
      key={jumpKey}
      className={`
        relative
        ${isHopping ? "animate-hop-right" : ""}
        ${isWrong ? "animate-shake-wrong" : ""}
        ${hoveredIndex !== null ? "animate-hover-jump" : ""}
      `}
      style={{
        transform: `translateX(${position * 30 + getHoverOffset()}px)`,
        transition: 'transform 0.35s ease-out',
      }}
    >
      {/* Character shadow */}
      <div className={`
        absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-4
        bg-black/20 rounded-full blur-sm
        transition-all duration-300
        ${isHopping || hoveredIndex !== null ? "scale-75 opacity-50" : "scale-100 opacity-100"}
      `} />

      {/* Character - Cute Frog */}
      <div className={`
        relative text-7xl sm:text-8xl md:text-9xl
        transition-transform duration-300
        ${isHopping ? "scale-110" : "scale-100"}
        filter drop-shadow-lg
      `}>
        🐸
      </div>

      {/* Happy expression on correct */}
      {isHopping && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl animate-pop-up">
          ⭐
        </div>
      )}

      {/* Sad expression on wrong */}
      {isWrong && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl animate-shake">
          😢
        </div>
      )}

      <style jsx>{`
        @keyframes hop-right {
          0% { transform: translateY(0) rotate(0deg); }
          30% { transform: translateY(-40px) rotate(-10deg); }
          50% { transform: translateY(-50px) rotate(0deg); }
          70% { transform: translateY(-30px) rotate(10deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes shake-wrong {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px) rotate(-5deg); }
          40% { transform: translateX(10px) rotate(5deg); }
          60% { transform: translateX(-10px) rotate(-5deg); }
          80% { transform: translateX(10px) rotate(5deg); }
        }
        @keyframes hover-jump {
          0% { transform: translateY(0) scale(1) rotate(0deg); }
          20% { transform: translateY(-15px) scale(1.03) rotate(-3deg); }
          40% { transform: translateY(-35px) scale(1.05) rotate(0deg); }
          60% { transform: translateY(-30px) scale(1.05) rotate(3deg); }
          80% { transform: translateY(-10px) scale(1.02) rotate(0deg); }
          100% { transform: translateY(0) scale(1) rotate(0deg); }
        }
        @keyframes pop-up {
          0% { opacity: 0; transform: translateX(-50%) translateY(10px) scale(0); }
          50% { opacity: 1; transform: translateX(-50%) translateY(-20px) scale(1.2); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-40px) scale(0); }
        }
        .animate-hop-right {
          animation: hop-right 0.6s ease-out;
        }
        .animate-shake-wrong {
          animation: shake-wrong 0.5s ease-out;
        }
        .animate-hover-jump {
          animation: hover-jump 0.35s ease-out;
        }
        .animate-pop-up {
          animation: pop-up 1s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

// Speech Bubble for target word/sentence
function SpeechBubble({ children, type }: { children: React.ReactNode; type: "word" | "sentence" }) {
  return (
    <div className="relative animate-fade-in">
      {/* Bubble */}
      <div className={`
        bg-white rounded-2xl shadow-2xl border-4 border-teal-400
        ${type === "word" ? "px-8 py-6" : "px-6 py-5 max-w-xl"}
      `}>
        <div className={`
          ${type === "word" ? "text-2xl sm:text-3xl md:text-4xl font-bold text-teal-700 text-center" : "text-lg sm:text-xl text-gray-700 text-center leading-relaxed"}
        `}>
          {children}
        </div>
      </div>

      {/* Pointer */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-r-[15px] border-t-[20px] border-l-transparent border-r-transparent border-t-white" />
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[18px] border-r-[18px] border-t-[24px] border-l-transparent border-r-transparent border-t-teal-400 -z-10" />

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}

// Choice Button Component - Like lily pads
function ChoiceButton({
  label,
  onClick,
  disabled,
  isCorrect,
  isWrong,
  answered,
  index,
  onMouseEnter,
  onMouseLeave,
}: {
  label: string
  onClick: () => void
  disabled: boolean
  isCorrect: boolean
  isWrong: boolean
  answered: boolean
  index: number
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}) {
  const colors = [
    "from-emerald-400 to-emerald-600",
    "from-teal-400 to-teal-600",
    "from-cyan-400 to-cyan-600",
  ]

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`
        group relative px-4 sm:px-6 py-4 sm:py-5 rounded-2xl font-bold text-white
        transition-all duration-300 ease-out
        min-w-[140px] sm:min-w-[180px] md:min-w-[200px]
        ${!disabled ? `bg-gradient-to-br ${colors[index]} hover:scale-110 hover:-translate-y-2 hover:shadow-xl active:scale-95` : ""}
        ${isCorrect ? "bg-gradient-to-br from-green-400 to-green-600 scale-110 ring-4 ring-green-300 animate-pulse-success" : ""}
        ${isWrong ? "bg-gradient-to-br from-red-400 to-red-600 scale-95 ring-4 ring-red-300 animate-shake" : ""}
        ${answered && !isCorrect && !isWrong ? "opacity-50 bg-gradient-to-br from-gray-400 to-gray-500" : ""}
        shadow-lg border-b-4 border-black/20
      `}
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-t-2xl ${!disabled && !answered ? "group-hover:bg-white/30" : ""}`} />
      </div>

      {/* Label */}
      <span className="relative z-10 text-sm sm:text-base md:text-lg drop-shadow-md">
        {label}
      </span>

      {/* Correct checkmark */}
      {isCorrect && (
        <span className="absolute -top-2 -right-2 text-2xl animate-bounce-in">✓</span>
      )}

      {/* Wrong X */}
      {isWrong && (
        <span className="absolute -top-2 -right-2 text-2xl animate-shake">✗</span>
      )}

      <style jsx>{`
        @keyframes pulse-success {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          50% { box-shadow: 0 0 0 15px rgba(34, 197, 94, 0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes bounce-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        .animate-pulse-success {
          animation: pulse-success 1s ease-out;
        }
        .animate-shake {
          animation: shake 0.4s ease-out;
        }
        .animate-bounce-in {
          animation: bounce-in 0.4s ease-out;
        }
      `}</style>
    </button>
  )
}

// Progress Bar Component
function ProgressBar({ current, total, level }: { current: number; total: number; level: string }) {
  const percentage = (current / total) * 100

  const levelColors: Record<string, string> = {
    easy: "from-green-400 to-green-600",
    medium: "from-yellow-400 to-orange-500",
    hard: "from-red-400 to-red-600",
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-2 text-sm font-semibold">
        <span className="text-white drop-shadow-md">Stage {current}/{total}</span>
        <span className={`px-3 py-1 rounded-full text-white bg-gradient-to-r ${levelColors[level]} shadow-md uppercase text-xs`}>
          {level}
        </span>
      </div>
      <div className="h-4 bg-white/30 rounded-full overflow-hidden shadow-inner border-2 border-white/50">
        <div
          className={`h-full bg-gradient-to-r ${levelColors[level]} rounded-full transition-all duration-500 ease-out relative overflow-hidden`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </div>
    </div>
  )
}

interface HopRightGameProps {
  onBack?: () => void
}

export default function HopRightGame({ onBack }: HopRightGameProps) {
  const [gameState, setGameState] = useState<"start" | "levelSelect" | "playing" | "levelComplete" | "gameComplete">("start")
  const [currentLevel, setCurrentLevel] = useState<"easy" | "medium" | "hard">("easy")
  const [currentStage, setCurrentStage] = useState(0)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isHopping, setIsHopping] = useState(false)
  const [isWrong, setIsWrong] = useState(false)
  const [characterPosition, setCharacterPosition] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [jumpAnimKey, setJumpAnimKey] = useState(0)
  const [shuffledStages, setShuffledStages] = useState<Stage[]>([])
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([])
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0)
  const [levelScores, setLevelScores] = useState({ easy: 0, medium: 0, hard: 0 })
  const [stageStartTime, setStageStartTime] = useState<number>(Date.now())
  const [showReminder, setShowReminder] = useState(false)
  const [levelStatuses, setLevelStatuses] = useState<Record<number, "locked" | "unlocked" | "completed">>({
    1: "unlocked",
    2: "locked",
    3: "locked"
  })
  const [attemptInfo, setAttemptInfo] = useState<{ isFirstAttempt: boolean; recordedScore?: number } | null>(null)
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hopright-muted')
      return saved === 'true'
    }
    return false
  })

  const toggleMute = () => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    if (typeof window !== 'undefined') {
      localStorage.setItem('hopright-muted', String(newMuted))
    }
  }

  // Load level statuses when entering level select
  useEffect(() => {
    if (gameState === "levelSelect") {
      const loadStatuses = async () => {
        const status1 = await getLevelStatus("hopright", 1)
        const status2 = await getLevelStatus("hopright", 2)
        const status3 = await getLevelStatus("hopright", 3)
        setLevelStatuses({
          1: status1,
          2: status2,
          3: status3
        })
      }
      loadStatuses()
    }
  }, [gameState])
  const reminderTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reminderAudioRef = useRef<HTMLAudioElement | null>(null)

  // Trigger jump animation when hoveredIndex changes
  useEffect(() => {
    if (hoveredIndex !== null) {
      setJumpAnimKey(prev => prev + 1)
    }
  }, [hoveredIndex])

  // Get current stage data
  const stage = shuffledStages[currentStage]

  // Initialize shuffled options for current stage
  const shuffleStageOptions = useCallback((stageData: Stage) => {
    const correctAnswer = stageData.options[stageData.correct]
    const shuffled = shuffleArray(stageData.options)
    const newCorrectIndex = shuffled.indexOf(correctAnswer)
    setShuffledOptions(shuffled)
    setCorrectAnswerIndex(newCorrectIndex)
  }, [])

  // Start level
  const startLevel = useCallback((level: "easy" | "medium" | "hard") => {
    const stages = shuffleArray(gameData[level])
    setShuffledStages(stages)
    setCurrentStage(0)
    setScore(0)
    setAnswered(false)
    setSelectedAnswer(null)
    setIsHopping(false)
    setIsWrong(false)
    setCharacterPosition(0)
    setCurrentLevel(level)
    setGameState("playing")
    setStageStartTime(Date.now())
    setShowReminder(false)
    if (stages[0]) {
      shuffleStageOptions(stages[0])
    }
  }, [shuffleStageOptions])

  // 1-minute reminder timer
  useEffect(() => {
    if (gameState !== "playing" || answered) return

    // Clear existing timeout
    if (reminderTimeoutRef.current) {
      clearTimeout(reminderTimeoutRef.current)
    }

    // Set new timeout for 1 minute
    reminderTimeoutRef.current = setTimeout(() => {
      setShowReminder(true)
      // Play encouraging audio
      try {
        const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleDs...")
        audio.volume = 0.5
        // Using Web Speech API for the reminder message
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance("You can do it! Help me hop right!")
          utterance.rate = 0.9
          utterance.pitch = 1.1
          window.speechSynthesis.speak(utterance)
        }
      } catch (e) {
        console.log("Audio not supported")
      }
    }, 60000) // 1 minute

    return () => {
      if (reminderTimeoutRef.current) {
        clearTimeout(reminderTimeoutRef.current)
      }
    }
  }, [gameState, answered, currentStage])

  // Handle answer click
  const handleAnswerClick = (index: number) => {
    if (answered) return

    setAnswered(true)
    setSelectedAnswer(index)
    setShowReminder(false)
    setHoveredIndex(null)

    if (index === correctAnswerIndex) {
      // Correct answer
      setIsHopping(true)
      setScore(score + 1)
      setCharacterPosition(characterPosition + 1)

      // Play hop sound effect
      if (!isMuted) {
        try {
          const audio = new Audio("https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3")
          audio.volume = 0.4
          audio.play().catch(() => {})
        } catch (e) {
          console.log("Audio not supported")
        }
      }

      setTimeout(() => setIsHopping(false), 600)
    } else {
      // Wrong answer
      setIsWrong(true)

      // Play wrong sound
      if (!isMuted) {
        try {
          const audio = new Audio("https://www.soundjay.com/buttons/sounds/button-10.mp3")
          audio.volume = 0.3
          audio.play().catch(() => {})
        } catch (e) {
          console.log("Audio not supported")
        }
      }

      setTimeout(() => setIsWrong(false), 500)
    }
  }

  // Helper to convert level name to number
  const getLevelNumber = (level: "easy" | "medium" | "hard"): number => {
    return { easy: 1, medium: 2, hard: 3 }[level]
  }

  // Handle next stage
  const handleNext = async () => {
    if (currentStage < shuffledStages.length - 1) {
      // Next stage
      setCurrentStage(currentStage + 1)
      setAnswered(false)
      setSelectedAnswer(null)
      setCharacterPosition(0)
      setHoveredIndex(null)
      setIsHopping(false)
      setIsWrong(false)
      setStageStartTime(Date.now())
      shuffleStageOptions(shuffledStages[currentStage + 1])
    } else {
      // Level complete - calculate final score and save progress
      const finalScore = answered && selectedAnswer === correctAnswerIndex ? score + 1 : score
      setLevelScores({ ...levelScores, [currentLevel]: finalScore })
      setTotalScore(totalScore + finalScore)

      try {
        const result = await saveLevelProgress("hopright", getLevelNumber(currentLevel), finalScore, 10)
        setAttemptInfo({ isFirstAttempt: result.isFirstAttempt, recordedScore: result.recordedScore })

        if (!result.isFirstAttempt) {
          toast.info(
            `Practice attempt completed! Recorded score: ${(result.recordedScore ?? 0) * 10} pts. Current score: ${(result.currentScore ?? 0) * 10} pts`,
            { duration: 5000 }
          )
        }
      } catch (error) {
        console.error('Error saving progress:', error)
        toast.error('Failed to save progress')
        setAttemptInfo(null)
      }

      if (currentLevel === "easy") {
        setGameState("levelComplete")
      } else if (currentLevel === "medium") {
        setGameState("levelComplete")
      } else {
        setGameState("gameComplete")
      }
    }
  }

  // Handle next level
  const handleNextLevel = async () => {
    const nextLevelNum = currentLevel === "easy" ? 2 : 3
    const levelStatus = await getLevelStatus("hopright", nextLevelNum)

    // Check if next level is unlocked
    if (levelStatus === "locked") {
      toast.error(`Level ${nextLevelNum} is locked! Complete the previous level to unlock it.`)
      return
    }

    if (currentLevel === "easy") {
      startLevel("medium")
    } else if (currentLevel === "medium") {
      startLevel("hard")
    }
  }

  // Restart game
  const handleRestart = () => {
    setGameState("start")
    setCurrentLevel("easy")
    setCurrentStage(0)
    setScore(0)
    setTotalScore(0)
    setAnswered(false)
    setSelectedAnswer(null)
    setIsHopping(false)
    setIsWrong(false)
    setCharacterPosition(0)
    setLevelScores({ easy: 0, medium: 0, hard: 0 })
    setShuffledStages([])
    setShuffledOptions([])
  }

  const handleBackToLevelSelect = () => {
    setGameState("levelSelect")
    setCurrentStage(0)
    setScore(0)
    setAnswered(false)
    setSelectedAnswer(null)
    setIsHopping(false)
    setIsWrong(false)
    setCharacterPosition(0)
    setHoveredIndex(null)
  }

  const handleLevelSelect = async (level: "easy" | "medium" | "hard") => {
    const levelNum = { easy: 1, medium: 2, hard: 3 }[level]
    const levelStatus = await getLevelStatus("hopright", levelNum)

    // Check if level is unlocked
    if (levelStatus === "locked") {
      toast.error(`This level is locked! Complete the previous level to unlock it.`)
      return
    }

    startLevel(level)
  }

  // Start Screen
  if (gameState === "start") {
    return (
      <NatureBackground>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          {/* Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="absolute top-4 left-4 z-30 bg-gray-700/80 hover:bg-gray-800 text-white font-bold px-4 py-2 rounded-full shadow-lg transition-all flex items-center gap-2 text-sm backdrop-blur-sm"
            >
              ← Back
            </button>
          )}

          {/* Mute Button - Top Right */}
          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 z-30 bg-gray-700/90 hover:bg-gray-800 text-white font-bold px-4 py-2 rounded-full shadow-lg transition-all text-xl backdrop-blur-sm"
            title={isMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>

          {/* Title */}
          <div className="text-center mb-8 animate-bounce-in">
            <div className="text-6xl mb-4">🐸</div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-lg mb-2">
              HopRight
            </h1>
            <p className="text-xl sm:text-2xl text-teal-100 drop-shadow-md font-semibold">
              Collocation Edition
            </p>
          </div>

          {/* Instructions Card */}
          <div className="bg-white/95 backdrop-blur rounded-3xl p-6 sm:p-8 max-w-lg shadow-2xl border-4 border-teal-400 animate-slide-up">
            <h2 className="text-2xl font-bold text-teal-700 mb-4 text-center">How to Play</h2>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 bg-teal-50 p-3 rounded-xl">
                <span className="text-2xl">🎯</span>
                <p className="text-gray-700">A target word or sentence appears above the frog</p>
              </div>
              <div className="flex items-start gap-3 bg-emerald-50 p-3 rounded-xl">
                <span className="text-2xl">👆</span>
                <p className="text-gray-700">Choose the correct collocation from 3 options</p>
              </div>
              <div className="flex items-start gap-3 bg-cyan-50 p-3 rounded-xl">
                <span className="text-2xl">⭐</span>
                <p className="text-gray-700">+10 point for correct answers, game continues either way</p>
              </div>
              <div className="flex items-start gap-3 bg-sky-50 p-3 rounded-xl">
                <span className="text-2xl">📈</span>
                <p className="text-gray-700">3 Levels: Easy → Medium → Hard (10 stages each)</p>
              </div>
            </div>

            <button
              onClick={() => setGameState("levelSelect")}
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl transition-all text-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              🐸 Start Hopping!
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes bounce-in {
            0% { opacity: 0; transform: scale(0.5) translateY(-50px); }
            60% { transform: scale(1.1) translateY(10px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-bounce-in {
            animation: bounce-in 0.8s ease-out;
          }
          .animate-slide-up {
            animation: slide-up 0.6s ease-out 0.3s both;
          }
        `}</style>
      </NatureBackground>
    )
  }

  // Level Selection Screen
  if (gameState === "levelSelect") {
    const levelConfig = [
      { level: "easy" as const, levelNum: 1, title: "Easy", subtitle: "10 Basic Collocations", emoji: "🐸", color: "from-green-400 to-green-600", status: levelStatuses[1] },
      { level: "medium" as const, levelNum: 2, title: "Medium", subtitle: "10 Intermediate Collocations", emoji: "🐰", color: "from-yellow-400 to-orange-500", status: levelStatuses[2] },
      { level: "hard" as const, levelNum: 3, title: "Hard", subtitle: "10 Advanced Collocations", emoji: "🦁", color: "from-red-400 to-red-600", status: levelStatuses[3] },
    ]

    return (
      <NatureBackground>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          {/* Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="absolute top-4 left-4 z-30 bg-gray-700/80 hover:bg-gray-800 text-white font-bold px-4 py-2 rounded-full shadow-lg transition-all flex items-center gap-2 text-sm backdrop-blur-sm"
            >
              ← Back
            </button>
          )}

          {/* Mute Button - Top Right */}
          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 z-30 bg-gray-700/90 hover:bg-gray-800 text-white font-bold px-4 py-2 rounded-full shadow-lg transition-all text-xl backdrop-blur-sm"
            title={isMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>

          {/* Title */}
          <div className="text-center mb-8 animate-bounce-in">
            <div className="text-6xl mb-4">🐸</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg mb-2">
              Select Level
            </h1>
          </div>

          {/* Level Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl w-full">
            {levelConfig.map((config, index) => {
              const isLocked = config.status === "locked"
              const isCompleted = config.status === "completed"

              return (
                <button
                  key={config.level}
                  onClick={() => handleLevelSelect(config.level)}
                  disabled={isLocked}
                  className={`
                    relative bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl border-4 border-teal-400
                    transform transition-all duration-300
                    ${isLocked ? "opacity-60 cursor-not-allowed grayscale" : "hover:scale-105 hover:shadow-xl cursor-pointer active:scale-95"}
                    animate-slide-up
                  `}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Lock Icon */}
                  {isLocked && (
                    <div className="absolute top-4 right-4 text-4xl">🔒</div>
                  )}

                  {/* Completed Badge */}
                  {isCompleted && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-lg">
                      ✓
                    </div>
                  )}

                  {/* Emoji */}
                  <div className="text-6xl mb-4">{config.emoji}</div>

                  {/* Title */}
                  <h3 className="text-3xl font-bold text-teal-700 mb-2">{config.title}</h3>
                  <p className="text-base text-gray-600 mb-6">{config.subtitle}</p>

                  {/* Difficulty Badge */}
                  <div className={`inline-block px-4 py-2 rounded-full text-white font-bold text-sm bg-gradient-to-r ${config.color}`}>
                    {isLocked ? "Locked" : isCompleted ? "Completed" : "Play"}
                  </div>

                  {/* Lock Message */}
                  {isLocked && (
                    <p className="text-xs text-gray-600 mt-3">
                      Complete {config.levelNum === 2 ? "Easy" : "Medium"} level to unlock
                    </p>
                  )}
                </button>
              )
            })}
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-white/90 backdrop-blur border-2 border-teal-400 rounded-xl p-4 max-w-2xl text-center space-y-2">
            <p className="text-teal-700 font-semibold">
              🎯 Complete each level to unlock the next one!
            </p>
            <p className="text-teal-600 text-xs sm:text-sm">
              ⓘ Only your first attempt at each level will be recorded for scoring
            </p>
          </div>
        </div>

        <style jsx>{`
          @keyframes bounce-in {
            0% { opacity: 0; transform: scale(0.5) translateY(-50px); }
            60% { transform: scale(1.1) translateY(10px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-bounce-in {
            animation: bounce-in 0.8s ease-out;
          }
          .animate-slide-up {
            animation: slide-up 0.6s ease-out both;
          }
        `}</style>
      </NatureBackground>
    )
  }

  // Level Complete Screen
  if (gameState === "levelComplete") {
    const nextLevel = currentLevel === "easy" ? "Medium" : "Hard"
    const stars = getStarRating(score, 10)

    return (
      <NatureBackground>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 max-w-md shadow-2xl border-4 border-teal-400 text-center animate-fade-in">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold text-teal-700 mb-2">
              {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} Level Complete!
            </h2>

            {/* Star Rating */}
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3].map((star) => (
                <span key={star} className={`text-4xl ${star <= stars ? "text-yellow-400" : "text-gray-300"}`}>
                  ⭐
                </span>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-100 to-purple-50 rounded-2xl p-6 my-6">
              <p className="text-gray-600 text-sm mb-2">Your Score</p>
              <p className="text-5xl font-bold text-blue-600">{score * 10} pts</p>
              <p className="text-sm font-semibold mt-2 text-blue-700">
                {currentLevel !== "hard" ? `🎊 Next level unlocked!` : '🏆 All Levels Complete!'}
              </p>
              {attemptInfo && !attemptInfo.isFirstAttempt && (
                <p className="text-xs sm:text-sm text-gray-600 mt-2">
                  ⓘ Only first attempt is recorded ({(attemptInfo.recordedScore ?? 0) * 10} pts)
                </p>
              )}
              {attemptInfo && attemptInfo.isFirstAttempt && (
                <p className="text-xs sm:text-sm text-green-600 mt-2">
                  ✓ First attempt - Score recorded!
                </p>
              )}
            </div>

            <p className="text-lg text-gray-600 mb-6">
              {currentLevel !== "hard" ? `Ready for ${nextLevel} level?` : 'Congratulations on completing all levels!'}
            </p>

            <div className="space-y-3">
              {currentLevel !== "hard" && (
                <button
                  onClick={handleNextLevel}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all text-lg shadow-lg"
                >
                  Continue to {nextLevel} →
                </button>
              )}
              <button
                onClick={() => handleLevelSelect(currentLevel)}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg"
              >
                Retry {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)}
              </button>
              <button
                onClick={handleBackToLevelSelect}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg"
              >
                Select Level
              </button>
              <button
                onClick={handleRestart}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl transition-all"
              >
                Main Menu
              </button>
            </div>
          </div>
        </div>
      </NatureBackground>
    )
  }

  // Game Complete Screen
  if (gameState === "gameComplete") {
    const finalScore = levelScores.easy + levelScores.medium + levelScores.hard + score

    return (
      <NatureBackground>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 max-w-md shadow-2xl border-4 border-yellow-400 text-center animate-fade-in">
            <div className="text-7xl mb-4 animate-bounce">🏆</div>
            <h2 className="text-3xl font-bold text-yellow-600 mb-2">Congratulations!</h2>
            <p className="text-gray-600 mb-4">You've completed all levels!</p>

            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 my-6">
              <p className="text-gray-600 text-sm mb-2">Final Score</p>
              <p className="text-5xl font-bold text-orange-600">{finalScore * 10} pts</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
              <p className="flex justify-between text-gray-700">
                <span>Easy Level:</span>
                <span className="font-bold text-green-600">{levelScores.easy * 10} pts</span>
              </p>
              <p className="flex justify-between text-gray-700">
                <span>Medium Level:</span>
                <span className="font-bold text-yellow-600">{levelScores.medium * 10} pts</span>
              </p>
              <p className="flex justify-between text-gray-700">
                <span>Hard Level:</span>
                <span className="font-bold text-red-600">{score * 10} pts</span>
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleBackToLevelSelect}
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all text-lg shadow-lg"
              >
                Select Level 🐸
              </button>
              <button
                onClick={handleRestart}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl transition-all text-lg"
              >
                Main Menu
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl transition-all"
                >
                  Back to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </NatureBackground>
    )
  }

  // Playing Screen
  return (
    <NatureBackground>
      <div className="min-h-screen flex flex-col p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <button
            onClick={handleRestart}
            className="bg-gray-700/80 hover:bg-gray-800 text-white font-bold px-4 py-2 rounded-full shadow-lg transition-all flex items-center gap-2 text-sm backdrop-blur-sm"
          >
            ← Back
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="bg-gray-700/90 hover:bg-gray-800 text-white font-bold px-3 py-2 rounded-full shadow-lg transition-all text-lg backdrop-blur-sm"
              title={isMuted ? "Unmute sounds" : "Mute sounds"}
            >
              {isMuted ? "🔇" : "🔊"}
            </button>

            <div className="bg-white/90 backdrop-blur rounded-full px-4 py-2 shadow-lg">
              <span className="text-teal-700 font-bold">⭐ {score * 10} pts</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <ProgressBar current={currentStage + 1} total={10} level={currentLevel} />
        </div>

        {/* 1-minute Reminder */}
        {showReminder && (
          <div className="fixed top-1/4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-4 rounded-2xl shadow-2xl animate-bounce z-50 text-center">
            <p className="text-lg font-bold">💪 You can do it!</p>
            <p className="text-sm">Help me hop right!</p>
          </div>
        )}

        {/* Main Game Area */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Speech Bubble with Target */}
          {stage && (
            <div className="mb-8">
              <SpeechBubble type={stage.type}>
                {stage.type === "word" ? (
                  <span className="uppercase tracking-wider">{stage.target}</span>
                ) : (
                  stage.sentence
                )}
              </SpeechBubble>
            </div>
          )}

          {/* Character */}
          <div className="mb-12" key={`frog-${currentStage}`}>
            <HoppingCharacter
              isHopping={isHopping}
              isWrong={isWrong}
              position={characterPosition}
              hoveredIndex={hoveredIndex}
              jumpKey={jumpAnimKey}
            />
          </div>

          {/* Choices */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 px-2">
            {shuffledOptions.map((option, index) => (
              <ChoiceButton
                key={index}
                label={option}
                onClick={() => handleAnswerClick(index)}
                disabled={answered}
                isCorrect={answered && index === correctAnswerIndex}
                isWrong={answered && selectedAnswer === index && index !== correctAnswerIndex}
                answered={answered}
                index={index}
                onMouseEnter={() => !answered && setHoveredIndex(index)}
                onMouseLeave={() => !answered && setHoveredIndex(null)}
              />
            ))}
          </div>

          {/* Feedback & Next Button */}
          {answered && (
            <div className="text-center animate-fade-in">
              {selectedAnswer === correctAnswerIndex ? (
                <p className="text-2xl font-bold text-green-500 mb-4 drop-shadow-lg">
                  ✓ Correct! Great job!
                </p>
              ) : (
                <div className="mb-4">
                  <p className="text-xl font-bold text-red-500 drop-shadow-lg mb-2">
                    ✗ Not quite right!
                  </p>
                  <p className="text-white bg-black/30 backdrop-blur px-4 py-2 rounded-lg">
                    Correct answer: <span className="font-bold text-green-300">{shuffledOptions[correctAnswerIndex]}</span>
                  </p>
                </div>
              )}

              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all text-lg shadow-lg"
              >
                {currentStage < 9 ? "Next Stage →" : "Complete Level →"}
              </button>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.4s ease-out;
          }
        `}</style>
      </div>
    </NatureBackground>
  )
}
