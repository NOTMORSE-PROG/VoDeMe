"use client"

import { useState } from "react"
import WordStudyTutorial from "./word-study-tutorial"

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
  blank: string
  options: string[]
  correct: number
}

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
  ],
  level2: [
    { word: "taken", isDerived: false },
    { word: "childlike", isDerived: true },
    { word: "ninth", isDerived: false },
    { word: "doors", isDerived: false },
    { word: "easiest", isDerived: false },
    { word: "looking", isDerived: false },
    { word: "Chomy's mother", isDerived: false },
    { word: "dealer", isDerived: true },
    { word: "nonhuman", isDerived: true },
    { word: "clearer", isDerived: false },
  ],
  level3: [
    {
      sentence: "There was a clear ________ between the students' skills and the difficulty of the test.",
      blank: "proportion",
      options: ["disproportion", "proportional", "proportions"],
      correct: 0,
    },
    {
      sentence: "The student was ________ her answer when the teacher asked for clarification.",
      blank: "justify",
      options: ["unjustified", "justifiable", "justifying"],
      correct: 2,
    },
    {
      sentence: "Alex found a ________ friend to help him fix his bike.",
      blank: "rely",
      options: ["reliable", "reliance", "relied"],
      correct: 0,
    },
    {
      sentence: "Francine ________ for the online workshop before the deadline.",
      blank: "register",
      options: ["registration", "deregister", "registered"],
      correct: 2,
    },
    {
      sentence:
        "There was an excellent ________ between the students which made their dance performance look seamless.",
      blank: "coordinate",
      options: ["coordination", "coordinator", "coordinating"],
      correct: 0,
    },
    {
      sentence: "The professor ________ that most students would finish the activity on time but they didn't.",
      blank: "predict",
      options: ["predictions", "predictable", "predicted"],
      correct: 2,
    },
    {
      sentence: "The team is ________ their new product on social media.",
      blank: "promote",
      options: ["promotion", "promoters", "promoting"],
      correct: 2,
    },
    {
      sentence: "The rooftop of the building was ________ due to safety regulations.",
      blank: "access",
      options: ["inaccessible", "accessible", "accessed"],
      correct: 0,
    },
    {
      sentence: "The argument between the neighbors was ________ after a calm discussion.",
      blank: "resolve",
      options: ["resolution", "unresolved", "resolved"],
      correct: 2,
    },
    {
      sentence: "The park ________ its natural beauty despite urban development nearby.",
      blank: "retain",
      options: ["retention", "retentive", "retains"],
      correct: 2,
    },
  ],
}

export default function WordStudyJournal() {
  const [level, setLevel] = useState<"start" | 1 | 2 | 3 | "complete">("start")
  const [itemIndex, setItemIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [levelScores, setLevelScores] = useState({ 1: 0, 2: 0, 3: 0 })
  const [showTutorial, setShowTutorial] = useState(false)

  const handleStartLevel = (lvl: 1 | 2 | 3) => {
    setLevel(lvl)
    setItemIndex(0)
    setScore(0)
    setAnswered(false)
  }

  const handleAnswerLevel1 = (prefix: string, base: string, suffix: string) => {
    const item = gameData.level1[itemIndex]
    if (prefix === item.prefix && base === item.base && suffix === item.suffix) {
      setScore(score + 1)
    }
    handleNext()
  }

  const handleAnswerLevel2 = (isDerived: boolean) => {
    const item = gameData.level2[itemIndex]
    if (isDerived === item.isDerived) {
      setScore(score + 1)
    }
    handleNext()
  }

  const handleAnswerLevel3 = (index: number) => {
    const item = gameData.level3[itemIndex]
    if (index === item.correct) {
      setScore(score + 1)
    }
    handleNext()
  }

  const handleNext = () => {
    if (itemIndex < 9) {
      setItemIndex(itemIndex + 1)
      setAnswered(false)
    } else {
      setLevelScores({ ...levelScores, [level]: score })
      setLevel("complete")
    }
  }

  if (level === "start") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-orange-600 mb-4">The Word Study Journal</h1>
          <p className="text-xl text-gray-700 mb-8">Master Word Parts & Affixes!</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg mb-8 max-w-2xl">
          <h2 className="text-2xl font-bold mb-8 text-center">Select Your Level</h2>

          <div className="space-y-4">
            <div className="flex gap-3">
              <button
                onClick={() => handleStartLevel(1)}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-6 rounded-lg transition text-lg"
              >
                Level 1: Deconstruct Words
              </button>
              <button
                onClick={() => setShowTutorial(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg transition text-lg whitespace-nowrap"
                title="Interactive Tutorial for Level 1"
              >
                📖 Tutorial
              </button>
            </div>
            <button
              onClick={() => handleStartLevel(2)}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 px-6 rounded-lg transition text-lg"
            >
              Level 2: Classify Forms
            </button>
            <button
              onClick={() => handleStartLevel(3)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg transition text-lg"
            >
              Level 3: Complete Sentences
            </button>
          </div>
        </div>

        <div className="bg-orange-50 border-2 border-orange-300 p-6 rounded-lg max-w-2xl">
          <h3 className="font-bold text-lg mb-4">How to Play</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Level 1: Split words into their components (Prefix, Base, Suffix)</li>
            <li>✓ Level 2: Classify words as Derived or Inflected Forms</li>
            <li>✓ Level 3: Choose the correct word form to complete sentences</li>
            <li>✓ Score points for correct answers</li>
          </ul>
        </div>
      </div>
    )
  }

  if (level === "complete") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h2 className="text-4xl font-bold mb-6">Level Complete! 🎉</h2>
          <p className="text-7xl font-bold text-orange-600 mb-6">{score}/10</p>
          <p className="text-xl text-gray-600 mb-8">Excellent word study!</p>
          <button
            onClick={() => setLevel("start")}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition text-lg"
          >
            Select Another Level
          </button>
        </div>
      </div>
    )
  }

  if (level === 1) {
    const item = gameData.level1[itemIndex]
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">Word Study Journal - Level 1</h1>
          <div className="flex justify-center gap-8">
            <span className="text-lg font-semibold">Item: {itemIndex + 1}/10</span>
            <span className="text-lg font-semibold">Score: {score}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 max-w-2xl w-full shadow-lg">
          <div className="text-center mb-12">
            <div className="bg-purple-100 border-4 border-purple-300 rounded-lg p-6 inline-block mb-4">
              <p className="text-5xl font-bold text-purple-600">{item.target}</p>
            </div>
            <p className="text-sm text-gray-500">Split this word into its parts</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Prefix</p>
              <button
                onClick={() => handleAnswerLevel1(item.prefix, item.base, item.suffix)}
                className="w-full bg-yellow-200 hover:bg-yellow-300 border-4 border-yellow-400 rounded-lg p-4 font-bold text-lg transition"
              >
                {item.prefix}
              </button>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Base</p>
              <button
                onClick={() => handleAnswerLevel1(item.prefix, item.base, item.suffix)}
                className="w-full bg-green-200 hover:bg-green-300 border-4 border-green-400 rounded-lg p-4 font-bold text-lg transition"
              >
                {item.base}
              </button>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Suffix</p>
              <button
                onClick={() => handleAnswerLevel1(item.prefix, item.base, item.suffix)}
                className="w-full bg-blue-200 hover:bg-blue-300 border-4 border-blue-400 rounded-lg p-4 font-bold text-lg transition"
              >
                {item.suffix}
              </button>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => handleAnswerLevel1(item.prefix, item.base, item.suffix)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition"
            >
              Submit Answer
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (level === 2) {
    const item = gameData.level2[itemIndex]
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">Word Study Journal - Level 2</h1>
          <div className="flex justify-center gap-8">
            <span className="text-lg font-semibold">Item: {itemIndex + 1}/10</span>
            <span className="text-lg font-semibold">Score: {score}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 max-w-2xl w-full shadow-lg">
          <div className="text-center mb-12">
            <div className="bg-indigo-100 border-4 border-indigo-300 rounded-lg p-6 inline-block mb-4">
              <p className="text-4xl font-bold text-indigo-600">{item.word}</p>
            </div>
            <p className="text-sm text-gray-500">Is this a Derived or Inflected Form?</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <button
              onClick={() => handleAnswerLevel2(true)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-6 rounded-lg transition text-lg"
            >
              Derived Form
            </button>
            <button
              onClick={() => handleAnswerLevel2(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 px-6 rounded-lg transition text-lg"
            >
              Inflected Form
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Derived = new word/meaning | Inflected = grammatical change only
          </p>
        </div>
      </div>
    )
  }

  if (level === 3) {
    const item = gameData.level3[itemIndex]
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Word Study Journal - Level 3</h1>
          <div className="flex justify-center gap-8">
            <span className="text-lg font-semibold">Item: {itemIndex + 1}/10</span>
            <span className="text-lg font-semibold">Score: {score}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 max-w-2xl w-full shadow-lg">
          <div className="text-center mb-12">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">{item.sentence}</p>
            <p className="text-sm text-gray-500">
              Base form: <span className="font-bold text-blue-600">{item.blank}</span>
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {item.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerLevel3(index)}
                className="w-full bg-gray-100 hover:bg-gray-200 border-4 border-gray-300 rounded-lg p-4 font-bold text-lg transition"
              >
                {option}
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-gray-600">Choose the correct word form to complete the sentence</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {showTutorial && <WordStudyTutorial onClose={() => setShowTutorial(false)} />}
    </>
  )
}
