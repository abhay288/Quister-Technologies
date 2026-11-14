import React, { Component, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Error Boundary & Architectural SVG Fallback
// ---------------------------------------------------------------------------
interface ErrorBoundaryState {
  hasError: boolean
}

class CanvasErrorBoundary extends Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

function SculptureStaticFallback({ label }: { label?: string }) {
  return (
    <div
      className="relative w-full h-full flex items-center justify-center select-none"
      aria-label={label || 'Architectural Champagne-Gold and Glass Sculpture'}
    >
      <svg
        viewBox="0 0 420 460"
        className="w-[84%] max-w-[400px] h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="qtGoldGradA" x1="60" y1="40" x2="360" y2="420" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F4DCA4" />
            <stop offset="48%" stopColor="#C9A466" />
            <stop offset="100%" stopColor="#8A6938" />
          </linearGradient>
          <linearGradient id="qtGlassGrad" x1="120" y1="60" x2="300" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#B89AE5" stopOpacity="0.32" />
            <stop offset="55%" stopColor="#7650B5" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#C9A466" stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id="qtGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C9A466" stopOpacity="0.22" />
            <stop offset="65%" stopColor="#7650B5" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#09090E" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="210" cy="230" r="190" fill="url(#qtGlow)" />
        <polygon
          points="210,48 314,142 276,348 144,348 106,142"
          fill="url(#qtGlassGrad)"
          stroke="rgba(184, 154, 229, 0.45)"
          strokeWidth="1.2"
        />
        <ellipse
          cx="210"
          cy="230"
          rx="145"
          ry="58"
          transform="rotate(-24 210 230)"
          stroke="url(#qtGoldGradA)"
          strokeWidth="3.2"
          strokeOpacity="0.9"
        />
        <path
          d="M 118 358 C 78 272, 130 165, 212 126 C 288 90, 344 152, 314 236 C 288 308, 178 320, 156 382"
          stroke="url(#qtGoldGradA)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 294 88 C 334 176, 282 282, 200 322 C 122 358, 72 292, 104 208"
          stroke="url(#qtGoldGradA)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeOpacity="0.72"
        />
        <polygon
          points="210,168 248,230 210,292 172,230"
          fill="rgba(217, 185, 120, 0.14)"
          stroke="#D9B978"
          strokeWidth="1.4"
        />
      </svg>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Custom Swept Architectural Ribbon Geometry (No center seam, smooth tapered caps)
// ---------------------------------------------------------------------------
function createSweptArchitecturalRibbon(
  curvePoints: THREE.Vector3[],
  widthBase: number,
  thicknessBase: number,
  segments = 190,
  radialSteps = 22
): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(curvePoints, false, 'catmullrom', 0.45)
  const frames = curve.computeFrenetFrames(segments, false)

  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  const ringCount = segments + 1
  const cols = radialSteps + 1

  const upAxis = new THREE.Vector3(0, 1, 0)
  const smoothNormal = new THREE.Vector3()
  const smoothBinormal = new THREE.Vector3()
  const vertexPos = new THREE.Vector3()

  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const center = curve.getPointAt(t)
    const tangent = frames.tangents[i].clone().normalize()

    // Stabilized Ribbon Orientation (prevents Frenet twist discontinuities)
    const projUp = upAxis.clone().sub(tangent.clone().multiplyScalar(upAxis.dot(tangent)))
    if (projUp.lengthSq() < 1e-4) {
      projUp.set(1, 0, 0).sub(tangent.clone().multiplyScalar(tangent.x))
    }
    smoothNormal.copy(projUp).normalize()
    smoothBinormal.crossVectors(tangent, smoothNormal).normalize()

    // Subtle organic architectural twist & smooth tapered ends
    const endTaper = Math.sin(Math.pow(t, 0.92) * Math.PI)
    const taperEnvelope = Math.pow(Math.max(0.001, endTaper), 0.48)
    const harmonicBreadth = 0.86 + 0.28 * Math.sin(t * Math.PI * 2.0 + 0.5)
    const halfWidth = widthBase * harmonicBreadth * taperEnvelope
    const halfThick = thicknessBase * (0.85 + 0.18 * Math.cos(t * Math.PI * 3.0)) * taperEnvelope

    const bankAngle = (t - 0.5) * Math.PI * 0.72 + Math.sin(t * Math.PI * 2.0) * 0.25
    const cosB = Math.cos(bankAngle)
    const sinB = Math.sin(bankAngle)

    const axisW = smoothBinormal.clone().multiplyScalar(cosB).add(smoothNormal.clone().multiplyScalar(sinB))
    const axisT = smoothNormal.clone().multiplyScalar(cosB).sub(smoothBinormal.clone().multiplyScalar(sinB))

    for (let j = 0; j <= radialSteps; j++) {
      const phi = (j / radialSteps) * Math.PI * 2
      // Superellipse cross section (n = 3.2): wide architectural ribbon with cleanly chamfered edges
      const cosP = Math.cos(phi)
      const sinP = Math.sin(phi)
      const exp = 0.64
      const sx = Math.sign(cosP) * Math.pow(Math.abs(cosP), exp) * halfWidth
      const sy = Math.sign(sinP) * Math.pow(Math.abs(sinP), exp) * halfThick

      vertexPos.copy(center).addScaledVector(axisW, sx).addScaledVector(axisT, sy)
      positions.push(vertexPos.x, vertexPos.y, vertexPos.z)
      uvs.push(t, j / radialSteps)
    }
  }

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < radialSteps; j++) {
      const a = i * cols + j
      const b = (i + 1) * cols + j
      const c = (i + 1) * cols + (j + 1)
      const d = i * cols + (j + 1)
      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  // Polished rounded terminal caps at start & end
  const startCenterIdx = positions.length / 3
  const p0 = curve.getPointAt(0)
  positions.push(p0.x, p0.y, p0.z)
  uvs.push(0, 0.5)
  for (let j = 0; j < radialSteps; j++) {
    indices.push(startCenterIdx, j + 1, j)
  }

  const endCenterIdx = positions.length / 3
  const pEnd = curve.getPointAt(1)
  positions.push(pEnd.x, pEnd.y, pEnd.z)
  uvs.push(1, 0.5)
  const lastRingStart = (ringCount - 1) * cols
  for (let j = 0; j < radialSteps; j++) {
    indices.push(endCenterIdx, lastRingStart + j, lastRingStart + j + 1)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

// ---------------------------------------------------------------------------
// Studio Reflection Environment (No external HDR URL needed)
// ---------------------------------------------------------------------------
function useStudioEnvironment() {
  const { gl, scene } = useThree()

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl)
    pmremGenerator.compileEquirectangularShader()

    const envScene = new THREE.Scene()
    envScene.background = new THREE.Color('#0B0B11')

    const panels: Array<{
      pos: [number, number, number]
      scale: [number, number, number]
      color: string
      intensity: number
    }> = [
      // Overhead soft warm ivory diffuser
      { pos: [0, 8, 2], scale: [12, 0.4, 8], color: '#FFF6E6', intensity: 3.4 },
      // Primary champagne-gold reflection card
      { pos: [7, 2.5, 5], scale: [0.4, 9, 8], color: '#F4D89C', intensity: 3.8 },
      // Architectural lavender-violet rim reflection card
      { pos: [-7, 1, -4], scale: [0.4, 10, 8], color: '#A988E6', intensity: 2.5 },
      // Cool pearl fill card front-left
      { pos: [-6, 3.5, 6], scale: [0.4, 7, 7], color: '#DDE2F2', intensity: 1.9 },
      // Subtle floor bounce
      { pos: [0, -7, 0], scale: [14, 0.4, 14], color: '#2B2219', intensity: 1.4 },
    ]

    const createdGeos: THREE.BufferGeometry[] = []
    const createdMats: THREE.Material[] = []

    for (const p of panels) {
      const geo = new THREE.BoxGeometry(1, 1, 1)
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(p.color).multiplyScalar(p.intensity),
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(...p.pos)
      mesh.scale.set(...p.scale)
      envScene.add(mesh)
      createdGeos.push(geo)
      createdMats.push(mat)
    }

    const renderTarget = pmremGenerator.fromScene(envScene, 0.04)
    const previousEnv = scene.environment
    scene.environment = renderTarget.texture

    return () => {
      scene.environment = previousEnv
      renderTarget.dispose()
      pmremGenerator.dispose()
      createdGeos.forEach((g) => g.dispose())
      createdMats.forEach((m) => m.dispose())
    }
  }, [gl, scene])
}

// ---------------------------------------------------------------------------
// Inner 3D Composition: Architectural Champagne-Gold Ribbons + Glass Prisms
// ---------------------------------------------------------------------------
function AboutHeroArtworkScene({
  mousePosRef,
  reducedMotion,
}: {
  mousePosRef: React.MutableRefObject<{ x: number; y: number }>
  reducedMotion: boolean
}) {
  useStudioEnvironment()
  const { viewport } = useThree()
  const rootGroupRef = useRef<THREE.Group>(null)
  const ribbonGroupRef = useRef<THREE.Group>(null)
  const prismGroupRef = useRef<THREE.Group>(null)
  const haloRingRef = useRef<THREE.Mesh>(null)
  const entranceProgressRef = useRef<number>(reducedMotion ? 1 : 0)

  const fitScale = useMemo(() => {
    const safeW = viewport.width * 0.84
    const safeH = viewport.height * 0.86
    const boundingSpan = 2.85
    return Math.min(safeW / boundingSpan, safeH / boundingSpan, 1.18)
  }, [viewport.width, viewport.height])

  const { primaryRibbonGeo, secondaryRibbonGeo, fineFiligreeGeo, glassSlabGeo, coreOctaGeo } = useMemo(() => {
    // Primary Hero Architectural Ribbon: Ascending helical sweep across depth planes
    const ptsPrimary: THREE.Vector3[] = []
    const steps = 42
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const angle = (t - 0.5) * Math.PI * 2.25
      const r = 0.96 - 0.16 * Math.cos(t * Math.PI * 2)
      const x = Math.cos(angle) * r
      const y = (t - 0.5) * 2.15 + Math.sin(angle * 0.8) * 0.14
      const z = Math.sin(angle) * r * 0.86
      ptsPrimary.push(new THREE.Vector3(x, y, z))
    }

    // Counter-balanced Secondary Ribbon: Graceful offsetting embrace in brushed bronze-gold
    const ptsSecondary: THREE.Vector3[] = []
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const angle = (t - 0.5) * Math.PI * 1.9 + Math.PI * 0.88
      const r = 0.82 + 0.14 * Math.sin(t * Math.PI * 2)
      const x = Math.cos(angle) * r
      const y = (0.5 - t) * 1.85 + Math.cos(angle * 0.6) * 0.12
      const z = Math.sin(angle) * r * 0.82
      ptsSecondary.push(new THREE.Vector3(x, y, z))
    }

    // Slender Precision Spine Curve: Delicate champagne structural bridge
    const ptsSpine: THREE.Vector3[] = []
    for (let i = 0; i <= 28; i++) {
      const t = i / 28
      const angle = (t - 0.5) * Math.PI * 1.45 - 0.45
      const x = Math.sin(angle) * 0.58
      const y = (t - 0.5) * 2.38
      const z = Math.cos(angle) * 0.42
      ptsSpine.push(new THREE.Vector3(x, y, z))
    }

    // Translucent Beveled Architectural Glass Slab (Extruded Hex/Chamfered Monolith)
    const slabShape = new THREE.Shape()
    const w = 0.42
    const h = 1.05
    const ch = 0.16
    slabShape.moveTo(-w + ch, -h)
    slabShape.lineTo(w - ch, -h)
    slabShape.lineTo(w, -h + ch)
    slabShape.lineTo(w, h - ch)
    slabShape.lineTo(w - ch, h)
    slabShape.lineTo(-w + ch, h)
    slabShape.lineTo(-w, h - ch)
    slabShape.lineTo(-w, -h + ch)
    slabShape.closePath()

    const slabGeo = new THREE.ExtrudeGeometry(slabShape, {
      depth: 0.06,
      bevelEnabled: true,
      bevelThickness: 0.018,
      bevelSize: 0.016,
      bevelSegments: 4,
    })
    slabGeo.center()

    const coreGeo = new THREE.OctahedronGeometry(0.24, 0)

    return {
      primaryRibbonGeo: createSweptArchitecturalRibbon(ptsPrimary, 0.115, 0.032, 128, 16),
      secondaryRibbonGeo: createSweptArchitecturalRibbon(ptsSecondary, 0.072, 0.022, 112, 14),
      fineFiligreeGeo: createSweptArchitecturalRibbon(ptsSpine, 0.028, 0.016, 96, 12),
      glassSlabGeo: slabGeo,
      coreOctaGeo: coreGeo,
    }
  }, [])

  // Clean GPU disposal on unmount
  useEffect(() => {
    return () => {
      primaryRibbonGeo.dispose()
      secondaryRibbonGeo.dispose()
      fineFiligreeGeo.dispose()
      glassSlabGeo.dispose()
      coreOctaGeo.dispose()
    }
  }, [primaryRibbonGeo, secondaryRibbonGeo, fineFiligreeGeo, glassSlabGeo, coreOctaGeo])

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime()

    if (!reducedMotion && entranceProgressRef.current < 1) {
      entranceProgressRef.current = Math.min(1, entranceProgressRef.current + delta * 0.85)
    }
    const ease = 1 - Math.pow(1 - entranceProgressRef.current, 3)

    if (rootGroupRef.current) {
      rootGroupRef.current.scale.setScalar(fitScale * (0.9 + 0.1 * ease))

      const px = reducedMotion ? 0 : mousePosRef.current.x
      const py = reducedMotion ? 0 : mousePosRef.current.y
      const targetRotY = px * 0.22 + (reducedMotion ? 0.25 : Math.sin(elapsed * 0.24) * 0.14)
      const targetRotX = -py * 0.16 + 0.08 + (1 - ease) * 0.22

      rootGroupRef.current.rotation.y = THREE.MathUtils.damp(
        rootGroupRef.current.rotation.y,
        targetRotY,
        3.6,
        delta
      )
      rootGroupRef.current.rotation.x = THREE.MathUtils.damp(
        rootGroupRef.current.rotation.x,
        targetRotX,
        3.6,
        delta
      )

      if (!reducedMotion) {
        rootGroupRef.current.position.y = Math.sin(elapsed * 0.65) * 0.04
      }
    }

    if (!reducedMotion) {
      if (ribbonGroupRef.current) {
        ribbonGroupRef.current.rotation.y = elapsed * 0.095
      }
      if (prismGroupRef.current) {
        prismGroupRef.current.rotation.y = -elapsed * 0.055
      }
      if (haloRingRef.current) {
        haloRingRef.current.rotation.z = elapsed * 0.07
      }
    }
  })

  return (
    <group ref={rootGroupRef} position={[0, 0, 0]}>
      {/* Ribbon Group: Sculpted Champagne-Gold & Antique Brass Sweeps */}
      <group ref={ribbonGroupRef}>
        <mesh geometry={primaryRibbonGeo} castShadow receiveShadow>
          <meshPhysicalMaterial
            color="#DFBE7B"
            metalness={0.94}
            roughness={0.21}
            clearcoat={0.75}
            clearcoatRoughness={0.14}
            envMapIntensity={1.35}
          />
        </mesh>

        <mesh geometry={secondaryRibbonGeo} castShadow receiveShadow>
          <meshPhysicalMaterial
            color="#B8904E"
            metalness={0.92}
            roughness={0.28}
            clearcoat={0.5}
            clearcoatRoughness={0.18}
            envMapIntensity={1.25}
          />
        </mesh>

        <mesh geometry={fineFiligreeGeo}>
          <meshPhysicalMaterial
            color="#F0D8A4"
            metalness={0.96}
            roughness={0.16}
            envMapIntensity={1.4}
          />
        </mesh>
      </group>

      {/* Architectural Translucent Smoked-Glass & Amethyst Prisms */}
      <group ref={prismGroupRef} rotation={[0.14, 0.36, -0.18]}>
        {/* Outer Smoked Optical Glass Slab */}
        <mesh geometry={glassSlabGeo} rotation={[0.05, 0.25, 0]}>
          <meshPhysicalMaterial
            color="#262038"
            emissive="#19102D"
            emissiveIntensity={0.28}
            metalness={0.14}
            roughness={0.05}
            ior={1.54}
            reflectivity={1}
            transparent
            opacity={0.44}
            depthWrite={false}
            clearcoat={1}
            clearcoatRoughness={0.04}
            envMapIntensity={1.8}
          />
        </mesh>

        {/* Cross-angled Lavender Quartz Glass Fin */}
        <mesh geometry={glassSlabGeo} scale={[0.78, 0.84, 0.88]} rotation={[-0.12, 1.38, 0.14]}>
          <meshPhysicalMaterial
            color="#402C68"
            emissive="#251646"
            emissiveIntensity={0.32}
            metalness={0.12}
            roughness={0.06}
            ior={1.56}
            reflectivity={0.96}
            transparent
            opacity={0.38}
            depthWrite={false}
            clearcoat={1}
            clearcoatRoughness={0.05}
            envMapIntensity={1.65}
          />
        </mesh>

        {/* Inner Faceted Optical Crystal Core */}
        <mesh geometry={coreOctaGeo}>
          <meshPhysicalMaterial
            color="#FFF4DF"
            emissive="#472E78"
            emissiveIntensity={0.35}
            metalness={0.22}
            roughness={0.04}
            ior={1.62}
            reflectivity={1}
            transparent
            opacity={0.76}
            clearcoat={1}
            envMapIntensity={1.9}
          />
        </mesh>
      </group>

      {/* Precision Machined Equatorial Brass Meridian */}
      <mesh ref={haloRingRef} rotation={[Math.PI * 0.36, -0.3, 0]}>
        <torusGeometry args={[1.18, 0.011, 20, 120]} />
        <meshPhysicalMaterial
          color="#C9A466"
          metalness={0.95}
          roughness={0.22}
          envMapIntensity={1.25}
        />
      </mesh>
    </group>
  )
}

export default function AboutHeroSculpture3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosRef = useRef({ x: 0, y: 0 })
  const [reducedMotion, setReducedMotion] = useState(false)
  const [webglAvailable, setWebglAvailable] = useState(true)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(media.matches)
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    media.addEventListener('change', onChange)

    // Probe WebGL availability gracefully
    try {
      const testCanvas = document.createElement('canvas')
      const gl =
        testCanvas.getContext('webgl2') ||
        testCanvas.getContext('webgl') ||
        testCanvas.getContext('experimental-webgl')
      if (!gl) setWebglAvailable(false)
    } catch {
      setWebglAvailable(false)
    }

    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const nx = ((e.clientX - (rect.left + rect.width / 2)) / (rect.width * 0.5))
      const ny = -((e.clientY - (rect.top + rect.height / 2)) / (rect.height * 0.5))
      mousePosRef.current = {
        x: THREE.MathUtils.clamp(nx, -1.1, 1.1),
        y: THREE.MathUtils.clamp(ny, -1.1, 1.1),
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
      className="relative w-full min-w-0 h-[380px] sm:h-[460px] lg:h-[580px] xl:h-[620px] select-none flex items-center justify-center"
      style={{ width: '100%' }}
      aria-label="Interactive 3D champagne-gold architectural sculpture representing engineering precision"
    >
      {/* Subtle Borderless Atmospheric Glow Behind Artwork */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 52% 48%, rgba(201, 164, 102, 0.14) 0%, rgba(118, 80, 181, 0.1) 38%, rgba(9, 9, 14, 0) 70%)',
        }}
      />

      {!webglAvailable ? (
        <SculptureStaticFallback />
      ) : (
        <CanvasErrorBoundary fallback={<SculptureStaticFallback />}>
          <div className="w-full h-full relative z-10" style={{ width: '100%', height: '100%' }}>
            <Canvas
              resize={{ scroll: false, debounce: 0 }}
              camera={{ position: [0, 0.04, 4.95], fov: 36 }}
              onCreated={() => {
                window.requestAnimationFrame(() => window.dispatchEvent(new Event('resize')))
              }}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.12,
              }}
              dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.75) : 1}
              style={{
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
            >
              {/* Soft Studio Product Lighting Rig */}
              <ambientLight color="#211F2D" intensity={0.75} />
              <directionalLight position={[4.5, 5.5, 4.5]} color="#FFF5E4" intensity={2.6} />
              <directionalLight position={[-4.2, 2.0, 2.5]} color="#C8D6F0" intensity={1.3} />
              <directionalLight position={[0.5, -3.5, -4.5]} color="#D9B978" intensity={2.1} />
              <pointLight position={[-2.4, 1.2, -2.0]} color="#9B75DE" intensity={1.8} distance={7} />

              <AboutHeroArtworkScene mousePosRef={mousePosRef} reducedMotion={reducedMotion} />
            </Canvas>
          </div>
        </CanvasErrorBoundary>
      )}
    </div>
  )
}

