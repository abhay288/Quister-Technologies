import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import PrecisionSculpture from './about/PrecisionSculpture'
import StudioPrinciples from './about/StudioPrinciples'
import { smoothScrollTo } from '../../utils/smoothScroll'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const narrativeRef = useRef<HTMLDivElement>(null)
  const sculptureWrapperRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const sectionEl = sectionRef.current
    if (!sectionEl) return

    const ctx = gsap.context(() => {
      // Track scroll progress for 3D sculpture perspective shift
      ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          setScrollProgress(self.progress)
        },
      })

      // Header entrance animation
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

      // Narrative text blocks staggered reveal
      if (narrativeRef.current) {
        gsap.fromTo(
          narrativeRef.current.children,
          { y: 40, opacity: 0 },
          {
            scrollTrigger: {
              trigger: narrativeRef.current,
              start: 'top 80%',
            },
            y: 0,
            opacity: 1,
            duration: 1.0,
            stagger: 0.14,
            ease: 'power3.out',
          }
        )
      }

      // 3D Sculpture subtle depth zoom on entrance
      if (sculptureWrapperRef.current) {
        gsap.fromTo(
          sculptureWrapperRef.current,
          { opacity: 0, scale: 0.94 },
          {
            scrollTrigger: {
              trigger: sculptureWrapperRef.current,
              start: 'top 82%',
            },
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      style={{
        background: '#090A0E',
        color: '#FAF7F0',
        padding: 'clamp(6rem, 11vw, 10.5rem) 0',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* Subtle Background Radial Ambient Glows */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '20%',
          right: '5%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201, 164, 102, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(123, 66, 214, 0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container-wide" style={{ position: 'relative', zIndex: 2 }}>
        {/* =====================================================================
            TWO-COLUMN EDITORIAL STUDIO PRESENTATION
            - Left: Eyebrow, Main Headline, 3 Narrative Blocks, Pull Quote & CTA (z-20)
            - Right: Large Borderless 3D Precision Sculpture with Graceful Overlap (z-10)
            ===================================================================== */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Narrative Column (6 Cols on Desktop, Layered Above with Full Interactivity) */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center relative z-20 pointer-events-auto">
            {/* Header Section */}
            <div ref={headerRef} className="mb-8">
              {/* Eyebrow Label */}
              <div className="flex items-center gap-3 mb-5">
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    color: '#D4B276',
                    fontWeight: 600,
                  }}
                >
                  03 // THE STUDIO
                </span>
                <div
                  style={{
                    width: '38px',
                    height: '1px',
                    background: '#D4B276',
                    opacity: 0.45,
                  }}
                />
              </div>

              {/* Main Headline */}
              <h2
                id="about-heading"
                className="font-display font-light leading-[1.05] tracking-tight"
                style={{
                  fontSize: 'clamp(3.2rem, 5.5vw, 5rem)',
                }}
              >
                <span style={{ color: '#F5F0E8' }}>Built on </span>
                <span
                  className="italic font-normal"
                  style={{
                    background: 'linear-gradient(135deg, #ECC87A 0%, #D4B276 50%, #9A7A4A 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Precision.
                </span>
              </h2>
            </div>

            {/* Three Concise Narrative Blocks & Pull Quote */}
            <div ref={narrativeRef} className="flex flex-col gap-6 max-w-xl">
              {/* Block 1: Main Introduction */}
              <p
                className="font-sans text-base sm:text-[1.08rem] leading-relaxed"
                style={{
                  color: 'rgba(245, 240, 232, 0.88)',
                  fontWeight: 350,
                  lineHeight: 1.75,
                }}
              >
                QUISTER TECHNOLOGIES is an independent digital engineering studio working at
                the intersection of thoughtful design, software architecture and interactive technology.
              </p>

              {/* Block 2: Our Approach & Production Systems */}
              <p
                className="font-sans text-sm sm:text-[0.98rem] leading-relaxed"
                style={{
                  color: 'rgba(245, 240, 232, 0.65)',
                  fontWeight: 300,
                  lineHeight: 1.75,
                }}
              >
                From complex wholesale commerce platforms and local retail mobile ecosystems
                to intelligent circular telemetry systems, we bring together creative thinking
                and rigorous engineering to build experiences that are purposeful, scalable and refined.
              </p>

              {/* Block 3: Our Philosophy & Lifecycle Ownership */}
              <p
                className="font-sans text-sm sm:text-[0.98rem] leading-relaxed"
                style={{
                  color: 'rgba(245, 240, 232, 0.65)',
                  fontWeight: 300,
                  lineHeight: 1.75,
                }}
              >
                We believe great digital products should be beautiful to experience and dependable
                beneath the surface. We take responsibility for the details, from initial system
                architecture to global deployment.
              </p>

              {/* Highlighted Editorial Pull Quote */}
              <div
                className="my-3 py-4 pl-6 border-l-2"
                style={{
                  borderColor: '#D4B276',
                  background: 'rgba(212, 178, 118, 0.03)',
                }}
              >
                <p
                  className="font-display italic text-xl sm:text-2xl tracking-tight"
                  style={{
                    color: '#F5F0E8',
                    lineHeight: 1.45,
                  }}
                >
                  &ldquo;Precision in engineering. Purpose in design.&rdquo;
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault()
                    smoothScrollTo('#contact', { offset: -30, duration: 1.2 })
                  }}
                  className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-mono text-xs tracking-wider uppercase font-semibold transition-all duration-300 group"
                  style={{
                    backgroundColor: '#D4B276',
                    color: '#090A0E',
                    boxShadow: '0 8px 24px -6px rgba(212, 178, 118, 0.35)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ECC87A'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#D4B276'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <span>Initiate Architecture Discussion</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>

          {/* 3D Precision Sculpture Column (Expanded canvas with graceful overlap behind text) */}
          <div
            ref={sculptureWrapperRef}
            className="lg:col-span-6 xl:col-span-6 w-full relative z-10 flex items-center justify-center pointer-events-none"
          >
            <div className="w-full lg:-ml-28 xl:-ml-40 2xl:-ml-52 lg:w-[calc(100%+7rem)] xl:w-[calc(100%+10rem)] 2xl:w-[calc(100%+13rem)] flex items-center justify-center pointer-events-none">
              <PrecisionSculpture scrollProgress={scrollProgress} />
            </div>
          </div>
        </div>

        {/* =====================================================================
            THREE REFINED EDITORIAL STUDIO PRINCIPLES (Bottom Row)
            ===================================================================== */}
        <StudioPrinciples />
      </div>
    </section>
  )
}
