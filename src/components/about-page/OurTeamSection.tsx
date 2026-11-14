import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { COMPACT_TEAM_CONFIG } from './aboutPageData'

gsap.registerPlugin(ScrollTrigger)

export default function OurTeamSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftColRef = useRef<HTMLDivElement>(null)
  const rightColRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !sectionRef.current) return

    const ctx = gsap.context(() => {
      if (leftColRef.current) {
        gsap.fromTo(
          leftColRef.current,
          { y: 24, opacity: 0 },
          {
            scrollTrigger: {
              trigger: leftColRef.current,
              start: 'top 85%',
              once: true,
            },
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: 'power3.out',
          }
        )
      }

      if (rightColRef.current) {
        gsap.fromTo(
          rightColRef.current,
          { y: 24, opacity: 0 },
          {
            scrollTrigger: {
              trigger: rightColRef.current,
              start: 'top 85%',
              once: true,
            },
            y: 0,
            opacity: 1,
            duration: 0.75,
            delay: 0.1,
            ease: 'power3.out',
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const config = COMPACT_TEAM_CONFIG

  return (
    <section
      id="our-team"
      ref={sectionRef}
      data-scroll-section="TEAM"
      aria-labelledby="our-team-heading"
      style={{
        background: '#09090E',
        color: '#F3EFE8',
        padding: 'clamp(4rem, 6.5vw, 5.75rem) 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Target anchor for backward compatibility with technology links */}
      <div id="technology-expertise" style={{ position: 'absolute', top: 0, left: 0 }} />

      {/* Subtle radial atmosphere */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '30%',
          right: '-5%',
          width: '520px',
          height: '520px',
          background:
            'radial-gradient(circle, rgba(201, 164, 102, 0.05) 0%, rgba(118, 80, 181, 0.025) 50%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        className="grid-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.08,
          pointerEvents: 'none',
        }}
      />

      <div className="container-wide relative z-10">
        {/* Main 2-Column Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ===================================================================
              LEFT COLUMN: Eyebrow + Heading + Description + 10+ Team Statistic
              =================================================================== */}
          <div ref={leftColRef} className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-4">
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
                  {config.eyebrow}
                </span>
                <span
                  aria-hidden="true"
                  style={{ width: '32px', height: '1px', background: '#C9A466', opacity: 0.45 }}
                />
              </div>

              {/* Main Heading */}
              <h2
                id="our-team-heading"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.35rem, 4.2vw, 3.8rem)',
                  fontWeight: 400,
                  lineHeight: 1.06,
                  letterSpacing: '-0.015em',
                  color: '#F8F5EF',
                  marginBottom: '1.25rem',
                }}
              >
                <span>{config.headlineMain}</span>
                <span
                  className="block italic mt-1"
                  style={{
                    background: 'linear-gradient(125deg, #F8F5EF 20%, #D9B978 70%, #B89AE5 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {config.headlineSub}
                </span>
              </h2>

              {/* Short Supporting Description */}
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(0.92rem, 1.05vw, 1rem)',
                  lineHeight: 1.74,
                  fontWeight: 300,
                  color: 'rgba(243, 239, 232, 0.74)',
                  maxWidth: '38ch',
                  marginBottom: 'clamp(2rem, 3.5vh, 2.75rem)',
                }}
              >
                {config.description}
              </p>
            </div>

            {/* Prominent 10+ Team Statistic */}
            <div
              className="pt-6 border-t border-white/10 flex items-baseline gap-4"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3.8rem, 6.2vw, 5.4rem)',
                  fontWeight: 400,
                  lineHeight: 0.9,
                  letterSpacing: '-0.03em',
                  color: '#D9B978',
                  textShadow: '0 0 35px rgba(217, 185, 120, 0.18)',
                }}
              >
                {config.statNumber}
              </span>
              <div className="flex flex-col">
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#C9A466',
                    fontWeight: 600,
                  }}
                >
                  {config.statLabel}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.78125rem',
                    color: 'rgba(243, 239, 232, 0.52)',
                    marginTop: '0.2rem',
                  }}
                >
                  Across engineering, systems & product design
                </span>
              </div>
            </div>
          </div>

          {/* ===================================================================
              RIGHT COLUMN: Technology Expertise Rows + Bottom Social Links
              =================================================================== */}
          <div ref={rightColRef} className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Technology Expertise Heading */}
              <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-white/10">
                <h3
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#C9A466',
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  {config.techHeading}
                </h3>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.5625rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'rgba(243, 239, 232, 0.4)',
                  }}
                >
                  SUPPORTED STACK // 05 DOMAINS
                </span>
              </div>

              {/* 5 Simple Elegant Text Rows with Thin Separators */}
              <div className="divide-y divide-white/10">
                {config.categories.map((cat) => (
                  <div
                    key={cat.category}
                    className="py-4 sm:py-4.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-6 group transition-colors duration-200"
                  >
                    {/* Category Label */}
                    <span
                      className="shrink-0"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.625rem',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: 'rgba(243, 239, 232, 0.5)',
                        minWidth: '175px',
                        transition: 'color 200ms',
                      }}
                    >
                      {cat.category}
                    </span>

                    {/* Simple Technologies Text Line */}
                    <p
                      className="m-0 sm:text-right"
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'clamp(0.95rem, 1.15vw, 1.05rem)',
                        fontWeight: 400,
                        color: '#F8F5EF',
                        lineHeight: 1.5,
                        letterSpacing: '0.01em',
                      }}
                    >
                      {cat.technologies.split('·').map((tech, i, arr) => (
                        <span key={tech}>
                          <span>{tech.trim()}</span>
                          {i < arr.length - 1 && (
                            <span
                              aria-hidden="true"
                              style={{
                                color: '#C9A466',
                                margin: '0 0.55rem',
                                opacity: 0.75,
                              }}
                            >
                              ·
                            </span>
                          )}
                        </span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ===================================================================
                BOTTOM: Professional GitHub & LinkedIn Links ONLY
                =================================================================== */}
            <div className="pt-6 sm:pt-8 mt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5625rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(243, 239, 232, 0.42)',
                }}
              >
                MIND BEHIND QUISTER TECHNOLOGIES // OWNERSHIP
              </span>

              <div className="flex items-center gap-6 sm:gap-8">
                {config.socialLinks
                  .filter((link) => Boolean(link.href))
                  .map((link) => (
                    <a
                      key={link.label}
                      href={link.href as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: 'rgba(243, 239, 232, 0.75)',
                        textDecoration: 'none',
                        transition: 'color 200ms',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#D9B978')}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = 'rgba(243, 239, 232, 0.75)')
                      }
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight
                        size={13}
                        strokeWidth={1.8}
                        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                      />
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
