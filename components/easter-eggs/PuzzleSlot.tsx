'use client'
import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '@/lib/store/themeStore'
import type { PlanetId } from '@/lib/data/planets'
import { planets } from '@/lib/data/planets'

const PUZZLE_NAMES: Partial<Record<PlanetId, string>> = {
  mercury: 'Color Sequence',
  venus:   'Caesar Cipher',
  mars:    'Binary Toggle',
  jupiter: 'Logic Gates',
  saturn:  'Mastermind',
  uranus:  'Lights Out',
  neptune: 'Sliding Puzzle',
  earth:   'Minesweeper',
}

interface PuzzleSlotProps {
  planetId: PlanetId
  children?: React.ReactNode
}

const PLANETS_WITH_IMAGE: PlanetId[] = ['mars', 'neptune', 'saturn', 'venus', 'mercury', 'jupiter', 'uranus', 'earth']

function PuzzleCard({
  planet,
  planetId,
  puzzleName,
  onOpenPuzzle,
}: {
  planet: { name: string; accentColor: string }
  planetId: PlanetId
  puzzleName?: string
  onOpenPuzzle?: () => void
}) {
  const { setActiveTheme, unlockedPlanets, activeTheme } = useThemeStore()
  const solved = unlockedPlanets.includes(planetId)
  const hasImage = PLANETS_WITH_IMAGE.includes(planetId)
  const c = planet.accentColor
  const [shaking, setShaking] = useState(false)

  // Periodic shake hint for unsolved cards
  useEffect(() => {
    if (solved) return
    const interval = Math.random() * 5000 + 10000 // 10–15s, randomised so cards don't sync
    const t = setInterval(() => {
      setShaking(true)
      setTimeout(() => setShaking(false), 600)
    }, interval)
    return () => clearInterval(t)
  }, [solved])

  function handleClick() {
    if (solved) {
      setActiveTheme(activeTheme === planetId ? null as unknown as PlanetId : planetId)
    } else {
      onOpenPuzzle?.()
    }
  }

  return (
    <motion.div
      onClick={handleClick}
      animate={shaking ? {
        x: [0, -6, 6, -5, 5, -3, 3, 0],
        transition: { duration: 0.55, ease: 'easeInOut' },
      } : {}}
      className="relative rounded-2xl overflow-hidden h-40 cursor-pointer select-none transition-all duration-500"
      style={{
        border: `1px solid ${solved ? c : c + '35'}`,
        boxShadow: solved ? `0 0 24px ${c}40, 0 0 6px ${c}20` : 'none',
      }}
    >
      {hasImage ? (
        <img
          src={`/planets/${planetId}.png`}
          alt={planet.name}
          className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700"
          style={{ filter: solved ? 'brightness(1.15) saturate(1.2)' : 'brightness(0.85) saturate(0.9)' }}
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0 transition-all duration-500" style={{ background: solved ? `${c}22` : `${c}10` }} />
      )}

      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: solved
            ? `linear-gradient(to top, ${c}55 0%, rgba(0,0,0,0.1) 60%, transparent 100%)`
            : 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 60%, transparent 100%)',
        }}
      />

      {solved && (
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${c}08 3px, ${c}08 4px)`,
        }} />
      )}

      <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 flex items-end justify-between">
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase mb-0.5 transition-colors duration-300"
            style={{ color: solved ? c : c + 'cc' }}>
            {solved ? 'Unlocked' : 'Puzzle'}
          </p>
          <p className="text-lg font-bold leading-none transition-colors duration-300"
            style={{ color: solved ? '#fff' : '#ffffffcc' }}>
            {planet.name}
          </p>
        </div>
        {solved ? (
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${c}30`, color: c, border: `1px solid ${c}60` }}>
            ✓ solved
          </span>
        ) : (
          <span className="text-xs font-mono text-white/40 border border-white/15 rounded-full px-2 py-0.5">
            {puzzleName ? puzzleName : 'click to play'}
          </span>
        )}
      </div>
    </motion.div>
  )
}

function PuzzleModal({
  planet,
  children,
  onClose,
  onSolve,
}: {
  planet: { name: string; accentColor: string }
  children: React.ReactNode
  onClose: () => void
  onSolve: () => void
}) {
  const c = planet.accentColor
  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Prevent scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const modal = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
      style={{ background: 'rgba(5,5,16,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', damping: 20, stiffness: 260 }}
        className="relative w-full max-w-lg rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(10,10,24,0.95)',
          border: `1px solid ${c}40`,
          boxShadow: `0 0 60px ${c}20`,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <p className="text-[10px] tracking-[0.3em] uppercase font-mono" style={{ color: c }}>
            Puzzle · {planet.name}
          </p>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/70 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-6">
          {React.isValidElement(children)
            ? React.cloneElement(children as React.ReactElement<{ onSolve: () => void }>, {
                onSolve: () => { onSolve(); setTimeout(onClose, 1200) },
              })
            : children}
        </div>
      </motion.div>
    </motion.div>
  )

  return createPortal(modal, document.body)
}

export function PuzzleSlot({ planetId, children }: PuzzleSlotProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const { unlockPlanet, unlockedPlanets } = useThemeStore()
  const planet = planets.find(p => p.id === planetId)!
  const alreadyUnlocked = unlockedPlanets.includes(planetId)

  function handleSolve() {
    unlockPlanet(planetId)
  }

  return (
    <>
      <PuzzleCard
        planet={planet}
        planetId={planetId}
        puzzleName={PUZZLE_NAMES[planetId]}
        onOpenPuzzle={children && !alreadyUnlocked ? () => setModalOpen(true) : undefined}
      />
      <AnimatePresence>
        {modalOpen && children && (
          <PuzzleModal
            planet={planet}
            onClose={() => setModalOpen(false)}
            onSolve={handleSolve}
          >
            {children}
          </PuzzleModal>
        )}
      </AnimatePresence>
    </>
  )
}
