"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface TutorialStep {
  target: string
  prefix: string
  base: string
  suffix: string
  instructions: string[]
  hint: string
}

interface TutorialItem extends TutorialStep {
  expectedSplits: number[]
}

const tutorialData: TutorialItem[] = [
  {
    target: "unhappily",
    prefix: "un",
    base: "happy",
    suffix: "ly",
    expectedSplits: [2, 7], // after 'un', before 'ly'
    instructions: [
      "Click between letters to split the word! Start by clicking after 'un'.",
      "Great! Now click before 'ly' to separate the suffix.",
      "Perfect! Now drag each part to the correct notebook."
    ],
    hint: "The prefix 'un-' means 'not'. The suffix '-ly' makes it an adverb."
  },
  {
    target: "teacher",
    prefix: "none",
    base: "teach",
    suffix: "er",
    expectedSplits: [5], // before 'er'
    instructions: [
      "This word has no prefix! Click before 'er' to split it.",
      "Excellent! Now drag the parts to their notebooks."
    ],
    hint: "Not all words have prefixes. The suffix '-er' means 'one who does'."
  },
  {
    target: "replay",
    prefix: "re",
    base: "play",
    suffix: "none",
    expectedSplits: [2], // after 're'
    instructions: [
      "This word has no suffix! Click after 're' to split it.",
      "Great job! Now drag the parts to their notebooks."
    ],
    hint: "The prefix 're-' means 'again'. Not all words have suffixes!"
  }
]

interface WordStudyTutorialProps {
  onClose: () => void
}

export default function WordStudyTutorial({ onClose }: WordStudyTutorialProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [instructionStep, setInstructionStep] = useState(0)
  const [splitPoints, setSplitPoints] = useState<number[]>([])
  const [segments, setSegments] = useState<{ prefix: string; base: string; suffix: string } | null>(null)
  const [placements, setPlacements] = useState<{ prefix: string | null; base: string | null; suffix: string | null }>({
    prefix: null,
    base: null,
    suffix: null
  })
  const [draggingSegment, setDraggingSegment] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [wrongNotebook, setWrongNotebook] = useState<"prefix" | "base" | "suffix" | null>(null)

  const currentItem = tutorialData[currentIndex]
  const currentInstruction = currentItem.instructions[instructionStep]

  // Get the next expected split point based on what's already been split
  const getNextExpectedSplit = () => {
    const remainingSplits = currentItem.expectedSplits.filter(s => !splitPoints.includes(s))
    return remainingSplits.length > 0 ? remainingSplits[0] : null
  }

  const nextExpectedSplit = getNextExpectedSplit()

  const handleSplitClick = (index: number) => {
    if (showSuccess || segments) return

    // Only allow clicking expected split points
    if (!currentItem.expectedSplits.includes(index)) {
      return
    }

    if (splitPoints.includes(index)) {
      setSplitPoints(prev => prev.filter(p => p !== index))
      return
    }

    const newSplits = [...splitPoints, index].sort((a, b) => a - b)
    setSplitPoints(newSplits)

    const hasPrefix = currentItem.prefix !== "none"
    const hasSuffix = currentItem.suffix !== "none"
    const maxSplits = (hasPrefix ? 1 : 0) + (hasSuffix ? 1 : 0)

    if (newSplits.length === maxSplits) {
      const word = currentItem.target
      let createdSegments: { prefix: string; base: string; suffix: string }

      if (hasPrefix && hasSuffix) {
        createdSegments = {
          prefix: word.substring(0, newSplits[0]),
          base: word.substring(newSplits[0], newSplits[1]),
          suffix: word.substring(newSplits[1])
        }
      } else if (hasPrefix && !hasSuffix) {
        createdSegments = {
          prefix: word.substring(0, newSplits[0]),
          base: word.substring(newSplits[0]),
          suffix: ""
        }
      } else if (!hasPrefix && hasSuffix) {
        createdSegments = {
          prefix: "",
          base: word.substring(0, newSplits[0]),
          suffix: word.substring(newSplits[0])
        }
      } else {
        createdSegments = { prefix: "", base: word, suffix: "" }
      }

      setSegments(createdSegments)
      setInstructionStep(Math.min(instructionStep + 1, currentItem.instructions.length - 1))
    } else {
      setInstructionStep(Math.min(instructionStep + 1, currentItem.instructions.length - 1))
    }
  }

  const handleDrop = (notebook: "prefix" | "base" | "suffix", segmentValue: string) => {
    if (!segments || showSuccess) return

    // Check if this is the correct placement
    let isCorrectPlacement = false
    if (notebook === "prefix") {
      isCorrectPlacement = segmentValue === segments.prefix
    } else if (notebook === "base") {
      isCorrectPlacement = segmentValue === segments.base
    } else if (notebook === "suffix") {
      isCorrectPlacement = segmentValue === segments.suffix
    }

    if (!isCorrectPlacement) {
      // Wrong placement - shake and reset
      setWrongNotebook(notebook)
      setDraggingSegment(null)
      setTimeout(() => {
        setWrongNotebook(null)
      }, 500)
      return
    }

    // Correct placement
    setPlacements(prev => ({ ...prev, [notebook]: segmentValue }))
    setDraggingSegment(null)

    // Check if all required placements are done
    setTimeout(() => {
      const hasPrefix = currentItem.prefix !== "none"
      const hasSuffix = currentItem.suffix !== "none"

      const newPrefixCorrect = !hasPrefix || (notebook === "prefix" ? segmentValue === segments.prefix : placements.prefix === segments.prefix)
      const newBaseCorrect = notebook === "base" ? segmentValue === segments.base : placements.base === segments.base
      const newSuffixCorrect = !hasSuffix || (notebook === "suffix" ? segmentValue === segments.suffix : placements.suffix === segments.suffix)

      if (newPrefixCorrect && newBaseCorrect && newSuffixCorrect) {
        setShowSuccess(true)
      }
    }, 100)
  }

  const handleNext = () => {
    if (currentIndex < tutorialData.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setInstructionStep(0)
      setSplitPoints([])
      setSegments(null)
      setPlacements({ prefix: null, base: null, suffix: null })
      setShowSuccess(false)
      setShowHint(false)
    } else {
      onClose()
    }
  }

  const getValidationState = (notebook: "prefix" | "base" | "suffix") => {
    if (!showSuccess || !segments) return null

    let correctValue: string | null
    if (notebook === "prefix") {
      correctValue = currentItem.prefix === "none" ? null : segments.prefix
    } else if (notebook === "suffix") {
      correctValue = currentItem.suffix === "none" ? null : segments.suffix
    } else {
      correctValue = segments.base
    }

    if (notebook === "prefix" && currentItem.prefix === "none") {
      return placements.prefix === null ? "correct" : "wrong"
    }
    if (notebook === "suffix" && currentItem.suffix === "none") {
      return placements.suffix === null ? "correct" : "wrong"
    }

    return placements[notebook] === correctValue ? "correct" : "wrong"
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-gradient-to-b from-amber-50 to-orange-50 rounded-2xl p-6 max-w-4xl w-full shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-full transition z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Animated Instruction Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-4 mb-6 shadow-lg animate-slide-down relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/30">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${((instructionStep + 1) / currentItem.instructions.length) * 100}%` }}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl animate-bounce">👉</div>
            <p className="text-lg font-semibold flex-1">{currentInstruction}</p>
            <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
              Step {currentIndex + 1}/{tutorialData.length}
            </div>
          </div>
        </div>

        {/* Word Display */}
        <div className="bg-purple-100 border-4 border-purple-300 rounded-xl p-6 mb-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Target Word</p>
          <p className="text-5xl font-bold text-purple-600 mb-4">{currentItem.target}</p>

          {/* Clickable Word */}
          {!segments && (
            <div>
              <div className="flex items-center justify-center flex-wrap gap-0 mb-2">
                {currentItem.target.split('').map((letter, index) => (
                  <div key={index} className="inline-flex items-center relative">
                    <span className="text-3xl font-bold text-gray-800 px-1">{letter}</span>
                    {index < currentItem.target.length - 1 && (
                      <button
                        onClick={() => handleSplitClick(index + 1)}
                        className={`relative w-2 h-12 mx-1 transition-all rounded ${
                          splitPoints.includes(index + 1)
                            ? "bg-orange-500 scale-x-150 shadow-lg animate-pulse cursor-pointer"
                            : currentItem.expectedSplits.includes(index + 1)
                            ? "bg-blue-400 hover:bg-amber-400 hover:scale-x-150 shadow cursor-pointer"
                            : "bg-gray-200 opacity-30 cursor-not-allowed"
                        }`}
                      >
                        {splitPoints.includes(index + 1) && (
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-orange-500 text-2xl animate-bounce">
                            ✂️
                          </span>
                        )}
                        {!splitPoints.includes(index + 1) && nextExpectedSplit === index + 1 && (
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-red-500 text-3xl animate-bounce">
                            👇
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 text-center animate-pulse">
                👆 Click the blue lines between letters to split the word!
              </p>
            </div>
          )}

          {/* Segments after split */}
          {segments && !showSuccess && (
            <div className="flex flex-wrap justify-center gap-3 animate-pop-in">
              {currentItem.prefix !== "none" && segments.prefix && (
                <div
                  draggable={!Object.values(placements).includes(segments.prefix)}
                  onDragStart={() => setDraggingSegment(segments.prefix)}
                  onDragEnd={() => setDraggingSegment(null)}
                  className={`px-4 py-2 rounded-lg border-2 font-bold text-lg bg-amber-50 border-amber-300 text-gray-800 cursor-grab active:cursor-grabbing hover:scale-105 transition ${
                    Object.values(placements).includes(segments.prefix) ? "opacity-30" : ""
                  } ${draggingSegment === segments.prefix ? "opacity-50 scale-95" : ""}`}
                >
                  {segments.prefix}
                </div>
              )}
              <div
                draggable={!Object.values(placements).includes(segments.base)}
                onDragStart={() => setDraggingSegment(segments.base)}
                onDragEnd={() => setDraggingSegment(null)}
                className={`px-4 py-2 rounded-lg border-2 font-bold text-lg bg-amber-50 border-amber-300 text-gray-800 cursor-grab active:cursor-grabbing hover:scale-105 transition ${
                  Object.values(placements).includes(segments.base) ? "opacity-30" : ""
                } ${draggingSegment === segments.base ? "opacity-50 scale-95" : ""}`}
              >
                {segments.base}
              </div>
              {currentItem.suffix !== "none" && segments.suffix && (
                <div
                  draggable={!Object.values(placements).includes(segments.suffix)}
                  onDragStart={() => setDraggingSegment(segments.suffix)}
                  onDragEnd={() => setDraggingSegment(null)}
                  className={`px-4 py-2 rounded-lg border-2 font-bold text-lg bg-amber-50 border-amber-300 text-gray-800 cursor-grab active:cursor-grabbing hover:scale-105 transition ${
                    Object.values(placements).includes(segments.suffix) ? "opacity-30" : ""
                  } ${draggingSegment === segments.suffix ? "opacity-50 scale-95" : ""}`}
                >
                  {segments.suffix}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notebooks */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {/* Prefix Notebook */}
          {currentItem.prefix !== "none" && (
            <div
              onDrop={(e) => {
                e.preventDefault()
                if (draggingSegment) handleDrop("prefix", draggingSegment)
              }}
              onDragOver={(e) => e.preventDefault()}
              className={`relative w-32 h-40 rounded-lg shadow-xl transition-all bg-yellow-100 border-4 ${
                showSuccess && getValidationState("prefix") === "correct" ? "border-green-500 ring-4 ring-green-300 animate-wiggle" :
                showSuccess && getValidationState("prefix") === "wrong" ? "border-red-500 ring-4 ring-red-300" :
                wrongNotebook === "prefix" ? "border-red-500 animate-shake" :
                "border-yellow-500"
              } ${draggingSegment && !placements.prefix ? "scale-105 ring-4 ring-yellow-400 animate-pulse" : ""}`}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-t-lg bg-yellow-100 border-2 border-yellow-500">
                <span className="text-xs font-bold text-yellow-700">Prefix</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center px-2">
                {placements.prefix ? (
                  <div className="text-yellow-700 font-bold text-xl animate-write-in" style={{ fontFamily: "'Caveat', cursive" }}>
                    {placements.prefix}
                  </div>
                ) : (
                  <div className="text-3xl opacity-30">📝</div>
                )}
              </div>
              {showSuccess && getValidationState("prefix") && (
                <div className="absolute -top-4 -right-4 text-3xl animate-bounce-in">
                  {getValidationState("prefix") === "correct" ? "✅" : "❌"}
                </div>
              )}
            </div>
          )}

          {/* Base Notebook */}
          <div
            onDrop={(e) => {
              e.preventDefault()
              if (draggingSegment) handleDrop("base", draggingSegment)
            }}
            onDragOver={(e) => e.preventDefault()}
            className={`relative w-32 h-40 rounded-lg shadow-xl transition-all bg-green-100 border-4 ${
              showSuccess && getValidationState("base") === "correct" ? "border-green-500 ring-4 ring-green-300 animate-wiggle" :
              showSuccess && getValidationState("base") === "wrong" ? "border-red-500 ring-4 ring-red-300" :
              wrongNotebook === "base" ? "border-red-500 animate-shake" :
              "border-green-500"
            } ${draggingSegment && !placements.base ? "scale-105 ring-4 ring-green-400 animate-pulse" : ""}`}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-t-lg bg-green-100 border-2 border-green-500">
              <span className="text-xs font-bold text-green-700">Base Word</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center px-2">
              {placements.base ? (
                <div className="text-green-700 font-bold text-xl animate-write-in" style={{ fontFamily: "'Caveat', cursive" }}>
                  {placements.base}
                </div>
              ) : (
                <div className="text-3xl opacity-30">📝</div>
              )}
            </div>
            {showSuccess && getValidationState("base") && (
              <div className="absolute -top-4 -right-4 text-3xl animate-bounce-in">
                {getValidationState("base") === "correct" ? "✅" : "❌"}
              </div>
            )}
          </div>

          {/* Suffix Notebook */}
          {currentItem.suffix !== "none" && (
            <div
              onDrop={(e) => {
                e.preventDefault()
                if (draggingSegment) handleDrop("suffix", draggingSegment)
              }}
              onDragOver={(e) => e.preventDefault()}
              className={`relative w-32 h-40 rounded-lg shadow-xl transition-all bg-blue-100 border-4 ${
                showSuccess && getValidationState("suffix") === "correct" ? "border-green-500 ring-4 ring-green-300 animate-wiggle" :
                showSuccess && getValidationState("suffix") === "wrong" ? "border-red-500 ring-4 ring-red-300" :
                wrongNotebook === "suffix" ? "border-red-500 animate-shake" :
                "border-blue-500"
              } ${draggingSegment && !placements.suffix ? "scale-105 ring-4 ring-blue-400 animate-pulse" : ""}`}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-t-lg bg-blue-100 border-2 border-blue-500">
                <span className="text-xs font-bold text-blue-700">Suffix</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center px-2">
                {placements.suffix ? (
                  <div className="text-blue-700 font-bold text-xl animate-write-in" style={{ fontFamily: "'Caveat', cursive" }}>
                    {placements.suffix}
                  </div>
                ) : (
                  <div className="text-3xl opacity-30">📝</div>
                )}
              </div>
              {showSuccess && getValidationState("suffix") && (
                <div className="absolute -top-4 -right-4 text-3xl animate-bounce-in">
                  {getValidationState("suffix") === "correct" ? "✅" : "❌"}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hint Button */}
        {!showSuccess && segments && (
          <div className="text-center mb-4">
            {!showHint ? (
              <button
                onClick={() => setShowHint(true)}
                className="bg-yellow-100 hover:bg-yellow-200 border-2 border-yellow-400 text-yellow-800 font-semibold py-2 px-6 rounded-lg transition"
              >
                💡 Need a Hint?
              </button>
            ) : (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 animate-slide-down">
                <p className="text-sm text-gray-700">{currentItem.hint}</p>
              </div>
            )}
          </div>
        )}

        {/* Success and Next Button */}
        {showSuccess && (
          <div className="text-center animate-pop-in">
            <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6 mb-4">
              <p className="text-4xl mb-2">🎉</p>
              <p className="text-2xl font-bold text-green-700 mb-2">Perfect!</p>
              <p className="text-gray-700">{currentItem.hint}</p>
            </div>
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all text-lg shadow-lg"
            >
              {currentIndex < tutorialData.length - 1 ? "Next Word →" : "Finish Tutorial 🎓"}
            </button>
          </div>
        )}

        <style jsx>{`
          @keyframes slide-down {
            0% { transform: translateY(-20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          @keyframes pop-in {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes write-in {
            0% { opacity: 0; transform: scale(0.5); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes bounce-in {
            0% { transform: scale(0); }
            50% { transform: scale(1.3); }
            100% { transform: scale(1); }
          }
          @keyframes wiggle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-2deg); }
            75% { transform: rotate(2deg); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
          }
          .animate-slide-down { animation: slide-down 0.4s ease-out; }
          .animate-pop-in { animation: pop-in 0.4s ease-out; }
          .animate-write-in { animation: write-in 0.3s ease-out; }
          .animate-bounce-in { animation: bounce-in 0.4s ease-out; }
          .animate-wiggle { animation: wiggle 0.5s ease-in-out; }
          .animate-shake { animation: shake 0.5s ease-in-out; }
        `}</style>
      </div>
    </div>
  )
}
