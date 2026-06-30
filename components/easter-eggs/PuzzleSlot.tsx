'use client'
import React from 'react'
import { useThemeStore } from '@/lib/store/themeStore'
import type { PlanetId } from '@/lib/data/planets'
import { planets } from '@/lib/data/planets'

interface PuzzleSlotProps {
  planetId: PlanetId
  children?: React.ReactNode
}

const PLANETS_WITH_IMAGE: PlanetId[] = ['mars', 'neptune', 'saturn', 'venus', 'mercury', 'jupiter', 'uranus', 'earth']

function PuzzlePlaceholder({ planet, planetId }: { planet: { name: string; accentColor: string }; planetId: PlanetId }) {
  const { unlockPlanet, setActiveTheme, unlockedPlanets, activeTheme } = useThemeStore()
  const solved = unlockedPlanets.includes(planetId)
  const hasImage = PLANETS_WITH_IMAGE.includes(planetId)
  const c = planet.accentColor

  const handleToggle = () => {
    if (solved) {
      setActiveTheme(activeTheme === planetId ? null as unknown as PlanetId : planetId)
    } else {
      unlockPlanet(planetId)
    }
  }

  return (
    <div
      onClick={handleToggle}
      className="relative rounded-2xl overflow-hidden h-40 cursor-pointer select-none transition-all duration-500"
      style={{
        border: `1px solid ${solved ? c : c + '35'}`,
        boxShadow: solved ? `0 0 24px ${c}40, 0 0 6px ${c}20` : 'none',
      }}
    >
      {/* Background image or tint */}
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

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{ background: solved
          ? `linear-gradient(to top, ${c}55 0%, rgba(0,0,0,0.1) 60%, transparent 100%)`
          : 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 60%, transparent 100%)'
        }}
      />

      {/* Solved shimmer scanline */}
      {solved && (
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${c}08 3px, ${c}08 4px)`,
        }} />
      )}

      {/* Text */}
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
        {solved && (
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${c}30`, color: c, border: `1px solid ${c}60` }}>
            ✓ solved
          </span>
        )}
      </div>
    </div>
  )
}

export function PuzzleSlot({ planetId, children }: PuzzleSlotProps) {
  const { unlockPlanet, unlockedPlanets } = useThemeStore()
  const planet = planets.find(p => p.id === planetId)!
  const alreadyUnlocked = unlockedPlanets.includes(planetId)

  const handleSolve = () => {
    unlockPlanet(planetId)
  }

  if (!children) {
    return <PuzzlePlaceholder planet={planet} planetId={planetId} />
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
