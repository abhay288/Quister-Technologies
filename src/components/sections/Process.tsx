import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LifecycleRibbon3D from './process/LifecycleRibbon3D'
import ProcessPhasesGrid from './process/ProcessPhasesGrid'
import ProcessEngagementSection from './process/ProcessEngagementSection'
import ProcessCommitmentsSection from './process/ProcessCommitmentsSection'
import ProcessCtaSection from './process/ProcessCtaSection'

gsap.registerPlugin(ScrollTrigger)

interface ProcessProps {
  isStandalonePage?: boolean
}

export default function Process({ isStandalonePage = true }: ProcessProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [activePhase, setActivePhase] = useState<number>(0)
  const [isLooping, setIsLooping] = useState<boolean>(true)
  const [isInStagesView, setIsInStagesView] = useState<boolean>(false)
  const [isInteracting, setIsInteracting] = useState<boolean>(false)
  const scrollProgressRef = useRef<number>(0)
  const isInteractingRef = useRef<boolean>(false)
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Continuous auto-play loop across the 6 engineering phases
  useEffect(() => {
    if (!isLooping || isInStagesView || isInteracting) return

    // Dwell duration: 3.2s for phases 0-4, 4.0s for the deployment finale (phase 5)
    const dwellDuration = activePhase === 5 ? 4000 : 3200
    const timer = setTimeout(() => {
      setActivePhase((prev) => (prev + 1) % 6)
    }, dwellDuration)

    return () => clearTimeout(timer)
  }, [isLooping, isInStagesView, isInteracting, activePhase])

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

      // Synchronize scroll progress when user scrolls into the stage cards below
      if (contentRef.current) {
        ScrollTrigger.create({
          trigger: contentRef.current,
          start: 'top 75%',
          end: 'bottom 35%',
          onEnter: () => setIsInStagesView(true),
          onLeaveBack: () => setIsInStagesView(false),
          onUpdate: (self) => {
            scrollProgressRef.current = self.progress
            if (isInteractingRef.current) return
            const phaseIndex = Math.min(5, Math.max(0, Math.floor(self.progress * 6)))
            setActivePhase((prev) => (prev === phaseIndex ? prev : phaseIndex))
          },
        })
      }
    }, sectionRef)

    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
      ctx.revert()
    }
  }, [])

  const handlePhaseSelect = (idx: number) => {
    isInteractingRef.current = true
    setIsInteracting(true)
    setActivePhase(idx)
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    // Hold selected phase for 8 seconds before resuming the loop
    resetTimerRef.current = setTimeout(() => {
      isInteractingRef.current = false
      setIsInteracting(false)
    }, 8000)
  }

  const handlePhaseHover = (idx: number) => {
    if (idx !== activePhase) {
      handlePhaseSelect(idx)
    }
  }

  const handleToggleLoop = () => {
    setIsLooping((prev) => !prev)
    setIsInteracting(false)
  }

  return (
    <section
      id="process"
      ref={sectionRef}
      data-scroll-section="PROCESS"
      aria-labelledby="process-heading"
      style={{
        background: '#F8F5EE',
        color: '#14161C',
        paddingTop: isStandalonePage
          ? 'clamp(7.5rem, 13vw, 11rem)'
          : 'clamp(6rem, 11vw, 10.5rem)',
        paddingBottom: 'clamp(6rem, 11vw, 10.5rem)',
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
                OUR APPROACH // THE ENGINEERING PROCESS
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
                maxWidth: '720px',
              }}
            >
              <span style={{ color: '#14161C' }}>How We Turn Ambition </span>
              <br className="hidden sm:inline" />
              <span
                className="italic font-normal"
                style={{
                  background: 'linear-gradient(135deg, #A88349 0%, #D4B276 50%, #9A7A4A 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Into Production.
              </span>
            </h2>
          </div>

          {/* Supporting Copy in a separate right-aligned block */}
          <div style={{ maxWidth: '460px' }}>
            <p
              className="font-sans text-base md:text-[1.05rem] leading-relaxed"
              style={{
                color: 'rgba(20, 22, 28, 0.72)',
                fontWeight: 350,
              }}
            >
              Every successful digital product begins with understanding the problem.
              We bring together clear planning, thoughtful design and disciplined engineering
              to turn ideas into dependable products.
            </p>
          </div>
        </div>

        {/* =====================================================================
            3D CONTINUOUS METALLIC LIFECYCLE TRACK MAP
            - Continuous auto-play loop with interactive milestone selection
            - Smooth camera gliding & active energy pulse along the 6 checkpoints
            ===================================================================== */}
        <LifecycleRibbon3D
          activePhase={activePhase}
          scrollProgressRef={scrollProgressRef}
          isPhasePinnedRef={isInteractingRef}
          onPhaseSelect={handlePhaseSelect}
          isLooping={isLooping}
          onToggleLoop={handleToggleLoop}
        />

        {/* =====================================================================
            FIVE DELIVERY STAGES (EDITORIAL STACK)
            - Dual columns: WHAT YOU RECEIVE & WHAT WE NEED FROM YOU
            - Coordinated interactive selection with 3D sculpture
            ===================================================================== */}
        <div ref={contentRef} className="w-full">
          <ProcessPhasesGrid
            activePhase={activePhase}
            onPhaseSelect={handlePhaseSelect}
            onPhaseHover={handlePhaseHover}
          />
        </div>

        {/* =====================================================================
            HOW PROJECTS ARE STRUCTURED & OPTIONAL PROOF OF CONCEPT
            ===================================================================== */}
        <ProcessEngagementSection />

        {/* =====================================================================
            OUR PROJECT COMMITMENTS (TRUST GRID) & COLLABORATION GUIDELINES
            ===================================================================== */}
        <ProcessCommitmentsSection />

        {/* =====================================================================
            FINAL PROJECT CTA
            ===================================================================== */}
        <ProcessCtaSection />
      </div>
    </section>
  )
}
