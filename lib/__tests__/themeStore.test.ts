import { describe, it, expect, beforeEach } from 'vitest'
import { useThemeStore } from '../store/themeStore'

beforeEach(() => {
  useThemeStore.setState({ unlockedPlanets: [], activeTheme: null })
})

describe('useThemeStore', () => {
  it('starts with no unlocked planets', () => {
    expect(useThemeStore.getState().unlockedPlanets).toEqual([])
  })

  it('unlocks a planet', () => {
    useThemeStore.getState().unlockPlanet('mars')
    expect(useThemeStore.getState().unlockedPlanets).toContain('mars')
  })

  it('does not duplicate an already-unlocked planet', () => {
    useThemeStore.getState().unlockPlanet('mars')
    useThemeStore.getState().unlockPlanet('mars')
    expect(useThemeStore.getState().unlockedPlanets.filter(p => p === 'mars')).toHaveLength(1)
  })

  it('sets active theme', () => {
    useThemeStore.getState().unlockPlanet('neptune')
    useThemeStore.getState().setActiveTheme('neptune')
    expect(useThemeStore.getState().activeTheme).toBe('neptune')
  })
})
