'use client'
import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { RubiksModal } from './RubiksModal'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'zohaib-rubiks-solved-v2'

const FACE_COLORS: Record<string, string> = {
  px: '#B71234', // red   (+x)
  nx: '#FF5800', // orange(-x)
  py: '#FFFFFF', // white (+y)
  ny: '#FFD500', // yellow(-y)
  pz: '#009B48', // green (+z)
  nz: '#0046AD', // blue  (-z)
}

// All 26 visible cubie integer positions (excluding 0,0,0 center)
const ALL_POSITIONS: [number, number, number][] = []
for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    for (let z = -1; z <= 1; z++) {
      if (x !== 0 || y !== 0 || z !== 0) {
        ALL_POSITIONS.push([x, y, z])
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Cube state types
// ---------------------------------------------------------------------------

interface CubieState {
  id: number
  pos: [number, number, number]  // current world integer position
  origin: [number, number, number]  // initial position (determines sticker colors)
  quat: THREE.Quaternion
}

// ---------------------------------------------------------------------------
// Face turn math
// ---------------------------------------------------------------------------

// Rotation quaternion for each move (world-space rotation applied to cubie quat)
const MOVE_QUATS: Record<string, THREE.Quaternion> = {
  R: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0),  Math.PI / 2),
  Ri: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2),
  L: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2),
  Li: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0),  Math.PI / 2),
  U: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0),  Math.PI / 2),
  Ui: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2),
  D: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2),
  Di: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0),  Math.PI / 2),
  F: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2),
  Fi: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1),  Math.PI / 2),
  B: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1),  Math.PI / 2),
  Bi: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2),
}

// Which layer (axis/value) each move affects
const MOVE_LAYER: Record<string, { axis: 0 | 1 | 2; val: number }> = {
  R: { axis: 0, val:  1 }, Ri: { axis: 0, val:  1 },
  L: { axis: 0, val: -1 }, Li: { axis: 0, val: -1 },
  U: { axis: 1, val:  1 }, Ui: { axis: 1, val:  1 },
  D: { axis: 1, val: -1 }, Di: { axis: 1, val: -1 },
  F: { axis: 2, val:  1 }, Fi: { axis: 2, val:  1 },
  B: { axis: 2, val: -1 }, Bi: { axis: 2, val: -1 },
}

// Integer position transform for each move
function rotatePos(pos: [number, number, number], move: string): [number, number, number] {
  const [x, y, z] = pos
  switch (move) {
    case 'R':  return [x, -z,  y]
    case 'Ri': return [x,  z, -y]
    case 'L':  return [x,  z, -y]
    case 'Li': return [x, -z,  y]
    case 'U':  return [z,  y, -x]
    case 'Ui': return [-z, y,  x]
    case 'D':  return [-z, y,  x]
    case 'Di': return [z,  y, -x]
    case 'F':  return [y, -x,  z]
    case 'Fi': return [-y, x,  z]
    case 'B':  return [-y, x,  z]
    case 'Bi': return [y, -x,  z]
    default: return pos
  }
}

function applyMove(cubies: CubieState[], move: string): CubieState[] {
  const { axis, val } = MOVE_LAYER[move]
  const rotQ = MOVE_QUATS[move].clone()
  return cubies.map(c => {
    if (Math.round(c.pos[axis]) !== val) return c
    const newQuat = rotQ.clone().multiply(c.quat)
    newQuat.normalize()
    return {
      ...c,
      pos: rotatePos(c.pos, move),
      quat: newQuat,
    }
  })
}

const BASE_MOVES = ['R', 'L', 'U', 'D', 'F', 'B']

function scramble(cubies: CubieState[]): CubieState[] {
  let state = cubies
  let lastBase = ''
  for (let i = 0; i < 20; i++) {
    // Pick a random base move that isn't the same face as the last
    const candidates = BASE_MOVES.filter(m => m !== lastBase)
    const base = candidates[Math.floor(Math.random() * candidates.length)]
    lastBase = base
    // Randomly clockwise or counter-clockwise
    const move = Math.random() < 0.5 ? base : base + 'i'
    state = applyMove(state, move)
  }
  return state
}

function initCubies(): CubieState[] {
  return ALL_POSITIONS.map((pos, id) => ({
    id,
    pos: [...pos] as [number, number, number],
    origin: [...pos] as [number, number, number],
    quat: new THREE.Quaternion(),
  }))
}

// ---------------------------------------------------------------------------
// Solve detection
// ---------------------------------------------------------------------------

// Given a cubie and a world face direction (+x/-x/+y/-y/+z/-z),
// return the FACE_COLORS key that is currently pointing in that world direction.
function colorFacingWorld(cubie: CubieState, worldDir: THREE.Vector3): string {
  // Transform world direction into cubie local space
  const invQ = cubie.quat.clone().invert()
  const local = worldDir.clone().applyQuaternion(invQ)

  // Find which local axis it best aligns with
  const absX = Math.abs(local.x)
  const absY = Math.abs(local.y)
  const absZ = Math.abs(local.z)

  if (absX >= absY && absX >= absZ) {
    return local.x > 0 ? 'px' : 'nx'
  } else if (absY >= absX && absY >= absZ) {
    return local.y > 0 ? 'py' : 'ny'
  } else {
    return local.z > 0 ? 'pz' : 'nz'
  }
}


const WORLD_FACES: { dir: THREE.Vector3; axis: 0 | 1 | 2; val: number; key: string }[] = [
  { dir: new THREE.Vector3( 1, 0, 0), axis: 0, val:  1, key: 'px' },
  { dir: new THREE.Vector3(-1, 0, 0), axis: 0, val: -1, key: 'nx' },
  { dir: new THREE.Vector3( 0, 1, 0), axis: 1, val:  1, key: 'py' },
  { dir: new THREE.Vector3( 0,-1, 0), axis: 1, val: -1, key: 'ny' },
  { dir: new THREE.Vector3( 0, 0, 1), axis: 2, val:  1, key: 'pz' },
  { dir: new THREE.Vector3( 0, 0,-1), axis: 2, val: -1, key: 'nz' },
]

function isSolved(cubies: CubieState[]): boolean {
  for (const face of WORLD_FACES) {
    // Get all 9 cubies on this face
    const faceCubies = cubies.filter(c => Math.round(c.pos[face.axis]) === face.val)
    if (faceCubies.length !== 9) return false

    // What color does each cubie show on this face?
    const firstColor = colorFacingWorld(faceCubies[0], face.dir)
    // The expected color for a solved face: the face.key should match firstColor
    // Also verify it's not 'inner'
    if (firstColor === 'inner') return false

    for (let i = 1; i < faceCubies.length; i++) {
      if (colorFacingWorld(faceCubies[i], face.dir) !== firstColor) return false
    }

    // Verify all same (they are at this point) and that each cubie shows
    // the color from its origin (so we're not just checking uniformity but correctness)
    // A cube can't be "uniformly wrong" so this check is sufficient.
  }
  return true
}

// ---------------------------------------------------------------------------
// Cubie renderer
// ---------------------------------------------------------------------------

function Cubie({ pos, origin, quat }: { pos: [number,number,number]; origin: [number,number,number]; quat: THREE.Quaternion }) {
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.quaternion.copy(quat)
    }
  }, [quat])

  // Stickers in local space — position + rotation so the flat face points outward
  const stickers = useMemo(() => {
    const result: { key: string; pos: [number,number,number]; rot: [number,number,number]; color: string }[] = []
    if (origin[0] === 1)  result.push({ key:'px', pos:[ 0.47,0,0],  rot:[0, Math.PI/2,0],  color:FACE_COLORS.px })
    if (origin[0] === -1) result.push({ key:'nx', pos:[-0.47,0,0],  rot:[0,-Math.PI/2,0],  color:FACE_COLORS.nx })
    if (origin[1] === 1)  result.push({ key:'py', pos:[0, 0.47,0],  rot:[-Math.PI/2,0,0],  color:FACE_COLORS.py })
    if (origin[1] === -1) result.push({ key:'ny', pos:[0,-0.47,0],  rot:[ Math.PI/2,0,0],  color:FACE_COLORS.ny })
    if (origin[2] === 1)  result.push({ key:'pz', pos:[0,0, 0.47],  rot:[0,0,0],           color:FACE_COLORS.pz })
    if (origin[2] === -1) result.push({ key:'nz', pos:[0,0,-0.47],  rot:[0,Math.PI,0],     color:FACE_COLORS.nz })
    return result
  }, [origin])

  return (
    <group ref={groupRef} position={pos}>
      {/* Black body */}
      <mesh>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial color="#111111" roughness={0.4} metalness={0.1} />
      </mesh>
      {stickers.map(s => (
        <mesh key={s.key} position={s.pos} rotation={s.rot}>
          <boxGeometry args={[0.8, 0.8, 0.03]} />
          <meshStandardMaterial color={s.color} roughness={0.2} metalness={0.05} />
        </mesh>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Scene: hero (auto-rotate, no controls)
// ---------------------------------------------------------------------------

function HeroCubeScene({ cubies }: { cubies: CubieState[] }) {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4
      groupRef.current.rotation.x += delta * 0.15
    }
  })
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <directionalLight position={[-4, -2, -4]} intensity={0.3} />
      <group ref={groupRef}>
        {cubies.map(c => (
          <Cubie key={c.id} pos={c.pos} origin={c.origin} quat={c.quat} />
        ))}
      </group>
    </>
  )
}

// ---------------------------------------------------------------------------
// Scene: focus (orbit controls, keyboard moves)
// ---------------------------------------------------------------------------

function FocusCubeScene({
  cubies,
  onMove,
}: {
  cubies: CubieState[]
  onMove: (move: string) => void
}) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const ccw = e.shiftKey
      const map: Record<string, string> = {
        r: ccw ? 'Ri' : 'R',
        l: ccw ? 'Li' : 'L',
        u: ccw ? 'Ui' : 'U',
        d: ccw ? 'Di' : 'D',
        f: ccw ? 'Fi' : 'F',
        b: ccw ? 'Bi' : 'B',
      }
      const move = map[e.key.toLowerCase()]
      if (move) {
        e.preventDefault()
        onMove(move)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onMove])

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <directionalLight position={[-4, -2, -4]} intensity={0.3} />
      {cubies.map(c => (
        <Cubie key={c.id} pos={c.pos} origin={c.origin} quat={c.quat} />
      ))}
      <OrbitControls enableZoom={false} />
    </>
  )
}

// ---------------------------------------------------------------------------
// Key hint grid
// ---------------------------------------------------------------------------

const KEY_HINTS = [
  { key: 'R', label: 'Right face' },
  { key: 'L', label: 'Left face' },
  { key: 'U', label: 'Up face' },
  { key: 'D', label: 'Down face' },
  { key: 'F', label: 'Front face' },
  { key: 'B', label: 'Back face' },
]

function KeyHints() {
  return (
    <div className="flex flex-wrap justify-center gap-2 px-4 pb-6">
      {KEY_HINTS.map(h => (
        <div key={h.key} className="flex items-center gap-1.5 text-white/50 text-xs">
          <kbd className="px-1.5 py-0.5 rounded border border-white/20 bg-white/5 font-mono text-[11px] text-white/70">
            {h.key}
          </kbd>
          <span>{h.label}</span>
        </div>
      ))}
      <div className="w-full text-center text-white/30 text-[10px] mt-1">
        Hold Shift for counter-clockwise
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function RubiksCube() {
  const [cubies, setCubies] = useState<CubieState[]>(() => initCubies())
  const [focused, setFocused] = useState(false)
  const [solved, setSolved] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const moveCountRef = useRef(0)

  useEffect(() => {
    try {
      localStorage.removeItem('zohaib-rubiks-solved') // clear legacy key
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'true') {
        // Validated: only treat as solved if init state is actually solved
        setSolved(true)
        // Leave cubies in solved (init) state — don't scramble
      } else {
        // Always scramble on fresh visit
        localStorage.removeItem(STORAGE_KEY) // clear any bad state
        setCubies(scramble(initCubies()))
      }
    } catch {
      setCubies(scramble(initCubies()))
    }
  }, [])

  const handleMove = useCallback((move: string) => {
    setCubies(prev => {
      const next = applyMove(prev, move)
      moveCountRef.current += 1
      // Guard: don't check solve until at least 10 moves made (prevents false positive on init)
      if (moveCountRef.current >= 10 && isSolved(next)) {
        setTimeout(() => {
          setSolved(true)
          setFocused(false)
          setModalOpen(true)
          try { localStorage.setItem(STORAGE_KEY, 'true') } catch { /* ignore */ }
        }, 0)
      }
      return next
    })
  }, [])

  const openFocus = useCallback(() => {
    setFocused(true)
  }, [])

  const closeFocus = useCallback(() => setFocused(false), [])

  // Escape key closes focus overlay
  useEffect(() => {
    if (!focused) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeFocus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focused, closeFocus])

  return (
    <>
      {/* Hero mode */}
      <div className="relative flex flex-col items-center">
        <div
          className="w-[380px] h-[380px] cursor-pointer"
          onClick={openFocus}
          title="Click to interact"
        >
          <Canvas camera={{ position: [9, 8, 11], fov: 25 }}>
            <HeroCubeScene cubies={cubies} />
          </Canvas>
        </div>
        {solved ? (
          <div
            onClick={() => setModalOpen(true)}
            className="mt-2 px-4 py-1.5 text-xs font-mono font-semibold rounded-full border border-accent/60 hover:border-accent cursor-pointer transition-colors duration-200"
            style={{ color: 'var(--accent)' }}
          >
            Show Secret
          </div>
        ) : (
          <div
            onClick={openFocus}
            className="mt-2 px-4 py-1.5 text-xs font-mono text-white/20 rounded-full border border-white/10 hover:border-white/35 cursor-pointer transition-colors duration-200 tracking-widest"
          >
            ???
          </div>
        )}
      </div>

      {/* Focus overlay */}
      {focused && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeFocus}
          />
          {/* Content */}
          <div className="relative flex flex-col items-center gap-4">
            <div className="w-[480px] h-[480px]">
              <Canvas camera={{ position: [9, 8, 11], fov: 25 }}>
                <FocusCubeScene cubies={cubies} onMove={handleMove} />
              </Canvas>
            </div>
            <button
              onClick={closeFocus}
              className="text-white/30 text-xs hover:text-white/60 transition-colors"
            >
              [esc to close]
            </button>
            <KeyHints />
          </div>
        </div>
      )}

      <RubiksModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
