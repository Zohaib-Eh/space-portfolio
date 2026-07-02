'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

const ENCRYPTED = 'VSDFH'
const ANSWER = 'SPACE'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

type Status = 'idle' | 'error' | 'success'

interface CaesarCipherProps {
  onSolve: () => void
}

export function CaesarCipher({ onSolve }: CaesarCipherProps) {
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const inputRef = useRef<HTMLInputElement>(null)
  const shakeControls = useAnimation()
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current)
    }
  }, [])

  function handleSubmit() {
    if (status === 'success') return
    const trimmed = input.trim().toUpperCase()
    if (trimmed === ANSWER) {
      setStatus('success')
      setTimeout(() => {
        onSolve()
      }, 800)
    } else {
      setStatus('error')
      shakeControls.start({
        x: [0, -10, 10, -10, 10, -6, 6, 0],
        transition: { duration: 0.5, ease: 'easeInOut' },
      })
      setInput('')
      errorTimerRef.current = setTimeout(() => {
        setStatus('idle')
        inputRef.current?.focus()
      }, 800)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit()
  }

  // Build alphabet reference pairs: A→D, B→E, ...
  const alphaPairs = ALPHABET.split('').map((char, i) => {
    const shifted = ALPHABET[(i + 3) % 26]
    return { plain: char, cipher: shifted }
  })

  const borderColor =
    status === 'error'
      ? 'border-red-500'
      : status === 'success'
        ? 'border-green-400'
        : 'border-indigo-500/60'

  const glowColor =
    status === 'error'
      ? 'shadow-red-500/40'
      : status === 'success'
        ? 'shadow-green-400/40'
        : 'shadow-indigo-500/20'

  return (
    <div className="flex flex-col items-center gap-8 select-none">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl font-mono font-bold text-indigo-300 tracking-widest uppercase">
          Caesar Cipher
        </h2>
        <p className="mt-1 text-sm text-indigo-400/70 font-mono">
          Decrypt the word below
        </p>
      </div>

      {/* Shift indicator */}
      <div className="flex items-center gap-3 bg-indigo-950/60 border border-indigo-500/30 rounded-lg px-5 py-2">
        <span className="text-indigo-400/70 font-mono text-sm uppercase tracking-widest">
          Shift
        </span>
        <span className="text-3xl font-mono font-bold text-indigo-200">3</span>
        <span className="text-indigo-400/50 font-mono text-xs ml-1">(ROT-3)</span>
      </div>

      {/* Encrypted word display */}
      <div className="flex gap-3">
        {ENCRYPTED.split('').map((letter, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="w-14 h-16 flex items-center justify-center rounded-lg border border-indigo-500/50 bg-indigo-950/70 shadow-lg shadow-indigo-900/30"
          >
            <span className="text-3xl font-mono font-bold text-indigo-100 tracking-wider">
              {letter}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Arrow hint */}
      <div className="flex flex-col items-center gap-1 text-indigo-400/50 font-mono text-xs">
        <span>▼</span>
        <span>shift back 3</span>
      </div>

      {/* Input + Submit */}
      <motion.div
        animate={shakeControls}
        className="flex flex-col items-center gap-3 w-full max-w-xs"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
          onKeyDown={handleKeyDown}
          maxLength={ANSWER.length}
          disabled={status === 'success'}
          placeholder="TYPE ANSWER"
          className={`w-full text-center text-2xl font-mono font-bold tracking-[0.4em] uppercase
            bg-black/40 border-2 rounded-lg px-4 py-3 outline-none
            text-indigo-100 placeholder-indigo-500/30
            transition-colors duration-200
            ${borderColor} shadow-lg ${glowColor}
            disabled:opacity-60`}
        />

        <button
          onClick={handleSubmit}
          disabled={status === 'success' || input.trim().length === 0}
          className={`w-full py-2.5 rounded-lg font-mono text-sm font-bold tracking-widest uppercase
            border transition-all duration-200
            ${
              status === 'success'
                ? 'border-green-400/60 bg-green-900/30 text-green-300'
                : status === 'error'
                  ? 'border-red-500/60 bg-red-900/20 text-red-300'
                  : 'border-indigo-500/50 bg-indigo-900/30 text-indigo-300 hover:bg-indigo-800/40 hover:border-indigo-400/70 active:scale-95'
            }
            disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {status === 'success' ? '✓ Correct!' : status === 'error' ? '✗ Try Again' : 'Submit'}
        </button>
      </motion.div>

      {/* Status message */}
      <div className="h-5 flex items-center">
        {status === 'error' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 font-mono text-xs tracking-widest"
          >
            Incorrect — try again
          </motion.p>
        )}
        {status === 'success' && (
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-green-400 font-mono text-xs tracking-widest"
          >
            Decrypted! Launching...
          </motion.p>
        )}
      </div>

      {/* Alphabet reference strip */}
      <div className="w-full max-w-md">
        <p className="text-center text-indigo-400/50 font-mono text-xs tracking-widest uppercase mb-2">
          Cipher Reference (plain → encrypted)
        </p>
        <div className="overflow-x-auto pb-1">
          <div className="flex gap-1 min-w-max mx-auto w-fit">
            {alphaPairs.map(({ plain, cipher }) => (
              <div
                key={plain}
                className="flex flex-col items-center w-7"
              >
                <span className="text-indigo-200 font-mono text-xs">{plain}</span>
                <span className="text-indigo-500/40 font-mono text-[9px] leading-none">↓</span>
                <span className="text-indigo-400/70 font-mono text-xs">{cipher}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
