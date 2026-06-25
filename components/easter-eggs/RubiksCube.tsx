'use client'
import { useRef, useState, useCallback, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { RubiksModal } from './RubiksModal'

// Face colors for a 2x2 cube: 6 faces
// Order matches Three.js BoxGeometry material index: +x, -x, +y, -y, +z, -z
const FACE_COLORS = ['#ff2200', '#ff8800', '#ffffff', '#ffff00', '#0044ff', '#00aa00']
const INNER = '#111111'

// Each cubie occupies positions in a 2x2 grid (-0.51 or +0.51 on each axis)
const POSITIONS: [number, number, number][] = [
  [-0.51, -0.51, -0.51], [0.51, -0.51, -0.51],
  [-0.51,  0.51, -0.51], [0.51,  0.51, -0.51],
  [-0.51, -0.51,  0.51], [0.51, -0.51,  0.51],
  [-0.51,  0.51,  0.51], [0.51,  0.51,  0.51],
]

function getCubieColors(pos: [number, number, number]): string[] {
  const [x, y, z] = pos
  return [
    x > 0 ? FACE_COLORS[0] : INNER,  // +x: red
    x < 0 ? FACE_COLORS[1] : INNER,  // -x: orange
    y > 0 ? FACE_COLORS[2] : INNER,  // +y: white
    y < 0 ? FACE_COLORS[3] : INNER,  // -y: yellow
    z > 0 ? FACE_COLORS[4] : INNER,  // +z: blue
    z < 0 ? FACE_COLORS[5] : INNER,  // -z: green
  ]
}

function Cubie({ position, colors }: { position: [number, number, number]; colors: string[] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.95, 0.95, 0.95]} />
      {colors.map((color, i) => (
        <meshStandardMaterial key={i} attach={`material-${i}`} color={color} />
      ))}
    </mesh>
  )
}

function CubeScene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      {POSITIONS.map((pos, i) => (
        <Cubie key={i} position={pos} colors={getCubieColors(pos)} />
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
