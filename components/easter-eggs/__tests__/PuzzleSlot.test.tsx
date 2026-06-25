import { render } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { PuzzleSlot } from '../PuzzleSlot'
import { useThemeStore } from '@/lib/store/themeStore'

beforeEach(() => {
  useThemeStore.setState({ unlockedPlanets: [], activeTheme: null })
})

describe('PuzzleSlot', () => {
  it('renders placeholder when no children', () => {
    const { container } = render(<PuzzleSlot planetId="mercury" />)
    const placeholder = container.querySelector('div[class*="text-white"]')
    expect(placeholder).not.toBeNull()
    expect(placeholder?.textContent).toBe('???')
  })

  it('renders children when provided', () => {
    const { getByText } = render(
      <PuzzleSlot planetId="mercury">
        <div>Test Child Content</div>
      </PuzzleSlot>
    )
    expect(getByText('Test Child Content')).not.toBeNull()
  })
})
