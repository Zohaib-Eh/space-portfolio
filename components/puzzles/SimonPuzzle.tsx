'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const COLORS = [
  { id: 'red',    hex: '#ef4444' },
  { id: 'blue',   hex: '#3b82f6' },
  { id: 'green',  hex: '#22c55e' },
  { id: 'yellow', hex: '#eab308' },
]

const SEQUENCE_LENGTH = 5

type Phase = 'idle' | 'showing' | 'input' | 'success' | 'fail'

interface SimonPuzzleProps {
  onSolve: () => void
}

function randomSequence(len: number) {
  return Array.from({ length: len }, () => COLORS[Math.floor(Math.random() * 4)].id)
}

export function SimonPuzzle({ onSolve }: SimonPuzzleProps) {
  const [sequence] = useState(() => randomSequence(SEQUENCE_LENGTH))
  const [phase, setPhase] = useState<Phase>('idle')
  const [activeButton, setActiveButton] = useState<string | null>(null)
  const [playerInput, setPlayerInput] = useState<string[]>([])
  const [status, setStatus] = useState('watch the sequence')
  const solvedRef = useRef(false)

  const playSequence = useCallback(() => {
    setPhase('showing')
    setStatus('watch the sequence')
    setPlayerInput([])
    let i = 0
    const step = () => {
      if (i >= sequence.length) {
        setActiveButton(null)
        setTimeout(() => {
          setPhase('input')
          setStatus('your turn — repeat it')
        }, 400)
        return
      }
      setActiveButton(sequence[i])
      setTimeout(() => {
        setActiveButton(null)
        i++
        setTimeout(step, 200)
      }, 600)
    }
    step()
  }, [sequence])

  useEffect(() => {
    const t = setTimeout(playSequence, 800)
    return () => clearTimeout(t)
  }, [playSequence])

  function handleClick(colorId: string) {
    if (phase !== 'input' || solvedRef.current) return
    setActiveButton(colorId)
    setTimeout(() => setActiveButton(null), 200)

    const next = [...playerInput, colorId]
    const idx = next.length - 1

    if (next[idx] !== sequence[idx]) {
      setPhase('fail')
      setStatus('wrong — watch again')
      setTimeout(playSequence, 1200)
      setPlayerInput([])
      return
    }

    setPlayerInput(next)

    if (next.length === sequence.length) {
      solvedRef.current = true
      setPhase('success')
      setStatus('✓ unlocked')
      setTimeout(onSolve, 1000)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4 select-none">
      <p className="text-[10px] tracking-[0.3em] uppercase text-white/40">Color Sequence</p>

      <div className="grid grid-cols-2 gap-3">
        {COLORS.map(({ id, hex }) => {
          const isActive = activeButton === id
          return (
            <motion.button
              key={id}
              onClick={() => handleClick(id)}
              disabled={phase !== 'input'}
              whileTap={phase === 'input' ? { scale: 0.93 } : {}}
              className="w-24 h-24 rounded-2xl transition-all duration-100 cursor-pointer disabled:cursor-default"
              style={{
                background: isActive ? hex : hex + '28',
                border: `2px solid ${hex}${isActive ? 'ff' : '50'}`,
                boxShadow: isActive ? `0 0 28px ${hex}90` : 'none',
                opacity: phase === 'input' ? 1 : 0.7,
              }}
            />
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={status}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-xs font-mono tracking-widest"
          style={{ color: phase === 'success' ? '#22c55e' : phase === 'fail' ? '#ef4444' : 'rgba(255,255,255,0.4)' }}
        >
          {status}
        </motion.p>
      </AnimatePresence>

      <div className="flex gap-1.5">
        {sequence.map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all duration-200"
            style={{
              background: i < playerInput.length
                ? '#22c55e'
                : 'rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
