"use client"

import { useRouter } from "next/navigation"
import SignUp from "@/components/sign-up"

export default function SignUpClient() {
  const router = useRouter()

  return (
    <SignUp onToggleSignIn={() => router.push("/auth/signin")} />
  )
}
