'use client'
import { useEffect } from 'react'
import { useThemeStore } from '@/lib/store/themeStore'
import { planets } from '@/lib/data/planets'

export function ThemeInjector() {
  const activeTheme = useThemeStore((s) => s.activeTheme)

  useEffect(() => {
    const planet = planets.find(p => p.id === activeTheme)
    document.documentElement.style.setProperty(
      '--accent',
      planet ? planet.accentColor : '#ffffff'
    )
  }, [activeTheme])

  return null
}
