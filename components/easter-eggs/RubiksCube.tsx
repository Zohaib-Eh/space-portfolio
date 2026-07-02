'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { RubiksModal } from './RubiksModal'

// ---------------------------------------------------------------------------
// Constants & colours
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'zohaib-rubiks-solved-v2'

const FACE_COLORS: Record<string, string> = {
  px: '#B71234', nx: '#FF5800',
  py: '#FFFFFF', ny: '#FFD500',
  pz: '#009B48', nz: '#0046AD',
}

const MOVE_TO_FACE_KEY: Record<string, string> = {
  R:'px', L:'nx', U:'py', D:'ny', F:'pz', B:'nz',
}
function faceColor(moveName: string): string {
  return FACE_COLORS[MOVE_TO_FACE_KEY[moveName.replace('i','')]] ?? '#fff'
}

const ALL_POSITIONS: [number, number, number][] = []
for (let x = -1; x <= 1; x++)
  for (let y = -1; y <= 1; y++)
    for (let z = -1; z <= 1; z++)
      if (x !== 0 || y !== 0 || z !== 0) ALL_POSITIONS.push([x, y, z])

// ---------------------------------------------------------------------------
// Move tables
// ---------------------------------------------------------------------------

const MOVE_QUATS: Record<string, THREE.Quaternion> = {
  R:  new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),  Math.PI/2),
  Ri: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -Math.PI/2),
  L:  new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -Math.PI/2),
  Li: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),  Math.PI/2),
  U:  new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),  Math.PI/2),
  Ui: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -Math.PI/2),
  D:  new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -Math.PI/2),
  Di: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),  Math.PI/2),
  F:  new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -Math.PI/2),
  Fi: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),  Math.PI/2),
  B:  new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),  Math.PI/2),
  Bi: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -Math.PI/2),
}

const MOVE_LAYER: Record<string, { axis: 0|1|2; val: number }> = {
  R:{axis:0,val: 1}, Ri:{axis:0,val: 1},
  L:{axis:0,val:-1}, Li:{axis:0,val:-1},
  U:{axis:1,val: 1}, Ui:{axis:1,val: 1},
  D:{axis:1,val:-1}, Di:{axis:1,val:-1},
  F:{axis:2,val: 1}, Fi:{axis:2,val: 1},
  B:{axis:2,val:-1}, Bi:{axis:2,val:-1},
}

// Rotation axis + angle for layer animation — must match MOVE_QUATS exactly
const MOVE_ANIM: Record<string, { axis: THREE.Vector3; angle: number }> = {
  R: {axis:new THREE.Vector3(1,0,0), angle: Math.PI/2},
  Ri:{axis:new THREE.Vector3(1,0,0), angle:-Math.PI/2},
  L: {axis:new THREE.Vector3(1,0,0), angle:-Math.PI/2},
  Li:{axis:new THREE.Vector3(1,0,0), angle: Math.PI/2},
  U: {axis:new THREE.Vector3(0,1,0), angle: Math.PI/2},
  Ui:{axis:new THREE.Vector3(0,1,0), angle:-Math.PI/2},
  D: {axis:new THREE.Vector3(0,1,0), angle:-Math.PI/2},
  Di:{axis:new THREE.Vector3(0,1,0), angle: Math.PI/2},
  F: {axis:new THREE.Vector3(0,0,1), angle:-Math.PI/2},
  Fi:{axis:new THREE.Vector3(0,0,1), angle: Math.PI/2},
  B: {axis:new THREE.Vector3(0,0,1), angle: Math.PI/2},
  Bi:{axis:new THREE.Vector3(0,0,1), angle:-Math.PI/2},
}

// ---------------------------------------------------------------------------
// Cube state
// ---------------------------------------------------------------------------

interface CubieState {
  id: number
  pos: [number, number, number]
  origin: [number, number, number]
  quat: THREE.Quaternion
}

function rotatePos(pos: [number,number,number], move: string): [number,number,number] {
  const [x,y,z] = pos
  switch(move) {
    case 'R':  return [x,-z, y]; case 'Ri': return [x, z,-y]
    case 'L':  return [x, z,-y]; case 'Li': return [x,-z, y]
    case 'U':  return [z, y,-x]; case 'Ui': return [-z,y, x]
    case 'D':  return [-z,y, x]; case 'Di': return [z, y,-x]
    case 'F':  return [y,-x, z]; case 'Fi': return [-y,x, z]
    case 'B':  return [-y,x, z]; case 'Bi': return [y,-x, z]
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
    return { ...c, pos: rotatePos(c.pos, move), quat: newQuat }
  })
}

function scramble(cubies: CubieState[]): CubieState[] {
  let state = cubies, lastBase = ''
  const BASE = ['R','L','U','D','F','B']
  for (let i = 0; i < 20; i++) {
    const candidates = BASE.filter(m => m !== lastBase)
    const base = candidates[Math.floor(Math.random() * candidates.length)]
    lastBase = base
    state = applyMove(state, Math.random() < 0.5 ? base : base+'i')
  }
  return state
}

function initCubies(): CubieState[] {
  return ALL_POSITIONS.map((pos,id) => ({
    id, pos:[...pos] as [number,number,number], origin:[...pos] as [number,number,number],
    quat: new THREE.Quaternion(),
  }))
}

// ---------------------------------------------------------------------------
// Solve detection
// ---------------------------------------------------------------------------

const WORLD_FACES = [
  { dir: new THREE.Vector3( 1,0,0), axis:0 as const, val: 1 },
  { dir: new THREE.Vector3(-1,0,0), axis:0 as const, val:-1 },
  { dir: new THREE.Vector3( 0,1,0), axis:1 as const, val: 1 },
  { dir: new THREE.Vector3( 0,-1,0), axis:1 as const, val:-1 },
  { dir: new THREE.Vector3( 0,0,1), axis:2 as const, val: 1 },
  { dir: new THREE.Vector3( 0,0,-1), axis:2 as const, val:-1 },
]

function colorFacingWorld(cubie: CubieState, worldDir: THREE.Vector3): string {
  const local = worldDir.clone().applyQuaternion(cubie.quat.clone().invert())
  const ax = Math.abs(local.x), ay = Math.abs(local.y), az = Math.abs(local.z)
  if (ax >= ay && ax >= az) return local.x > 0 ? 'px' : 'nx'
  if (ay >= ax && ay >= az) return local.y > 0 ? 'py' : 'ny'
  return local.z > 0 ? 'pz' : 'nz'
}

function isSolved(cubies: CubieState[]): boolean {
  for (const face of WORLD_FACES) {
    const fc = cubies.filter(c => Math.round(c.pos[face.axis]) === face.val)
    if (fc.length !== 9) return false
    const first = colorFacingWorld(fc[0], face.dir)
    for (let i = 1; i < fc.length; i++)
      if (colorFacingWorld(fc[i], face.dir) !== first) return false
  }
  return true
}

// ---------------------------------------------------------------------------
// View-relative face resolution
// ---------------------------------------------------------------------------

const FACE_TABLE = [
  { normal: new THREE.Vector3( 1,0,0), cw:'R',  ccw:'Ri', name:'R' },
  { normal: new THREE.Vector3(-1,0,0), cw:'L',  ccw:'Li', name:'L' },
  { normal: new THREE.Vector3( 0,1,0), cw:'U',  ccw:'Ui', name:'U' },
  { normal: new THREE.Vector3( 0,-1,0),cw:'D',  ccw:'Di', name:'D' },
  { normal: new THREE.Vector3( 0,0,1), cw:'F',  ccw:'Fi', name:'F' },
  { normal: new THREE.Vector3( 0,0,-1),cw:'B',  ccw:'Bi', name:'B' },
]
type FaceEntry = typeof FACE_TABLE[0]

function bestFace(dir: THREE.Vector3): FaceEntry {
  return FACE_TABLE.reduce((best, f) =>
    dir.dot(f.normal) > dir.dot(best.normal) ? f : best, FACE_TABLE[0])
}

interface ViewFaces {
  front: FaceEntry; right: FaceEntry; up: FaceEntry
  bottom: FaceEntry; left: FaceEntry
  fwd: [number,number,number]
  camRight: [number,number,number]
  camUp: [number,number,number]
}

function getViewFaces(camera: THREE.Camera): ViewFaces {
  const toCamera = camera.position.clone().normalize()
  const fwd      = toCamera.clone().negate()
  // Read right/up directly from the camera's world matrix — avoids the
  // gimbal-lock issue where camera.up=[0,1,0] nearly equals toCamera when
  // looking at the top/bottom face, causing bestFace(camUp) = front face.
  const camRight = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0)
  const camUp    = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1)
  return {
    front:  bestFace(toCamera),
    right:  bestFace(camRight),
    up:     bestFace(camUp),
    bottom: bestFace(camUp.clone().negate()),
    left:   bestFace(camRight.clone().negate()),
    fwd:    fwd.toArray()      as [number,number,number],
    camRight: camRight.toArray() as [number,number,number],
    camUp:  camUp.toArray()    as [number,number,number],
  }
}

// For a given adjacent face, compute which of its CW/CCW moves produces
// rightward/upward sticker motion when viewed from the camera.
// Returns { pos: move, neg: move, isHorizontal: bool }
function edgeMoves(adj: FaceEntry, fwd: [number,number,number], camRight: [number,number,number], camUp: [number,number,number]) {
  const f = new THREE.Vector3(...fwd)
  const r = new THREE.Vector3(...camRight)
  const u = new THREE.Vector3(...camUp)
  const slide = new THREE.Vector3().crossVectors(f, adj.normal)
  const rdot  = slide.dot(r)
  const udot  = slide.dot(u)
  const horiz = Math.abs(rdot) >= Math.abs(udot)
  if (horiz) {
    // CW move sends stickers in +camRight (→) or −camRight (←)
    return rdot > 0
      ? { pos: adj.cw,  neg: adj.ccw, isHorizontal: true  }  // → = cw
      : { pos: adj.ccw, neg: adj.cw,  isHorizontal: true  }  // → = ccw
  } else {
    return udot > 0
      ? { pos: adj.cw,  neg: adj.ccw, isHorizontal: false }  // ↑ = cw
      : { pos: adj.ccw, neg: adj.cw,  isHorizontal: false }  // ↑ = ccw
  }
}

// ---------------------------------------------------------------------------
// Cubie
// ---------------------------------------------------------------------------

function Cubie({ pos, origin, quat }: { pos:[number,number,number]; origin:[number,number,number]; quat:THREE.Quaternion }) {
  const groupRef = useRef<THREE.Group>(null)
  useEffect(() => { groupRef.current?.quaternion.copy(quat) }, [quat])

  const stickers = (() => {
    const r: { key:string; p:[number,number,number]; rot:[number,number,number]; color:string }[] = []
    if (origin[0]=== 1) r.push({key:'px', p:[ .47,0,0], rot:[0, Math.PI/2,0], color:FACE_COLORS.px})
    if (origin[0]===-1) r.push({key:'nx', p:[-.47,0,0], rot:[0,-Math.PI/2,0], color:FACE_COLORS.nx})
    if (origin[1]=== 1) r.push({key:'py', p:[0, .47,0], rot:[-Math.PI/2,0,0], color:FACE_COLORS.py})
    if (origin[1]===-1) r.push({key:'ny', p:[0,-.47,0], rot:[ Math.PI/2,0,0], color:FACE_COLORS.ny})
    if (origin[2]=== 1) r.push({key:'pz', p:[0,0, .47], rot:[0,0,0],          color:FACE_COLORS.pz})
    if (origin[2]===-1) r.push({key:'nz', p:[0,0,-.47], rot:[0,Math.PI,0],    color:FACE_COLORS.nz})
    return r
  })()

  return (
    <group ref={groupRef} position={pos}>
      <mesh>
        <boxGeometry args={[0.9,0.9,0.9]} />
        <meshStandardMaterial color="#111" roughness={0.4} metalness={0.1} />
      </mesh>
      {stickers.map(s => (
        <mesh key={s.key} position={s.p} rotation={s.rot}>
          <boxGeometry args={[0.8,0.8,0.03]} />
          <meshStandardMaterial color={s.color} roughness={0.2} metalness={0.05} />
        </mesh>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Hero scene
// ---------------------------------------------------------------------------

function HeroCubeScene({ cubies }: { cubies: CubieState[] }) {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((_,dt) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += dt * 0.4
      groupRef.current.rotation.x += dt * 0.15
    }
  })
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5,8,5]} intensity={1.2} />
      <directionalLight position={[-4,-2,-4]} intensity={0.3} />
      <group ref={groupRef}>
        {cubies.map(c => <Cubie key={c.id} pos={c.pos} origin={c.origin} quat={c.quat} />)}
      </group>
    </>
  )
}

// ---------------------------------------------------------------------------
// Focus scene — animated layer moves + view tracking
// ---------------------------------------------------------------------------

interface ActiveAnim {
  move: string
  axis: THREE.Vector3
  targetAngle: number
  startTime: number
}

function FocusCubeScene({
  initialCubies,
  onMoveCommit,
  onFacesChange,
  hoveredMove,
  onRegisterMoveFn,
}: {
  initialCubies: CubieState[]
  onMoveCommit: (next: CubieState[]) => void
  onFacesChange: (f: ViewFaces) => void
  hoveredMove: string | null
  onRegisterMoveFn: (fn: (m: string) => void) => void
}) {
  const [localCubies, setLocalCubies]   = useState(initialCubies)
  const [animIds, setAnimIds]           = useState<Set<number> | null>(null)
  const localCubiesRef                  = useRef(localCubies)
  const animRef                         = useRef<ActiveAnim | null>(null)
  const layerGroupRef                   = useRef<THREE.Group>(null)
  const prevViewKeyRef                  = useRef('')
  const moveQueueRef                    = useRef<string[]>([])

  useEffect(() => { localCubiesRef.current = localCubies }, [localCubies])

  function beginAnim(move: string) {
    const { axis, val } = MOVE_LAYER[move]
    const ids = new Set(
      localCubiesRef.current
        .filter(c => Math.round(c.pos[axis]) === val)
        .map(c => c.id)
    )
    setAnimIds(ids)
    const { axis: axVec, angle } = MOVE_ANIM[move]
    animRef.current = { move, axis: axVec, targetAngle: angle, startTime: performance.now() }
  }

  const requestMove = useCallback((move: string) => {
    if (animRef.current) { moveQueueRef.current.push(move); return }
    beginAnim(move)
  }, [])

  // Expose requestMove to parent so EdgeControls buttons can fire moves
  useEffect(() => { onRegisterMoveFn(requestMove) }, [onRegisterMoveFn, requestMove])

  const cameraRef = useRef<THREE.Camera | null>(null)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!cameraRef.current) return
      const f = getViewFaces(cameraRef.current)
      const map: Record<string, string> = {
        q: f.front.cw,  w: f.front.ccw,
        e: f.right.cw,  r: f.right.ccw,
        t: f.up.cw,     y: f.up.ccw,
      }
      const move = map[e.key.toLowerCase()]
      if (move) { e.preventDefault(); requestMove(move) }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [requestMove])

  useFrame(({ camera }) => {
    cameraRef.current = camera

    // View face tracking
    const f = getViewFaces(camera)
    const key = `${f.front.name}-${f.right.name}-${f.up.name}`
    if (key !== prevViewKeyRef.current) {
      prevViewKeyRef.current = key
      onFacesChange(f)
    }

    // Animation
    const anim = animRef.current
    if (!anim || !layerGroupRef.current) return

    const t = Math.min((performance.now() - anim.startTime) / 210, 1)
    const eased = 1 - Math.pow(1 - t, 3)  // ease-out cubic
    layerGroupRef.current.setRotationFromAxisAngle(anim.axis, eased * anim.targetAngle)

    if (t >= 1) {
      layerGroupRef.current.rotation.set(0,0,0)
      animRef.current = null
      const next = applyMove(localCubiesRef.current, anim.move)
      setLocalCubies(next)
      setAnimIds(null)
      onMoveCommit(next)
      // Process queue
      if (moveQueueRef.current.length > 0) {
        beginAnim(moveQueueRef.current.shift()!)
      }
    }
  })

  // Face highlight (for hover) — find the affected layer's move
  const hoveredLayer = hoveredMove ? MOVE_LAYER[hoveredMove] : null

  const staticCubies = animIds ? localCubies.filter(c => !animIds.has(c.id)) : localCubies
  const movingCubies = animIds ? localCubies.filter(c =>  animIds.has(c.id)) : []

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5,8,5]} intensity={1.2} />
      <directionalLight position={[-4,-2,-4]} intensity={0.3} />

      {staticCubies.map(c => <Cubie key={c.id} pos={c.pos} origin={c.origin} quat={c.quat} />)}

      <group ref={layerGroupRef}>
        {movingCubies.map(c => <Cubie key={c.id} pos={c.pos} origin={c.origin} quat={c.quat} />)}
      </group>

      {/* Hover highlight: translucent slab over the hovered layer */}
      {hoveredLayer && (() => {
        const pos: [number,number,number] = [0,0,0]
        pos[hoveredLayer.axis] = hoveredLayer.val * 1.52
        const rot: [number,number,number] = [
          hoveredLayer.axis === 1 ? Math.PI/2 : 0,
          hoveredLayer.axis === 0 ? -Math.PI/2 : 0,
          0,
        ]
        const color = faceColor(hoveredMove!)
        return (
          <mesh position={pos} rotation={rot}>
            <planeGeometry args={[2.9, 2.9]} />
            <meshBasicMaterial color={color} opacity={0.22} transparent depthWrite={false} side={THREE.FrontSide} />
          </mesh>
        )
      })()}

      <OrbitControls enableZoom={false} />
    </>
  )
}

// ---------------------------------------------------------------------------
// Edge controls — arrow buttons around the viewed face
// ---------------------------------------------------------------------------

function ArrowBtn({
  move, label, onMove, onHover,
}: {
  move: string; label: string
  onMove: (m: string) => void
  onHover: (m: string | null) => void
}) {
  const color = faceColor(move)
  return (
    <button
      onClick={() => onMove(move)}
      onMouseEnter={() => onHover(move)}
      onMouseLeave={() => onHover(null)}
      className="w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all active:scale-90 border"
      style={{ borderColor:`${color}35`, background:`${color}0a`, color:`${color}aa` }}
      onMouseOver={e => {
        const el = e.currentTarget
        el.style.background    = `${color}28`
        el.style.borderColor   = `${color}88`
        el.style.color         = color
      }}
      onMouseOut={e => {
        const el = e.currentTarget
        el.style.background    = `${color}0a`
        el.style.borderColor   = `${color}35`
        el.style.color         = `${color}aa`
      }}
      title={move}
    >
      {label}
    </button>
  )
}

function EdgeControls({
  faces, onMove, onHover,
}: {
  faces: ViewFaces | null
  onMove: (m: string) => void
  onHover: (m: string | null) => void
}) {
  if (!faces) return (
    <div className="h-16 flex items-center justify-center text-white/20 text-xs font-mono">
      drag to orbit…
    </div>
  )

  const top    = edgeMoves(faces.up,     faces.fwd, faces.camRight, faces.camUp)
  const bottom = edgeMoves(faces.bottom, faces.fwd, faces.camRight, faces.camUp)
  const right  = edgeMoves(faces.right,  faces.fwd, faces.camRight, faces.camUp)
  const left   = edgeMoves(faces.left,   faces.fwd, faces.camRight, faces.camUp)
  const frontColor = faceColor(faces.front.cw)

  return (
    <div className="flex flex-col items-center gap-1 pb-4 pt-2 select-none">
      {/* Face label */}
      <p className="text-[9px] font-mono uppercase tracking-widest text-white/25 mb-1">
        facing {faces.front.name} face · q/w e/r t/y
      </p>

      {/* Top row arrows — control top edge (up-adjacent face) */}
      <div className="flex gap-1">
        <ArrowBtn move={top.neg} label="←" onMove={onMove} onHover={onHover} />
        <ArrowBtn move={top.pos} label="→" onMove={onMove} onHover={onHover} />
      </div>

      {/* Middle: left | face | right */}
      <div className="flex items-center gap-1">
        {/* Left column */}
        <div className="flex flex-col gap-1">
          <ArrowBtn move={left.pos} label="↑" onMove={onMove} onHover={onHover} />
          <ArrowBtn move={left.neg} label="↓" onMove={onMove} onHover={onHover} />
        </div>

        {/* Center face square */}
        <div
          className="w-[92px] h-[92px] rounded-xl flex flex-col items-center justify-center gap-1 border"
          style={{ background:`${frontColor}12`, borderColor:`${frontColor}40` }}
        >
          <div className="w-4 h-4 rounded-sm" style={{ background: frontColor, boxShadow:`0 0 8px ${frontColor}` }} />
          <span className="text-[9px] font-mono text-white/40">{faces.front.name} face</span>
          {/* CW / CCW for the face itself */}
          <div className="flex gap-1 mt-0.5">
            <button
              onClick={() => onMove(faces.front.cw)}
              onMouseEnter={() => onHover(faces.front.cw)}
              onMouseLeave={() => onHover(null)}
              className="w-7 h-7 rounded-md text-xs border transition-all active:scale-90"
              style={{ borderColor:`${frontColor}40`, background:`${frontColor}10`, color:`${frontColor}aa` }}
              title={`${faces.front.name} CW`}
            >↻</button>
            <button
              onClick={() => onMove(faces.front.ccw)}
              onMouseEnter={() => onHover(faces.front.ccw)}
              onMouseLeave={() => onHover(null)}
              className="w-7 h-7 rounded-md text-xs border transition-all active:scale-90"
              style={{ borderColor:`${frontColor}40`, background:`${frontColor}10`, color:`${frontColor}aa` }}
              title={`${faces.front.name} CCW`}
            >↺</button>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-1">
          <ArrowBtn move={right.pos} label="↑" onMove={onMove} onHover={onHover} />
          <ArrowBtn move={right.neg} label="↓" onMove={onMove} onHover={onHover} />
        </div>
      </div>

      {/* Bottom row arrows — control bottom edge (down-adjacent face) */}
      <div className="flex gap-1">
        <ArrowBtn move={bottom.neg} label="←" onMove={onMove} onHover={onHover} />
        <ArrowBtn move={bottom.pos} label="→" onMove={onMove} onHover={onHover} />
      </div>

      <p className="text-[8px] font-mono text-white/15 mt-1 tracking-widest">
        drag cube to see other faces
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function RubiksCube() {
  const [cubies, setCubies]       = useState<CubieState[]>(() => initCubies())
  const [focused, setFocused]     = useState(false)
  const [solved, setSolved]       = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [viewFaces, setViewFaces] = useState<ViewFaces | null>(null)
  const [hoveredMove, setHoveredMove] = useState<string | null>(null)
  const moveCountRef   = useRef(0)
  const requestMoveRef = useRef<(m: string) => void>(() => {})

  useEffect(() => {
    try {
      localStorage.removeItem('zohaib-rubiks-solved')
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'true') setSolved(true)
      else { localStorage.removeItem(STORAGE_KEY); setCubies(scramble(initCubies())) }
    } catch { setCubies(scramble(initCubies())) }
  }, [])

  const handleMoveCommit = useCallback((next: CubieState[]) => {
    setCubies(next)
    moveCountRef.current += 1
    if (moveCountRef.current >= 10 && isSolved(next)) {
      setTimeout(() => {
        setSolved(true); setFocused(false); setModalOpen(true)
        try { localStorage.setItem(STORAGE_KEY, 'true') } catch { /* ignore */ }
      }, 0)
    }
  }, [])

  useEffect(() => {
    if (!focused) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setFocused(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focused])

  return (
    <>
      {/* Hero (auto-spinning) */}
      <div className="flex flex-col items-center">
        <div className="w-[380px] h-[380px] cursor-pointer" onClick={() => setFocused(true)} title="Click to play">
          <Canvas camera={{ position: [9,8,11], fov: 25 }}>
            <HeroCubeScene cubies={cubies} />
          </Canvas>
        </div>
        {solved ? (
          <div onClick={() => setModalOpen(true)}
            className="mt-2 px-4 py-1.5 text-xs font-mono font-semibold rounded-full border border-accent/60 hover:border-accent cursor-pointer transition-colors"
            style={{ color: 'var(--accent)' }}>
            Show Secret
          </div>
        ) : (
          <div onClick={() => setFocused(true)}
            className="mt-2 px-4 py-1.5 text-xs font-mono text-white/20 rounded-full border border-white/10 hover:border-white/35 cursor-pointer transition-colors tracking-widest">
            ???
          </div>
        )}
      </div>

      {/* Focus overlay */}
      {focused && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setFocused(false)} />
          <div className="relative flex flex-col items-center gap-2">
            <div className="w-[460px] h-[460px]">
              <Canvas camera={{ position: [9,8,11], fov: 25 }}>
                <FocusCubeScene
                  initialCubies={cubies}
                  onMoveCommit={handleMoveCommit}
                  onFacesChange={setViewFaces}
                  hoveredMove={hoveredMove}
                  onRegisterMoveFn={fn => { requestMoveRef.current = fn }}
                />
              </Canvas>
            </div>

            <div className="w-[460px] bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
              <EdgeControls faces={viewFaces} onMove={m => requestMoveRef.current(m)} onHover={setHoveredMove} />
            </div>

            <button onClick={() => setFocused(false)} className="text-white/25 text-xs hover:text-white/50 transition-colors">
              esc to close
            </button>
          </div>
        </div>
      )}

      <RubiksModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
