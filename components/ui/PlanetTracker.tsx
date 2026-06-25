'use client'
import { useThemeStore } from '@/lib/store/themeStore'
import { planets } from '@/lib/data/planets'

export function PlanetTracker() {
  const { unlockedPlanets, activeTheme, setActiveTheme } = useThemeStore()

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2 items-center">
      <span className="text-white/30 text-[10px] mb-1 tracking-widest uppercase">Planets</span>
      {planets.map(planet => {
        const unlocked = unlockedPlanets.includes(planet.id)
        const active = activeTheme === planet.id
        return (
          <button
            key={planet.id}
            title={unlocked ? planet.name : '???'}
            onClick={() => unlocked && setActiveTheme(planet.id)}
            disabled={!unlocked}
            className={`w-5 h-5 rounded-full border transition-all duration-300
              ${unlocked
                ? 'border-white/40 cursor-pointer hover:scale-125'
                : 'border-white/10 cursor-not-allowed bg-white/5'}
              ${active ? 'scale-125 ring-2 ring-offset-1 ring-offset-bg' : ''}`}
            style={unlocked ? {
              backgroundColor: planet.accentColor,
              boxShadow: active ? `0 0 10px ${planet.accentColor}` : undefined,
              // @ts-ignore
              '--tw-ring-color': planet.accentColor,
            } : {}}
          />
        )
      })}
    </div>
  )
}
