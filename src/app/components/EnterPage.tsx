'use client'

interface EnterPageProps {
  onEnter: () => void
}

export function EnterPage({ onEnter }: EnterPageProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background video placeholder - you can replace with actual video */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20"></div>
      
      {/* Click to enter text */}
      <div className="relative z-10 text-center">
        <button
          onClick={onEnter}
          className="text-white text-2xl font-light hover:text-gray-300 transition-colors cursor-pointer"
        >
          click to enter...
        </button>
      </div>

    </div>
  )
}
