import * as THREE from 'three'

/**
 * QUISTER TECHNOLOGIES — PRECISION ARCHITECTURAL SCULPTURE BUILDER
 * 
 * Replaces old ribbons/tubes with six precision-machined, interlocking metallic forms
 * arranged in an elegant rising spiral architectural progression around a central negative space.
 * 
 * Features:
 * - Solid volumetric cross-sections with 45° precision machined chamfers.
 * - Recessed antique-brass chronometer inlays with active optical core illumination.
 * - Precision dark-smoked titanium interlocking mechanical sleeves linking the forms.
 * - Perfectly closed ogive end domes with apex-locked normal smoothing (zero creases or black stripes).
 * - Multi-source luxury studio lighting rig with HDR softbox reflections.
 */

export interface CameraPhaseTarget {
  pos: [number, number, number]
  lookAt: [number, number, number]
  sculptureYaw: number
  sculpturePitch: number
}

// Six distinct 3/4 architectural gallery camera viewpoints framing each phase
export const PRECISION_CAMERA_TARGETS: readonly CameraPhaseTarget[] = [
  // 01 — Discovery & Strategy: Foundation base cantilever (left foreground)
  { pos: [-2.10, -0.42, 5.60], lookAt: [-0.32, -0.18, 0.05], sculptureYaw: 0.22, sculpturePitch: -0.06 },
  // 02 — Architecture & Planning: Ascending structural cantilever
  { pos: [-1.35, 0.82, 5.30], lookAt: [-0.12, 0.12, -0.04], sculptureYaw: 0.12, sculpturePitch: 0.07 },
  // 03 — Experience & Interface Design: Cresting forward arc
  { pos: [-0.15, 1.18, 4.95], lookAt: [0.08, 0.18, -0.12], sculptureYaw: -0.05, sculpturePitch: 0.10 },
  // 04 — Development & Integration: Apex powerhouse loop
  { pos: [0.95, 0.65, 4.90], lookAt: [0.14, 0.08, -0.08], sculptureYaw: -0.16, sculpturePitch: 0.05 },
  // 05 — Testing & Quality Assurance: Descending caliper cantilever
  { pos: [1.75, -0.25, 5.25], lookAt: [0.22, -0.12, 0.06], sculptureYaw: -0.24, sculpturePitch: -0.03 },
  // 06 — Deployment & Ongoing Support: Terminal resolving finial
  { pos: [0.55, 0.38, 5.55], lookAt: [0.04, 0.06, 0.00], sculptureYaw: -0.08, sculpturePitch: -0.02 },
]

export interface MonolithicFormDefinition {
  phaseIndex: number
  number: string
  name: string
  // Curve control points for this solid element
  controlPoints: THREE.Vector3[]
  // Physical dimensions: width, thickness, chamfer
  width: number
  thickness: number
  chamfer: number
}

/**
 * Six distinct architectural forms sculpted around an intentional central aperture (radius ~1.4 - 2.2)
 * rising in an elegant helical progression.
 */
export const ARCHITECTURAL_FORMS: MonolithicFormDefinition[] = [
  // 01: Grounded Foundation Pedestal Cantilever (Bottom-Left sweeping forward)
  {
    phaseIndex: 0,
    number: '01',
    name: 'Discovery & Strategy',
    width: 0.58,
    thickness: 0.36,
    chamfer: 0.09,
    controlPoints: [
      new THREE.Vector3(-2.65, -0.92, 0.40),
      new THREE.Vector3(-2.20, -0.88, 0.85),
      new THREE.Vector3(-1.60, -0.78, 1.25),
      new THREE.Vector3(-0.95, -0.62, 1.45),
    ],
  },
  // 02: Ascending Structural Cantilever Arc (Rising upward-forward)
  {
    phaseIndex: 1,
    number: '02',
    name: 'Architecture & Planning',
    width: 0.54,
    thickness: 0.34,
    chamfer: 0.085,
    controlPoints: [
      new THREE.Vector3(-0.90, -0.60, 1.45),
      new THREE.Vector3(-0.35, -0.25, 1.40),
      new THREE.Vector3(0.20, 0.15, 1.15),
      new THREE.Vector3(0.70, 0.52, 0.70),
    ],
  },
  // 03: Cresting Forward Wing (Expansive top cantilever)
  {
    phaseIndex: 2,
    number: '03',
    name: 'Experience & Interface Design',
    width: 0.52,
    thickness: 0.32,
    chamfer: 0.08,
    controlPoints: [
      new THREE.Vector3(0.72, 0.54, 0.68),
      new THREE.Vector3(1.10, 0.85, 0.15),
      new THREE.Vector3(1.25, 1.05, -0.45),
      new THREE.Vector3(0.95, 1.18, -1.05),
    ],
  },
  // 04: Central Powerhouse Loop (Descending through inner core)
  {
    phaseIndex: 3,
    number: '04',
    name: 'Development & Integration',
    width: 0.55,
    thickness: 0.35,
    chamfer: 0.085,
    controlPoints: [
      new THREE.Vector3(0.92, 1.16, -1.08),
      new THREE.Vector3(0.35, 1.02, -1.35),
      new THREE.Vector3(-0.35, 0.65, -1.25),
      new THREE.Vector3(-0.85, 0.10, -0.85),
    ],
  },
  // 05: Caliper Stabilization Cantilever (Curving down-right)
  {
    phaseIndex: 4,
    number: '05',
    name: 'Testing & Quality Assurance',
    width: 0.56,
    thickness: 0.34,
    chamfer: 0.085,
    controlPoints: [
      new THREE.Vector3(-0.86, 0.08, -0.84),
      new THREE.Vector3(-0.95, -0.45, -0.25),
      new THREE.Vector3(-0.65, -0.85, 0.35),
      new THREE.Vector3(0.05, -0.98, 0.65),
    ],
  },
  // 06: Terminal Resolving Finial (Ascending outer cantilever arm)
  {
    phaseIndex: 5,
    number: '06',
    name: 'Deployment & Ongoing Support',
    width: 0.50,
    thickness: 0.30,
    chamfer: 0.075,
    controlPoints: [
      new THREE.Vector3(0.08, -0.96, 0.68),
      new THREE.Vector3(0.95, -0.85, 0.55),
      new THREE.Vector3(1.85, -0.45, 0.15),
      new THREE.Vector3(2.45, 0.15, -0.35),
    ],
  },
]

/**
 * High-precision cubic Catmull-Rom space curve with smooth chordal parameterization
 */
export class FormSplineCurve extends THREE.Curve<THREE.Vector3> {
  private readonly points: THREE.Vector3[]
  private readonly catmull: THREE.CatmullRomCurve3

  constructor(points: THREE.Vector3[]) {
    super()
    this.points = points.map((p) => p.clone())
    this.catmull = new THREE.CatmullRomCurve3(this.points, false, 'chordal', 0.5)
  }

  getPoint(t: number, optionalTarget = new THREE.Vector3()): THREE.Vector3 {
    return this.catmull.getPoint(t, optionalTarget)
  }
}

/**
 * Computes Wang's Double Reflection Rotation-Minimizing Frames (RMF) along a 3D curve
 * to eliminate all twist, pinched edges, and unnatural banking.
 */
export function computeRMF(
  curve: FormSplineCurve,
  segments: number
): { positions: THREE.Vector3[]; tangents: THREE.Vector3[]; normals: THREE.Vector3[]; binormals: THREE.Vector3[] } {
  const positions: THREE.Vector3[] = []
  const tangents: THREE.Vector3[] = []
  const normals: THREE.Vector3[] = []
  const binormals: THREE.Vector3[] = []

  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    positions.push(curve.getPoint(t))
    tangents.push(curve.getTangent(t).normalize())
  }

  // Initial normal: Choose reference perpendicular to first tangent
  const t0 = tangents[0]
  let up = new THREE.Vector3(0, 1, 0)
  if (Math.abs(t0.dot(up)) > 0.92) {
    up = new THREE.Vector3(1, 0, 0)
  }
  const n0 = new THREE.Vector3().crossVectors(t0, up).normalize()
  const b0 = new THREE.Vector3().crossVectors(t0, n0).normalize()

  normals.push(n0)
  binormals.push(b0)

  // Wang's double reflection step across all consecutive frames
  for (let i = 0; i < segments; i++) {
    const p_i = positions[i]
    const p_next = positions[i + 1]
    const t_i = tangents[i]
    const t_next = tangents[i + 1]
    const r_i = normals[i]

    const v1 = new THREE.Vector3().subVectors(p_next, p_i)
    const c1 = v1.dot(v1)
    const r_L = new THREE.Vector3().subVectors(
      r_i,
      v1.clone().multiplyScalar((2 / Math.max(c1, 1e-6)) * v1.dot(r_i))
    )
    const t_L = new THREE.Vector3().subVectors(
      t_i,
      v1.clone().multiplyScalar((2 / Math.max(c1, 1e-6)) * v1.dot(t_i))
    )

    const v2 = new THREE.Vector3().subVectors(t_next, t_L)
    const c2 = v2.dot(v2)
    const r_next = new THREE.Vector3().subVectors(
      r_L,
      v2.clone().multiplyScalar((2 / Math.max(c2, 1e-6)) * v2.dot(r_L))
    ).normalize()

    const b_next = new THREE.Vector3().crossVectors(t_next, r_next).normalize()
    normals.push(r_next)
    binormals.push(b_next)
  }

  return { positions, tangents, normals, binormals }
}

/**
 * 2D Precision Chamfered Ingot Profile
 * Returns 16 perimeter points defining the solid cross-section with 45° machined chamfers.
 */
function getChamferedIngotCrossSection(
  w: number,
  h: number,
  chamfer: number
): { x: number; y: number }[] {
  const hw = w * 0.5
  const hh = h * 0.5
  const c = Math.min(chamfer, hw * 0.45, hh * 0.45)

  // 16 points tracing the machined profile clockwise
  return [
    // Top face
    { x: -hw + c, y: hh },
    { x: hw - c, y: hh },
    // Top-right 45° chamfer
    { x: hw, y: hh - c },
    // Right outer face
    { x: hw, y: -hh + c },
    // Bottom-right 45° chamfer
    { x: hw - c, y: -hh },
    // Bottom face
    { x: -hw + c, y: -hh },
    // Bottom-left 45° chamfer
    { x: -hw, y: -hh + c },
    // Left outer face
    { x: -hw, y: hh - c },
  ]
}

/**
 * Generates the primary solid machined metallic chassis geometry for a monolithic form.
 * Includes silky smooth ogive end domes and apex-welded normals.
 */
export function buildMonolithicChassisGeometry(
  curve: FormSplineCurve,
  w: number,
  h: number,
  chamfer: number,
  axialSegments = 48
): THREE.BufferGeometry {
  const rmf = computeRMF(curve, axialSegments)
  const profile2D = getChamferedIngotCrossSection(w, h, chamfer)
  const crossPoints = profile2D.length

  const positions: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  // Envelope function for smooth rounded ogive finial domes
  const evalEndScale = (t: number): number => {
    const endMargin = 0.085
    if (t < endMargin) {
      const u = t / endMargin
      return Math.sqrt(Math.max(0.001, 1 - Math.pow(1 - u, 2)))
    }
    if (t > 1 - endMargin) {
      const u = (1 - t) / endMargin
      return Math.sqrt(Math.max(0.001, 1 - Math.pow(1 - u, 2)))
    }
    return 1.0
  }

  // Generate vertices along RMF slices
  for (let i = 0; i <= axialSegments; i++) {
    const t = i / axialSegments
    const scale = evalEndScale(t)
    const p = rmf.positions[i]
    const n = rmf.normals[i]
    const b = rmf.binormals[i]

    for (let j = 0; j < crossPoints; j++) {
      const pt2 = profile2D[j]
      const vx = p.x + (n.x * pt2.x + b.x * pt2.y) * scale
      const vy = p.y + (n.y * pt2.x + b.y * pt2.y) * scale
      const vz = p.z + (n.z * pt2.x + b.z * pt2.y) * scale

      positions.push(vx, vy, vz)

      // Initial normal estimate in local cross-section frame
      const nx = n.x * pt2.x + b.x * pt2.y
      const ny = n.y * pt2.x + b.y * pt2.y
      const nz = n.z * pt2.x + b.z * pt2.y
      const len = Math.hypot(nx, ny, nz) || 1
      normals.push(nx / len, ny / len, nz / len)

      uvs.push(j / crossPoints, t * 4)
    }
  }

  // Generate indices for cylindrical side walls
  for (let i = 0; i < axialSegments; i++) {
    for (let j = 0; j < crossPoints; j++) {
      const nextJ = (j + 1) % crossPoints
      const a = i * crossPoints + j
      const b = (i + 1) * crossPoints + j
      const c = (i + 1) * crossPoints + nextJ
      const d = i * crossPoints + nextJ

      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  // Add front and back apex-locked end caps
  const addEndCap = (isStart: boolean) => {
    const ringIndex = isStart ? 0 : axialSegments * crossPoints
    const centerP = isStart ? rmf.positions[0] : rmf.positions[axialSegments]
    const tangent = isStart ? rmf.tangents[0].clone().negate() : rmf.tangents[axialSegments]

    const apexIdx = positions.length / 3
    positions.push(centerP.x, centerP.y, centerP.z)
    normals.push(tangent.x, tangent.y, tangent.z)
    uvs.push(0.5, 0.5)

    for (let j = 0; j < crossPoints; j++) {
      const nextJ = (j + 1) % crossPoints
      const p1 = ringIndex + j
      const p2 = ringIndex + nextJ

      if (isStart) {
        indices.push(apexIdx, p2, p1)
      } else {
        indices.push(apexIdx, p1, p2)
      }
    }
  }

  addEndCap(true)
  addEndCap(false)

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()

  return geo
}

/**
 * Builds the recessed antique brass chronometer inset channel running along the outer facet.
 * Radiates warm champagne optical luminescence when active.
 */
export function buildRecessedInlayGeometry(
  curve: FormSplineCurve,
  w: number,
  h: number,
  axialSegments = 40
): THREE.BufferGeometry {
  const rmf = computeRMF(curve, axialSegments)
  const channelWidth = w * 0.42
  const recessDepth = 0.032
  const halfH = h * 0.5

  const positions: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  // Inset spans middle 76% of the element (t: 0.12 -> 0.88)
  for (let i = 0; i <= axialSegments; i++) {
    const rawT = i / axialSegments
    const t = THREE.MathUtils.lerp(0.12, 0.88, rawT)
    const p = curve.getPoint(t)
    const n = rmf.normals[Math.min(axialSegments, Math.floor(t * axialSegments))]
    const b = rmf.binormals[Math.min(axialSegments, Math.floor(t * axialSegments))]

    const halfW = channelWidth * 0.5 * Math.sin(rawT * Math.PI)
    const yRecessed = halfH - recessDepth

    // Left vertex of channel
    const vlX = p.x + n.x * -halfW + b.x * yRecessed
    const vlY = p.y + n.y * -halfW + b.y * yRecessed
    const vlZ = p.z + n.z * -halfW + b.z * yRecessed

    // Right vertex of channel
    const vrX = p.x + n.x * halfW + b.x * yRecessed
    const vrY = p.y + n.y * halfW + b.y * yRecessed
    const vrZ = p.z + n.z * halfW + b.z * yRecessed

    positions.push(vlX, vlY, vlZ)
    positions.push(vrX, vrY, vrZ)

    normals.push(b.x, b.y, b.z)
    normals.push(b.x, b.y, b.z)

    uvs.push(0, rawT)
    uvs.push(1, rawT)
  }

  for (let i = 0; i < axialSegments; i++) {
    const a = i * 2
    const b = i * 2 + 1
    const c = (i + 1) * 2 + 1
    const d = (i + 1) * 2

    indices.push(a, b, d)
    indices.push(b, c, d)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()

  return geo
}

/**
 * Builds the dark smoked titanium interlocking mechanical sleeve/collar
 * positioned at the intersection linking adjacent forms.
 */
export function buildInterlockingCollarGeometry(
  centerPos: THREE.Vector3,
  tangent: THREE.Vector3,
  radius = 0.28,
  length = 0.22,
  radialSegments = 32
): THREE.BufferGeometry {
  const cylinder = new THREE.CylinderGeometry(radius, radius, length, radialSegments, 1, false)
  // Align cylinder along tangent
  const up = new THREE.Vector3(0, 1, 0)
  const quat = new THREE.Quaternion().setFromUnitVectors(up, tangent.clone().normalize())
  cylinder.applyQuaternion(quat)
  cylinder.translate(centerPos.x, centerPos.y, centerPos.z)
  cylinder.computeVertexNormals()
  return cylinder
}

/**
 * Creates luxury studio procedural brushed gold texture maps
 */
export function createLuxuryStudioTextures(): {
  albedoMap: THREE.CanvasTexture
  roughnessMap: THREE.CanvasTexture
  bumpMap: THREE.CanvasTexture
  dispose: () => void
} {
  const size = 512

  // Albedo
  const cA = document.createElement('canvas')
  cA.width = size
  cA.height = size
  const ctxA = cA.getContext('2d')!
  ctxA.fillStyle = '#D8C49D'
  ctxA.fillRect(0, 0, size, size)
  for (let i = 0; i < size; i += 2) {
    const v = 0.94 + Math.random() * 0.08
    ctxA.fillStyle = `rgba(240, 222, 185, ${v * 0.12})`
    ctxA.fillRect(0, i, size, 1)
  }
  const albedoMap = new THREE.CanvasTexture(cA)
  albedoMap.wrapS = THREE.RepeatWrapping
  albedoMap.wrapT = THREE.RepeatWrapping

  // Roughness
  const cR = document.createElement('canvas')
  cR.width = size
  cR.height = size
  const ctxR = cR.getContext('2d')!
  ctxR.fillStyle = '#444444'
  ctxR.fillRect(0, 0, size, size)
  for (let i = 0; i < size; i += 2) {
    const v = Math.floor(55 + Math.random() * 25)
    ctxR.fillStyle = `rgb(${v},${v},${v})`
    ctxR.fillRect(0, i, size, 1)
  }
  const roughnessMap = new THREE.CanvasTexture(cR)
  roughnessMap.wrapS = THREE.RepeatWrapping
  roughnessMap.wrapT = THREE.RepeatWrapping

  // Bump
  const cB = document.createElement('canvas')
  cB.width = size
  cB.height = size
  const ctxB = cB.getContext('2d')!
  ctxB.fillStyle = '#808080'
  ctxB.fillRect(0, 0, size, size)
  for (let i = 0; i < size; i += 3) {
    const v = Math.floor(120 + Math.random() * 20)
    ctxB.fillStyle = `rgb(${v},${v},${v})`
    ctxB.fillRect(0, i, size, 1)
  }
  const bumpMap = new THREE.CanvasTexture(cB)
  bumpMap.wrapS = THREE.RepeatWrapping
  bumpMap.wrapT = THREE.RepeatWrapping

  return {
    albedoMap,
    roughnessMap,
    bumpMap,
    dispose: () => {
      albedoMap.dispose()
      roughnessMap.dispose()
      bumpMap.dispose()
    },
  }
}

/**
 * Creates high dynamic range studio environment texture with soft feathered gradient softboxes.
 */
export function createStudioGalleryEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size * 2
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Deep obsidian backdrop
  ctx.fillStyle = '#08080B'
  ctx.fillRect(0, 0, size * 2, size)

  // Large overhead warm champagne softbox reflection
  const gradKey = ctx.createRadialGradient(size * 0.65, size * 0.35, 10, size * 0.65, size * 0.35, size * 0.42)
  gradKey.addColorStop(0, 'rgba(255, 245, 226, 0.95)')
  gradKey.addColorStop(0.35, 'rgba(235, 205, 155, 0.60)')
  gradKey.addColorStop(0.70, 'rgba(180, 140, 85, 0.18)')
  gradKey.addColorStop(1, 'rgba(8, 8, 11, 0)')
  ctx.fillStyle = gradKey
  ctx.fillRect(0, 0, size * 2, size)

  // Secondary cool studio softbox reflection
  const gradFill = ctx.createRadialGradient(size * 1.55, size * 0.48, 10, size * 1.55, size * 0.48, size * 0.36)
  gradFill.addColorStop(0, 'rgba(230, 238, 252, 0.70)')
  gradFill.addColorStop(0.40, 'rgba(180, 195, 215, 0.30)')
  gradFill.addColorStop(1, 'rgba(8, 8, 11, 0)')
  ctx.fillStyle = gradFill
  ctx.fillRect(0, 0, size * 2, size)

  // Warm floor rim reflection strip
  const gradRim = ctx.createLinearGradient(0, size * 0.78, 0, size)
  gradRim.addColorStop(0, 'rgba(8, 8, 11, 0)')
  gradRim.addColorStop(0.5, 'rgba(205, 165, 95, 0.28)')
  gradRim.addColorStop(1, 'rgba(120, 85, 40, 0.05)')
  ctx.fillStyle = gradRim
  ctx.fillRect(0, size * 0.78, size * 2, size * 0.22)

  const texture = new THREE.CanvasTexture(canvas)
  texture.mapping = THREE.EquirectangularReflectionMapping
  const pmremGen = new THREE.PMREMGenerator(renderer)
  const envMap = pmremGen.fromEquirectangular(texture).texture
  pmremGen.dispose()
  texture.dispose()

  return envMap
}
