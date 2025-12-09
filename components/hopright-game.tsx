"use client"

import { useState, useEffect } from "react"

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

export default function HopRightGame() {
  const [currentLevel, setCurrentLevel] = useState<"easy" | "medium" | "hard" | "start" | "complete">("start")
  const [currentStage, setCurrentStage] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [levelScores, setLevelScores] = useState({ easy: 0, medium: 0, hard: 0 })

  const levelKey = currentLevel as "easy" | "medium" | "hard"
  const stages = currentLevel !== "start" && currentLevel !== "complete" ? levelData[levelKey] : []
  const currentStageData = stages[currentStage]

  useEffect(() => {
    if (currentLevel === "start" || currentLevel === "complete" || !currentStageData || answered) return

    const timer = setInterval(() => {
      setTimeElapsed((prev) => {
        if (prev >= 60) {
          // Play reminder after 1 minute
          const audio = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_c.mp3")
          audio.play().catch(() => {})
          return prev
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
      setFeedback("✓ Correct!")
      setScore(score + 1)
    } else {
      setFeedback(`✗ Wrong! Correct answer: "${currentStageData.options[currentStageData.correct]}"`)
    }
  }

  const handleNext = () => {
    if (currentStage < stages.length - 1) {
      setCurrentStage(currentStage + 1)
      setFeedback("")
      setAnswered(false)
      setTimeElapsed(0)
    } else {
      // Level complete
      setLevelScores({ ...levelScores, [levelKey]: score })
      setCurrentLevel("complete")
    }
  }

  const handleStartLevel = (level: "easy" | "medium" | "hard") => {
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
    setLevelScores({ easy: 0, medium: 0, hard: 0 })
  }

  if (currentLevel === "start") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-blue-600 mb-4">HopRight</h1>
          <p className="text-2xl text-gray-700 mb-2">Collocation Edition</p>
          <p className="text-lg text-gray-600">Master English Collocations Through Play!</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg mb-8 max-w-2xl">
          <h2 className="text-2xl font-bold mb-8 text-center">Select Your Level</h2>

          <div className="space-y-4">
            <button
              onClick={() => handleStartLevel("easy")}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition text-lg"
            >
              🟢 Easy Level (Beginner)
            </button>
            <button
              onClick={() => handleStartLevel("medium")}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-6 rounded-lg transition text-lg"
            >
              🟡 Medium Level (Intermediate)
            </button>
            <button
              onClick={() => handleStartLevel("hard")}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg transition text-lg"
            >
              🔴 Hard Level (Advanced)
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-lg max-w-2xl">
          <h3 className="font-bold text-lg mb-4">How to Play</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Find the correct collocation pair from 3 options</li>
            <li>✓ Correct answers earn +1 point</li>
            <li>✓ Complete all 10 stages to master the level</li>
            <li>✓ No timer, but stay focused!</li>
          </ul>
        </div>
      </div>
    )
  }

  if (currentLevel === "complete") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h2 className="text-4xl font-bold mb-6">Level Complete! 🎉</h2>
          <p className="text-7xl font-bold text-blue-600 mb-6">{score}/10</p>
          <p className="text-xl text-gray-600 mb-8">Great hopping!</p>
          <button
            onClick={handlePlayAgain}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition text-lg"
          >
            Select Another Level
          </button>
        </div>
      </div>
    )
  }

  if (!currentStageData) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">HopRight - {currentLevel.toUpperCase()}</h1>
        <div className="flex justify-center gap-8">
          <span className="text-lg font-semibold text-gray-700">Stage: {currentStage + 1}/10</span>
          <span className="text-lg font-semibold text-gray-700">Score: {score}</span>
        </div>
      </div>

      {/* Game Area */}
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full shadow-lg">
        {/* Content Display */}
        <div className="text-center mb-12">
          {currentStageData.targetWord ? (
            <div>
              <div className="bg-blue-100 border-4 border-blue-300 rounded-lg p-6 mb-4 inline-block">
                <p className="text-4xl font-bold text-blue-600">{currentStageData.targetWord}</p>
              </div>
              <p className="text-sm text-gray-500">Find the correct collocation</p>
            </div>
          ) : (
            <div>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">{currentStageData.sentence}</p>
              <p className="text-sm text-gray-500">Choose the correct collocation</p>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-4 mb-8">
          {currentStageData.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(index)}
              disabled={answered}
              className={`w-full p-4 rounded-lg font-semibold transition text-lg ${
                answered
                  ? index === currentStageData.correct
                    ? "bg-green-400 text-white"
                    : "bg-red-400 text-white opacity-50"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800 cursor-pointer"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {feedback && <div className="text-center mb-6 text-lg font-bold text-gray-800 h-8">{feedback}</div>}

        {/* Next Button */}
        {answered && (
          <div className="flex justify-center">
            <button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
            >
              {currentStage < stages.length - 1 ? "Next Stage →" : "Complete Level →"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
