import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Engineering Lifecycle Architectural Sculpture Builder (v2 Refined Luxury Edition)
// - Sculpted C^2 clamped cubic B-spline architectural monument with smooth,
//   wide radii of curvature and spacious depth separation across planes.
// - Monumental ~2:1 rounded-chamfered airfoil-ingot cross-section (N = 72)
//   built over Wang's Double Reflection Rotation-Minimizing Frames (RMF).
// - Unbroken champagne-gold surface terminating in silky ogive finial domes
//   with seam-averaged and apex-locked smooth normals (zero creases/stripes).
// - Six flush, ridge-integrated chronometer index inlays sculpted cleanly into
//   the architectural spine (no striped cuffs or decorative hoops).
// - Satin brushed champagne-gold PBR maps & feathered HDR softbox studio dome.
// ---------------------------------------------------------------------------

export const MILESTONE_CURVE_PARAMS = [0.115, 0.275, 0.44, 0.605, 0.76, 0.90] as const

export interface CameraPhaseTarget {
  pos: [number, number, number]
  lookAt: [number, number, number]
  sculptureYaw: number
  sculpturePitch: number
}

// Distinct 3/4 architectural gallery camera viewpoints across phases 01..06
// revealing foreground-over-background spatial overlap cleanly without clipping.
export const PHASE_CAMERA_TARGETS: readonly CameraPhaseTarget[] = [
  { pos: [-1.72, -0.28, 5.48], lookAt: [-0.14, -0.06, 0.04], sculptureYaw: 0.16, sculpturePitch: -0.05 },
  { pos: [-0.92, 0.96, 5.18], lookAt: [-0.08, 0.14, -0.06], sculptureYaw: 0.08, sculpturePitch: 0.07 },
  { pos: [0.18, 1.06, 4.92], lookAt: [0.04, 0.10, -0.14], sculptureYaw: -0.04, sculpturePitch: 0.10 },
  { pos: [1.14, -0.44, 4.96], lookAt: [0.08, -0.14, 0.06], sculptureYaw: -0.16, sculpturePitch: 0.03 },
  { pos: [1.78, 0.34, 5.18], lookAt: [0.14, 0.02, 0.08], sculptureYaw: -0.20, sculpturePitch: -0.04 },
  { pos: [0.36, 0.44, 5.52], lookAt: [0.02, 0.04, 0.0], sculptureYaw: -0.04, sculpturePitch: -0.03 },
]

// Uniform clamped cubic B-spline control points sculpted for generous turn
// radii (Rmin >= 0.93) and wide foreground/background architectural depth planes.
const ARCHITECTURAL_CONTROL_POINTS: THREE.Vector3[] = [
  new THREE.Vector3(-2.82, -0.96, 0.34),
  new THREE.Vector3(-1.98, -0.72, 0.76),
  new THREE.Vector3(-0.887, 1.112, 1.1),
  new THREE.Vector3(-0.034, 1.295, -0.13),
  new THREE.Vector3(1.02, 0.747, -0.92),
  new THREE.Vector3(0.909, -0.805, -1.048),
  new THREE.Vector3(-0.509, -1.284, -0.574),
  new THREE.Vector3(-0.864, -0.864, 0.495),
  new THREE.Vector3(-0.46, -0.011, 0.948),
  new THREE.Vector3(0.826, 0.2, 1.019),
  new THREE.Vector3(2.12, 0.48, 0.14),
  new THREE.Vector3(2.84, 1.16, -0.28),
]

export class ArchitecturalBSplineCurve extends THREE.Curve<THREE.Vector3> {
  private readonly padded: THREE.Vector3[]
  private readonly segmentCount: number

  constructor(controlPoints: THREE.Vector3[]) {
    super()
    const first = controlPoints[0]
    const last = controlPoints[controlPoints.length - 1]
    this.padded = [
      first.clone(),
      first.clone(),
      ...controlPoints.map((p) => p.clone()),
      last.clone(),
      last.clone(),
    ]
    this.segmentCount = this.padded.length - 3
  }

  getPoint(t: number, optionalTarget = new THREE.Vector3()): THREE.Vector3 {
    const clamped = THREE.MathUtils.clamp(t, 0, 1)
    const scaled = clamped * this.segmentCount
    const seg = Math.min(this.segmentCount - 1, Math.floor(scaled))
    const u = scaled - seg
    const u2 = u * u
    const u3 = u2 * u

    const b0 = Math.pow(1 - u, 3) / 6
    const b1 = (3 * u3 - 6 * u2 + 4) / 6
    const b2 = (-3 * u3 + 3 * u2 + 3 * u + 1) / 6
    const b3 = u3 / 6

    const p0 = this.padded[seg]
    const p1 = this.padded[seg + 1]
    const p2 = this.padded[seg + 2]
    const p3 = this.padded[seg + 3]

    return optionalTarget.set(
      b0 * p0.x + b1 * p1.x + b2 * p2.x + b3 * p3.x,
      b0 * p0.y + b1 * p1.y + b2 * p2.y + b3 * p3.y,
      b0 * p0.z + b1 * p1.z + b2 * p2.z + b3 * p3.z
    )
  }
}

export interface SpineSample {
  u: number
  pos: THREE.Vector3
  tangent: THREE.Vector3
  normal: THREE.Vector3
  binormal: THREE.Vector3
  halfW: number
  halfT: number
}

export interface SculptureSpineData {
  curve: ArchitecturalBSplineCurve
  samples: SpineSample[]
  sampleArcU: (arcU: number) => SpineSample
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

function evalFinialEnvelope(arcU: number): number {
  const endSpan = 0.065
  const startT = THREE.MathUtils.clamp(arcU / endSpan, 0, 1)
  const endT = THREE.MathUtils.clamp((1 - arcU) / endSpan, 0, 1)
  const edge = Math.min(startT, endT)
  if (edge >= 1) return 1
  return Math.sqrt(Math.max(0.0001, 1 - Math.pow(1 - edge, 2)))
}

// Balanced solid sculptural cross-section (~0.245 halfW by ~0.135 halfT)
// so sweeping curves maintain generous physical thickness without fold distortion.
function evalCrossSectionDims(arcU: number): { halfW: number; halfT: number } {
  const dome = evalFinialEnvelope(arcU)
  const breadthCurve =
    0.232 +
    0.040 * Math.sin(arcU * Math.PI) +
    0.015 * Math.sin(arcU * Math.PI * 2.1 - 0.35)
  const thicknessCurve =
    0.128 +
    0.022 * Math.sin(arcU * Math.PI * 1.4 + 0.25) +
    0.010 * Math.cos(arcU * Math.PI * 2.0)

  return {
    halfW: breadthCurve * dome,
    halfT: thicknessCurve * Math.pow(dome, 0.90),
  }
}

// Gentle, serene sculptural roll (~0.66*pi total) so broad brushed faces catch
// gallery light gracefully across foreground and background sweeps.
function evalSculpturalRoll(arcU: number): number {
  return 0.32 + arcU * Math.PI * 0.66 + Math.sin(arcU * Math.PI * 1.5) * 0.12
}

export function buildSculptureSpineData(sampleCount = 360): SculptureSpineData {
  const curve = new ArchitecturalBSplineCurve(ARCHITECTURAL_CONTROL_POINTS)
  curve.updateArcLengths()

  const arcUs: number[] = []
  for (let i = 0; i <= sampleCount; i++) {
    const raw = i / sampleCount
    const blended = 0.65 * raw + 0.35 * (0.5 - 0.5 * Math.cos(raw * Math.PI))
    arcUs.push(blended)
  }

  const positions: THREE.Vector3[] = []
  const tangents: THREE.Vector3[] = []
  for (let i = 0; i <= sampleCount; i++) {
    const u = arcUs[i]
    positions.push(curve.getPointAt(u))
    tangents.push(curve.getTangentAt(u).normalize())
  }

  // Wang's Double Reflection Rotation-Minimizing Frame (RMF)
  const rmfNormals: THREE.Vector3[] = []
  const rmfBinormals: THREE.Vector3[] = []

  const t0 = tangents[0]
  const refUp = new THREE.Vector3(0, 1, 0)
  const b0 = new THREE.Vector3().crossVectors(t0, refUp).normalize()
  if (b0.lengthSq() < 1e-4) b0.set(1, 0, 0)
  const n0 = new THREE.Vector3().crossVectors(b0, t0).normalize()
  rmfNormals.push(n0)
  rmfBinormals.push(b0)

  const v1 = new THREE.Vector3()
  const v2 = new THREE.Vector3()
  const rL = new THREE.Vector3()
  const tL = new THREE.Vector3()

  for (let i = 0; i < sampleCount; i++) {
    v1.subVectors(positions[i + 1], positions[i])
    const c1 = v1.lengthSq()
    if (c1 < 1e-10) {
      rmfNormals.push(rmfNormals[i].clone())
      rmfBinormals.push(rmfBinormals[i].clone())
      continue
    }

    rL.copy(rmfNormals[i]).addScaledVector(v1, (-2 / c1) * v1.dot(rmfNormals[i]))
    tL.copy(tangents[i]).addScaledVector(v1, (-2 / c1) * v1.dot(tangents[i]))

    v2.subVectors(tangents[i + 1], tL)
    const c2 = v2.lengthSq()
    const nextN =
      c2 > 1e-10
        ? rL.clone().addScaledVector(v2, (-2 / c2) * v2.dot(rL)).normalize()
        : rL.clone().normalize()

    const nextB = new THREE.Vector3().crossVectors(tangents[i + 1], nextN).normalize()
    nextN.crossVectors(nextB, tangents[i + 1]).normalize()

    rmfNormals.push(nextN)
    rmfBinormals.push(nextB)
  }

  const samples: SpineSample[] = []
  for (let i = 0; i <= sampleCount; i++) {
    const u = arcUs[i]
    const roll = evalSculpturalRoll(u)
    const cRoll = Math.cos(roll)
    const sRoll = Math.sin(roll)

    const nBase = rmfNormals[i]
    const bBase = rmfBinormals[i]

    const normal = new THREE.Vector3()
      .addScaledVector(nBase, cRoll)
      .addScaledVector(bBase, sRoll)
      .normalize()
    const binormal = new THREE.Vector3()
      .addScaledVector(bBase, cRoll)
      .addScaledVector(nBase, -sRoll)
      .normalize()

    const { halfW, halfT } = evalCrossSectionDims(u)
    samples.push({
      u,
      pos: positions[i],
      tangent: tangents[i],
      normal,
      binormal,
      halfW,
      halfT,
    })
  }

  const sampleArcU = (arcU: number): SpineSample => {
    const target = THREE.MathUtils.clamp(arcU, 0, 1)
    let lo = 0
    let hi = samples.length - 1
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1
      if (samples[mid].u <= target) lo = mid
      else hi = mid
    }
    const a = samples[lo]
    const b = samples[hi]
    const span = b.u - a.u
    const alpha = span > 1e-6 ? (target - a.u) / span : 0
    const tangent = new THREE.Vector3().lerpVectors(a.tangent, b.tangent, alpha).normalize()
    const normal = new THREE.Vector3().lerpVectors(a.normal, b.normal, alpha).normalize()
    const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize()
    normal.crossVectors(binormal, tangent).normalize()

    return {
      u: target,
      pos: new THREE.Vector3().lerpVectors(a.pos, b.pos, alpha),
      tangent,
      normal,
      binormal,
      halfW: THREE.MathUtils.lerp(a.halfW, b.halfW, alpha),
      halfT: THREE.MathUtils.lerp(a.halfT, b.halfT, alpha),
    }
  }

  return { curve, samples, sampleArcU }
}

// C^infinity smooth chamfered squircle-ingot harmonic profile:
// uniform vertex spacing around theta=0 seam, rounded beveled shoulders, zero flat-spot spikes.
function evalProfilePoint(theta: number, halfW: number, halfT: number): [number, number] {
  const c1 = Math.cos(theta)
  const s1 = Math.sin(theta)
  const c3 = Math.cos(3 * theta)
  const s3 = Math.sin(3 * theta)

  const b = 0.055
  const a = 1 + b
  const unitX = a * c1 - b * c3
  const unitY = a * s1 + b * s3

  const shoulderTaper = 1 - 0.055 * unitX
  const camber = 0.032 * (1 - unitX * unitX)

  const x = halfW * unitX
  const y = halfT * unitY * shoulderTaper + (halfW > 0.001 ? camber * halfT : 0)
  return [x, y]
}

function smoothSeamNormals(
  geo: THREE.BufferGeometry,
  ringCount: number,
  radialSegs: number,
  hasPoles: boolean,
  startDir?: THREE.Vector3,
  endDir?: THREE.Vector3
): void {
  const normalAttr = geo.getAttribute('normal') as THREE.BufferAttribute
  const stride = radialSegs + 1
  const n0 = new THREE.Vector3()
  const nR = new THREE.Vector3()

  for (let i = 0; i < ringCount; i++) {
    const idx0 = i * stride
    const idxR = idx0 + radialSegs
    n0.fromBufferAttribute(normalAttr, idx0)
    nR.fromBufferAttribute(normalAttr, idxR)
    n0.add(nR).normalize()
    normalAttr.setXYZ(idx0, n0.x, n0.y, n0.z)
    normalAttr.setXYZ(idxR, n0.x, n0.y, n0.z)
  }

  if (hasPoles && startDir && endDir) {
    const startPoleIdx = ringCount * stride
    const endPoleIdx = startPoleIdx + 1
    normalAttr.setXYZ(startPoleIdx, -startDir.x, -startDir.y, -startDir.z)
    normalAttr.setXYZ(endPoleIdx, endDir.x, endDir.y, endDir.z)
  }

  normalAttr.needsUpdate = true
}

export function buildContinuousSculptureGeometry(
  spine: SculptureSpineData,
  radialSegs = 72
): THREE.BufferGeometry {
  const { samples } = spine
  const ringSamples = samples.slice(1, samples.length - 1)
  const ringCount = ringSamples.length
  const stride = radialSegs + 1

  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  for (let i = 0; i < ringCount; i++) {
    const smp = ringSamples[i]
    for (let j = 0; j <= radialSegs; j++) {
      const v = j / radialSegs
      const theta = v * Math.PI * 2
      const [lx, ly] = evalProfilePoint(theta, smp.halfW, smp.halfT)
      positions.push(
        smp.pos.x + smp.binormal.x * lx + smp.normal.x * ly,
        smp.pos.y + smp.binormal.y * lx + smp.normal.y * ly,
        smp.pos.z + smp.binormal.z * lx + smp.normal.z * ly
      )
      uvs.push(smp.u, v)
    }
  }

  const firstS = samples[0]
  const lastS = samples[samples.length - 1]
  const startPoleIndex = ringCount * stride
  positions.push(firstS.pos.x, firstS.pos.y, firstS.pos.z)
  uvs.push(0, 0.5)

  const endPoleIndex = startPoleIndex + 1
  positions.push(lastS.pos.x, lastS.pos.y, lastS.pos.z)
  uvs.push(1, 0.5)

  for (let j = 0; j < radialSegs; j++) {
    indices.push(startPoleIndex, j + 1, j)
  }

  for (let i = 0; i < ringCount - 1; i++) {
    const rowA = i * stride
    const rowB = (i + 1) * stride
    for (let j = 0; j < radialSegs; j++) {
      const a = rowA + j
      const b = rowB + j
      const c = rowB + j + 1
      const d = rowA + j + 1
      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  const lastRow = (ringCount - 1) * stride
  for (let j = 0; j < radialSegs; j++) {
    indices.push(lastRow + j, lastRow + j + 1, endPoleIndex)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  smoothSeamNormals(geo, ringCount, radialSegs, true, firstS.tangent, lastS.tangent)
  geo.computeBoundingBox()
  geo.computeBoundingSphere()

  return geo
}

// Subtle, razor-refined flush milestone sleeve/index (feather-tapered edges so
// the continuous sculpture NEVER looks chopped up or heavily striped).
export function buildSubtleMilestoneInlayGeometry(
  spine: SculptureSpineData,
  centerU: number,
  halfSpan: number,
  scaleBump: number,
  radialSegs = 72,
  longitudinalSteps = 16
): THREE.BufferGeometry {
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  const stride = radialSegs + 1

  for (let i = 0; i <= longitudinalSteps; i++) {
    const s = i / longitudinalSteps
    const u = THREE.MathUtils.clamp(centerU + (s * 2 - 1) * halfSpan, 0.02, 0.98)
    const smp = spine.sampleArcU(u)

    const edgeBevel = Math.min(smoothstep(0, 0.30, s), smoothstep(1, 0.70, s))
    const scaleFactor = 0.990 + (0.010 + scaleBump) * edgeBevel

    for (let j = 0; j <= radialSegs; j++) {
      const v = j / radialSegs
      const theta = v * Math.PI * 2
      const [lx, ly] = evalProfilePoint(
        theta,
        smp.halfW * scaleFactor,
        smp.halfT * (scaleFactor + 0.004)
      )
      positions.push(
        smp.pos.x + smp.binormal.x * lx + smp.normal.x * ly,
        smp.pos.y + smp.binormal.y * lx + smp.normal.y * ly,
        smp.pos.z + smp.binormal.z * lx + smp.normal.z * ly
      )
      uvs.push(s, v)
    }
  }

  for (let i = 0; i < longitudinalSteps; i++) {
    const rowA = i * stride
    const rowB = (i + 1) * stride
    for (let j = 0; j < radialSegs; j++) {
      const a = rowA + j
      const b = rowB + j
      const c = rowB + j + 1
      const d = rowA + j + 1
      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  smoothSeamNormals(geo, longitudinalSteps + 1, radialSegs, false)
  return geo
}

// ---------------------------------------------------------------------------
// Ultra-Fine Satin Brushed Champagne-Gold Micro-Finish Maps
// ---------------------------------------------------------------------------
export interface BrushedMetalTextureSet {
  albedoMap: THREE.CanvasTexture
  roughnessMap: THREE.CanvasTexture
  bumpMap: THREE.CanvasTexture
  dispose: () => void
}

export function createBrushedGoldTextureSet(): BrushedMetalTextureSet {
  const width = 512
  const height = 256

  let seed = 81493
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }

  const makeCanvas = () => {
    const c = document.createElement('canvas')
    c.width = width
    c.height = height
    return c
  }

  // 1. Subtle neutral-warm champagne grain modulation (avoids saturated orange/yellow)
  const albC = makeCanvas()
  const albCtx = albC.getContext('2d')!
  albCtx.fillStyle = '#EFE6D5'
  albCtx.fillRect(0, 0, width, height)
  for (let i = 0; i < 650; i++) {
    const y = rand() * height
    const x = rand() * width
    const segW = 60 + rand() * 200
    const bright = rand() > 0.48
    albCtx.fillStyle = bright ? 'rgba(255,250,240,0.028)' : 'rgba(176,148,104,0.026)'
    albCtx.fillRect(x, y, segW, 2)
    if (x + segW > width) albCtx.fillRect(x - width, y, segW, 2)
  }

  // 2. Soft bilinear-friendly satin roughness modulation (eliminates grazing-angle aliasing)
  const rghC = makeCanvas()
  const rghCtx = rghC.getContext('2d')!
  rghCtx.fillStyle = 'rgb(234,234,234)'
  rghCtx.fillRect(0, 0, width, height)
  for (let i = 0; i < 650; i++) {
    const y = rand() * height
    const x = rand() * width
    const segW = 70 + rand() * 220
    const alpha = 0.04 + rand() * 0.05
    const bright = rand() > 0.5
    rghCtx.fillStyle = bright ? `rgba(252,252,252,${alpha})` : `rgba(210,210,210,${alpha})`
    rghCtx.fillRect(x, y, segW, 2)
    if (x + segW > width) rghCtx.fillRect(x - width, y, segW, 2)
  }

  // 3. Soft feathered machined micro-hairline bump (smooth gradients prevent specular staircase ripples)
  const bmpC = makeCanvas()
  const bmpCtx = bmpC.getContext('2d')!
  bmpCtx.fillStyle = 'rgb(128,128,128)'
  bmpCtx.fillRect(0, 0, width, height)
  for (let i = 0; i < 700; i++) {
    const y = rand() * height
    const x = rand() * width
    const segW = 60 + rand() * 190
    const bright = rand() > 0.5
    bmpCtx.fillStyle = bright ? 'rgba(142,142,142,0.08)' : 'rgba(114,114,114,0.08)'
    bmpCtx.fillRect(x, y, segW, 2)
    if (x + segW > width) bmpCtx.fillRect(x - width, y, segW, 2)
  }

  const configure = (c: HTMLCanvasElement, srgb: boolean) => {
    const tex = new THREE.CanvasTexture(c)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    // Integer wrap count along v (circumference) ensures zero UV discontinuity seam at theta=0
    tex.repeat.set(6, 2)
    tex.anisotropy = 8
    if (srgb) tex.colorSpace = THREE.SRGBColorSpace
    tex.needsUpdate = true
    return tex
  }

  const albedoMap = configure(albC, true)
  const roughnessMap = configure(rghC, false)
  const bumpMap = configure(bmpC, false)

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

// ---------------------------------------------------------------------------
// Calibrated Studio Reflection Environment via PMREMGenerator
// - Controlled softboxes eliminate harsh clipped white spots.
// - Rich warm antique-bronze gallery walls prevent pure black metallic faces.
// ---------------------------------------------------------------------------
function createSoftboxPanelTexture(
  centerColor: string,
  midColor: string,
  edgeColor: string
): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 128
  c.height = 128
  const ctx = c.getContext('2d')!
  const grad = ctx.createRadialGradient(64, 64, 8, 64, 64, 64)
  grad.addColorStop(0, centerColor)
  grad.addColorStop(0.55, midColor)
  grad.addColorStop(1, edgeColor)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 128, 128)
  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return tex
}

export function createLuxuryGalleryEnvironment(gl: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(gl)
  pmrem.compileEquirectangularShader()

  const studioScene = new THREE.Scene()
  studioScene.background = new THREE.Color(0.30, 0.24, 0.17)

  const disposables: { dispose: () => void }[] = []

  const addReflector = (
    pos: [number, number, number],
    size: [number, number],
    hdrRGB: [number, number, number],
    innerHex: string,
    midHex: string,
    outerHex: string
  ) => {
    const map = createSoftboxPanelTexture(innerHex, midHex, outerHex)
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(hdrRGB[0], hdrRGB[1], hdrRGB[2]),
      map,
      side: THREE.DoubleSide,
    })
    const geo = new THREE.PlaneGeometry(size[0], size[1])
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(pos[0], pos[1], pos[2])
    mesh.lookAt(0, 0, 0)
    studioScene.add(mesh)
    disposables.push(map, mat, geo)
  }

  // Broad feathered warm champagne overhead tent light (soft smooth gradients, zero glare blowout)
  addReflector([1.2, 11, 5.5], [30, 18], [1.46, 1.32, 1.06], '#FFF8EB', '#DEC79D', '#52402A')

  // Neutral-cool architectural fill card on left (delivers champagne refinement vs pure yellow)
  addReflector([-12, 3, 6], [22, 18], [1.18, 1.16, 1.14], '#FFFFFF', '#CFCBC3', '#4B3E2D')

  // Warm antique-gold edge reflector on right
  addReflector([12, 2.5, 4.5], [20, 18], [1.38, 1.15, 0.80], '#FFF2D6', '#CBA466', '#463623')

  // Soft back champagne rim separation card
  addReflector([0, 4, -12], [26, 14], [1.28, 1.10, 0.78], '#FFEFCE', '#BA9458', '#3B2D1E')

  // Warm bronze under-floor bounce (wraps shadow bellies in refined antique bronze)
  addReflector([0, -11, 2], [30, 24], [0.74, 0.57, 0.37], '#F2D29B', '#9E7B4D', '#423220')

  // Subtle ambient warm front fill card (gives soft gradient across front-facing bevels without hard lines)
  addReflector([0, -1.5, 13], [24, 16], [0.56, 0.45, 0.32], '#E8CFA2', '#8B6D44', '#382B1C')

  const rt = pmrem.fromScene(studioScene, 0.042)
  pmrem.dispose()
  for (const item of disposables) {
    item.dispose()
  }

  return rt.texture
}

export interface ProgressionUniforms {
  uActiveU: { value: number }
}

export function attachProgressionShader(
  material: THREE.MeshPhysicalMaterial,
  uniforms: ProgressionUniforms
): void {
  material.customProgramCacheKey = () => 'quister_arch_progression_v2'
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uActiveU = uniforms.uActiveU

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
varying float vSculptProgressU;`
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
vSculptProgressU = uv.x;`
      )

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
uniform float uActiveU;
varying float vSculptProgressU;`
      )
      .replace(
        '#include <map_fragment>',
        `#include <map_fragment>
float actDist = vSculptProgressU - uActiveU;
float actPulse = exp(-(actDist * actDist) / (2.0 * 0.095 * 0.095));
float passedMask = 1.0 - smoothstep(uActiveU - 0.04, uActiveU + 0.09, vSculptProgressU);
vec3 antiqueBrassTint = vec3(0.84, 0.75, 0.62);
vec3 activeChampagneTint = vec3(1.07, 1.04, 0.98);
diffuseColor.rgb *= mix(antiqueBrassTint, vec3(1.0), passedMask);
diffuseColor.rgb *= mix(vec3(1.0), activeChampagneTint, actPulse * 0.45);`
      )
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
float rActDist = vSculptProgressU - uActiveU;
float rPulse = exp(-(rActDist * rActDist) / (2.0 * 0.095 * 0.095));
roughnessFactor *= mix(1.0, 0.78, rPulse);`
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
float eActDist = vSculptProgressU - uActiveU;
float ePulse = exp(-(eActDist * eActDist) / (2.0 * 0.08 * 0.08));
totalEmissiveRadiance += vec3(0.14, 0.11, 0.058) * ePulse;`
      )
  }
}
