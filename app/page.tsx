'use client'
import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { PlanetTracker } from '@/components/ui/PlanetTracker'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Experience } from '@/components/sections/Experience'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'
import { Contact } from '@/components/sections/Contact'
import { Terminal } from '@/components/easter-eggs/Terminal'

export default function Home() {
  const [terminalOpen, setTerminalOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '`') setTerminalOpen(o => !o)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <main>
      <Navbar />
      <PlanetTracker />
      <Hero onOpenTerminal={() => setTerminalOpen(true)} />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
      {/* Sections added in subsequent tasks */}
      <Terminal open={terminalOpen} onClose={() => setTerminalOpen(false)} />
    </main>
  )
}
