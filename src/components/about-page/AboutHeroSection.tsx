import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowUpRight } from 'lucide-react'
import AboutHeroSculpture3D from './AboutHeroSculpture3D'
import { navigateTo } from '../../utils/router'

export default function AboutHeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const copyColRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !sectionRef.current) return

    const ctx = gsap.context(() => {
      if (copyColRef.current) {
        gsap.from(copyColRef.current.children, {
          y: 16,
          opacity: 0.01,
          duration: 0.65,
          stagger: 0.06,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about-hero"
      ref={sectionRef}
      data-scroll-section="ABOUT"
      aria-labelledby="about-hero-heading"
      style={{
        background: '#09090E',
        color: '#F3EFE8',
        paddingTop: 'clamp(7rem, 12vh, 9.5rem)',
        paddingBottom: 'clamp(4rem, 7vw, 6.5rem)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 50% at 72% 45%, rgba(118, 80, 181, 0.14) 0%, rgba(201, 164, 102, 0.06) 42%, rgba(9, 9, 14, 0) 75%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        className="grid-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.14,
          pointerEvents: 'none',
        }}
      />

      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* LEFT COLUMN */}
          <div ref={copyColRef} className="lg:col-span-6 xl:col-span-6 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-5">
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: '#C9A466',
                  fontWeight: 600,
                }}
              >
                ABOUT QUISTER TECHNOLOGIES
              </span>
              <span
                aria-hidden="true"
                style={{ width: '36px', height: '1px', background: '#C9A466', opacity: 0.45 }}
              />
            </div>

            <h1
              id="about-hero-heading"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.85rem, 5.2vw, 5.1rem)',
                fontWeight: 400,
                lineHeight: 1.03,
                letterSpacing: '-0.015em',
                color: '#F8F5EF',
                marginBottom: 'clamp(1.35rem, 2.5vh, 2rem)',
              }}
            >
              <span className="block">Independent by design.</span>
              <span
                className="block italic mt-1"
                style={{
                  background: 'linear-gradient(125deg, #F8F5EF 10%, #D9B978 58%, #B89AE5 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Engineering-led by default.
              </span>
            </h1>

            <p
              className="max-w-xl mb-8"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(0.98rem, 1.12vw, 1.1rem)',
                lineHeight: 1.76,
                fontWeight: 350,
                color: 'rgba(243, 239, 232, 0.84)',
              }}
            >
              QUISTER TECHNOLOGIES is an independent digital engineering studio combining thoughtful
              design, software architecture and modern technology to turn ambitious ideas into
              dependable digital products.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="/#work"
                onClick={(e) => {
                  e.preventDefault()
                  navigateTo('/', '#work')
                }}
                className="btn-primary rounded-full"
                style={{
                  backgroundColor: '#D9B978',
                  color: '#09090E',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  padding: '0.9rem 2rem',
                  boxShadow: '0 8px 28px rgba(201, 164, 102, 0.25)',
                }}
              >
                <span>EXPLORE OUR WORK</span>
              </a>

              <a
                href="/#contact"
                onClick={(e) => {
                  e.preventDefault()
                  navigateTo('/', '#contact')
                }}
                className="btn-secondary rounded-full"
                style={{
                  borderColor: 'rgba(201, 164, 102, 0.48)',
                  color: '#F3EFE8',
                  fontSize: '0.72rem',
                  letterSpacing: '0.14em',
                  padding: '0.9rem 2rem',
                }}
              >
                <span>START A PROJECT</span>
                <ArrowUpRight size={15} strokeWidth={1.8} />
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: 3D Sculpture */}
          <div className="lg:col-span-6 xl:col-span-6 w-full min-w-0 flex items-center justify-center">
            <AboutHeroSculpture3D />
          </div>
        </div>
      </div>
    </section>
  )
}
