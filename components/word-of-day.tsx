"use client"

import { useEffect, useState } from "react"
import { getWordOfDay, type WordEntry } from "@/lib/word-data"

export default function WordOfDay() {
  const [wordData, setWordData] = useState<(WordEntry & { index: number }) | null>(null)

  useEffect(() => {
    setWordData(getWordOfDay())
  }, [])

  if (!wordData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-sm text-orange-600 font-semibold mb-2">Word {wordData.index} of 52</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            {wordData.word}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-1">{wordData.pronunciation}</p>
          <p className="text-sm text-gray-500 uppercase tracking-wide">{wordData.wordClass}</p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Meaning */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h2 className="text-sm font-semibold text-orange-600 uppercase mb-2">Meaning</h2>
            <p className="text-gray-800 leading-relaxed">{wordData.meaning}</p>
          </div>

          {/* Example */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h2 className="text-sm font-semibold text-blue-600 uppercase mb-2">Example</h2>
            <p className="text-gray-700 italic">"{wordData.example}"</p>
          </div>

          {/* Synonyms & Antonyms */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Synonyms */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="text-sm font-semibold text-green-600 uppercase mb-3">Synonyms</h2>
              <div className="flex flex-wrap gap-2">
                {wordData.synonyms.map((synonym, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm border border-green-200"
                  >
                    {synonym}
                  </span>
                ))}
              </div>
            </div>

            {/* Antonyms */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="text-sm font-semibold text-rose-600 uppercase mb-3">Antonyms</h2>
              <div className="flex flex-wrap gap-2">
                {wordData.antonyms.map((antonym, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-sm border border-rose-200"
                  >
                    {antonym}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">Come back tomorrow for a new word!</p>
        </div>
      </div>
    </div>
  )
}
