'use client'

import { useRef, useEffect, useState } from 'react'

interface SpotlightCardProps {
  children: React.ReactNode
  className?: string
}

export function SpotlightCard({ children, className = '' }: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setMousePosition({ x, y })
    }

    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 })
    }

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="absolute pointer-events-none opacity-0 transition-opacity duration-300"
        style={{
          left: mousePosition.x - 100,
          top: mousePosition.y - 100,
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
          opacity: mousePosition.x > 0 && mousePosition.y > 0 ? 1 : 0,
        }}
      />
      {children}
    </div>
  )
}
