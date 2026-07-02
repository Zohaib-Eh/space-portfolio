'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'puzzle-hint-dismissed'

export function PuzzleHint() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      // Small delay so page settles first
      const t = setTimeout(() => setVisible(true), 1800)
      return () => clearTimeout(t)
    }
  }, [])

  function dismiss() {
    setVisible(false)
    localStorage.setItem(STORAGE_KEY, '1')
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed z-[100] w-64"
          style={{ top: '3.75rem', right: 'max(1.5rem, calc(50vw - 30.5rem))' }}
        >
          {/* Arrow pointing up-right toward the planet button */}
          <div className="flex justify-end pr-5 -mb-px">
            <div
              className="w-0 h-0"
              style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: '6px solid rgba(255,255,255,0.12)',
              }}
            />
          </div>

          <div
            className="rounded-2xl border border-white/12 p-4"
            style={{ background: 'rgba(10,10,24,0.92)', backdropFilter: 'blur(16px)' }}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className="text-base">🪐</span>
              <button
                onClick={dismiss}
                className="text-white/30 hover:text-white/70 transition-colors text-sm leading-none mt-0.5"
              >
                ✕
              </button>
            </div>
            <p className="text-white/80 text-sm font-medium leading-snug mb-1">
              Puzzles hidden throughout
            </p>
            <p className="text-white/40 text-xs leading-relaxed mb-3">
              Solve them to unlock planet themes and change the look of the site.
            </p>
            <button
              onClick={dismiss}
              className="w-full py-1.5 text-xs font-mono tracking-widest border border-white/15 rounded-lg text-white/50 hover:text-white/80 hover:border-white/30 transition-all"
            >
              got it
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
