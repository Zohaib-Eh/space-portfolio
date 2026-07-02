'use client'
import { motion, AnimatePresence } from 'framer-motion'
import type { ExperienceNode } from '@/lib/data/experience'

interface NodeDetailProps {
  node: ExperienceNode | null
  onClose: () => void
}

export function NodeDetail({ node, onClose }: NodeDetailProps) {
  return (
    <AnimatePresence>
      {node && (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          className="absolute right-0 top-0 w-80 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 z-20"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white text-xl"
          >
            ×
          </button>
          <p className="text-accent text-xs tracking-widest uppercase mb-1">
            {node.type === 'award' ? 'Award' : 'Experience'}
          </p>
          <h3 className="text-lg font-bold mb-1">{node.title}</h3>
          <p className="text-white/50 text-sm mb-3">{node.subtitle}</p>
          {node.period && (
            <p className="text-white/40 text-xs mb-4">{node.period}</p>
          )}
          {node.bullets && (
            <ul className="space-y-2">
              {node.bullets.map((b, i) => (
                <li key={i} className="text-white/70 text-sm flex gap-2">
                  <span className="text-accent mt-0.5 flex-shrink-0">·</span>
                  {b}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
