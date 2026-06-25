'use client'
import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { parseCommand } from '@/lib/terminal/parser'

interface TerminalProps {
  open: boolean
  onClose: () => void
}

interface Line {
  type: 'input' | 'output'
  content: string
  cwd: string[]
}

export function Terminal({ open, onClose }: TerminalProps) {
  const [lines, setLines] = useState<Line[]>([
    { type: 'output', content: 'zohaib@mission-control — type "help" to get started', cwd: [] },
  ])
  const [input, setInput] = useState('')
  const [cwd, setCwd] = useState<string[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [histIndex, setHistIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  // Keyboard shortcut: backtick to close
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === '`') {
        e.preventDefault()
        if (!open) return // only close via onClose prop
        onClose()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  const submit = () => {
    const trimmed = input.trim()
    const inputLine: Line = { type: 'input', content: trimmed, cwd: [...cwd] }

    if (trimmed === 'clear') {
      setLines([])
      setInput('')
      return
    }
    if (trimmed === 'exit' || trimmed === 'close') {
      onClose()
      setInput('')
      return
    }

    // Handle cd for cwd tracking
    let nextCwd = [...cwd]
    if (trimmed.startsWith('cd ')) {
      const arg = trimmed.slice(3).replace('/', '')
      if (arg === '..' || arg === '') nextCwd = nextCwd.slice(0, -1)
      else if (['experience', 'projects'].includes(arg)) nextCwd = [arg]
    }

    const output = parseCommand(trimmed, cwd)
    const outputLine: Line = { type: 'output', content: output, cwd: nextCwd }

    setLines(l => [...l, inputLine, ...(output ? [outputLine] : [])])
    setCwd(nextCwd)
    setHistory(h => [trimmed, ...h])
    setHistIndex(-1)
    setInput('')
  }

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit()
    if (e.key === 'ArrowUp') {
      const i = Math.min(histIndex + 1, history.length - 1)
      setHistIndex(i)
      setInput(history[i] ?? '')
    }
    if (e.key === 'ArrowDown') {
      const i = Math.max(histIndex - 1, -1)
      setHistIndex(i)
      setInput(i === -1 ? '' : history[i])
    }
  }

  const prompt = `zohaib@mission-control:${cwd.length > 0 ? `~/${cwd.join('/')}` : '~'}$`

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed inset-x-4 bottom-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2
            md:w-[680px] z-[60] rounded-xl overflow-hidden shadow-2xl border border-white/10"
        >
          {/* Title bar */}
          <div className="bg-[#1e1e1e] flex items-center gap-2 px-4 py-3 border-b border-white/5">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="flex-1 text-center text-[11px] text-white/30 font-mono">Terminal</span>
          </div>
          {/* Output */}
          <div
            className="bg-[#0d0d0d] font-mono text-sm h-80 overflow-y-auto p-4 space-y-1"
            onClick={() => inputRef.current?.focus()}
          >
            {lines.map((line, i) => (
              <div key={i}>
                {line.type === 'input' ? (
                  <p>
                    <span className="text-[#20C8E8]">{`zohaib@mission-control:~$ `}</span>
                    <span className="text-white">{line.content}</span>
                  </p>
                ) : (
                  <p className="text-[#a8b1be] whitespace-pre-wrap">{line.content}</p>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          {/* Input */}
          <div className="bg-[#0d0d0d] border-t border-white/5 px-4 py-3 flex items-center gap-2 font-mono text-sm">
            <span className="text-[#20C8E8] flex-shrink-0">{prompt}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              className="flex-1 bg-transparent text-white outline-none caret-accent"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
