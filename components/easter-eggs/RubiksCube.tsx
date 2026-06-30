'use client'
import { useRef, useState, useCallback, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { RubiksModal } from './RubiksModal'

// Standard Rubik's cube face colors: right, left, top, bottom, front, back
const FACE_COLORS = {
  px: '#B71234', // red   (+x right)
  nx: '#FF5800', // orange(-x left)
  py: '#FFFFFF', // white (+y top)
  ny: '#FFD500', // yellow(-y bottom)
  pz: '#009B48', // green (+z front)
  nz: '#0046AD', // blue  (-z back)
}

const POSITIONS: [number, number, number][] = [
  [-0.51, -0.51, -0.51], [0.51, -0.51, -0.51],
  [-0.51,  0.51, -0.51], [0.51,  0.51, -0.51],
  [-0.51, -0.51,  0.51], [0.51, -0.51,  0.51],
  [-0.51,  0.51,  0.51], [0.51,  0.51,  0.51],
]

// Sticker descriptor: which outer faces get which color
const STICKERS: { axis: 'x'|'y'|'z'; sign: 1|-1; color: string; pos: [number,number,number]; rot: [number,number,number] }[] = [
  { axis:'x', sign: 1, color: FACE_COLORS.px, pos:[0.46,0,0],   rot:[0, Math.PI/2, 0] },
  { axis:'x', sign:-1, color: FACE_COLORS.nx, pos:[-0.46,0,0],  rot:[0,-Math.PI/2, 0] },
  { axis:'y', sign: 1, color: FACE_COLORS.py, pos:[0,0.46,0],   rot:[-Math.PI/2,0,0]  },
  { axis:'y', sign:-1, color: FACE_COLORS.ny, pos:[0,-0.46,0],  rot:[ Math.PI/2,0,0]  },
  { axis:'z', sign: 1, color: FACE_COLORS.pz, pos:[0,0,0.46],   rot:[0,0,0]           },
  { axis:'z', sign:-1, color: FACE_COLORS.nz, pos:[0,0,-0.46],  rot:[0,Math.PI,0]     },
]

function Cubie({ position }: { position: [number, number, number] }) {
  const [px, py, pz] = position
  // Which stickers are on an outer face for this cubie
  const visibleStickers = STICKERS.filter(s =>
    (s.axis === 'x' && Math.sign(px) === s.sign) ||
    (s.axis === 'y' && Math.sign(py) === s.sign) ||
    (s.axis === 'z' && Math.sign(pz) === s.sign)
  )
  return (
    <group position={position}>
      {/* Black plastic body */}
      <mesh>
        <boxGeometry args={[0.89, 0.89, 0.89]} />
        <meshStandardMaterial color="#111111" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Colored stickers on outer faces only */}
      {visibleStickers.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={s.rot}>
          <boxGeometry args={[0.75, 0.75, 0.02]} />
          <meshStandardMaterial color={s.color} roughness={0.2} metalness={0.05} />
        </mesh>
      ))}
    </group>
  )
}

function CubeScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-4, -2, -4]} intensity={0.3} />
      {POSITIONS.map((pos, i) => (
        <Cubie key={i} position={pos} />
      ))}
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
    </>
  )
}

const STORAGE_KEY = 'zohaib-rubiks-solved'

export function RubiksCube() {
  const [solved, setSolved] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  // Persist solved state in localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'true') {
        setSolved(true)
      }
    } catch {
      // localStorage may not be available
    }
  }, [])

  const handleSolve = useCallback(() => {
    setSolved(true)
    setModalOpen(true)
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      // ignore
    }
  }, [])

  return (
    <div className="relative">
      <div className="w-[300px] h-[300px] cursor-grab active:cursor-grabbing" style={{ background: 'transparent' }}>
        <Canvas camera={{ position: [2, 2, 3], fov: 50 }}>
          <CubeScene />
        </Canvas>
      </div>
      {!solved && (
        <p className="text-white/20 text-[10px] text-center mt-1">drag to rotate</p>
      )}
      {/* Hidden solve trigger — visible only on hover for discoverability */}
      <button
        onClick={handleSolve}
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-white/10 hover:text-white/30 transition-colors"
        aria-label="Solve the cube"
      >
        [solve]
      </button>
      <RubiksModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
