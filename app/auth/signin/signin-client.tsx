"use client"

import { useRouter } from "next/navigation"
import SignIn from "@/components/sign-in"

export default function SignInClient() {
  const router = useRouter()

  return (
    <SignIn onToggleSignUp={() => router.push("/auth/signup")} />
  )
}
