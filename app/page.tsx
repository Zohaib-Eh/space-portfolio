'use client'
import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { PlanetTracker } from '@/components/ui/PlanetTracker'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Experience } from '@/components/sections/Experience'

export default function Home() {
  const [terminalOpen, setTerminalOpen] = useState(false)

  return (
    <main>
      <Navbar />
      <PlanetTracker />
      <Hero onOpenTerminal={() => setTerminalOpen(true)} />
      <About />
      <Experience />
      {/* Sections added in subsequent tasks */}
    </main>
  )
}
