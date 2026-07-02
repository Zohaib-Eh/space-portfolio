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
        className="flex items-center gap-2 h-10 px-4 rounded-full bg-white/8 backdrop-blur-md border border-white/25 hover:border-white/50 hover:bg-white/12 transition-all"
        aria-label="Theme selector"
        style={activeTheme ? { borderColor: 'var(--accent)', boxShadow: '0 0 14px var(--accent)50', background: 'var(--accent)18' } : {}}
      >
        <span className="text-2xl">🪐</span>
        <span className="text-xs font-mono text-white/60 tracking-[0.15em] uppercase">themes</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 bg-black/60 backdrop-blur-xl border border-white/15 rounded-2xl p-4 flex flex-col gap-1.5 min-w-[180px] z-50">
          <p className="text-white/60 text-[10px] tracking-[0.2em] uppercase mb-2 font-mono">
            Unlock via puzzles
          </p>
          {planets.map(planet => {
            const unlocked = unlockedPlanets.includes(planet.id)
            const active = activeTheme === planet.id
            return (
              <button
                key={planet.id}
                disabled={!unlocked}
                onClick={() => { setActiveTheme(planet.id); setOpen(false) }}
                className={`flex items-center gap-2.5 text-sm px-3 py-2 rounded-xl transition-colors w-full text-left
                  ${unlocked ? 'hover:bg-white/10 cursor-pointer' : 'opacity-25 cursor-not-allowed'}
                  ${active ? 'bg-white/10' : ''}`}
              >
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0 ring-1 ring-white/20"
                  style={{ backgroundColor: planet.accentColor }}
                />
                <span className="flex-1">{planet.name}</span>
                {active && <span className="text-[10px] font-mono" style={{ color: 'var(--accent)' }}>active</span>}
                {!unlocked && <span className="text-xs opacity-60">🔒</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
