"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-sky-100">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 relative rounded-lg overflow-hidden">
            <img src="/images/image.png" alt="VoDeMe Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-teal-600 bg-clip-text text-transparent">
            VoDeMe
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-slate-700 hover:text-orange-500 transition font-medium cursor-pointer">
            Features
          </a>
          <a href="#games" className="text-slate-700 hover:text-orange-500 transition font-medium cursor-pointer">
            Games
          </a>
          <a href="#learn" className="text-slate-700 hover:text-orange-500 transition font-medium cursor-pointer">
            Learn
          </a>
          <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold">
            Sign In
          </Button>
        </div>

        <button className="md:hidden cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-sky-100 md:hidden">
            <div className="flex flex-col p-4 gap-4">
              <a href="#features" className="text-slate-700 font-medium cursor-pointer">
                Features
              </a>
              <a href="#games" className="text-slate-700 font-medium cursor-pointer">
                Games
              </a>
              <a href="#learn" className="text-slate-700 font-medium cursor-pointer">
                Learn
              </a>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600">Sign In</Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
