'use client'
import { motion } from 'framer-motion'
import type { ExperienceNode } from '@/lib/data/experience'

interface NetworkNodeProps {
  node: ExperienceNode
  x: number
  y: number
  visible: boolean
  selected: boolean
  onClick: () => void
}

export function NetworkNode({ node, x, y, visible, selected, onClick }: NetworkNodeProps) {
  const isJob = node.type === 'job'
  const r = isJob ? 28 : 16

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      style={{ originX: `${x}px`, originY: `${y}px` }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <circle
        cx={x}
        cy={y}
        r={r}
        className={`transition-all duration-300 ${
          selected
            ? 'fill-accent stroke-accent'
            : isJob
            ? 'fill-white/10 stroke-white/40 hover:fill-white/20'
            : 'fill-accent/20 stroke-accent/60 hover:fill-accent/40'
        }`}
        strokeWidth={selected ? 2 : 1.5}
        style={{ fill: selected ? 'var(--accent)' : undefined }}
      />
      {node.type === 'award' && (
        <text
          x={x}
          y={y + 4}
          textAnchor="middle"
          fontSize={10}
          fill="currentColor"
          className="pointer-events-none select-none"
        >
          ★
        </text>
      )}
    </motion.g>
  )
}
