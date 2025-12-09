"use client"

import { useState } from "react"

interface Question {
  id: number
  question: string
  options: { label: string; text: string }[]
  correctAnswer: string
}

interface Quiz {
  id: string
  title: string
  description: string
  questions: Question[]
}

const quizzes: Quiz[] = [
  {
    id: "synonyms",
    title: "Synonyms Quiz",
    description: "Learn about synonyms, Greek roots, and improve vocabulary",
    questions: [
      {
        id: 1,
        question: "What does the Greek root 'syn' mean?",
        options: [
          { label: "a", text: "name" },
          { label: "b", text: "separate" },
          { label: "c", text: "nickname" },
          { label: "d", text: "alike" },
        ],
        correctAnswer: "d",
      },
      {
        id: 2,
        question: "What does the Greek root 'onym' mean?",
        options: [
          { label: "a", text: "name" },
          { label: "b", text: "nickname" },
          { label: "c", text: "alike" },
          { label: "d", text: "different" },
        ],
        correctAnswer: "a",
      },
      {
        id: 3,
        question:
          "________ is a word or phrase that resembles (completely or partially) another word or phrase in meaning.",
        options: [
          { label: "a", text: "antonym" },
          { label: "b", text: "synonym" },
          { label: "c", text: "collocation" },
          { label: "d", text: "affixes" },
        ],
        correctAnswer: "b",
      },
      {
        id: 4,
        question: "A synonym is basically a word that implies something similar to the provided word.",
        options: [
          { label: "a", text: "true" },
          { label: "b", text: "false" },
          { label: "c", text: "maybe" },
          { label: "d", text: "all of the above" },
        ],
        correctAnswer: "a",
      },
      {
        id: 5,
        question: "Synonyms make our text less appealing.",
        options: [
          { label: "a", text: "false" },
          { label: "b", text: "true" },
          { label: "c", text: "maybe" },
          { label: "d", text: "all of the above" },
        ],
        correctAnswer: "a",
      },
      {
        id: 6,
        question: "Synonyms help evade uninteresting and monotonous text.",
        options: [
          { label: "a", text: "false" },
          { label: "b", text: "true" },
          { label: "c", text: "maybe" },
          { label: "d", text: "none of the above" },
        ],
        correctAnswer: "b",
      },
      {
        id: 7,
        question: "What is the importance of using synonyms?",
        options: [
          { label: "a", text: "To confuse readers with too many word choices" },
          { label: "b", text: "To make writing longer and more complicated" },
          { label: "c", text: "To improve vocabulary, avoid repetition, and make text more engaging" },
          { label: "d", text: "To replace all simple words with difficult ones" },
        ],
        correctAnswer: "c",
      },
      {
        id: 8,
        question: "Which of the following statements about synonyms is NOT correct?",
        options: [
          { label: "a", text: "Synonym allows language to become more expressive and appealing." },
          { label: "b", text: "Synonym helps prevent text from being monotonous." },
          { label: "c", text: "Synonym helps learners expand their vocabulary and understanding." },
          { label: "d", text: "Synonyms always make sentences shorter and simpler." },
        ],
        correctAnswer: "d",
      },
      {
        id: 9,
        question: "Which of the following words is a synonym of disorder?",
        options: [
          { label: "a", text: "chaos" },
          { label: "b", text: "peace" },
          { label: "c", text: "organized" },
          { label: "d", text: "calm" },
        ],
        correctAnswer: "a",
      },
      {
        id: 10,
        question: "Which of the following words is a synonym of gullible?",
        options: [
          { label: "a", text: "suspicious" },
          { label: "b", text: "cynical" },
          { label: "c", text: "trustful" },
          { label: "d", text: "all of the above" },
        ],
        correctAnswer: "c",
      },
      {
        id: 11,
        question: "Which of the following synonym pairs is NOT correct?",
        options: [
          { label: "a", text: "Provide / supply" },
          { label: "b", text: "Close/near" },
          { label: "c", text: "Instinct/intuition" },
          { label: "d", text: "Chaos/peace" },
        ],
        correctAnswer: "d",
      },
      {
        id: 12,
        question:
          '"Peter is a very handsome man, so a lot of people admire him." What is the synonym for the underlined word?',
        options: [
          { label: "a", text: "few" },
          { label: "b", text: "many" },
          { label: "c", text: "minimal" },
          { label: "d", text: "seldom" },
        ],
        correctAnswer: "b",
      },
      {
        id: 13,
        question: "Which sentence uses synonyms correctly?",
        options: [
          { label: "a", text: "I like to eat large and several meals." },
          { label: "b", text: "She is sad and happy at the same time." },
          { label: "c", text: "Their house is very cozy and comfortable to live in." },
          { label: "d", text: "All of the above" },
        ],
        correctAnswer: "c",
      },
      {
        id: 14,
        question: "Which sentence uses synonyms correctly?",
        options: [
          { label: "a", text: "The movie was exciting and thrilling from start to finish." },
          { label: "b", text: "The juice was sweet and bitter, but everyone liked it." },
          { label: "c", text: "She was tired and sad after the long walk." },
          { label: "d", text: "All of the above" },
        ],
        correctAnswer: "a",
      },
      {
        id: 15,
        question: "Which sentence uses synonyms correctly?",
        options: [
          { label: "a", text: "The book was interesting and boring at the same time." },
          { label: "b", text: "His explanation was clear and understandable to everyone." },
          { label: "c", text: "The road was narrow and bumpy, making it hard to drive." },
          { label: "d", text: "None of the above" },
        ],
        correctAnswer: "b",
      },
    ],
  },
  {
    id: "collocations",
    title: "Collocations Quiz",
    description: "Master word combinations and collocations in English",
    questions: [
      {
        id: 1,
        question: "According to Cambridge Dictionary, collocations are word pairs that…",
        options: [
          { label: "a", text: "are only used in academic English." },
          { label: "b", text: "sound correct to native speakers when used together." },
          { label: "c", text: "always have the same meaning." },
          { label: "d", text: "must follow strict grammar rules." },
        ],
        correctAnswer: "b",
      },
      {
        id: 2,
        question: "Why can collocations improve a learner's writing style?",
        options: [
          { label: "a", text: "They make English sentences longer and more complex." },
          { label: "b", text: "They remove the need to learn grammar." },
          { label: "c", text: "They help create smoother, clearer, and more professional writing." },
          { label: "d", text: "They replace basic vocabulary entirely." },
        ],
        correctAnswer: "c",
      },
      {
        id: 3,
        question: "Which sentence shows how collocations make writing more precise or expressive?",
        options: [
          { label: "a", text: "It was very cold and very dark outside." },
          { label: "b", text: "It was coldly cold and darkly dark outside." },
          { label: "c", text: "It was bitterly cold and pitch dark outside." },
          { label: "d", text: "It was cold, dark, and confusing to describe." },
        ],
        correctAnswer: "c",
      },
      {
        id: 4,
        question: "What is the best simple definition of a collocation?",
        options: [
          { label: "a", text: "Two words that rhyme with each other." },
          { label: "b", text: "A fixed phrase whose meaning cannot be guessed from the separate words." },
          { label: "c", text: "Words that can replace each other without changing the meaning." },
          { label: "d", text: "Words that often go together naturally in English." },
        ],
        correctAnswer: "d",
      },
      {
        id: 5,
        question: "What happens when learners know many collocations?",
        options: [
          {
            label: "a",
            text: "They can understand and produce English more naturally because they recognize common word combinations.",
          },
          { label: "b", text: "They begin to memorize individual words instead of meaningful chunks." },
          { label: "c", text: "They rely mainly on grammar rules rather than vocabulary patterns." },
          { label: "d", text: "They often create unusual word pairings that sound less natural." },
        ],
        correctAnswer: "a",
      },
      {
        id: 6,
        question: 'The collocation "make a decision" is an example of which type?',
        options: [
          { label: "a", text: "Verb + Noun" },
          { label: "b", text: "Noun + Noun" },
          { label: "c", text: "Verb + Adverb" },
          { label: "d", text: "Adjective + Adverb" },
        ],
        correctAnswer: "a",
      },
      {
        id: 7,
        question: 'The collocation "deeply disappointed" is an example of which type?',
        options: [
          { label: "a", text: "Verb + Noun" },
          { label: "b", text: "Noun + Noun" },
          { label: "c", text: "Verb + Adverb" },
          { label: "d", text: "Adjective + Adverb" },
        ],
        correctAnswer: "d",
      },
      {
        id: 8,
        question: 'The collocation "family member" is an example of which type?',
        options: [
          { label: "a", text: "Verb + Noun" },
          { label: "b", text: "Noun + Noun" },
          { label: "c", text: "Verb + Adverb" },
          { label: "d", text: "Adjective + Adverb" },
        ],
        correctAnswer: "b",
      },
      {
        id: 9,
        question: 'The collocation "tread carefully" is an example of which type?',
        options: [
          { label: "a", text: "Adjective + Noun" },
          { label: "b", text: "Noun + Noun" },
          { label: "c", text: "Verb + Adverb" },
          { label: "d", text: "Adjective + Adverb" },
        ],
        correctAnswer: "c",
      },
      {
        id: 10,
        question: 'The collocation "a key factor" is an example of which type?',
        options: [
          { label: "a", text: "Adjective + Noun" },
          { label: "b", text: "Noun + Noun" },
          { label: "c", text: "Verb + Adverb" },
          { label: "d", text: "Adjective + Adverb" },
        ],
        correctAnswer: "a",
      },
      {
        id: 11,
        question: "Ilor and his friends must focus _____ improving their vocabulary.",
        options: [
          { label: "a", text: "under" },
          { label: "b", text: "for" },
          { label: "c", text: "in" },
          { label: "d", text: "on" },
        ],
        correctAnswer: "d",
      },
      {
        id: 12,
        question: "The new learning website is highly _____ by many teachers and schools.",
        options: [
          { label: "a", text: "broken" },
          { label: "b", text: "recommended" },
          { label: "c", text: "asleep" },
          { label: "d", text: "wooden" },
        ],
        correctAnswer: "b",
      },
      {
        id: 13,
        question: "Rommel believes that hard work is _____ in achieving success .",
        options: [
          { label: "a", text: "a key facts" },
          { label: "b", text: "key factor" },
          { label: "c", text: "a key factor" },
          { label: "d", text: "key facts" },
        ],
        correctAnswer: "c",
      },
      {
        id: 14,
        question: "During Christmas,  _____ quickly in tourist spots",
        options: [
          { label: "a", text: "prices rise" },
          { label: "b", text: "prices rising" },
          { label: "c", text: "priced rise" },
          { label: "d", text: "prices are risen" },
        ],
        correctAnswer: "a",
      },
      {
        id: 15,
        question: "The audience began to _____ at the comedian's joke",
        options: [
          { label: "a", text: "roar with laughter" },
          { label: "b", text: "roar of laughter" },
          { label: "c", text: "roar in laugh" },
          { label: "d", text: "roar with laugh" },
        ],
        correctAnswer: "a",
      },
    ],
  },
  {
    id: "wordparts",
    title: "Word Parts Quiz",
    description: "Learn prefixes, suffixes, and word formation",
    questions: [
      {
        id: 1,
        question: "Which statement best describes a base (root) in a word?",
        options: [
          { label: "a", text: "A word part added before the stem" },
          { label: "b", text: "A form to which an affix is attached" },
          { label: "c", text: "A suffix that changes the word's class" },
          { label: "d", text: "A grammatical marker at the end of a word" },
        ],
        correctAnswer: "b",
      },
      {
        id: 2,
        question: "Which of the following contains a prefix?",
        options: [
          { label: "a", text: "happiness" },
          { label: "b", text: "worker" },
          { label: "c", text: "incomplete" },
          { label: "d", text: "kindness" },
        ],
        correctAnswer: "c",
      },
      {
        id: 3,
        question: "Which sentence correctly uses the meaning of a prefix to infer the word's meaning?",
        options: [
          { label: "a", text: "He rewrote the essay, meaning he wrote it for the first time." },
          { label: "b", text: "The preview was confusing because it came after the full film." },
          { label: "c", text: "The subway travels under the city." },
          { label: "d", text: "She misheard the instructions, meaning she heard them correctly." },
        ],
        correctAnswer: "c",
      },
      {
        id: 4,
        question: "Which option shows a word formed through derivation?",
        options: [
          { label: "a", text: "jump → jumping" },
          { label: "b", text: "quick → quicker" },
          { label: "c", text: "child → children" },
          { label: "d", text: "help → helpful" },
        ],
        correctAnswer: "d",
      },
      {
        id: 5,
        question: "Which item shows an inflectional change?",
        options: [
          { label: "a", text: "nation → national" },
          { label: "b", text: "read → reader" },
          { label: "c", text: "hope → hopeful" },
          { label: "d", text: "walk → walked" },
        ],
        correctAnswer: "d",
      },
      {
        id: 6,
        question: "Which word uses one of the four most common prefixes in English (un-, re-, dis-, in-/im-/il-/ir-)?",
        options: [
          { label: "a", text: "semicircle" },
          { label: "b", text: "untidy" },
          { label: "c", text: "hyperactive" },
          { label: "d", text: "postgraduate" },
        ],
        correctAnswer: "b",
      },
      {
        id: 7,
        question: "Which suffix forms a noun from an adjective?",
        options: [
          { label: "a", text: "-ing" },
          { label: "b", text: "-ness" },
          { label: "c", text: "-er" },
          { label: "d", text: "-est" },
        ],
        correctAnswer: "b",
      },
      {
        id: 8,
        question: "Which of the following contains two affixes (a prefix and a suffix)?",
        options: [
          { label: "a", text: "unhappiness" },
          { label: "b", text: "asking" },
          { label: "c", text: "workable" },
          { label: "d", text: "joyful" },
        ],
        correctAnswer: "a",
      },
      {
        id: 9,
        question: "Which word demonstrates that prefixes usually do NOT change part of speech?",
        options: [
          { label: "a", text: "anti-war" },
          { label: "b", text: "joyful" },
          { label: "c", text: "sadness" },
          { label: "d", text: "teacher" },
        ],
        correctAnswer: "a",
      },
      {
        id: 10,
        question: "Which pair shows correct identification of the base word?",
        options: [
          { label: "a", text: "unstoppable → stop" },
          { label: "b", text: "disagreement → agree" },
          { label: "c", text: "running → run" },
          { label: "d", text: "All of the above" },
        ],
        correctAnswer: "d",
      },
      {
        id: 11,
        question: "Which explains why word parts help with vocabulary retention?",
        options: [
          { label: "a", text: "Because all affixes have identical meanings" },
          { label: "b", text: "Because seeing related word forms counts as repeated exposure" },
          { label: "c", text: "Because every word with a suffix becomes a new word" },
          { label: "d", text: "Because prefixes always change part of speech" },
        ],
        correctAnswer: "b",
      },
      {
        id: 12,
        question: "Which example shows a past participle inflection?",
        options: [
          { label: "a", text: "studying" },
          { label: "b", text: "eaten" },
          { label: "c", text: "studies" },
          { label: "d", text: "happiest" },
        ],
        correctAnswer: "b",
      },
      {
        id: 13,
        question: "Which sentence shows correct understanding of derivation?",
        options: [
          { label: "a", text: "The runner runs faster every day." },
          { label: "b", text: "The unhappy child smiled." },
          { label: "c", text: "Adding -er to teach creates a noun meaning a person who teaches." },
          { label: "d", text: "The boxes is heavy." },
        ],
        correctAnswer: "c",
      },
      {
        id: 14,
        question: "Which of the following is an example of a word made only through inflection, not derivation?",
        options: [
          { label: "a", text: "darkness" },
          { label: "b", text: "rewritten" },
          { label: "c", text: "dogs" },
          { label: "d", text: "enjoyable" },
        ],
        correctAnswer: "c",
      },
      {
        id: 15,
        question:
          "A student encounters the word irresponsible. Based on word-part knowledge, what can the student infer?",
        options: [
          { label: "a", text: 'The word means "able to respond."' },
          { label: "b", text: "The prefix makes the meaning opposite or negative." },
          { label: "c", text: "The suffix changes the verb into a noun." },
          { label: "d", text: "The word refers to repeated action." },
        ],
        correctAnswer: "b",
      },
    ],
  },
]

interface QuizGameProps {
  onBack: () => void
}

export default function QuizGame({ onBack }: QuizGameProps) {
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [completed, setCompleted] = useState(false)

  const quiz = quizzes.find((q) => q.id === selectedQuiz)
  const question = quiz?.questions[currentQuestion]

  const handleAnswerClick = (optionLabel: string) => {
    if (answered) return

    setSelectedAnswer(optionLabel)
    setAnswered(true)

    if (optionLabel === question?.correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < (quiz?.questions.length ?? 0) - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      setCompleted(true)
    }
  }

  const handleRestartQuiz = () => {
    setSelectedQuiz(null)
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setAnswered(false)
    setCompleted(false)
  }

  if (!selectedQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 p-8">
        <button
          onClick={onBack}
          className="mb-8 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        >
          ← Back to Dashboard
        </button>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">📝 Choose a Quiz</h1>
          <p className="text-center text-gray-600 mb-12">Test your vocabulary knowledge!</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quizzes.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition transform hover:scale-105 cursor-pointer"
                onClick={() => setSelectedQuiz(q.id)}
              >
                <div className="text-5xl mb-4">
                  {q.id === "synonyms" ? "⚡" : q.id === "collocations" ? "🎯" : "🔨"}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{q.title}</h2>
                <p className="text-gray-600 mb-6">{q.description}</p>
                <div className="flex items-center justify-between">
                  <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold">
                    {q.questions.length} Questions
                  </span>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg">
                    Start Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (completed) {
    const totalQuestions = quiz?.questions.length ?? 0
    const percentage = Math.round((score / totalQuestions) * 100)

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md text-center">
          <div className="text-7xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Quiz Completed!</h1>
          <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-2xl p-8 mb-8">
            <p className="text-gray-600 text-sm mb-2">Your Score</p>
            <p className="text-5xl font-bold text-orange-600 mb-2">
              {score}/{totalQuestions}
            </p>
            <p className="text-2xl font-semibold text-orange-500">{percentage}%</p>
          </div>

          {percentage === 100 ? (
            <p className="text-lg text-green-600 font-semibold mb-6">Perfect Score! Outstanding work! 🌟</p>
          ) : percentage >= 80 ? (
            <p className="text-lg text-blue-600 font-semibold mb-6">Excellent performance! Great job! 👏</p>
          ) : percentage >= 60 ? (
            <p className="text-lg text-yellow-600 font-semibold mb-6">Good effort! Keep practicing! 💪</p>
          ) : (
            <p className="text-lg text-orange-600 font-semibold mb-6">Keep learning! You'll do better next time! 📚</p>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleRestartQuiz}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Try Another Quiz
            </button>
            <button
              onClick={onBack}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
      <button
        onClick={onBack}
        className="absolute top-4 left-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
      >
        ← Back
      </button>

      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8 text-center">
          <p className="text-white text-lg font-semibold">
            {currentQuestion + 1}/{quiz?.questions.length}
          </p>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / (quiz?.questions.length ?? 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">{question?.question}</h2>

          {/* Answer Options */}
          <div className="space-y-4">
            {question?.options.map((option) => {
              const isSelected = selectedAnswer === option.label
              const isCorrect = option.label === question.correctAnswer
              const isWrong = isSelected && option.label !== question.correctAnswer

              let bgColor = "bg-white hover:bg-gray-50"
              let borderColor = "border-2 border-gray-300"
              let textColor = "text-gray-800"

              if (answered) {
                if (isCorrect) {
                  bgColor = "bg-green-100"
                  borderColor = "border-2 border-green-500"
                  textColor = "text-green-800"
                } else if (isWrong) {
                  bgColor = "bg-red-100"
                  borderColor = "border-2 border-red-500"
                  textColor = "text-red-800"
                } else {
                  bgColor = "bg-gray-50"
                  borderColor = "border-2 border-gray-300"
                  textColor = "text-gray-600"
                }
              } else if (isSelected) {
                bgColor = "bg-blue-100"
                borderColor = "border-2 border-blue-500"
              }

              return (
                <button
                  key={option.label}
                  onClick={() => handleAnswerClick(option.label)}
                  disabled={answered}
                  className={`w-full ${bgColor} ${borderColor} rounded-xl p-4 text-left transition flex items-center gap-4 ${
                    answered ? "cursor-default" : "cursor-pointer hover:shadow-md"
                  }`}
                >
                  <span
                    className={`flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold ${
                      answered && isCorrect ? "bg-green-500" : ""
                    } ${answered && isWrong ? "bg-red-500" : ""}`}
                  >
                    {option.label}
                  </span>
                  <span className={`flex-1 font-semibold ${textColor}`}>{option.text}</span>
                  {answered && isCorrect && <span className="text-2xl">✓</span>}
                  {answered && isWrong && <span className="text-2xl">✗</span>}
                </button>
              )
            })}
          </div>

          {/* Next Button */}
          {answered && (
            <button
              onClick={handleNext}
              className="w-full mt-8 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              {currentQuestion === (quiz?.questions.length ?? 0) - 1 ? "Finish Quiz" : "Next Question"}
            </button>
          )}
        </div>

        {/* Score */}
        <div className="text-center text-white">
          <p className="text-lg">
            Current Score: <span className="font-bold text-orange-400">{score}</span>/{quiz?.questions.length}
          </p>
        </div>
      </div>
    </div>
  )
}
