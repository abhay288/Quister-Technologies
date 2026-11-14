import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TECH_STACK_ITEMS } from './aboutPageData'
import TechBrandIcon, { TECH_BRAND_ACCENTS } from './TechBrandIcon'

gsap.registerPlugin(ScrollTrigger)

export default function TechnologyExpertiseSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !sectionRef.current || !gridRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        gridRef.current!.children,
        { y: 14, opacity: 0 },
        {
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 86%',
            once: true,
          },
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.04,
          ease: 'power3.out',
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="technology-expertise"
      ref={sectionRef}
      data-scroll-section="EXPERTISE"
      aria-labelledby="technology-heading"
      style={{
        background: '#F8F5EF',
        color: '#101016',
        padding: 'clamp(4.5rem, 8vw, 7rem) 0',
        borderTop: '1px solid rgba(16, 16, 22, 0.08)',
      }}
    >
      <div className="container-wide">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
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
                03 // TECHNOLOGY
              </span>
              <span aria-hidden="true" style={{ width: '36px', height: '1px', background: '#C9A466' }} />
            </div>

            <h2
              id="technology-heading"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.35rem, 4.3vw, 4.1rem)',
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: '-0.015em',
                color: '#101016',
              }}
            >
              The right tools{' '}
              <span className="italic" style={{ color: '#8B6B35' }}>
                for the work.
              </span>
            </h2>
          </div>

          <p
            className="max-w-sm"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.92rem',
              lineHeight: 1.65,
              color: 'rgba(16, 16, 22, 0.65)',
            }}
          >
            Modern, maintainable technologies chosen around product needs rather than hype.
          </p>
        </div>

        {/* 4-Column Icon Card Grid: Monochrome at rest -> Authentic Brand Color on hover */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TECH_STACK_ITEMS.map((item) => {
            const isHovered = hoveredId === item.id
            const brandAccent = TECH_BRAND_ACCENTS[item.id]

            return (
              <article
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(item.id)}
                onBlur={() => setHoveredId(null)}
                className="group p-5 rounded-xl flex items-start gap-4 transition-all duration-300 cursor-default"
                style={{
                  background: '#FFFFFF',
                  border: isHovered
                    ? `1px solid ${brandAccent.border}`
                    : '1px solid rgba(16, 16, 22, 0.09)',
                  boxShadow: isHovered
                    ? '0 14px 30px -14px rgba(16, 16, 22, 0.16)'
                    : '0 6px 18px -12px rgba(16, 16, 22, 0.12)',
                  transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                }}
              >
                {/* Brand SVG Icon Box */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300"
                  style={{
                    background: isHovered ? brandAccent.softBg : '#F5F0E6',
                    border: isHovered
                      ? `1px solid ${brandAccent.border}`
                      : '1px solid rgba(16, 16, 22, 0.08)',
                    color: '#101016',
                  }}
                >
                  <TechBrandIcon id={item.id} active={isHovered} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      aria-hidden="true"
                      className="w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300"
                      style={{ background: isHovered ? brandAccent.hex : '#C9A466' }}
                    />
                    <h3
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.94rem',
                        fontWeight: 600,
                        lineHeight: 1.25,
                        color: '#101016',
                      }}
                    >
                      {item.name}
                    </h3>
                  </div>

                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.78rem',
                      lineHeight: 1.5,
                      color: 'rgba(16, 16, 22, 0.62)',
                    }}
                  >
                    {item.summary}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
