'use client'
import React from 'react'
import { useThemeStore } from '@/lib/store/themeStore'
import type { PlanetId } from '@/lib/data/planets'
import { planets } from '@/lib/data/planets'

interface PuzzleSlotProps {
  planetId: PlanetId
  children?: React.ReactNode
}

export function PuzzleSlot({ planetId, children }: PuzzleSlotProps) {
  const { unlockPlanet, unlockedPlanets } = useThemeStore()
  const planet = planets.find(p => p.id === planetId)!
  const alreadyUnlocked = unlockedPlanets.includes(planetId)

  const handleSolve = () => {
    unlockPlanet(planetId)
  }

  if (!children) {
    // Placeholder — shows when no puzzle is dropped in
    return (
      <div className="border border-dashed border-white/20 rounded-lg p-4 text-center text-white/30 text-xs font-mono">
        ???
      </div>
    )
  }

  if (alreadyUnlocked) {
    return (
      <div className="text-center py-2">
        <span className="text-[10px] tracking-widest uppercase" style={{ color: planet.accentColor }}>
          {planet.name} unlocked ✓
        </span>
      </div>
    )
  }

  // Render puzzle with solve callback injected via cloneElement
  return (
    <div>
      {children && React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<{ onSolve: () => void }>, { onSolve: handleSolve })
        : children}
    </div>
  )
}
