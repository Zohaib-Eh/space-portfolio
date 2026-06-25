'use client'
import { useState } from 'react'
import { useThemeStore } from '@/lib/store/themeStore'
import { planets } from '@/lib/data/planets'

export function PlanetDropdown() {
  const [open, setOpen] = useState(false)
  const { unlockedPlanets, activeTheme, setActiveTheme } = useThemeStore()

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-xs hover:border-accent transition-colors"
        aria-label="Theme selector"
      >
        🪐
      </button>
      {open && (
        <div className="absolute right-0 mt-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col gap-2 min-w-[140px] z-50">
          {planets.map(planet => {
            const unlocked = unlockedPlanets.includes(planet.id)
            const active = activeTheme === planet.id
            return (
              <button
                key={planet.id}
                disabled={!unlocked}
                onClick={() => { setActiveTheme(planet.id); setOpen(false) }}
                className={`flex items-center gap-2 text-sm px-2 py-1 rounded-lg transition-colors
                  ${unlocked ? 'hover:bg-white/10 cursor-pointer' : 'opacity-30 cursor-not-allowed'}
                  ${active ? 'bg-white/10' : ''}`}
              >
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: planet.accentColor }}
                />
                <span>{planet.name}</span>
                {!unlocked && <span className="ml-auto text-xs">🔒</span>}
              </button>
            )
          })}
          <p className="text-white/30 text-[10px] text-center pt-1 border-t border-white/10">
            solve puzzles to unlock
          </p>
        </div>
      )}
    </div>
  )
}
