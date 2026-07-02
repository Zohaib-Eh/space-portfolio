'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TARGET = [1, 0, 1, 1, 0, 1, 0, 0] // decimal 180

function toDec(bits: number[]): number {
  return bits.reduce((acc, b, i) => acc + b * Math.pow(2, 7 - i), 0)
}

interface BinaryTogglePuzzleProps {
  onSolve: () => void
}

export function BinaryToggle({ onSolve }: BinaryTogglePuzzleProps) {
  const [bits, setBits] = useState([0, 0, 0, 0, 0, 0, 0, 0])
  const [solved, setSolved] = useState(false)

  const toggleBit = useCallback((index: number) => {
    if (solved) return
    setBits(prev => {
      const next = [...prev]
      next[index] = next[index] === 0 ? 1 : 0
      return next
    })
  }, [solved])

  useEffect(() => {
    if (bits.every((b, i) => b === TARGET[i])) {
      setSolved(true)
      const timer = setTimeout(() => {
        onSolve()
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [bits, onSolve])

  const currentDec = toDec(bits)
  const targetDec = toDec(TARGET)

  return (
    <div className="flex flex-col items-center gap-5 py-4 font-mono select-none">
      {/* Title */}
      <p className="text-[10px] tracking-[0.3em] uppercase text-white/40">
        Binary Toggle
      </p>

      {/* Target row */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-[10px] tracking-widest uppercase text-white/40">target</span>
        <div className="flex gap-2">
          {TARGET.map((bit, i) => (
            <div
              key={i}
              className="w-11 h-11 rounded-lg flex items-center justify-center text-base font-bold transition-all duration-200"
              style={{
                background: bit === 1 ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${bit === 1 ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`,
                color: bit === 1 ? '#818cf8' : 'rgba(255,255,255,0.25)',
              }}
            >
              {bit}
            </div>
          ))}
        </div>
        <span className="text-xs text-white/30">
          = <span className="text-indigo-400">{targetDec}</span>
        </span>
      </div>

      {/* Divider */}
      <div className="w-full max-w-xs border-t border-white/8" />

      {/* Player row */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-[10px] tracking-widest uppercase text-white/40">your value</span>
        <AnimatePresence mode="wait">
          <motion.div
            key={solved ? 'solved' : 'active'}
            className="flex gap-2"
            animate={solved ? { scale: [1, 1.04, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            {bits.map((bit, i) => (
              <motion.button
                key={i}
                onClick={() => toggleBit(i)}
                disabled={solved}
                whileTap={solved ? {} : { scale: 0.88 }}
                whileHover={solved ? {} : { scale: 1.08 }}
                className="w-11 h-11 rounded-lg flex items-center justify-center text-base font-bold transition-colors duration-150 cursor-pointer disabled:cursor-default"
                style={{
                  background: solved
                    ? 'rgba(34,197,94,0.2)'
                    : bit === 1
                      ? 'rgba(99,102,241,0.25)'
                      : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${
                    solved
                      ? 'rgba(34,197,94,0.6)'
                      : bit === 1
                        ? 'rgba(99,102,241,0.65)'
                        : 'rgba(255,255,255,0.10)'
                  }`,
                  color: solved
                    ? '#86efac'
                    : bit === 1
                      ? '#a5b4fc'
                      : 'rgba(255,255,255,0.30)',
                  boxShadow: bit === 1 && !solved
                    ? '0 0 10px rgba(99,102,241,0.25)'
                    : solved
                      ? '0 0 10px rgba(34,197,94,0.2)'
                      : 'none',
                }}
              >
                {bit}
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>
        <span className="text-xs text-white/30">
          ={' '}
          <motion.span
            key={currentDec}
            className={solved ? 'text-green-400' : 'text-indigo-400'}
            initial={{ opacity: 0.4, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            {currentDec}
          </motion.span>
        </span>
      </div>

      {/* Solved message */}
      <AnimatePresence>
        {solved && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[11px] tracking-widest uppercase text-green-400"
          >
            ✓ Correct — {targetDec}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
