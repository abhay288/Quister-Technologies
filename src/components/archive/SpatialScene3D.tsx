import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { FEATURED_PROJECTS } from './projectData'

interface SpatialScene3DProps {
  progress: number // 0.0 to 1.0 across the 3 chapters
  mouseState: { x: number; y: number }
}

// ---------------------------------------------------------------------------
// Real Production Interface Display Surface (Dimensional Beveled Screen)
// ---------------------------------------------------------------------------
function DisplaySurface({
  imageSrc,
  position,
  rotation,
  scale = [3.6, 2.25, 0.08],
}: {
  imageSrc: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale?: [number, number, number]
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader()
    const tex = loader.load(imageSrc)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    return tex
  }, [imageSrc])

  return (
    <group position={position} rotation={rotation}>
      {/* Sleek Champagne-Gold Beveled Frame */}
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[scale[0] + 0.14, scale[1] + 0.14, scale[2]]} />
        <meshPhysicalMaterial
          color="#18141F"
          metalness={0.92}
          roughness={0.18}
          clearcoat={0.9}
        />
      </mesh>

      {/* Screen Face with Real Screenshot Texture */}
      <mesh ref={meshRef}>
        <planeGeometry args={[scale[0], scale[1]]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* Outer Soft Gold Glow Accent Rim */}
      <lineSegments position={[0, 0, 0.01]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(scale[0], scale[1])]} />
        <lineBasicMaterial color="#E8C88A" transparent opacity={0.65} />
      </lineSegments>
    </group>
  )
}

// ---------------------------------------------------------------------------
// 3D Metallic Smartphone Device for Kanhaiya General Store (Android App)
// ---------------------------------------------------------------------------
function SmartphoneDevice({
  imageSrc,
  position,
  rotation,
}: {
  imageSrc: string
  position: [number, number, number]
  rotation: [number, number, number]
}) {
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader()
    const tex = loader.load(imageSrc)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [imageSrc])

  return (
    <group position={position} rotation={rotation} scale={0.88}>
      {/* Phone Titanium Outer Chassis */}
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[1.75, 3.45, 0.12]} />
        <meshPhysicalMaterial
          color="#221C28"
          metalness={0.95}
          roughness={0.15}
          clearcoat={1.0}
        />
      </mesh>

      {/* Gold Rim Edge Accent */}
      <lineSegments position={[0, 0, 0.03]}>
        <edgesGeometry args={[new THREE.BoxGeometry(1.76, 3.46, 0.12)]} />
        <lineBasicMaterial color="#E8C88A" transparent opacity={0.55} />
      </lineSegments>

      {/* Screen Face with App Preview */}
      <mesh position={[0, 0, 0.025]}>
        <planeGeometry args={[1.65, 3.3]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  )
}

// ---------------------------------------------------------------------------
// Chapter 3 EcoIntel: 3D High-Tech Motherboard / PCB Slab with Traces & Laser
// ---------------------------------------------------------------------------
function CircuitBoardEnvironment({
  position,
}: {
  position: [number, number, number]
}) {
  const scanLineRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (scanLineRef.current) {
      // Oscillate scanning laser across PCB
      scanLineRef.current.position.y = Math.sin(time * 1.8) * 1.5
    }
  })

  const { traceLinesGeo, chips } = useMemo(() => {
    const lines: number[] = []
    for (let i = 0; i < 48; i++) {
      const x1 = ((i % 12) - 5.5) * 0.4
      const y1 = (Math.floor(i / 12) - 2) * 0.8
      const x2 = x1 + (i % 2 === 0 ? 0.35 : -0.35)
      const y2 = y1 + 0.4
      lines.push(x1, y1, 0.02, x2, y2, 0.02)
      lines.push(x2, y2, 0.02, x2 + 0.3, y2, 0.02)
    }
    const traceGeo = new THREE.BufferGeometry()
    traceGeo.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3))

    const chipList = [
      { x: -1.2, y: 0.8, w: 0.7, h: 0.7, z: 0.08 },
      { x: 1.1, y: -0.6, w: 0.85, h: 0.65, z: 0.08 },
      { x: -0.8, y: -1.1, w: 0.5, h: 0.5, z: 0.06 },
      { x: 1.4, y: 0.9, w: 0.6, h: 0.6, z: 0.06 },
    ]

    return { traceLinesGeo: traceGeo, chips: chipList }
  }, [])

  return (
    <group position={position}>
      {/* Dark Silicon PCB Substrate */}
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[4.8, 3.6, 0.12]} />
        <meshPhysicalMaterial
          color="#0B1416"
          roughness={0.25}
          metalness={0.7}
          clearcoat={0.6}
        />
      </mesh>

      {/* Gold & Cyan Circuit Traces */}
      <lineSegments geometry={traceLinesGeo}>
        <lineBasicMaterial color="#38BDF8" transparent opacity={0.6} />
      </lineSegments>

      {/* Surface Mounted Chips */}
      {chips.map((c, idx) => (
        <mesh key={idx} position={[c.x, c.y, c.z * 0.5]}>
          <boxGeometry args={[c.w, c.h, c.z]} />
          <meshPhysicalMaterial
            color="#141824"
            metalness={0.88}
            roughness={0.2}
            clearcoat={0.9}
          />
        </mesh>
      ))}

      {/* Animated Cyan Laser Scan Line */}
      <mesh ref={scanLineRef} position={[0, 0, 0.08]}>
        <planeGeometry args={[4.6, 0.04]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.85} />
      </mesh>
    </group>
  )
}

// ---------------------------------------------------------------------------
// Golden Jellyfish Guide Traveling Across Chapters
// ---------------------------------------------------------------------------
function ArchiveCompanionJellyfish({
  progress,
}: {
  progress: number
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (!groupRef.current) return

    // Position smoothly lerps across chapter camera coordinates
    // Ch 1 (progress ~0.16) -> Ch 2 (~0.5) -> Ch 3 (~0.83)
    const jfX = THREE.MathUtils.lerp(-1.8, 2.2, progress) + Math.cos(time * 0.8) * 0.15
    const jfY = 0.8 + Math.sin(time * 1.2) * 0.18
    const jfZ = THREE.MathUtils.lerp(-1.0, 1.2, Math.sin(progress * Math.PI))

    groupRef.current.position.set(jfX, jfY, jfZ)
    groupRef.current.rotation.z = -0.45 + Math.sin(time * 0.6) * 0.08
    groupRef.current.rotation.y = time * 0.15
  })

  return (
    <group ref={groupRef} scale={0.45}>
      {/* Radiant Amber Core */}
      <mesh>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshPhysicalMaterial
          color="#FFA825"
          emissive="#FF7200"
          emissiveIntensity={2.5}
          transmission={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Translucent Glass Dome */}
      <mesh>
        <sphereGeometry args={[1.1, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          transmission={0.92}
          roughness={0.05}
          clearcoat={1.0}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      <pointLight color="#FFA025" intensity={3.5} distance={5} />
    </group>
  )
}

// ---------------------------------------------------------------------------
// Camera Choreography across the 3 Projects
// ---------------------------------------------------------------------------
function SceneController({
  progress,
  mouseState,
}: {
  progress: number
  mouseState: { x: number; y: number }
}) {
  useFrame(({ camera }) => {
    // Camera journeys through 3 spatial project realms along Z/X
    // Ch 1 (Anuj): [0, 0, 5.5]
    // Ch 2 (Kanhaiya): [4.5, 0, -4.5]
    // Ch 3 (EcoIntel): [-4.5, 0, -14.5]

    const targetX = THREE.MathUtils.lerp(
      0,
      progress < 0.5 ? 4.5 : -4.5,
      smoothstep(0.15, 0.85, progress)
    ) + mouseState.x * 0.25

    const targetZ = THREE.MathUtils.lerp(5.5, -14.5, progress)
    const targetY = mouseState.y * 0.18

    camera.position.x += (targetX - camera.position.x) * 0.08
    camera.position.y += (targetY - camera.position.y) * 0.08
    camera.position.z += (targetZ - camera.position.z) * 0.08

    const lookTargetX = THREE.MathUtils.lerp(0, progress < 0.5 ? 4.5 : -4.5, progress)
    const lookTargetZ = THREE.MathUtils.lerp(0, -18.5, progress)
    camera.lookAt(lookTargetX, 0, lookTargetZ)
  })

  return null
}

function smoothstep(min: number, max: number, value: number) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)))
  return x * x * (3 - 2 * x)
}

// ---------------------------------------------------------------------------
// Master Exported Spatial 3D Scene
// ---------------------------------------------------------------------------
export default function SpatialScene3D({
  progress,
  mouseState,
}: SpatialScene3DProps) {
  const p1 = FEATURED_PROJECTS[0] // Anuj Enterprises
  const p2 = FEATURED_PROJECTS[1] // Kanhaiya General Store
  const p3 = FEATURED_PROJECTS[2] // EcoIntel

  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 42 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}
    >
      <ambientLight color="#08070E" intensity={0.5} />
      <directionalLight position={[4, 6, 4]} color="#FFF8ED" intensity={2.5} />
      <directionalLight position={[-4, 3, -3]} color="#C4A0FF" intensity={1.8} />

      {/* Chapter 1: Anuj Enterprises (B2B FMCG Distribution Matrix) */}
      <DisplaySurface
        imageSrc={p1.image}
        position={[0, 0, 0]}
        rotation={[0.08, -0.15, 0.02]}
        scale={[3.8, 2.35, 0.08]}
      />

      {/* Chapter 2: Kanhaiya General Store (Android App Storefront) */}
      <SmartphoneDevice
        imageSrc={p2.image}
        position={[4.5, 0, -8.5]}
        rotation={[-0.05, 0.22, -0.04]}
      />

      {/* Chapter 3: EcoIntel (3D Circuit Board Telemetry) */}
      <group position={[-4.5, 0, -17.5]} rotation={[0.05, -0.18, 0.02]}>
        <CircuitBoardEnvironment position={[0, 0, -0.2]} />
        <DisplaySurface
          imageSrc={p3.image}
          position={[0, 0, 0.4]}
          rotation={[0, 0, 0]}
          scale={[3.6, 2.2, 0.06]}
        />
      </group>

      {/* Golden Jellyfish Companion Guide */}
      <ArchiveCompanionJellyfish progress={progress} />

      {/* Camera Controller */}
      <SceneController progress={progress} mouseState={mouseState} />
    </Canvas>
  )
}
