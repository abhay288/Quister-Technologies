import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, AdaptiveDpr } from '@react-three/drei'
import * as THREE from 'three'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const LENGTH_SEGMENTS = 140
const WIDTH_SEGMENTS = 12
const RIBBON_LENGTH = 10.8
const BASE_WIDTH = 1.25

// Companion streamer dimensions
const COMPANION_LENGTH_SEGMENTS = 100
const COMPANION_WIDTH_SEGMENTS = 8
const COMPANION_WIDTH = 0.55

interface MouseState {
  x: number
  y: number
  targetX: number
  targetY: number
  speed: number
  impulse: number
  impulseTime: number
  isHovered: boolean
}

// Master + Companion Flowing Liquid Gold Silk Stream
function InteractiveFlowingSilk({
  scrollProgress,
  mouseState,
}: {
  scrollProgress: React.MutableRefObject<number>
  mouseState: React.MutableRefObject<MouseState>
}) {
  const masterGroupRef = useRef<THREE.Group>(null)
  const masterMeshRef = useRef<THREE.Mesh>(null)
  const companionMeshRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)

  // 1. Master Gold Silk Ribbon Geometry
  const { masterGeo, masterLeftGeo, masterRightGeo, masterLineLeft, masterLineRight, masterPositions } = useMemo(() => {
    const vertexCount = (LENGTH_SEGMENTS + 1) * (WIDTH_SEGMENTS + 1)
    const positions = new Float32Array(vertexCount * 3)
    const normals = new Float32Array(vertexCount * 3)
    const uvs = new Float32Array(vertexCount * 2)
    const indices: number[] = []

    for (let i = 0; i <= LENGTH_SEGMENTS; i++) {
      const u = i / LENGTH_SEGMENTS
      for (let j = 0; j <= WIDTH_SEGMENTS; j++) {
        const v = j / WIDTH_SEGMENTS
        const idx = i * (WIDTH_SEGMENTS + 1) + j
        uvs[idx * 2] = u
        uvs[idx * 2 + 1] = v
      }
    }

    for (let i = 0; i < LENGTH_SEGMENTS; i++) {
      for (let j = 0; j < WIDTH_SEGMENTS; j++) {
        const a = i * (WIDTH_SEGMENTS + 1) + j
        const b = (i + 1) * (WIDTH_SEGMENTS + 1) + j
        const c = (i + 1) * (WIDTH_SEGMENTS + 1) + (j + 1)
        const d = i * (WIDTH_SEGMENTS + 1) + (j + 1)

        indices.push(a, b, d)
        indices.push(b, c, d)
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    geo.setIndex(indices)

    const leftEdgePos = new Float32Array((LENGTH_SEGMENTS + 1) * 3)
    const rightEdgePos = new Float32Array((LENGTH_SEGMENTS + 1) * 3)

    const leftGeo = new THREE.BufferGeometry()
    leftGeo.setAttribute('position', new THREE.BufferAttribute(leftEdgePos, 3))
    const rightGeo = new THREE.BufferGeometry()
    rightGeo.setAttribute('position', new THREE.BufferAttribute(rightEdgePos, 3))

    const hemMat = new THREE.LineBasicMaterial({
      color: '#FFF2C6',
      transparent: true,
      opacity: 0.75,
    })

    const lineLeft = new THREE.Line(leftGeo, hemMat)
    const lineRight = new THREE.Line(rightGeo, hemMat)

    return {
      masterGeo: geo,
      masterLeftGeo: leftGeo,
      masterRightGeo: rightGeo,
      masterLineLeft: lineLeft,
      masterLineRight: lineRight,
      masterPositions: positions,
    }
  }, [])

  // 2. Companion Ethereal Silk Streamer Geometry
  const { companionGeo, companionPositions } = useMemo(() => {
    const vertexCount = (COMPANION_LENGTH_SEGMENTS + 1) * (COMPANION_WIDTH_SEGMENTS + 1)
    const positions = new Float32Array(vertexCount * 3)
    const normals = new Float32Array(vertexCount * 3)
    const uvs = new Float32Array(vertexCount * 2)
    const indices: number[] = []

    for (let i = 0; i <= COMPANION_LENGTH_SEGMENTS; i++) {
      const u = i / COMPANION_LENGTH_SEGMENTS
      for (let j = 0; j <= COMPANION_WIDTH_SEGMENTS; j++) {
        const v = j / COMPANION_WIDTH_SEGMENTS
        const idx = i * (COMPANION_WIDTH_SEGMENTS + 1) + j
        uvs[idx * 2] = u
        uvs[idx * 2 + 1] = v
      }
    }

    for (let i = 0; i < COMPANION_LENGTH_SEGMENTS; i++) {
      for (let j = 0; j < COMPANION_WIDTH_SEGMENTS; j++) {
        const a = i * (COMPANION_WIDTH_SEGMENTS + 1) + j
        const b = (i + 1) * (COMPANION_WIDTH_SEGMENTS + 1) + j
        const c = (i + 1) * (COMPANION_WIDTH_SEGMENTS + 1) + (j + 1)
        const d = i * (COMPANION_WIDTH_SEGMENTS + 1) + (j + 1)

        indices.push(a, b, d)
        indices.push(b, c, d)
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    geo.setIndex(indices)

    return {
      companionGeo: geo,
      companionPositions: positions,
    }
  }, [])

  // 3. Stardust particles drifting through air
  const { particlesGeo, particleBasePos } = useMemo(() => {
    const count = 130
    const pos = new Float32Array(count * 3)
    const base = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const u = i / count
      base[i * 3] = (u - 0.5) * (RIBBON_LENGTH + 1.5) + (Math.random() - 0.5) * 1.5
      base[i * 3 + 1] = (Math.random() - 0.5) * 1.8
      base[i * 3 + 2] = (Math.random() - 0.5) * 1.4

      pos[i * 3] = base[i * 3]
      pos[i * 3 + 1] = base[i * 3 + 1]
      pos[i * 3 + 2] = base[i * 3 + 2]
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return { particlesGeo: geo, particleBasePos: base }
  }, [])

  // Materials: Haute-Couture Liquid Gold Physical Silk
  const masterMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#E0BF78'),
      emissive: new THREE.Color('#1F170B'),
      roughness: 0.14,
      metalness: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      sheen: 1.0,
      sheenColor: new THREE.Color('#FFF8E4'),
      reflectivity: 0.98,
      envMapIntensity: 3.6,
      side: THREE.DoubleSide,
    })
  }, [])

  // Ethereal sheer companion silk material
  const companionMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#F2DBA5'),
      roughness: 0.22,
      metalness: 0.88,
      clearcoat: 0.8,
      sheen: 1.0,
      sheenColor: new THREE.Color('#FFFFFF'),
      transmission: 0.35,
      opacity: 0.88,
      transparent: true,
      envMapIntensity: 2.8,
      side: THREE.DoubleSide,
    })
  }, [])

  // 60FPS fluid simulation & mouse triggered reactive animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const p = scrollProgress.current
    const m = mouseState.current

    // Smooth mouse lerping
    m.x = THREE.MathUtils.lerp(m.x, m.targetX, 0.08)
    m.y = THREE.MathUtils.lerp(m.y, m.targetY, 0.08)

    // Decaying mouse impulse wave (from clicking or rapid movement)
    if (m.impulse > 0.01) {
      m.impulse *= 0.96
    } else {
      m.impulse = 0
    }

    const flowSpeed = 1.5
    const tangent = new THREE.Vector3()
    const up = new THREE.Vector3(0, 1, 0)
    const binormal = new THREE.Vector3()
    const normal = new THREE.Vector3()

    // ==========================================
    // 1. UPDATE MASTER SILK RIBBON
    // ==========================================
    const masterPosAttr = masterGeo.getAttribute('position') as THREE.BufferAttribute
    const leftAttr = masterLeftGeo.getAttribute('position') as THREE.BufferAttribute
    const rightAttr = masterRightGeo.getAttribute('position') as THREE.BufferAttribute

    for (let i = 0; i <= LENGTH_SEGMENTS; i++) {
      const u = i / LENGTH_SEGMENTS

      // Mouse interactive fluid ripple: localized wave responding to cursor position
      const mouseDistU = Math.abs(u - (m.x * 0.45 + 0.5))
      const mouseFluidDisplacement =
        Math.exp(-mouseDistU * 4.5) * Math.sin(t * 7.0 - mouseDistU * 10.0) * (0.18 + m.speed * 0.35)

      // Click ripple impulse traveling down the ribbon
      const impulseWave = m.impulse * Math.sin(u * 14.0 - (t - m.impulseTime) * 9.0) * Math.exp(-Math.abs(u - 0.5) * 2.0) * 0.25

      // Harmonic fluid air currents
      const wave1 = Math.sin(u * 3.1 - t * flowSpeed)
      const wave2 = Math.cos(u * 5.2 - t * (flowSpeed * 1.3)) * 0.35
      const wave3 = Math.sin(u * 1.7 + t * 0.6) * 0.22

      // Central spine coordinates
      const spineX = (u - 0.5) * RIBBON_LENGTH + Math.sin(t * 0.35 + u * 2.2) * 0.3 + m.x * 0.3
      const spineY = (wave1 * 0.65 + wave2 + wave3) * 0.75 + mouseFluidDisplacement + impulseWave + (p - 0.5) * 0.3
      const spineZ = Math.cos(u * 2.6 - t * 1.1) * 0.55 + Math.sin(u * 3.8 + t * 0.8) * 0.25 + m.y * 0.35

      // Tangent & Frenet-Serret Frame
      const nextU = Math.min(1.0, u + 0.01)
      const nextWave1 = Math.sin(nextU * 3.1 - t * flowSpeed)
      const nextWave2 = Math.cos(nextU * 5.2 - t * (flowSpeed * 1.3)) * 0.35
      const nextWave3 = Math.sin(nextU * 1.7 + t * 0.6) * 0.22

      const nextX = (nextU - 0.5) * RIBBON_LENGTH + Math.sin(t * 0.35 + nextU * 2.2) * 0.3 + m.x * 0.3
      const nextY = (nextWave1 * 0.65 + nextWave2 + nextWave3) * 0.75 + mouseFluidDisplacement + impulseWave + (p - 0.5) * 0.3
      const nextZ = Math.cos(nextU * 2.6 - t * 1.1) * 0.55 + Math.sin(nextU * 3.8 + t * 0.8) * 0.25 + m.y * 0.35

      tangent.set(nextX - spineX, nextY - spineY, nextZ - spineZ).normalize()
      binormal.crossVectors(tangent, up).normalize()
      if (binormal.lengthSq() < 0.001) binormal.set(1, 0, 0)
      normal.crossVectors(binormal, tangent).normalize()

      // Aerodynamic air twist with interactive mouse tilt
      const twist =
        Math.sin(u * 2.6 - t * 1.1) * 2.0 +
        (u - 0.5) * Math.PI * 1.4 +
        m.x * 0.6 +
        (p - 0.5) * 0.6

      const cosT = Math.cos(twist)
      const sinT = Math.sin(twist)

      const twistedBinormalX = binormal.x * cosT + normal.x * sinT
      const twistedBinormalY = binormal.y * cosT + normal.y * sinT
      const twistedBinormalZ = binormal.z * cosT + normal.z * sinT

      const twistedNormalX = normal.x * cosT - binormal.x * sinT
      const twistedNormalY = normal.y * cosT - binormal.y * sinT
      const twistedNormalZ = normal.z * cosT - binormal.z * sinT

      // Sinusoidal tapered silk envelope
      const envelope = Math.sin(Math.PI * Math.pow(u, 0.95))
      const currentWidth = BASE_WIDTH * (0.15 + 0.85 * envelope)

      for (let j = 0; j <= WIDTH_SEGMENTS; j++) {
        const v = j / WIDTH_SEGMENTS
        const wOffset = (v - 0.5) * currentWidth

        // Secondary flutter ripples across the width of the fabric
        const flutter = Math.sin(u * 11.0 - t * 3.2 + v * 3.5) * (0.045 * envelope)

        const px = spineX + twistedBinormalX * wOffset + twistedNormalX * flutter
        const py = spineY + twistedBinormalY * wOffset + twistedNormalY * flutter
        const pz = spineZ + twistedBinormalZ * wOffset + twistedNormalZ * flutter

        const vertexIndex = i * (WIDTH_SEGMENTS + 1) + j
        masterPositions[vertexIndex * 3] = px
        masterPositions[vertexIndex * 3 + 1] = py
        masterPositions[vertexIndex * 3 + 2] = pz

        // Save hem line coordinates
        if (j === 0) {
          leftAttr.setXYZ(i, px, py, pz)
        } else if (j === WIDTH_SEGMENTS) {
          rightAttr.setXYZ(i, px, py, pz)
        }
      }
    }

    masterPosAttr.copyArray(masterPositions)
    masterPosAttr.needsUpdate = true
    leftAttr.needsUpdate = true
    rightAttr.needsUpdate = true
    masterGeo.computeVertexNormals()

    // ==========================================
    // 2. UPDATE COMPANION SHEER STREAMER
    // ==========================================
    const companionPosAttr = companionGeo.getAttribute('position') as THREE.BufferAttribute

    for (let i = 0; i <= COMPANION_LENGTH_SEGMENTS; i++) {
      const u = i / COMPANION_LENGTH_SEGMENTS

      // Harmonic phase-shifted orbit around master ribbon
      const cWave1 = Math.sin(u * 3.6 - t * (flowSpeed * 1.15) + Math.PI * 0.7)
      const cWave2 = Math.cos(u * 6.0 - t * 1.7) * 0.28

      const cSpineX = (u - 0.5) * (RIBBON_LENGTH * 0.95) + Math.cos(t * 0.4 + u * 2.8) * 0.35 + m.x * 0.25
      const cSpineY = (cWave1 * 0.55 + cWave2) * 0.75 - 0.25 + m.y * 0.2
      const cSpineZ = Math.sin(u * 3.0 - t * 1.3) * 0.55 - 0.3

      const cNextU = Math.min(1.0, u + 0.01)
      const cNextWave1 = Math.sin(cNextU * 3.6 - t * (flowSpeed * 1.15) + Math.PI * 0.7)
      const cNextWave2 = Math.cos(cNextU * 6.0 - t * 1.7) * 0.28
      const cNextX = (cNextU - 0.5) * (RIBBON_LENGTH * 0.95) + Math.cos(t * 0.4 + cNextU * 2.8) * 0.35 + m.x * 0.25
      const cNextY = (cNextWave1 * 0.55 + cNextWave2) * 0.75 - 0.25 + m.y * 0.2
      const cNextZ = Math.sin(cNextU * 3.0 - t * 1.3) * 0.55 - 0.3

      tangent.set(cNextX - cSpineX, cNextY - cSpineY, cNextZ - cSpineZ).normalize()
      binormal.crossVectors(tangent, up).normalize()
      if (binormal.lengthSq() < 0.001) binormal.set(1, 0, 0)
      normal.crossVectors(binormal, tangent).normalize()

      const cTwist = Math.cos(u * 3.2 - t * 1.2) * 2.4 - (u - 0.5) * Math.PI
      const cosCT = Math.cos(cTwist)
      const sinCT = Math.sin(cTwist)

      const cTwistedBinormalX = binormal.x * cosCT + normal.x * sinCT
      const cTwistedBinormalY = binormal.y * cosCT + normal.y * sinCT
      const cTwistedBinormalZ = binormal.z * cosCT + normal.z * sinCT

      const cEnvelope = Math.sin(Math.PI * Math.pow(u, 0.9))
      const cCurrentWidth = COMPANION_WIDTH * (0.15 + 0.85 * cEnvelope)

      for (let j = 0; j <= COMPANION_WIDTH_SEGMENTS; j++) {
        const v = j / COMPANION_WIDTH_SEGMENTS
        const wOffset = (v - 0.5) * cCurrentWidth

        const px = cSpineX + cTwistedBinormalX * wOffset
        const py = cSpineY + cTwistedBinormalY * wOffset
        const pz = cSpineZ + cTwistedBinormalZ * wOffset

        const vertexIndex = i * (COMPANION_WIDTH_SEGMENTS + 1) + j
        companionPositions[vertexIndex * 3] = px
        companionPositions[vertexIndex * 3 + 1] = py
        companionPositions[vertexIndex * 3 + 2] = pz
      }
    }

    companionPosAttr.copyArray(companionPositions)
    companionPosAttr.needsUpdate = true
    companionGeo.computeVertexNormals()

    // Smooth whole-group pitch, roll, and mouse reactive flight
    if (masterGroupRef.current) {
      const targetGroupX = (p - 0.5) * 1.2 + m.x * 0.6
      const targetGroupY = Math.sin(p * Math.PI) * 0.15 - m.y * 0.35
      const targetGroupRotZ = (p - 0.5) * 0.25 + m.x * 0.2
      const targetGroupRotX = -m.y * 0.25
      const targetGroupRotY = Math.sin(t * 0.35) * 0.12 + (p - 0.5) * 0.3

      masterGroupRef.current.position.x = THREE.MathUtils.lerp(masterGroupRef.current.position.x, targetGroupX, 0.06)
      masterGroupRef.current.position.y = THREE.MathUtils.lerp(masterGroupRef.current.position.y, targetGroupY, 0.06)
      masterGroupRef.current.rotation.z = THREE.MathUtils.lerp(masterGroupRef.current.rotation.z, targetGroupRotZ, 0.06)
      masterGroupRef.current.rotation.x = THREE.MathUtils.lerp(masterGroupRef.current.rotation.x, targetGroupRotX, 0.06)
      masterGroupRef.current.rotation.y = THREE.MathUtils.lerp(masterGroupRef.current.rotation.y, targetGroupRotY, 0.06)
    }

    // Swirling sparkling stardust
    if (particlesRef.current) {
      const pAttr = particlesGeo.getAttribute('position') as THREE.BufferAttribute
      for (let k = 0; k < 130; k++) {
        const bx = particleBasePos[k * 3]
        const by = particleBasePos[k * 3 + 1]
        const bz = particleBasePos[k * 3 + 2]

        const floatX = bx + Math.sin(t * 0.75 + k) * 0.3 + m.x * 0.2
        const floatY = by + Math.cos(t * 1.05 + k * 1.4) * 0.22 - m.y * 0.15
        const floatZ = bz + Math.sin(t * 0.85 + k * 0.9) * 0.2

        pAttr.setXYZ(k, floatX, floatY, floatZ)
      }
      pAttr.needsUpdate = true
    }
  })

  return (
    <group ref={masterGroupRef}>
      {/* Primary Liquid Gold Silk Master Ribbon */}
      <mesh ref={masterMeshRef} geometry={masterGeo} material={masterMaterial} castShadow receiveShadow />

      {/* Secondary Ethereal Companion Silk Streamer */}
      <mesh ref={companionMeshRef} geometry={companionGeo} material={companionMaterial} />

      {/* Haute-Couture Tailored Golden Hems */}
      <primitive object={masterLineLeft} />
      <primitive object={masterLineRight} />

      {/* Sparkling Airborne Golden Embers */}
      <points ref={particlesRef} geometry={particlesGeo}>
        <pointsMaterial
          size={0.038}
          color="#FFF5D6"
          transparent
          opacity={0.75}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

export default function KineticRibbonStream() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollProgress = useRef(0)
  const lastMousePos = useRef({ x: 0, y: 0, time: Date.now() })
  const mouseState = useRef<MouseState>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    speed: 0,
    impulse: 0,
    impulseTime: 0,
    isHovered: false,
  })

  useEffect(() => {
    if (!containerRef.current) return

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 85%',
      end: 'bottom 15%',
      scrub: 0.8,
      onUpdate: (self) => {
        scrollProgress.current = self.progress
      },
    })

    const handlePointerMove = (e: PointerEvent) => {
      const now = Date.now()
      const dt = Math.max(1, now - lastMousePos.current.time)

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1
        const targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)

        const dx = targetX - lastMousePos.current.x
        const dy = targetY - lastMousePos.current.y
        const dist = Math.hypot(dx, dy)
        const speed = Math.min(2.5, (dist / dt) * 100)

        mouseState.current.targetX = targetX
        mouseState.current.targetY = targetY
        mouseState.current.speed = speed

        lastMousePos.current = { x: targetX, y: targetY, time: now }
      }
    }

    const handlePointerDown = () => {
      // Trigger instant fluid ripple impulse on click/touch
      mouseState.current.impulse = 1.0
      mouseState.current.impulseTime = performance.now() * 0.001
    }

    const handlePointerEnter = () => {
      mouseState.current.isHovered = true
    }

    const handlePointerLeave = () => {
      mouseState.current.isHovered = false
      mouseState.current.targetX = 0
      mouseState.current.targetY = 0
      mouseState.current.speed = 0
    }

    const elem = containerRef.current
    elem.addEventListener('pointermove', handlePointerMove, { passive: true })
    elem.addEventListener('pointerdown', handlePointerDown)
    elem.addEventListener('pointerenter', handlePointerEnter)
    elem.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      trigger.kill()
      elem.removeEventListener('pointermove', handlePointerMove)
      elem.removeEventListener('pointerdown', handlePointerDown)
      elem.removeEventListener('pointerenter', handlePointerEnter)
      elem.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[220px] sm:h-[270px] my-0 overflow-visible cursor-grab active:cursor-grabbing select-none"
      style={{ background: 'transparent' }}
      title="Interactive 3D Liquid Gold Silk — Hover and drag to interact"
    >
      {/* 3D WebGL Canvas Viewport - Seamlessly Floating on Section Background */}
      <Canvas
        camera={{ position: [0, 0, 4.6], fov: 38 }}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.35,
        }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <AdaptiveDpr pixelated />
        <ambientLight intensity={0.7} color="#181B22" />
        <directionalLight position={[-4, 5, 4]} intensity={4.0} color="#FFF4DC" />
        <directionalLight position={[4, -3, -3]} intensity={2.4} color="#8FA8D8" />
        <pointLight position={[0, -1.8, 2.8]} intensity={2.0} color="#C9A96E" />
        <spotLight position={[0, 6, 3]} intensity={2.8} angle={0.55} penumbra={0.8} color="#FFF8E7" />
        <Environment preset="city" />

        <InteractiveFlowingSilk scrollProgress={scrollProgress} mouseState={mouseState} />
      </Canvas>
    </div>
  )
}
