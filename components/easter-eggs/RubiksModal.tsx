'use client'
import { motion, AnimatePresence } from 'framer-motion'

interface RubiksModalProps {
  open: boolean
  onClose: () => void
}

export function RubiksModal({ open, onClose }: RubiksModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70]
              w-full max-w-sm bg-bg border border-accent/30 rounded-2xl p-8 text-center"
            style={{ borderColor: 'var(--accent)' }}
          >
            <p className="text-accent text-xs tracking-[0.4em] uppercase mb-4">Classified Intel Unlocked</p>
            <h2 className="font-serif text-3xl font-bold mb-6">You found it.</h2>
            <div className="flex flex-col gap-3 mb-8">
              <a
                href="https://wa.me/447513376637"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-white/20 rounded-xl py-3 hover:border-accent transition-colors text-sm"
              >
                <span>📱</span> WhatsApp
              </a>
              <a
                href="https://discord.com/users/zohaib"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-white/20 rounded-xl py-3 hover:border-accent transition-colors text-sm"
              >
                <span>💬</span> Discord
              </a>
              <a
                href="https://instagram.com/zohaib.eh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-white/20 rounded-xl py-3 hover:border-accent transition-colors text-sm"
              >
                <span>📸</span> Instagram
              </a>
            </div>
            <button onClick={onClose} className="text-white/30 text-xs hover:text-white/60 transition-colors">
              close
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
