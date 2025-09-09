'use client'

import { useState, useEffect } from 'react'

interface TypewriterEffectProps {
  text: string
  className?: string
  typeSpeed?: number
  deleteSpeed?: number
  pauseTime?: number
}

export function TypewriterEffect({ 
  text, 
  className = '', 
  typeSpeed = 100,
  deleteSpeed = 50,
  pauseTime = 2000
}: TypewriterEffectProps) {
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing phase
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1))
          setCurrentIndex(currentIndex + 1)
        } else {
          // Finished typing, wait then start deleting
          setTimeout(() => {
            setIsDeleting(true)
          }, pauseTime)
        }
      } else {
        // Deleting phase
        if (currentIndex > 0) {
          setDisplayText(text.slice(0, currentIndex - 1))
          setCurrentIndex(currentIndex - 1)
        } else {
          // Finished deleting, start typing again
          setIsDeleting(false)
        }
      }
    }, isDeleting ? deleteSpeed : typeSpeed)

    return () => clearTimeout(timer)
  }, [currentIndex, isDeleting, text, typeSpeed, deleteSpeed, pauseTime])

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  )
}
