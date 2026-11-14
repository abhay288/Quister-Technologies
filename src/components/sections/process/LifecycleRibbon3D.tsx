import { useRef, useMemo, useEffect, type MutableRefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import {
  MILESTONE_CURVE_PARAMS,
  PHASE_CAMERA_TARGETS,
  buildSculptureSpineData,
  buildContinuousSculptureGeometry,
  buildSubtleMilestoneInlayGeometry,
  createBrushedGoldTextureSet,
  createLuxuryGalleryEnvironment,
  attachProgressionShader,
  type ProgressionUniforms,
} from './engineeringSculptureBuilder'

interface LifecycleRibbon3DProps {
  activePhase: number
  scrollProgress?: number
  scrollProgressRef?: MutableRefObject<number>
  isPhasePinnedRef?: MutableRefObject<boolean>
  onPhaseSelect?: (index: number) => void
}

const COLOR_ACTIVE_EMISSIVE = new THREE.Color('#F3D792')
const COLOR_DONE_EMISSIVE = new THREE.Color('#B58F50')
const COLOR_IDLE_EMISSIVE = new THREE.Color('#544022')
const COLOR_ACTIVE_ALBEDO = new THREE.Color('#FFF6E1')
const COLOR_DONE_ALBEDO = new THREE.Color('#E6CC98')
const COLOR_IDLE_ALBEDO = new THREE.Color('#BE9E67')

// ---------------------------------------------------------------------------
// Luxury Studio Environment & Controlled Three-Point Product Lighting Rig
// ---------------------------------------------------------------------------
function LuxuryStudioLightingRig({
  glidingLightRef,
}: {
  glidingLightRef: React.RefObject<THREE.PointLight>
}) {
  const { gl, scene } = useThree()

  useEffect(() => {
    const envTexture = createLuxuryGalleryEnvironment(gl)
    const prevEnv = scene.environment
    scene.environment = envTexture

    return () => {
      scene.environment = prevEnv
      envTexture.dispose()
    }
  }, [gl, scene])

  return (
    <>
      <ambientLight color="#3D3122" intensity={0.72} />
      {/* Large Warm Champagne Overhead Key Light */}
      <directionalLight position={[4.8, 6.4, 4.8]} color="#FFF6E8" intensity={1.25} />
      {/* Neutral Fill Light */}
      <directionalLight position={[-5.4, 2.2, 3.8]} color="#EAE6DF" intensity={0.72} />
      {/* Warm Brass Rim Light */}
      <directionalLight position={[1.4, -2.0, -5.6]} color="#E0BA74" intensity={0.95} />
      {/* Soft Floor Warm Bronze Bounce */}
      <directionalLight position={[0, -4.5, 2.5]} color="#C29958" intensity={0.42} />
      {/* Subtle Gliding Milestone Accent Light */}
      <pointLight ref={glidingLightRef} color="#F5DC9F" intensity={0.68} distance={2.4} decay={2} />
    </>
  )
}

// ---------------------------------------------------------------------------
// Sculpted Satin Champagne-Gold Architectural Monument Scene
// ---------------------------------------------------------------------------
function ArchitecturalSculptureScene({
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
  const camLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(-0.14, -0.06, 0.04))
  const lightTargetPosRef = useRef<THREE.Vector3>(new THREE.Vector3())
  const smoothedProgressRef = useRef<number>(MILESTONE_CURVE_PARAMS[0])
  const milestoneCoreLevelsRef = useRef<number[]>([1, 0, 0, 0, 0, 0])

  const progressionUniforms = useRef<ProgressionUniforms>({
    uActiveU: { value: MILESTONE_CURVE_PARAMS[0] },
  })

  // Compute responsive container fit purely from canvas pixel aspect (independent of camera Z travel)
  // so scroll camera depth reveals genuine perspective changes without rescaling the whole sculpture.
  const responsiveFitScale = useMemo(() => {
    const aspect = size.width / Math.max(1, size.height)
    const refViewH = 2 * 5.45 * Math.tan(THREE.MathUtils.degToRad(34 * 0.5))
    const refViewW = refViewH * aspect
    const sculptureDiameterW = 6.08
    const sculptureDiameterH = 2.68
    const occupancyW = aspect < 1.25 ? 0.82 : 0.72
    const occupancyH = 0.70
    const fitW = (refViewW * occupancyW) / sculptureDiameterW
    const fitH = (refViewH * occupancyH) / sculptureDiameterH
    return Math.min(1.04, fitW, fitH)
  }, [size.width, size.height])

  const brushedTextures = useMemo(() => createBrushedGoldTextureSet(), [])

  const shadowTex = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    const grad = ctx.createRadialGradient(128, 128, 8, 128, 128, 126)
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.70)')
    grad.addColorStop(0.38, 'rgba(12, 9, 6, 0.36)')
    grad.addColorStop(0.75, 'rgba(12, 9, 6, 0.08)')
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 256, 256)
    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [])

  const sculptureParts = useMemo(() => {
    const spine = buildSculptureSpineData(360)
    const mainBodyGeo = buildContinuousSculptureGeometry(spine, 72)

    // Six ultra-refined, narrow chamfered milestone inlays integrated flush into the spine
    const milestoneAssemblies = MILESTONE_CURVE_PARAMS.map((u) => ({
      u,
      rimBevel: buildSubtleMilestoneInlayGeometry(spine, u, 0.0048, 0.009, 72, 14),
      opticalInlay: buildSubtleMilestoneInlayGeometry(spine, u, 0.0020, 0.013, 72, 10),
    }))

    return {
      spine,
      mainBodyGeo,
      milestoneAssemblies,
    }
  }, [])

  const materials = useMemo(() => {
    const primaryChampagneMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#D8C39A'), // Refined satin champagne gold (not flat yellow)
      map: brushedTextures.albedoMap,
      roughnessMap: brushedTextures.roughnessMap,
      bumpMap: brushedTextures.bumpMap,
      bumpScale: 0.0005,
      metalness: 0.90,
      roughness: 0.27,
      anisotropy: 0.55,
      anisotropyRotation: 0,
      clearcoat: 0.14,
      clearcoatRoughness: 0.28,
      envMapIntensity: 1.15,
    })
    attachProgressionShader(primaryChampagneMat, progressionUniforms.current)

    // Restrained warm antique champagne-bronze bevel trim (close in metallic luxury harmony)
    const warmBronzeBevelMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#A68856'),
      roughnessMap: brushedTextures.roughnessMap,
      bumpMap: brushedTextures.bumpMap,
      bumpScale: 0.0004,
      metalness: 0.91,
      roughness: 0.25,
      anisotropy: 0.45,
      clearcoat: 0.18,
      clearcoatRoughness: 0.24,
      envMapIntensity: 1.18,
    })

    const opticalInlayMats = MILESTONE_CURVE_PARAMS.map(
      () =>
        new THREE.MeshPhysicalMaterial({
          color: COLOR_IDLE_ALBEDO.clone(),
          emissive: COLOR_IDLE_EMISSIVE.clone(),
          emissiveIntensity: 0.08,
          metalness: 0.89,
          roughness: 0.19,
          clearcoat: 0.36,
          clearcoatRoughness: 0.14,
          envMapIntensity: 1.25,
        })
    )

    return {
      primaryChampagneMat,
      warmBronzeBevelMat,
      opticalInlayMats,
    }
  }, [brushedTextures])

  useEffect(() => {
    return () => {
      brushedTextures.dispose()
      if (shadowTex) shadowTex.dispose()
      sculptureParts.mainBodyGeo.dispose()
      sculptureParts.milestoneAssemblies.forEach((m) => {
        m.rimBevel.dispose()
        m.opticalInlay.dispose()
      })
      materials.primaryChampagneMat.dispose()
      materials.warmBronzeBevelMat.dispose()
      materials.opticalInlayMats.forEach((m) => m.dispose())
    }
  }, [brushedTextures, shadowTex, sculptureParts, materials])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const time = state.clock.getElapsedTime()

    if (fitGroupRef.current) {
      fitGroupRef.current.scale.setScalar(responsiveFitScale)
    }

    const rawScroll = THREE.MathUtils.clamp(
      scrollProgressRef ? scrollProgressRef.current : scrollProgress,
      0,
      1
    )
    const pinnedU = MILESTONE_CURVE_PARAMS[activePhase] ?? MILESTONE_CURVE_PARAMS[0]
    const mappedScrollU = THREE.MathUtils.lerp(
      MILESTONE_CURVE_PARAMS[0],
      MILESTONE_CURVE_PARAMS[MILESTONE_CURVE_PARAMS.length - 1],
      rawScroll
    )
    const targetU = isPhasePinnedRef?.current ? pinnedU : mappedScrollU

    smoothedProgressRef.current = THREE.MathUtils.damp(
      smoothedProgressRef.current,
      targetU,
      5.5,
      dt
    )
    const u = smoothedProgressRef.current
    progressionUniforms.current.uActiveU.value = u

    const continuousPhaseF = THREE.MathUtils.clamp(
      isPhasePinnedRef?.current ? activePhase : rawScroll * 5,
      0,
      5
    )
    const idxA = Math.min(5, Math.floor(continuousPhaseF))
    const idxB = Math.min(5, idxA + 1)
    const blendT = continuousPhaseF - idxA
    const smoothT = blendT * blendT * (3 - 2 * blendT)
    const camA = PHASE_CAMERA_TARGETS[idxA]
    const camB = PHASE_CAMERA_TARGETS[idxB]

    const mx = mousePosRef.current.x
    const my = mousePosRef.current.y

    // Scale orbital offset gently on compact viewports so camera angle shifts without crowding margins
    const camOrbitScale = Math.min(1.0, responsiveFitScale * 1.15)
    const desiredCamX =
      THREE.MathUtils.lerp(camA.pos[0], camB.pos[0], smoothT) * camOrbitScale + mx * 0.28
    const desiredCamY =
      THREE.MathUtils.lerp(camA.pos[1], camB.pos[1], smoothT) * camOrbitScale -
      my * 0.18 +
      Math.sin(time * 0.42) * 0.022
    const desiredCamZ = THREE.MathUtils.lerp(camA.pos[2], camB.pos[2], smoothT)

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, desiredCamX, 4.6, dt)
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, desiredCamY, 4.6, dt)
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, desiredCamZ, 4.6, dt)

    const desiredLookX =
      THREE.MathUtils.lerp(camA.lookAt[0], camB.lookAt[0], smoothT) * camOrbitScale + mx * 0.09
    const desiredLookY =
      THREE.MathUtils.lerp(camA.lookAt[1], camB.lookAt[1], smoothT) * camOrbitScale - my * 0.06
    const desiredLookZ = THREE.MathUtils.lerp(camA.lookAt[2], camB.lookAt[2], smoothT)

    camLookAtRef.current.x = THREE.MathUtils.damp(camLookAtRef.current.x, desiredLookX, 5.0, dt)
    camLookAtRef.current.y = THREE.MathUtils.damp(camLookAtRef.current.y, desiredLookY, 5.0, dt)
    camLookAtRef.current.z = THREE.MathUtils.damp(camLookAtRef.current.z, desiredLookZ, 5.0, dt)
    state.camera.lookAt(camLookAtRef.current)

    if (masterGroupRef.current) {
      const targetYaw =
        THREE.MathUtils.lerp(camA.sculptureYaw, camB.sculptureYaw, smoothT) +
        mx * 0.13 +
        Math.sin(time * 0.34) * 0.018
      const targetPitch =
        THREE.MathUtils.lerp(camA.sculpturePitch, camB.sculpturePitch, smoothT) -
        my * 0.09 +
        Math.cos(time * 0.28) * 0.014

      masterGroupRef.current.rotation.y = THREE.MathUtils.damp(
        masterGroupRef.current.rotation.y,
        targetYaw,
        4.8,
        dt
      )
      masterGroupRef.current.rotation.x = THREE.MathUtils.damp(
        masterGroupRef.current.rotation.x,
        targetPitch,
        4.8,
        dt
      )
      masterGroupRef.current.position.y = Math.sin(time * 0.55) * 0.018
    }

    if (glidingLightRef.current) {
      const smp = sculptureParts.spine.sampleArcU(u)
      lightTargetPosRef.current
        .copy(smp.pos)
        .addScaledVector(smp.normal, 0.34)
        .addScaledVector(smp.binormal, 0.12)
      if (masterGroupRef.current) {
        masterGroupRef.current.updateMatrixWorld()
        masterGroupRef.current.localToWorld(lightTargetPosRef.current)
      } else {
        lightTargetPosRef.current.multiplyScalar(responsiveFitScale)
      }
      glidingLightRef.current.position.copy(lightTargetPosRef.current)
      glidingLightRef.current.intensity = 0.70 + Math.sin(time * 1.4) * 0.10
    }

    for (let i = 0; i < materials.opticalInlayMats.length; i++) {
      const mat = materials.opticalInlayMats[i]
      const targetLevel = i === activePhase ? 1.0 : i < activePhase ? 0.45 : 0.0
      milestoneCoreLevelsRef.current[i] = THREE.MathUtils.damp(
        milestoneCoreLevelsRef.current[i],
        targetLevel,
        6.5,
        dt
      )
      const lvl = milestoneCoreLevelsRef.current[i]
      if (lvl >= 0.45) {
        const k = (lvl - 0.45) / 0.55
        mat.color.lerpColors(COLOR_DONE_ALBEDO, COLOR_ACTIVE_ALBEDO, k)
        mat.emissive.lerpColors(COLOR_DONE_EMISSIVE, COLOR_ACTIVE_EMISSIVE, k)
      } else {
        const k = lvl / 0.45
        mat.color.lerpColors(COLOR_IDLE_ALBEDO, COLOR_DONE_ALBEDO, k)
        mat.emissive.lerpColors(COLOR_IDLE_EMISSIVE, COLOR_DONE_EMISSIVE, k)
      }
      mat.emissiveIntensity = 0.05 + lvl * 0.42
    }
  })

  return (
    <>
      <LuxuryStudioLightingRig glidingLightRef={glidingLightRef} />

      <group ref={fitGroupRef} scale={responsiveFitScale}>
        <group ref={masterGroupRef} position={[0, 0.02, 0]}>
          {/* 1. Primary Unbroken Brushed Champagne-Gold Architectural Sculpture */}
          <mesh
            geometry={sculptureParts.mainBodyGeo}
            material={materials.primaryChampagneMat}
          />

          {/* 2. Six Subtle Integrated Architectural Index Inlays */}
          {sculptureParts.milestoneAssemblies.map((assembly, idx) => (
            <group
              key={`milestone-${idx}`}
              onClick={(e) => {
                e.stopPropagation()
                onPhaseSelect?.(idx)
              }}
              onPointerOver={() => {
                document.body.style.cursor = 'pointer'
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'auto'
              }}
            >
              <mesh geometry={assembly.rimBevel} material={materials.warmBronzeBevelMat} />
              <mesh geometry={assembly.opticalInlay} material={materials.opticalInlayMats[idx]} />
            </group>
          ))}

          {/* 3. Soft Gallery Contact Shadow */}
          {shadowTex && (
            <mesh position={[0, -1.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[6.0, 2.7]} />
              <meshBasicMaterial map={shadowTex} transparent opacity={0.56} depthWrite={false} />
            </mesh>
          )}
        </group>
      </group>
    </>
  )
}

// ---------------------------------------------------------------------------
// Master Lifecycle 3D Gallery Stage Wrapper
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
    }

    el.addEventListener('pointermove', handlePointerMove, { passive: true })
    el.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      el.removeEventListener('pointermove', handlePointerMove)
      el.removeEventListener('pointerleave', handlePointerLeave)
      document.body.style.cursor = 'auto'
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[440px] sm:h-[500px] lg:h-[560px] my-10 sm:my-14 overflow-hidden rounded-2xl select-none"
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
      <div className="absolute top-5 left-6 right-6 z-10 flex items-center justify-between text-xs font-mono tracking-widest uppercase pointer-events-none">
        <div className="flex items-center gap-2.5" style={{ color: '#ECC87A' }}>
          <span className="w-2 h-2 rounded-full bg-[#ECC87A] animate-pulse" />
          <span className="font-semibold tracking-[0.2em]">THE ENGINEERING JOURNEY</span>
        </div>
        <div className="text-[11px] text-stone-400/80 font-mono">
          PHASE // 0{activePhase + 1} ACTIVE
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [-1.72, -0.28, 5.48], fov: 34 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.75) : 1}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <ArchitecturalSculptureScene
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
