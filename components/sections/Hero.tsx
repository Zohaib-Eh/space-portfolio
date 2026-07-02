'use client'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { StarfieldCanvas } from '@/components/ui/StarfieldCanvas'
import { RotatingText } from '@/components/ui/RotatingText'
import { PuzzleSlot } from '@/components/easter-eggs/PuzzleSlot'
import { SimonPuzzle } from '@/components/puzzles/SimonPuzzle'

const RubiksCube = dynamic(
  () => import('@/components/easter-eggs/RubiksCube').then((m) => ({ default: m.RubiksCube })),
  { ssr: false }
)

interface HeroProps {
  onOpenTerminal: () => void
}

export function Hero({ onOpenTerminal }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center">
      <StarfieldCanvas />
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-16 px-6 max-w-6xl mx-auto w-full">
        {/* Text content */}
        <div className="text-center md:text-left flex-1">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-sm tracking-[0.3em] uppercase mb-4"
          >
            Hello, I&apos;m
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-serif text-6xl md:text-8xl font-bold mb-4 leading-none"
          >
            Zohaib Ehtesham
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-2xl md:text-3xl font-light mb-8 text-white/80"
          >
            <RotatingText />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            <a
              href="#projects"
              className="px-8 py-3 bg-accent text-bg font-semibold rounded-full hover:opacity-90 transition-opacity"
              style={{ color: '#050510' }}
            >
              See My Work
            </a>
            <button
              onClick={onOpenTerminal}
              className="px-8 py-3 border border-white/20 rounded-full hover:border-accent hover:text-accent transition-colors font-mono text-sm"
            >
              &gt;_ Mission Control
            </button>
          </motion.div>
        </div>
        {/* Rubik's cube easter egg — hidden on mobile */}
        <div className="hidden md:flex flex-shrink-0 items-center justify-center">
          <RubiksCube />
        </div>
      </div>
      <div className="absolute bottom-8 w-full px-6 max-w-5xl left-1/2 -translate-x-1/2">
        <PuzzleSlot planetId="mercury"><SimonPuzzle onSolve={() => {}} /></PuzzleSlot>
      </div>
    </section>
  )
}
