'use client'
import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { PlanetTracker } from '@/components/ui/PlanetTracker'
import { Hero } from '@/components/sections/Hero'

export default function Home() {
  const [terminalOpen, setTerminalOpen] = useState(false)

  return (
    <main>
      <Navbar />
      <PlanetTracker />
      <Hero onOpenTerminal={() => setTerminalOpen(true)} />
      {/* Sections added in subsequent tasks */}
    </main>
  )
}
