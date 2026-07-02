'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SOLVED = [1, 2, 3, 0]
const INITIAL = [3, 1, 0, 2]

interface SlidingPuzzleProps {
  onSolve: () => void
}

export function SlidingPuzzle({ onSolve }: SlidingPuzzleProps) {
  const [tiles, setTiles] = useState([...INITIAL])
  const [moves, setMoves] = useState(0)
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    if (moves > 0 && tiles.every((t, i) => t === SOLVED[i]) && !solved) {
      setSolved(true)
      setTimeout(onSolve, 800)
    }
  }, [tiles, moves, solved, onSolve])

  function canSlide(idx: number): boolean {
    const emptyIdx = tiles.indexOf(0)
    const r = (i: number) => Math.floor(i / 2)
    const c = (i: number) => i % 2
    return (
      (r(idx) === r(emptyIdx) && Math.abs(c(idx) - c(emptyIdx)) === 1) ||
      (c(idx) === c(emptyIdx) && Math.abs(r(idx) - r(emptyIdx)) === 1)
    )
  }

  function slide(idx: number) {
    if (!canSlide(idx) || solved) return
    const emptyIdx = tiles.indexOf(0)
    const next = [...tiles]
    ;[next[idx], next[emptyIdx]] = [next[emptyIdx], next[idx]]
    setTiles(next)
    setMoves(m => m + 1)
  }

  return (
    <div className="flex flex-col items-center gap-5 py-4 select-none">
      <p className="text-[10px] tracking-[0.3em] uppercase text-white/40">Sliding Puzzle</p>
      <p className="text-xs text-white/30 font-mono">arrange: 1 2 / 3 _</p>

      <div className="grid grid-cols-2 gap-2">
        {tiles.map((tile, i) => (
          <motion.button
            key={i}
            onClick={() => slide(i)}
            disabled={tile === 0 || solved}
            whileTap={tile !== 0 && !solved ? { scale: 0.93 } : {}}
            layout
            className="w-[90px] h-[90px] rounded-xl flex items-center justify-center text-3xl font-bold font-mono border-2 transition-all duration-150"
            style={tile === 0 ? {
              background: 'rgba(255,255,255,0.02)',
              borderColor: 'rgba(255,255,255,0.06)',
              borderStyle: 'dashed',
              cursor: 'default',
            } : {
              background: solved ? 'rgba(34,197,94,0.15)' : canSlide(i) ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.07)',
              borderColor: solved ? 'rgba(34,197,94,0.5)' : canSlide(i) ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.12)',
              color: solved ? '#86efac' : canSlide(i) ? '#a5b4fc' : 'rgba(255,255,255,0.7)',
              cursor: canSlide(i) && !solved ? 'pointer' : 'default',
            }}
          >
            {tile !== 0 ? tile : ''}
          </motion.button>
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
            ✓ solved
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
