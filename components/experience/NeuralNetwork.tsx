'use client'
import { useRef, useState, useEffect } from 'react'
import { useInView } from 'framer-motion'
import { motion } from 'framer-motion'
import { experienceNodes } from '@/lib/data/experience'
import { NetworkNode } from './NetworkNode'
import { NodeDetail } from './NodeDetail'
import type { ExperienceNode } from '@/lib/data/experience'

// Layout positions for nodes (SVG viewBox 0 0 600 500)
const nodePositions: Record<string, { x: number; y: number }> = {
  'eloquence':        { x: 300, y: 60  },
  'nvidia':           { x: 460, y: 100 },
  'encode-ai':        { x: 160, y: 140 },
  'university-prize': { x: 440, y: 200 },
  'nissan':           { x: 280, y: 200 },
  'royal-v8':         { x: 130, y: 270 },
  'iisc':             { x: 380, y: 310 },
  'royal-v6':         { x: 500, y: 360 },
  'brunel-intern':    { x: 220, y: 380 },
  'gdsc':             { x: 100, y: 420 },
}

// Edges: [fromId, toId]
const edges: [string, string][] = [
  ['eloquence', 'nvidia'],
  ['eloquence', 'nissan'],
  ['nissan', 'encode-ai'],
  ['nissan', 'university-prize'],
  ['nissan', 'iisc'],
  ['iisc', 'royal-v6'],
  ['iisc', 'brunel-intern'],
  ['brunel-intern', 'royal-v8'],
  ['brunel-intern', 'gdsc'],
]

export function NeuralNetwork() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-150px' })
  const [selected, setSelected] = useState<ExperienceNode | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => { setIsMobile(window.innerWidth < 768) }, [])

  if (isMobile) {
    return (
      <div className="space-y-8 px-4">
        {experienceNodes.filter(n => n.type === 'job').map(node => (
          <div key={node.id} className="border-l border-white/20 pl-6">
            <p className="text-accent text-xs mb-1">{node.period}</p>
            <h3 className="font-semibold">{node.title}</h3>
            <p className="text-white/50 text-sm">{node.subtitle}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div ref={ref} className="relative w-full max-w-2xl mx-auto">
      <svg viewBox="0 0 600 500" className="w-full h-auto">
        {/* Edges */}
        {edges.map(([from, to]) => {
          const a = nodePositions[from]
          const b = nodePositions[to]
          if (!a || !b) return null
          return (
            <motion.line
              key={`${from}-${to}`}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={1}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
            />
          )
        })}
        {/* Nodes */}
        {experienceNodes.map((node, i) => {
          const pos = nodePositions[node.id]
          if (!pos) return null
          return (
            <NetworkNode
              key={node.id}
              node={node}
              x={pos.x}
              y={pos.y}
              visible={inView}
              selected={selected?.id === node.id}
              onClick={() => setSelected(n => n?.id === node.id ? null : node)}
            />
          )
        })}
      </svg>
      {/* Labels */}
      {experienceNodes.map(node => {
        const pos = nodePositions[node.id]
        if (!pos) return null
        const isJob = node.type === 'job'
        return (
          <div
            key={`label-${node.id}`}
            className="absolute pointer-events-none text-center"
            style={{
              left: `${(pos.x / 600) * 100}%`,
              top: `${(pos.y / 500) * 100}%`,
              transform: `translate(-50%, ${isJob ? '36px' : '24px'})`,
            }}
          >
            <p className="text-white/60 text-xs whitespace-nowrap">{node.title}</p>
          </div>
        )
      })}
      <NodeDetail node={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
