'use client'

import { useState } from 'react'
import { MainPage } from './components/MainPage'
import { EnterPage } from './components/EnterPage'

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false)

  if (!hasEntered) {
    return <EnterPage onEnter={() => setHasEntered(true)} />
  }

  return <MainPage />
}
