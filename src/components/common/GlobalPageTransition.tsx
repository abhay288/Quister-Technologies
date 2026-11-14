import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { usePageTransition } from '../../utils/router'

const SEGMENT_COUNT = 12

export default function GlobalPageTransition() {
  const { phase, progress, statusLabel, transitionId } = usePageTransition()

  const overlayRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const centerBrandRef = useRef<HTMLDivElement>(null)
  const emblemRef = useRef<HTMLDivElement>(null)
  const lineFillRef = useRef<HTMLDivElement>(null)
  const sweepLineRef = useRef<HTMLDivElement>(null)
  const lowerHudRef = useRef<HTMLDivElement>(null)
  const percentTextRef = useRef<HTMLSpanElement>(null)

  const displayCounter = useRef({ value: 0 })
  const activeSessionRef = useRef(false)

  const isOverlayOpen = phase !== 'idle'
  const isEnteringOrLoading = phase === 'covering' || phase === 'loading'

  // Smooth GSAP numeric interpolation + segmented gold progress bar synchronization
  useEffect(() => {
    if (phase === 'idle') {
      displayCounter.current.value = 0
      if (percentTextRef.current) {
        percentTextRef.current.textContent = '00'
      }
      if (lineFillRef.current) {
        gsap.set(lineFillRef.current, { scaleX: 0 })
      }
      return
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const barTween = lineFillRef.current
      ? gsap.to(lineFillRef.current, {
          scaleX: Math.min(Math.max(progress / 100, 0), 1),
          duration: reduced ? 0.01 : 0.28,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      : null

    const counterTween = gsap.to(displayCounter.current, {
      value: progress,
      duration: reduced ? 0.01 : 0.26,
      ease: 'power2.out',
      overwrite: 'auto',
      onUpdate: () => {
        if (percentTextRef.current) {
          const rounded = Math.min(100, Math.max(0, Math.round(displayCounter.current.value)))
          percentTextRef.current.textContent = rounded < 10 ? `0${rounded}` : `${rounded}`
        }
      },
    })

    return () => {
      barTween?.kill()
      counterTween.kill()
    }
  }, [phase, progress])

  // Entrance timeline: keyed ONLY on [isEnteringOrLoading, transitionId] so covering -> loading
  // never kills the reveal sequence prematurely.
  useEffect(() => {
    const overlay = overlayRef.current
    const backdrop = backdropRef.current
    const centerBrand = centerBrandRef.current
    const emblem = emblemRef.current
    const sweepLine = sweepLineRef.current
    const lowerHud = lowerHudRef.current

    if (!overlay || !backdrop || !centerBrand || !emblem || !sweepLine || !lowerHud) return
    if (!isEnteringOrLoading) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const wasAlreadyOpen = activeSessionRef.current
    activeSessionRef.current = true

    gsap.killTweensOf([overlay, backdrop, centerBrand, emblem, sweepLine, lowerHud])
    gsap.set(overlay, { visibility: 'visible', opacity: 1, pointerEvents: 'auto' })

    if (reduced) {
      gsap.set(backdrop, { opacity: 1 })
      gsap.set(emblem, { opacity: 1, scale: 1, filter: 'none' })
      gsap.set(centerBrand, { opacity: 1, y: 0, filter: 'none' })
      gsap.set(lowerHud, { opacity: 1, y: 0 })
      gsap.set(sweepLine, { scaleX: 1, opacity: 0.45 })
      return
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    if (wasAlreadyOpen) {
      // Rapid click superseding an active transition: keep backdrop solid without flashing
      gsap.set(backdrop, { opacity: 1 })
      gsap.set(emblem, { opacity: 1, scale: 1, filter: 'blur(0px)' })
      gsap.set(centerBrand, { opacity: 1, y: 0, filter: 'blur(0px)' })
      gsap.set(lowerHud, { opacity: 1, y: 0 })
      tl.fromTo(
        sweepLine,
        { scaleX: 0, opacity: 0.9, transformOrigin: 'left center' },
        { scaleX: 1, opacity: 0.55, duration: 0.45, ease: 'power2.inOut' },
        0
      )
    } else {
      tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.18 }, 0)
        .fromTo(
          emblem,
          { opacity: 0, scale: 0.94, filter: 'blur(7px)' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.36 },
          0.04
        )
        .fromTo(
          centerBrand,
          { opacity: 0, y: 8, filter: 'blur(6px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.38 },
          0.08
        )
        .fromTo(lowerHud, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.28 }, 0.1)
        .fromTo(
          sweepLine,
          { scaleX: 0, opacity: 0.9, transformOrigin: 'left center' },
          { scaleX: 1, opacity: 0.55, duration: 0.48, ease: 'power2.inOut' },
          0.06
        )
    }

    return () => {
      tl.kill()
    }
  }, [isEnteringOrLoading, transitionId])

  // Exit & Idle reset timeline
  useEffect(() => {
    const overlay = overlayRef.current
    const backdrop = backdropRef.current
    const centerBrand = centerBrandRef.current
    const emblem = emblemRef.current
    const lowerHud = lowerHudRef.current

    if (!overlay || !backdrop || !centerBrand || !emblem || !lowerHud) return

    if (phase === 'idle') {
      activeSessionRef.current = false
      gsap.killTweensOf([overlay, backdrop, centerBrand, emblem, lowerHud])
      gsap.set(overlay, { visibility: 'hidden', opacity: 0, pointerEvents: 'none' })
      gsap.set([backdrop, centerBrand, emblem, lowerHud], { clearProps: 'filter,transform,opacity' })
      return
    }

    if (phase !== 'revealing') return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    gsap.killTweensOf([overlay, backdrop, centerBrand, emblem, lowerHud])

    if (reduced) {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.05,
        onComplete: () => {
          activeSessionRef.current = false
          if (overlayRef.current) {
            gsap.set(overlayRef.current, { visibility: 'hidden', pointerEvents: 'none' })
          }
        },
      })
      return
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        activeSessionRef.current = false
      },
    })

    tl.to(
      [emblem, centerBrand],
      {
        opacity: 0,
        y: -8,
        filter: 'blur(4px)',
        duration: 0.2,
      },
      0
    )
      .to(
        lowerHud,
        {
          opacity: 0,
          y: 5,
          duration: 0.18,
        },
        0
      )
      .to(
        backdrop,
        {
          opacity: 0,
          duration: 0.28,
        },
        0.05
      )
      .set(overlay, { visibility: 'hidden', opacity: 0, pointerEvents: 'none' })

    return () => {
      tl.kill()
    }
  }, [phase])

  const roundedTarget = Math.min(100, Math.max(0, Math.round(progress)))

  return (
    <div
      ref={overlayRef}
      data-testid="global-page-transition"
      data-phase={phase}
      role="status"
      aria-live="polite"
      aria-hidden={!isOverlayOpen}
      aria-label={isOverlayOpen ? `Loading destination route, ${roundedTarget} percent` : undefined}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9996,
        visibility: isOverlayOpen ? 'visible' : 'hidden',
        pointerEvents: isOverlayOpen ? 'auto' : 'none',
        userSelect: 'none',
      }}
    >
      {/* Full-screen deep charcoal & near-black studio layer */}
      <div
        ref={backdropRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#09090E',
          backgroundImage:
            'radial-gradient(ellipse 68% 58% at 50% 46%, rgba(16, 16, 22, 0.98) 0%, #09090E 78%), radial-gradient(circle 420px at 50% 44%, rgba(201, 164, 102, 0.06) 0%, transparent 72%)',
        }}
      />

      {/* Subtle architectural hairline frame */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 'clamp(1rem, 2.5vw, 2rem)',
          border: '1px solid rgba(201, 164, 102, 0.09)',
          pointerEvents: 'none',
        }}
      />

      {/* Top thin horizontal champagne-gold travelling line across the screen */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 'clamp(1rem, 2.5vw, 2rem)',
          left: 'clamp(1rem, 2.5vw, 2rem)',
          right: 'clamp(1rem, 2.5vw, 2rem)',
          height: '1px',
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div
          ref={sweepLineRef}
          style={{
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(90deg, rgba(158, 129, 80, 0.15) 0%, #C9A466 55%, rgba(243, 239, 232, 0.7) 100%)',
            transform: 'scaleX(0)',
          }}
        />
      </div>

      {/* Main Content Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'clamp(2rem, 5vw, 4rem)',
        }}
      >
        {/* Top Editorial Micro-Bar */}
        <div className="flex items-center justify-between gap-4">
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#9E8150',
            }}
          >
            QUISTER // ARCHITECTURE
          </span>
          <span
            className="hidden sm:inline"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(243, 239, 232, 0.42)',
            }}
          >
            STUDIO TRANSITION
          </span>
        </div>

        {/* Center Brand Identity Presentation */}
        <div className="flex flex-col items-center justify-center text-center my-auto px-4">
          {/* Official Q Emblem Housing with subtle champagne reflection */}
          <div
            ref={emblemRef}
            style={{
              width: 'clamp(64px, 8vw, 84px)',
              height: 'clamp(64px, 8vw, 84px)',
              borderRadius: '18px',
              border: '1px solid rgba(201, 164, 102, 0.36)',
              background: 'radial-gradient(circle at 32% 28%, #181822 0%, #09090E 100%)',
              boxShadow:
                '0 20px 50px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(243, 239, 232, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: 'clamp(1.25rem, 2.5vh, 1.85rem)',
            }}
          >
            <img
              src="/assets/logo/quister-emblem.png"
              alt="QUISTER TECHNOLOGIES Emblem"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                position: 'relative',
                zIndex: 1,
                mixBlendMode: 'lighten',
              }}
            />
            {/* Restrained gold reflection sheen */}
            <div
              aria-hidden="true"
              className="qt-transition-sheen"
              style={{
                position: 'absolute',
                inset: 0,
                width: '48%',
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(201, 164, 102, 0.24) 50%, transparent 100%)',
                zIndex: 2,
                pointerEvents: 'none',
              }}
            />
          </div>

          <div ref={centerBrandRef} className="flex flex-col items-center">
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 3.8vw, 3.15rem)',
                fontWeight: 400,
                lineHeight: 1.08,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#F3EFE8',
                margin: 0,
              }}
            >
              QUISTER{' '}
              <span className="italic" style={{ color: '#C9A466' }}>
                TECHNOLOGIES
              </span>
            </p>

            <span
              style={{
                marginTop: '0.7rem',
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(0.6rem, 0.85vw, 0.72rem)',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#9E8150',
              }}
            >
              ENGINEERING DIGITAL EXCELLENCE
            </span>
          </div>
        </div>

        {/* Lower Progress Line + Segmented Step Track + Lower-Right Percentage */}
        <div ref={lowerHudRef} className="w-full flex flex-col gap-3">
          {/* Thin Horizontal Champagne-Gold Progress Line */}
          <div
            aria-hidden="true"
            style={{
              position: 'relative',
              width: '100%',
              height: '2px',
              background: 'rgba(158, 129, 80, 0.16)',
              overflow: 'hidden',
            }}
          >
            <div
              ref={lineFillRef}
              style={{
                width: '100%',
                height: '100%',
                transformOrigin: 'left center',
                transform: 'scaleX(0)',
                background:
                  'linear-gradient(90deg, #9E8150 0%, #C9A466 68%, #F3EFE8 100%)',
                boxShadow: '0 0 10px rgba(201, 164, 102, 0.45)',
              }}
            />

            {/* Subtle segmented notch dividers */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                gridTemplateColumns: `repeat(${SEGMENT_COUNT}, 1fr)`,
                pointerEvents: 'none',
              }}
            >
              {Array.from({ length: SEGMENT_COUNT }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    borderRight:
                      i < SEGMENT_COUNT - 1 ? '1px solid rgba(9, 9, 14, 0.72)' : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Status Label (Left) & Large Percentage Display (Lower-Right) */}
          <div className="flex items-end justify-between gap-4 pt-1">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '9999px',
                  backgroundColor: roundedTarget >= 100 ? '#F3EFE8' : '#C9A466',
                  transition: 'background-color 200ms',
                }}
              />
              <span
                data-testid="transition-status-label"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(0.5625rem, 0.75vw, 0.6875rem)',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#9E8150',
                }}
              >
                {statusLabel}
              </span>
            </div>

            <div
              className="flex items-baseline gap-1"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              <span
                ref={percentTextRef}
                data-testid="transition-percentage"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.35rem, 5.2vw, 4.4rem)',
                  fontWeight: 400,
                  lineHeight: 0.9,
                  letterSpacing: '-0.02em',
                  color: '#F3EFE8',
                }}
              >
                00
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(0.75rem, 1.2vw, 1rem)',
                  color: '#C9A466',
                  letterSpacing: '0.1em',
                }}
              >
                %
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
