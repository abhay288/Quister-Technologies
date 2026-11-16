import { useRef, useEffect } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { gsap } from 'gsap'
import { navigateTo } from '../../utils/router'
import { smoothScrollTo } from '../../utils/smoothScroll'

export default function ServicesHero() {
  const containerRef = useRef<HTMLElement>(null)
  const headerContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      if (headerContentRef.current) {
        gsap.fromTo(
          headerContentRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.1,
          }
        )
      }
    }, el)

    return () => ctx.revert()
  }, [])

  const handleExploreClick = () => {
    smoothScrollTo('#capability-chapters', { offset: -40, duration: 1.2 })
  }

  const handleStartProjectClick = () => {
    navigateTo('/', '#contact')
  }

  return (
    <section
      ref={containerRef}
      id="services-hero"
      data-scroll-section
      className="relative w-full pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24 overflow-hidden"
      style={{
        background: '#09090E',
        color: '#F8F5EE',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* Subtle Atmospheric Ambient Lighting */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(201, 164, 102, 0.07) 0%, transparent 70%)',
        }}
      />

      <div className="container-wide relative z-10">
        <div ref={headerContentRef} className="max-w-5xl xl:max-w-6xl">
          {/* Eyebrow Label */}
          <div className="flex items-center gap-3 mb-5 sm:mb-6">
            <span className="w-2 h-2 rounded-full bg-[#D4B276] animate-pulse" />
            <span
              className="font-mono text-xs tracking-[0.24em] uppercase font-semibold"
              style={{ color: '#D4B276' }}
            >
              CAPABILITIES // WHAT WE BUILD
            </span>
            <div
              className="w-12 h-[1px]"
              style={{ backgroundColor: '#D4B276', opacity: 0.4 }}
            />
          </div>

          {/* Main Headline with Champagne Accent */}
          <h1
            className="font-display font-light leading-[1.03] tracking-tight mb-6 sm:mb-8"
            style={{
              fontSize: 'clamp(2.85rem, 5.8vw, 5.25rem)',
            }}
          >
            <span>Technology, shaped around </span>
            <span
              className="italic font-normal block sm:inline"
              style={{
                background: 'linear-gradient(135deg, #F3E0B5 0%, #D4B276 50%, #9A7A4A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              your ambition.
            </span>
          </h1>

          {/* Expanded Width Narrative Copy */}
          <div className="space-y-5 max-w-4xl xl:max-w-5xl mb-10 sm:mb-12">
            <p
              className="font-sans text-base sm:text-lg lg:text-[1.2rem] leading-relaxed font-light"
              style={{ color: 'rgba(248, 245, 238, 0.90)', lineHeight: 1.75 }}
            >
              From public-facing web platforms and mobile ecosystems to transactional business
              engines and intelligent systems, we architect and engineer bespoke software built
              to perform under real-world demand.
            </p>
            <p
              className="font-sans text-sm sm:text-base lg:text-[1.05rem] leading-relaxed font-light"
              style={{ color: 'rgba(248, 245, 238, 0.65)', lineHeight: 1.8 }}
            >
              We do not assemble fragile templates or apply one-size-fits-all recipes. Every
              engagement is grounded in rigorous technical planning, clean modular codebases,
              and an unwavering standard for aesthetic precision.
            </p>
          </div>

          {/* Dual CTA Actions */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-5 mb-14 sm:mb-16">
            <button
              type="button"
              onClick={handleExploreClick}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-mono text-xs tracking-wider uppercase font-semibold transition-all duration-300 group"
              style={{
                backgroundColor: '#D4B276',
                color: '#09090E',
                boxShadow: '0 10px 28px -6px rgba(212, 178, 118, 0.35)',
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
              <span>Explore Our Capabilities</span>
              <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>

            <button
              type="button"
              onClick={handleStartProjectClick}
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full font-mono text-xs tracking-wider uppercase font-medium transition-all duration-300 group"
              style={{
                border: '1px solid rgba(248, 245, 238, 0.22)',
                color: '#F8F5EE',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#D4B276'
                e.currentTarget.style.color = '#ECC87A'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(248, 245, 238, 0.22)'
                e.currentTarget.style.color = '#F8F5EE'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Quick Capability Nav Matrix */}
          <div
            className="pt-8 border-t max-w-5xl xl:max-w-6xl"
            style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
          >
            <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-stone-400 mb-4">
              PRIMARY DISCIPLINES & ARCHITECTURES
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  num: '01',
                  label: 'DIGITAL EXPERIENCES',
                  sub: 'Web • Mobile • UI/UX Architecture',
                  target: '#family-digital-products',
                },
                {
                  num: '02',
                  label: 'BUSINESS ENGINEERING',
                  sub: 'Commerce • Custom Software & Systems',
                  target: '#family-business-systems',
                },
                {
                  num: '03',
                  label: 'ADVANCED TECH',
                  sub: 'Applied AI • 3D & WebGL Experiences',
                  target: '#family-advanced-tech',
                },
              ].map((item) => (
                <button
                  key={item.num}
                  type="button"
                  onClick={() => smoothScrollTo(item.target, { offset: -30, duration: 1.0 })}
                  className="text-left p-4 sm:p-5 rounded-xl transition-all duration-200 group"
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(212, 178, 118, 0.35)'
                    e.currentTarget.style.background = 'rgba(212, 178, 118, 0.04)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold text-[#D4B276]">
                      {item.num}
                    </span>
                    <ArrowDown className="w-3.5 h-3.5 text-stone-500 transition-transform duration-200 group-hover:translate-y-0.5 group-hover:text-[#D4B276]" />
                  </div>
                  <div className="font-mono text-xs sm:text-[13px] font-semibold text-[#F8F5EE] tracking-wide mb-1">
                    {item.label}
                  </div>
                  <div className="font-sans text-xs text-stone-400 font-light truncate">
                    {item.sub}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
