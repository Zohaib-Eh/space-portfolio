'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PlanetId } from '@/lib/data/planets'

interface ThemeStore {
  unlockedPlanets: PlanetId[]
  activeTheme: PlanetId | null
  unlockPlanet: (planet: PlanetId) => void
  setActiveTheme: (planet: PlanetId) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      unlockedPlanets: [],
      activeTheme: null,
      unlockPlanet: (planet) =>
        set((s) => ({
          unlockedPlanets: s.unlockedPlanets.includes(planet)
            ? s.unlockedPlanets
            : [...s.unlockedPlanets, planet],
        })),
      setActiveTheme: (planet) => set({ activeTheme: planet }),
    }),
    { name: 'zohaib-portfolio-theme' }
  )
)
