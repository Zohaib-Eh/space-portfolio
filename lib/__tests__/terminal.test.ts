import { describe, it, expect } from 'vitest'
import { parseCommand } from '../terminal/parser'

describe('terminal parser', () => {
  it('returns help text for "help"', () => {
    expect(parseCommand('help', [])).toContain('available commands')
  })

  it('lists files for "ls" at root', () => {
    const out = parseCommand('ls', [])
    expect(out).toContain('about.txt')
    expect(out).toContain('experience/')
    expect(out).toContain('projects/')
  })

  it('returns about text for "cat about.txt"', () => {
    const out = parseCommand('cat about.txt', [])
    expect(out).toContain('Zohaib Ehtesham')
  })

  it('changes directory for "cd experience/"', () => {
    const result = parseCommand('cd experience/', [])
    expect(result).toContain('experience')
  })

  it('returns error for unknown command', () => {
    const out = parseCommand('unknowncmd', [])
    expect(out).toContain('command not found')
  })

  it('returns secret message for "cat secret.txt"', () => {
    const out = parseCommand('cat secret.txt', [])
    expect(out).toContain('nice try')
  })
})
