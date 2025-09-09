'use client'

import { useState, useRef, useEffect } from 'react'

interface ElasticSliderProps {
  min?: number
  max?: number
  value?: number
  onChange?: (value: number) => void
  className?: string
}

export function ElasticSlider({ 
  min = 0, 
  max = 100, 
  value = 0, 
  onChange, 
  className = '' 
}: ElasticSliderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [localValue, setLocalValue] = useState(value)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    updateValue(e.clientX)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    updateValue(e.clientX)
  }

  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) return
    updateValue(e.clientX)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(true)
    updateValue(e.touches[0].clientX)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return
    e.preventDefault()
    updateValue(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const updateValue = (clientX: number) => {
    if (!sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const newValue = min + percentage * (max - min)
    
    setLocalValue(newValue)
    onChange?.(newValue)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('touchend', handleTouchEnd)
      document.body.style.userSelect = 'none'
    } else {
      document.body.style.userSelect = ''
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
      document.body.style.userSelect = ''
    }
  }, [isDragging])

  const percentage = ((localValue - min) / (max - min)) * 100

  return (
    <div
      ref={sliderRef}
      className={`relative bg-gray-700/50 rounded-full cursor-pointer ${className}`}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
    >
      <div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full transition-all duration-200 ease-out shadow-lg"
        style={{ width: `${percentage}%` }}
      />
      <div
        className="absolute top-1/2 w-6 h-6 bg-white rounded-full shadow-xl transform -translate-y-1/2 transition-all duration-200 ease-out hover:scale-125 border-2 border-purple-400 cursor-grab active:cursor-grabbing"
        style={{ 
          left: `calc(${percentage}% - 12px)`,
          transform: `translateY(-50%) ${isDragging ? 'scale(1.4)' : 'scale(1)'}`,
          boxShadow: isDragging ? '0 0 25px rgba(139, 92, 246, 0.8)' : '0 4px 15px rgba(0, 0, 0, 0.4)'
        }}
      />
    </div>
  )
}
