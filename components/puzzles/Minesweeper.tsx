'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Grid layout (mines at 0 and 8 — diagonal corners):
//   [💣][ 1][ 0]
//   [ 1][ 2][ 1]
//   [ 0][ 1][💣]
// Clicking blank cell (2 or 6) auto-reveals its numbered neighbors.
// Board is fully logical: no guesswork needed.

const MINE_POSITIONS = new Set([0, 8])
const COLS = 3

function getNeighbors(idx: number): number[] {
  const r = Math.floor(idx / COLS), c = idx % COLS
  const out: number[] = []
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const nr = r + dr, nc = c + dc
      if (nr >= 0 && nr < COLS && nc >= 0 && nc < COLS) out.push(nr * COLS + nc)
    }
  }
  return out
}

type Cell = { mine: boolean; adjacent: number; revealed: boolean }

// Compute board from mine positions — no hardcoded adjacency values
const INITIAL: Cell[] = Array.from({ length: 9 }, (_, i) => ({
  mine: MINE_POSITIONS.has(i),
  adjacent: MINE_POSITIONS.has(i) ? 0 : getNeighbors(i).filter(n => MINE_POSITIONS.has(n)).length,
  revealed: false,
}))

const NUM_COLOR: Record<number, string> = { 1: '#3b82f6', 2: '#f59e0b' }

// Flood-fill: reveal blank (adjacent=0) cells and their numbered borders
function floodReveal(cells: Cell[], start: number): Cell[] {
  const next = cells.map(c => ({ ...c }))
  const queue = [start]
  const seen = new Set<number>()
  while (queue.length) {
    const idx = queue.shift()!
    if (seen.has(idx) || next[idx].mine) continue
    seen.add(idx)
    next[idx].revealed = true
    if (next[idx].adjacent === 0) {
      getNeighbors(idx).forEach(n => { if (!seen.has(n)) queue.push(n) })
    }
  }
  return next
}

interface MinesweeperProps {
  onSolve: () => void
}

export function Minesweeper({ onSolve }: MinesweeperProps) {
  const [cells, setCells] = useState<Cell[]>(INITIAL.map(c => ({ ...c })))
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)

  function reveal(idx: number) {
    if (gameOver || won || cells[idx].revealed) return

    if (cells[idx].mine) {
      // Show all mines on hit
      const next = cells.map(c => ({ ...c }))
      next.forEach(c => { if (c.mine) c.revealed = true })
      setGameOver(true)
      setCells(next)
      return
    }

    const next = floodReveal(cells, idx)
    const allSafe = next.filter(c => !c.mine).every(c => c.revealed)
    if (allSafe) {
      // Reveal mines on win
      next.forEach(c => { if (c.mine) c.revealed = true })
      setWon(true)
      setTimeout(onSolve, 800)
    }
    setCells(next)
  }

  function reset() {
    setCells(INITIAL.map(c => ({ ...c })))
    setGameOver(false)
    setWon(false)
  }

  const safeLeft = cells.filter(c => !c.mine && !c.revealed).length

  return (
    <div className="flex flex-col items-center gap-5 py-4 select-none">
      <p className="text-[10px] tracking-[0.3em] uppercase text-white/40">Minesweeper</p>
      <p className="text-xs text-white/30 font-mono">
        {won ? 'all clear!' : gameOver ? 'hit a mine' : `${safeLeft} safe cell${safeLeft !== 1 ? 's' : ''} left · 2 mines hidden`}
      </p>

      <div className="grid grid-cols-3 gap-1.5">
        {cells.map((cell, i) => {
          const clickable = !cell.revealed && !won && !gameOver

          return (
            <motion.button
              key={i}
              onClick={() => reveal(i)}
              disabled={!clickable}
              whileTap={clickable ? { scale: 0.88 } : {}}
              className="w-[72px] h-[72px] rounded-xl flex items-center justify-center text-xl font-bold font-mono border-2 transition-all duration-150"
              style={
                cell.revealed
                  ? {
                      background: cell.mine
                        ? won ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)'
                        : 'rgba(255,255,255,0.04)',
                      borderColor: cell.mine
                        ? won ? 'rgba(34,197,94,0.45)' : 'rgba(239,68,68,0.45)'
                        : 'rgba(255,255,255,0.06)',
                      cursor: 'default',
                    }
                  : {
                      background: clickable ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
                      borderColor: clickable ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
                      cursor: clickable ? 'pointer' : 'default',
                    }
              }
            >
              {cell.revealed
                ? cell.mine
                  ? <span>💣</span>
                  : cell.adjacent > 0
                    ? <span style={{ color: NUM_COLOR[cell.adjacent] ?? '#fff' }}>{cell.adjacent}</span>
                    : null
                : null}
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {gameOver && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-2">
            <p className="text-xs font-mono text-red-400 tracking-widest">💥 hit a mine</p>
            <button
              onClick={reset}
              className="text-xs font-mono border border-white/15 rounded-full px-3 py-1 text-white/40 hover:text-white/70 transition-colors"
            >
              try again
            </button>
          </motion.div>
        )}
        {won && (
          <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            className="text-xs font-mono text-green-400 tracking-widest">
            ✓ cleared
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
