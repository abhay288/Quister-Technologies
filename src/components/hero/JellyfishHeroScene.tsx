import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import JellyfishOrganism from './JellyfishOrganism'
import FloatingWings from './FloatingWings'
import { evaluateChoreography } from './choreography'

export interface MouseState {
  x: number
  y: number
  targetX: number
  targetY: number
}

interface JellyfishHeroSceneProps {
  scrollProgressRef: React.MutableRefObject<number>
}

// ---------------------------------------------------------------------------
// 3 Golden Orbital Trajectory Rings (Signature Luxury Feature in Reference)
// ---------------------------------------------------------------------------
function OrbitalTrajectoryRings({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>
}) {
  const groupRef = useRef<THREE.Group>(null)
  const ring1Ref = useRef<THREE.LineLoop>(null)
  const ring2Ref = useRef<THREE.LineLoop>(null)
  const ring3Ref = useRef<THREE.LineLoop>(null)

  const { ring1Geo, ring2Geo, ring3Geo } = useMemo(() => {
    const buildEllipse = (rx: number, ry: number, segments = 96) => {
      const pts = []
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2
        pts.push(new THREE.Vector3(Math.cos(theta) * rx, Math.sin(theta) * ry, 0))
      }
      return new THREE.BufferGeometry().setFromPoints(pts)
    }

    return {
      ring1Geo: buildEllipse(3.8, 3.4),
      ring2Geo: buildEllipse(4.6, 4.1),
      ring3Geo: buildEllipse(2.9, 2.6),
    }
  }, [])

  const ringMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color('#EAC37D'),
        transparent: true,
        opacity: 0.10,
        blending: THREE.AdditiveBlending,
      }),
    []
  )

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const sp = scrollProgress.current
    const choreo = evaluateChoreography(sp)
    const fade = choreo.heroSceneOpacity

    ringMaterial.opacity = 0.10 * fade

    if (groupRef.current) {
      groupRef.current.position.y = 1.45 + Math.sin(time * 0.4) * 0.05
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = time * 0.035
      ring1Ref.current.rotation.x = 0.45 + Math.sin(time * 0.25) * 0.03
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -time * 0.028
      ring2Ref.current.rotation.y = 0.38 + Math.cos(time * 0.2) * 0.03
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = time * 0.042
      ring3Ref.current.rotation.x = -0.55 + Math.sin(time * 0.3) * 0.025
    }
  })

  return (
    <group ref={groupRef} position={[0, 1.45, 0]}>
      {/* Primary Outer Orbital Ring */}
      <lineLoop
        ref={ring1Ref}
        geometry={ring1Geo}
        material={ringMaterial}
        rotation={[0.45, 0.3, 0.2]}
      />

      {/* Secondary Counter-Rotating Orbital Ring */}
      <lineLoop
        ref={ring2Ref}
        geometry={ring2Geo}
        material={ringMaterial}
        rotation={[-0.4, 0.38, -0.25]}
      />

      {/* Tertiary Tilted Inner Orbital Ring */}
      <lineLoop
        ref={ring3Ref}
        geometry={ring3Geo}
        material={ringMaterial}
        rotation={[-0.55, -0.45, 0.4]}
      />
    </group>
  )
}

// ---------------------------------------------------------------------------
// Bioluminescent Pearls / Floating Luminous Droplets (Matching Reference)
// ---------------------------------------------------------------------------
function BioluminescentPearls({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>
}) {
  const groupRef = useRef<THREE.Group>(null)

  const pearls = useMemo(() => {
    const list = []
    const count = 18
    for (let i = 0; i < count; i++) {
      const isGold = i % 2 === 0
      const radius = 0.035 + (i % 4) * 0.015
      const baseX = ((i % 6) - 2.5) * 1.35 + (Math.sin(i * 1.7) * 0.4)
      const baseY = ((i % 5) - 2.0) * 0.85 + 1.2 + (Math.cos(i * 2.1) * 0.3)
      const baseZ = ((i % 4) - 1.5) * 0.8 - 0.2
      const speed = 0.6 + (i % 3) * 0.25
      const phase = i * 1.1

      list.push({
        isGold,
        radius,
        baseX,
        baseY,
        baseZ,
        speed,
        phase,
      })
    }
    return list
  }, [])

  const sphereGeo = useMemo(() => new THREE.SphereGeometry(1, 16, 16), [])

  const goldPearlMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#ECC77F'),
        emissive: new THREE.Color('#382208'),
        emissiveIntensity: 0.45,
        roughness: 0.1,
        metalness: 0.95,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.88,
      }),
    []
  )

  const purplePearlMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#B692F0'),
        emissive: new THREE.Color('#280E48'),
        emissiveIntensity: 0.4,
        roughness: 0.08,
        metalness: 0.1,
        transmission: 0.82,
        thickness: 0.8,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.85,
      }),
    []
  )

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const sp = scrollProgress.current
    const choreo = evaluateChoreography(sp)
    const fade = choreo.heroSceneOpacity

    goldPearlMaterial.opacity = 0.18 * fade
    purplePearlMaterial.opacity = 0.15 * fade

    if (groupRef.current) {
      groupRef.current.children.forEach((child, idx) => {
        const p = pearls[idx]
        if (!p) return
        const bob = Math.sin(time * p.speed + p.phase) * 0.08
        const drift = Math.cos(time * p.speed * 0.7 + p.phase) * 0.04
        child.position.x = p.baseX + drift
        child.position.y = p.baseY + bob
        child.position.z = p.baseZ
      })
    }
  })

  return (
    <group ref={groupRef}>
      {pearls.map((p, idx) => (
        <mesh
          key={idx}
          geometry={sphereGeo}
          material={p.isGold ? goldPearlMaterial : purplePearlMaterial}
          scale={p.radius}
          position={[p.baseX, p.baseY, p.baseZ]}
        />
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Atmospheric Stardust & Gold Embers (Subtle, Clean & Non-Cluttering)
// ---------------------------------------------------------------------------
function StardustParticles() {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const count = 46
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    const colorGold = new THREE.Color('#F6DEAA')
    const colorLavender = new THREE.Color('#CBABFF')

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12 + 1.2
      pos[i * 3 + 2] = (Math.random() - 0.5) * 7 - 1.2

      const c = Math.random() > 0.4 ? colorGold : colorLavender
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return { positions: pos, colors: col }
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.012
      pointsRef.current.position.y = Math.sin(time * 0.2) * 0.03
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        vertexColors
        transparent
        opacity={0.12}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ---------------------------------------------------------------------------
// 5-Stage Cinematic Camera Controller
// ---------------------------------------------------------------------------
function CameraController({
  mouseState,
  scrollProgress,
}: {
  mouseState: React.MutableRefObject<MouseState>
  scrollProgress: React.MutableRefObject<number>
}) {
  const { camera } = useThree()
  const lookAtTargetRef = useRef(new THREE.Vector3(0, 1.45, 0))

  useFrame(() => {
    const m = mouseState.current
    const sp = scrollProgress.current

    // Query 5-stage choreography pose
    const choreo = evaluateChoreography(sp)
    const camPose = choreo.camera

    // Subtle mouse parallax with controlled depth damping
    const mouseOffsetX = m.x * 0.22
    const mouseOffsetY = -m.y * 0.14

    // Damped camera translation towards choreographed coordinates
    const targetX = camPose.x + mouseOffsetX
    const targetY = camPose.y + mouseOffsetY
    const targetZ = camPose.z

    camera.position.x += (targetX - camera.position.x) * 0.075
    camera.position.y += (targetY - camera.position.y) * 0.075
    camera.position.z += (targetZ - camera.position.z) * 0.075

    // Damped lookAt target
    const targetLookX = camPose.lookAtX + mouseOffsetX * 0.1
    const targetLookY = camPose.lookAtY + mouseOffsetY * 0.1
    const targetLookZ = camPose.lookAtZ

    lookAtTargetRef.current.x += (targetLookX - lookAtTargetRef.current.x) * 0.075
    lookAtTargetRef.current.y += (targetLookY - lookAtTargetRef.current.y) * 0.075
    lookAtTargetRef.current.z += (targetLookZ - lookAtTargetRef.current.z) * 0.075

    camera.lookAt(lookAtTargetRef.current)
  })

  return null
}

// ---------------------------------------------------------------------------
// Master Exported 3D Jellyfish Scene
// ---------------------------------------------------------------------------
export default function JellyfishHeroScene({ scrollProgressRef }: JellyfishHeroSceneProps) {
  const [hasWebGL, setHasWebGL] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseState = useRef<MouseState>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  })

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) setHasWebGL(false)
    } catch {
      setHasWebGL(false)
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -(e.clientY / window.innerHeight) * 2 + 1
      mouseState.current.targetX = THREE.MathUtils.clamp(nx, -1, 1)
      mouseState.current.targetY = THREE.MathUtils.clamp(ny, -1, 1)
    }

    const handlePointerLeave = () => {
      mouseState.current.targetX = 0
      mouseState.current.targetY = 0
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('mouseleave', handlePointerLeave)

    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('mouseleave', handlePointerLeave)
    }
  }, [])

  if (!hasWebGL) {
    return (
      <div
        className="w-full h-full flex items-center justify-center pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(128,80,184,0.18) 0%, #09090D 75%)',
        }}
      />
    )
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      <Canvas
        camera={{ position: [0, 0.7, 7.6], fov: isMobile ? 46 : 36 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
      >
        {/* Studio Abyssal Lighting Rig (Matching Reference Image 1) */}
        <ambientLight color="#07060F" intensity={0.35} />

        {/* Primary Brilliant White Specular Rim Light (Sharp glass highlights along dome ridge) */}
        <directionalLight
          position={[3.8, 5.8, 3.6]}
          color="#FFFFFF"
          intensity={3.4}
        />

        {/* Ethereal Violet-Ice Counter-Rim Light (Crystalline glass silhouette & filament separation) */}
        <directionalLight
          position={[-5.0, 4.0, -2.8]}
          color="#C4A0FF"
          intensity={2.0}
        />

        {/* Translucent Warm Champagne Backlight for Core Gelatin Refraction */}
        <directionalLight
          position={[0.2, 4.5, -4.5]}
          color="#FFE5B4"
          intensity={2.0}
        />

        {/* Centered Vertical 3D Jellyfish Organism (Upper elevation for visible dome) */}
        <JellyfishOrganism
          mouseState={mouseState}
          scrollProgress={scrollProgressRef}
        />

        {/* Sculptural Floating Wings & Background Petals */}
        <FloatingWings
          mouseState={mouseState}
          scrollProgress={scrollProgressRef}
        />

        {/* 3 Golden Orbital Trajectory Rings */}
        <OrbitalTrajectoryRings scrollProgress={scrollProgressRef} />

        {/* Bioluminescent Floating Pearls & Droplets */}
        <BioluminescentPearls scrollProgress={scrollProgressRef} />

        {/* Minimal Non-Cluttering Stardust Embers */}
        <StardustParticles />

        {/* 5-Stage Cinematic Camera Choreography Rig */}
        <CameraController
          mouseState={mouseState}
          scrollProgress={scrollProgressRef}
        />
      </Canvas>
    </div>
  )
}
