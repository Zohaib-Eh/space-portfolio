'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '@/lib/store/themeStore'
import type { PlanetId } from '@/lib/data/planets'

interface PlanetConfig {
  gradient: [string, string, string, string]  // inner → outer
  highlight: string
  band?: { color: string; opacity: number; freqX: number; freqY: number }
  noise: { freq: string; octaves: number; seed: number; opacity: number; blend: string }
  atmosphere: string
  size: number
  rings?: boolean
}

const CONFIGS: Record<PlanetId, PlanetConfig> = {
  earth: {
    gradient: ['#c0f0d0', '#40b870', '#1a7840', '#082810'],
    highlight: 'rgba(180,255,200,0.25)',
    noise: { freq: '0.012 0.010', octaves: 6, seed: 17, opacity: 0.45, blend: 'overlay' },
    atmosphere: 'rgba(64,200,128,0.18)',
    size: 680,
  },
  uranus: {
    gradient: ['#d0f8f8', '#60d8e0', '#20a0b0', '#083848'],
    highlight: 'rgba(180,255,255,0.28)',
    noise: { freq: '0.008 0.006', octaves: 4, seed: 21, opacity: 0.35, blend: 'overlay' },
    atmosphere: 'rgba(96,232,216,0.16)',
    size: 710,
  },
  mercury: {
    gradient: ['#e0dad2', '#a09890', '#6b6460', '#2a2826'],
    highlight: 'rgba(255,255,255,0.18)',
    noise: { freq: '0.06 0.05', octaves: 8, seed: 3, opacity: 0.55, blend: 'multiply' },
    atmosphere: 'rgba(180,170,160,0.10)',
    size: 660,
  },
  venus: {
    gradient: ['#fffadd', '#f5d060', '#d48818', '#7a4400'],
    highlight: 'rgba(255,255,200,0.30)',
    noise: { freq: '0.008 0.012', octaves: 5, seed: 7, opacity: 0.50, blend: 'overlay' },
    atmosphere: 'rgba(232,160,32,0.18)',
    size: 720,
  },
  mars: {
    gradient: ['#e8a07a', '#c85030', '#8c2010', '#3a0c04'],
    highlight: 'rgba(255,200,160,0.20)',
    noise: { freq: '0.022 0.018', octaves: 7, seed: 5, opacity: 0.48, blend: 'overlay' },
    atmosphere: 'rgba(232,64,48,0.14)',
    size: 660,
  },
  jupiter: {
    gradient: ['#f0d8b0', '#d4a060', '#a06020', '#3c1c08'],
    highlight: 'rgba(255,240,200,0.22)',
    band: { color: '#8c4820', opacity: 0.55, freqX: 0.004, freqY: 0.18 },
    noise: { freq: '0.004 0.16', octaves: 4, seed: 11, opacity: 0.60, blend: 'overlay' },
    atmosphere: 'rgba(232,120,40,0.15)',
    size: 900,
  },
  saturn: {
    gradient: ['#f8f0d8', '#e8d080', '#c8a030', '#786018'],
    highlight: 'rgba(255,255,220,0.25)',
    band: { color: '#b88828', opacity: 0.35, freqX: 0.006, freqY: 0.22 },
    noise: { freq: '0.006 0.20', octaves: 3, seed: 9, opacity: 0.40, blend: 'overlay' },
    atmosphere: 'rgba(232,210,60,0.13)',
    size: 620,
    rings: true,
  },
  neptune: {
    gradient: ['#c0f0ff', '#2090d8', '#0850a8', '#021840'],
    highlight: 'rgba(160,240,255,0.28)',
    noise: { freq: '0.010 0.014', octaves: 6, seed: 13, opacity: 0.45, blend: 'overlay' },
    atmosphere: 'rgba(32,200,232,0.18)',
    size: 700,
  },
}

const BACKGROUND_POSITIONS = [
  { x: '8%',  y: '15%' },
  { x: '3%',  y: '60%' },
  { x: '15%', y: '82%' },
  { x: '88%', y: '65%' },
  { x: '82%', y: '88%' },
]

function EarthSphere({ size, uid }: { size: number; uid: string }) {
  const r = size / 2
  return (
    <svg width={size} height={size} style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <clipPath id={`${uid}-c`}><circle cx={r} cy={r} r={r} /></clipPath>

        {/* Ocean gradient */}
        <radialGradient id={`${uid}-o`} cx="38%" cy="33%" r="65%">
          <stop offset="0%"   stopColor="#78c8f0" />
          <stop offset="30%"  stopColor="#1878c0" />
          <stop offset="65%"  stopColor="#0c4888" />
          <stop offset="100%" stopColor="#041828" />
        </radialGradient>

        {/* Land mass filter — threshold noise into green blobs */}
        <filter id={`${uid}-l`} colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.020 0.016" numOctaves="5" seed="17" result="n" />
          <feColorMatrix type="matrix"
            values="0 0 0 0 0.18
                    0 0 0 0 0.52
                    0 0 0 0 0.14
                    4 0 0 0 -1.7"
            in="n" />
        </filter>

        {/* Cloud filter — wispy high-frequency noise */}
        <filter id={`${uid}-cl`} colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.038 0.022" numOctaves="4" seed="3" result="n" />
          <feColorMatrix type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    6 0 0 0 -3.2"
            in="n" />
        </filter>

        {/* Specular */}
        <radialGradient id={`${uid}-h`} cx="32%" cy="28%" r="44%">
          <stop offset="0%"   stopColor="rgba(200,240,255,0.32)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>

        {/* Shadow terminator */}
        <radialGradient id={`${uid}-s`} cx="80%" cy="75%" r="58%">
          <stop offset="0%"   stopColor="rgba(0,0,0,0.72)" />
          <stop offset="60%"  stopColor="rgba(0,0,0,0.36)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      <g clipPath={`url(#${uid}-c)`}>
        {/* Ocean */}
        <circle cx={r} cy={r} r={r} fill={`url(#${uid}-o)`} />
        {/* Land masses */}
        <rect x={0} y={0} width={size} height={size} filter={`url(#${uid}-l)`} opacity={0.92} />
        {/* Clouds */}
        <rect x={0} y={0} width={size} height={size} filter={`url(#${uid}-cl)`} opacity={0.48} />
        {/* Specular */}
        <circle cx={r} cy={r} r={r} fill={`url(#${uid}-h)`} />
        {/* Shadow */}
        <circle cx={r} cy={r} r={r} fill={`url(#${uid}-s)`} />
      </g>
    </svg>
  )
}

function PlanetSphere({ id, size, uid }: { id: PlanetId; size: number; uid: string }) {
  if (id === 'earth') return <EarthSphere size={size} uid={uid} />

  const cfg = CONFIGS[id]
  const r = size / 2
  const gid = `g-${uid}`
  const nid = `n-${uid}`
  const hid = `h-${uid}`
  const sid = `s-${uid}`
  const cid = `c-${uid}`

  return (
    <svg width={size} height={size} style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <radialGradient id={gid} cx="38%" cy="33%" r="65%">
          <stop offset="0%"   stopColor={cfg.gradient[0]} />
          <stop offset="30%"  stopColor={cfg.gradient[1]} />
          <stop offset="65%"  stopColor={cfg.gradient[2]} />
          <stop offset="100%" stopColor={cfg.gradient[3]} />
        </radialGradient>

        <filter id={nid} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency={cfg.noise.freq} numOctaves={cfg.noise.octaves} seed={cfg.noise.seed} result="noise" />
          <feColorMatrix type="saturate" values="0.6" in="noise" result="ns" />
          <feBlend in="SourceGraphic" in2="ns" mode={cfg.noise.blend as 'overlay' | 'multiply'} result="blended" />
          <feComposite operator="in" in="blended" in2="SourceGraphic" />
        </filter>

        <radialGradient id={hid} cx="32%" cy="28%" r="45%">
          <stop offset="0%"   stopColor={cfg.highlight} />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>

        <radialGradient id={sid} cx="80%" cy="75%" r="58%">
          <stop offset="0%"   stopColor="rgba(0,0,0,0.72)" />
          <stop offset="60%"  stopColor="rgba(0,0,0,0.38)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        <clipPath id={cid}><circle cx={r} cy={r} r={r} /></clipPath>
      </defs>

      <circle cx={r} cy={r} r={r} fill={`url(#${gid})`} />
      {cfg.band && (
        <rect x={0} y={0} width={size} height={size} clipPath={`url(#${cid})`} opacity={cfg.band.opacity}>
          <animate attributeName="opacity" values={`${cfg.band.opacity};${cfg.band.opacity * 0.8};${cfg.band.opacity}`} dur="12s" repeatCount="indefinite" />
        </rect>
      )}
      <circle cx={r} cy={r} r={r} fill={`url(#${gid})`} filter={`url(#${nid})`} opacity={cfg.noise.opacity} />
      <circle cx={r} cy={r} r={r} fill={`url(#${hid})`} />
      <circle cx={r} cy={r} r={r} fill={`url(#${sid})`} />
    </svg>
  )
}

function SaturnRings({ size, front }: { size: number; front: boolean }) {
  const w = size * 2.5
  const h = size * 0.42
  const style: React.CSSProperties = {
    position: 'absolute',
    width: w,
    height: h,
    top: size * 0.29,
    left: -(size * 0.75),
    borderRadius: '50%',
    border: '20px solid rgba(220,190,80,0.22)',
    boxShadow: '0 0 0 10px rgba(200,160,50,0.13), 0 0 0 22px rgba(180,140,40,0.07)',
    transform: 'rotateX(70deg)',
    clipPath: front ? 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' : 'polygon(0 0, 100% 0, 100% 50%, 0 50%)',
    pointerEvents: 'none',
  }
  return <div style={style} />
}

export function PlanetBackground() {
  const { activeTheme, unlockedPlanets } = useThemeStore()

  const backgroundPlanets = unlockedPlanets.filter(p => p !== activeTheme)

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">

      {/* ── Background unlocked planets (small) ─────────────────────── */}
      <AnimatePresence>
        {backgroundPlanets.map((planetId, i) => {
          const cfg = CONFIGS[planetId]
          const pos = BACKGROUND_POSITIONS[i % BACKGROUND_POSITIONS.length]
          const bgSize = 180

          return (
            <motion.div
              key={`bg-${planetId}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 0.55, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute"
              style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
            >
              {/* Atmosphere glow */}
              <div className="absolute rounded-full" style={{
                inset: -30,
                background: `radial-gradient(circle, ${cfg.atmosphere} 0%, transparent 70%)`,
                filter: 'blur(18px)',
              }} />
              {cfg.rings && <SaturnRings size={bgSize} front={false} />}
              <PlanetSphere id={planetId} size={bgSize} uid={`bg-${planetId}`} />
              {cfg.rings && <SaturnRings size={bgSize} front={true} />}
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* ── Active planet (large, top-right) ────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeTheme && (() => {
          const cfg = CONFIGS[activeTheme]
          const s = cfg.size

          return (
            <motion.div
              key={`main-${activeTheme}`}
              initial={{ opacity: 0, x: 80, scale: 0.85 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1] }}
              className="absolute"
              style={{ right: '-12%', top: '-18%' }}
            >
              {/* Atmosphere glow */}
              <div className="absolute rounded-full" style={{
                inset: -80,
                background: `radial-gradient(circle, ${cfg.atmosphere} 0%, transparent 65%)`,
                filter: 'blur(50px)',
              }} />
              {cfg.rings && <SaturnRings size={s} front={false} />}
              <PlanetSphere id={activeTheme} size={s} uid={`main-${activeTheme}`} />
              {cfg.rings && <SaturnRings size={s} front={true} />}
            </motion.div>
          )
        })()}
      </AnimatePresence>
    </div>
  )
}
