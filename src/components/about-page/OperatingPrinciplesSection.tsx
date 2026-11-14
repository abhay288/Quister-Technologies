import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Compass, KeyRound, Layers, Users } from 'lucide-react'
import { CORE_PRINCIPLES, CorePrinciple } from './aboutPageData'

gsap.registerPlugin(ScrollTrigger)

const PRINCIPLE_ICONS: Record<CorePrinciple['icon'], typeof Users> = {
  users: Users,
  compass: Compass,
  layers: Layers,
  key: KeyRound,
}

export default function OperatingPrinciplesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !sectionRef.current || !gridRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        gridRef.current!.children,
        { y: 18, opacity: 0 },
        {
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            once: true,
          },
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="operating-principles"
      ref={sectionRef}
      data-scroll-section="PRINCIPLES"
      aria-labelledby="principles-heading"
      style={{
        background: '#101016',
        color: '#F3EFE8',
        padding: 'clamp(4.5rem, 8vw, 7rem) 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <div className="container-wide">
        <div className="max-w-2xl mb-12">
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
              02 // HOW WE OPERATE
            </span>
            <span aria-hidden="true" style={{ width: '36px', height: '1px', background: '#C9A466', opacity: 0.45 }} />
          </div>

          <h2
            id="principles-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.35rem, 4.3vw, 4.1rem)',
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: '-0.015em',
              color: '#F8F5EF',
            }}
          >
            What we never{' '}
            <span className="italic" style={{ color: '#D9B978' }}>
              compromise.
            </span>
          </h2>
        </div>

        {/* Crisp 2x2 Editorial Grid with Icons */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-7">
          {CORE_PRINCIPLES.map((item) => {
            const Icon = PRINCIPLE_ICONS[item.icon]
            return (
              <article
                key={item.number}
                className="p-7 sm:p-8 rounded-xl transition-colors duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201, 164, 102, 0.4)'
                  e.currentTarget.style.background = 'rgba(201, 164, 102, 0.03)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.2em',
                      color: '#C9A466',
                      fontWeight: 600,
                    }}
                  >
                    {item.number}
                  </span>
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{
                      background: 'rgba(201, 164, 102, 0.09)',
                      border: '1px solid rgba(201, 164, 102, 0.25)',
                      color: '#D9B978',
                    }}
                  >
                    <Icon size={17} strokeWidth={1.6} />
                  </div>
                </div>

                <h3
                  className="mb-2.5"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.55rem, 2.2vw, 2rem)',
                    fontWeight: 400,
                    lineHeight: 1.15,
                    color: '#F8F5EF',
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.94rem',
                    lineHeight: 1.7,
                    color: 'rgba(243, 239, 232, 0.68)',
                    fontWeight: 300,
                  }}
                >
                  {item.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
