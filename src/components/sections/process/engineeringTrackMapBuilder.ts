import * as THREE from 'three'

/**
 * QUISTER TECHNOLOGIES — 3D ENGINEERING TRACK MAP BUILDER
 * 
 * Luxury architectural spatial journey map representing the engineering route
 * from initial discovery to production deployment.
 * 
 * Flow:
 * 01 Discovery & Strategy -> 02 Architecture & Planning -> 03 Experience & Interface Design
 * -> 04 Development & Integration -> 05 Testing & Quality Assurance -> 06 Deployment & Ongoing Support
 */

export interface TrackCheckpoint {
  index: number
  number: string
  title: string
  subtitle: string
  // 3D coordinates for Desktop layout (framed gracefully within -2.55 to +2.55)
  posDesktop: [number, number, number]
  // 3D coordinates for Mobile layout (left-aligned vertical flow with safe top/bottom margins)
  posMobile: [number, number, number]
  // Label position relative to node
  labelPlacement: 'above' | 'below' | 'right'
}

export const CHECKPOINTS: readonly TrackCheckpoint[] = [
  {
    index: 0,
    number: '01',
    title: 'DISCOVERY & STRATEGY',
    subtitle: 'Discovery & Strategy',
    posDesktop: [-2.55, -0.38, 0.22],
    posMobile: [-0.72, 0.80, 0.08],
    labelPlacement: 'below',
  },
  {
    index: 1,
    number: '02',
    title: 'ARCHITECTURE & PLANNING',
    subtitle: 'Architecture & Planning',
    posDesktop: [-1.50, 0.18, 0.10],
    posMobile: [-0.60, 0.42, -0.05],
    labelPlacement: 'above',
  },
  {
    index: 2,
    number: '03',
    title: 'EXPERIENCE & DESIGN',
    subtitle: 'Experience & Interface Design',
    posDesktop: [-0.45, 0.48, -0.12],
    posMobile: [-0.74, 0.05, 0.08],
    labelPlacement: 'above',
  },
  {
    index: 3,
    number: '04',
    title: 'DEVELOPMENT & INTEGRATION',
    subtitle: 'Development & Integration',
    posDesktop: [0.55, 0.16, -0.22],
    posMobile: [-0.60, -0.32, -0.08],
    labelPlacement: 'below',
  },
  {
    index: 4,
    number: '05',
    title: 'TESTING & QA',
    subtitle: 'Testing & Quality Assurance',
    posDesktop: [1.55, -0.26, 0.05],
    posMobile: [-0.74, -0.70, 0.05],
    labelPlacement: 'below',
  },
  {
    index: 5,
    number: '06',
    title: 'DEPLOYMENT & SUPPORT',
    subtitle: 'Deployment & Ongoing Support',
    posDesktop: [2.55, 0.36, 0.26],
    posMobile: [-0.62, -1.08, 0.02],
    labelPlacement: 'above',
  },
]

export interface CameraViewTarget {
  pos: [number, number, number]
  lookAt: [number, number, number]
}

// Elevated 3/4 architectural camera perspective keeping the full route and all checkpoints visible
export const DESKTOP_CAMERA_VIEWS: readonly CameraViewTarget[] = [
  { pos: [-0.25, 1.35, 5.5], lookAt: [-0.15, 0.02, 0.0] },
  { pos: [-0.15, 1.42, 5.45], lookAt: [-0.08, 0.06, 0.0] },
  { pos: [-0.04, 1.50, 5.4], lookAt: [-0.02, 0.10, 0.0] },
  { pos: [0.06, 1.45, 5.4], lookAt: [0.04, 0.05, 0.0] },
  { pos: [0.18, 1.38, 5.45], lookAt: [0.10, -0.02, 0.0] },
  { pos: [0.28, 1.42, 5.5], lookAt: [0.18, 0.04, 0.0] },
]

export const MOBILE_CAMERA_VIEWS: readonly CameraViewTarget[] = [
  { pos: [0.0, 0.30, 5.4], lookAt: [0.0, 0.25, 0.0] },
  { pos: [0.0, 0.18, 5.4], lookAt: [0.0, 0.12, 0.0] },
  { pos: [0.0, 0.05, 5.4], lookAt: [0.0, 0.0, 0.0] },
  { pos: [0.0, -0.10, 5.4], lookAt: [0.0, -0.12, 0.0] },
  { pos: [0.0, -0.22, 5.4], lookAt: [0.0, -0.25, 0.0] },
  { pos: [0.0, -0.35, 5.4], lookAt: [0.0, -0.38, 0.0] },
]

/**
 * Builds the smooth continuous 3D Catmull-Rom route spline with smooth tangency
 */
export function buildTrackCurve(isMobile = false): THREE.CatmullRomCurve3 {
  const points = CHECKPOINTS.map((cp) => {
    const coords = isMobile ? cp.posMobile : cp.posDesktop
    return new THREE.Vector3(coords[0], coords[1], coords[2])
  })

  // Prepend and append extension handles for smooth start/end tangency
  const pStart = points[0]
  const pEnd = points[points.length - 1]

  const extendedPoints: THREE.Vector3[] = [
    isMobile
      ? new THREE.Vector3(pStart.x, pStart.y + 0.35, pStart.z)
      : new THREE.Vector3(pStart.x - 0.45, pStart.y - 0.05, pStart.z + 0.04),
    ...points,
    isMobile
      ? new THREE.Vector3(pEnd.x, pEnd.y - 0.35, pEnd.z)
      : new THREE.Vector3(pEnd.x + 0.45, pEnd.y + 0.05, pEnd.z - 0.04),
  ]

  return new THREE.CatmullRomCurve3(extendedPoints, false, 'catmullrom', 0.45)
}

/**
 * Builds a custom swept metallic architectural runner track
 */
export function buildSweptTrackGeometry(
  curve: THREE.CatmullRomCurve3,
  width = 0.14,
  thickness = 0.032,
  segments = 260
): THREE.BufferGeometry {
  const positions: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  const halfW = width * 0.5
  const halfH = thickness * 0.5

  const points = curve.getPoints(segments)
  const upVec = new THREE.Vector3(0, 1, 0)

  // 4 profile points per slice (top-left, top-right, bottom-right, bottom-left)
  for (let i = 0; i <= segments; i++) {
    const u = i / segments
    const p = points[i]
    const tangent = curve.getTangent(u).normalize()

    let norm = new THREE.Vector3().crossVectors(tangent, upVec).normalize()
    if (norm.lengthSq() < 0.1) norm = new THREE.Vector3(1, 0, 0)
    const binorm = new THREE.Vector3().crossVectors(norm, tangent).normalize()

    // 4 corners of cross-section
    const vTL = p.clone().add(norm.clone().multiplyScalar(-halfW)).add(binorm.clone().multiplyScalar(halfH))
    const vTR = p.clone().add(norm.clone().multiplyScalar(halfW)).add(binorm.clone().multiplyScalar(halfH))
    const vBR = p.clone().add(norm.clone().multiplyScalar(halfW)).add(binorm.clone().multiplyScalar(-halfH))
    const vBL = p.clone().add(norm.clone().multiplyScalar(-halfW)).add(binorm.clone().multiplyScalar(-halfH))

    positions.push(vTL.x, vTL.y, vTL.z)
    positions.push(vTR.x, vTR.y, vTR.z)
    positions.push(vBR.x, vBR.y, vBR.z)
    positions.push(vBL.x, vBL.y, vBL.z)

    // Normals
    normals.push(binorm.x, binorm.y, binorm.z)
    normals.push(binorm.x, binorm.y, binorm.z)
    normals.push(norm.x, norm.y, norm.z)
    normals.push(-norm.x, -norm.y, -norm.z)

    uvs.push(0, u)
    uvs.push(1, u)
    uvs.push(1, u)
    uvs.push(0, u)
  }

  for (let i = 0; i < segments; i++) {
    const a = i * 4
    const b = a + 1
    const c = a + 2
    const d = a + 3

    const nextA = (i + 1) * 4
    const nextB = nextA + 1
    const nextC = nextA + 2
    const nextD = nextA + 3

    // Top face
    indices.push(a, nextA, nextB)
    indices.push(a, nextB, b)

    // Right face
    indices.push(b, nextB, nextC)
    indices.push(b, nextC, c)

    // Bottom face
    indices.push(c, nextC, nextD)
    indices.push(c, nextD, d)

    // Left face
    indices.push(d, nextD, nextA)
    indices.push(d, nextA, a)
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
 * Builds the illuminated fine hairline centerline tube embedded along the metallic track
 */
export function buildCenterlineTubeGeometry(
  curve: THREE.CatmullRomCurve3,
  radius = 0.008,
  segments = 260
): THREE.BufferGeometry {
  return new THREE.TubeGeometry(curve, segments, radius, 12, false)
}

/**
 * Creates luxury studio procedural brushed gold textures
 */
export function createTrackTextures(): {
  albedoMap: THREE.CanvasTexture
  roughnessMap: THREE.CanvasTexture
  dispose: () => void
} {
  const size = 512

  // Albedo
  const cA = document.createElement('canvas')
  cA.width = size
  cA.height = size
  const ctxA = cA.getContext('2d')!
  ctxA.fillStyle = '#D4B276'
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
  ctxR.fillStyle = '#404040'
  ctxR.fillRect(0, 0, size, size)
  for (let i = 0; i < size; i += 2) {
    const v = Math.floor(50 + Math.random() * 25)
    ctxR.fillStyle = `rgb(${v},${v},${v})`
    ctxR.fillRect(0, i, size, 1)
  }
  const roughnessMap = new THREE.CanvasTexture(cR)
  roughnessMap.wrapS = THREE.RepeatWrapping
  roughnessMap.wrapT = THREE.RepeatWrapping

  return {
    albedoMap,
    roughnessMap,
    dispose: () => {
      albedoMap.dispose()
      roughnessMap.dispose()
    },
  }
}

/**
 * Creates studio gallery HDR environment map with soft champagne & cool fill softboxes
 */
export function createTrackEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size * 2
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Deep obsidian backdrop
  ctx.fillStyle = '#08080B'
  ctx.fillRect(0, 0, size * 2, size)

  // Overhead warm champagne softbox reflection
  const gradKey = ctx.createRadialGradient(size * 0.65, size * 0.35, 10, size * 0.65, size * 0.35, size * 0.45)
  gradKey.addColorStop(0, 'rgba(255, 245, 226, 0.95)')
  gradKey.addColorStop(0.35, 'rgba(235, 205, 155, 0.60)')
  gradKey.addColorStop(0.70, 'rgba(180, 140, 85, 0.18)')
  gradKey.addColorStop(1, 'rgba(8, 8, 11, 0)')
  ctx.fillStyle = gradKey
  ctx.fillRect(0, 0, size * 2, size)

  // Cool fill softbox reflection
  const gradFill = ctx.createRadialGradient(size * 1.55, size * 0.48, 10, size * 1.55, size * 0.48, size * 0.38)
  gradFill.addColorStop(0, 'rgba(230, 238, 252, 0.70)')
  gradFill.addColorStop(0.40, 'rgba(180, 195, 215, 0.30)')
  gradFill.addColorStop(1, 'rgba(8, 8, 11, 0)')
  ctx.fillStyle = gradFill
  ctx.fillRect(0, 0, size * 2, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.mapping = THREE.EquirectangularReflectionMapping
  const pmremGen = new THREE.PMREMGenerator(renderer)
  const envMap = pmremGen.fromEquirectangular(texture).texture
  pmremGen.dispose()
  texture.dispose()

  return envMap
}
