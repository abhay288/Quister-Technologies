import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LifecycleRibbon3D from './process/LifecycleRibbon3D'
import ProcessPhasesGrid from './process/ProcessPhasesGrid'

gsap.registerPlugin(ScrollTrigger)

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [activePhase, setActivePhase] = useState<number>(0)
  const scrollProgressRef = useRef<number>(0)
  const isInteractingRef = useRef<boolean>(false)
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const sectionEl = sectionRef.current
    if (!sectionEl) return

    const ctx = gsap.context(() => {
      // Header smooth entrance reveal
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { y: 35, opacity: 0 },
          {
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
            },
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
          }
        )
      }

      // Track scroll progress through the process section to synchronize 3D sculpture and phase nodes
      ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top 65%',
        end: 'bottom 45%',
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress
          if (isInteractingRef.current) return
          const phaseIndex = Math.min(5, Math.max(0, Math.floor(self.progress * 6)))
          setActivePhase((prev) => (prev === phaseIndex ? prev : phaseIndex))
        },
      })
    }, sectionRef)

    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
      ctx.revert()
    }
  }, [])

  const handlePhaseSelect = (idx: number) => {
    isInteractingRef.current = true
    setActivePhase(idx)
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    resetTimerRef.current = setTimeout(() => {
      isInteractingRef.current = false
    }, 2200)
  }

  const handlePhaseHover = (idx: number) => {
    if (idx !== activePhase) {
      handlePhaseSelect(idx)
    }
  }

  return (
    <section
      id="process"
      ref={sectionRef}
      aria-labelledby="process-heading"
      style={{
        background: '#F8F5EE',
        color: '#14161C',
        padding: 'clamp(6rem, 11vw, 10.5rem) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle Warm Ivory Ambient Atmosphere */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 65% 55% at 50% 25%, rgba(201, 164, 102, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container-wide" style={{ position: 'relative', zIndex: 2 }}>
        {/* =====================================================================
            SECTION HEADER
            - Left: Eyebrow + Editorial Display Headline
            - Right: Disciplined Delivery Supporting Copy
            ===================================================================== */}
        <div
          ref={headerRef}
          style={{
            marginBottom: 'clamp(3rem, 6vw, 4.5rem)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '2.5rem',
          }}
        >
          <div>
            {/* Small Section Label */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.25rem',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: '#9A7A4A',
                  fontWeight: 600,
                }}
              >
                04 // ENGINEERING LIFECYCLE
              </span>
              <div
                style={{
                  width: '40px',
                  height: '1px',
                  background: '#9A7A4A',
                  opacity: 0.45,
                }}
              />
            </div>

            {/* Main Editorial Headline */}
            <h2
              id="process-heading"
              className="font-display font-light leading-[1.04] tracking-[-0.015em]"
              style={{
                fontSize: 'clamp(3.2rem, 5.5vw, 5rem)',
                maxWidth: '680px',
              }}
            >
              <span style={{ color: '#14161C' }}>How We Turn Ambition Into </span>
              <span
                className="italic font-normal"
                style={{
                  background: 'linear-gradient(135deg, #A88349 0%, #D4B276 50%, #9A7A4A 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Production.
              </span>
            </h2>
          </div>

          {/* Supporting Copy in a separate right-aligned block */}
          <div style={{ maxWidth: '440px' }}>
            <p
              className="font-sans text-base md:text-[1.05rem] leading-relaxed"
              style={{
                color: 'rgba(20, 22, 28, 0.72)',
                fontWeight: 350,
              }}
            >
              A disciplined, transparent delivery framework designed to reduce risk,
              improve delivery efficiency and build maintainable digital products.
            </p>
          </div>
        </div>

        {/* =====================================================================
            3D CONTINUOUS METALLIC LIFECYCLE SCULPTURE
            - Represents 6 progressive stages with active illumination & camera journey
            - All debug telemetry removed (only editorial label "THE ENGINEERING JOURNEY")
            ===================================================================== */}
        <LifecycleRibbon3D
          activePhase={activePhase}
          scrollProgressRef={scrollProgressRef}
          isPhasePinnedRef={isInteractingRef}
          onPhaseSelect={handlePhaseSelect}
        />

        {/* =====================================================================
            REFINED SIX PHASE EDITORIAL GRID
            - 3-column, 2-row layout on desktop
            - Understated deliverable lines (heavy grey boxes removed)
            - Coordinated interactive selection with 3D sculpture
            ===================================================================== */}
        <div ref={contentRef} className="w-full">
          <ProcessPhasesGrid
            activePhase={activePhase}
            onPhaseSelect={handlePhaseSelect}
            onPhaseHover={handlePhaseHover}
          />
        </div>
      </div>
    </section>
  )
}
