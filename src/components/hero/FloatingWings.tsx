import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { evaluateChoreography } from './choreography'

interface MouseState {
  x: number
  y: number
  targetX: number
  targetY: number
}

interface FloatingWingsProps {
  mouseState: React.MutableRefObject<MouseState>
  scrollProgress: React.MutableRefObject<number>
}

export default function FloatingWings({ mouseState, scrollProgress }: FloatingWingsProps) {
  const masterGroupRef = useRef<THREE.Group>(null)
  const leftMembraneRef = useRef<THREE.Group>(null)
  const rightMembraneRef = useRef<THREE.Group>(null)
  const lowerRightPetalRef = useRef<THREE.Group>(null)
  const farLeftPetalRef = useRef<THREE.Group>(null)

  // ---------------------------------------------------------------------------
  // Sculptural Membrane Geometries (Silk Petals / Glass Fins)
  // Pure, smooth translucent glass/silk surfaces without wireframe or vein lines
  // ---------------------------------------------------------------------------
  const { leftMembraneGeo, rightMembraneGeo } = useMemo(() => {
    const uSegments = 32
    const vSegments = 44

    // Left Membrane: Broad, graceful flared silk mantle fin
    const evalLeftFin = (u: number, v: number) => {
      const chord = Math.sin(v * Math.PI * 0.92 + 0.08)
      const chordWidth = Math.pow(chord, 0.6) * (1.35 + Math.sin(v * Math.PI * 1.6) * 0.22)

      const sweepX = (v - 0.08) * -2.4
      const sweepY = (u - 0.46) * chordWidth * 1.55 + Math.sin(v * Math.PI * 1.2) * 0.42

      // Smooth 3D S-curve camber giving rich sculptural volume
      const camber = -(
        Math.sin(u * Math.PI) * 0.45 * Math.cos(v * Math.PI * 0.85) +
        Math.sin(v * Math.PI * 1.5) * 0.28 * (u - 0.5)
      )

      return new THREE.Vector3(sweepX, sweepY, camber)
    }

    // Right Membrane: Distinct asymmetric shape — elongated sweeping silhouette with different camber
    const evalRightFin = (u: number, v: number) => {
      const chord = Math.sin(v * Math.PI * 0.88 + 0.12)
      const chordWidth = Math.pow(chord, 0.68) * (1.45 + Math.sin(v * Math.PI * 1.4) * 0.25)

      const sweepX = (v - 0.06) * 2.5
      const sweepY = (u - 0.42) * chordWidth * 1.45 + Math.sin(v * Math.PI * 1.35) * 0.45

      // Asymmetric, sweeping 3D saddle curve
      const camber = (
        Math.sin(u * Math.PI * 0.95) * 0.42 * Math.cos(v * Math.PI * 0.75) +
        Math.cos(v * Math.PI * 1.7) * 0.24 * (u - 0.45)
      )

      return new THREE.Vector3(sweepX, sweepY, camber)
    }

    const buildMembraneMesh = (evalFn: (u: number, v: number) => THREE.Vector3) => {
      const geo = new THREE.BufferGeometry()
      const pos = new Float32Array((uSegments + 1) * (vSegments + 1) * 3)
      const normals = new Float32Array((uSegments + 1) * (vSegments + 1) * 3)
      const uvs = new Float32Array((uSegments + 1) * (vSegments + 1) * 2)
      const indices: number[] = []

      let pIdx = 0
      let uvIdx = 0

      for (let j = 0; j <= vSegments; j++) {
        const v = j / vSegments
        for (let i = 0; i <= uSegments; i++) {
          const u = i / uSegments
          const p = evalFn(u, v)

          pos[pIdx] = p.x
          pos[pIdx + 1] = p.y
          pos[pIdx + 2] = p.z

          uvs[uvIdx] = u
          uvs[uvIdx + 1] = v

          pIdx += 3
          uvIdx += 2
        }
      }

      for (let j = 0; j < vSegments; j++) {
        for (let i = 0; i < uSegments; i++) {
          const a = j * (uSegments + 1) + i
          const b = (j + 1) * (uSegments + 1) + i
          const c = (j + 1) * (uSegments + 1) + (i + 1)
          const d = j * (uSegments + 1) + (i + 1)

          indices.push(a, b, d)
          indices.push(b, c, d)
        }
      }

      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
      geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
      geo.setIndex(indices)
      geo.computeVertexNormals()

      return geo
    }

    return {
      leftMembraneGeo: buildMembraneMesh(evalLeftFin),
      rightMembraneGeo: buildMembraneMesh(evalRightFin),
    }
  }, [])

  // ---------------------------------------------------------------------------
  // Materials: Ultra-Transparent Sculptural Glass / Silk Membranes
  // Soft, translucent ethereal sails (purely ambient, ~8% visual intensity)
  // ---------------------------------------------------------------------------
  const membraneGlassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#D2BCFD'), // Ethereal whisper lavender
        emissive: new THREE.Color('#0A0214'),
        emissiveIntensity: 0.02,
        roughness: 0.12,
        metalness: 0.01,
        transmission: 0.98, // Maximum glass transmission for sheer transparency
        thickness: 0.20,
        ior: 1.33,
        specularIntensity: 0.6,
        specularColor: new THREE.Color('#FFF6E4'),
        clearcoat: 0.75,
        clearcoatRoughness: 0.08,
        transparent: true,
        opacity: 0.08, // Ultra-soft atmospheric wing silhouette
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    []
  )

  // ---------------------------------------------------------------------------
  // Animation Loop: Independent Movements for All Membranes
  // Left Membrane: Gentle inward/outward folding movement
  // Right Membrane: Independent circular and rotational movement
  // Background Petals: Fluid depth bobbing
  // ---------------------------------------------------------------------------
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const m = mouseState.current
    const sp = scrollProgress.current

    const choreo = evaluateChoreography(sp)
    const [lmTarget, rmTarget] = choreo.membranes

    // 1. Left Membrane: Gentle Inward/Outward Folding Movement
    if (leftMembraneRef.current) {
      const foldPhase = time * 0.85
      const foldZ = Math.sin(foldPhase) * 0.08
      const foldX = Math.cos(foldPhase * 0.7) * 0.05
      const driftY = Math.sin(foldPhase * 0.6) * 0.06

      const targetX = lmTarget.x + Math.sin(foldPhase * 0.5) * 0.04 + m.x * 0.16
      const targetY = lmTarget.y + driftY - m.y * 0.12
      const targetZ = lmTarget.z + m.y * 0.08

      leftMembraneRef.current.position.x += (targetX - leftMembraneRef.current.position.x) * 0.08
      leftMembraneRef.current.position.y += (targetY - leftMembraneRef.current.position.y) * 0.08
      leftMembraneRef.current.position.z += (targetZ - leftMembraneRef.current.position.z) * 0.08

      const rotX = lmTarget.rotX + foldX - m.y * 0.08
      const rotY = lmTarget.rotY + Math.cos(foldPhase * 0.5) * 0.04 + m.x * 0.1
      const rotZ = lmTarget.rotZ + foldZ + m.x * 0.06

      leftMembraneRef.current.rotation.x += (rotX - leftMembraneRef.current.rotation.x) * 0.08
      leftMembraneRef.current.rotation.y += (rotY - leftMembraneRef.current.rotation.y) * 0.08
      leftMembraneRef.current.rotation.z += (rotZ - leftMembraneRef.current.rotation.z) * 0.08

      leftMembraneRef.current.scale.set(lmTarget.scaleX, lmTarget.scaleY, lmTarget.scaleZ)
    }

    // 2. Right Membrane: Independent Circular and Rotational Movement
    if (rightMembraneRef.current) {
      const circPhase = time * 0.75 + 1.2
      const circX = Math.cos(circPhase) * 0.07 - m.x * 0.14
      const circY = Math.sin(circPhase) * 0.08 + m.y * 0.1
      const circZ = Math.sin(circPhase * 0.8) * 0.05

      const targetX = rmTarget.x + circX
      const targetY = rmTarget.y + circY
      const targetZ = rmTarget.z + circZ

      rightMembraneRef.current.position.x += (targetX - rightMembraneRef.current.position.x) * 0.08
      rightMembraneRef.current.position.y += (targetY - rightMembraneRef.current.position.y) * 0.08
      rightMembraneRef.current.position.z += (targetZ - rightMembraneRef.current.position.z) * 0.08

      const rotX = rmTarget.rotX + Math.sin(circPhase * 0.9) * 0.06 - m.y * 0.08
      const rotY = rmTarget.rotY + Math.cos(circPhase * 0.75) * 0.06 + m.x * 0.12
      const rotZ = rmTarget.rotZ + Math.sin(circPhase * 1.1) * 0.05 + m.x * 0.08

      rightMembraneRef.current.rotation.x += (rotX - rightMembraneRef.current.rotation.x) * 0.08
      rightMembraneRef.current.rotation.y += (rotY - rightMembraneRef.current.rotation.y) * 0.08
      rightMembraneRef.current.rotation.z += (rotZ - rightMembraneRef.current.rotation.z) * 0.08

      rightMembraneRef.current.scale.set(rmTarget.scaleX, rmTarget.scaleY, rmTarget.scaleZ)
    }

    // 3. Lower Right Background Petal
    if (lowerRightPetalRef.current) {
      const pTime = time * 0.6 + 2.5
      lowerRightPetalRef.current.position.x = 3.6 + Math.cos(pTime * 0.8) * 0.06 - m.x * 0.1
      lowerRightPetalRef.current.position.y = -0.7 + Math.sin(pTime) * 0.07 + m.y * 0.08
      lowerRightPetalRef.current.position.z = -1.1
      lowerRightPetalRef.current.rotation.z = -0.65 + Math.sin(pTime * 0.7) * 0.04
    }

    // 4. Far Left Background Petal
    if (farLeftPetalRef.current) {
      const pTime = time * 0.55 + 0.8
      farLeftPetalRef.current.position.x = -4.1 + Math.sin(pTime * 0.9) * 0.05 + m.x * 0.12
      farLeftPetalRef.current.position.y = -0.35 + Math.cos(pTime) * 0.06 - m.y * 0.08
      farLeftPetalRef.current.position.z = -1.4
      farLeftPetalRef.current.rotation.z = 0.55 + Math.cos(pTime * 0.8) * 0.04
    }

    // Opacity fades smoothly for clean portfolio transition in Chapter 5
    const avgOpacity = (lmTarget.opacity + rmTarget.opacity) * 0.5
    membraneGlassMaterial.opacity = 0.08 * avgOpacity
  })

  return (
    <group ref={masterGroupRef} position={[0, 0, 0]}>
      {/* 1. Left Membrane (Clean Translucent Sculptural Glass Silhouette) */}
      <group ref={leftMembraneRef}>
        <mesh geometry={leftMembraneGeo} material={membraneGlassMaterial} />
      </group>

      {/* 2. Right Membrane (Clean Translucent Sculptural Glass Silhouette) */}
      <group ref={rightMembraneRef}>
        <mesh geometry={rightMembraneGeo} material={membraneGlassMaterial} />
      </group>

      {/* 3. Lower Right Background Petal */}
      <group ref={lowerRightPetalRef} scale={0.58} rotation={[0.2, 0.4, -0.65]}>
        <mesh geometry={rightMembraneGeo} material={membraneGlassMaterial} />
      </group>

      {/* 4. Far Left Background Petal */}
      <group ref={farLeftPetalRef} scale={0.52} rotation={[-0.15, -0.35, 0.55]}>
        <mesh geometry={leftMembraneGeo} material={membraneGlassMaterial} />
      </group>
    </group>
  )
}
