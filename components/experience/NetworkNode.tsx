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
  delay?: number
}

export function NetworkNode({ node, x, y, visible, selected, onClick, delay = 0 }: NetworkNodeProps) {
  const isJob = node.type === 'job'
  const r = isJob ? 28 : 16

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      transition={{ duration: 0.5, type: 'spring', delay }}
      style={{ originX: `${x}px`, originY: `${y}px` }}
      onClick={onClick}
      className="cursor-pointer"
    >
      {/* Glow ring behind node */}
      <circle
        cx={x}
        cy={y}
        r={r + 6}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={selected ? 8 : isJob ? 6 : 4}
        strokeOpacity={selected ? 0.35 : 0.12}
        filter="url(#glow-strong)"
      />
      {/* Main circle */}
      <circle
        cx={x}
        cy={y}
        r={r}
        strokeWidth={selected ? 2.5 : 1.5}
        stroke="var(--accent)"
        strokeOpacity={selected ? 1 : isJob ? 0.6 : 0.45}
        style={{
          fill: selected
            ? 'var(--accent)'
            : isJob
            ? 'rgba(255,255,255,0.08)'
            : 'color-mix(in srgb, var(--accent) 15%, transparent)',
        }}
      />
      {node.type === 'award' && (
        <text
          x={x}
          y={y + 4}
          textAnchor="middle"
          fontSize={10}
          fill={selected ? '#050510' : 'var(--accent)'}
          fillOpacity={0.9}
          className="pointer-events-none select-none"
        >
          ★
        </text>
      )}
    </motion.g>
  )
}
