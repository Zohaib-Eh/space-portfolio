'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LogicGatesProps {
  onSolve: () => void
}

export function LogicGates({ onSolve }: LogicGatesProps) {
  // Start with C=true so NOT C = false, making output false initially
  const [sw, setSw] = useState({ A: false, B: false, C: true })
  const [solved, setSolved] = useState(false)

  const andAB = sw.A && sw.B
  const notC = !sw.C
  const output = andAB || notC

  useEffect(() => {
    if (output && !solved) {
      setSolved(true)
      setTimeout(onSolve, 900)
    }
  }, [output, solved, onSolve])

  function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: () => void }) {
    return (
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-mono text-white/50 tracking-widest">{label}</span>
        <button
          onClick={onChange}
          disabled={solved}
          className="relative w-12 h-6 rounded-full transition-all duration-200 disabled:cursor-default"
          style={{
            background: value ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.08)',
            border: `1px solid ${value ? 'rgba(99,102,241,0.8)' : 'rgba(255,255,255,0.15)'}`,
            boxShadow: value ? '0 0 10px rgba(99,102,241,0.4)' : 'none',
          }}
        >
          <motion.div
            layout
            className="absolute top-0.5 w-5 h-5 rounded-full"
            style={{
              background: value ? '#818cf8' : 'rgba(255,255,255,0.3)',
              left: value ? 'calc(100% - 1.375rem)' : '0.125rem',
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
        <span
          className="text-[10px] font-mono font-bold tracking-widest"
          style={{ color: value ? '#818cf8' : 'rgba(255,255,255,0.2)' }}
        >
          {value ? '1' : '0'}
        </span>
      </div>
    )
  }

  function Gate({ label, on }: { label: string; on: boolean }) {
    return (
      <div
        className="px-3 py-1.5 rounded-lg font-mono text-xs font-bold tracking-widest border transition-all duration-300"
        style={{
          background: on ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${on ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.1)'}`,
          color: on ? '#a5b4fc' : 'rgba(255,255,255,0.3)',
        }}
      >
        {label}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4 select-none">
      <p className="text-[10px] tracking-[0.3em] uppercase text-white/40">Logic Gates</p>

      {/* Circuit layout */}
      <div className="flex items-center gap-4">
        {/* Switches */}
        <div className="flex flex-col gap-4">
          <Toggle label="A" value={sw.A} onChange={() => setSw(s => ({ ...s, A: !s.A }))} />
          <Toggle label="B" value={sw.B} onChange={() => setSw(s => ({ ...s, B: !s.B }))} />
          <Toggle label="C" value={sw.C} onChange={() => setSw(s => ({ ...s, C: !s.C }))} />
        </div>

        {/* Lines + gates */}
        <div className="flex flex-col gap-3 items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-px" style={{ background: andAB ? '#818cf8' : 'rgba(255,255,255,0.15)' }} />
            <Gate label="AND" on={andAB} />
            <div className="w-4 h-px" style={{ background: andAB ? '#818cf8' : 'rgba(255,255,255,0.15)' }} />
          </div>
          <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <div className="flex items-center gap-2">
            <div className="w-6 h-px" style={{ background: notC ? '#818cf8' : 'rgba(255,255,255,0.15)' }} />
            <Gate label="NOT C" on={notC} />
            <div className="w-4 h-px" style={{ background: notC ? '#818cf8' : 'rgba(255,255,255,0.15)' }} />
          </div>
        </div>

        {/* OR gate */}
        <div className="flex items-center gap-2">
          <Gate label="OR" on={output} />
          <div className="w-4 h-px" style={{ background: output ? '#818cf8' : 'rgba(255,255,255,0.15)' }} />
        </div>

        {/* Output bulb */}
        <motion.div
          animate={output ? { scale: [1, 1.12, 1] } : { scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border transition-all duration-300"
          style={{
            background: output ? 'rgba(250,204,21,0.2)' : 'rgba(255,255,255,0.04)',
            border: `2px solid ${output ? '#facc15' : 'rgba(255,255,255,0.1)'}`,
            boxShadow: output ? '0 0 20px rgba(250,204,21,0.5)' : 'none',
          }}
        >
          💡
        </motion.div>
      </div>

      {/* Expression */}
      <p className="text-xs font-mono text-white/30 tracking-widest">
        (A ∧ B) ∨ (¬C)
      </p>

      <AnimatePresence>
        {solved && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-mono text-green-400 tracking-widest"
          >
            ✓ circuit complete
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
