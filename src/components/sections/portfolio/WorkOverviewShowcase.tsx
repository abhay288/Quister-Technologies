import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MovingScreenshotLanes from './MovingScreenshotLanes'
import JellyfishScene from '../../visuals/JellyfishScene'
import ProjectGateway from '../../archive/ProjectGateway'
import { PORTFOLIO_STATS } from './portfolioData'

gsap.registerPlugin(ScrollTrigger)

interface WorkOverviewShowcaseProps {
  onExploreProjects: () => void
}

export default function WorkOverviewShowcase({ onExploreProjects }: WorkOverviewShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRowRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const scrollProgressRef = useRef<number>(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      // Coordinated scroll progress for the 3D golden jellyfish companion
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress
        },
      })

      // Elegant headline entrance reveal
      if (headerRowRef.current) {
        gsap.fromTo(
          headerRowRef.current.querySelectorAll('.reveal-anim'),
          { y: 30, opacity: 0 },
          {
            scrollTrigger: {
              trigger: headerRowRef.current,
              start: 'top 85%',
            },
            y: 0,
            opacity: 1,
            duration: 1.0,
            stagger: 0.1,
            ease: 'power3.out',
          }
        )
      }

      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { y: 40, opacity: 0 },
          {
            scrollTrigger: {
              trigger: headlineRef.current,
              start: 'top 85%',
            },
            y: 0,
            opacity: 1,
            duration: 1.15,
            ease: 'power3.out',
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none"
      style={{
        background: '#050508',
        minHeight: 'clamp(720px, 94vh, 980px)',
        position: 'relative',
        padding: 'clamp(4rem, 7vw, 7rem) 0 clamp(3.5rem, 6vw, 5.5rem) 0',
      }}
    >
      {/* =====================================================================
          BACKGROUND LAYER 0: Moving Screenshot Lanes (Continuous CSS Marquee)
          - Hardware-accelerated continuous movement in alternating directions
          - Subtly layered behind the vignette for ambient live-platform presence
          ===================================================================== */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.38, zIndex: 0 }}
      >
        <MovingScreenshotLanes />
      </div>

      {/* =====================================================================
          BACKGROUND LAYER 1: Deep Radial Vignettes & Precision Grid Backdrop
          - Ensures typography legibility & deep luxury studio atmosphere
          ===================================================================== */}
      {/* Precision architectural grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.012) 1px, transparent 1px)',
          backgroundSize: '100px 100px',
          backgroundPosition: '-1px -1px',
          opacity: 0.45,
          zIndex: 1,
        }}
      />

      {/* Radial vignette for editorial depth */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 70% 35%, rgba(212, 178, 118, 0.05) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 30% 45%, rgba(5, 5, 8, 0.94) 0%, rgba(5, 5, 8, 0.72) 55%, rgba(5, 5, 8, 0.28) 85%, transparent 100%)',
          zIndex: 1,
        }}
      />

      {/* Top & bottom gentle gradient fades */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, #050508 0%, transparent 15%, transparent 85%, #050508 100%)',
          zIndex: 1,
        }}
      />

      {/* =====================================================================
          LAYER 2: 3D REAL-TIME GOLDEN JELLYFISH COMPANION
          - Undulating bell with warm amber core light
          - 22 long flowing gold ribbon tentacles
          - Dark stepped metallic pedestals & suspended liquid gold droplets
          - Responsive mouse tracking & scroll-linked posture
          ===================================================================== */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 'clamp(3%, 4.5vw, 6.5%)',
          right: 'clamp(-4%, 2vw, 6%)',
          width: 'clamp(380px, 52vw, 720px)',
          height: 'clamp(440px, 52vw, 640px)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        <JellyfishScene scrollProgressRef={scrollProgressRef} />
      </div>

      {/* =====================================================================
          LAYER 3: EDITORIAL TYPOGRAPHY & STATS CONTENT PRESENTATION
          ===================================================================== */}
      <div
        className="container-wide relative"
        style={{
          zIndex: 3,
        }}
      >
        {/* Top Row: Eyebrow, Gold Divider, Status & Supporting Copy */}
        <div
          ref={headerRowRef}
          className="flex flex-wrap items-start justify-between gap-6 mb-3 sm:mb-5"
        >
          {/* Left Eyebrow with gold divider and live status indicator */}
          <div className="reveal-anim flex items-center gap-3.5">
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#D4B276',
                fontWeight: 600,
              }}
            >
              02 // SELECTED WORK
            </span>

            <div
              style={{
                width: '32px',
                height: '1px',
                background: '#D4B276',
                opacity: 0.5,
              }}
            />

            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                letterSpacing: '0.16em',
                color: '#34D399',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontWeight: 500,
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#34D399',
                  boxShadow: '0 0 10px #34D399',
                  display: 'inline-block',
                }}
              />
              REAL PRODUCTS. REAL IMPACT.
            </span>
          </div>

          {/* Right Supporting Copy */}
          <div className="reveal-anim max-w-md text-left">
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.875rem',
                lineHeight: 1.65,
                color: 'rgba(245, 240, 232, 0.72)',
                fontWeight: 300,
              }}
            >
              High-performance web platforms, mobile applications, educational software and interactive games engineered and delivered across India.
            </p>
          </div>
        </div>

        {/* Main Headline Stage */}
        <div
          ref={headlineRef}
          className="relative flex flex-col justify-center mb-4 sm:mb-5"
          style={{
            maxWidth: '820px',
          }}
        >
          <h2
            id="work-heading"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(3.4rem, 7.5vw, 6.8rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              fontWeight: 400,
              margin: 0,
              color: '#FAF8F5',
              textTransform: 'uppercase',
            }}
          >
            PROVEN
            <br />
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                textTransform: 'none',
                fontWeight: 300,
                background:
                  'linear-gradient(135deg, #FBF6EE 0%, #D4B276 50%, #FAF8F5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Production.
            </span>
          </h2>

          {/* Subtitle with dual-line message */}
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(1rem, 1.25vw, 1.15rem)',
              lineHeight: 1.65,
              color: 'rgba(245, 240, 232, 0.85)',
              fontWeight: 300,
              marginTop: '1rem',
              maxWidth: '560px',
            }}
          >
            <span className="text-[#FAF8F5] font-normal">Digital work. Real-world impact.</span>{' '}
            We engineer enterprise web platforms, mobile apps, educational software and interactive games.
          </p>
        </div>

        {/* 4-Column Balanced Statistics Box */}
        <div
          className="w-full max-w-3xl grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-0 py-4 px-4 md:px-7 mb-5 rounded-xl"
          style={{
            background: 'rgba(13, 14, 20, 0.72)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.55)',
          }}
        >
          {/* Stat 01: Completed Projects */}
          <div className="flex flex-col items-center md:items-start justify-center py-1.5 px-3 md:border-r border-white/10">
            <span
              className="font-display text-3xl sm:text-4xl text-[#ECC87A] font-light mb-1"
              style={{ letterSpacing: '-0.02em' }}
            >
              {PORTFOLIO_STATS.completedProjects || '14+'}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(245, 240, 232, 0.55)',
              }}
            >
              COMPLETED PROJECTS
            </span>
          </div>

          {/* Stat 02: Web & Mobile Apps */}
          <div className="flex flex-col items-center md:items-start justify-center py-1.5 px-3 md:border-r border-white/10 md:pl-6">
            <span
              className="font-display text-3xl sm:text-4xl text-[#ECC87A] font-light mb-1"
              style={{ letterSpacing: '-0.02em' }}
            >
              {PORTFOLIO_STATS.webAndMobileApps || '20+'}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(245, 240, 232, 0.55)',
              }}
            >
              WEB &amp; MOBILE APPS
            </span>
          </div>

          {/* Stat 03: Happy Clients */}
          <div className="flex flex-col items-center md:items-start justify-center py-1.5 px-3 md:border-r border-white/10 md:pl-6">
            <span
              className="font-display text-3xl sm:text-4xl text-[#ECC87A] font-light mb-1"
              style={{ letterSpacing: '-0.02em' }}
            >
              {PORTFOLIO_STATS.happyClients || '100%'}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(245, 240, 232, 0.55)',
              }}
            >
              CLIENT VERDICT
            </span>
          </div>

          {/* Stat 04: Active Deployments */}
          <div className="flex flex-col items-center md:items-start justify-center py-1.5 px-3 md:pl-6">
            <span
              className="font-display text-3xl sm:text-4xl text-[#ECC87A] font-light mb-1"
              style={{ letterSpacing: '-0.02em' }}
            >
              MULTI-STATE
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(245, 240, 232, 0.55)',
              }}
            >
              ACTIVE DEPLOYMENT
            </span>
          </div>
        </div>

        {/* Interactive 3D Project Gateway Button */}
        <div className="flex justify-start pt-1">
          <ProjectGateway onActivate={onExploreProjects} />
        </div>
      </div>
    </div>
  )
}
