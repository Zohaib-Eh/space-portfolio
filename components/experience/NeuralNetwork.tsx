'use client'
import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { experienceNodes } from '@/lib/data/experience'
import type { ExperienceNode } from '@/lib/data/experience'

// SVG viewBox 0 0 480 720
// Past (oldest) at top → Future (newest) at bottom
const nodePositions: Record<string, { x: number; y: number }> = {
  'gdsc':             { x: 260, y:  55 }, // 2021
  'brunel-intern':    { x: 130, y: 145 }, // 2022
  'royal-v6':         { x: 370, y: 200 }, // 2023
  'iisc':             { x: 100, y: 285 }, // 2023
  'nissan':           { x: 290, y: 335 }, // 2023 – hub
  'royal-v8':         { x: 420, y: 430 }, // 2025
  'encode-ai':        { x: 115, y: 445 }, // 2025
  'university-prize': { x: 330, y: 510 }, // 2025
  'nvidia':           { x: 140, y: 595 }, // 2026
  'eloquence':        { x: 310, y: 655 }, // 2026 – most recent
}

// Edges representing career/skill connections
const edges: [string, string][] = [
  ['gdsc',           'brunel-intern'],
  ['brunel-intern',  'iisc'],
  ['brunel-intern',  'royal-v6'],
  ['iisc',           'nissan'],
  ['royal-v6',       'nissan'],
  ['nissan',         'royal-v8'],
  ['nissan',         'encode-ai'],
  ['nissan',         'university-prize'],
  ['encode-ai',      'eloquence'],
  ['university-prize','eloquence'],
  ['eloquence',      'nvidia'],
]

// Scroll order: chronological, past → future
const scrollOrder = [
  'gdsc',
  'brunel-intern',
  'royal-v6',
  'iisc',
  'nissan',
  'royal-v8',
  'encode-ai',
  'university-prize',
  'nvidia',
  'eloquence',
]

// Gently curved bezier — organic without looping
function curvePath(a: { x: number; y: number }, b: { x: number; y: number }): string {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.sqrt(dx * dx + dy * dy)
  // Fixed perpendicular offset (max ~30px) regardless of edge length
  const t = Math.min(25 / (len + 1), 0.12)
  const cpx = mx - dy * t
  const cpy = my + dx * t
  return `M ${a.x} ${a.y} Q ${cpx} ${cpy} ${b.x} ${b.y}`
}

// ── Right-side content card ──────────────────────────────────────────────────

function NodeCard({ node, active }: { node: ExperienceNode; active: boolean }) {
  const isJob = node.type === 'job'

  return (
    <motion.div
      animate={{ opacity: active ? 1 : 0.2, y: active ? 0 : 12 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="max-w-sm"
    >
      {/* Badge row */}
      <div className="flex items-center gap-2 mb-3">
        {isJob ? (
          <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-accent/80">
            {node.period}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-mono text-accent/80">
            <span className="text-accent">★</span>
            {node.subtitle}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className={`font-bold leading-tight mb-1 ${isJob ? 'text-[1.6rem]' : 'text-xl'}`}>
        {node.title}
      </h3>

      {/* Org / context */}
      {isJob && (
        <p className="text-white/40 text-sm tracking-wide mb-4 font-light">
          {node.subtitle}
        </p>
      )}

      {/* Bullets */}
      {node.bullets && node.bullets.length > 0 && (
        <ul className="mt-3 space-y-3 border-l border-accent/20 pl-4">
          {node.bullets.map((b, i) => (
            <li key={i} className="text-white/65 text-sm leading-relaxed">
              {b}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  )
}

// ── SVG neuron node ──────────────────────────────────────────────────────────

function NeuronNode({
  node, x, y, visible, active,
}: {
  node: ExperienceNode; x: number; y: number; visible: boolean; active: boolean
}) {
  const isJob = node.type === 'job'
  const r = isJob ? 20 : 11

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 140, damping: 16 }}
      style={{ originX: `${x}px`, originY: `${y}px` }}
    >
      {/* Outer corona (active only — pulsing) */}
      {active && (
        <motion.circle
          cx={x} cy={y} r={r + 14}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={1}
          animate={{ r: [r + 12, r + 22], opacity: [0.4, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
        />
      )}

      {/* Soft halo ring 2 */}
      <circle
        cx={x} cy={y} r={r + 10}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={active ? 6 : 3}
        strokeOpacity={active ? 0.18 : 0.06}
        filter="url(#nn-glow)"
      />
      {/* Soft halo ring 1 */}
      <circle
        cx={x} cy={y} r={r + 5}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={active ? 4 : 2}
        strokeOpacity={active ? 0.28 : 0.1}
        filter="url(#nn-glow)"
      />

      {/* Core circle */}
      <circle
        cx={x} cy={y} r={r}
        fill={active
          ? 'var(--accent)'
          : isJob
            ? 'rgba(255,255,255,0.06)'
            : 'rgba(255,255,255,0.03)'}
        stroke="var(--accent)"
        strokeWidth={active ? 2 : isJob ? 1.5 : 1}
        strokeOpacity={active ? 1 : isJob ? 0.55 : 0.3}
      />

      {/* Star for awards */}
      {!isJob && (
        <text
          x={x} y={y + 4}
          textAnchor="middle"
          fontSize={7}
          fill={active ? '#050510' : 'var(--accent)'}
          fillOpacity={0.9}
          className="pointer-events-none select-none"
        >★</text>
      )}
    </motion.g>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export function NeuralNetwork() {
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isMobile, setIsMobile] = useState(false)
  const contentRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  useEffect(() => {
    if (isMobile) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = contentRefs.current.indexOf(entry.target as HTMLDivElement)
            if (idx !== -1) setActiveIndex(idx)
          }
        })
      },
      { rootMargin: '-35% 0px -35% 0px', threshold: 0 }
    )
    const refs = contentRefs.current
    refs.forEach(ref => ref && observer.observe(ref))
    return () => observer.disconnect()
  }, [isMobile])

  // Mobile: simple timeline list
  if (isMobile) {
    return (
      <div className="space-y-10 px-4">
        {scrollOrder.map(id => {
          const node = experienceNodes.find(n => n.id === id)
          if (!node || node.type !== 'job') return null
          return (
            <div key={id} className="border-l-2 border-accent/30 pl-6">
              <p className="text-accent text-xs mb-1 font-mono">{node.period}</p>
              <h3 className="font-semibold text-lg">{node.title}</h3>
              <p className="text-white/50 text-sm mb-3">{node.subtitle}</p>
              {node.bullets?.map((b, i) => (
                <p key={i} className="text-white/60 text-sm mb-1 pl-2">— {b}</p>
              ))}
            </div>
          )
        })}
      </div>
    )
  }

  const visibleNodes = new Set(scrollOrder.slice(0, activeIndex + 1))
  const activeNodeId = activeIndex >= 0 ? scrollOrder[activeIndex] : null

  return (
    <div className="flex gap-0">
      {/* ── LEFT: sticky neural network ─────────────────────────────────── */}
      <div className="w-[44%] shrink-0">
        <div className="sticky top-[10vh] h-[80vh] flex items-center justify-center">
          <svg viewBox="0 0 480 720" className="w-full h-full max-h-[80vh]">
            <defs>
              <filter id="nn-glow" x="-120%" y="-120%" width="340%" height="340%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="nn-edge-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Faint ghost edges — always visible as structural hints */}
            {edges.map(([from, to]) => {
              const a = nodePositions[from], b = nodePositions[to]
              if (!a || !b) return null
              return (
                <path
                  key={`ghost-${from}-${to}`}
                  d={curvePath(a, b)}
                  stroke="var(--accent)"
                  strokeWidth={0.5}
                  strokeOpacity={0.05}
                  fill="none"
                />
              )
            })}

            {/* Revealed curved edges — draw-in with glow */}
            {edges.map(([from, to]) => {
              const a = nodePositions[from], b = nodePositions[to]
              const show = visibleNodes.has(from) && visibleNodes.has(to)
              const isActive = from === activeNodeId || to === activeNodeId
              if (!a || !b || !show) return null
              const d = curvePath(a, b)
              return (
                <g key={`edge-${from}-${to}`}>
                  {/* Wide glow trace */}
                  <motion.path
                    d={d} fill="none"
                    stroke="var(--accent)"
                    strokeWidth={isActive ? 9 : 5}
                    strokeOpacity={isActive ? 0.22 : 0.08}
                    filter="url(#nn-edge-glow)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
                  />
                  {/* Crisp core line */}
                  <motion.path
                    d={d} fill="none"
                    stroke="var(--accent)"
                    strokeWidth={isActive ? 1.8 : 1}
                    strokeOpacity={isActive ? 0.85 : 0.28}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
                  />
                </g>
              )
            })}

            {/* Neuron nodes */}
            {experienceNodes.map(node => {
              const pos = nodePositions[node.id]
              if (!pos) return null
              return (
                <NeuronNode
                  key={node.id}
                  node={node}
                  x={pos.x} y={pos.y}
                  visible={visibleNodes.has(node.id)}
                  active={node.id === activeNodeId}
                />
              )
            })}

            {/* Node labels — appear after node */}
            {experienceNodes.map(node => {
              const pos = nodePositions[node.id]
              if (!pos || !visibleNodes.has(node.id)) return null
              const isJob = node.type === 'job'
              const r = isJob ? 20 : 11
              return (
                <motion.text
                  key={`lbl-${node.id}`}
                  x={pos.x}
                  y={pos.y + r + 13}
                  textAnchor="middle"
                  fontSize={isJob ? 9 : 7.5}
                  fill="white"
                  fillOpacity={node.id === activeNodeId ? 0.85 : 0.3}
                  className="pointer-events-none select-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  {node.title.length > 22 ? node.title.slice(0, 20) + '…' : node.title}
                </motion.text>
              )
            })}
          </svg>
        </div>
      </div>

      {/* ── RIGHT: scrollable content ────────────────────────────────────── */}
      <div className="flex-1 pl-40">
        {scrollOrder.map((nodeId, i) => {
          const node = experienceNodes.find(n => n.id === nodeId)
          if (!node) return null
          const isJob = node.type === 'job'
          return (
            <div
              key={nodeId}
              ref={el => { contentRefs.current[i] = el }}
              style={{ minHeight: isJob ? '85vh' : '50vh' }}
              className="flex items-center"
            >
              <NodeCard node={node} active={i === activeIndex} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
