import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import JellyfishHeroScene from './JellyfishHeroScene'
import { smoothScrollTo } from '../../utils/smoothScroll'

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const typographyContainerRef = useRef<HTMLDivElement>(null)
  const sceneWrapperRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const title1Ref = useRef<HTMLSpanElement>(null)
  const title2Ref = useRef<HTMLSpanElement>(null)
  const copyRef = useRef<HTMLParagraphElement>(null)
  const ctaGroupRef = useRef<HTMLDivElement>(null)
  const signatureRef = useRef<HTMLDivElement>(null)
  const hudLeftRef = useRef<HTMLDivElement>(null)
  const hudRightRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const scrollProgressRef = useRef<number>(0)
  const [activeChapter, setActiveChapter] = useState<number>(1)

  // ---------------------------------------------------------------------------
  // Coordinated Entrance & 5-Chapter Scroll Storytelling (~2.2 Viewport Heights)
  // Ensures font metrics are completely loaded before layout calculations
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const heroEl = heroRef.current
    if (!heroEl) return

    // Ensure fonts are loaded before refreshing ScrollTrigger
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh()
      })
    }

    const ctx = gsap.context(() => {
      // 1. Initial Quiet Luxury Staggered Entrance Animation
      const entranceTl = gsap.timeline({ delay: 0.25 })

      entranceTl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }
      )

      entranceTl.fromTo(
        title1Ref.current,
        { opacity: 0, y: 26, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.05, ease: 'power3.out' },
        '-=0.65'
      )

      entranceTl.fromTo(
        title2Ref.current,
        { opacity: 0, y: 26, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out' },
        '-=0.88'
      )

      entranceTl.fromTo(
        copyRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
        '-=0.75'
      )

      entranceTl.fromTo(
        ctaGroupRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' },
        '-=0.7'
      )

      entranceTl.fromTo(
        [signatureRef.current, scrollIndicatorRef.current, hudLeftRef.current, hudRightRef.current],
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.5'
      )

      if (prefersReducedMotion) return

      // 2. Continuous Hero Scroll Scrub (No Blank Pin Spacer, Natural Fluid Transition)
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.4,
          onUpdate: (self) => {
            const p = self.progress
            scrollProgressRef.current = p

            // Update Chapter Number (1-5) smoothly
            const chap = Math.min(5, Math.max(1, Math.floor(p * 5) + 1))
            setActiveChapter(chap)
          },
        },
      })

      // Fade out scroll indicator and side HUD rails early in scroll
      scrollTl.to(
        [scrollIndicatorRef.current, signatureRef.current, hudLeftRef.current, hudRightRef.current],
        { opacity: 0, y: 12, duration: 0.2, ease: 'power2.out' },
        0
      )

      // Typography smoothly glides upward and dissolves as user scrolls into Proven in Production
      scrollTl.to(
        typographyContainerRef.current,
        {
          opacity: 0,
          y: -75,
          scale: 0.95,
          pointerEvents: 'none',
          duration: 0.45,
          ease: 'power2.out',
        },
        0
      )
    }, heroEl)

    return () => ctx.revert()
  }, [])

  const handleDiscussProject = (e: React.MouseEvent) => {
    e.preventDefault()
    smoothScrollTo('#contact', { offset: -20, duration: 1.4 })
  }

  const handleExploreWork = (e: React.MouseEvent) => {
    e.preventDefault()
    smoothScrollTo('#work', { offset: -20, duration: 1.35 })
  }

  return (
    <section
      ref={heroRef}
      id="hero"
      aria-label="Quister Technologies — Independent Digital Studio"
      className="hero-abyss-bg"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '700px',
        overflow: 'hidden',
        background: '#050508',
      }}
    >
      {/* Quiet Luxury Atmosphere — Pure Abyssal Obsidian & Deep Plum Depth (Matching Image 1) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 60% at 52% 24%, rgba(32, 14, 48, 0.24) 0%, rgba(8, 7, 12, 0.82) 65%, #050508 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Subtle Precision Grid Backdrop */}
      <div
        aria-hidden="true"
        className="grid-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0.12,
        }}
      />

      {/* Interactive 3D Real-time Jellyfish & Floating Membranes Scene */}
      <div
        ref={sceneWrapperRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          transition: 'opacity 150ms linear',
          WebkitMaskImage:
            'linear-gradient(to bottom, #000 0%, #000 calc(100% - 240px), rgba(0, 0, 0, 0.6) calc(100% - 110px), transparent 100%)',
          maskImage:
            'linear-gradient(to bottom, #000 0%, #000 calc(100% - 240px), rgba(0, 0, 0, 0.6) calc(100% - 110px), transparent 100%)',
        }}
      >
        <JellyfishHeroScene scrollProgressRef={scrollProgressRef} />
      </div>

      {/* =====================================================================
          SIDE HUD RAILS (Matching Reference Composition)
          ===================================================================== */}
      {/* Left HUD Rail: Ideas To Impact / Chapters 01-05 / Scroll Indicator */}
      <div
        ref={hudLeftRef}
        aria-hidden="true"
        className="hidden lg:flex flex-col justify-between select-none pointer-events-none"
        style={{
          position: 'absolute',
          left: 'clamp(1.5rem, 3.2vw, 3.5rem)',
          top: 'clamp(5.5rem, 12vh, 8rem)',
          bottom: 'clamp(2rem, 5vh, 4rem)',
          zIndex: 12,
          fontFamily: 'var(--font-mono)',
          color: 'rgba(201, 164, 102, 0.72)',
          fontSize: '0.625rem',
          letterSpacing: '0.22em',
        }}
      >
        {/* Top: IDEAS TO IMPACT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', textTransform: 'uppercase' }}>
          <span>IDEAS</span>
          <span>TO</span>
          <span style={{ color: '#F3EFE8' }}>IMPACT</span>
        </div>

        {/* Center: Chapter Sequence 01 - 05 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[1, 2, 3, 4, 5].map((num) => {
            const formatted = `0${num}`
            const isActive = activeChapter === num
            return (
              <div
                key={num}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: isActive ? '#C9A466' : 'rgba(167, 160, 173, 0.45)',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 300ms ease',
                }}
              >
                {isActive && (
                  <span
                    style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: '#C9A466',
                      boxShadow: '0 0 6px rgba(201, 164, 102, 0.9)',
                    }}
                  />
                )}
                <span>{formatted}</span>
              </div>
            )
          })}
        </div>

        {/* Bottom: SCROLL TO EXPLORE with Line and Dot */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textTransform: 'uppercase' }}>
            <span>SCROLL</span>
            <span>TO EXPLORE</span>
          </div>
          <div
            style={{
              position: 'relative',
              width: '1px',
              height: '32px',
              backgroundColor: 'rgba(201, 164, 102, 0.25)',
              marginLeft: '4px',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: `${((activeChapter - 1) / 4) * 100}%`,
                left: '-3px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#C9A466',
                boxShadow: '0 0 8px rgba(201, 164, 102, 0.85)',
                transition: 'top 300ms ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* Right HUD Rail: Design Develop Deploy / Engineering Digital Excellence */}
      <div
        ref={hudRightRef}
        aria-hidden="true"
        className="hidden lg:flex flex-col justify-between items-end select-none pointer-events-none"
        style={{
          position: 'absolute',
          right: 'clamp(1.5rem, 3.2vw, 3.5rem)',
          top: 'clamp(5.5rem, 12vh, 8rem)',
          bottom: 'clamp(2rem, 5vh, 4rem)',
          zIndex: 12,
          fontFamily: 'var(--font-mono)',
          color: 'rgba(201, 164, 102, 0.72)',
          fontSize: '0.625rem',
          letterSpacing: '0.22em',
          textAlign: 'right',
        }}
      >
        {/* Top-Mid: DESIGN DEVELOP DEPLOY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', textTransform: 'uppercase', marginTop: 'auto', marginBottom: 'auto' }}>
          <span>DESIGN</span>
          <span>DEVELOP</span>
          <span style={{ color: '#F3EFE8' }}>DEPLOY</span>
        </div>

        {/* Bottom: ENGINEERING DIGITAL EXCELLENCE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textTransform: 'uppercase' }}>
          <span>ENGINEERING</span>
          <span>DIGITAL</span>
          <span style={{ color: '#F3EFE8' }}>EXCELLENCE</span>
        </div>
      </div>

      {/* =====================================================================
          PREMIUM EDITORIAL TYPOGRAPHY COMPOSITION
          - Shifted ~45px upward on desktop for exact reference alignment.
          - NO blurred rectangular card or glassmorphism panel — text sits cleanly over background.
          - High-contrast, crisp editorial typography with zero letter clipping.
          ===================================================================== */}
      <div
        ref={typographyContainerRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          /* Shifted 35-50px upward: clamp(21vh, 25vh, 28vh) matches the reference composition */
          paddingTop: 'clamp(21vh, 25vh, 28vh)',
          paddingBottom: 'clamp(2rem, 4vh, 3.5rem)',
          paddingLeft: 'clamp(1.5rem, 4vw, 4rem)',
          paddingRight: 'clamp(1.5rem, 4vw, 4rem)',
          overflow: 'visible',
          pointerEvents: 'none',
        }}
      >
        {/* Subtle Atmospheric Text Contrast Vignette (Feathered, Non-Occluding) */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '46%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(980px, 94vw)',
            height: 'min(620px, 80vh)',
            background:
              'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(5, 5, 8, 0.28) 0%, rgba(5, 5, 8, 0.12) 50%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div
          style={{
            maxWidth: '880px',
            width: '100%',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflow: 'visible',
            pointerEvents: 'none',
            padding: '0 clamp(1rem, 2.5vw, 2.5rem)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* 1. Small Editorial Eyebrow (Enhanced Contrast & Champagne Gold Glow) */}
          <div
            ref={eyebrowRef}
            style={{
              marginBottom: 'clamp(0.85rem, 1.8vh, 1.25rem)',
              overflow: 'visible',
              pointerEvents: 'auto',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(0.66rem, 0.78vw, 0.74rem)',
                fontWeight: 600,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: '#F3D18C',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.36rem 1.15rem',
                backgroundColor: 'rgba(10, 6, 18, 0.62)',
                border: '1px solid rgba(243, 209, 140, 0.28)',
                borderRadius: '9999px',
                boxShadow: '0 4px 18px rgba(0, 0, 0, 0.7), inset 0 0 12px rgba(243, 209, 140, 0.05)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                textShadow: '0 0 16px rgba(243, 209, 140, 0.45), 0 2px 6px rgba(0, 0, 0, 0.95)',
              }}
            >
              <span>INDEPENDENT DIGITAL STUDIO</span>
              <span style={{ opacity: 0.65, color: '#F3D18C' }}>·</span>
              <span style={{ opacity: 0.95 }}>DESIGN × TECHNOLOGY</span>
            </div>
          </div>

          {/* 2 & 3. Main Editorial Headline ("We create" / "digital worlds.")
              Instrument Serif / Bodoni Moda Pairing — Zero Clipping Architecture */}
          <h1
            style={{
              margin: '0 0 clamp(0.95rem, 1.8vh, 1.45rem) 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              lineHeight: 1.1, // Generous line height prevents any vertical letter clipping
              letterSpacing: '-0.01em',
              overflow: 'visible',
              width: '100%',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {/* Line 1: Elegant, refined serif in warm ivory #FFF8ED (Clearly visible serif letterforms) */}
            <span
              ref={title1Ref}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.6rem, 4.8vw + 0.6rem, 5.5rem)',
                fontWeight: 400,
                color: '#FFF8ED',
                display: 'block',
                lineHeight: 1.08,
                letterSpacing: '-0.01em',
                overflow: 'visible',
                padding: '0.04em 0.2em',
                textShadow: '0 2px 24px rgba(0, 0, 0, 0.98), 0 4px 40px rgba(0, 0, 0, 0.9), 0 0 70px rgba(0, 0, 0, 0.85)',
              }}
            >
              We create
            </span>

            {/* Line 2: True italic serif in luminous lavender-to-champagne (88-104px on desktop)
                Padded bounding box completely prevents WebKit background-clip cutting */}
            <span
              ref={title2Ref}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(4.2rem, 5.8vw + 0.8rem, 6.5rem)',
                fontWeight: 400,
                fontStyle: 'italic', // True italic styling
                display: 'inline-block',
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
                overflow: 'visible',
                padding: '0.12em 0.38em',
                margin: '0 -0.38em',
                background: 'linear-gradient(135deg, #FAF4FF 0%, #EBD8FF 32%, #FFF2DE 70%, #F5D18A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 2px 20px rgba(0, 0, 0, 0.98)) drop-shadow(0 4px 40px rgba(0, 0, 0, 0.95))',
              }}
            >
              digital worlds.
            </span>
          </h1>

          {/* 4. Supporting Paragraph (Max width 580px, Manrope sans, bright warm text #DED8E2) */}
          <p
            ref={copyRef}
            style={{
              maxWidth: '580px',
              margin: '0 auto clamp(1.35rem, 2.4vh, 1.95rem) auto',
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(0.96rem, 1.08vw, 1.08rem)',
              lineHeight: 1.75,
              color: '#DED8E2',
              fontWeight: 400,
              overflow: 'visible',
              pointerEvents: 'auto',
              textShadow: '0 2px 14px rgba(0, 0, 0, 0.98), 0 4px 28px rgba(0, 0, 0, 0.95)',
            }}
          >
            From ambitious ideas to exceptional digital products, we combine design, engineering and imagination to create experiences that move people.
          </p>

          {/* 5. Refined CTA Buttons — High-Contrast Luxury Proportions */}
          <div
            ref={ctaGroupRef}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.25rem',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'visible',
              pointerEvents: 'auto',
            }}
          >
            <a
              href="#contact"
              onClick={handleDiscussProject}
              className="btn-primary"
              style={{
                backgroundColor: '#F3D18C',
                color: '#09070D',
                padding: '0.85rem 2.25rem',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                borderRadius: '9999px',
                boxShadow: '0 4px 24px rgba(243, 209, 140, 0.42), 0 2px 8px rgba(0, 0, 0, 0.7)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                textDecoration: 'none',
                transition: 'all 300ms ease',
              }}
            >
              START A PROJECT ↗
            </a>

            <a
              href="#work"
              onClick={handleExploreWork}
              className="btn-secondary"
              style={{
                padding: '0.85rem 2.1rem',
                fontSize: '0.72rem',
                fontWeight: 500,
                letterSpacing: '0.14em',
                borderRadius: '9999px',
                border: '1px solid rgba(243, 209, 140, 0.55)',
                backgroundColor: 'rgba(16, 12, 24, 0.72)',
                color: '#FFF8ED',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                textDecoration: 'none',
                transition: 'all 300ms ease',
              }}
            >
              EXPLORE OUR WORK
            </a>
          </div>

          {/* 6. Brand Descriptor / Bottom Label (IBM Plex Mono) */}
          <div
            ref={signatureRef}
            style={{
              marginTop: 'clamp(1.35rem, 2.4vh, 2.1rem)',
              overflow: 'visible',
              pointerEvents: 'auto',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(0.56rem, 0.7vw, 0.65rem)',
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: '#F3D18C',
                opacity: 0.95,
                fontWeight: 500,
                textShadow: '0 0 12px rgba(243, 209, 140, 0.35), 0 2px 8px rgba(0, 0, 0, 0.9)',
              }}
            >
              DESIGN · ENGINEERING · IMMERSIVE EXPERIENCES
            </span>
          </div>
        </div>
      </div>

      {/* Seamless Abyssal Bottom Gradient Fade — Softens & Melts Jellyfish Dendrites into the Deep Void */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'clamp(150px, 26vh, 280px)',
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(5, 5, 8, 0.2) 25%, rgba(5, 5, 8, 0.72) 65%, #050508 100%)',
          pointerEvents: 'none',
          zIndex: 4,
        }}
      />

      {/* Subtle, Restrained Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        aria-hidden="true"
        className="hidden sm:flex flex-col items-center gap-2 select-none pointer-events-none"
        style={{
          position: 'absolute',
          bottom: 'clamp(1.5rem, 2.8vh, 2.2rem)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 15,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.53125rem',
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            color: 'rgba(167, 160, 173, 0.55)',
          }}
        >
          SCROLL
        </span>
        <div
          style={{
            width: '1px',
            height: '18px',
            background: 'linear-gradient(180deg, rgba(201, 164, 102, 0.6) 0%, transparent 100%)',
          }}
        />
      </div>
    </section>
  )
}
