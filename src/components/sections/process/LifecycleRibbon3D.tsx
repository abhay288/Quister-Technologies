import { useRef, useMemo, useEffect, useState, type MutableRefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import {
  CHECKPOINTS,
  DESKTOP_CAMERA_VIEWS,
  MOBILE_CAMERA_VIEWS,
  buildTrackCurve,
  buildSweptTrackGeometry,
  buildCenterlineTubeGeometry,
  createTrackTextures,
  createTrackEnvironment,
} from './engineeringTrackMapBuilder'

interface LifecycleTrackMap3DProps {
  activePhase: number
  scrollProgress?: number
  scrollProgressRef?: MutableRefObject<number>
  isPhasePinnedRef?: MutableRefObject<boolean>
  onPhaseSelect?: (index: number) => void
  isLooping?: boolean
  onToggleLoop?: () => void
}

// ---------------------------------------------------------------------------
// Precision Studio Environment & Balanced Architectural Lighting Rig
// ---------------------------------------------------------------------------
function TrackStudioLightingRig({
  photonLightRef,
}: {
  photonLightRef: React.RefObject<THREE.PointLight>
}) {
  const { gl, scene } = useThree()

  useEffect(() => {
    const envTexture = createTrackEnvironment(gl)
    const prevEnv = scene.environment
    scene.environment = envTexture

    return () => {
      scene.environment = prevEnv
      envTexture.dispose()
    }
  }, [gl, scene])

  return (
    <>
      <ambientLight color="#26221C" intensity={0.75} />
      {/* Overhead Key Softbox */}
      <directionalLight position={[3.5, 6.5, 4.5]} color="#FFF8EB" intensity={1.4} />
      {/* Cool Slate Fill */}
      <directionalLight position={[-4.5, 2.8, 3.5]} color="#E4E9F2" intensity={0.7} />
      {/* Warm Antique Gold Rim */}
      <directionalLight position={[0.5, -2.0, -5.0]} color="#DEB872" intensity={1.15} />
      {/* Soft Contact Floor Bounce */}
      <directionalLight position={[0, -3.8, 2.0]} color="#C29958" intensity={0.45} />
      {/* Traveling Active Photon Spotlight */}
      <pointLight ref={photonLightRef} color="#FFE6B6" intensity={2.2} distance={3.2} decay={2} />
    </>
  )
}

// ---------------------------------------------------------------------------
// 3D Spatial Journey Map Scene
// ---------------------------------------------------------------------------
function TrackMapScene({
  activePhase,
  scrollProgress = 0,
  scrollProgressRef,
  isPhasePinnedRef,
  mousePosRef,
  isMobile,
  onPhaseSelect,
  onProjectCoords,
}: {
  activePhase: number
  scrollProgress?: number
  scrollProgressRef?: MutableRefObject<number>
  isPhasePinnedRef?: MutableRefObject<boolean>
  mousePosRef: MutableRefObject<{ x: number; y: number }>
  isMobile: boolean
  onPhaseSelect?: (index: number) => void
  onProjectCoords: (coords: { x: number; y: number }[]) => void
}) {
  const { size } = useThree()
  const photonLightRef = useRef<THREE.PointLight>(null)
  const photonMeshRef = useRef<THREE.Mesh>(null)
  const activeLineMeshRef = useRef<THREE.Mesh>(null)
  const masterGroupRef = useRef<THREE.Group>(null)

  const camLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.05, 0))
  const smoothedPhaseRef = useRef<number>(0)
  const smoothedProgressURef = useRef<number>(0.1)

  // Spline & Track Geometries
  const curve = useMemo(() => buildTrackCurve(isMobile), [isMobile])

  const trackGeometries = useMemo(() => {
    // Primary Brushed Champagne Track Rail
    const baseTrack = buildSweptTrackGeometry(
      curve,
      isMobile ? 0.10 : 0.14,
      0.032,
      260
    )

    // Deep Obsidian Foundation Chassis underneath
    const foundationBed = buildSweptTrackGeometry(
      curve,
      isMobile ? 0.13 : 0.18,
      0.024,
      260
    )

    // Fine Hairline Centerline Tube
    const activeLine = buildCenterlineTubeGeometry(curve, isMobile ? 0.007 : 0.009, 260)
    const standbyLine = buildCenterlineTubeGeometry(curve, isMobile ? 0.007 : 0.009, 260)
    const floorGuideLine = buildCenterlineTubeGeometry(curve, 0.007, 140)

    // Architectural floor datum grid
    const gridHelper = new THREE.GridHelper(12, 24, 0x8a6e3e, 0x181a24)
    gridHelper.position.y = -1.82

    return {
      baseTrack,
      foundationBed,
      activeLine,
      standbyLine,
      floorGuideLine,
      gridHelper,
    }
  }, [curve, isMobile])

  const textures = useMemo(() => createTrackTextures(), [])

  // Physical Materials
  const materials = useMemo(() => {
    // 1. Primary Brushed Champagne-Gold Alloy Rail
    const baseTrackMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#C8A663'),
      map: textures.albedoMap,
      roughnessMap: textures.roughnessMap,
      metalness: 0.90,
      roughness: 0.28,
      envMapIntensity: 1.2,
    })

    // 2. Deep Obsidian Foundation Chassis Material
    const foundationBedMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#141620'),
      metalness: 0.95,
      roughness: 0.38,
      envMapIntensity: 0.8,
    })

    // 3. Active Illuminated Champagne-Gold Centerline Tube
    const activeLineMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFF8EC'),
      emissive: new THREE.Color('#ECC87A'),
      emissiveIntensity: 2.3,
      metalness: 0.65,
      roughness: 0.15,
    })

    // 4. Standby Subtle Centerline Base
    const standbyLineMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#8A6E3E'),
      emissive: new THREE.Color('#3A2C14'),
      emissiveIntensity: 0.35,
      metalness: 0.85,
      roughness: 0.35,
      transparent: true,
      opacity: 0.40,
    })

    // 5. Checkpoint Node Materials
    const plinthMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#161822'),
      metalness: 0.95,
      roughness: 0.26,
      envMapIntensity: 0.9,
    })

    const bezelMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D4B276'),
      metalness: 0.94,
      roughness: 0.20,
      envMapIntensity: 1.3,
    })

    const nodeCoreMats = CHECKPOINTS.map(
      () =>
        new THREE.MeshStandardMaterial({
          color: new THREE.Color('#14161F'),
          emissive: new THREE.Color('#20180E'),
          emissiveIntensity: 0.15,
          metalness: 0.90,
          roughness: 0.22,
        })
    )

    return {
      baseTrackMat,
      foundationBedMat,
      activeLineMat,
      standbyLineMat,
      plinthMat,
      bezelMat,
      nodeCoreMats,
    }
  }, [textures])

  // Soft Contact Shadow Texture under the installation
  const shadowTex = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    const grad = ctx.createRadialGradient(256, 128, 10, 256, 128, 240)
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.72)')
    grad.addColorStop(0.35, 'rgba(12, 10, 8, 0.38)')
    grad.addColorStop(0.70, 'rgba(12, 10, 8, 0.08)')
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 512, 256)
    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [])

  // Cleanup WebGL resources on unmount
  useEffect(() => {
    return () => {
      textures.dispose()
      if (shadowTex) shadowTex.dispose()
      trackGeometries.baseTrack.dispose()
      trackGeometries.foundationBed.dispose()
      trackGeometries.activeLine.dispose()
      trackGeometries.standbyLine.dispose()
      trackGeometries.floorGuideLine.dispose()
      materials.baseTrackMat.dispose()
      materials.foundationBedMat.dispose()
      materials.activeLineMat.dispose()
      materials.standbyLineMat.dispose()
      materials.plinthMat.dispose()
      materials.bezelMat.dispose()
      materials.nodeCoreMats.forEach((m) => m.dispose())
    }
  }, [textures, shadowTex, trackGeometries, materials])

  // Normalized U milestones for the 6 checkpoints along the curve (0.0 to 1.0)
  const checkpointU = useMemo(() => [0.08, 0.26, 0.44, 0.62, 0.80, 0.94], [])

  // Animation Loop: Route progress, traveling photon, and camera transitions
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const time = state.clock.getElapsedTime()

    // Determine target phase and progress along route
    const rawScroll = THREE.MathUtils.clamp(
      scrollProgressRef ? scrollProgressRef.current : scrollProgress,
      0,
      1
    )
    const targetPhaseF = isPhasePinnedRef?.current ? activePhase : rawScroll * 5.0

    // When looping from phase 5 back to phase 0, use a snappier damp factor for a crisp return sweep
    const isRewindLoop = activePhase === 0 && smoothedProgressURef.current > 0.55
    const phaseDamp = isRewindLoop ? 7.5 : 5.2
    const progressDamp = isRewindLoop ? 7.5 : 4.8

    smoothedPhaseRef.current = THREE.MathUtils.damp(
      smoothedPhaseRef.current,
      targetPhaseF,
      phaseDamp,
      dt
    )
    const pF = smoothedPhaseRef.current

    // Target route progress U
    const targetU = checkpointU[activePhase] ?? 0.1
    smoothedProgressURef.current = THREE.MathUtils.damp(
      smoothedProgressURef.current,
      targetU,
      progressDamp,
      dt
    )
    const currentU = THREE.MathUtils.clamp(smoothedProgressURef.current, 0.01, 1.0)

    // Update active illuminated centerline draw range
    if (activeLineMeshRef.current) {
      const geo = activeLineMeshRef.current.geometry
      const totalIndices = geo.index ? geo.index.count : 0
      if (totalIndices > 0) {
        const count = Math.floor(currentU * totalIndices)
        geo.setDrawRange(0, count)
      }
    }

    // Position traveling photon orb and gliding spotlight at leading edge of route
    const photonPos = curve.getPoint(currentU)
    if (photonMeshRef.current) {
      photonMeshRef.current.position.copy(photonPos)
      const scale = 1.0 + Math.sin(time * 6.0) * 0.12
      photonMeshRef.current.scale.setScalar(scale)
    }
    if (photonLightRef.current) {
      photonLightRef.current.position.set(photonPos.x, photonPos.y + 0.35, photonPos.z + 0.5)
    }

    // Camera viewpoint interpolation
    const camTargets = isMobile ? MOBILE_CAMERA_VIEWS : DESKTOP_CAMERA_VIEWS
    const lowerIdx = Math.floor(pF)
    const upperIdx = Math.min(camTargets.length - 1, lowerIdx + 1)
    const blend = pF - lowerIdx

    const tLower = camTargets[lowerIdx] || camTargets[0]
    const tUpper = camTargets[upperIdx] || tLower

    const mx = mousePosRef.current.x
    const my = mousePosRef.current.y

    const targetCamPos = new THREE.Vector3(
      THREE.MathUtils.lerp(tLower.pos[0], tUpper.pos[0], blend) + mx * 0.18,
      THREE.MathUtils.lerp(tLower.pos[1], tUpper.pos[1], blend) + my * 0.12,
      THREE.MathUtils.lerp(tLower.pos[2], tUpper.pos[2], blend)
    )

    const targetLookAt = new THREE.Vector3(
      THREE.MathUtils.lerp(tLower.lookAt[0], tUpper.lookAt[0], blend),
      THREE.MathUtils.lerp(tLower.lookAt[1], tUpper.lookAt[1], blend),
      THREE.MathUtils.lerp(tLower.lookAt[2], tUpper.lookAt[2], blend)
    )

    state.camera.position.lerp(targetCamPos, 0.055)
    camLookAtRef.current.lerp(targetLookAt, 0.055)
    state.camera.lookAt(camLookAtRef.current)

    // Update Checkpoint Nodes Illumination
    const pulseFactor = 0.5 + 0.5 * Math.sin(time * 3.4)
    materials.nodeCoreMats.forEach((mat, idx) => {
      const isCurrent = idx === activePhase
      const isPast = idx < activePhase

      if (isCurrent) {
        mat.color.set('#FFF8EC')
        mat.emissive.set('#ECC87A')
        mat.emissiveIntensity = THREE.MathUtils.lerp(1.8, 2.6, pulseFactor)
      } else if (isPast) {
        mat.color.set('#D4B276')
        mat.emissive.set('#5E4318')
        mat.emissiveIntensity = 0.70
      } else {
        mat.color.set('#14161F')
        mat.emissive.set('#20180E')
        mat.emissiveIntensity = 0.12
      }
    })

    // Project 3D node coordinates to 2D screen coordinates for razor-sharp HTML labels
    const projected = CHECKPOINTS.map((cp) => {
      const pos = isMobile ? cp.posMobile : cp.posDesktop
      const v = new THREE.Vector3(pos[0], pos[1], pos[2])
      v.project(state.camera)
      return {
        x: (v.x * 0.5 + 0.5) * size.width,
        y: (-v.y * 0.5 + 0.5) * size.height,
      }
    })
    onProjectCoords(projected)
  })

  return (
    <>
      <TrackStudioLightingRig photonLightRef={photonLightRef} />

      <group ref={masterGroupRef} position={[0, 0, 0]}>
        {/* 1. Deep Obsidian Foundation Bed Chassis underneath */}
        <mesh
          geometry={trackGeometries.foundationBed}
          material={materials.foundationBedMat}
          position={[0, -0.022, 0]}
        />

        {/* 2. Base Raised Champagne-Gold Metallic Track Rail */}
        <mesh geometry={trackGeometries.baseTrack} material={materials.baseTrackMat} receiveShadow />

        {/* 3. Standby Subtle Centerline Base */}
        <mesh
          geometry={trackGeometries.standbyLine}
          material={materials.standbyLineMat}
          position={[0, 0.016, 0]}
        />

        {/* 4. Dynamic Active Illuminated Centerline Tube */}
        <mesh
          ref={activeLineMeshRef}
          geometry={trackGeometries.activeLine}
          material={materials.activeLineMat}
          position={[0, 0.016, 0]}
        />

        {/* 5. Subtle Secondary Ground Guide Line on Floor Plinth */}
        <mesh
          geometry={trackGeometries.floorGuideLine}
          position={[0, -1.82, 0]}
        >
          <meshBasicMaterial color="#9A7A4A" transparent opacity={0.16} />
        </mesh>

        {/* 6. Floor Datum Coordinate Grid */}
        <primitive object={trackGeometries.gridHelper} />

        {/* 7. Traveling Photon Node at the Leading Edge */}
        <mesh ref={photonMeshRef}>
          <sphereGeometry args={[isMobile ? 0.04 : 0.048, 16, 16]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#ECC87A"
            emissiveIntensity={2.8}
            roughness={0.08}
          />
        </mesh>

        {/* 8. Six Architectural Checkpoint Nodes with Stepped Plinths */}
        {CHECKPOINTS.map((cp, idx) => {
          const coords = isMobile ? cp.posMobile : cp.posDesktop
          const isActive = activePhase === idx
          const isPast = idx < activePhase

          return (
            <group
              key={cp.number}
              position={[coords[0], coords[1], coords[2]]}
              onClick={(e) => {
                e.stopPropagation()
                if (onPhaseSelect) onPhaseSelect(idx)
              }}
              onPointerOver={(e) => {
                e.stopPropagation()
                document.body.style.cursor = 'pointer'
              }}
              onPointerOut={(e) => {
                e.stopPropagation()
                document.body.style.cursor = 'auto'
              }}
            >
              {/* Stepped Architectural Graphite Plinth Base */}
              <mesh position={[0, -0.04, 0]} material={materials.plinthMat} castShadow>
                <cylinderGeometry args={[0.22, 0.25, 0.04, 32]} />
              </mesh>

              {/* Machined Champagne-Gold Bevelled Collar */}
              <mesh position={[0, -0.01, 0]} material={materials.bezelMat}>
                <cylinderGeometry args={[0.18, 0.20, 0.025, 32]} />
              </mesh>

              {/* Precision Optical Core Disc */}
              <mesh
                position={[0, 0.01, 0]}
                material={materials.nodeCoreMats[idx]}
                scale={isActive ? 1.08 : 1.0}
              >
                <cylinderGeometry args={[0.15, 0.15, 0.015, 32]} />
              </mesh>

              {/* Inlaid Concentric Glow Ring on Top Surface */}
              <mesh position={[0, 0.018, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.07, 0.11, 32]} />
                <meshBasicMaterial
                  color={isActive ? '#FFE8B0' : isPast ? '#C8A663' : '#3B4050'}
                  transparent
                  opacity={isActive ? 0.95 : isPast ? 0.70 : 0.25}
                />
              </mesh>

              {/* Active Radiant Outer Halo (Only visible when node is active) */}
              {isActive && (
                <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.22, 0.28, 32]} />
                  <meshBasicMaterial
                    color="#ECC87A"
                    transparent
                    opacity={0.50}
                    depthWrite={false}
                  />
                </mesh>
              )}

              {/* Vertical Datum Hairline connecting node down to floor grid */}
              <line>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([0, -0.06, 0, 0, -1.82 - coords[1], 0])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial
                  color={isActive ? '#ECC87A' : '#8A6E3E'}
                  transparent
                  opacity={isActive ? 0.55 : 0.18}
                />
              </line>

              {/* Floor Plane Datum Anchor Ring */}
              <mesh position={[0, -1.82 - coords[1], 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.08, 0.11, 32]} />
                <meshBasicMaterial
                  color={isActive ? '#ECC87A' : '#6A5634'}
                  transparent
                  opacity={isActive ? 0.65 : 0.20}
                  depthWrite={false}
                />
              </mesh>
            </group>
          )
        })}

        {/* 9. Soft Studio Contact Shadow Plane */}
        {shadowTex && (
          <mesh position={[0, -1.83, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10.5, 3.6]} />
            <meshBasicMaterial map={shadowTex} transparent opacity={0.65} depthWrite={false} />
          </mesh>
        )}
      </group>
    </>
  )
}

// ---------------------------------------------------------------------------
// Master 3D Engineering Journey Map Container & Projected HTML Labels
// ---------------------------------------------------------------------------
export default function LifecycleRibbon3D({
  activePhase,
  scrollProgress = 0,
  scrollProgressRef,
  isPhasePinnedRef,
  onPhaseSelect,
  isLooping = true,
  onToggleLoop,
}: LifecycleTrackMap3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const [projectedCoords, setProjectedCoords] = useState<{ x: number; y: number }[]>([])
  const [isMobile, setIsMobile] = useState<boolean>(false)

  // Track responsive screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Mouse Parallax listener
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

  const currentCP = CHECKPOINTS[activePhase] || CHECKPOINTS[0]

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
      {/* Subtle Atmospheric Studio Amber Glow behind track map */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(201, 164, 102, 0.07) 0%, rgba(123, 66, 214, 0.02) 45%, transparent 70%)',
        }}
      />

      {/* Refined Presentation Panel Header */}
      <div className="absolute top-5 left-6 right-6 z-10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono tracking-widest uppercase pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="flex items-center gap-2.5" style={{ color: '#ECC87A' }}>
            <span className="w-2 h-2 rounded-full bg-[#ECC87A] animate-pulse" />
            <span className="font-semibold tracking-[0.2em]">THE ENGINEERING JOURNEY</span>
          </div>

          {onToggleLoop && (
            <button
              type="button"
              onClick={onToggleLoop}
              aria-label={isLooping ? 'Pause continuous loop' : 'Play continuous loop'}
              className="group flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: isLooping ? 'rgba(236, 200, 122, 0.14)' : 'rgba(255, 255, 255, 0.06)',
                border: isLooping ? '1px solid rgba(236, 200, 122, 0.45)' : '1px solid rgba(255, 255, 255, 0.16)',
                color: isLooping ? '#ECC87A' : 'rgba(243, 239, 232, 0.65)',
                boxShadow: isLooping ? '0 0 12px rgba(236, 200, 122, 0.16)' : 'none',
              }}
            >
              {isLooping ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ECC87A] animate-pulse" />
                  <span>LOOPING</span>
                  <span className="text-[9px] opacity-70">⏸</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-500" />
                  <span>PAUSED</span>
                  <span className="text-[#ECC87A] text-[9px]">▶</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="text-[11px] text-stone-300 font-mono tracking-[0.16em]">
          PHASE {currentCP.number} / 06 — {currentCP.subtitle.toUpperCase()}
        </div>
      </div>

      {/* Bottom Route Progression Indicator */}
      <div className="absolute bottom-4 left-6 right-6 z-10 flex items-center justify-between pointer-events-none text-[10px] font-mono tracking-[0.18em] text-stone-400">
        <span className="hidden sm:inline opacity-70">
          {isLooping
            ? 'ARCHITECTURAL ROUTE MAP // CONTINUOUS LOOP ACTIVE • CLICK MILESTONES TO INSPECT'
            : 'ARCHITECTURAL ROUTE MAP // CLICK MILESTONES OR SCROLL TO NAVIGATE'}
        </span>
        <div className="flex items-center gap-1.5 ml-auto">
          {CHECKPOINTS.map((cp, idx) => (
            <button
              key={cp.number}
              type="button"
              aria-label={`Select phase ${cp.number}`}
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
        camera={{ position: [0, 1.45, 5.5], fov: 34 }}
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
        <TrackMapScene
          activePhase={activePhase}
          scrollProgress={scrollProgress}
          scrollProgressRef={scrollProgressRef}
          isPhasePinnedRef={isPhasePinnedRef}
          mousePosRef={mousePosRef}
          isMobile={isMobile}
          onPhaseSelect={onPhaseSelect}
          onProjectCoords={setProjectedCoords}
        />
      </Canvas>

      {/* =====================================================================
          PROJECTED 2D/3D CHECKPOINT LABELS
          - Positioned beside/above/below corresponding nodes using projected coordinates
          - Alternating placement guarantees ZERO overlapping or collisions
          - Clamped safely within container margins so labels never clip outer boundaries
          ===================================================================== */}
      {projectedCoords.length === CHECKPOINTS.length &&
        CHECKPOINTS.map((cp, idx) => {
          const coord = projectedCoords[idx]
          if (!coord || coord.x < -100 || coord.x > 3000) return null

          const isActive = activePhase === idx
          const isCompleted = idx < activePhase
          const isBelow = cp.labelPlacement === 'below'

          // Measured container boundaries
          const containerW = containerRef.current?.clientWidth || 1000
          const containerH = containerRef.current?.clientHeight || 560

          // Vertical & horizontal offsets
          const offsetY = isMobile ? -14 : isBelow ? 50 : -60
          const offsetX = isMobile ? 34 : 0

          // Boundary clamping prevents clipping or boundary collision
          const rawX = coord.x + offsetX
          const rawY = coord.y + offsetY
          const minX = isMobile ? 16 : 95
          const maxX = containerW - (isMobile ? 165 : 95)
          const minY = isMobile ? 65 : 58
          const maxY = containerH - (isMobile ? 45 : 55)

          const safeX = THREE.MathUtils.clamp(rawX, minX, maxX)
          const safeY = THREE.MathUtils.clamp(rawY, minY, maxY)

          return (
            <button
              key={`label-${cp.number}`}
              type="button"
              onClick={() => onPhaseSelect && onPhaseSelect(idx)}
              className="absolute z-20 group flex flex-col transition-all duration-300 outline-none cursor-pointer text-left"
              style={{
                left: `${safeX}px`,
                top: `${safeY}px`,
                transform: isMobile ? 'none' : 'translateX(-50%)',
                padding: '5px 10px',
                borderRadius: '8px',
                backgroundColor: isActive
                  ? 'rgba(18, 20, 28, 0.94)'
                  : 'rgba(12, 14, 20, 0.70)',
                border: isActive
                  ? '1px solid #ECC87A'
                  : '1px solid rgba(201, 164, 102, 0.30)',
                backdropFilter: 'blur(8px)',
                boxShadow: isActive
                  ? '0 8px 24px -4px rgba(236, 200, 122, 0.35), 0 0 12px rgba(236, 200, 122, 0.20)'
                  : '0 4px 12px rgba(0, 0, 0, 0.40)',
                maxWidth: isMobile ? '160px' : '185px',
              }}
            >
              <div className="flex items-center gap-1.5 leading-none mb-1">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300"
                  style={{
                    backgroundColor: isActive
                      ? '#ECC87A'
                      : isCompleted
                      ? '#D4B276'
                      : 'rgba(255, 255, 255, 0.35)',
                    boxShadow: isActive ? '0 0 8px #ECC87A' : 'none',
                  }}
                />
                <span
                  className="font-mono text-[10px] tracking-[0.18em] font-bold"
                  style={{
                    color: isActive ? '#ECC87A' : isCompleted ? '#D4B276' : 'rgba(243, 239, 232, 0.65)',
                  }}
                >
                  {cp.number}
                </span>
              </div>
              <span
                className="font-sans text-[11px] sm:text-[11.5px] font-semibold tracking-[0.06em] whitespace-nowrap transition-colors duration-300"
                style={{
                  color: isActive ? '#FFF6E1' : isCompleted ? '#E8D5B8' : 'rgba(243, 239, 232, 0.85)',
                }}
              >
                {cp.title}
              </span>
            </button>
          )
        })}
    </div>
  )
}
