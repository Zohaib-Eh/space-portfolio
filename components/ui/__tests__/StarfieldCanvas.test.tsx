import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StarfieldCanvas } from '../StarfieldCanvas'

describe('StarfieldCanvas', () => {
  it('renders a canvas element', () => {
    const { container } = render(<StarfieldCanvas />)
    expect(container.querySelector('canvas')).not.toBeNull()
  })
})
