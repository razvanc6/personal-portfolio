'use client'

import { useRef, useEffect } from 'react'

interface TiltedCardProps {
  children: React.ReactNode
  className?: string
  tiltMax?: number
}

export function TiltedCard({ children, className = '', tiltMax = 15 }: TiltedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  // Tilt effect disabled - keeping component for consistency

  return (
    <div
      ref={cardRef}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  )
}
