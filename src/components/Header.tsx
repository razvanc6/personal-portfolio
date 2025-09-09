'use client'

import { useState } from 'react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Portfolio
              </span>
            </h1>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-white hover:text-purple-400 transition-colors">
              Home
            </a>
            <a href="#about" className="text-white hover:text-purple-400 transition-colors">
              About
            </a>
            <a href="#projects" className="text-white hover:text-purple-400 transition-colors">
              Projects
            </a>
            <a href="#contact" className="text-white hover:text-purple-400 transition-colors">
              Contact
            </a>
          </nav>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/40 rounded-lg mt-2">
              <a href="#home" className="block px-3 py-2 text-white hover:text-purple-400 transition-colors">
                Home
              </a>
              <a href="#about" className="block px-3 py-2 text-white hover:text-purple-400 transition-colors">
                About
              </a>
              <a href="#projects" className="block px-3 py-2 text-white hover:text-purple-400 transition-colors">
                Projects
              </a>
              <a href="#contact" className="block px-3 py-2 text-white hover:text-purple-400 transition-colors">
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
