import * as THREE from 'three'

/**
 * QUISTER TECHNOLOGIES — Cinematic Scroll Storytelling Engine
 *
 * 5 Chapters:
 * 01 Introduction (0–20%): Quiet luxury resting state, full nav, centered typography, 2 discreet membrane sculptures.
 * 02 Discovery (20–40%): Membranes slowly open, bell gently pulses, creature begins graceful diagonal ascent, camera moves laterally.
 * 03 Immersion (40–60%): Camera travels around creature with 3D parallax, membranes occupy different depth planes.
 * 04 Transformation (60–80%): Jellyfish ascends toward upper scene, membranes sweep outward, camera prepares next section.
 * 05 Work Reveal (80–100%): Clean transition into Selected Projects, all hero 3D materials fade to 0 opacity by progress 0.94.
 */

export interface CameraPose {
  x: number
  y: number
  z: number
  lookAtX: number
  lookAtY: number
  lookAtZ: number
}

export interface JellyfishPose {
  x: number
  y: number
  z: number
  rotX: number
  rotY: number
  rotZ: number
  scale: number
  opacity: number
  tiltAngle: number
}

export interface MembranePose {
  x: number
  y: number
  z: number
  rotX: number
  rotY: number
  rotZ: number
  scaleX: number
  scaleY: number
  scaleZ: number
  opacity: number
  curl: number
}

export interface ChoreographyState {
  camera: CameraPose
  jellyfish: JellyfishPose
  membranes: [MembranePose, MembranePose] // [Left Membrane, Right Membrane]
  tentacleDrag: { x: number; y: number; z: number }
  typography: {
    opacity: number
    y: number
    scale: number
    pointerEvents: boolean
  }
  heroSceneOpacity: number
  activeChapter: number
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function evaluateChoreography(progress: number): ChoreographyState {
  const p = THREE.MathUtils.clamp(progress, 0, 1)

  // Active Chapter Indicator (01 to 05)
  let activeChapter = 1
  if (p < 0.20) activeChapter = 1
  else if (p < 0.40) activeChapter = 2
  else if (p < 0.60) activeChapter = 3
  else if (p < 0.80) activeChapter = 4
  else activeChapter = 5

  // -------------------------------------------------------------------------
  // 1. Camera Pose Choreography
  // -------------------------------------------------------------------------
  let camX = 0
  let camY = 0.7
  let camZ = 7.6
  let lookX = 0
  let lookY = 1.45
  let lookZ = 0

  if (p <= 0.20) {
    // 01 Introduction: Calm establishing composition
    const t = smoothstep(0, 0.20, p)
    camX = 0
    camY = lerp(0.7, 0.8, t)
    camZ = lerp(7.6, 7.3, t)
    lookX = 0
    lookY = lerp(1.45, 1.65, t)
  } else if (p <= 0.40) {
    // 02 Discovery: Camera moves laterally to reveal 3D volume
    const t = smoothstep(0.20, 0.40, p)
    camX = lerp(0, 0.85, t)
    camY = lerp(0.8, 1.2, t)
    camZ = lerp(7.3, 6.9, t)
    lookX = lerp(0, 0.18, t)
    lookY = lerp(1.65, 2.15, t)
  } else if (p <= 0.60) {
    // 03 Immersion: Camera travels around creature with 3D parallax
    const t = smoothstep(0.40, 0.60, p)
    camX = lerp(0.85, 2.1, t)
    camY = lerp(1.2, 1.7, t)
    camZ = lerp(6.9, 6.4, t)
    lookX = lerp(0.18, 0.35, t)
    lookY = lerp(2.15, 2.9, t)
  } else if (p <= 0.80) {
    // 04 Transformation: Sweeping curved arc across to the left
    const t = smoothstep(0.60, 0.80, p)
    camX = lerp(2.1, -1.8, t)
    camY = lerp(1.7, 2.1, t)
    camZ = lerp(6.4, 6.0, t)
    lookX = lerp(0.35, -0.2, t)
    lookY = lerp(2.9, 3.8, t)
  } else {
    // 05 Work Reveal: Camera settles into clean neutral alignment
    const t = smoothstep(0.80, 1.0, p)
    camX = lerp(-1.8, 0, t)
    camY = lerp(2.1, 2.5, t)
    camZ = lerp(6.0, 7.5, t)
    lookX = lerp(-0.2, 0, t)
    lookY = lerp(3.8, 4.8, t)
  }

  // -------------------------------------------------------------------------
  // 2. Jellyfish Pose & Opacity Choreography
  // Dynamic swimming posture matching biological reference (Image 1):
  // Angled gracefully at ~35-40° pointing up-right, dome elevated in upper hero,
  // glowing amber core visible inside crystalline bell, silky tentacles streaming
  // down and to the left behind typography.
  // -------------------------------------------------------------------------
  let jfX = 0.48
  let jfY = 2.15
  let jfZ = 0.12
  let jfRotX = 0.22
  let jfRotY = -0.34
  let jfRotZ = -0.62 // Clockwise tilt around Z: dome points top-right, tentacles stream down-left
  let jfScale = 0.98
  let jfOpacity = 1.0
  let tiltDeg = 36

  if (p <= 0.20) {
    // 01 Introduction: Elegant diagonal swim posture matching reference
    const t = smoothstep(0, 0.20, p)
    jfX = lerp(0.48, 0.58, t)
    jfY = lerp(2.15, 2.55, t)
    jfRotZ = lerp(-0.62, -0.56, t)
    jfRotX = lerp(0.22, 0.18, t)
    tiltDeg = lerp(36, 32, t)
  } else if (p <= 0.40) {
    // 02 Discovery: Tilts smoothly and begins graceful diagonal ascent
    const t = smoothstep(0.20, 0.40, p)
    jfX = lerp(0.58, 0.72, t)
    jfY = lerp(2.55, 3.75, t)
    jfRotX = lerp(0.18, 0.14, t)
    jfRotZ = lerp(-0.56, -0.46, t)
    tiltDeg = lerp(32, 26, t)
  } else if (p <= 0.60) {
    // 03 Immersion: Moves diagonally upward and tilts gracefully
    const t = smoothstep(0.40, 0.60, p)
    jfX = lerp(0.72, 0.45, t)
    jfY = lerp(3.75, 5.1, t)
    jfZ = lerp(0.12, 0.25, t)
    jfRotZ = lerp(-0.46, -0.28, t)
    jfRotX = lerp(0.14, 0.20, t)
    jfRotY = lerp(-0.34, 0.18, t)
    tiltDeg = lerp(26, 16, t)
  } else if (p <= 0.80) {
    // 04 Transformation: Orientation shifts as camera sweeps around
    const t = smoothstep(0.60, 0.80, p)
    jfX = lerp(0.45, -0.15, t)
    jfY = lerp(5.1, 6.4, t)
    jfZ = lerp(0.25, 0.12, t)
    jfRotZ = lerp(-0.28, -0.10, t)
    jfRotX = lerp(0.20, 0.24, t)
    jfRotY = lerp(0.18, -0.22, t)
    tiltDeg = lerp(16, 6, t)
  } else {
    // 05 Work Reveal: Creature ascends out of focal area and fades cleanly
    const t = smoothstep(0.80, 1.0, p)
    jfX = lerp(-0.15, 0, t)
    jfY = lerp(6.4, 9.4, t)
    jfZ = lerp(0.12, -2.5, t)
    jfOpacity = 1.0 - smoothstep(0.80, 0.94, p)
    tiltDeg = lerp(6, 0, t)
  }

  // -------------------------------------------------------------------------
  // 3. Exactly TWO Refined Floating Membranes (Left & Right)
  // Positioned wide to frame the artwork without encroaching on central text
  // -------------------------------------------------------------------------

  // Left Membrane (Membrane 0) — broad flared silk mantle, gentle folding
  let lmX = -3.4
  let lmY = 1.95
  let lmZ = 0.15
  let lmRotX = 0.2
  let lmRotY = -0.42
  let lmRotZ = 0.28
  let lmScale = 0.92
  let lmOpacity = 1.0
  let lmCurl = 0

  // Right Membrane (Membrane 1) — asymmetric silhouette, deeper depth & independent drift
  let rmX = 3.5
  let rmY = 2.15
  let rmZ = -0.32
  let rmRotX = -0.16
  let rmRotY = 0.38
  let rmRotZ = -0.24
  let rmScale = 0.84
  let rmOpacity = 1.0
  let rmCurl = 0

  if (p <= 0.20) {
    // 01 Introduction: Gentle framing
    const t = smoothstep(0, 0.20, p)
    lmX = lerp(-3.4, -3.6, t)
    rmX = lerp(3.5, 3.7, t)
  } else if (p <= 0.40) {
    // 02 Discovery: Membranes slowly open in different directions
    const t = smoothstep(0.20, 0.40, p)
    lmX = lerp(-3.6, -4.8, t)
    lmY = lerp(1.95, 2.7, t)
    lmRotZ = lerp(0.28, 0.54, t)
    lmCurl = t * 0.4

    rmX = lerp(3.7, 5.0, t)
    rmY = lerp(2.15, 2.9, t)
    rmRotZ = lerp(-0.24, -0.5, t)
    rmCurl = t * 0.42
  } else if (p <= 0.60) {
    // 03 Immersion: Separate depth planes with 3D parallax
    const t = smoothstep(0.40, 0.60, p)
    lmX = lerp(-4.8, -4.0, t)
    lmY = lerp(2.7, 3.6, t)
    lmZ = lerp(0.15, 0.95, t) // Left membrane moves forward into foreground
    lmScale = lerp(0.92, 1.0, t)

    rmX = lerp(5.0, 4.2, t)
    rmY = lerp(2.9, 3.8, t)
    rmZ = lerp(-0.32, -1.1, t) // Right membrane recedes deep into background
    rmScale = lerp(0.84, 0.76, t)
  } else if (p <= 0.80) {
    // 04 Transformation: Membranes sweep outward gracefully
    const t = smoothstep(0.60, 0.80, p)
    lmX = lerp(-4.0, -3.0, t)
    lmY = lerp(3.6, 4.6, t)
    lmZ = lerp(0.95, 1.35, t)
    lmCurl = lerp(0.4, 0.85, t)

    rmX = lerp(4.2, 3.5, t)
    rmY = lerp(3.8, 4.8, t)
    rmZ = lerp(-1.1, -1.8, t)
    rmCurl = lerp(0.42, 0.9, t)
  } else {
    // 05 Work Reveal: Membranes exit cleanly
    const t = smoothstep(0.80, 1.0, p)
    lmX = lerp(-3.0, -6.8, t)
    lmY = lerp(4.6, 6.8, t)

    rmX = lerp(3.5, 6.8, t)
    rmY = lerp(4.8, 7.0, t)

    const fade = 1.0 - smoothstep(0.80, 0.94, p)
    lmOpacity = fade
    rmOpacity = fade
  }

  // -------------------------------------------------------------------------
  // 4. Tentacle Delayed Inertial Drag Coordinates
  // -------------------------------------------------------------------------
  let dragX = 0
  let dragY = 0
  let dragZ = 0

  if (p > 0.20 && p <= 0.60) {
    const t = smoothstep(0.20, 0.50, p)
    dragY = lerp(0, -0.6, t)
    dragX = lerp(0, -0.22, t)
    dragZ = lerp(0, -0.15, t)
  } else if (p > 0.60 && p <= 0.80) {
    const t = smoothstep(0.60, 0.80, p)
    dragY = lerp(-0.6, -0.9, t)
    dragX = lerp(-0.22, 0.28, t)
    dragZ = lerp(-0.15, 0.22, t)
  } else if (p > 0.80) {
    const t = smoothstep(0.80, 1.0, p)
    dragY = lerp(-0.9, -1.3, t)
    dragX = lerp(0.28, 0, t)
    dragZ = lerp(0.22, 0, t)
  }

  // -------------------------------------------------------------------------
  // 5. Typography Pose & Visibility
  // -------------------------------------------------------------------------
  let typoOpacity = 1.0
  let typoY = 0
  let typoScale = 1.0
  let pointerEvents = true

  if (p <= 0.18) {
    typoOpacity = 1.0
    typoY = 0
    typoScale = 1.0
    pointerEvents = true
  } else if (p <= 0.38) {
    const t = smoothstep(0.18, 0.36, p)
    typoOpacity = lerp(1.0, 0.0, t)
    typoY = lerp(0, -60, t)
    typoScale = lerp(1.0, 0.96, t)
    pointerEvents = false
  } else {
    typoOpacity = 0.0
    typoY = -70
    typoScale = 0.94
    pointerEvents = false
  }

  // Canvas scene opacity fadeout near end of scroll
  const heroSceneOpacity = 1.0 - smoothstep(0.92, 1.0, p)

  return {
    camera: { x: camX, y: camY, z: camZ, lookAtX: lookX, lookAtY: lookY, lookAtZ: lookZ },
    jellyfish: {
      x: jfX,
      y: jfY,
      z: jfZ,
      rotX: jfRotX,
      rotY: jfRotY,
      rotZ: jfRotZ,
      scale: jfScale,
      opacity: jfOpacity,
      tiltAngle: tiltDeg,
    },
    membranes: [
      {
        x: lmX,
        y: lmY,
        z: lmZ,
        rotX: lmRotX,
        rotY: lmRotY,
        rotZ: lmRotZ,
        scaleX: lmScale,
        scaleY: lmScale,
        scaleZ: lmScale,
        opacity: lmOpacity,
        curl: lmCurl,
      },
      {
        x: rmX,
        y: rmY,
        z: rmZ,
        rotX: rmRotX,
        rotY: rmRotY,
        rotZ: rmRotZ,
        scaleX: rmScale,
        scaleY: rmScale,
        scaleZ: rmScale,
        opacity: rmOpacity,
        curl: rmCurl,
      },
    ],
    tentacleDrag: { x: dragX, y: dragY, z: dragZ },
    typography: {
      opacity: typoOpacity,
      y: typoY,
      scale: typoScale,
      pointerEvents,
    },
    heroSceneOpacity,
    activeChapter,
  }
}
