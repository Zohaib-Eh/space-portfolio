'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { skillIcons } from '@/lib/data/skills'
import { PuzzleSlot } from '@/components/easter-eggs/PuzzleSlot'
import { Minesweeper } from '@/components/puzzles/Minesweeper'

// Secret Earth asteroid — hidden among the regular skills
const SECRET_SHAPE = 'polygon(50% 0%, 80% 12%, 100% 40%, 88% 76%, 62% 100%, 28% 98%, 4% 72%, 0% 40%, 18% 12%, 40% 2%)'

const ASTEROID_SHAPES = [
  'polygon(32% 2%, 68% 0%, 94% 18%, 100% 52%, 88% 82%, 62% 100%, 28% 98%, 4% 76%, 0% 44%, 12% 14%)',
  'polygon(44% 0%, 78% 8%, 100% 36%, 96% 72%, 72% 100%, 36% 98%, 8% 80%, 0% 48%, 14% 18%, 28% 2%)',
  'polygon(26% 4%, 60% 0%, 92% 22%, 98% 58%, 80% 92%, 46% 100%, 14% 86%, 0% 54%, 8% 24%, 16% 6%)',
  'polygon(50% 0%, 82% 10%, 100% 42%, 90% 78%, 64% 100%, 24% 96%, 2% 70%, 6% 36%, 28% 8%, 46% 0%)',
  'polygon(38% 0%, 74% 6%, 100% 30%, 96% 66%, 76% 96%, 38% 100%, 8% 84%, 0% 50%, 10% 20%, 26% 2%)',
]

const ICON_SIZE = 76
const COLLISION_R = 42 // collision radius per asteroid

interface Particle {
  x: number; y: number
  vx: number; vy: number
  angle: number; spin: number
}

function AsteroidVisual({ skill, index }: { skill: typeof skillIcons[0]; index: number }) {
  const shape = ASTEROID_SHAPES[index % ASTEROID_SHAPES.length]
  return (
    <div className="select-none">
      <div
        style={{
          width: ICON_SIZE,
          height: ICON_SIZE,
          clipPath: shape,
          background: `radial-gradient(circle at 36% 36%, color-mix(in srgb, ${skill.bg} 75%, #fff 25%) 0%, ${skill.bg} 50%, color-mix(in srgb, ${skill.bg} 55%, #000 45%) 100%)`,
          filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.8))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={skill.iconUrl}
          alt={skill.name}
          width={44}
          height={44}
          style={{ objectFit: 'contain', pointerEvents: 'none' }}
          draggable={false}
        />
      </div>
    </div>
  )
}

function StaticGrid() {
  return (
    <div className="flex flex-wrap gap-6 justify-center py-8 px-6">
      {skillIcons.map((skill, i) => (
        <AsteroidVisual key={skill.name} skill={skill} index={i} />
      ))}
    </div>
  )
}

const CURSOR_SIZE = 52
const REPULSE_RING = 160 // must match repulsion radius in tick

export function PhysicsIcons() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true })
  const [isMobile, setIsMobile] = useState(false)
  const [earthOpen, setEarthOpen] = useState(false)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const rafRef = useRef<number>(0)

  useEffect(() => { setIsMobile(window.innerWidth < 768) }, [])

  useEffect(() => {
    if (!inView || isMobile || !containerRef.current) return

    const container = containerRef.current
    const W = container.offsetWidth
    const H = container.offsetHeight
    const PAD = ICON_SIZE * 0.6

    const particleCount = skillIcons.length + 1
    particlesRef.current = Array.from({ length: particleCount }).map(() => {
      const angle = Math.random() * Math.PI * 2
      const speed = 0.12 + Math.random() * 0.18
      return {
        x: PAD + Math.random() * (W - PAD * 2),
        y: PAD + Math.random() * (H - PAD * 2),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        angle: Math.random() * 360,
        spin: (Math.random() - 0.5) * 0.25,
      }
    })

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      mouseRef.current = { x: mx, y: my }
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '1'
        cursorRef.current.style.transform = `translate(${mx - CURSOR_SIZE / 2}px, ${my - CURSOR_SIZE / 2}px)`
      }
    }
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
      if (cursorRef.current) cursorRef.current.style.opacity = '0'
    }
    container.addEventListener('mousemove', onMouseMove)
    container.addEventListener('mouseleave', onMouseLeave)

    const tick = () => {
      const ps = particlesRef.current
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Mouse repulsion
      ps.forEach(p => {
        const dx = p.x - mx
        const dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 160 && dist > 0) {
          const force = ((160 - dist) / 160) * 0.18
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }
      })

      // Asteroid-to-asteroid collisions
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const pi = ps[i], pj = ps[j]
          const dx = pj.x - pi.x
          const dy = pj.y - pi.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const minDist = COLLISION_R * 2
          if (dist < minDist && dist > 0) {
            const nx = dx / dist, ny = dy / dist
            const relVn = (pi.vx - pj.vx) * nx + (pi.vy - pj.vy) * ny
            if (relVn < 0) {
              // Elastic collision (equal mass)
              pi.vx -= relVn * nx
              pi.vy -= relVn * ny
              pj.vx += relVn * nx
              pj.vy += relVn * ny
            }
            // Separate overlapping bodies
            const overlap = (minDist - dist) / 2
            pi.x -= nx * overlap
            pi.y -= ny * overlap
            pj.x += nx * overlap
            pj.y += ny * overlap
          }
        }
      }

      // Integrate & apply constraints
      ps.forEach((p, i) => {
        // Speed cap
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > 3.5) { p.vx = (p.vx / speed) * 3.5; p.vy = (p.vy / speed) * 3.5 }
        // Minimum drift
        if (speed < 0.08) {
          const a = Math.random() * Math.PI * 2
          p.vx += Math.cos(a) * 0.04
          p.vy += Math.sin(a) * 0.04
        }
        p.vx *= 0.999
        p.vy *= 0.999

        p.x += p.vx
        p.y += p.vy
        p.angle += p.spin

        // Left/right: wrap around (asteroid-style)
        if (p.x < -ICON_SIZE) p.x = W + ICON_SIZE
        if (p.x > W + ICON_SIZE) p.x = -ICON_SIZE

        // Top/bottom: bounce off walls
        if (p.y < PAD) { p.y = PAD; p.vy = Math.abs(p.vy) }
        if (p.y > H - PAD) { p.y = H - PAD; p.vy = -Math.abs(p.vy) }

        const el = container.querySelector(`[data-asteroid="${i}"]`) as HTMLElement
        if (el) {
          el.style.transform = `translate(${p.x - ICON_SIZE / 2}px, ${p.y - ICON_SIZE / 2}px) rotate(${p.angle}deg)`
        }
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [inView, isMobile])

  if (isMobile) return <StaticGrid />

  const totalCount = skillIcons.length + 1 // +1 for secret Earth asteroid
  // Secret asteroid is inserted at index 7 (middle of the field)
  const SECRET_INDEX = 7

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full h-[460px] overflow-hidden"
        style={{ cursor: 'none' }}
      >
        {/* Custom asteroid cursor */}
        <div
          ref={cursorRef}
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: CURSOR_SIZE,
            height: CURSOR_SIZE,
            pointerEvents: 'none',
            zIndex: 30,
            opacity: 0,
            transition: 'opacity 0.12s',
          }}
        >
          {/* Repulsion radius ring */}
          <div style={{
            position: 'absolute',
            width: REPULSE_RING * 2,
            height: REPULSE_RING * 2,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: '1px dashed rgba(255,255,255,0.18)',
            pointerEvents: 'none',
          }} />
          {/* Outward arrow ticks at cardinal points */}
          {[0, 90, 180, 270].map(deg => (
            <div key={deg} style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: 8, height: 10,
              transform: `rotate(${deg}deg) translateY(-${REPULSE_RING - 2}px) translateX(-4px)`,
              color: 'rgba(255,255,255,0.35)',
              fontSize: 10, lineHeight: 1,
              fontFamily: 'monospace',
              pointerEvents: 'none',
            }}>▲</div>
          ))}
          {/* Asteroid body */}
          <div style={{
            width: CURSOR_SIZE,
            height: CURSOR_SIZE,
            clipPath: ASTEROID_SHAPES[2],
            background: 'radial-gradient(circle at 36% 30%, #c4a882 0%, #7a5a38 38%, #3e2b15 68%, #1c1008 100%)',
            filter: 'drop-shadow(0 3px 12px rgba(0,0,0,0.9))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
            <span style={{
              position: 'absolute', top: '22%', left: '24%',
              fontSize: 13, fontWeight: 700, color: 'rgba(255,240,200,0.85)',
              lineHeight: 1, fontFamily: 'monospace',
            }}>−</span>
            <span style={{
              position: 'absolute', bottom: '22%', right: '22%',
              fontSize: 11, fontWeight: 700, color: 'rgba(255,240,200,0.85)',
              lineHeight: 1, fontFamily: 'monospace',
            }}>+</span>
          </div>
        </div>
        {Array.from({ length: totalCount }).map((_, i) => {
          const isSecret = i === SECRET_INDEX
          const skillIndex = i < SECRET_INDEX ? i : i - 1
          const skill = isSecret ? null : skillIcons[skillIndex]

          return (
            <div
              key={isSecret ? '__earth__' : skill!.name}
              data-asteroid={i}
              className="absolute"
              style={{
                width: ICON_SIZE,
                height: ICON_SIZE,
                willChange: 'transform',
                transform: `translate(${(i % 6) * 130 + 50}px, ${Math.floor(i / 6) * 130 + 60}px)`,
                cursor: isSecret ? 'pointer' : 'default',
              }}
              onClick={isSecret ? () => setEarthOpen(true) : undefined}
            >
              {isSecret ? (
                <div className="select-none" title="">
                  <div style={{
                    width: ICON_SIZE,
                    height: ICON_SIZE,
                    clipPath: SECRET_SHAPE,
                    overflow: 'hidden',
                    filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.8))',
                    position: 'relative',
                  }}>
                    <svg width={ICON_SIZE} height={ICON_SIZE} style={{ position: 'absolute', inset: 0 }}>
                      <defs>
                        <radialGradient id="ea-o" cx="38%" cy="33%" r="65%">
                          <stop offset="0%"   stopColor="#78c8f0" />
                          <stop offset="30%"  stopColor="#1878c0" />
                          <stop offset="65%"  stopColor="#0c4888" />
                          <stop offset="100%" stopColor="#041828" />
                        </radialGradient>
                        <filter id="ea-l" colorInterpolationFilters="sRGB">
                          <feTurbulence type="fractalNoise" baseFrequency="0.020 0.016" numOctaves="5" seed="17" result="n" />
                          <feColorMatrix type="matrix" values="0 0 0 0 0.18  0 0 0 0 0.52  0 0 0 0 0.14  4 0 0 0 -1.7" in="n" />
                        </filter>
                        <filter id="ea-cl" colorInterpolationFilters="sRGB">
                          <feTurbulence type="fractalNoise" baseFrequency="0.038 0.022" numOctaves="4" seed="3" result="n" />
                          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  6 0 0 0 -3.2" in="n" />
                        </filter>
                        <radialGradient id="ea-h" cx="32%" cy="28%" r="44%">
                          <stop offset="0%"   stopColor="rgba(200,240,255,0.32)" />
                          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                        </radialGradient>
                        <radialGradient id="ea-s" cx="80%" cy="75%" r="58%">
                          <stop offset="0%"   stopColor="rgba(0,0,0,0.65)" />
                          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                        </radialGradient>
                      </defs>
                      <rect width={ICON_SIZE} height={ICON_SIZE} fill="url(#ea-o)" />
                      <rect width={ICON_SIZE} height={ICON_SIZE} filter="url(#ea-l)" opacity={0.92} />
                      <rect width={ICON_SIZE} height={ICON_SIZE} filter="url(#ea-cl)" opacity={0.45} />
                      <rect width={ICON_SIZE} height={ICON_SIZE} fill="url(#ea-h)" />
                      <rect width={ICON_SIZE} height={ICON_SIZE} fill="url(#ea-s)" />
                    </svg>
                  </div>
                </div>
              ) : (
                <AsteroidVisual skill={skill!} index={skillIndex} />
              )}
            </div>
          )
        })}
      </div>

      {/* Earth puzzle modal */}
      {earthOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setEarthOpen(false)}
        >
          <div
            className="w-full max-w-md mx-6"
            onClick={e => e.stopPropagation()}
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3 text-center font-mono">
              you found it
            </p>
            <PuzzleSlot planetId="earth"><Minesweeper onSolve={() => {}} /></PuzzleSlot>
            <p className="text-center text-white/20 text-xs mt-3">click outside to close</p>
          </div>
        </div>
      )}
    </>
  )
}
