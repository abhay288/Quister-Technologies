import * as THREE from 'three'

export interface BoneBindTransform {
  name: string
  pos: THREE.Vector3
  quat: THREE.Quaternion
}

export type BindPoseMap = Map<string, BoneBindTransform>

// ---------------------------------------------------------------------------
// 1. Capture Original Rest-Pose Joint Transforms from Cloned Skeleton
// ---------------------------------------------------------------------------
export function captureBindPose(skeleton: THREE.Skeleton): BindPoseMap {
  const map: BindPoseMap = new Map()
  for (const bone of skeleton.bones) {
    map.set(bone.name, {
      name: bone.name,
      pos: bone.position.clone(),
      quat: bone.quaternion.clone(),
    })
  }
  return map
}

// ---------------------------------------------------------------------------
// 2. Build Seamless Continuous Hand + Forearm Topology with Loop Subdivision
//    - Welds split UV seam vertices into one watertight manifold
//    - Removes the flat wrist end-cap and extrudes 16 anatomical forearm rings
//      directly from those exact 20 boundary vertices (0px joint seam)
//    - Runs 1 pass of Weighted Loop Subdivision (~11.5k smooth sculpted tris)
//      preserving skinIndex/skinWeight across all 25 articulated finger joints
// ---------------------------------------------------------------------------
export function buildContinuousSculptedHandGeometry(rawGeom: THREE.BufferGeometry): THREE.BufferGeometry {
  const posAttr = rawGeom.getAttribute('position')
  const skinIdxAttr = rawGeom.getAttribute('skinIndex')
  const skinWeightAttr = rawGeom.getAttribute('skinWeight')
  const rawIndex = rawGeom.getIndex()

  if (!posAttr || !skinIdxAttr || !skinWeightAttr || !rawIndex) {
    return rawGeom
  }

  // Step 1: Weld coincident vertices across UV seams
  const weldMap = new Map<string, number>()
  const pts: [number, number, number][] = []
  const joints: [number, number, number, number][] = []
  const weights: [number, number, number, number][] = []
  const oldToNew = new Int32Array(posAttr.count)

  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i)
    const y = posAttr.getY(i)
    const z = posAttr.getZ(i)
    const key = `${Math.round(x * 10000)},${Math.round(y * 10000)},${Math.round(z * 10000)}`
    let mapped = weldMap.get(key)
    if (mapped === undefined) {
      mapped = pts.length
      weldMap.set(key, mapped)
      pts.push([x, y, z])
      joints.push([
        skinIdxAttr.getX(i),
        skinIdxAttr.getY(i),
        skinIdxAttr.getZ(i),
        skinIdxAttr.getW(i),
      ])
      weights.push([
        skinWeightAttr.getX(i),
        skinWeightAttr.getY(i),
        skinWeightAttr.getZ(i),
        skinWeightAttr.getW(i),
      ])
    }
    oldToNew[i] = mapped
  }

  // Step 2: Strip flat closed wrist end-cap (raw y > 0.065) to reveal open 20-vert loop
  const tris: [number, number, number][] = []
  const indexArray = rawIndex.array
  for (let i = 0; i < indexArray.length; i += 3) {
    const a = oldToNew[indexArray[i]]
    const b = oldToNew[indexArray[i + 1]]
    const c = oldToNew[indexArray[i + 2]]
    if (a === b || b === c || c === a) continue
    const maxY = Math.max(pts[a][1], pts[b][1], pts[c][1])
    if (maxY <= 0.065) {
      tris.push([a, b, c])
    }
  }

  // Step 3: Extract exact ordered open wrist boundary loop
  const edgeDirMap = new Map<string, [number, number][]>()
  for (const [a, b, c] of tris) {
    const pairs: [number, number][] = [
      [a, b],
      [b, c],
      [c, a],
    ]
    for (const [u, v] of pairs) {
      const k = u < v ? `${u}_${v}` : `${v}_${u}`
      let list = edgeDirMap.get(k)
      if (!list) {
        list = []
        edgeDirMap.set(k, list)
      }
      list.push([u, v])
    }
  }

  const nextEdge = new Map<number, number>()
  for (const list of edgeDirMap.values()) {
    if (list.length === 1) {
      nextEdge.set(list[0][0], list[0][1])
    }
  }

  const loop: number[] = []
  const firstStart = nextEdge.keys().next().value
  if (firstStart !== undefined) {
    let cursor: number | undefined = firstStart
    for (let i = 0; i < nextEdge.size && cursor !== undefined; i++) {
      loop.push(cursor)
      cursor = nextEdge.get(cursor)
    }
  }

  // Step 4: Extrude 16 smooth anatomical forearm rings directly from loop[0..19]
  if (loop.length >= 6) {
    const loopPts = loop.map((vi) => pts[vi])
    const cx0 = loopPts.reduce((s, p) => s + p[0], 0) / loop.length
    const cy0 = loopPts.reduce((s, p) => s + p[1], 0) / loop.length
    const cz0 = loopPts.reduce((s, p) => s + p[2], 0) / loop.length
    const avgRadius =
      loopPts.reduce((s, p) => s + Math.hypot(p[0] - cx0, p[2] - cz0), 0) / loop.length

    const rings = 16
    const totalArmY = 0.27
    let prevRing = loop.slice()

    for (let r = 1; r <= rings; r++) {
      const v = r / rings
      // Gentle anatomical wrist curve settling cleanly onto rotation axis
      const armCenterX = cx0 + 0.012 * Math.sin(Math.min(1, v * 1.15) * (Math.PI / 2))
      const armCenterZ = cz0

      // Natural wrist groove waist at v ~ 0.08 followed by graceful forearm fullness
      const swell =
        v < 0.16
          ? 1 - 0.024 * Math.sin((v / 0.16) * Math.PI)
          : 0.99 + 0.34 * Math.pow(Math.sin(Math.min(1, (v - 0.1) / 0.9) * Math.PI * 0.55), 1.28)
      const relaxToOval = Math.min(1, v * 2.1)
      const smoothR = avgRadius * swell

      const curRing: number[] = []
      for (let i = 0; i < loop.length; i++) {
        const p0 = loopPts[i]
        const rx0 = (p0[0] - cx0) * swell * (1 + 0.08 * v)
        const rz0 = (p0[2] - cz0) * swell * (1 - 0.05 * v)
        const ang = Math.atan2(rz0, rx0)
        const ovalX = Math.cos(ang) * smoothR * 1.03
        const ovalZ = Math.sin(ang) * smoothR * 1.07
        const x = armCenterX + rx0 * (1 - relaxToOval) + ovalX * relaxToOval
        const z = armCenterZ + rz0 * (1 - relaxToOval) + ovalZ * relaxToOval
        const flattenY = Math.min(1, v * 2.8)
        const y = p0[1] * (1 - flattenY) + cy0 * flattenY + v * totalArmY

        const newIdx = pts.length
        pts.push([x, y, z])
        joints.push([0, 0, 0, 0])
        weights.push([1, 0, 0, 0])
        curRing.push(newIdx)
      }

      for (let i = 0; i < loop.length; i++) {
        const nextI = (i + 1) % loop.length
        const uTop = prevRing[i]
        const vTop = prevRing[nextI]
        const uBot = curRing[i]
        const vBot = curRing[nextI]
        // Reverse top edge order (vTop -> uTop) to keep 100% consistent outward winding
        tris.push([vTop, uTop, uBot], [vTop, uBot, vBot])
      }
      prevRing = curRing
    }
  }

  // Step 5: Prune unused cap vertices and re-index cleanly
  const usedMap = new Map<number, number>()
  const compactPts: [number, number, number][] = []
  const compactJoints: [number, number, number, number][] = []
  const compactWeights: [number, number, number, number][] = []

  const remap = (oldIdx: number): number => {
    let idx = usedMap.get(oldIdx)
    if (idx === undefined) {
      idx = compactPts.length
      usedMap.set(oldIdx, idx)
      compactPts.push(pts[oldIdx])
      compactJoints.push(joints[oldIdx])
      compactWeights.push(weights[oldIdx])
    }
    return idx
  }

  const compactTris: [number, number, number][] = tris.map(([a, b, c]) => [
    remap(a),
    remap(b),
    remap(c),
  ])

  // Step 6: 1 pass of Weighted Loop Subdivision for smooth sculptural anatomy
  const subdivided = loopSubdivideWithSkin(compactPts, compactJoints, compactWeights, compactTris)

  // Step 7: Pack into final Three.js BufferGeometry
  const vertCount = subdivided.pts.length
  const posOut = new Float32Array(vertCount * 3)
  const skinIdxOut = new Uint16Array(vertCount * 4)
  const skinWeightOut = new Float32Array(vertCount * 4)

  for (let i = 0; i < vertCount; i++) {
    const p = subdivided.pts[i]
    const j = subdivided.joints[i]
    const w = subdivided.weights[i]
    posOut[i * 3] = p[0]
    posOut[i * 3 + 1] = p[1]
    posOut[i * 3 + 2] = p[2]

    skinIdxOut[i * 4] = j[0]
    skinIdxOut[i * 4 + 1] = j[1]
    skinIdxOut[i * 4 + 2] = j[2]
    skinIdxOut[i * 4 + 3] = j[3]

    skinWeightOut[i * 4] = w[0]
    skinWeightOut[i * 4 + 1] = w[1]
    skinWeightOut[i * 4 + 2] = w[2]
    skinWeightOut[i * 4 + 3] = w[3]
  }

  const idxOut = new Uint32Array(subdivided.tris.length * 3)
  for (let i = 0; i < subdivided.tris.length; i++) {
    idxOut[i * 3] = subdivided.tris[i][0]
    idxOut[i * 3 + 1] = subdivided.tris[i][1]
    idxOut[i * 3 + 2] = subdivided.tris[i][2]
  }

  const outGeom = new THREE.BufferGeometry()
  outGeom.setAttribute('position', new THREE.BufferAttribute(posOut, 3))
  outGeom.setAttribute('skinIndex', new THREE.BufferAttribute(skinIdxOut, 4))
  outGeom.setAttribute('skinWeight', new THREE.BufferAttribute(skinWeightOut, 4))
  outGeom.setIndex(new THREE.BufferAttribute(idxOut, 1))
  outGeom.computeVertexNormals()
  outGeom.computeBoundingBox()
  outGeom.computeBoundingSphere()

  return outGeom
}

function blendSkinAttributes(
  joints: [number, number, number, number][],
  weights: [number, number, number, number][],
  contributors: [number, number][]
): [[number, number, number, number], [number, number, number, number]] {
  const accum = new Map<number, number>()
  for (const [vi, coeff] of contributors) {
    if (coeff <= 0) continue
    const jRow = joints[vi]
    const wRow = weights[vi]
    for (let k = 0; k < 4; k++) {
      const contribution = wRow[k] * coeff
      if (contribution > 1e-6) {
        accum.set(jRow[k], (accum.get(jRow[k]) || 0) + contribution)
      }
    }
  }

  const top = [...accum.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4)
  const total = top.reduce((sum, entry) => sum + entry[1], 0) || 1
  const outJ: [number, number, number, number] = [0, 0, 0, 0]
  const outW: [number, number, number, number] = [0, 0, 0, 0]
  for (let i = 0; i < top.length; i++) {
    outJ[i] = top[i][0]
    outW[i] = top[i][1] / total
  }
  return [outJ, outW]
}

function loopSubdivideWithSkin(
  pts: [number, number, number][],
  joints: [number, number, number, number][],
  weights: [number, number, number, number][],
  tris: [number, number, number][]
) {
  const nV = pts.length
  const edgeOpposites = new Map<string, number[]>()
  const neighbors: Set<number>[] = Array.from({ length: nV }, () => new Set())
  const boundaryNeighbors: number[][] = Array.from({ length: nV }, () => [])

  for (const [a, b, c] of tris) {
    neighbors[a].add(b)
    neighbors[a].add(c)
    neighbors[b].add(a)
    neighbors[b].add(c)
    neighbors[c].add(a)
    neighbors[c].add(b)

    const triplets: [number, number, number][] = [
      [a, b, c],
      [b, c, a],
      [c, a, b],
    ]
    for (const [u, v, opp] of triplets) {
      const k = u < v ? `${u}_${v}` : `${v}_${u}`
      let list = edgeOpposites.get(k)
      if (!list) {
        list = []
        edgeOpposites.set(k, list)
      }
      list.push(opp)
    }
  }

  for (const [k, opps] of edgeOpposites.entries()) {
    if (opps.length === 1) {
      const split = k.split('_')
      const u = Number(split[0])
      const v = Number(split[1])
      boundaryNeighbors[u].push(v)
      boundaryNeighbors[v].push(u)
    }
  }

  const newPts: [number, number, number][] = Array.from({ length: nV })
  const newJoints: [number, number, number, number][] = Array.from({ length: nV })
  const newWeights: [number, number, number, number][] = Array.from({ length: nV })

  for (let i = 0; i < nV; i++) {
    const k = neighbors[i].size
    if (k === 0) {
      newPts[i] = pts[i]
      newJoints[i] = joints[i]
      newWeights[i] = weights[i]
      continue
    }

    if (boundaryNeighbors[i].length === 2) {
      const b1 = boundaryNeighbors[i][0]
      const b2 = boundaryNeighbors[i][1]
      newPts[i] = [
        0.75 * pts[i][0] + 0.125 * (pts[b1][0] + pts[b2][0]),
        0.75 * pts[i][1] + 0.125 * (pts[b1][1] + pts[b2][1]),
        0.75 * pts[i][2] + 0.125 * (pts[b1][2] + pts[b2][2]),
      ]
    } else {
      const beta = k === 3 ? 3 / 16 : 3 / (8 * k)
      const selfW = 1 - k * beta
      let sx = selfW * pts[i][0]
      let sy = selfW * pts[i][1]
      let sz = selfW * pts[i][2]
      for (const nb of neighbors[i]) {
        sx += beta * pts[nb][0]
        sy += beta * pts[nb][1]
        sz += beta * pts[nb][2]
      }
      newPts[i] = [sx, sy, sz]
    }
    newJoints[i] = joints[i]
    newWeights[i] = weights[i]
  }

  const midpointMap = new Map<string, number>()
  const getMidpoint = (u: number, v: number): number => {
    const k = u < v ? `${u}_${v}` : `${v}_${u}`
    const existing = midpointMap.get(k)
    if (existing !== undefined) return existing

    const opps = edgeOpposites.get(k) || []
    const idx = newPts.length

    if (opps.length === 2) {
      const o1 = opps[0]
      const o2 = opps[1]
      newPts.push([
        0.375 * (pts[u][0] + pts[v][0]) + 0.125 * (pts[o1][0] + pts[o2][0]),
        0.375 * (pts[u][1] + pts[v][1]) + 0.125 * (pts[o1][1] + pts[o2][1]),
        0.375 * (pts[u][2] + pts[v][2]) + 0.125 * (pts[o1][2] + pts[o2][2]),
      ])
      const [bj, bw] = blendSkinAttributes(joints, weights, [
        [u, 0.375],
        [v, 0.375],
        [o1, 0.125],
        [o2, 0.125],
      ])
      newJoints.push(bj)
      newWeights.push(bw)
    } else {
      newPts.push([
        0.5 * (pts[u][0] + pts[v][0]),
        0.5 * (pts[u][1] + pts[v][1]),
        0.5 * (pts[u][2] + pts[v][2]),
      ])
      const [bj, bw] = blendSkinAttributes(joints, weights, [
        [u, 0.5],
        [v, 0.5],
      ])
      newJoints.push(bj)
      newWeights.push(bw)
    }

    midpointMap.set(k, idx)
    return idx
  }

  const newTris: [number, number, number][] = []
  for (const [a, b, c] of tris) {
    const ab = getMidpoint(a, b)
    const bc = getMidpoint(b, c)
    const ca = getMidpoint(c, a)
    newTris.push([a, ab, ca], [ab, b, bc], [ca, bc, c], [ab, bc, ca])
  }

  return { pts: newPts, joints: newJoints, weights: newWeights, tris: newTris }
}

// ---------------------------------------------------------------------------
// 3. Forward-Kinematics Natural Sculptural Hand Posing Solver
//    - Transforms flat stiff WebXR rest pose into an expressive, relaxed
//      human hand silhouette inspired by Lenis.dev (index poised upward,
//      middle/ring/pinky gently cascading into natural curls, thumb relaxed open)
//    - Animates subtle sinusoidal articulation as the scroll progress changes
// ---------------------------------------------------------------------------
interface FingerPoseSpec {
  bones: string[]
  // Negative curl rotates inward toward the palm around bone localX;
  // Spread rotates laterally around bone localY (+ toward thumb, - toward pinky)
  curls: number[]
  spreads: number[]
}

const _segVec = new THREE.Vector3()
const _localAxisX = new THREE.Vector3()
const _localAxisY = new THREE.Vector3()
const _deltaRot = new THREE.Quaternion()
const _spreadRot = new THREE.Quaternion()
const _accRot = new THREE.Quaternion()
const _prevPos = new THREE.Vector3()
const _curPos = new THREE.Vector3()

export function applySculptedHandPose(
  skeleton: THREE.Skeleton,
  bindPose: BindPoseMap,
  progress: number,
  finaleProgress = 0
): void {
  const boneByName = new Map<string, THREE.Bone>()
  for (const b of skeleton.bones) {
    boneByName.set(b.name, b)
  }

  // Smooth breathing modulation across rotation + expressive unfurl during finale move
  const wave = Math.sin(progress * Math.PI * 2) * 0.06
  const waveDelay = Math.sin((progress - 0.12) * Math.PI * 2) * 0.07
  // Peaks cleanly around mid-finale (finaleProgress ~ 0.5) for a graceful open-hand flourish
  const flourish = Math.sin(Math.min(1, Math.max(0, finaleProgress)) * Math.PI)
  const uncurl = 1 - flourish * 0.58

  const specs: FingerPoseSpec[] = [
    {
      bones: [
        'thumb-metacarpal',
        'thumb-phalanx-proximal',
        'thumb-phalanx-distal',
        'thumb-tip',
      ],
      curls: [
        (-0.08 + wave * 0.35) * uncurl,
        (-0.22 + wave * 0.45) * uncurl,
        (-0.2 + wave * 0.35) * uncurl,
        0,
      ],
      spreads: [0.06 - flourish * 0.12, 0.02, 0, 0],
    },
    {
      bones: [
        'index-finger-metacarpal',
        'index-finger-phalanx-proximal',
        'index-finger-phalanx-intermediate',
        'index-finger-phalanx-distal',
        'index-finger-tip',
      ],
      curls: [
        0,
        (-0.08 + wave * 0.5) * uncurl,
        (-0.14 + wave * 0.6) * uncurl,
        (-0.1 + wave * 0.4) * uncurl,
        0,
      ],
      spreads: [0, 0.09 + flourish * 0.06, 0, 0, 0],
    },
    {
      bones: [
        'middle-finger-metacarpal',
        'middle-finger-phalanx-proximal',
        'middle-finger-phalanx-intermediate',
        'middle-finger-phalanx-distal',
        'middle-finger-tip',
      ],
      curls: [
        0,
        (-0.26 + wave * 0.7) * uncurl,
        (-0.34 + wave * 0.8) * uncurl,
        (-0.2 + wave * 0.5) * uncurl,
        0,
      ],
      spreads: [0, 0.02, 0, 0, 0],
    },
    {
      bones: [
        'ring-finger-metacarpal',
        'ring-finger-phalanx-proximal',
        'ring-finger-phalanx-intermediate',
        'ring-finger-phalanx-distal',
        'ring-finger-tip',
      ],
      curls: [
        0,
        (-0.46 + waveDelay * 0.8) * uncurl,
        (-0.54 + waveDelay * 0.9) * uncurl,
        (-0.3 + waveDelay * 0.6) * uncurl,
        0,
      ],
      spreads: [0, -0.05 - flourish * 0.05, 0, 0, 0],
    },
    {
      bones: [
        'pinky-finger-metacarpal',
        'pinky-finger-phalanx-proximal',
        'pinky-finger-phalanx-intermediate',
        'pinky-finger-phalanx-distal',
        'pinky-finger-tip',
      ],
      curls: [
        0,
        (-0.62 + waveDelay) * uncurl,
        (-0.64 + waveDelay) * uncurl,
        (-0.36 + waveDelay * 0.6) * uncurl,
        0,
      ],
      spreads: [0, -0.1 - flourish * 0.08, 0, 0, 0],
    },
  ]

  for (const spec of specs) {
    const firstBind = bindPose.get(spec.bones[0])
    if (!firstBind) continue

    _accRot.identity()
    _prevPos.copy(firstBind.pos)
    _curPos.copy(firstBind.pos)

    for (let i = 0; i < spec.bones.length; i++) {
      const name = spec.bones[i]
      const bone = boneByName.get(name)
      const bind = bindPose.get(name)
      if (!bone || !bind) continue

      if (i > 0) {
        _segVec.copy(bind.pos).sub(_prevPos).applyQuaternion(_accRot)
        _curPos.add(_segVec)
      }
      _prevPos.copy(bind.pos)

      const spreadAngle = spec.spreads[i] || 0
      const curlAngle = spec.curls[i] || 0

      if (spreadAngle !== 0) {
        _localAxisY.set(0, 1, 0).applyQuaternion(bind.quat).applyQuaternion(_accRot).normalize()
        _spreadRot.setFromAxisAngle(_localAxisY, spreadAngle)
        _accRot.premultiply(_spreadRot)
      }

      if (curlAngle !== 0) {
        _localAxisX.set(1, 0, 0).applyQuaternion(bind.quat).applyQuaternion(_accRot).normalize()
        _deltaRot.setFromAxisAngle(_localAxisX, curlAngle)
        _accRot.premultiply(_deltaRot)
      }

      bone.position.copy(_curPos)
      bone.quaternion.copy(_accRot).multiply(bind.quat)
    }
  }
}

// ---------------------------------------------------------------------------
// 4. Procedural Studio PMREM Environment Texture (Zero External Downloads)
//    - Creates high-contrast sculpted metallic/porcelain softbox reflections
//      matching Quister's obsidian + champagne-gold + violet aesthetic
// ---------------------------------------------------------------------------
export function createStudioEnvironment(gl: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(gl)
  pmrem.compileEquirectangularShader()

  const studioScene = new THREE.Scene()
  studioScene.background = new THREE.Color('#07060B')

  // Warm Overhead Vertical Softbox Key Strip (carves long highlights down fingers & forearm)
  const keyMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(4.5, 4.1, 3.4) })
  const keyPanel = new THREE.Mesh(new THREE.PlaneGeometry(5, 16), keyMat)
  keyPanel.position.set(4, 6, 7)
  keyPanel.lookAt(0, 0, 0)
  studioScene.add(keyPanel)

  // Left Warm Champagne Reflector Panel
  const goldMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(2.6, 2.0, 1.2) })
  const goldPanel = new THREE.Mesh(new THREE.PlaneGeometry(8, 12), goldMat)
  goldPanel.position.set(-9, 1, 4)
  goldPanel.lookAt(0, 0, 0)
  studioScene.add(goldPanel)

  // Right / Back Lavender-Silver Rim Card
  const rimMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 2.1, 3.0) })
  const rimPanel = new THREE.Mesh(new THREE.PlaneGeometry(6, 14), rimMat)
  rimPanel.position.set(6, 2, -8)
  rimPanel.lookAt(0, 0, 0)
  studioScene.add(rimPanel)

  // Subtle Soft Top Fill Dome
  const topMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.4, 1.3, 1.2) })
  const topPanel = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), topMat)
  topPanel.position.set(0, 12, 0)
  topPanel.lookAt(0, 0, 0)
  studioScene.add(topPanel)

  const renderTarget = pmrem.fromScene(studioScene, 0.04)
  pmrem.dispose()
  keyMat.dispose()
  goldMat.dispose()
  rimMat.dispose()
  topMat.dispose()
  keyPanel.geometry.dispose()
  goldPanel.geometry.dispose()
  rimPanel.geometry.dispose()
  topPanel.geometry.dispose()

  return renderTarget.texture
}
