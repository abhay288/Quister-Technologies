import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface PrecisionSculptureProps {
  scrollProgress?: number
  mousePos: { x: number; y: number }
}

// ---------------------------------------------------------------------------
// Precision Sculpture Three.js Scene
// Perfectly proportioned with dynamic responsive fitting to prevent any boundary clipping
// ---------------------------------------------------------------------------
function PrecisionSculptureScene({
  scrollProgress = 0,
  mousePos,
}: PrecisionSculptureProps) {
  const { viewport } = useThree()
  const masterGroupRef = useRef<THREE.Group>(null)
  const outerRibbonRef = useRef<THREE.Mesh>(null)
  const glassRibbonRef = useRef<THREE.Mesh>(null)
  const ring1Ref = useRef<THREE.Group>(null)
  const ring2Ref = useRef<THREE.Group>(null)
  const ring3Ref = useRef<THREE.Group>(null)
  const coreRef = useRef<THREE.Mesh>(null)

  // Dynamic scale calculation guarantees the sculpture never clips on any screen size or aspect ratio
  const autoFitScale = useMemo(() => {
    const safeW = viewport.width * 0.76
    const safeH = viewport.height * 0.80
    const maxDiameter = 3.05 // 2 * 1.52 max geometry bounding diameter
    const scaleX = safeW / maxDiameter
    const scaleY = safeH / maxDiameter
    return Math.min(scaleX, scaleY, 1.0)
  }, [viewport.width, viewport.height])

  // Soft Radial Contact Shadow Texture
  const shadowTex = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.70)')
    grad.addColorStop(0.35, 'rgba(10, 8, 15, 0.40)')
    grad.addColorStop(0.7, 'rgba(10, 8, 15, 0.10)')
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 256, 256)
    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [])

  // Mathematical Curves for the Interlocking Ribbons (Refined Proportions)
  const { goldGeo, glassGeo } = useMemo(() => {
    const segments = 160
    const goldPoints: THREE.Vector3[] = []
    const glassPoints: THREE.Vector3[] = []

    for (let i = 0; i <= segments; i++) {
      const u = (i / segments) * Math.PI * 2

      // Spatial trefoil harmonic loop (Primary Gold Ribbon)
      const x1 = Math.sin(u) * 1.08 + Math.sin(u * 2) * 0.24
      const y1 = Math.cos(u) * 0.84 + Math.sin(u * 3) * 0.18
      const z1 = Math.cos(u * 2) * 0.64

      // Complementary interlocking spatial loop (Smoked Glass Ribbon)
      const u2 = u + 1.28
      const x2 = Math.sin(u2) * 1.00 + Math.sin(u2 * 2) * 0.22
      const y2 = Math.cos(u2) * 0.78 + Math.sin(u2 * 3) * 0.16
      const z2 = Math.cos(u2 * 2) * 0.58

      goldPoints.push(new THREE.Vector3(x1, y1, z1))
      glassPoints.push(new THREE.Vector3(x2, y2, z2))
    }

    const goldCurve = new THREE.CatmullRomCurve3(goldPoints, true)
    const glassCurve = new THREE.CatmullRomCurve3(glassPoints, true)

    const gGeo = new THREE.TubeGeometry(goldCurve, 140, 0.052, 28, true)
    const glGeo = new THREE.TubeGeometry(glassCurve, 140, 0.042, 28, true)

    return { goldGeo: gGeo, glassGeo: glGeo }
  }, [])

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    if (masterGroupRef.current) {
      masterGroupRef.current.scale.setScalar(autoFitScale)

      // Damped pointer parallax and gentle perspective shift
      const targetRotY = mousePos.x * 0.18 + (scrollProgress - 0.5) * 0.35
      const targetRotX = -mousePos.y * 0.14 + (scrollProgress - 0.5) * 0.16
      masterGroupRef.current.rotation.y = THREE.MathUtils.damp(
        masterGroupRef.current.rotation.y,
        targetRotY,
        4.0,
        delta
      )
      masterGroupRef.current.rotation.x = THREE.MathUtils.damp(
        masterGroupRef.current.rotation.x,
        targetRotX,
        4.0,
        delta
      )

      // Calm autonomous breathing
      masterGroupRef.current.position.y = Math.sin(time * 0.6) * 0.03
    }

    // Slow, stately autonomous rotation of ribbons
    if (outerRibbonRef.current) {
      outerRibbonRef.current.rotation.y = time * 0.10
      outerRibbonRef.current.rotation.z = Math.sin(time * 0.07) * 0.08
    }

    if (glassRibbonRef.current) {
      glassRibbonRef.current.rotation.y = -time * 0.08
      glassRibbonRef.current.rotation.x = Math.cos(time * 0.06) * 0.09
    }

    // Precision Gyroscope Internal Ring Rotations
    if (ring1Ref.current) ring1Ref.current.rotation.x = time * 0.18
    if (ring2Ref.current) ring2Ref.current.rotation.y = -time * 0.15
    if (ring3Ref.current) ring3Ref.current.rotation.z = time * 0.22

    // Central optical core refraction rotation
    if (coreRef.current) {
      coreRef.current.rotation.x = time * 0.30
      coreRef.current.rotation.y = time * 0.38
    }
  })

  return (
    <group ref={masterGroupRef} position={[0, 0, 0]}>
      {/* ========================================================
          1. PRIMARY POLISHED CHAMPAGNE-GOLD SCULPTURAL RIBBON
          ======================================================== */}
      <mesh ref={outerRibbonRef} geometry={goldGeo}>
        <meshPhysicalMaterial
          color="#ECC87A"
          emissive="#2A1A06"
          emissiveIntensity={0.15}
          metalness={0.96}
          roughness={0.14}
          clearcoat={1}
          clearcoatRoughness={0.1}
          reflectivity={0.95}
        />
      </mesh>

      {/* ========================================================
          2. SECONDARY SMOKED GLASS INTERTWINED LOOP (Violet Undertone)
          ======================================================== */}
      <mesh ref={glassRibbonRef} geometry={glassGeo}>
        <meshPhysicalMaterial
          color="#1F1A2C"
          emissive="#120A24"
          emissiveIntensity={0.2}
          transmission={0.88}
          roughness={0.06}
          thickness={0.6}
          ior={1.54}
          transparent
          opacity={0.88}
          clearcoat={1}
          clearcoatRoughness={0.08}
        />
      </mesh>

      {/* ========================================================
          3. PRECISION MACHINED GYROSCOPIC CORE RINGS
          ======================================================== */}
      {/* Outer Gimbal Ring (Machined Brass) */}
      <group ref={ring1Ref}>
        <mesh>
          <torusGeometry args={[0.72, 0.015, 16, 64]} />
          <meshPhysicalMaterial
            color="#D4B276"
            metalness={0.94}
            roughness={0.18}
            clearcoat={0.8}
          />
        </mesh>
      </group>

      {/* Middle Gimbal Ring (Dark Titanium Charcoal) */}
      <group ref={ring2Ref}>
        <mesh>
          <torusGeometry args={[0.56, 0.012, 16, 64]} />
          <meshPhysicalMaterial
            color="#282B38"
            metalness={0.88}
            roughness={0.22}
            clearcoat={0.9}
          />
        </mesh>
      </group>

      {/* Inner Gimbal Ring (Polished Champagne Gold) */}
      <group ref={ring3Ref}>
        <mesh>
          <torusGeometry args={[0.44, 0.010, 16, 64]} />
          <meshPhysicalMaterial
            color="#ECC87A"
            metalness={0.95}
            roughness={0.15}
            clearcoat={1}
          />
        </mesh>
      </group>

      {/* ========================================================
          4. CENTRAL OPTICAL CRYSTAL PRECISION CORE
          ======================================================== */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <octahedronGeometry args={[0.20, 0]} />
        <meshPhysicalMaterial
          color="#FFFDF7"
          emissive="#2A1B44"
          emissiveIntensity={0.25}
          transmission={0.95}
          roughness={0.03}
          thickness={0.75}
          ior={1.62}
          transparent
          opacity={0.92}
          clearcoat={1}
        />
      </mesh>

      {/* Internal Core Accent Light Glint */}
      <pointLight position={[0, 0, 0]} color="#ECC87A" intensity={1.8} distance={2.5} />

      {/* ========================================================
          5. SOFT CONTACT OCCLUSION SHADOW
          ======================================================== */}
      {shadowTex && (
        <mesh position={[0, -1.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.8, 2.8]} />
          <meshBasicMaterial map={shadowTex} transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Precision Sculpture Exported Canvas Wrapper
// ---------------------------------------------------------------------------
export default function PrecisionSculpture({
  scrollProgress = 0,
}: {
  scrollProgress?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const nx = (e.clientX - centerX) / (rect.width * 0.5)
      const ny = -(e.clientY - centerY) / (rect.height * 0.5)
      mousePosRef.current = {
        x: THREE.MathUtils.clamp(nx, -1.2, 1.2),
        y: THREE.MathUtils.clamp(ny, -1.2, 1.2),
      }
    }

    const handlePointerLeave = () => {
      mousePosRef.current = { x: 0, y: 0 }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[520px] sm:h-[600px] lg:h-[700px] xl:h-[740px] select-none flex items-center justify-center pointer-events-none"
    >
      {/* Atmospheric Ambient Depth Glow behind the sculpture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(201, 164, 102, 0.08) 0%, rgba(123, 66, 214, 0.04) 40%, transparent 70%)',
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 36 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.75) : 1}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {/* Luxury Studio Lighting Rig */}
        <ambientLight color="#181924" intensity={1.2} />
        <directionalLight position={[4, 5, 4]} color="#FFF8ED" intensity={2.8} />
        <directionalLight position={[-4, 2, 2]} color="#9BB0D4" intensity={1.4} />
        <directionalLight position={[0, -3, -4]} color="#ECC87A" intensity={2.2} />
        <pointLight position={[2, -2, -1]} color="#7B42D6" intensity={1.5} distance={6} />

        <PrecisionSculptureScene
          scrollProgress={scrollProgress}
          mousePos={mousePosRef.current}
        />
      </Canvas>
    </div>
  )
}
