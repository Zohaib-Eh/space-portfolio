'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// All on except center — solution: click corners (0,2,6,8) + center (4) = 5 moves
const INITIAL = [1, 1, 1, 1, 0, 1, 1, 1, 1]

interface LightsOutProps {
  onSolve: () => void
}

function getNeighbors(idx: number): number[] {
  const neighbors = [idx]
  const row = Math.floor(idx / 3)
  const col = idx % 3
  if (row > 0) neighbors.push(idx - 3)
  if (row < 2) neighbors.push(idx + 3)
  if (col > 0) neighbors.push(idx - 1)
  if (col < 2) neighbors.push(idx + 1)
  return neighbors
}

export function LightsOut({ onSolve }: LightsOutProps) {
  const [grid, setGrid] = useState([...INITIAL])
  const [moves, setMoves] = useState(0)
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    if (grid.every(c => c === 0) && !solved && moves > 0) {
      setSolved(true)
      setTimeout(onSolve, 800)
    }
  }, [grid, solved, moves, onSolve])

  function toggle(idx: number) {
    if (solved) return
    const next = [...grid]
    getNeighbors(idx).forEach(n => { next[n] = next[n] === 1 ? 0 : 1 })
    setGrid(next)
    setMoves(m => m + 1)
  }

  return (
    <div className="flex flex-col items-center gap-5 py-4 select-none">
      <p className="text-[10px] tracking-[0.3em] uppercase text-white/40">Lights Out</p>
      <p className="text-xs text-white/30 font-mono">turn all lights off</p>

      <div className="grid grid-cols-3 gap-2">
        {grid.map((on, i) => (
          <motion.button
            key={i}
            onClick={() => toggle(i)}
            disabled={solved}
            whileTap={solved ? {} : { scale: 0.88 }}
            className="w-[72px] h-[72px] rounded-xl border-2 transition-all duration-200 disabled:cursor-default"
            style={{
              background: on ? 'rgba(250,204,21,0.85)' : 'rgba(255,255,255,0.04)',
              borderColor: on ? '#facc15' : 'rgba(255,255,255,0.08)',
              boxShadow: on ? '0 0 16px rgba(250,204,21,0.6)' : 'none',
            }}
            animate={on ? { opacity: 1 } : { opacity: 0.6 }}
          />
        ))}
      </div>

      <p className="text-xs font-mono text-white/20">moves: {moves}</p>

      <AnimatePresence>
        {solved && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-mono text-green-400 tracking-widest"
          >
            ✓ all dark
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
