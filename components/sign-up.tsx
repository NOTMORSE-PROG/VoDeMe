"use client"

import type React from "react"
import { useState } from "react"
import { useActionState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { signUpAction } from "@/app/auth/actions"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"

interface SignUpProps {
  onToggleSignIn: () => void
}

export default function SignUp({ onToggleSignIn }: SignUpProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(signUpAction, null)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">
        {/* Left Side - Illustration */}
        <div className="hidden md:flex items-center justify-center p-8">
          <div className="relative w-full max-w-sm aspect-square flex flex-col items-center justify-center text-center">
            <Image
              src="/images/girl_signup.png"
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
        <div className="bg-white p-8 md:p-12 flex flex-col justify-center relative">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="mb-8 mt-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">VoDeMe</h1>
            <h2 className="text-2xl font-semibold text-gray-700">Sign Up</h2>
          </div>

          {/* Social Login */}
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => {
                window.location.href = '/api/auth/google?mode=signin&redirect=/dashboard'
              }}
              className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 hover:border-orange-500 transition cursor-pointer"
              title="Sign in with Google"
            >
              <Image src="/images/google-icon.svg" alt="Google" width={18} height={18} />
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

          {/* Global form error */}
          {state?.success === false && state.errors._form && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{state.errors._form[0]}</p>
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                disabled={isPending}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="John Doe"
              />
              {state?.success === false && state.errors.name && (
                <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={isPending}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="your@email.com"
              />
              {state?.success === false && state.errors.email && (
                <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isPending}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  disabled={isPending}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {state?.success === false && state.errors.password && (
                <p className="mt-1 text-sm text-red-600">{state.errors.password[0]}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters with uppercase, lowercase, and number
              </p>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "CREATING ACCOUNT..." : "SIGN UP"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onToggleSignIn}
              className="text-orange-500 hover:text-orange-600 font-semibold"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
