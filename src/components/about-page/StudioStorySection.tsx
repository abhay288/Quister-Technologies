import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FOUNDER_PROFILE_CONFIG } from './aboutPageData'

gsap.registerPlugin(ScrollTrigger)

export default function StudioStorySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !sectionRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 20, opacity: 0 },
        {
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 85%',
            once: true,
          },
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'power3.out',
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const profile = FOUNDER_PROFILE_CONFIG
  const hasPortrait = Boolean(profile.portraitUrl && profile.portraitUrl.trim())
  const hasName = Boolean(profile.name && profile.name.trim())

  return (
    <section
      id="why-we-exist"
      ref={sectionRef}
      data-scroll-section="STUDIO"
      aria-labelledby="why-we-exist-heading"
      style={{
        background: '#F3EFE8',
        color: '#101016',
        padding: 'clamp(4.5rem, 8vw, 7rem) 0',
        borderTop: '1px solid rgba(16, 16, 22, 0.08)',
      }}
    >
      <div className="container-wide">
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Narrative */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: '#8B6B35',
                  fontWeight: 600,
                }}
              >
                01 // THE STUDIO
              </span>
              <span aria-hidden="true" style={{ width: '36px', height: '1px', background: '#C9A466' }} />
            </div>

            <h2
              id="why-we-exist-heading"
              className="mb-6"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.35rem, 4.3vw, 4.1rem)',
                fontWeight: 400,
                lineHeight: 1.06,
                letterSpacing: '-0.015em',
                color: '#101016',
              }}
            >
              Small by design. Built around details that{' '}
              <span className="italic" style={{ color: '#8B6B35' }}>
                matter.
              </span>
            </h2>

            {hasName && (
              <p
                className="mb-4"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#8B6B35',
                }}
              >
                {profile.name} — {profile.role}
              </p>
            )}

            <div className="space-y-4 max-w-2xl">
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(0.98rem, 1.1vw, 1.08rem)',
                  lineHeight: 1.78,
                  color: 'rgba(16, 16, 22, 0.88)',
                }}
              >
                QUISTER TECHNOLOGIES unites editorial visual craft and resilient software engineering
                in one compact, founder-led studio — avoiding bloated agency layers and templated
                shortcuts.
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.96rem',
                  lineHeight: 1.78,
                  color: 'rgba(16, 16, 22, 0.68)',
                }}
              >
                Every engagement receives direct technical involvement from initial architecture
                through production launch.
              </p>
            </div>
          </div>

          {/* Right Minimal Studio Emblem Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div
              className="w-full max-w-[380px] rounded-2xl overflow-hidden p-8 flex flex-col justify-between relative"
              style={{
                minHeight: '270px',
                background: hasPortrait ? '#101016' : 'linear-gradient(155deg, #12121A 0%, #09090E 100%)',
                border: '1px solid rgba(201, 164, 102, 0.28)',
                boxShadow: '0 22px 50px -24px rgba(16, 16, 22, 0.25)',
                color: '#F3EFE8',
              }}
            >
              {hasPortrait ? (
                <img
                  src={profile.portraitUrl as string}
                  alt={hasName ? (profile.name as string) : 'QUISTER TECHNOLOGIES Studio'}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.625rem',
                        letterSpacing: '0.2em',
                        color: '#C9A466',
                      }}
                    >
                      {profile.role}
                    </span>
                    <span
                      aria-hidden="true"
                      style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#C9A466' }}
                    />
                  </div>

                  <div className="my-6 flex items-center gap-5">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        border: '1px solid rgba(201, 164, 102, 0.45)',
                        background: 'rgba(201, 164, 102, 0.1)',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.75rem',
                          color: '#F8F5EF',
                        }}
                      >
                        {profile.monogram}
                      </span>
                    </div>
                    <p
                      className="italic"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.35rem',
                        lineHeight: 1.3,
                        color: 'rgba(248, 245, 239, 0.92)',
                      }}
                    >
                      &ldquo;Design earns attention; engineering earns permanence.&rdquo;
                    </p>
                  </div>

                  <div
                    className="pt-4 flex items-center justify-between"
                    style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.5625rem',
                        letterSpacing: '0.18em',
                        color: 'rgba(243, 239, 232, 0.5)',
                      }}
                    >
                      QUISTER TECHNOLOGIES
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.5625rem',
                        letterSpacing: '0.18em',
                        color: '#D9B978',
                      }}
                    >
                      INDEPENDENT
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
