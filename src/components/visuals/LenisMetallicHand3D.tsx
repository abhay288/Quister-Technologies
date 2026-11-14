import { useRef, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'
import {
  buildContinuousSculptedHandGeometry,
  captureBindPose,
  applySculptedHandPose,
  createStudioEnvironment,
  type BindPoseMap,
} from './handSculptor'

interface LenisMetallicHand3DProps {
  progressRef: React.MutableRefObject<number>
  mouseStateRef?: React.MutableRefObject<{ x: number; y: number }>
}

// ---------------------------------------------------------------------------
// High-Resolution Sculpted Realistic Human Hand + Continuous Forearm
// - Seamless anatomical wrist-to-forearm loft merged directly into the
//   single SkinnedMesh topology and smoothed with Loop Subdivision (zero joint)
// - Full 25-bone FK sculptural pose (relaxed open fingers & subtle scroll life)
// - Procedural studio softbox PMREM environment for crisp realistic shading
// - Solid Z-buffered rendering with container-level opacity softening
// - Continuous 360-degree Y-axis revolution driven by scroll progress
// ---------------------------------------------------------------------------
function RealisticHumanHand({
  progressRef,
  mouseStateRef,
  wrapperRef,
}: {
  progressRef: React.MutableRefObject<number>
  mouseStateRef?: React.MutableRefObject<{ x: number; y: number }>
  wrapperRef: React.RefObject<HTMLDivElement | null>
}) {
  const masterGroupRef = useRef<THREE.Group>(null)

  const { scene: threeScene, gl } = useThree()
  const { scene: gltfScene } = useGLTF('/assets/3d-visuals/right_hand.glb')

  // Generate offline procedural luxury studio environment for realistic highlights
  useEffect(() => {
    const envTex = createStudioEnvironment(gl)
    const prevEnv = threeScene.environment
    threeScene.environment = envTex

    return () => {
      threeScene.environment = prevEnv
      envTex.dispose()
    }
  }, [gl, threeScene])

  // Clone scene safely, weld & loft seamless continuous forearm + subdivide, and capture bind pose
  const { clonedScene, sculptedGeometry, handSkeleton, handBindPose } = useMemo(() => {
    const cloned = SkeletonUtils.clone(gltfScene)
    const holder: {
      geom: THREE.BufferGeometry | null
      skeleton: THREE.Skeleton | null
      bindPose: BindPoseMap | null
    } = { geom: null, skeleton: null, bindPose: null }

    cloned.traverse((child) => {
      if (child instanceof THREE.SkinnedMesh) {
        const built = buildContinuousSculptedHandGeometry(child.geometry)
        holder.geom = built
        child.geometry = built
        child.frustumCulled = false
        child.castShadow = false
        child.receiveShadow = false
        if (child.skeleton) {
          holder.skeleton = child.skeleton
          holder.bindPose = captureBindPose(child.skeleton)
          // Apply initial relaxed human sculptural pose immediately before first frame
          applySculptedHandPose(child.skeleton, holder.bindPose, 0)
        }
      }
    })

    return {
      clonedScene: cloned,
      sculptedGeometry: holder.geom,
      handSkeleton: holder.skeleton,
      handBindPose: holder.bindPose,
    }
  }, [gltfScene])

  // Realistic Sculpted Satin Champagne-Silver Material
  const handMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#E8E1D6'), // Warm alabaster-silver sculpture tone
        metalness: 0.52,
        roughness: 0.25, // Silky studio softbox highlights along fingers & forearm
        clearcoat: 0.55,
        clearcoatRoughness: 0.22,
        envMapIntensity: 1.45,
        sheen: 0.35,
        sheenRoughness: 0.45,
        sheenColor: new THREE.Color('#F3D18C'), // Restrained champagne-gold grazing sheen
        transparent: false,
        depthWrite: true,
      }),
    []
  )

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = handMaterial
      }
    })
  }, [clonedScene, handMaterial])

  useEffect(() => {
    return () => {
      handMaterial.dispose()
      if (sculptedGeometry) sculptedGeometry.dispose()
    }
  }, [handMaterial, sculptedGeometry])

  useFrame(() => {
    const p = THREE.MathUtils.clamp(progressRef.current, 0, 1)
    const introT = Math.min(1, p / 0.12)
    const FINALE_START = 0.77
    const cardPhaseT = Math.min(1, p / FINALE_START)
    const finaleT = p > FINALE_START ? (p - FINALE_START) / (1 - FINALE_START) : 0
    const finaleEase =
      finaleT < 0.5 ? 2 * finaleT * finaleT : 1 - Math.pow(-2 * finaleT + 2, 2) / 2

    // Smooth Parallax from cursor coordinates
    const mx = mouseStateRef?.current.x || 0
    const my = mouseStateRef?.current.y || 0

    // Live FK finger breathing + post-6th-card open-hand finale flourish
    if (handSkeleton && handBindPose) {
      applySculptedHandPose(handSkeleton, handBindPose, cardPhaseT, finaleT)
    }

    if (masterGroupRef.current) {
      // Phase 1 (0..0.77): Center behind Hero -> frame corridor during Cards 01..06
      // Phase 2 (0.77..1.0): Complete 360-degree finale hand move lifting toward foreground center
      const basePosX = THREE.MathUtils.lerp(0.0, -0.14, introT)
      const basePosY = THREE.MathUtils.lerp(-0.82, -0.94, cardPhaseT)
      const basePosZ = THREE.MathUtils.lerp(0.05, -0.14, cardPhaseT)

      const targetPosX = THREE.MathUtils.lerp(basePosX, -0.02, finaleEase)
      const targetPosY = THREE.MathUtils.lerp(basePosY, -0.76, finaleEase)
      const targetPosZ = THREE.MathUtils.lerp(basePosZ, 0.16, Math.sin(finaleT * Math.PI))

      // 0 -> 2π across cards, followed by a complete fresh 360° (2π -> 4π) hand move after Card 06
      const targetRotY = cardPhaseT * (Math.PI * 2) + finaleEase * (Math.PI * 2)
      const targetRotX =
        THREE.MathUtils.lerp(-0.04, 0.1, Math.sin(cardPhaseT * Math.PI)) -
        Math.sin(finaleT * Math.PI) * 0.12
      const targetRotZ = Math.sin(p * Math.PI * 2) * 0.035

      masterGroupRef.current.position.x += (targetPosX + mx * 0.11 - masterGroupRef.current.position.x) * 0.08
      masterGroupRef.current.position.y += (targetPosY + my * 0.09 - masterGroupRef.current.position.y) * 0.08
      masterGroupRef.current.position.z += (targetPosZ - masterGroupRef.current.position.z) * 0.08

      masterGroupRef.current.rotation.x += (targetRotX - my * 0.06 - masterGroupRef.current.rotation.x) * 0.08
      masterGroupRef.current.rotation.y += (targetRotY + mx * 0.13 - masterGroupRef.current.rotation.y) * 0.1
      masterGroupRef.current.rotation.z += (targetRotZ - masterGroupRef.current.rotation.z) * 0.08
    }

    // Soft translucent opacity on Canvas wrapper (Hero 0.50 -> Card cascade 0.42 -> Finale 0.65)
    if (wrapperRef.current) {
      const cardOpacity = THREE.MathUtils.lerp(0.5, 0.42, introT)
      const targetOpacity = THREE.MathUtils.lerp(cardOpacity, 0.65, Math.min(1, finaleT * 1.4))
      wrapperRef.current.style.opacity = targetOpacity.toFixed(3)
    }
  })

  return (
    <group ref={masterGroupRef} position={[0, -0.82, 0.05]}>
      {/* Balanced Studio Key, Warm Fill & Rim Lighting */}
      <directionalLight position={[4, 6, 5]} intensity={1.85} color="#FFFBF4" />
      <directionalLight position={[-5, 2, 4]} intensity={1.45} color="#F3DCA8" />
      <directionalLight position={[2, 4, -6]} intensity={1.65} color="#D8C8F5" />
      <directionalLight position={[0, -4, 3]} intensity={0.85} color="#E6D2B2" />

      {/* Single Seamless Continuous Sculpted Hand + Forearm SkinnedMesh
          Rotated to an iconic 3/4 sculptural angle facing camera at p=0 */}
      <group rotation={[0, Math.PI * 0.36, 0]}>
        <group position={[-0.428, 0.675, 0.133]}>
          <group rotation={[0, Math.PI, Math.PI]} scale={11.2}>
            <primitive object={clonedScene} />
          </group>
        </group>
      </group>
    </group>
  )
}

// Preload 3D Model asset so it's instantly ready
useGLTF.preload('/assets/3d-visuals/right_hand.glb')

export default function LenisMetallicHand3D({
  progressRef,
  mouseStateRef,
}: LenisMetallicHand3DProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={wrapperRef}
      className="w-full h-full relative pointer-events-none"
      style={{
        opacity: 0.5,
        WebkitMaskImage:
          'linear-gradient(to bottom, #000 0%, #000 72%, rgba(0, 0, 0, 0.45) 88%, transparent 100%)',
        maskImage:
          'linear-gradient(to bottom, #000 0%, #000 72%, rgba(0, 0, 0, 0.45) 88%, transparent 100%)',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
        }}
        dpr={[1, 2]}
      >
        <ambientLight color="#FFF6E8" intensity={0.75} />
        <hemisphereLight args={['#FFF6E5', '#1F1430', 0.9]} />
        <Suspense fallback={null}>
          <RealisticHumanHand
            progressRef={progressRef}
            mouseStateRef={mouseStateRef}
            wrapperRef={wrapperRef}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
