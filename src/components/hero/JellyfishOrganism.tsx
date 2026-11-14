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

interface JellyfishOrganismProps {
  mouseState: React.MutableRefObject<MouseState>
  scrollProgress: React.MutableRefObject<number>
}

// 34 Independent, gracefully streaming marginal tentacles across 3 concentric tiers
const NUM_TENTACLES = 34
const TENTACLE_SEGMENTS = 50
const NUM_RADIAL_RIBS = 8

export default function JellyfishOrganism({
  mouseState,
  scrollProgress,
}: JellyfishOrganismProps) {
  const masterGroupRef = useRef<THREE.Group>(null)
  const outerBellRef = useRef<THREE.Mesh>(null)
  const innerBellRef = useRef<THREE.Mesh>(null)
  const coreGastricRef = useRef<THREE.Mesh>(null)
  const rimLineRef = useRef<THREE.LineLoop>(null)
  const photophoresRef = useRef<THREE.Points>(null)
  const internalLightRef = useRef<THREE.PointLight>(null)
  const internalLight2Ref = useRef<THREE.PointLight>(null)
  const accentLightRef = useRef<THREE.PointLight>(null)
  const oralArmsGroupRef = useRef<THREE.Group>(null)

  // ---------------------------------------------------------------------------
  // 1. Dual-Layer Hyper-Realistic Medusa Bell Geometry
  // Deep parabolic umbrella dome with 8 fluted lobes, curled rim margin,
  // 8 prominent arched luminous radial ribs, and 4-lobed glowing horseshoe core
  // ---------------------------------------------------------------------------
  const {
    outerBellGeo,
    innerBellGeo,
    outerBasePositions,
    innerBasePositions,
    rimWireGeo,
    ribsMergedGeo,
    gastricCoreGeo,
    photophorePositions,
    photophoreColors,
    oralArmsData,
  } = useMemo(() => {
    const radialSegs = 72
    const ringSegs = 48

    // Outer Exumbrella: Deep parabolic dome with fluted radial lobes and curled velum margin
    const evalOuter = (u: number, v: number) => {
      const theta = u * Math.PI * 2
      // Radial lobed bulging along the 8 meridians (matching reference photo)
      const lobeBulge = Math.sin(theta * 8) * 0.042 * Math.sin(v * Math.PI * 0.85)

      // Parabolic curvature: narrow waist swelling outward, flaring gently at margin
      const rCurve = Math.sin(v * Math.PI * 0.5) ** 0.82
      const radiusBase = rCurve * (1.44 + Math.pow(v, 3.2) * 0.22) + lobeBulge

      // Dome apex at 1.48, curving down smoothly to -0.22 at the margin
      const heightBase = Math.cos(v * Math.PI * 0.54) * 1.58 - 0.1

      // Curled margin lip with 16 delicate lappet ripples at the rim (v > 0.72)
      const lappetRipples = v > 0.72 ? Math.sin(theta * 16) * 0.032 * Math.pow(v, 2.2) : 0
      const rEff = radiusBase + lappetRipples

      return new THREE.Vector3(Math.cos(theta) * rEff, heightBase, Math.sin(theta) * rEff)
    }

    // Inner Subumbrella: Tissue layer with optical thickness
    const evalInner = (u: number, v: number) => {
      const theta = u * Math.PI * 2
      const lobeBulge = Math.sin(theta * 8) * 0.032 * Math.sin(v * Math.PI * 0.85)
      const rCurve = Math.sin(v * Math.PI * 0.5) ** 0.82
      const radiusBase = rCurve * (1.32 + Math.pow(v, 3.2) * 0.18) + lobeBulge
      const heightBase = Math.cos(v * Math.PI * 0.54) * 1.48 - 0.14
      const lappetRipples = v > 0.72 ? Math.sin(theta * 16) * 0.026 * Math.pow(v, 2.2) : 0
      const rEff = radiusBase + lappetRipples

      return new THREE.Vector3(Math.cos(theta) * rEff, heightBase, Math.sin(theta) * rEff)
    }

    const buildBellMesh = (evalFn: (u: number, v: number) => THREE.Vector3, isOuter: boolean) => {
      const geo = new THREE.BufferGeometry()
      const pos = new Float32Array((ringSegs + 1) * (radialSegs + 1) * 3)
      const normals = new Float32Array((ringSegs + 1) * (radialSegs + 1) * 3)
      const uvs = new Float32Array((ringSegs + 1) * (radialSegs + 1) * 2)
      const indices: number[] = []
      const rimPoints: number[] = []

      let pIdx = 0
      let uvIdx = 0

      for (let r = 0; r <= ringSegs; r++) {
        const v = r / ringSegs
        for (let s = 0; s <= radialSegs; s++) {
          const u = s / radialSegs
          const p = evalFn(u, v)

          pos[pIdx] = p.x
          pos[pIdx + 1] = p.y
          pos[pIdx + 2] = p.z

          uvs[uvIdx] = u
          uvs[uvIdx + 1] = v

          if (r === ringSegs && isOuter) {
            rimPoints.push(p.x, p.y, p.z)
          }

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

          indices.push(a, b, d)
          indices.push(b, c, d)
        }
      }

      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
      geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
      geo.setIndex(indices)
      geo.computeVertexNormals()

      return { geo, pos: Float32Array.from(pos), rimPoints }
    }

    const outer = buildBellMesh(evalOuter, true)
    const inner = buildBellMesh(evalInner, false)

    // Scalloped margin rim highlight line loop
    const rimGeo = new THREE.BufferGeometry()
    rimGeo.setAttribute('position', new THREE.Float32BufferAttribute(outer.rimPoints, 3))

    // -------------------------------------------------------------------------
    // 8 Prominent Arched Luminous Radial Ribs / Meridians (Signature Reference Feature)
    // Running from near the apex down along the 8 radial lobes to the margin rim.
    // Enhanced with dual-strand parallel lines for rich, prominent, glowing bands!
    // -------------------------------------------------------------------------
    const ribPairs: number[] = []
    const ribSteps = 48
    for (let ribIdx = 0; ribIdx < NUM_RADIAL_RIBS; ribIdx++) {
      const uCenter = ribIdx / NUM_RADIAL_RIBS
      const uOffsets = [-0.0022, 0, 0.0022] // Dual-strand luminous band

      for (const uOff of uOffsets) {
        const u = (uCenter + uOff + 1.0) % 1.0
        for (let s = 0; s < ribSteps; s++) {
          const v1 = 0.06 + (s / ribSteps) * 0.94
          const v2 = 0.06 + ((s + 1) / ribSteps) * 0.94
          const p1 = evalOuter(u, v1)
          const p2 = evalOuter(u, v2)
          ribPairs.push(
            p1.x * 1.004, p1.y, p1.z * 1.004,
            p2.x * 1.004, p2.y, p2.z * 1.004
          )
        }
      }
    }
    const ribsMergedGeo = new THREE.BufferGeometry()
    ribsMergedGeo.setAttribute('position', new THREE.Float32BufferAttribute(ribPairs, 3))

    // -------------------------------------------------------------------------
    // Internal Gastric Organ Core: Radiant 4-Lobed Horseshoe Gonad Pouches
    // The glowing golden-amber biological lantern at the center of the medusa
    // -------------------------------------------------------------------------
    const gonadLobes = 4
    const gonadSteps = 64
    const gonadCross = 16
    const gonadPos = new Float32Array((gonadSteps + 1) * (gonadCross + 1) * 3)
    const gonadIndices: number[] = []
    let gIdx = 0

    for (let i = 0; i <= gonadSteps; i++) {
      const u = (i / gonadSteps) * Math.PI * 2
      // 4 horseshoe lobes
      const lobeMod = Math.cos(u * gonadLobes) * 0.24 + 0.50
      const spineX = Math.cos(u) * lobeMod
      const spineZ = Math.sin(u) * lobeMod
      const spineY = 0.65 + Math.sin(u * gonadLobes) * 0.09

      const tangentX = -Math.sin(u)
      const tangentZ = Math.cos(u)

      for (let j = 0; j <= gonadCross; j++) {
        const v = (j / gonadCross) * Math.PI * 2
        const tubeRadius = 0.16 * (0.85 + Math.cos(u * gonadLobes) * 0.35)

        const px = spineX + tangentZ * Math.cos(v) * tubeRadius
        const py = spineY + Math.sin(v) * tubeRadius * 0.8
        const pz = spineZ - tangentX * Math.cos(v) * tubeRadius

        gonadPos[gIdx] = px
        gonadPos[gIdx + 1] = py
        gonadPos[gIdx + 2] = pz
        gIdx += 3
      }
    }

    for (let i = 0; i < gonadSteps; i++) {
      for (let j = 0; j < gonadCross; j++) {
        const a = i * (gonadCross + 1) + j
        const b = (i + 1) * (gonadCross + 1) + j
        const c = (i + 1) * (gonadCross + 1) + (j + 1)
        const d = i * (gonadCross + 1) + (j + 1)
        gonadIndices.push(a, b, d)
        gonadIndices.push(b, c, d)
      }
    }

    const gGeo = new THREE.BufferGeometry()
    gGeo.setAttribute('position', new THREE.BufferAttribute(gonadPos, 3))
    gGeo.setIndex(gonadIndices)
    gGeo.computeVertexNormals()

    // -------------------------------------------------------------------------
    // Bioluminescent Surface Stipples / Photophores (1,400 Glowing Specks)
    // Concentrated along the 8 radial ribs and the scalloped margin rim
    // -------------------------------------------------------------------------
    const photoCount = 1400
    const pPos = new Float32Array(photoCount * 3)
    const pCol = new Float32Array(photoCount * 3)
    const colPureWhite = new THREE.Color('#FFFFFF')
    const colChampagne = new THREE.Color('#FFE4A8')
    const colIceLavender = new THREE.Color('#E8D2FF')

    for (let p = 0; p < photoCount; p++) {
      let u: number
      // 70% of photophores grouped along the 8 radial ribs
      if (Math.random() < 0.7) {
        const rib = Math.floor(Math.random() * 8)
        u = rib / 8 + (Math.random() - 0.5) * 0.038
      } else {
        u = Math.random()
      }

      // Height distribution: spread along the bell with concentration near rim
      const v = 0.12 + Math.pow(Math.random(), 0.85) * 0.86
      const pt = evalOuter(u, v)

      pPos[p * 3] = pt.x * (0.99 + Math.random() * 0.02)
      pPos[p * 3 + 1] = pt.y
      pPos[p * 3 + 2] = pt.z * (0.99 + Math.random() * 0.02)

      const randC = Math.random()
      const c = randC > 0.45 ? colPureWhite : randC > 0.18 ? colChampagne : colIceLavender
      pCol[p * 3] = c.r
      pCol[p * 3 + 1] = c.g
      pCol[p * 3 + 2] = c.b
    }

    // -------------------------------------------------------------------------
    // 4 Voluminous Accordion-Frill Ruffled Oral Arms (Matching Reference)
    // Intricate crenulated organza folds cascading down from beneath the core
    // -------------------------------------------------------------------------
    const armsList = []
    const numArms = 4
    const armVLength = 58
    const armUCross = 14

    for (let a = 0; a < numArms; a++) {
      const armAngle = (a / numArms) * Math.PI * 2 + Math.PI * 0.25
      const armGeo = new THREE.BufferGeometry()
      const totalVerts = (armVLength + 1) * (armUCross + 1)
      const armPos = new Float32Array(totalVerts * 3)
      const armBasePos = new Float32Array(totalVerts * 3)
      const armIndices: number[] = []

      let vertIdx = 0
      for (let v = 0; v <= armVLength; v++) {
        const t = v / armVLength
        // Originates beneath the core (y = 0.55) and extends downward ~2.6 units
        const y = 0.55 - t * 2.6

        // Central organic spiral trajectory
        const spineWave = Math.sin(t * Math.PI * 2.8 + armAngle) * 0.20 * (1 - t * 0.2)
        const cx = Math.cos(armAngle) * 0.30 * (1 - t * 0.35) + Math.cos(armAngle + Math.PI * 0.5) * spineWave
        const cz = Math.sin(armAngle) * 0.30 * (1 - t * 0.35) + Math.sin(armAngle + Math.PI * 0.5) * spineWave

        // Substantial flared width in the upper and middle sections
        const ribbonWidth = 0.28 * Math.sin(t * Math.PI * 0.85 + 0.15)

        for (let u = 0; u <= armUCross; u++) {
          const w = (u / armUCross) * 2 - 1 // -1 to +1

          // Intricate multi-harmonic accordion pleats and curled cauliflower ruffles
          const accordionPleats = Math.sin(t * 36 + w * 5.8 + armAngle * 2) * 0.08 * Math.abs(w)
          const microRuffles = Math.sin(t * 62 + w * 12) * 0.038 * Math.pow(Math.abs(w), 1.4)
          const ruffFrill = accordionPleats + microRuffles
          const pleatZ = Math.cos(t * 24 + w * 4.6) * 0.06 * Math.abs(w)

          const normalX = Math.cos(armAngle + Math.PI * 0.5)
          const normalZ = Math.sin(armAngle + Math.PI * 0.5)

          const px = cx + normalX * w * ribbonWidth + normalZ * ruffFrill
          const py = y + pleatZ
          const pz = cz + normalZ * w * ribbonWidth - normalX * ruffFrill

          armPos[vertIdx] = px
          armPos[vertIdx + 1] = py
          armPos[vertIdx + 2] = pz

          armBasePos[vertIdx] = px
          armBasePos[vertIdx + 1] = py
          armBasePos[vertIdx + 2] = pz
          vertIdx += 3
        }
      }

      for (let v = 0; v < armVLength; v++) {
        for (let u = 0; u < armUCross; u++) {
          const v1 = v * (armUCross + 1) + u
          const v2 = (v + 1) * (armUCross + 1) + u
          const v3 = (v + 1) * (armUCross + 1) + (u + 1)
          const v4 = v * (armUCross + 1) + (u + 1)

          armIndices.push(v1, v2, v4)
          armIndices.push(v2, v3, v4)
        }
      }

      armGeo.setAttribute('position', new THREE.BufferAttribute(armPos, 3))
      armGeo.setIndex(armIndices)
      armGeo.computeVertexNormals()

      armsList.push({
        geometry: armGeo,
        basePositions: armBasePos,
        angle: armAngle,
      })
    }

    return {
      outerBellGeo: outer.geo,
      innerBellGeo: inner.geo,
      outerBasePositions: outer.pos,
      innerBasePositions: inner.pos,
      rimWireGeo: rimGeo,
      ribsMergedGeo,
      gastricCoreGeo: gGeo,
      photophorePositions: pPos,
      photophoreColors: pCol,
      oralArmsData: armsList,
    }
  }, [])

  // ---------------------------------------------------------------------------
  // 2. 34 Independent Marginal Tentacles Spreading in Fluid Streamlines
  // Concentric tiered distribution, varied lengths (including long streamers),
  // and hydrodynamic trailing curves opposite swimming movement
  // ---------------------------------------------------------------------------
  const tentaclesData = useMemo(() => {
    const list = []

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

      const baseAngle = (t / NUM_TENTACLES) * Math.PI * 2 + (t % 4) * 0.12

      // Tiered distribution across 3 concentric rings around the margin:
      // Inner (0.95), Mid (1.28), Outer Margin (1.50)
      let baseRadius: number
      const tier = t % 3
      if (tier === 0) {
        baseRadius = 0.95 + (t % 2) * 0.08
      } else if (tier === 1) {
        baseRadius = 1.28 + (t % 2) * 0.08
      } else {
        baseRadius = 1.50 + (t % 2) * 0.06
      }

      const speed = 1.15 + (t % 5) * 0.12
      const phase = (t / NUM_TENTACLES) * Math.PI * 4.0

      // Varied lengths: standard filaments 3.8-5.2 units, plus 6 long streamers up to 6.4 units
      const isLongStreamer = t % 5 === 0
      const length = isLongStreamer
        ? 5.8 + (t % 3) * 0.35
        : 3.8 + (t % 4) * 0.38 + (t % 3) * 0.25

      // Base width tapering gracefully to a whisper-thin 0.0015 tip
      const baseWidth = isLongStreamer ? 0.022 : 0.018 + (t % 3) * 0.003

      // Compound 3D hydrodynamic wave curls
      const curlFreq = 3.2 + (t % 3) * 0.35
      const curlAmpX = 0.30 + (t % 3) * 0.12
      const curlAmpZ = 0.25 + (t % 4) * 0.1

      // 3 material tiers: 12 metallic gold filaments, 14 glowing ivory/white, 8 translucent lavender
      const isGold = t % 3 === 1
      const isLavender = t % 3 === 2

      list.push({
        geometry: geo,
        positions,
        baseAngle,
        baseRadius,
        speed,
        phase,
        length,
        baseWidth,
        curlFreq,
        curlAmpX,
        curlAmpZ,
        isGold,
        isLavender,
      })
    }

    return list
  }, [])

  // ---------------------------------------------------------------------------
  // 3. Materials: Hyper-Realistic Crystalline Glass, Radiant Amber Core & Lace Frills
  // ---------------------------------------------------------------------------

  // Outer Crystalline Translucent Glass Umbrella Dome
  const outerBellMaterial = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFFFFF'), // Pure transparent crystal glass
      emissive: new THREE.Color('#10051C'), // Subtle abyssal violet undertone
      emissiveIntensity: 0.05,
      roughness: 0.04,
      metalness: 0.0,
      transmission: 0.90, // High glass transmission for pristine optical clarity
      thickness: 0.85,
      ior: 1.34, // Water / biological gel index
      specularIntensity: 1.2,
      specularColor: new THREE.Color('#FFFFFF'),
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide,
      depthWrite: false,
      attenuationColor: new THREE.Color('#E8D8FF'),
      attenuationDistance: 1.6,
    })

    // Custom optical Fresnel rim injection matching Image 1's crisp white rim lighting
    mat.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `
        #include <dithering_fragment>
        vec3 vDir = normalize(vViewPosition);
        float fresnelRim = pow(1.0 - max(dot(normalize(vNormal), -vDir), 0.0), 2.8);
        gl_FragColor.rgb += vec3(0.96, 0.98, 1.0) * fresnelRim * 0.88;
        `
      )
    }

    return mat
  }, [])

  // Inner Subumbrella Tissue Layer (Subtle Lavender Depth)
  const innerBellMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#D8C0F8'),
        emissive: new THREE.Color('#140624'),
        emissiveIntensity: 0.1,
        roughness: 0.14,
        metalness: 0.04,
        transmission: 0.85,
        thickness: 0.55,
        specularIntensity: 0.9,
        specularColor: new THREE.Color('#FFEBB8'),
        clearcoat: 0.85,
        transparent: true,
        opacity: 0.50,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    []
  )

  // Glowing Golden-Amber Biological Gastric Organ Core (The Radiant Lantern)
  const gastricMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#FFA825'), // Radiant warm golden amber
        emissive: new THREE.Color('#FF7200'), // Intense cadmium-gold inner luminescence
        emissiveIntensity: 2.8,
        roughness: 0.18,
        metalness: 0.06,
        transmission: 0.58,
        thickness: 0.70,
        specularColor: new THREE.Color('#FFEAA0'),
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    []
  )

  // 8 Luminous Radial Ribs / Meridians Material
  const ribMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color('#FFFFFF'), // Pure luminous white meridians matching reference
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending,
      }),
    []
  )

  // Scalloped margin rim highlight line loop
  const rimMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color('#FFE2A4'),
        transparent: true,
        opacity: 0.60,
        blending: THREE.AdditiveBlending,
      }),
    []
  )

  // Bioluminescent Photophore Stipples Material
  const photophoreMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.028,
        vertexColors: true,
        transparent: true,
        opacity: 0.82,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  )

  // Ruffled organza chiffon oral arms material (Warm Ivory / Champagne lace)
  const oralArmsMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#FFF4E0'), // Creamy champagne-ivory lace
        emissive: new THREE.Color('#462608'), // Warm golden subsurface bounce
        emissiveIntensity: 0.35,
        roughness: 0.22,
        metalness: 0.04,
        transmission: 0.78,
        thickness: 0.5,
        specularColor: new THREE.Color('#FFEAB8'),
        clearcoat: 0.9,
        transparent: true,
        opacity: 0.78,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    []
  )

  // Fine metallic champagne-gold tentacle filament material
  const goldTentacleMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#ECC87A'),
        emissive: new THREE.Color('#382008'),
        emissiveIntensity: 0.25,
        roughness: 0.12,
        metalness: 0.92,
        clearcoat: 0.9,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    []
  )

  // Luminous ivory/white tentacle filament material
  const whiteTentacleMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#FFF9EE'),
        emissive: new THREE.Color('#2A2012'),
        emissiveIntensity: 0.20,
        roughness: 0.14,
        metalness: 0.08,
        transmission: 0.85,
        thickness: 0.35,
        clearcoat: 0.85,
        transparent: true,
        opacity: 0.50,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    []
  )

  // Translucent ethereal lavender tentacle material
  const lavenderTentacleMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#CFB8F8'),
        emissive: new THREE.Color('#160628'),
        emissiveIntensity: 0.12,
        roughness: 0.16,
        metalness: 0.10,
        transmission: 0.85,
        thickness: 0.4,
        clearcoat: 0.8,
        transparent: true,
        opacity: 0.42,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    []
  )

  // ---------------------------------------------------------------------------
  // 4. Animation Loop: Organic Swimming Pulse, Traveling Drag & 3D Fluid Physics
  // ---------------------------------------------------------------------------
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const m = mouseState.current
    const sp = scrollProgress.current

    // Damped mouse interpolation
    m.x += (m.targetX - m.x) * 0.05
    m.y += (m.targetY - m.y) * 0.05

    // Query choreography targets
    const choreo = evaluateChoreography(sp)
    const jfTarget = choreo.jellyfish
    const drag = choreo.tentacleDrag

    // Organic swimming pulse cycle (asymmetric medusa contraction & expansion)
    const pulseCycle = Math.sin(time * 1.6)
    const pulseStrength = pulseCycle > 0 ? Math.pow(pulseCycle, 0.7) : -Math.pow(-pulseCycle, 1.4)
    const bellScaleRadial = 1.0 + pulseStrength * 0.065
    const bellScaleHeight = 1.0 - pulseStrength * 0.085

    // Master Jellyfish Group: Position, Rotation, Dynamic Swimming Banking
    if (masterGroupRef.current) {
      const floatY = Math.sin(time * 0.95) * 0.07
      const floatX = Math.cos(time * 0.65) * 0.03

      const targetX = jfTarget.x + floatX + m.x * 0.18
      const targetY = jfTarget.y + floatY - m.y * 0.12
      const targetZ = jfTarget.z + m.y * 0.08

      masterGroupRef.current.position.x += (targetX - masterGroupRef.current.position.x) * 0.08
      masterGroupRef.current.position.y += (targetY - masterGroupRef.current.position.y) * 0.08
      masterGroupRef.current.position.z += (targetZ - masterGroupRef.current.position.z) * 0.08

      // Damped pointer banking combined with dynamic swimming angle
      const targetRotX = jfTarget.rotX + Math.cos(time * 0.4) * 0.02 - m.y * 0.08
      const targetRotY = jfTarget.rotY + Math.sin(time * 0.35) * 0.03 + m.x * 0.12
      const targetRotZ = jfTarget.rotZ + Math.sin(time * 0.5) * 0.025 + m.x * 0.1

      masterGroupRef.current.rotation.x += (targetRotX - masterGroupRef.current.rotation.x) * 0.08
      masterGroupRef.current.rotation.y += (targetRotY - masterGroupRef.current.rotation.y) * 0.08
      masterGroupRef.current.rotation.z += (targetRotZ - masterGroupRef.current.rotation.z) * 0.08

      masterGroupRef.current.scale.setScalar(jfTarget.scale)
    }

    // Dynamic Opacity Management
    const globalOpacity = jfTarget.opacity
    outerBellMaterial.opacity = 0.88 * globalOpacity
    innerBellMaterial.opacity = 0.50 * globalOpacity
    gastricMaterial.opacity = 0.95 * globalOpacity
    photophoreMaterial.opacity = 0.82 * globalOpacity
    rimMaterial.opacity = 0.60 * globalOpacity
    ribMaterial.opacity = 0.92 * globalOpacity
    oralArmsMaterial.opacity = 0.78 * globalOpacity
    goldTentacleMaterial.opacity = 0.55 * globalOpacity
    whiteTentacleMaterial.opacity = 0.50 * globalOpacity
    lavenderTentacleMaterial.opacity = 0.42 * globalOpacity

    // Deform outer bell vertices with swimming contraction
    if (outerBellRef.current) {
      const posAttr = outerBellGeo.attributes.position as THREE.BufferAttribute
      const pos = posAttr.array as Float32Array
      const base = outerBasePositions

      for (let i = 0; i < base.length; i += 3) {
        const bx = base[i]
        const by = base[i + 1]
        const bz = base[i + 2]

        const heightRatio = THREE.MathUtils.clamp((1.48 - by) / 1.70, 0, 1)
        const radFactor = THREE.MathUtils.lerp(1.0, bellScaleRadial, heightRatio)
        const ripple = Math.sin(time * 3.2 - by * 2.8) * 0.015 * heightRatio

        pos[i] = bx * radFactor + (bx !== 0 ? (bx / Math.abs(bx)) * ripple : 0)
        pos[i + 1] = by * bellScaleHeight
        pos[i + 2] = bz * radFactor + (bz !== 0 ? (bz / Math.abs(bz)) * ripple : 0)
      }

      posAttr.needsUpdate = true
      outerBellGeo.computeVertexNormals()
    }

    // Deform inner bell vertices in sync
    if (innerBellRef.current) {
      const posAttr = innerBellGeo.attributes.position as THREE.BufferAttribute
      const pos = posAttr.array as Float32Array
      const base = innerBasePositions

      for (let i = 0; i < base.length; i += 3) {
        const bx = base[i]
        const by = base[i + 1]
        const bz = base[i + 2]

        const heightRatio = THREE.MathUtils.clamp((1.38 - by) / 1.58, 0, 1)
        const radFactor = THREE.MathUtils.lerp(1.0, bellScaleRadial, heightRatio)

        pos[i] = bx * radFactor
        pos[i + 1] = by * bellScaleHeight
        pos[i + 2] = bz * radFactor
      }

      posAttr.needsUpdate = true
      innerBellGeo.computeVertexNormals()
    }

    // Pulse gastric core slightly
    if (coreGastricRef.current) {
      const coreScale = 1.0 + pulseStrength * 0.06
      coreGastricRef.current.scale.set(coreScale, 1.0 - pulseStrength * 0.05, coreScale)
    }

    // Flutter oral arms with natural water drag
    oralArmsData.forEach((arm, armIdx) => {
      const posAttr = arm.geometry.attributes.position as THREE.BufferAttribute
      const pos = posAttr.array as Float32Array
      const base = arm.basePositions

      for (let i = 0; i < base.length; i += 3) {
        const bx = base[i]
        const by = base[i + 1]
        const bz = base[i + 2]

        const t = THREE.MathUtils.clamp((0.55 - by) / 2.6, 0, 1)
        const flutter = Math.sin(time * 2.6 - t * 4.8 + arm.angle * 1.5) * 0.08 * Math.pow(t, 1.15)
        const dragLag = -m.x * t * 0.08

        pos[i] = bx + flutter * Math.cos(arm.angle) + dragLag
        pos[i + 1] = by + Math.cos(time * 1.8 + armIdx) * 0.035 * t
        pos[i + 2] = bz + flutter * Math.sin(arm.angle)
      }

      posAttr.needsUpdate = true
      arm.geometry.computeVertexNormals()
    })

    // Internal biological illumination pulse (The radiant amber lantern glow)
    if (internalLightRef.current) {
      internalLightRef.current.intensity = (5.5 + pulseStrength * 1.0) * globalOpacity
    }
    if (internalLight2Ref.current) {
      internalLight2Ref.current.intensity = (3.2 + pulseStrength * 0.6) * globalOpacity
    }
    if (accentLightRef.current) {
      accentLightRef.current.intensity = (1.2 + pulseStrength * 0.3) * globalOpacity
    }

    // Animate Tentacles with 3D Curvature, Streamlined Trailing Flow & Hydrodynamic Inertia
    tentaclesData.forEach((tentacle) => {
      const pos = tentacle.positions
      const bAngle = tentacle.baseAngle
      const bRad = tentacle.baseRadius * bellScaleRadial

      const anchorX = Math.cos(bAngle) * bRad
      const anchorZ = Math.sin(bAngle) * bRad
      const anchorY = (Math.cos(0.92 * Math.PI * 0.54) * 1.58 - 0.1) * bellScaleHeight

      for (let s = 0; s <= TENTACLE_SEGMENTS; s++) {
        const t = s / TENTACLE_SEGMENTS
        const pT = Math.pow(t, 1.25)

        // Traveling hydrodynamic waves down each filament strand
        const waveSpeed = tentacle.speed
        const wavePhase = time * waveSpeed - t * tentacle.curlFreq + tentacle.phase

        // Organic compound 3D curve in X and Z
        const waveX = Math.sin(wavePhase) * (0.04 + pT * tentacle.curlAmpX)
        const waveZ = Math.cos(wavePhase * 0.85 + 1.1) * (0.035 + pT * tentacle.curlAmpZ)
        const waveY = Math.sin(wavePhase * 1.2 + 1.6) * 0.07 * pT

        // Natural trailing hydrodynamic drag: lag behind the swimming bell
        // Streams back along diagonal swimming angle (to the left and down)
        const streamDragX = -pT * 0.42
        const streamDragY = pT * 0.18
        const streamDragZ = -pT * 0.22

        const mouseLag = (1.0 - t) * 0.08
        const mouseDragX = m.x * pT * 0.35 * mouseLag
        const scrollDragX = drag.x * pT * 1.0
        const scrollDragY = drag.y * pT * 1.2
        const scrollDragZ = drag.z * pT * 0.95

        const flowX = anchorX + waveX + streamDragX + mouseDragX + scrollDragX
        const flowY = anchorY - t * tentacle.length + waveY + streamDragY + scrollDragY
        const flowZ = anchorZ + waveZ + streamDragZ + scrollDragZ

        // Tapered end: base width tapers to a whisper-thin thread at tip (0.0015)
        const currentWidth = tentacle.baseWidth * (1.0 - t * 0.92)
        const normX = -Math.sin(bAngle + wavePhase * 0.15) * currentWidth
        const normZ = Math.cos(bAngle + wavePhase * 0.15) * currentWidth

        const idx = s * 6
        pos[idx] = flowX - normX
        pos[idx + 1] = flowY
        pos[idx + 2] = flowZ - normZ
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
    <group ref={masterGroupRef} position={[0.48, 2.15, 0.12]} scale={0.98}>
      {/* Primary Radiant Golden-Amber Biological Core Light (Internal Lantern Glow) */}
      <pointLight
        ref={internalLightRef}
        position={[0, 0.75, 0]}
        color="#FFA225"
        intensity={5.5}
        distance={7.0}
        decay={2}
      />

      {/* Secondary Warm Golden Base Light at Oral Arm Roots */}
      <pointLight
        ref={internalLight2Ref}
        position={[0, 0.35, 0]}
        color="#FFC565"
        intensity={3.2}
        distance={5.0}
        decay={2}
      />

      {/* Gentle Violet-Lilac Accent Glow for Optical Depth */}
      <pointLight
        ref={accentLightRef}
        position={[0, 0.05, 0]}
        color="#D4AAFF"
        intensity={1.2}
        distance={4.5}
        decay={2}
      />

      {/* Outer Crystalline Translucent Glass Umbrella Bell with Optical Fresnel Highlight */}
      <mesh ref={outerBellRef} geometry={outerBellGeo} material={outerBellMaterial} />

      {/* Nested Inner Subumbrella Layer (True Optical Depth & Biological Refraction) */}
      <mesh ref={innerBellRef} geometry={innerBellGeo} material={innerBellMaterial} />

      {/* Radiant 4-Lobed Horseshoe Gastric Organ Core */}
      <mesh ref={coreGastricRef} geometry={gastricCoreGeo} material={gastricMaterial} />

      {/* 8 Prominent Arched Luminous Radial Ribs / Meridians (Signature Reference Feature) */}
      <lineSegments geometry={ribsMergedGeo} material={ribMaterial} />

      {/* Bioluminescent Surface Stipples / Photophores (1,400 Glowing Specks) */}
      <points ref={photophoresRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[photophorePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[photophoreColors, 3]}
          />
        </bufferGeometry>
        <primitive object={photophoreMaterial} attach="material" />
      </points>

      {/* Scalloped Margin Rim Highlight Line */}
      <lineLoop ref={rimLineRef} geometry={rimWireGeo} material={rimMaterial} />

      {/* 4 Voluminous Accordion-Frill Ruffled Oral Arms */}
      <group ref={oralArmsGroupRef}>
        {oralArmsData.map((arm, idx) => (
          <mesh key={idx} geometry={arm.geometry} material={oralArmsMaterial} />
        ))}
      </group>

      {/* 34 Independent Marginal Tentacles Spreading in Fluid Streamlines */}
      <group>
        {tentaclesData.map((t, idx) => (
          <mesh
            key={idx}
            geometry={t.geometry}
            material={
              t.isGold
                ? goldTentacleMaterial
                : t.isLavender
                ? lavenderTentacleMaterial
                : whiteTentacleMaterial
            }
          />
        ))}
      </group>
    </group>
  )
}
