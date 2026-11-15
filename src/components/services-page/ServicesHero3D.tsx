import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * QUISTER TECHNOLOGIES — SERVICES HERO 3D ARCHITECTURAL INSTALLATION
 * 
 * Three interconnected precision-engineered forms:
 * 1. Digital Experiences: Precision-machined champagne-gold curved viewport chassis
 * 2. Business Systems: Stepped architectural obsidian foundation with smoked glass disc
 * 3. Intelligent Technology: Floating optical core ring with refractive datum lens
 */

function HeroSculptureScene({
  mousePosRef,
}: {
  mousePosRef: React.MutableRefObject<{ x: number; y: number }>
}) {
  const masterGroupRef = useRef<THREE.Group>(null)
  const ring1Ref = useRef<THREE.Group>(null)
  const ring2Ref = useRef<THREE.Group>(null)
  const coreRef = useRef<THREE.Group>(null)

  // Materials
  const materials = useMemo(() => {
    // 1. Brushed Champagne Gold Alloy
    const champagneGoldMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D4B276'),
      metalness: 0.92,
      roughness: 0.24,
      envMapIntensity: 1.3,
    })

    // 2. Polished Brass Trim
    const brassMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F0D292'),
      metalness: 0.96,
      roughness: 0.16,
    })

    // 3. Deep Obsidian Slate
    const obsidianMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#12141C'),
      metalness: 0.94,
      roughness: 0.32,
    })

    // 4. Smoked Architectural Glass
    const smokedGlassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#181B26'),
      metalness: 0.1,
      roughness: 0.12,
      transmission: 0.65,
      transparent: true,
      opacity: 0.75,
      ior: 1.52,
    })

    // 5. Optical Luminous Inlay
    const opticalMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFF8EC'),
      emissive: new THREE.Color('#ECC87A'),
      emissiveIntensity: 1.8,
      metalness: 0.6,
      roughness: 0.2,
    })

    return {
      champagneGoldMat,
      brassMat,
      obsidianMat,
      smokedGlassMat,
      opticalMat,
    }
  }, [])

  // Geometries
  const geometries = useMemo(() => {
    // Form 1: Digital Experiences Outer Torus Viewport
    const outerViewport = new THREE.TorusGeometry(1.42, 0.055, 24, 64)
    const innerTrackRail = new THREE.TorusGeometry(1.28, 0.024, 16, 64)

    // Form 2: Business Systems Foundation
    const foundationPlinth = new THREE.CylinderGeometry(0.92, 1.05, 0.08, 48)
    const glassDisc = new THREE.CylinderGeometry(1.15, 1.15, 0.025, 48)

    // Form 3: Intelligent Technology Optical Core
    const gimbalRing = new THREE.TorusGeometry(0.72, 0.04, 20, 48)
    const centralDisc = new THREE.CylinderGeometry(0.38, 0.38, 0.04, 32)
    const datumRing = new THREE.RingGeometry(0.48, 0.54, 32)

    return {
      outerViewport,
      innerTrackRail,
      foundationPlinth,
      glassDisc,
      gimbalRing,
      centralDisc,
      datumRing,
    }
  }, [])

  // Dispose on unmount
  useEffect(() => {
    return () => {
      Object.values(geometries).forEach((g) => g.dispose())
      Object.values(materials).forEach((m) => m.dispose())
    }
  }, [geometries, materials])

  // Animation Loop with harmonic rotation & mouse parallax
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const time = state.clock.getElapsedTime()

    // Smooth subtle mouse parallax
    if (masterGroupRef.current) {
      const mx = mousePosRef.current.x * 0.24
      const my = mousePosRef.current.y * 0.18
      masterGroupRef.current.rotation.y = THREE.MathUtils.damp(
        masterGroupRef.current.rotation.y,
        mx + Math.sin(time * 0.25) * 0.06,
        3.5,
        dt
      )
      masterGroupRef.current.rotation.x = THREE.MathUtils.damp(
        masterGroupRef.current.rotation.x,
        0.32 - my + Math.cos(time * 0.2) * 0.04,
        3.5,
        dt
      )
      masterGroupRef.current.position.y = Math.sin(time * 0.6) * 0.06
    }

    // Individual harmonic rotation
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = time * 0.08
      ring1Ref.current.rotation.x = Math.sin(time * 0.15) * 0.15
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -time * 0.11
      ring2Ref.current.rotation.y = Math.cos(time * 0.18) * 0.18
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.28
      coreRef.current.rotation.x = Math.sin(time * 0.22) * 0.2
      const pulse = 1.0 + Math.sin(time * 2.8) * 0.05
      coreRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group ref={masterGroupRef} position={[0, 0, 0]}>
      {/* Lighting Rig */}
      <ambientLight intensity={0.65} color="#2A2620" />
      <directionalLight position={[4, 6, 4]} intensity={1.4} color="#FFF8EB" />
      <directionalLight position={[-4, 3, 3]} intensity={0.7} color="#E4E9F2" />
      <directionalLight position={[0, -3, -4]} intensity={1.1} color="#D4B276" />
      <pointLight position={[0, 0.4, 0.8]} intensity={1.8} distance={3.5} color="#FFE6B6" />

      {/* -------------------------------------------------------------------
          FORM 1: DIGITAL EXPERIENCES (Outer Champagne Viewport Chassis)
          ------------------------------------------------------------------- */}
      <group ref={ring1Ref}>
        <mesh geometry={geometries.outerViewport} material={materials.champagneGoldMat} />
        <mesh geometry={geometries.innerTrackRail} material={materials.brassMat} />

        {/* 4 Precision Connector Brackets */}
        {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, idx) => (
          <mesh
            key={`bracket-${idx}`}
            position={[Math.cos(angle) * 1.35, Math.sin(angle) * 1.35, 0]}
            rotation={[0, 0, angle]}
            material={materials.obsidianMat}
          >
            <boxGeometry args={[0.08, 0.16, 0.07]} />
          </mesh>
        ))}
      </group>

      {/* -------------------------------------------------------------------
          FORM 2: BUSINESS SYSTEMS (Architectural Base & Smoked Glass Disc)
          ------------------------------------------------------------------- */}
      <group position={[0, -0.65, 0]} rotation={[0.08, 0, 0]}>
        {/* Obsidian Foundation Plinth */}
        <mesh position={[0, -0.05, 0]} material={materials.obsidianMat} geometry={geometries.foundationPlinth} />

        {/* Precision Machined Chamfer Collar */}
        <mesh position={[0, 0, 0]} material={materials.champagneGoldMat}>
          <cylinderGeometry args={[0.85, 0.88, 0.03, 48]} />
        </mesh>

        {/* Smoked Architectural Glass Disc */}
        <mesh position={[0, 0.03, 0]} material={materials.smokedGlassMat} geometry={geometries.glassDisc} />

        {/* Concentric Datum Hairline */}
        <mesh position={[0, 0.046, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.65, 0.67, 48]} />
          <meshBasicMaterial color="#D4B276" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* -------------------------------------------------------------------
          FORM 3: INTELLIGENT TECHNOLOGY (Floating Optical Core & Datum Ring)
          ------------------------------------------------------------------- */}
      <group ref={ring2Ref} position={[0, 0.15, 0]}>
        {/* Gimbal Ring */}
        <mesh geometry={geometries.gimbalRing} material={materials.champagneGoldMat} />

        {/* Floating Optical Core Disc */}
        <group ref={coreRef}>
          <mesh geometry={geometries.centralDisc} material={materials.obsidianMat} />

          {/* Glowing Optical Lens Ring */}
          <mesh position={[0, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.18, 0.28, 32]} />
            <meshStandardMaterial
              color="#FFF8EC"
              emissive="#ECC87A"
              emissiveIntensity={2.4}
              roughness={0.1}
            />
          </mesh>

          {/* Floating Datum Beacon */}
          <mesh position={[0, 0.04, 0]}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshStandardMaterial
              color="#FFFFFF"
              emissive="#ECC87A"
              emissiveIntensity={3.2}
              roughness={0.05}
            />
          </mesh>
        </group>

        {/* Planar Datum Ring */}
        <mesh geometry={geometries.datumRing} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#ECC87A" transparent opacity={0.35} depthWrite={false} />
        </mesh>
      </group>

      {/* Floor Datum Shadow Projection */}
      <mesh position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 1.4, 48]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} depthWrite={false} />
      </mesh>
    </group>
  )
}

export default function ServicesHero3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const [hasWebGL, setHasWebGL] = useState<boolean>(true)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) setHasWebGL(false)
    } catch {
      setHasWebGL(false)
    }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handlePointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1
      const ny = -(((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1)
      mousePosRef.current.x = THREE.MathUtils.clamp(nx, -1, 1)
      mousePosRef.current.y = THREE.MathUtils.clamp(ny, -1, 1)
    }

    const handlePointerLeave = () => {
      mousePosRef.current.x = 0
      mousePosRef.current.y = 0
    }

    el.addEventListener('pointermove', handlePointerMove, { passive: true })
    el.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      el.removeEventListener('pointermove', handlePointerMove)
      el.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  if (!hasWebGL) {
    return (
      <div
        className="w-full h-full min-h-[380px] flex items-center justify-center rounded-2xl"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #151822 0%, #0A0C12 100%)',
          border: '1px solid rgba(201, 164, 102, 0.2)',
        }}
      >
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-champagne/40 flex items-center justify-center">
            <span className="font-mono text-champagne text-xs">03 // 3D</span>
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-champagne">
            ARCHITECTURAL SYSTEM VISUALIZATION
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400px] sm:h-[480px] lg:h-[540px] rounded-2xl overflow-hidden select-none"
      style={{
        background:
          'radial-gradient(ellipse 75% 65% at 50% 48%, rgba(26, 30, 44, 0.45) 0%, rgba(9, 10, 14, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow:
          '0 28px 60px -22px rgba(0, 0, 0, 0.7), inset 0 0 45px rgba(201, 164, 102, 0.04)',
      }}
    >
      {/* Subtle Atmospheric Studio Glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(201, 164, 102, 0.08) 0%, transparent 68%)',
        }}
      />

      {/* Frame Status Metadata */}
      <div className="absolute top-4 left-5 right-5 z-10 flex items-center justify-between text-[10px] font-mono tracking-[0.2em] uppercase text-stone-400 pointer-events-none">
        <div className="flex items-center gap-2" style={{ color: '#D4B276' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4B276] animate-pulse" />
          <span>TRIAD // ARCHITECTURAL KINEMATICS</span>
        </div>
        <span className="opacity-60 hidden sm:inline">SYS • EXP • INTEL</span>
      </div>

      <Canvas
        camera={{ position: [0, 0.25, 4.4], fov: 38 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.75) : 1}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <HeroSculptureScene mousePosRef={mousePosRef} />
      </Canvas>

      {/* Bottom Technical Tag */}
      <div className="absolute bottom-4 left-5 right-5 z-10 flex items-center justify-between text-[9.5px] font-mono tracking-[0.18em] uppercase text-stone-400 pointer-events-none">
        <span className="opacity-70">
          SPATIAL INTERACTION // PRECISION MACHINED ARCHITECTURE
        </span>
        <span className="opacity-50">60 FPS</span>
      </div>
    </div>
  )
}
