import { useRef, useMemo, useEffect, useState, type MutableRefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import {
  ARCHITECTURAL_FORMS,
  PRECISION_CAMERA_TARGETS,
  FormSplineCurve,
  buildMonolithicChassisGeometry,
  buildRecessedInlayGeometry,
  buildInterlockingCollarGeometry,
  createLuxuryStudioTextures,
  createStudioGalleryEnvironment,
} from './precisionSculptureBuilder'

interface LifecycleRibbon3DProps {
  activePhase: number
  scrollProgress?: number
  scrollProgressRef?: MutableRefObject<number>
  isPhasePinnedRef?: MutableRefObject<boolean>
  onPhaseSelect?: (index: number) => void
}

const COLOR_ACTIVE_INLAY = new THREE.Color('#FFF6E1')
const COLOR_ACTIVE_EMISSIVE = new THREE.Color('#F5DC9F')
const COLOR_DONE_INLAY = new THREE.Color('#D4B276')
const COLOR_DONE_EMISSIVE = new THREE.Color('#5E4318')
const COLOR_IDLE_INLAY = new THREE.Color('#B58F50')
const COLOR_IDLE_EMISSIVE = new THREE.Color('#2A1E0E')

// ---------------------------------------------------------------------------
// Luxury Studio Environment & Controlled Product Lighting Rig
// ---------------------------------------------------------------------------
function PrecisionStudioLightingRig({
  glidingLightRef,
}: {
  glidingLightRef: React.RefObject<THREE.PointLight>
}) {
  const { gl, scene } = useThree()

  useEffect(() => {
    const envTexture = createStudioGalleryEnvironment(gl)
    const prevEnv = scene.environment
    scene.environment = envTexture

    return () => {
      scene.environment = prevEnv
      envTexture.dispose()
    }
  }, [gl, scene])

  return (
    <>
      <ambientLight color="#2E2419" intensity={0.65} />
      {/* Primary Warm Champagne Key Light */}
      <directionalLight position={[5.2, 6.8, 5.0]} color="#FFF7EC" intensity={1.35} />
      {/* Cool Slate Studio Fill */}
      <directionalLight position={[-5.6, 2.4, 4.0]} color="#E4E8F0" intensity={0.75} />
      {/* Warm Antique Gold Rim Light */}
      <directionalLight position={[1.5, -2.2, -5.8]} color="#DFB872" intensity={1.05} />
      {/* Floor Bronze Bounce */}
      <directionalLight position={[0, -4.8, 2.6]} color="#C29958" intensity={0.45} />
      {/* Dynamic Gliding Active Element Spotlight */}
      <pointLight ref={glidingLightRef} color="#F5DC9F" intensity={1.2} distance={3.5} decay={2} />
    </>
  )
}

// ---------------------------------------------------------------------------
// Precision Architectural Monument 3D Scene
// ---------------------------------------------------------------------------
function PrecisionArchitectureScene({
  activePhase,
  scrollProgress = 0,
  scrollProgressRef,
  isPhasePinnedRef,
  mousePosRef,
  onPhaseSelect,
}: {
  activePhase: number
  scrollProgress?: number
  scrollProgressRef?: MutableRefObject<number>
  isPhasePinnedRef?: MutableRefObject<boolean>
  mousePosRef: MutableRefObject<{ x: number; y: number }>
  onPhaseSelect?: (index: number) => void
}) {
  const { size } = useThree()
  const fitGroupRef = useRef<THREE.Group>(null)
  const masterGroupRef = useRef<THREE.Group>(null)
  const glidingLightRef = useRef<THREE.PointLight>(null)

  const camLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0))
  const smoothedPhaseRef = useRef<number>(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Compute responsive container fit so perspective adjusts naturally
  const responsiveFitScale = useMemo(() => {
    const aspect = size.width / Math.max(1, size.height)
    const refViewH = 2 * 5.4 * Math.tan(THREE.MathUtils.degToRad(34 * 0.5))
    const refViewW = refViewH * aspect
    const sculptureSpanW = 6.2
    const sculptureSpanH = 3.0
    const occupancyW = aspect < 1.2 ? 0.84 : 0.74
    const occupancyH = 0.72
    const fitW = (refViewW * occupancyW) / sculptureSpanW
    const fitH = (refViewH * occupancyH) / sculptureSpanH
    return Math.min(1.05, fitW, fitH)
  }, [size.width, size.height])

  const textures = useMemo(() => createLuxuryStudioTextures(), [])

  // Generate 6 Monolithic Forms, Inlays, and Interlocking Mechanical Collars
  const assembly = useMemo(() => {
    const splines: FormSplineCurve[] = []
    const chassisGeometries: THREE.BufferGeometry[] = []
    const inlayGeometries: THREE.BufferGeometry[] = []
    const collarGeometries: THREE.BufferGeometry[] = []
    const centerPoints: THREE.Vector3[] = []

    ARCHITECTURAL_FORMS.forEach((form) => {
      const curve = new FormSplineCurve(form.controlPoints)
      splines.push(curve)
      chassisGeometries.push(
        buildMonolithicChassisGeometry(curve, form.width, form.thickness, form.chamfer, 64)
      )
      inlayGeometries.push(
        buildRecessedInlayGeometry(curve, form.width, form.thickness, 48)
      )
      centerPoints.push(curve.getPoint(0.5))
    })

    // 5 Interlocking Smoked Titanium Collars bridging consecutive stages
    for (let i = 0; i < ARCHITECTURAL_FORMS.length - 1; i++) {
      const pEnd = splines[i].getPoint(0.96)
      const pStartNext = splines[i + 1].getPoint(0.04)
      const midPos = new THREE.Vector3().addVectors(pEnd, pStartNext).multiplyScalar(0.5)
      const tangent = splines[i].getTangent(1.0)
      collarGeometries.push(
        buildInterlockingCollarGeometry(midPos, tangent, 0.28, 0.22, 32)
      )
    }

    return {
      splines,
      chassisGeometries,
      inlayGeometries,
      collarGeometries,
      centerPoints,
    }
  }, [])

  // Physical Materials for Chassis, Inlays, and Interlocking Sleeves
  const materials = useMemo(() => {
    // 1. Primary Satin Champagne Gold Monolithic Body
    const chassisMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#D8C49D'),
      map: textures.albedoMap,
      roughnessMap: textures.roughnessMap,
      bumpMap: textures.bumpMap,
      bumpScale: 0.0006,
      metalness: 0.92,
      roughness: 0.22,
      clearcoat: 0.25,
      clearcoatRoughness: 0.16,
      envMapIntensity: 1.25,
    })

    // 2. Six Recessed Optical Chronometer Channels (one per form)
    const inlayMaterials = ARCHITECTURAL_FORMS.map(
      () =>
        new THREE.MeshStandardMaterial({
          color: COLOR_IDLE_INLAY.clone(),
          emissive: COLOR_IDLE_EMISSIVE.clone(),
          emissiveIntensity: 0.15,
          metalness: 0.88,
          roughness: 0.32,
          envMapIntensity: 1.2,
        })
    )

    // 3. Dark Smoked Titanium Interlocking Connector Sleeves
    const collarMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#222329'),
      metalness: 0.95,
      roughness: 0.28,
      envMapIntensity: 0.95,
    })

    return {
      chassisMaterial,
      inlayMaterials,
      collarMaterial,
    }
  }, [textures])

  // Soft Contact Shadow Texture
  const shadowTex = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 124)
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.68)')
    grad.addColorStop(0.38, 'rgba(12, 10, 8, 0.34)')
    grad.addColorStop(0.75, 'rgba(12, 10, 8, 0.08)')
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 256, 256)
    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [])

  // Cleanup WebGL resources on unmount
  useEffect(() => {
    return () => {
      textures.dispose()
      if (shadowTex) shadowTex.dispose()
      assembly.chassisGeometries.forEach((g) => g.dispose())
      assembly.inlayGeometries.forEach((g) => g.dispose())
      assembly.collarGeometries.forEach((g) => g.dispose())
      materials.chassisMaterial.dispose()
      materials.collarMaterial.dispose()
      materials.inlayMaterials.forEach((m) => m.dispose())
    }
  }, [textures, shadowTex, assembly, materials])

  // Animation Loop: Camera choreography, optical glow pulsing, and cursor parallax
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const time = state.clock.getElapsedTime()

    if (fitGroupRef.current) {
      fitGroupRef.current.scale.setScalar(responsiveFitScale)
    }

    // Determine target phase index (continuous fractional 0..5)
    const rawScroll = THREE.MathUtils.clamp(
      scrollProgressRef ? scrollProgressRef.current : scrollProgress,
      0,
      1
    )
    const scrollPhaseF = rawScroll * 5.0
    const targetPhaseF = isPhasePinnedRef?.current ? activePhase : scrollPhaseF

    smoothedPhaseRef.current = THREE.MathUtils.damp(
      smoothedPhaseRef.current,
      targetPhaseF,
      5.2,
      dt
    )
    const pF = smoothedPhaseRef.current

    // Camera viewpoint interpolation across 6 gallery targets
    const lowerIdx = Math.floor(pF)
    const upperIdx = Math.min(PRECISION_CAMERA_TARGETS.length - 1, lowerIdx + 1)
    const blend = pF - lowerIdx

    const tLower = PRECISION_CAMERA_TARGETS[lowerIdx] || PRECISION_CAMERA_TARGETS[0]
    const tUpper = PRECISION_CAMERA_TARGETS[upperIdx] || tLower

    const targetCamPos = new THREE.Vector3(
      THREE.MathUtils.lerp(tLower.pos[0], tUpper.pos[0], blend),
      THREE.MathUtils.lerp(tLower.pos[1], tUpper.pos[1], blend),
      THREE.MathUtils.lerp(tLower.pos[2], tUpper.pos[2], blend)
    )

    const targetLookAt = new THREE.Vector3(
      THREE.MathUtils.lerp(tLower.lookAt[0], tUpper.lookAt[0], blend),
      THREE.MathUtils.lerp(tLower.lookAt[1], tUpper.lookAt[1], blend),
      THREE.MathUtils.lerp(tLower.lookAt[2], tUpper.lookAt[2], blend)
    )

    // Subtle cursor parallax
    const mx = mousePosRef.current.x
    const my = mousePosRef.current.y
    targetCamPos.x += mx * 0.32
    targetCamPos.y += my * 0.22

    state.camera.position.lerp(targetCamPos, 0.06)
    camLookAtRef.current.lerp(targetLookAt, 0.06)
    state.camera.lookAt(camLookAtRef.current)

    // Gentle sculpture idle breath rotation
    if (masterGroupRef.current) {
      const targetYaw = THREE.MathUtils.lerp(tLower.sculptureYaw, tUpper.sculptureYaw, blend)
      const targetPitch = THREE.MathUtils.lerp(tLower.sculpturePitch, tUpper.sculpturePitch, blend)
      const idleYaw = Math.sin(time * 0.35) * 0.02
      const idlePitch = Math.cos(time * 0.28) * 0.015

      masterGroupRef.current.rotation.y = THREE.MathUtils.damp(
        masterGroupRef.current.rotation.y,
        targetYaw + idleYaw + mx * 0.04,
        4.0,
        dt
      )
      masterGroupRef.current.rotation.x = THREE.MathUtils.damp(
        masterGroupRef.current.rotation.x,
        targetPitch + idlePitch - my * 0.03,
        4.0,
        dt
      )
    }

    // Dynamic Gliding Spotlight tracks the active form's center
    if (glidingLightRef.current && assembly.centerPoints[activePhase]) {
      const activeCenter = assembly.centerPoints[activePhase]
      const lightDest = new THREE.Vector3(
        activeCenter.x,
        activeCenter.y + 0.65,
        activeCenter.z + 1.25
      )
      glidingLightRef.current.position.lerp(lightDest, 0.08)
    }

    // Update Optical Inlays Luminescence & Sine Pulse
    const pulseFactor = 0.5 + 0.5 * Math.sin(time * 3.2)
    materials.inlayMaterials.forEach((mat, idx) => {
      const isCurrent = idx === activePhase
      const isPast = idx < activePhase

      if (isCurrent) {
        mat.color.lerp(COLOR_ACTIVE_INLAY, 0.12)
        mat.emissive.lerp(COLOR_ACTIVE_EMISSIVE, 0.12)
        mat.emissiveIntensity = THREE.MathUtils.lerp(1.4, 2.2, pulseFactor)
      } else if (isPast) {
        mat.color.lerp(COLOR_DONE_INLAY, 0.12)
        mat.emissive.lerp(COLOR_DONE_EMISSIVE, 0.12)
        mat.emissiveIntensity = 0.35
      } else {
        mat.color.lerp(COLOR_IDLE_INLAY, 0.12)
        mat.emissive.lerp(COLOR_IDLE_EMISSIVE, 0.12)
        mat.emissiveIntensity = 0.12
      }
    })
  })

  return (
    <>
      <PrecisionStudioLightingRig glidingLightRef={glidingLightRef} />

      <group ref={fitGroupRef} position={[0, 0, 0]}>
        <group ref={masterGroupRef}>
          {/* 1. Six Precision Monolithic Forms with Recessed Chronometer Inlays */}
          {ARCHITECTURAL_FORMS.map((form, idx) => {
            const isHovered = hoveredIndex === idx
            const isActive = activePhase === idx

            return (
              <group
                key={form.number}
                onPointerOver={(e) => {
                  e.stopPropagation()
                  setHoveredIndex(idx)
                  document.body.style.cursor = 'pointer'
                }}
                onPointerOut={(e) => {
                  e.stopPropagation()
                  setHoveredIndex((curr) => (curr === idx ? null : curr))
                  document.body.style.cursor = 'auto'
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  if (onPhaseSelect) onPhaseSelect(idx)
                }}
              >
                {/* Main Machined Solid Chassis */}
                <mesh
                  geometry={assembly.chassisGeometries[idx]}
                  material={materials.chassisMaterial}
                  castShadow
                  receiveShadow
                  scale={isHovered ? 1.015 : 1.0}
                />

                {/* Recessed Antique Brass Chronometer Optical Inlay Channel */}
                <mesh
                  geometry={assembly.inlayGeometries[idx]}
                  material={materials.inlayMaterials[idx]}
                  scale={isActive ? 1.008 : 1.0}
                />
              </group>
            )
          })}

          {/* 2. Five Dark Smoked Titanium Interlocking Connector Collars */}
          {assembly.collarGeometries.map((geo, idx) => (
            <mesh
              key={`collar-${idx}`}
              geometry={geo}
              material={materials.collarMaterial}
              castShadow
            />
          ))}

          {/* 3. Soft Studio Gallery Contact Shadow Plane */}
          {shadowTex && (
            <mesh position={[0, -1.65, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[6.4, 3.2]} />
              <meshBasicMaterial
                map={shadowTex}
                transparent
                opacity={0.58}
                depthWrite={false}
              />
            </mesh>
          )}
        </group>
      </group>
    </>
  )
}

// ---------------------------------------------------------------------------
// Master Lifecycle 3D Gallery Stage Container
// ---------------------------------------------------------------------------
export default function LifecycleRibbon3D({
  activePhase,
  scrollProgress = 0,
  scrollProgressRef,
  isPhasePinnedRef,
  onPhaseSelect,
}: LifecycleRibbon3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      const rect = el.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1
      const ny = -(((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1)
      mousePosRef.current.x = THREE.MathUtils.clamp(nx, -1, 1)
      mousePosRef.current.y = THREE.MathUtils.clamp(ny, -1, 1)
    }

    const handlePointerLeave = () => {
      mousePosRef.current.x = 0
      mousePosRef.current.y = 0
      document.body.style.cursor = 'auto'
    }

    el.addEventListener('pointermove', handlePointerMove, { passive: true })
    el.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      el.removeEventListener('pointermove', handlePointerMove)
      el.removeEventListener('pointerleave', handlePointerLeave)
      document.body.style.cursor = 'auto'
    }
  }, [])

  const currentForm = ARCHITECTURAL_FORMS[activePhase] || ARCHITECTURAL_FORMS[0]

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[460px] sm:h-[520px] lg:h-[580px] my-10 sm:my-14 overflow-hidden rounded-2xl select-none"
      style={{
        background:
          'radial-gradient(ellipse 75% 65% at 50% 50%, #151722 0%, #0A0B0E 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow:
          '0 28px 60px -22px rgba(0, 0, 0, 0.65), inset 0 0 50px rgba(201, 164, 102, 0.04)',
      }}
    >
      {/* Subtle Atmospheric Studio Amber Glow behind sculpture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(201, 164, 102, 0.08) 0%, rgba(123, 66, 214, 0.025) 45%, transparent 70%)',
        }}
      />

      {/* Refined Editorial Header */}
      <div className="absolute top-5 left-6 right-6 z-10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono tracking-widest uppercase pointer-events-none">
        <div className="flex items-center gap-2.5" style={{ color: '#ECC87A' }}>
          <span className="w-2 h-2 rounded-full bg-[#ECC87A] animate-pulse" />
          <span className="font-semibold tracking-[0.2em]">THE PRECISION ARCHITECTURE</span>
        </div>
        <div className="text-[11px] text-stone-300 font-mono tracking-[0.16em]">
          PHASE // {currentForm.number} OF 06 ACTIVE — {currentForm.name.toUpperCase()}
        </div>
      </div>

      {/* Bottom Subtle Navigation Indicator */}
      <div className="absolute bottom-4 left-6 right-6 z-10 flex items-center justify-between pointer-events-none text-[10px] font-mono tracking-[0.18em] text-stone-400">
        <span className="hidden sm:inline opacity-70">
          INTERACTIVE ARCHITECTURE // HOVER OR CLICK FORMS TO INSPECT
        </span>
        <div className="flex items-center gap-1.5 ml-auto">
          {ARCHITECTURAL_FORMS.map((f, idx) => (
            <button
              key={f.number}
              type="button"
              aria-label={`Select phase ${f.number}`}
              onClick={() => onPhaseSelect && onPhaseSelect(idx)}
              className="pointer-events-auto transition-all duration-300 rounded-full"
              style={{
                width: idx === activePhase ? '18px' : '6px',
                height: '6px',
                backgroundColor: idx === activePhase ? '#ECC87A' : 'rgba(255, 255, 255, 0.25)',
              }}
            />
          ))}
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [-2.1, -0.42, 5.6], fov: 34 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.75) : 1}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <PrecisionArchitectureScene
          activePhase={activePhase}
          scrollProgress={scrollProgress}
          scrollProgressRef={scrollProgressRef}
          isPhasePinnedRef={isPhasePinnedRef}
          mousePosRef={mousePosRef}
          onPhaseSelect={onPhaseSelect}
        />
      </Canvas>
    </div>
  )
}
