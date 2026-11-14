import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// --- TENTACLES CONSTANTS ---
const NUM_TENTACLES = 22
const TENTACLE_SEGMENTS = 44
const NUM_DROPLETS = 18

interface MouseState {
  x: number
  y: number
  targetX: number
  targetY: number
}

// ---------------------------------------------------------------------------
// 1. PROCEDURAL 3D JELLYFISH COMPONENT FOR SELECTED WORK / PROVEN IN PRODUCTION
// ---------------------------------------------------------------------------
function JellyfishOrganism({
  mouseState,
  scrollProgress,
}: {
  mouseState: React.MutableRefObject<MouseState>
  scrollProgress: React.MutableRefObject<number>
}) {
  const masterGroupRef = useRef<THREE.Group>(null)
  const bellGroupRef = useRef<THREE.Group>(null)
  const outerBellMeshRef = useRef<THREE.Mesh>(null)
  const innerBellMeshRef = useRef<THREE.Mesh>(null)
  const oralArmsGroupRef = useRef<THREE.Group>(null)
  const tentaclesGroupRef = useRef<THREE.Group>(null)
  const internalLightRef = useRef<THREE.PointLight>(null)

  // Initial bell base geometry data
  const { outerGeometry, baseOuterPositions, innerGeometry, baseInnerPositions } = useMemo(() => {
    const radialSegs = 64
    const ringSegs = 40

    // Outer bell
    const outerGeo = new THREE.BufferGeometry()
    const outerPos = new Float32Array((ringSegs + 1) * (radialSegs + 1) * 3)
    const outerUvs = new Float32Array((ringSegs + 1) * (radialSegs + 1) * 2)
    const outerIndices: number[] = []

    let pIdx = 0
    let uvIdx = 0

    for (let r = 0; r <= ringSegs; r++) {
      const v = r / ringSegs // 0 (apex) to 1 (rim)
      // Parabolic dome profile with flared scalloped rim
      const radiusBase = Math.sin(v * Math.PI * 0.58) * 1.58
      const heightBase = Math.cos(v * Math.PI * 0.6) * 1.18

      for (let s = 0; s <= radialSegs; s++) {
        const u = s / radialSegs
        const theta = u * Math.PI * 2

        // Scalloped fluting at rim
        const fluting = v > 0.65 ? Math.sin(theta * 14) * 0.05 * Math.pow(v, 2.2) : 0
        const rEff = radiusBase + fluting

        const x = Math.cos(theta) * rEff
        const z = Math.sin(theta) * rEff
        const y = heightBase

        outerPos[pIdx] = x
        outerPos[pIdx + 1] = y
        outerPos[pIdx + 2] = z

        outerUvs[uvIdx] = u
        outerUvs[uvIdx + 1] = v

        pIdx += 3
        uvIdx += 2
      }
    }

    for (let r = 0; r < ringSegs; r++) {
      for (let s = 0; s < radialSegs; s++) {
        const a = r * (radialSegs + 1) + s
        const b = (r + 1) * (radialSegs + 1) + s
        const c = (r + 1) * (radialSegs + 1) + (s + 1)
        const d = r * (radialSegs + 1) + (s + 1)

        outerIndices.push(a, b, d)
        outerIndices.push(b, c, d)
      }
    }

    outerGeo.setAttribute('position', new THREE.BufferAttribute(outerPos, 3))
    outerGeo.setAttribute('uv', new THREE.BufferAttribute(outerUvs, 2))
    outerGeo.setIndex(outerIndices)
    outerGeo.computeVertexNormals()

    // Inner bell (slightly smaller concentric dome)
    const innerGeo = new THREE.BufferGeometry()
    const innerPos = new Float32Array((ringSegs + 1) * (radialSegs + 1) * 3)
    const innerIndices: number[] = []

    pIdx = 0
    for (let r = 0; r <= ringSegs; r++) {
      const v = r / ringSegs
      const radiusBase = Math.sin(v * Math.PI * 0.56) * 1.42
      const heightBase = Math.cos(v * Math.PI * 0.58) * 1.02 - 0.04

      for (let s = 0; s <= radialSegs; s++) {
        const u = s / radialSegs
        const theta = u * Math.PI * 2
        const x = Math.cos(theta) * radiusBase
        const z = Math.sin(theta) * radiusBase
        const y = heightBase

        innerPos[pIdx] = x
        innerPos[pIdx + 1] = y
        innerPos[pIdx + 2] = z
        pIdx += 3
      }
    }

    for (let r = 0; r < ringSegs; r++) {
      for (let s = 0; s < radialSegs; s++) {
        const a = r * (radialSegs + 1) + s
        const b = (r + 1) * (radialSegs + 1) + s
        const c = (r + 1) * (radialSegs + 1) + (s + 1)
        const d = r * (radialSegs + 1) + (s + 1)
        innerIndices.push(a, d, b)
        innerIndices.push(b, d, c)
      }
    }

    innerGeo.setAttribute('position', new THREE.BufferAttribute(innerPos, 3))
    innerGeo.setIndex(innerIndices)
    innerGeo.computeVertexNormals()

    return {
      outerGeometry: outerGeo,
      baseOuterPositions: Float32Array.from(outerPos),
      innerGeometry: innerGeo,
      baseInnerPositions: Float32Array.from(innerPos),
    }
  }, [])

  // 2. Oral Arms (Central ruffled spiral ribbons)
  const oralArmsData = useMemo(() => {
    const armsCount = 8
    const armSegments = 34
    const geometries: THREE.BufferGeometry[] = []

    for (let a = 0; a < armsCount; a++) {
      const armAngle = (a / armsCount) * Math.PI * 2
      const geo = new THREE.BufferGeometry()
      const pos = new Float32Array((armSegments + 1) * 2 * 3)
      const indices: number[] = []

      for (let i = 0; i <= armSegments; i++) {
        const t = i / armSegments
        const y = -t * 2.5
        const spiral = t * Math.PI * 3.8 + armAngle
        const radius = 0.38 * (1 - t * 0.35) + Math.sin(t * 10) * 0.07

        const cx = Math.cos(spiral) * radius
        const cz = Math.sin(spiral) * radius

        const width = 0.26 * (1 - t * 0.45) + Math.sin(t * 14) * 0.05
        const normAngle = spiral + Math.PI * 0.5
        const nx = Math.cos(normAngle) * width
        const nz = Math.sin(normAngle) * width

        const idx = i * 6
        // Vertex 1
        pos[idx] = cx - nx
        pos[idx + 1] = y
        pos[idx + 2] = cz - nz
        // Vertex 2
        pos[idx + 3] = cx + nx
        pos[idx + 4] = y
        pos[idx + 5] = cz + nz
      }

      for (let i = 0; i < armSegments; i++) {
        const v1 = i * 2
        const v2 = v1 + 1
        const v3 = (i + 1) * 2
        const v4 = v3 + 1

        indices.push(v1, v2, v4)
        indices.push(v1, v4, v3)
      }

      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setIndex(indices)
      geo.computeVertexNormals()
      geometries.push(geo)
    }

    return geometries
  }, [])

  // 3. Flowing Trailing Tentacles Data
  const tentaclesData = useMemo(() => {
    const tentacles: {
      geometry: THREE.BufferGeometry
      positions: Float32Array
      baseAngle: number
      baseRadius: number
      speed: number
      phase: number
      lengthFactor: number
      ribbonWidth: number
      flowOffset: { x: number; y: number; z: number }
    }[] = []

    for (let t = 0; t < NUM_TENTACLES; t++) {
      const geo = new THREE.BufferGeometry()
      const positions = new Float32Array((TENTACLE_SEGMENTS + 1) * 2 * 3)
      const indices: number[] = []

      for (let i = 0; i < TENTACLE_SEGMENTS; i++) {
        const v1 = i * 2
        const v2 = v1 + 1
        const v3 = (i + 1) * 2
        const v4 = v3 + 1

        indices.push(v1, v2, v4)
        indices.push(v1, v4, v3)
      }

      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geo.setIndex(indices)

      const baseAngle = (t / NUM_TENTACLES) * Math.PI * 2
      const isInner = t % 2 === 0
      const baseRadius = isInner ? 0.65 + (t % 3) * 0.15 : 1.35 + (t % 4) * 0.08
      const speed = 1.6 + (t % 5) * 0.22
      const phase = (t / NUM_TENTACLES) * Math.PI * 3.5
      const lengthFactor = 1.0 + (t % 7) * 0.18
      const ribbonWidth = isInner ? 0.075 : 0.05 + (t % 3) * 0.02

      tentacles.push({
        geometry: geo,
        positions,
        baseAngle,
        baseRadius,
        speed,
        phase,
        lengthFactor,
        ribbonWidth,
        flowOffset: {
          x: -2.8 - (t % 4) * 0.35,
          y: -4.2 - (t % 5) * 0.45,
          z: -1.2 - (t % 3) * 0.3,
        },
      })
    }

    return tentacles
  }, [])

  // 4. Materials setup
  const outerBellMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#DFB86C'),
        emissive: new THREE.Color('#50330A'),
        emissiveIntensity: 0.35,
        roughness: 0.14,
        metalness: 0.78,
        transmission: 0.62,
        thickness: 1.6,
        ior: 1.48,
        specularIntensity: 1.0,
        specularColor: new THREE.Color('#FFF5D6'),
        clearcoat: 0.85,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.94,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    []
  )

  const innerBellMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#F3CC80'),
        emissive: new THREE.Color('#804A0D'),
        emissiveIntensity: 0.6,
        roughness: 0.22,
        metalness: 0.85,
        transmission: 0.45,
        thickness: 1.2,
        transparent: true,
        opacity: 0.88,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    []
  )

  const tentacleMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#E5BF77'),
        emissive: new THREE.Color('#3A2306'),
        emissiveIntensity: 0.25,
        roughness: 0.18,
        metalness: 0.88,
        transmission: 0.4,
        thickness: 0.8,
        clearcoat: 0.6,
        transparent: true,
        opacity: 0.82,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    []
  )

  const oralArmMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#E8C47F'),
        emissive: new THREE.Color('#6E400B'),
        emissiveIntensity: 0.45,
        roughness: 0.16,
        metalness: 0.82,
        transmission: 0.5,
        thickness: 1.0,
        clearcoat: 0.7,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    []
  )

  // 5. Frame Animation Loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    // Smooth mouse interpolation
    const m = mouseState.current
    m.x += (m.targetX - m.x) * 0.05
    m.y += (m.targetY - m.y) * 0.05

    // Overall jellyfish posture & gentle floating bob
    if (masterGroupRef.current) {
      const baseRotZ = -0.32
      const baseRotX = 0.24
      const baseRotY = -0.28

      masterGroupRef.current.rotation.z = baseRotZ + Math.sin(time * 0.6) * 0.05 + m.x * 0.12
      masterGroupRef.current.rotation.x = baseRotX + Math.cos(time * 0.5) * 0.04 - m.y * 0.1
      masterGroupRef.current.rotation.y = baseRotY + Math.sin(time * 0.4) * 0.06 + m.x * 0.15

      const floatY = Math.sin(time * 1.2) * 0.12
      const floatX = Math.cos(time * 0.8) * 0.08
      masterGroupRef.current.position.y = 0.45 + floatY - m.y * 0.18 - scrollProgress.current * 0.4
      masterGroupRef.current.position.x = 1.6 + floatX + m.x * 0.25
      masterGroupRef.current.position.z = -0.6 + m.y * 0.15
    }

    // Organic Bell Swimming Pulse
    const pulseCycle = Math.sin(time * 2.2)
    const pulseStrength = pulseCycle * 0.5 + 0.5
    const bellScaleRadial = 1.0 + pulseStrength * 0.1 - (1 - pulseStrength) * 0.05
    const bellScaleHeight = 1.0 - pulseStrength * 0.12 + (1 - pulseStrength) * 0.06

    // Animate outer bell vertices
    if (outerBellMeshRef.current) {
      const posAttr = outerGeometry.attributes.position as THREE.BufferAttribute
      const pos = posAttr.array as Float32Array
      const base = baseOuterPositions

      for (let i = 0; i < base.length; i += 3) {
        const bx = base[i]
        const by = base[i + 1]
        const bz = base[i + 2]

        const heightRatio = THREE.MathUtils.clamp((1.15 - by) / 1.5, 0, 1)
        const radFactor = THREE.MathUtils.lerp(1.0, bellScaleRadial, heightRatio)
        const ripple = Math.sin(time * 4.0 - by * 3.0) * 0.02 * heightRatio

        pos[i] = bx * radFactor + (bx !== 0 ? (bx / Math.abs(bx)) * ripple : 0)
        pos[i + 1] = by * bellScaleHeight
        pos[i + 2] = bz * radFactor + (bz !== 0 ? (bz / Math.abs(bz)) * ripple : 0)
      }

      posAttr.needsUpdate = true
      outerGeometry.computeVertexNormals()
    }

    // Animate inner bell
    if (innerBellMeshRef.current) {
      const posAttr = innerGeometry.attributes.position as THREE.BufferAttribute
      const pos = posAttr.array as Float32Array
      const base = baseInnerPositions

      for (let i = 0; i < base.length; i += 3) {
        const bx = base[i]
        const by = base[i + 1]
        const bz = base[i + 2]
        const heightRatio = THREE.MathUtils.clamp((0.98 - by) / 1.4, 0, 1)
        const radFactor = THREE.MathUtils.lerp(1.0, bellScaleRadial * 0.98, heightRatio)

        pos[i] = bx * radFactor
        pos[i + 1] = by * bellScaleHeight
        pos[i + 2] = bz * radFactor
      }
      posAttr.needsUpdate = true
    }

    // Internal light pulsating pulse
    if (internalLightRef.current) {
      internalLightRef.current.intensity = 2.4 + pulseStrength * 1.6
    }

    // Animate Flowing Diagonal Tentacles
    tentaclesData.forEach((tentacle) => {
      const pos = tentacle.positions
      const bAngle = tentacle.baseAngle
      const bRad = tentacle.baseRadius * bellScaleRadial

      const anchorX = Math.cos(bAngle) * bRad
      const anchorZ = Math.sin(bAngle) * bRad
      const anchorY = Math.cos(0.9 * Math.PI * 0.6) * 1.15 * bellScaleHeight

      for (let s = 0; s <= TENTACLE_SEGMENTS; s++) {
        const t = s / TENTACLE_SEGMENTS
        const pT = Math.pow(t, 1.35)

        const waveSpeed = tentacle.speed
        const wavePhase = time * waveSpeed - t * 7.5 + tentacle.phase

        const wave1 = Math.sin(wavePhase) * (0.05 + pT * 0.45)
        const wave2 = Math.cos(wavePhase * 0.75 + 1.2) * (0.04 + pT * 0.35)
        const wave3 = Math.sin(wavePhase * 1.3 + 2.0) * (0.03 + pT * 0.25)

        const flowX = anchorX + tentacle.flowOffset.x * pT * tentacle.lengthFactor + wave1
        const flowY = anchorY + tentacle.flowOffset.y * pT * tentacle.lengthFactor + wave2
        const flowZ = anchorZ + tentacle.flowOffset.z * pT * tentacle.lengthFactor + wave3

        const currentWidth = tentacle.ribbonWidth * (1.0 - t * 0.8)
        const normX = -Math.sin(bAngle) * currentWidth
        const normZ = Math.cos(bAngle) * currentWidth

        const idx = s * 6
        // Vertex 1
        pos[idx] = flowX - normX
        pos[idx + 1] = flowY
        pos[idx + 2] = flowZ - normZ

        // Vertex 2
        pos[idx + 3] = flowX + normX
        pos[idx + 4] = flowY
        pos[idx + 5] = flowZ + normZ
      }

      const posAttr = tentacle.geometry.attributes.position as THREE.BufferAttribute
      posAttr.needsUpdate = true
      tentacle.geometry.computeVertexNormals()
    })
  })

  return (
    <group ref={masterGroupRef} position={[1.5, 0.45, -0.2]} scale={0.72}>
      {/* Internal warm amber point light that illuminates translucent bell */}
      <pointLight
        ref={internalLightRef}
        position={[0, 0.4, 0]}
        color="#FFAE42"
        intensity={3.2}
        distance={7.5}
        decay={2}
      />

      {/* Bell Group */}
      <group ref={bellGroupRef}>
        <mesh ref={outerBellMeshRef} geometry={outerGeometry} material={outerBellMaterial} />
        <mesh ref={innerBellMeshRef} geometry={innerGeometry} material={innerBellMaterial} />
      </group>

      {/* Oral Arms (Spiraled interior frills) */}
      <group ref={oralArmsGroupRef}>
        {oralArmsData.map((geo, idx) => (
          <mesh key={idx} geometry={geo} material={oralArmMaterial} />
        ))}
      </group>

      {/* Long Flowing Gold Ribbon Tentacles */}
      <group ref={tentaclesGroupRef}>
        {tentaclesData.map((t, idx) => (
          <mesh key={idx} geometry={t.geometry} material={tentacleMaterial} />
        ))}
      </group>
    </group>
  )
}

// ---------------------------------------------------------------------------
// 2. STEPPED METALLIC PEDESTALS & VOXEL BLOCKS (Matching Previous SelectedWork)
// ---------------------------------------------------------------------------
function SteppedMetallicPedestals() {
  const pedestalsGroupRef = useRef<THREE.Group>(null)

  const pedestalMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#101216'),
        metalness: 0.94,
        roughness: 0.16,
        envMapIntensity: 1.5,
      }),
    []
  )

  const goldAccentBlockMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2A2215'),
        emissive: new THREE.Color('#4D330D'),
        emissiveIntensity: 0.2,
        metalness: 0.9,
        roughness: 0.22,
      }),
    []
  )

  const voxelSteps = useMemo(
    () => [
      { pos: [1.4, -3.2, -0.8] as [number, number, number], size: [2.2, 0.7, 1.4] as [number, number, number], mat: pedestalMaterial },
      { pos: [2.1, -2.7, -0.6] as [number, number, number], size: [1.1, 1.1, 1.1] as [number, number, number], mat: pedestalMaterial },
      { pos: [2.6, -2.1, -0.7] as [number, number, number], size: [0.85, 1.4, 0.85] as [number, number, number], mat: pedestalMaterial },
      { pos: [2.7, -1.0, -0.8] as [number, number, number], size: [0.45, 0.45, 0.45] as [number, number, number], mat: goldAccentBlockMaterial },
      { pos: [3.15, -0.65, -0.8] as [number, number, number], size: [0.45, 0.45, 0.45] as [number, number, number], mat: pedestalMaterial },
      { pos: [3.15, -0.2, -0.8] as [number, number, number], size: [0.45, 0.45, 0.45] as [number, number, number], mat: goldAccentBlockMaterial },
      { pos: [3.6, -0.2, -0.8] as [number, number, number], size: [0.45, 0.45, 0.45] as [number, number, number], mat: pedestalMaterial },
    ],
    [pedestalMaterial, goldAccentBlockMaterial]
  )

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (pedestalsGroupRef.current) {
      pedestalsGroupRef.current.position.y = Math.sin(time * 0.4) * 0.02
    }
  })

  return (
    <group ref={pedestalsGroupRef}>
      {voxelSteps.map((step, idx) => (
        <mesh key={idx} position={step.pos} material={step.mat}>
          <boxGeometry args={step.size} />
        </mesh>
      ))}

      {/* Warm upward bounce light directly over the pedestal reflection */}
      <pointLight position={[1.5, -2.0, 0.8]} color="#E5C07B" intensity={1.8} distance={5.0} decay={2} />
    </group>
  )
}

// ---------------------------------------------------------------------------
// 3. SUSPENDED LIQUID GOLD DROPLETS (Matching Previous SelectedWork)
// ---------------------------------------------------------------------------
function SuspendedGoldDroplets() {
  const dropletsRef = useRef<THREE.Group>(null)

  const dropletData = useMemo(() => {
    const items = []
    for (let i = 0; i < NUM_DROPLETS; i++) {
      const radius = 0.04 + (i % 5) * 0.028
      const x = 0.2 + Math.sin(i * 1.7) * 2.6
      const y = -0.4 + Math.cos(i * 2.3) * 2.2
      const z = Math.sin(i * 3.1) * 1.8 - 0.2
      const speed = 0.8 + (i % 4) * 0.3
      const phase = i * 0.9
      items.push({ radius, x, y, z, speed, phase })
    }
    return items
  }, [])

  const dropletMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#F2CE80'),
        emissive: new THREE.Color('#3A2405'),
        emissiveIntensity: 0.2,
        metalness: 0.96,
        roughness: 0.1,
      }),
    []
  )

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (!dropletsRef.current) return

    dropletsRef.current.children.forEach((child, i) => {
      const data = dropletData[i]
      if (data) {
        child.position.y = data.y + Math.sin(time * data.speed + data.phase) * 0.12
        child.position.x = data.x + Math.cos(time * data.speed * 0.7 + data.phase) * 0.06
      }
    })
  })

  return (
    <group ref={dropletsRef}>
      {dropletData.map((d, idx) => (
        <mesh key={idx} position={[d.x, d.y, d.z]} material={dropletMaterial}>
          <sphereGeometry args={[d.radius, 20, 20]} />
        </mesh>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// 4. ATMOSPHERIC PARTICLES
// ---------------------------------------------------------------------------
function RestrainedGoldParticles() {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions } = useMemo(() => {
    const particleCount = 70
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.3) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return { positions: pos }
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.02
      pointsRef.current.position.y = Math.sin(time * 0.3) * 0.1
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#E5C07B"
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ---------------------------------------------------------------------------
// 5. MASTER CAMERA & SCENE CONTROLLER
// ---------------------------------------------------------------------------
function SceneRig({
  mouseState,
  scrollProgress,
}: {
  mouseState: React.MutableRefObject<MouseState>
  scrollProgress: React.MutableRefObject<number>
}) {
  const { camera } = useThree()

  useFrame(() => {
    const m = mouseState.current
    const sp = scrollProgress.current

    camera.position.x = 0.3 + m.x * 0.2 - sp * 0.3
    camera.position.y = 0.35 - m.y * 0.18 - sp * 0.4
    camera.position.z = 8.6 + sp * 0.8

    camera.lookAt(0.5, 0.1, 0)
  })

  return null
}

// ---------------------------------------------------------------------------
// 6. EXPORTED JELLYFISH 3D SCENE (Proven in Production Page)
// ---------------------------------------------------------------------------
export default function JellyfishScene({
  scrollProgressRef,
}: {
  scrollProgressRef?: React.MutableRefObject<number>
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const defaultScrollProgress = useRef(0)
  const scrollRef = scrollProgressRef || defaultScrollProgress

  const mouseState = useRef<MouseState>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  })

  const [hasWebGL, setHasWebGL] = useState(true)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) setHasWebGL(false)
    } catch {
      setHasWebGL(false)
    }

    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -(e.clientY / window.innerHeight) * 2 + 1
      mouseState.current.targetX = THREE.MathUtils.clamp(nx, -1, 1)
      mouseState.current.targetY = THREE.MathUtils.clamp(ny, -1, 1)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])

  if (!hasWebGL) {
    return (
      <div
        className="w-full h-full flex items-center justify-center pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 65% 45%, rgba(229,192,123,0.12) 0%, transparent 65%)',
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
        zIndex: 0,
      }}
    >
      <Canvas
        camera={{ position: [0.3, 0.35, 8.6], fov: 40 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
        }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
      >
        {/* Studio Golden Lighting Rig (Zero Network Dependency) */}
        <ambientLight color="#16121E" intensity={1.4} />

        <directionalLight
          position={[5.5, 7.0, 4.5]}
          color="#FFF2D6"
          intensity={3.6}
        />

        <directionalLight
          position={[-5.0, 2.5, -2.0]}
          color="#E5C07B"
          intensity={2.2}
        />

        <directionalLight
          position={[0, 4.0, -5.0]}
          color="#FFDF9E"
          intensity={2.4}
        />

        <pointLight position={[2.0, 1.0, 2.0]} color="#F3D18C" intensity={1.6} distance={8} />

        {/* Jellyfish Organism */}
        <JellyfishOrganism mouseState={mouseState} scrollProgress={scrollRef} />

        {/* Dark Stepped Metallic Pedestals */}
        <SteppedMetallicPedestals />

        {/* Suspended Liquid Gold Droplets */}
        <SuspendedGoldDroplets />

        {/* Atmospheric particles */}
        <RestrainedGoldParticles />

        {/* Camera Rig */}
        <SceneRig mouseState={mouseState} scrollProgress={scrollRef} />
      </Canvas>
    </div>
  )
}

