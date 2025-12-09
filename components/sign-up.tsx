"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"

interface SignUpProps {
  onSignUp: (email: string, name: string) => void
  onToggleSignIn: () => void
}

export default function SignUp({ onSignUp, onToggleSignIn }: SignUpProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && email && password === confirmPassword && password.length >= 6) {
      onSignUp(email, name)
    }
  }

  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">
        {/* Left Side - Illustration */}
        <div className="hidden md:flex bg-purple-500 items-center justify-center p-8">
          <div className="relative w-full max-w-sm aspect-square flex flex-col items-center justify-center text-center">
            <Image
              src="/images/signup-illustration.jpg"
              alt="Sign up illustration"
              width={400}
              height={400}
              className="w-full h-full object-contain"
              priority
            />
            <h3 className="absolute bottom-6 left-0 right-0 text-white text-xl font-bold">Hello, Friend!</h3>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="bg-white p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">VoDeMe</h1>
            <h2 className="text-2xl font-semibold text-gray-700">Sign Up</h2>
          </div>

          {/* Social Login */}
          <div className="flex gap-4 mb-6">
            <button className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 hover:border-orange-500 transition font-semibold text-gray-700">
              f
            </button>
            <button className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 hover:border-orange-500 transition font-semibold text-gray-700">
              G
            </button>
            <button className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 hover:border-orange-500 transition font-semibold text-gray-700">
              in
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or create new account</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition mt-6"
            >
              SIGN UP
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <button onClick={onToggleSignIn} className="text-orange-500 hover:text-orange-600 font-semibold">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
