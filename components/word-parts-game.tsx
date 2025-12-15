"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { saveLevelProgress, getLevelStatus, getStarRating, MIN_SCORE_TO_PASS } from "@/lib/game-progress"

// Game Data Types
interface Level1Item {
  target: string
  prefix: string
  base: string
  suffix: string
}

interface Level2Item {
  word: string
  isDerived: boolean
}

interface Level3Item {
  sentence: string
  baseWord: string
  derivedForms: string[]
  inflectedForms: string[]
  correctAnswer: string
  correctType: "derived" | "inflected"
}

// Game Data
const gameData = {
  level1: [
    { target: "indefinitely", prefix: "in-", base: "definite", suffix: "-ly" },
    { target: "commitment", prefix: "none", base: "commit", suffix: "-ment" },
    { target: "dealer", prefix: "none", base: "deal", suffix: "-er" },
    { target: "wanted", prefix: "none", base: "want", suffix: "-ed" },
    { target: "imprisonment", prefix: "im-", base: "prison", suffix: "-ment" },
    { target: "appearing", prefix: "none", base: "appear", suffix: "-ing" },
    { target: "unfortunately", prefix: "un-", base: "fortunate", suffix: "-ly" },
    { target: "benches", prefix: "none", base: "bench", suffix: "-es" },
    { target: "bottomless", prefix: "none", base: "bottom", suffix: "-less" },
    { target: "counters", prefix: "none", base: "counter", suffix: "-s" },
  ] as Level1Item[],
  level2: [
    { word: "taken", isDerived: false },
    { word: "childlike", isDerived: true },
    { word: "ninth", isDerived: true },
    { word: "doors", isDerived: false },
    { word: "easiest", isDerived: false },
    { word: "looking", isDerived: false },
    { word: "Chomy's mother", isDerived: false },
    { word: "dealer", isDerived: true },
    { word: "nonhuman", isDerived: true },
    { word: "clearer", isDerived: false },
  ] as Level2Item[],
  level3: [
    {
      sentence: "There was a clear ________ between the students' skills and the difficulty of the test.",
      baseWord: "proportion",
      derivedForms: ["disproportion", "proportional"],
      inflectedForms: ["proportions", "proportioned"],
      correctAnswer: "disproportion",
      correctType: "derived",
    },
    {
      sentence: "The student was ________ her answer when the teacher asked for clarification.",
      baseWord: "justify",
      derivedForms: ["unjustified", "justifiable"],
      inflectedForms: ["justifying", "justified"],
      correctAnswer: "justifying",
      correctType: "inflected",
    },
    {
      sentence: "Alex found a ________ friend to help him fix his bike.",
      baseWord: "rely",
      derivedForms: ["reliable", "reliance"],
      inflectedForms: ["relied", "relying"],
      correctAnswer: "reliable",
      correctType: "derived",
    },
    {
      sentence: "Francine ________ for the online workshop before the deadline.",
      baseWord: "register",
      derivedForms: ["registration", "deregister"],
      inflectedForms: ["registering", "registered"],
      correctAnswer: "registered",
      correctType: "inflected",
    },
    {
      sentence: "There was an excellent ________ between the students which made their dance performance look seamless.",
      baseWord: "coordinate",
      derivedForms: ["coordination", "coordinator"],
      inflectedForms: ["coordinates", "coordinating"],
      correctAnswer: "coordination",
      correctType: "derived",
    },
    {
      sentence: "The professor ________ that most students would finish the activity on time but they didn't.",
      baseWord: "predict",
      derivedForms: ["predictions", "predictable"],
      inflectedForms: ["predicted", "predicting"],
      correctAnswer: "predicted",
      correctType: "inflected",
    },
    {
      sentence: "The team is ________ their new product on social media.",
      baseWord: "promote",
      derivedForms: ["promotion", "promoters"],
      inflectedForms: ["promoting", "promotes"],
      correctAnswer: "promoting",
      correctType: "inflected",
    },
    {
      sentence: "The rooftop of the building was ________ due to safety regulations.",
      baseWord: "access",
      derivedForms: ["inaccessible", "accessible"],
      inflectedForms: ["accessed", "accessing"],
      correctAnswer: "inaccessible",
      correctType: "derived",
    },
    {
      sentence: "The argument between the neighbors was ________ after a calm discussion.",
      baseWord: "resolve",
      derivedForms: ["resolution", "unresolved"],
      inflectedForms: ["resolving", "resolved"],
      correctAnswer: "resolved",
      correctType: "inflected",
    },
    {
      sentence: "The park ________ its natural beauty despite urban development nearby.",
      baseWord: "retain",
      derivedForms: ["retention", "retentive"],
      inflectedForms: ["retains", "retaining"],
      correctAnswer: "retains",
      correctType: "inflected",
    },
  ] as Level3Item[],
}

// Shuffle function
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Classroom Background Component
function ClassroomBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Classroom wall */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-100 via-amber-50 to-orange-100" />

      {/* Chalkboard */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl h-32 sm:h-40 md:h-48 bg-gradient-to-b from-emerald-800 via-emerald-900 to-emerald-950 rounded-lg shadow-2xl border-4 sm:border-6 md:border-8 border-amber-700">
        <div className="absolute inset-2 border-2 border-amber-600/30 rounded" />
        {/* Chalk dust effect */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_30%,white_1px,transparent_1px),radial-gradient(circle_at_80%_70%,white_1px,transparent_1px)] bg-[length:30px_30px]" />
        {/* Chalk tray */}
        <div className="absolute -bottom-2 sm:-bottom-3 left-4 right-4 h-3 sm:h-4 bg-amber-700 rounded-b-lg shadow-lg" />
      </div>

      {/* Clock */}
      <div className="absolute top-8 right-8 w-16 h-16 bg-white rounded-full shadow-lg border-4 border-amber-700 hidden md:flex items-center justify-center">
        <div className="text-2xl">🕐</div>
      </div>

      {/* Bulletin board */}
      <div className="absolute top-8 left-8 w-20 h-24 bg-amber-600 rounded shadow-lg border-4 border-amber-800 hidden md:block">
        <div className="absolute top-2 left-2 w-4 h-4 bg-red-500 rounded-full" />
        <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full" />
        <div className="absolute bottom-2 left-3 w-3 h-3 bg-yellow-400 rounded-full" />
      </div>

      {/* Wooden desk surface at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-800 via-amber-700 to-amber-600 shadow-inner">
        {/* Wood grain texture */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-amber-900"
              style={{
                top: `${12 + i * 12}%`,
                left: 0,
                right: 0,
                transform: `rotate(${Math.random() * 0.5 - 0.25}deg)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

// Character Hand Component
function CharacterHand({ isWriting, emotion }: { isWriting: boolean; emotion: "neutral" | "happy" | "sad" }) {
  return (
    <div className="fixed bottom-2 left-2 sm:bottom-4 sm:left-4 z-50 flex items-end gap-1 sm:gap-2">
      {/* Hand holding pencil */}
      <div className={`relative transition-all duration-300 ${isWriting ? "animate-pencil-write" : ""}`}>
        <div className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl transform -scale-x-100">
          ✍️
        </div>
        {/* Emotion bubble */}
        {emotion !== "neutral" && (
          <div className="absolute -top-6 sm:-top-8 -right-1 sm:-right-2 text-xl sm:text-2xl animate-pop-in">
            {emotion === "happy" ? "⭐" : "💫"}
          </div>
        )}
      </div>

      {/* Speech bubble */}
      <div className="bg-white rounded-2xl px-2 py-1.5 sm:px-3 sm:py-2 shadow-lg border-2 border-amber-300 max-w-[120px] sm:max-w-[150px] animate-fade-in-up">
        <p className="text-[10px] xs:text-xs sm:text-sm text-gray-700 font-medium">
          {isWriting ? "Writing..." : emotion === "happy" ? "Great job!" : emotion === "sad" ? "Try again!" : "Drag & Drop!"}
        </p>
      </div>

      <style jsx>{`
        @keyframes pencil-write {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          25% { transform: rotate(-5deg) translateY(-2px); }
          50% { transform: rotate(5deg) translateY(0); }
          75% { transform: rotate(-3deg) translateY(-1px); }
        }
        .animate-pencil-write { animation: pencil-write 0.3s ease-in-out infinite; }
        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in { animation: pop-in 0.4s ease-out; }
        @keyframes fade-in-up {
          0% { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out; }
      `}</style>
    </div>
  )
}

// Draggable Word Segment Component for Level 1
function DraggableSegment({
  text,
  type,
  onDragStart,
  onDragEnd,
  isDragging,
  isPlaced
}: {
  text: string
  type: "prefix" | "base" | "suffix"
  onDragStart: () => void
  onDragEnd: () => void
  isDragging: boolean
  isPlaced: boolean
}) {
  // Use neutral color for all segments to avoid giving away the answer
  const neutralColor = "bg-amber-50 border-amber-300 text-gray-800"

  return (
    <div
      draggable={!isPlaced}
      onDragStart={(e) => {
        if (!isPlaced) {
          onDragStart()
          e.dataTransfer.effectAllowed = "move"
        }
      }}
      onDragEnd={onDragEnd}
      className={`
        px-2 py-1.5 xs:px-3 xs:py-2 sm:px-4 sm:py-3 rounded-lg border-2 font-bold text-sm xs:text-base sm:text-lg md:text-xl
        transition-all duration-200 shadow-md
        ${neutralColor}
        ${isDragging ? "opacity-50 scale-95" : ""}
        ${isPlaced ? "opacity-30 cursor-not-allowed" : "cursor-grab active:cursor-grabbing hover:scale-105"}
      `}
    >
      {text}
    </div>
  )
}

// Notebook Component for drag targets
function Notebook({
  label,
  color,
  onDrop,
  onDragOver,
  placedContent,
  validationState,
  showValidation
}: {
  label: string
  color: string
  onDrop: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  placedContent: string | null
  validationState?: "correct" | "wrong" | null
  showValidation: boolean
}) {
  const colorClasses: Record<string, { bg: string; border: string; text: string; ring: string }> = {
    yellow: { bg: "bg-yellow-100", border: "border-yellow-500", text: "text-yellow-700", ring: "ring-yellow-400" },
    green: { bg: "bg-green-100", border: "border-green-500", text: "text-green-700", ring: "ring-green-400" },
    blue: { bg: "bg-blue-100", border: "border-blue-500", text: "text-blue-700", ring: "ring-blue-400" },
    purple: { bg: "bg-purple-100", border: "border-purple-500", text: "text-purple-700", ring: "ring-purple-400" },
    pink: { bg: "bg-pink-100", border: "border-pink-500", text: "text-pink-700", ring: "ring-pink-400" },
  }

  const colors = colorClasses[color] || colorClasses.yellow

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      className={`
        relative w-24 h-32 xs:w-28 xs:h-36 sm:w-36 sm:h-44 md:w-40 md:h-52 rounded-lg shadow-xl transition-all duration-300
        ${colors.bg} border-2 sm:border-3 md:border-4
        ${showValidation && validationState === "correct" ? "border-green-500 ring-2 sm:ring-4 ring-green-300" : ""}
        ${showValidation && validationState === "wrong" ? "border-red-500 ring-2 sm:ring-4 ring-red-300 animate-shake" : ""}
        ${!showValidation ? colors.border : ""}
        hover:scale-105
      `}
    >
      {/* Notebook spiral */}
      <div className="absolute -left-1 sm:-left-2 top-2 sm:top-4 bottom-2 sm:bottom-4 w-2 sm:w-4 flex flex-col justify-center gap-1 sm:gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 rounded-full border border-gray-500 sm:border-2" />
        ))}
      </div>

      {/* Notebook lines */}
      <div className="absolute inset-2 sm:inset-4 left-4 sm:left-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-3 sm:h-4 border-b border-blue-200/50" />
        ))}
      </div>

      {/* Label tab */}
      <div className={`absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-t-lg ${colors.bg} border border-b-0 sm:border-2 ${colors.border}`}>
        <span className={`text-[10px] xs:text-xs sm:text-sm font-bold ${colors.text}`}>{label}</span>
      </div>

      {/* Placed content */}
      {placedContent && (
        <div className="absolute inset-0 flex items-center justify-center px-2 sm:px-3">
          <div
            className={`${colors.text} font-bold text-xs xs:text-sm sm:text-base md:text-lg animate-write-in text-center leading-tight`}
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            {placedContent}
          </div>
        </div>
      )}

      {/* Drop zone indicator */}
      {!placedContent && (
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="text-3xl">📝</div>
        </div>
      )}

      {/* Validation icons */}
      {showValidation && validationState && (
        <div className="absolute -top-4 -right-4 text-3xl animate-bounce-in">
          {validationState === "correct" ? "✅" : "❌"}
        </div>
      )}

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          20% { transform: translateX(-5px) rotate(-2deg); }
          40% { transform: translateX(5px) rotate(2deg); }
          60% { transform: translateX(-5px) rotate(-2deg); }
          80% { transform: translateX(5px) rotate(2deg); }
        }
        .animate-shake { animation: shake 0.5s ease-out; }
        @keyframes write-in {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-write-in { animation: write-in 0.3s ease-out; }
        @keyframes bounce-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        .animate-bounce-in { animation: bounce-in 0.4s ease-out; }
      `}</style>
    </div>
  )
}

// Draggable Sticky Note for Level 2
function DraggableStickyNote({
  word,
  color,
  onDragStart,
  onDragEnd,
  isDragging,
  isPlaced
}: {
  word: string
  color: string
  onDragStart: () => void
  onDragEnd: () => void
  isDragging: boolean
  isPlaced: boolean
}) {
  const colorClasses: Record<string, string> = {
    yellow: "bg-yellow-200 shadow-yellow-300",
    pink: "bg-pink-200 shadow-pink-300",
    blue: "bg-blue-200 shadow-blue-300",
    green: "bg-green-200 shadow-green-300",
  }

  return (
    <div
      draggable={!isPlaced}
      onDragStart={(e) => {
        if (!isPlaced) {
          onDragStart()
          e.dataTransfer.effectAllowed = "move"
        }
      }}
      onDragEnd={onDragEnd}
      className={`
        relative w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 p-2 sm:p-3 rounded-sm shadow-lg
        transition-all duration-300
        ${colorClasses[color] || colorClasses.yellow}
        ${isDragging ? "opacity-50 scale-90" : ""}
        ${isPlaced ? "opacity-0 pointer-events-none" : "cursor-grab active:cursor-grabbing hover:scale-105 hover:-rotate-3"}
      `}
      style={{
        transform: isPlaced ? "scale(0)" : `rotate(${Math.random() * 6 - 3}deg)`,
        boxShadow: "4px 4px 10px rgba(0,0,0,0.2)",
      }}
    >
      {/* Tape at top */}
      <div className="absolute -top-1.5 sm:-top-2 left-1/2 -translate-x-1/2 w-6 h-3 sm:w-8 sm:h-4 bg-amber-200/80 rounded-sm" />

      {/* Word */}
      <div className="h-full flex items-center justify-center px-1">
        <span
          className="text-gray-800 font-semibold text-center text-xs xs:text-sm sm:text-base leading-tight"
          style={{ fontFamily: "'Caveat', cursive" }}
        >
          {word}
        </span>
      </div>
    </div>
  )
}

// Draggable Word Option for Level 3
function DraggableWord({
  word,
  onDragStart,
  onDragEnd,
  isDragging,
  isPlaced
}: {
  word: string
  onDragStart: () => void
  onDragEnd: () => void
  isDragging: boolean
  isPlaced: boolean
}) {
  return (
    <div
      draggable={!isPlaced}
      onDragStart={(e) => {
        if (!isPlaced) {
          onDragStart()
          e.dataTransfer.effectAllowed = "move"
        }
      }}
      onDragEnd={onDragEnd}
      className={`
        px-3 py-2 xs:px-4 xs:py-2.5 sm:py-3 rounded-xl font-semibold text-sm xs:text-base transition-all shadow-md
        border-2 border-amber-200
        ${isDragging ? "opacity-50 scale-90" : ""}
        ${isPlaced ? "opacity-30 cursor-not-allowed bg-gray-200 text-gray-500" : "bg-white hover:bg-amber-50 text-gray-700 cursor-grab active:cursor-grabbing hover:scale-105"}
      `}
    >
      {word}
    </div>
  )
}

// Progress Indicator
function ProgressIndicator({ current, total, level }: { current: number; total: number; level: number }) {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-white/90 backdrop-blur rounded-full px-4 py-2 shadow-lg">
        <span className="text-amber-700 font-bold">Level {level}</span>
      </div>
      <div className="flex gap-1">
        {[...Array(total)].map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i < current ? "bg-green-500 scale-100" : i === current ? "bg-amber-400 scale-125 animate-pulse" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// Sound Effects
function playWritingSound() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1)
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
  } catch (e) {
    console.log("Audio not supported")
  }
}

function playWrongSound() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3)
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
  } catch (e) {
    console.log("Audio not supported")
  }
}

function playSuccessSound() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const notes = [523.25, 659.25, 783.99]
    notes.forEach((freq, i) => {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
      }, i * 100)
    })
  } catch (e) {
    console.log("Audio not supported")
  }
}

interface WordPartsGameProps {
  onBack?: () => void
}

export default function WordPartsGame({ onBack }: WordPartsGameProps) {
  const [gameState, setGameState] = useState<"start" | "levelSelect" | "playing" | "levelComplete" | "gameComplete">("start")
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3>(1)
  const [currentItem, setCurrentItem] = useState(0)
  const [score, setScore] = useState(0)
  const [levelScores, setLevelScores] = useState({ 1: 0, 2: 0, 3: 0 })
  const [submitted, setSubmitted] = useState(false)
  const [isWriting, setIsWriting] = useState(false)
  const [handEmotion, setHandEmotion] = useState<"neutral" | "happy" | "sad">("neutral")

  // Level 1 state - drag and drop with manual word splitting
  const [draggingSegment, setDraggingSegment] = useState<"prefix" | "base" | "suffix" | null>(null)
  const [placements, setPlacements] = useState<{
    prefix: string | null
    base: string | null
    suffix: string | null
  }>({ prefix: null, base: null, suffix: null })
  const [splitPoints, setSplitPoints] = useState<number[]>([]) // Positions where user clicked to split
  const [userSegments, setUserSegments] = useState<{ prefix: string; base: string; suffix: string } | null>(null) // Segments created by user
  const [splitError, setSplitError] = useState(false) // Track if split is wrong

  // Level 2 state - drag and drop
  const [draggingStickyNote, setDraggingStickyNote] = useState(false)
  const [stickyNotePlacement, setStickyNotePlacement] = useState<"derived" | "inflected" | null>(null)

  // Level 3 state - drag and drop
  const [draggingWord, setDraggingWord] = useState<string | null>(null)
  const [sentenceBlank, setSentenceBlank] = useState<string | null>(null)

  // Shuffled data
  const [shuffledLevel1, setShuffledLevel1] = useState<Level1Item[]>([])
  const [shuffledLevel2, setShuffledLevel2] = useState<Level2Item[]>([])
  const [shuffledLevel3, setShuffledLevel3] = useState<Level3Item[]>([])

  // Initialize level data
  const initializeLevel = useCallback((level: 1 | 2 | 3) => {
    setCurrentLevel(level)
    setCurrentItem(0)
    setScore(0)
    setSubmitted(false)
    setHandEmotion("neutral")
    setPlacements({ prefix: null, base: null, suffix: null })
    setSplitPoints([])
    setUserSegments(null)
    setSplitError(false)
    setStickyNotePlacement(null)
    setSentenceBlank(null)
    setDraggingSegment(null)
    setDraggingStickyNote(false)
    setDraggingWord(null)

    if (level === 1) {
      setShuffledLevel1(shuffleArray(gameData.level1))
    } else if (level === 2) {
      setShuffledLevel2(shuffleArray(gameData.level2))
    } else {
      setShuffledLevel3(shuffleArray(gameData.level3))
    }

    setGameState("playing")
  }, [])

  // Handle Level 1 submission
  const handleLevel1Submit = () => {
    const item = shuffledLevel1[currentItem]
    // Strip hyphens from stored values for comparison
    const correctPrefix = item.prefix === "none" ? null : item.prefix.replace(/-/g, "")
    const correctBase = item.base
    const correctSuffix = item.suffix.replace(/-/g, "")

    const isCorrect =
      placements.prefix === correctPrefix &&
      placements.base === correctBase &&
      placements.suffix === correctSuffix

    setSubmitted(true)
    setIsWriting(true)

    if (isCorrect) {
      playSuccessSound()
      setScore(s => s + 1)
      setHandEmotion("happy")
    } else {
      playWrongSound()
      setHandEmotion("sad")
    }

    setTimeout(() => {
      setIsWriting(false)
    }, 500)
  }

  // Handle Level 2 submission
  const handleLevel2Submit = () => {
    const item = shuffledLevel2[currentItem]
    const isCorrect =
      (stickyNotePlacement === "derived" && item.isDerived) ||
      (stickyNotePlacement === "inflected" && !item.isDerived)

    setSubmitted(true)
    setIsWriting(true)

    if (isCorrect) {
      playSuccessSound()
      setScore(s => s + 1)
      setHandEmotion("happy")
    } else {
      playWrongSound()
      setHandEmotion("sad")
    }

    setTimeout(() => {
      setIsWriting(false)
    }, 500)
  }

  // Handle Level 3 submission
  const handleLevel3Submit = () => {
    const item = shuffledLevel3[currentItem]
    const isCorrect = sentenceBlank === item.correctAnswer

    setSubmitted(true)
    setIsWriting(true)

    if (isCorrect) {
      playSuccessSound()
      setScore(s => s + 1)
      setHandEmotion("happy")
    } else {
      playWrongSound()
      setHandEmotion("sad")
    }

    setTimeout(() => {
      setIsWriting(false)
    }, 500)
  }

  // Handle next item
  const handleNext = () => {
    if (currentItem < 9) {
      setCurrentItem(prev => prev + 1)
      setSubmitted(false)
      setHandEmotion("neutral")
      setPlacements({ prefix: null, base: null, suffix: null })
      setSplitPoints([])
      setUserSegments(null)
      setSplitError(false)
      setStickyNotePlacement(null)
      setSentenceBlank(null)
      setDraggingSegment(null)
      setDraggingStickyNote(false)
      setDraggingWord(null)
    } else {
      // Level complete - save progress
      setLevelScores(prev => ({ ...prev, [currentLevel]: score }))
      saveLevelProgress("wordstudyjournal", currentLevel, score, 10)

      if (currentLevel < 3) {
        setGameState("levelComplete")
      } else {
        setGameState("gameComplete")
      }
    }
  }

  // Handle next level
  const handleNextLevel = () => {
    const nextLevel = (currentLevel + 1) as 1 | 2 | 3
    const levelStatus = getLevelStatus("wordstudyjournal", nextLevel)

    // Check if next level is unlocked
    if (levelStatus === "locked") {
      alert(`Level ${nextLevel} is locked! You need to score at least ${MIN_SCORE_TO_PASS}/10 in Level ${currentLevel} to unlock it.`)
      return
    }

    initializeLevel(nextLevel)
  }

  // Restart game
  const handleRestart = () => {
    setGameState("start")
    setCurrentLevel(1)
    setScore(0)
    setLevelScores({ 1: 0, 2: 0, 3: 0 })
  }

  const handleBackToLevelSelect = () => {
    setGameState("levelSelect")
    setCurrentItem(0)
    setScore(0)
    setSubmitted(false)
    setHandEmotion("neutral")
    setPlacements({ prefix: null, base: null, suffix: null })
    setSplitPoints([])
    setUserSegments(null)
    setSplitError(false)
    setStickyNotePlacement(null)
    setSentenceBlank(null)
    setDraggingSegment(null)
    setDraggingStickyNote(false)
    setDraggingWord(null)
  }

  const handleLevelSelect = (level: 1 | 2 | 3) => {
    const levelStatus = getLevelStatus("wordstudyjournal", level)

    // Check if level is unlocked
    if (levelStatus === "locked") {
      alert(`Level ${level} is locked! You need to score at least ${MIN_SCORE_TO_PASS}/10 in Level ${level - 1} to unlock it.`)
      return
    }

    initializeLevel(level)
  }

  // Check if all items are placed (for enabling Submit button)
  const allPlacedLevel1 = () => {
    const item = shuffledLevel1[currentItem]
    if (!item || !userSegments) return false // Must have created segments first

    // Count how many segments should be placed
    const needsPrefix = item.prefix !== "none"
    const totalSegments = needsPrefix ? 3 : 2 // prefix + base + suffix OR just base + suffix

    // Count how many segments have been placed (in any notebook)
    const placedCount = Object.values(placements).filter(p => p !== null).length

    return placedCount === totalSegments
  }

  const allPlacedLevel2 = () => stickyNotePlacement !== null
  const allPlacedLevel3 = () => sentenceBlank !== null

  // Start Screen
  if (gameState === "start") {
    return (
      <ClassroomBackground>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-56">
          {/* Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="absolute top-4 left-4 z-30 bg-amber-700/90 hover:bg-amber-800 text-white font-bold px-4 py-2 rounded-full shadow-lg transition-all flex items-center gap-2 text-sm backdrop-blur-sm"
            >
              ← Back
            </button>
          )}

          {/* Title on Chalkboard */}
          <div className="absolute top-8 sm:top-10 md:top-12 left-1/2 -translate-x-1/2 text-center z-20 px-4 w-full">
            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg mb-1 sm:mb-2" style={{ fontFamily: "'Permanent Marker', cursive" }}>
              📓 The Word Study Journal
            </h1>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl text-emerald-200 drop-shadow-md">
              Master Word Parts & Affixes!
            </p>
          </div>

          {/* Instructions Card */}
          <div className="bg-white/95 backdrop-blur rounded-2xl sm:rounded-3xl p-4 xs:p-5 sm:p-6 md:p-8 max-w-2xl w-full mx-4 shadow-2xl border-2 sm:border-4 border-amber-400 animate-fade-in-up mt-4 sm:mt-6 md:mt-8">
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-amber-700 mb-4 sm:mb-6 text-center flex items-center justify-center gap-2">
              <span>📖</span> How to Play
            </h2>

            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="flex items-start gap-2 sm:gap-3 bg-yellow-50 p-3 sm:p-4 rounded-xl border border-yellow-200 sm:border-2">
                <span className="text-xl sm:text-2xl flex-shrink-0">✏️</span>
                <div>
                  <p className="font-bold text-yellow-700 text-sm sm:text-base">Level 1: Deconstruction</p>
                  <p className="text-gray-600 text-xs sm:text-sm"><strong>Drag</strong> word parts into the correct notebooks (Prefix, Base, Suffix). Place all parts, then click Submit!</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 bg-pink-50 p-3 sm:p-4 rounded-xl border border-pink-200 sm:border-2">
                <span className="text-xl sm:text-2xl flex-shrink-0">📝</span>
                <div>
                  <p className="font-bold text-pink-700 text-sm sm:text-base">Level 2: Classification</p>
                  <p className="text-gray-600 text-xs sm:text-sm"><strong>Drag</strong> sticky notes to Derived Form or Inflected Form notebook, then Submit!</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 bg-blue-50 p-3 sm:p-4 rounded-xl border border-blue-200 sm:border-2">
                <span className="text-xl sm:text-2xl flex-shrink-0">📚</span>
                <div>
                  <p className="font-bold text-blue-700 text-sm sm:text-base">Level 3: Application</p>
                  <p className="text-gray-600 text-xs sm:text-sm"><strong>Drag</strong> the correct word into the sentence blank, then Submit!</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-3 sm:p-4 rounded-xl border border-amber-300 sm:border-2 mb-4 sm:mb-6">
              <p className="text-center text-amber-700 text-xs sm:text-sm">
                <strong>💡 Tip:</strong> You can drag items anywhere! After placing all items, click Submit to see if you're correct. Green = correct ✅, Red = wrong ❌
              </p>
            </div>

            <button
              onClick={() => setGameState("levelSelect")}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all text-base sm:text-lg md:text-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              ✏️ Start Learning!
            </button>
          </div>

          <CharacterHand isWriting={false} emotion="neutral" />
        </div>

        <style jsx>{`
          @keyframes fade-in-up {
            0% { transform: translateY(30px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        `}</style>
      </ClassroomBackground>
    )
  }

  // Level Selection Screen
  if (gameState === "levelSelect") {
    const level1Status = getLevelStatus("wordstudyjournal", 1)
    const level2Status = getLevelStatus("wordstudyjournal", 2)
    const level3Status = getLevelStatus("wordstudyjournal", 3)

    const levelConfig = [
      { level: 1, title: "Level 1", subtitle: "Deconstruction", emoji: "✏️", color: "from-yellow-400 to-yellow-600", status: level1Status },
      { level: 2, title: "Level 2", subtitle: "Classification", emoji: "📝", color: "from-pink-400 to-pink-600", status: level2Status },
      { level: 3, title: "Level 3", subtitle: "Application", emoji: "📚", color: "from-blue-400 to-blue-600", status: level3Status },
    ]

    return (
      <ClassroomBackground>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-56">
          {/* Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="absolute top-4 left-4 z-30 bg-amber-700/90 hover:bg-amber-800 text-white font-bold px-4 py-2 rounded-full shadow-lg transition-all flex items-center gap-2 text-sm backdrop-blur-sm"
            >
              ← Back
            </button>
          )}

          {/* Title on Chalkboard */}
          <div className="absolute top-8 sm:top-10 md:top-12 left-1/2 -translate-x-1/2 text-center z-20 px-4">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2" style={{ fontFamily: "'Permanent Marker', cursive" }}>
              Select Level
            </h1>
          </div>

          {/* Level Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl w-full mt-4 sm:mt-6 md:mt-8 px-4">
            {levelConfig.map((config, index) => {
              const isLocked = config.status === "locked"
              const isCompleted = config.status === "completed"

              return (
                <button
                  key={config.level}
                  onClick={() => handleLevelSelect(config.level as 1 | 2 | 3)}
                  disabled={isLocked}
                  className={`
                    relative bg-white/95 backdrop-blur rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl border-2 sm:border-4 border-amber-400
                    transform transition-all duration-300
                    ${isLocked ? "opacity-60 cursor-not-allowed" : "hover:scale-105 hover:shadow-xl cursor-pointer active:scale-95"}
                    animate-pop-in
                  `}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Lock Icon */}
                  {isLocked && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-2xl sm:text-3xl md:text-4xl">🔒</div>
                  )}

                  {/* Completed Badge */}
                  {isCompleted && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-green-500 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center text-lg sm:text-xl md:text-2xl shadow-lg">
                      ✓
                    </div>
                  )}

                  {/* Emoji */}
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">{config.emoji}</div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-700 mb-1 sm:mb-2">{config.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{config.subtitle}</p>

                  {/* Difficulty Badge */}
                  <div className={`inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-white font-bold text-xs sm:text-sm bg-gradient-to-r ${config.color}`}>
                    {isLocked ? "Locked" : isCompleted ? "Completed" : "Play"}
                  </div>

                  {/* Lock Message */}
                  {isLocked && (
                    <p className="text-[10px] sm:text-xs text-gray-600 mt-2 sm:mt-3">
                      Complete Level {config.level - 1} with {MIN_SCORE_TO_PASS}/10 to unlock
                    </p>
                  )}
                </button>
              )
            })}
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-amber-50/90 backdrop-blur border-2 border-amber-400 rounded-xl p-4 max-w-2xl text-center">
            <p className="text-amber-700 font-semibold">
              🎯 Complete each level with at least {MIN_SCORE_TO_PASS}/10 to unlock the next one!
            </p>
          </div>

          <CharacterHand isWriting={false} emotion="neutral" />
        </div>

        <style jsx>{`
          @keyframes pop-in {
            0% { transform: scale(0.5); opacity: 0; }
            60% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-pop-in { animation: pop-in 0.5s ease-out both; }
        `}</style>
      </ClassroomBackground>
    )
  }

  // Level Complete Screen
  if (gameState === "levelComplete") {
    const levelNames = { 1: "Deconstruction", 2: "Classification", 3: "Application" }
    const nextLevelNum = (currentLevel + 1) as 2 | 3
    const passed = score >= MIN_SCORE_TO_PASS
    const stars = getStarRating(score, 10)

    return (
      <ClassroomBackground>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-56">
          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 max-w-md shadow-2xl border-4 border-green-400 text-center animate-pop-in">
            <div className="text-6xl mb-4 animate-bounce">{passed ? "🎉" : "😔"}</div>
            <h2 className="text-3xl font-bold text-green-700 mb-2">
              Level {currentLevel} Complete!
            </h2>
            <p className="text-gray-600 mb-4">{levelNames[currentLevel]}</p>

            {/* Star Rating */}
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3].map((star) => (
                <span key={star} className={`text-4xl ${star <= stars ? "text-yellow-400" : "text-gray-300"}`}>
                  ⭐
                </span>
              ))}
            </div>

            <div className={`bg-gradient-to-r rounded-2xl p-6 my-6 ${passed ? "from-green-100 to-emerald-100" : "from-red-100 to-red-50"}`}>
              <p className="text-gray-600 text-sm mb-2">Your Score</p>
              <p className={`text-5xl font-bold ${passed ? "text-green-600" : "text-red-600"}`}>{score}/10</p>
              <p className={`text-sm font-semibold mt-2 ${passed ? "text-green-700" : "text-red-700"}`}>
                {passed ? `🎊 Level ${nextLevelNum} Unlocked!` : `Need ${MIN_SCORE_TO_PASS}/10 to unlock next level`}
              </p>
            </div>

            {!passed && (
              <p className="text-sm text-gray-700 mb-6 bg-amber-50 p-3 rounded-lg border border-amber-300">
                Keep trying! You need at least {MIN_SCORE_TO_PASS} correct answers to unlock Level {nextLevelNum}.
              </p>
            )}

            {passed && (
              <p className="text-lg text-gray-600 mb-6">Ready for Level {nextLevelNum}: {levelNames[nextLevelNum]}?</p>
            )}

            <div className="space-y-3">
              {passed && (
                <button
                  onClick={handleNextLevel}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all text-lg shadow-lg"
                >
                  Continue to Level {nextLevelNum} →
                </button>
              )}
              <button
                onClick={() => handleLevelSelect(currentLevel)}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg"
              >
                Retry Level {currentLevel}
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

          <CharacterHand isWriting={false} emotion={passed ? "happy" : "neutral"} />
        </div>

        <style jsx>{`
          @keyframes pop-in {
            0% { transform: scale(0.5); opacity: 0; }
            60% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-pop-in { animation: pop-in 0.5s ease-out; }
        `}</style>
      </ClassroomBackground>
    )
  }

  // Game Complete Screen
  if (gameState === "gameComplete") {
    const finalScore = levelScores[1] + levelScores[2] + score

    return (
      <ClassroomBackground>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-56">
          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 max-w-md shadow-2xl border-4 border-yellow-400 text-center animate-pop-in">
            <div className="text-7xl mb-4 animate-bounce">🏆</div>
            <h2 className="text-3xl font-bold text-yellow-600 mb-2">Congratulations!</h2>
            <p className="text-gray-600 mb-4">You've completed all levels!</p>

            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 my-6">
              <p className="text-gray-600 text-sm mb-2">Final Score</p>
              <p className="text-5xl font-bold text-orange-600">{finalScore}/30</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
              <p className="flex justify-between text-gray-700">
                <span>Level 1 (Deconstruction):</span>
                <span className="font-bold text-yellow-600">{levelScores[1]}/10</span>
              </p>
              <p className="flex justify-between text-gray-700">
                <span>Level 2 (Classification):</span>
                <span className="font-bold text-pink-600">{levelScores[2]}/10</span>
              </p>
              <p className="flex justify-between text-gray-700">
                <span>Level 3 (Application):</span>
                <span className="font-bold text-blue-600">{score}/10</span>
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleBackToLevelSelect}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all text-lg shadow-lg"
              >
                Select Level 📓
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

          <CharacterHand isWriting={false} emotion="happy" />
        </div>

        <style jsx>{`
          @keyframes pop-in {
            0% { transform: scale(0.5); opacity: 0; }
            60% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-pop-in { animation: pop-in 0.5s ease-out; }
        `}</style>
      </ClassroomBackground>
    )
  }

  // Playing Screen - Level 1
  if (currentLevel === 1) {
    const item = shuffledLevel1[currentItem]
    if (!item) return null

    // Handle clicking on split boundaries
    const handleSplitClick = (index: number) => {
      if (submitted || userSegments) return

      // Toggle split point
      if (splitPoints.includes(index)) {
        setSplitPoints(prev => prev.filter(p => p !== index))
      } else {
        // Only allow max 2 split points (for 3 segments)
        const hasPrefix = item.prefix !== "none"
        const maxSplits = hasPrefix ? 2 : 1 // If no prefix, only need 1 split (base + suffix)

        if (splitPoints.length < maxSplits) {
          const newSplits = [...splitPoints, index].sort((a, b) => a - b)
          setSplitPoints(newSplits)

          // If we have the right number of splits, create segments
          if (newSplits.length === maxSplits) {
            const word = item.target
            let createdSegments: { prefix: string; base: string; suffix: string }

            if (hasPrefix) {
              // Has prefix: need 2 splits
              const prefix = word.substring(0, newSplits[0])
              const base = word.substring(newSplits[0], newSplits[1])
              const suffix = word.substring(newSplits[1])
              createdSegments = { prefix, base, suffix }
            } else {
              // No prefix: need 1 split
              const base = word.substring(0, newSplits[0])
              const suffix = word.substring(newSplits[0])
              createdSegments = { prefix: "", base, suffix }
            }

            // Check if the split is correct (strip hyphens from stored values for comparison)
            const correctPrefix = item.prefix === "none" ? "" : item.prefix.replace(/-/g, "")
            const correctBase = item.base
            const correctSuffix = item.suffix.replace(/-/g, "")

            const isCorrectSplit =
              createdSegments.prefix === correctPrefix &&
              createdSegments.base === correctBase &&
              createdSegments.suffix === correctSuffix

            if (isCorrectSplit) {
              setUserSegments(createdSegments)
              setSplitError(false)
            } else {
              // Wrong split - show error
              setUserSegments(createdSegments)
              setSplitError(true)
              playWrongSound()
              setHandEmotion("sad")
              setTimeout(() => setHandEmotion("neutral"), 2000)
            }
          }
        }
      }
    }

    // Reset splits
    const handleResetSplits = () => {
      setSplitPoints([])
      setUserSegments(null)
      setSplitError(false)
      setPlacements({ prefix: null, base: null, suffix: null })
      setHandEmotion("neutral")
    }

    // Validation states
    const getValidationState = (notebook: "prefix" | "base" | "suffix") => {
      if (!submitted) return null

      let correctValue: string | null
      if (notebook === "prefix") {
        correctValue = item.prefix === "none" ? null : item.prefix.replace(/-/g, "")
      } else if (notebook === "suffix") {
        correctValue = item.suffix.replace(/-/g, "")
      } else {
        correctValue = item.base
      }

      const placedValue = placements[notebook]

      if (notebook === "prefix" && item.prefix === "none") {
        return placedValue === null ? "correct" : "wrong"
      }

      return placedValue === correctValue ? "correct" : "wrong"
    }

    return (
      <ClassroomBackground>
        <div className="min-h-screen flex flex-col p-4 pt-56">
          {/* Menu button - top left */}
          <button
            onClick={handleRestart}
            className="absolute top-4 left-4 z-30 bg-amber-700/90 hover:bg-amber-800 text-white font-bold px-4 py-2 rounded-full shadow-lg transition-all flex items-center gap-2 text-sm backdrop-blur-sm"
          >
            ← Menu
          </button>

          {/* Star score - top right */}
          <div className="absolute top-4 right-4 z-30 bg-white/90 backdrop-blur rounded-full px-4 py-2 shadow-lg">
            <span className="text-amber-700 font-bold">⭐ {score}</span>
          </div>

          {/* Level progress - centered below menu/star */}
          <div className="flex justify-center mb-4">
            <ProgressIndicator current={currentItem} total={10} level={1} />
          </div>

          {/* Chalkboard Content */}
          <div className="absolute top-12 xs:top-14 sm:top-16 left-1/2 -translate-x-1/2 text-center z-20 w-full max-w-2xl px-4">
            <p className="text-white text-xs xs:text-sm sm:text-base mb-1 sm:mb-2 opacity-80">
              {!userSegments ? "Click between letters to split the word" : "Drag each part to the correct notebook"}
            </p>
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              {item.target}
            </h2>
          </div>
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center mt-8">
            {/* Word Splitting Interface - Show BEFORE they create segments */}
            {!userSegments && !submitted && (
              <div className="bg-white/95 backdrop-blur rounded-2xl p-6 sm:p-8 shadow-xl border-4 border-amber-300 mb-8 animate-fade-in-up max-w-3xl w-full">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-center text-gray-600 text-sm flex-1">
                    <span className="font-bold text-amber-700">✏️ Click between letters</span> to split the word into parts!
                    {item.prefix !== "none" ? " (Need 2 splits for Prefix + Base + Suffix)" : " (Need 1 split for Base + Suffix)"}
                  </p>
                  {splitPoints.length > 0 && (
                    <button
                      onClick={handleResetSplits}
                      className="ml-4 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-semibold transition"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Clickable Word with Split Boundaries */}
                <div className="flex items-center justify-center flex-wrap gap-0">
                  {item.target.split('').map((letter, index) => (
                    <div key={index} className="inline-flex items-center">
                      {/* Letter */}
                      <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 px-1">
                        {letter}
                      </span>

                      {/* Clickable boundary (except after last letter) */}
                      {index < item.target.length - 1 && (
                        <button
                          onClick={() => handleSplitClick(index + 1)}
                          className={`
                            relative w-1 h-12 sm:h-14 md:h-16 mx-0.5 transition-all cursor-pointer
                            ${splitPoints.includes(index + 1)
                              ? "bg-orange-500 scale-x-150 shadow-lg"
                              : "bg-gray-300 hover:bg-amber-400 hover:scale-x-125"
                            }
                          `}
                        >
                          {splitPoints.includes(index + 1) && (
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-orange-500 text-xl">
                              ✂️
                            </span>
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-center text-gray-500 text-xs mt-4">
                  Splits marked: {splitPoints.length} / {item.prefix !== "none" ? "2" : "1"}
                </p>
              </div>
            )}

            {/* Draggable Segments - Show AFTER they've split the word */}
            {userSegments && !submitted && (
              <div className={`bg-white/95 backdrop-blur rounded-2xl p-4 sm:p-6 shadow-xl border-4 mb-8 ${
                splitError
                  ? "border-red-500 animate-shake"
                  : "border-green-300 animate-fade-in-up"
              }`}>
                <p className={`text-center font-semibold text-sm mb-4 ${
                  splitError ? "text-red-600" : "text-green-700"
                }`}>
                  {splitError
                    ? "❌ Wrong split! The word parts don't match. Try again or continue with these parts."
                    : "✓ Word split correctly! Now drag each part to the correct notebook below:"}
                </p>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  {item.prefix !== "none" && userSegments.prefix && (
                    <DraggableSegment
                      text={userSegments.prefix}
                      type="prefix"
                      onDragStart={() => setDraggingSegment("prefix")}
                      onDragEnd={() => setDraggingSegment(null)}
                      isDragging={draggingSegment === "prefix"}
                      isPlaced={Object.values(placements).includes(userSegments.prefix)}
                    />
                  )}
                  <DraggableSegment
                    text={userSegments.base}
                    type="base"
                    onDragStart={() => setDraggingSegment("base")}
                    onDragEnd={() => setDraggingSegment(null)}
                    isDragging={draggingSegment === "base"}
                    isPlaced={Object.values(placements).includes(userSegments.base)}
                  />
                  <DraggableSegment
                    text={userSegments.suffix}
                    type="suffix"
                    onDragStart={() => setDraggingSegment("suffix")}
                    onDragEnd={() => setDraggingSegment(null)}
                    isDragging={draggingSegment === "suffix"}
                    isPlaced={Object.values(placements).includes(userSegments.suffix)}
                  />
                </div>

                {/* Show hint if split is wrong */}
                {splitError && (
                  <div className="mt-4 bg-red-50 border-2 border-red-300 rounded-lg p-3 text-center animate-fade-in-up">
                    <p className="text-red-700 text-xs mb-2 font-semibold">💡 Hint: Correct split should be:</p>
                    <div className="flex justify-center gap-1 text-xs">
                      {item.prefix !== "none" && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded font-bold">
                          {item.prefix.replace(/-/g, "")}
                        </span>
                      )}
                      <span className="px-2 py-1 bg-green-100 text-green-800 border border-green-300 rounded font-bold">
                        {item.base}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 border border-blue-300 rounded font-bold">
                        {item.suffix.replace(/-/g, "")}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleResetSplits}
                  className={`mt-4 mx-auto block px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    splitError
                      ? "bg-red-200 hover:bg-red-300 text-red-800"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  {splitError ? "⟲ Try Again" : "Re-split Word"}
                </button>
              </div>
            )}

            {/* Notebooks */}
            <div className="flex flex-wrap justify-center gap-2 xs:gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
              <Notebook
                label="Prefix"
                color="yellow"
                placedContent={placements.prefix}
                validationState={getValidationState("prefix")}
                showValidation={submitted}
                onDrop={(e) => {
                  e.preventDefault()
                  if (draggingSegment && !submitted && userSegments) {
                    playWritingSound()
                    const segmentText = draggingSegment === "prefix" ? userSegments.prefix : draggingSegment === "base" ? userSegments.base : userSegments.suffix
                    setPlacements(prev => ({ ...prev, prefix: segmentText || null }))
                    setDraggingSegment(null)
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
              />
              <Notebook
                label="Base Word"
                color="green"
                placedContent={placements.base}
                validationState={getValidationState("base")}
                showValidation={submitted}
                onDrop={(e) => {
                  e.preventDefault()
                  if (draggingSegment && !submitted && userSegments) {
                    playWritingSound()
                    const segmentText = draggingSegment === "prefix" ? userSegments.prefix : draggingSegment === "base" ? userSegments.base : userSegments.suffix
                    setPlacements(prev => ({ ...prev, base: segmentText || null }))
                    setDraggingSegment(null)
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
              />
              <Notebook
                label="Suffix"
                color="blue"
                placedContent={placements.suffix}
                validationState={getValidationState("suffix")}
                showValidation={submitted}
                onDrop={(e) => {
                  e.preventDefault()
                  if (draggingSegment && !submitted && userSegments) {
                    playWritingSound()
                    const segmentText = draggingSegment === "prefix" ? userSegments.prefix : draggingSegment === "base" ? userSegments.base : userSegments.suffix
                    setPlacements(prev => ({ ...prev, suffix: segmentText || null }))
                    setDraggingSegment(null)
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
              />
            </div>

            {/* Submit / Next Buttons */}
            <div className="text-center">
              {!submitted && allPlacedLevel1() && (
                <button
                  onClick={handleLevel1Submit}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all text-lg shadow-lg animate-bounce-soft"
                >
                  Submit Answer ✓
                </button>
              )}

              {submitted && (
                <div className="animate-fade-in-up">
                  <p className={`text-2xl font-bold mb-4 ${getValidationState("base") === "correct" && getValidationState("suffix") === "correct" && getValidationState("prefix") === "correct" ? "text-green-500" : "text-red-500"}`}>
                    {getValidationState("base") === "correct" && getValidationState("suffix") === "correct" && getValidationState("prefix") === "correct" ? "✓ Perfect! All parts correct!" : "✗ Check the red notebooks - those are wrong!"}
                  </p>
                  <button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-all text-lg shadow-lg"
                  >
                    {currentItem < 9 ? "Next Word →" : "Complete Level →"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <CharacterHand isWriting={isWriting} emotion={handEmotion} />
        </div>

        <style jsx>{`
          @keyframes fade-in-up {
            0% { transform: translateY(20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .animate-fade-in-up { animation: fade-in-up 0.4s ease-out; }
          @keyframes bounce-soft {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          .animate-bounce-soft { animation: bounce-soft 1s ease-in-out infinite; }
        `}</style>
      </ClassroomBackground>
    )
  }

  // Playing Screen - Level 2
  if (currentLevel === 2) {
    const item = shuffledLevel2[currentItem]
    if (!item) return null

    const noteColors = ["yellow", "pink", "blue", "green"]

    return (
      <ClassroomBackground>
        <div className="min-h-screen flex flex-col p-4 pt-56">
          {/* Menu button - top left */}
          <button
            onClick={handleRestart}
            className="absolute top-4 left-4 z-30 bg-amber-700/90 hover:bg-amber-800 text-white font-bold px-4 py-2 rounded-full shadow-lg transition-all flex items-center gap-2 text-sm backdrop-blur-sm"
          >
            ← Menu
          </button>

          {/* Star score - top right */}
          <div className="absolute top-4 right-4 z-30 bg-white/90 backdrop-blur rounded-full px-4 py-2 shadow-lg">
            <span className="text-amber-700 font-bold">⭐ {score}</span>
          </div>

          {/* Level progress - centered below menu/star */}
          <div className="flex justify-center mb-4">
            <ProgressIndicator current={currentItem} total={10} level={2} />
          </div>

          {/* Chalkboard Content */}
          <div className="absolute top-16 xs:top-20 sm:top-10 md:top-12 left-1/2 -translate-x-1/2 text-center z-20 w-full max-w-2xl px-2 sm:px-4">
            <p className="text-white text-xs xs:text-sm sm:text-base md:text-lg mb-1 sm:mb-2 opacity-90 leading-tight">
              Derived = new word/meaning | Inflected = grammatical change
            </p>
            <h2 className="text-base xs:text-lg sm:text-2xl md:text-3xl font-bold text-emerald-200 drop-shadow-lg">
              Drag the sticky note to the correct category
            </h2>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center mt-8">
            {/* Sticky Note */}
            {!submitted && (
              <div className="mb-8 animate-pop-in">
                <DraggableStickyNote
                  word={item.word}
                  color={noteColors[currentItem % 4]}
                  onDragStart={() => setDraggingStickyNote(true)}
                  onDragEnd={() => setDraggingStickyNote(false)}
                  isDragging={draggingStickyNote}
                  isPlaced={stickyNotePlacement !== null}
                />
              </div>
            )}

            {/* Notebooks */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-8">
              <Notebook
                label="Derived Form"
                color="purple"
                placedContent={stickyNotePlacement === "derived" ? item.word : null}
                validationState={submitted ? (item.isDerived ? "correct" : "wrong") : null}
                showValidation={submitted && stickyNotePlacement === "derived"}
                onDrop={(e) => {
                  e.preventDefault()
                  if (draggingStickyNote && !submitted) {
                    playWritingSound()
                    setStickyNotePlacement("derived")
                    setDraggingStickyNote(false)
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
              />
              <Notebook
                label="Inflected Form"
                color="pink"
                placedContent={stickyNotePlacement === "inflected" ? item.word : null}
                validationState={submitted ? (!item.isDerived ? "correct" : "wrong") : null}
                showValidation={submitted && stickyNotePlacement === "inflected"}
                onDrop={(e) => {
                  e.preventDefault()
                  if (draggingStickyNote && !submitted) {
                    playWritingSound()
                    setStickyNotePlacement("inflected")
                    setDraggingStickyNote(false)
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
              />
            </div>

            {/* Hint Box */}
            <div className="bg-white/80 backdrop-blur rounded-xl p-3 sm:p-4 max-w-2xl text-center text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 mx-4">
              <p className="whitespace-nowrap overflow-x-auto"><span className="font-bold text-purple-600">Derived:</span> Creates new word class or meaning (e.g., teach → teacher)</p>
              <p className="whitespace-nowrap overflow-x-auto"><span className="font-bold text-pink-600">Inflected:</span> Shows tense, number, comparison (e.g., walk → walked)</p>
            </div>

            {/* Submit / Next Buttons */}
            <div className="text-center">
              {!submitted && allPlacedLevel2() && (
                <button
                  onClick={handleLevel2Submit}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all text-lg shadow-lg animate-bounce-soft"
                >
                  Submit Answer ✓
                </button>
              )}

              {submitted && (
                <div className="animate-fade-in-up">
                  <p className={`text-2xl font-bold mb-2 ${
                    (stickyNotePlacement === "derived" && item.isDerived) || (stickyNotePlacement === "inflected" && !item.isDerived)
                      ? "text-green-500" : "text-red-500"
                  }`}>
                    {(stickyNotePlacement === "derived" && item.isDerived) || (stickyNotePlacement === "inflected" && !item.isDerived)
                      ? "✓ Correct!" : "✗ Not quite!"}
                  </p>
                  {!((stickyNotePlacement === "derived" && item.isDerived) || (stickyNotePlacement === "inflected" && !item.isDerived)) && (
                    <p className="text-gray-600 mb-4">
                      "{item.word}" is {item.isDerived ? "a Derived Form" : "an Inflected Form"}
                    </p>
                  )}
                  <button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-all text-lg shadow-lg"
                  >
                    {currentItem < 9 ? "Next Word →" : "Complete Level →"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <CharacterHand isWriting={isWriting} emotion={handEmotion} />
        </div>

        <style jsx>{`
          @keyframes pop-in {
            0% { transform: scale(0) rotate(-10deg); opacity: 0; }
            60% { transform: scale(1.1) rotate(3deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          .animate-pop-in { animation: pop-in 0.5s ease-out; }
          @keyframes fade-in-up {
            0% { transform: translateY(20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .animate-fade-in-up { animation: fade-in-up 0.4s ease-out; }
          @keyframes bounce-soft {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          .animate-bounce-soft { animation: bounce-soft 1s ease-in-out infinite; }
        `}</style>
      </ClassroomBackground>
    )
  }

  // Playing Screen - Level 3
  if (currentLevel === 3) {
    const item = shuffledLevel3[currentItem]
    if (!item) return null

    const allOptions = shuffleArray([...item.derivedForms, ...item.inflectedForms])

    return (
      <ClassroomBackground>
        <div className="min-h-screen flex flex-col p-4 pt-56">
          {/* Menu button - top left */}
          <button
            onClick={handleRestart}
            className="absolute top-4 left-4 z-30 bg-amber-700/90 hover:bg-amber-800 text-white font-bold px-4 py-2 rounded-full shadow-lg transition-all flex items-center gap-2 text-sm backdrop-blur-sm"
          >
            ← Menu
          </button>

          {/* Star score - top right */}
          <div className="absolute top-4 right-4 z-30 bg-white/90 backdrop-blur rounded-full px-4 py-2 shadow-lg">
            <span className="text-amber-700 font-bold">⭐ {score}</span>
          </div>

          {/* Level progress - centered below menu/star */}
          <div className="flex justify-center mb-4">
            <ProgressIndicator current={currentItem} total={10} level={3} />
          </div>

          {/* Chalkboard Content */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center z-20 w-full max-w-3xl px-4">
            <p className="text-white text-sm mb-2 opacity-80">
              Base word: <span className="font-bold text-yellow-300">{item.baseWord}</span>
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-white drop-shadow-lg leading-relaxed">
              Drag the correct form into the blank
            </h2>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center mt-8">
            {/* Sentence Card with Drop Zone */}
            <div className="bg-white/95 backdrop-blur rounded-2xl p-6 sm:p-8 shadow-xl border-4 border-amber-300 mb-8 max-w-2xl animate-fade-in-up">
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed text-center">
                {item.sentence.split("________")[0]}
                <span
                  className={`inline-block min-w-[120px] mx-1 px-3 py-1 rounded-lg border-2 border-dashed ${
                    submitted
                      ? sentenceBlank === item.correctAnswer
                        ? "bg-green-100 border-green-400 text-green-700"
                        : "bg-red-100 border-red-400 text-red-700"
                      : sentenceBlank
                        ? "bg-amber-100 border-amber-400 text-amber-700"
                        : "bg-gray-100 border-gray-400"
                  }`}
                  onDrop={(e) => {
                    e.preventDefault()
                    if (draggingWord && !submitted) {
                      playWritingSound()
                      setSentenceBlank(draggingWord)
                      setDraggingWord(null)
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {sentenceBlank || "________"}
                </span>
                {item.sentence.split("________")[1]}
              </p>
            </div>

            {/* Word Options */}
            {!submitted && (
              <div className="mb-6">
                <p className="text-center text-gray-600 text-sm mb-3">Drag a word to the blank above:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {allOptions.map((word, index) => (
                    <DraggableWord
                      key={index}
                      word={word}
                      onDragStart={() => setDraggingWord(word)}
                      onDragEnd={() => setDraggingWord(null)}
                      isDragging={draggingWord === word}
                      isPlaced={sentenceBlank === word}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Submit / Next Buttons */}
            <div className="text-center">
              {!submitted && allPlacedLevel3() && (
                <button
                  onClick={handleLevel3Submit}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all text-lg shadow-lg animate-bounce-soft"
                >
                  Submit Answer ✓
                </button>
              )}

              {submitted && (
                <div className="animate-fade-in-up">
                  <p className={`text-2xl font-bold mb-2 ${sentenceBlank === item.correctAnswer ? "text-green-500" : "text-red-500"}`}>
                    {sentenceBlank === item.correctAnswer ? "✓ Perfect!" : "✗ Not quite!"}
                  </p>
                  {sentenceBlank !== item.correctAnswer && (
                    <p className="text-gray-600 mb-4">
                      Correct answer: <span className="font-bold text-green-600">{item.correctAnswer}</span>
                    </p>
                  )}
                  <button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-all text-lg shadow-lg"
                  >
                    {currentItem < 9 ? "Next Sentence →" : "Complete Level →"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <CharacterHand isWriting={isWriting} emotion={handEmotion} />
        </div>

        <style jsx>{`
          @keyframes fade-in-up {
            0% { transform: translateY(20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .animate-fade-in-up { animation: fade-in-up 0.4s ease-out; }
          @keyframes bounce-soft {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          .animate-bounce-soft { animation: bounce-soft 1s ease-in-out infinite; }
        `}</style>
      </ClassroomBackground>
    )
  }

  return null
}
