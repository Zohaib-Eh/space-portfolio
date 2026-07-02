'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SECRET = ['red', 'blue', 'red']
const COLORS = ['red', 'green', 'blue']
const HEX: Record<string, string> = { red: '#ef4444', green: '#22c55e', blue: '#3b82f6' }
const MAX_GUESSES = 5

// Feedback types
type FB = 'exact' | 'color' | 'miss'

interface MastermindProps {
  onSolve: () => void
}

function getFeedback(guess: string[]): FB[] {
  const fb: FB[] = []
  const secretCopy = [...SECRET]
  const guessCopy = [...guess]
  for (let i = 0; i < 3; i++) {
    if (guessCopy[i] === secretCopy[i]) {
      fb.push('exact'); secretCopy[i] = ''; guessCopy[i] = ''
    }
  }
  for (let i = 0; i < 3; i++) {
    if (guessCopy[i] === '') continue
    const j = secretCopy.indexOf(guessCopy[i])
    if (j !== -1) { fb.push('color'); secretCopy[j] = '' }
    else fb.push('miss')
  }
  return fb.sort((a, b) => {
    const order = { exact: 0, color: 1, miss: 2 }
    return order[a] - order[b]
  })
}

function FeedbackDot({ type }: { type: FB }) {
  const styles: Record<FB, { bg: string; border: string; label: string }> = {
    exact: { bg: '#22c55e', border: '#22c55e', label: '✓' },
    color: { bg: 'transparent', border: '#facc15', label: '◐' },
    miss:  { bg: 'transparent', border: 'rgba(255,255,255,0.15)', label: '·' },
  }
  const s = styles[type]
  return (
    <div
      title={type === 'exact' ? 'right color, right spot' : type === 'color' ? 'right color, wrong spot' : 'not in sequence'}
      className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border"
      style={{ background: s.bg, borderColor: s.border, color: type === 'exact' ? '#fff' : type === 'color' ? '#facc15' : 'rgba(255,255,255,0.3)' }}
    >
      {s.label}
    </div>
  )
}

export function Mastermind({ onSolve }: MastermindProps) {
  const [guess, setGuess] = useState<string[]>([])
  const [history, setHistory] = useState<{ guess: string[]; feedback: FB[] }[]>([])
  const [solved, setSolved] = useState(false)
  const [failed, setFailed] = useState(false)

  function addColor(c: string) {
    if (guess.length >= 3 || solved || failed) return
    setGuess(g => [...g, c])
  }

  function removeColor() {
    setGuess(g => g.slice(0, -1))
  }

  function submitGuess() {
    if (guess.length < 3 || solved || failed) return
    const feedback = getFeedback(guess)
    const newHistory = [...history, { guess, feedback }]
    setHistory(newHistory)

    if (feedback.filter(f => f === 'exact').length === 3) {
      setSolved(true)
      setTimeout(onSolve, 1000)
    } else if (newHistory.length >= MAX_GUESSES) {
      setFailed(true)
    }
    setGuess([])
  }

  function reset() {
    setGuess([])
    setHistory([])
    setSolved(false)
    setFailed(false)
  }

  return (
    <div className="flex flex-col items-center gap-5 py-4 select-none">
      <p className="text-[10px] tracking-[0.3em] uppercase text-white/40">Mastermind</p>

      {/* Legend */}
      <div className="flex gap-4 text-[11px] font-mono text-white/40">
        <span className="flex items-center gap-1.5">
          <FeedbackDot type="exact" /> right spot
        </span>
        <span className="flex items-center gap-1.5">
          <FeedbackDot type="color" /> wrong spot
        </span>
        <span className="flex items-center gap-1.5">
          <FeedbackDot type="miss" /> not in sequence
        </span>
      </div>
      <p className="text-[10px] font-mono text-white/25">{MAX_GUESSES - history.length} guess{MAX_GUESSES - history.length !== 1 ? 'es' : ''} remaining</p>

      {/* History */}
      <div className="flex flex-col gap-2 w-full max-w-xs">
        <AnimatePresence>
          {history.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="flex gap-1.5">
                {row.guess.map((c, j) => (
                  <div
                    key={j}
                    className="w-8 h-8 rounded-full border"
                    style={{ background: HEX[c] + '80', borderColor: HEX[c] }}
                  />
                ))}
              </div>
              <div className="flex gap-1">
                {row.feedback.map((f, j) => <FeedbackDot key={j} type={f} />)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Current guess slots */}
      {!solved && !failed && (
        <div className="flex gap-2 mt-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-10 h-10 rounded-full border-2 transition-all duration-150"
              style={{
                background: guess[i] ? HEX[guess[i]] + '80' : 'transparent',
                borderColor: guess[i] ? HEX[guess[i]] : 'rgba(255,255,255,0.15)',
              }}
            />
          ))}
        </div>
      )}

      {/* Color pickers */}
      {!solved && !failed && (
        <div className="flex gap-3">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => addColor(c)}
              disabled={guess.length >= 3}
              className="w-10 h-10 rounded-full border-2 transition-all duration-150 hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: HEX[c] + '60', borderColor: HEX[c] }}
            />
          ))}
        </div>
      )}

      {/* Controls */}
      {!solved && !failed && (
        <div className="flex gap-2">
          <button
            onClick={removeColor}
            disabled={guess.length === 0}
            className="px-3 py-1.5 text-xs font-mono text-white/40 border border-white/10 rounded-lg hover:border-white/25 transition-colors disabled:opacity-30"
          >
            ← undo
          </button>
          <button
            onClick={submitGuess}
            disabled={guess.length < 3}
            className="px-4 py-1.5 text-xs font-mono font-bold tracking-widest border rounded-lg transition-all disabled:opacity-30"
            style={{ borderColor: 'rgba(99,102,241,0.5)', color: '#a5b4fc', background: 'rgba(99,102,241,0.1)' }}
          >
            submit
          </button>
        </div>
      )}

      <AnimatePresence>
        {solved && (
          <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            className="text-xs font-mono text-green-400 tracking-widest">
            ✓ cracked it
          </motion.p>
        )}
        {failed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-2">
            <p className="text-xs font-mono text-red-400 tracking-widest">sequence was: 🔴 🔵 🔴</p>
            <button onClick={reset} className="text-xs font-mono text-white/40 underline">try again</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
