import { useRef, useEffect } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { gsap } from 'gsap'
import ServicesHero3D from './ServicesHero3D'
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
      className="relative w-full pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pt-44 lg:pb-28 overflow-hidden"
      style={{
        background: '#09090E',
        color: '#F8F5EE',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* Subtle Atmospheric Ambient Lighting */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(201, 164, 102, 0.06) 0%, transparent 70%)',
        }}
      />

      <div className="container-wide relative z-10">
        {/* Main Grid: Left Narrative + Right 3D Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div ref={headerContentRef} className="lg:col-span-7 flex flex-col justify-center">
            {/* Eyebrow Label */}
            <div className="flex items-center gap-3 mb-6">
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
              className="font-display font-light leading-[1.04] tracking-tight mb-7"
              style={{
                fontSize: 'clamp(2.75rem, 5.2vw, 4.75rem)',
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

            {/* Primary & Secondary Copy */}
            <div className="space-y-4 max-w-2xl mb-9">
              <p
                className="font-sans text-base sm:text-lg leading-relaxed font-light"
                style={{ color: 'rgba(248, 245, 238, 0.88)' }}
              >
                From public-facing web platforms and mobile ecosystems to transactional business
                engines and intelligent systems, we architect and engineer bespoke software built
                to perform under real-world demand.
              </p>
              <p
                className="font-sans text-sm sm:text-base leading-relaxed font-light"
                style={{ color: 'rgba(248, 245, 238, 0.62)' }}
              >
                We do not assemble fragile templates or apply one-size-fits-all recipes. Every
                engagement is grounded in rigorous technical planning, clean modular codebases,
                and an unwavering standard for aesthetic precision.
              </p>
            </div>

            {/* Dual CTA Actions */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-5 mb-12">
              <button
                type="button"
                onClick={handleExploreClick}
                className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-mono text-xs tracking-wider uppercase font-semibold transition-all duration-300 group"
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
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full font-mono text-xs tracking-wider uppercase font-medium transition-all duration-300 group"
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
              className="pt-7 border-t"
              style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
            >
              <span className="block font-mono text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-3.5">
                PRIMARY DISCIPLINES & ARCHITECTURES
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    num: '01',
                    label: 'DIGITAL EXPERIENCES',
                    sub: 'Web • Mobile • UI/UX',
                    target: '#family-digital-products',
                  },
                  {
                    num: '02',
                    label: 'BUSINESS ENGINEERING',
                    sub: 'Commerce • Custom Software',
                    target: '#family-business-systems',
                  },
                  {
                    num: '03',
                    label: 'ADVANCED TECH',
                    sub: 'Applied AI • 3D & WebGL',
                    target: '#family-advanced-tech',
                  },
                ].map((item) => (
                  <button
                    key={item.num}
                    type="button"
                    onClick={() => smoothScrollTo(item.target, { offset: -30, duration: 1.0 })}
                    className="text-left p-3 rounded-lg transition-all duration-200 group"
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
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-semibold text-[#D4B276]">
                        {item.num}
                      </span>
                      <ArrowDown className="w-3 h-3 text-stone-500 transition-transform duration-200 group-hover:translate-y-0.5 group-hover:text-[#D4B276]" />
                    </div>
                    <div className="font-mono text-xs font-semibold text-[#F8F5EE] tracking-wide mb-0.5">
                      {item.label}
                    </div>
                    <div className="font-sans text-[11px] text-stone-400 font-light truncate">
                      {item.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Custom 3D Sculpture Installation */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="w-full max-w-[560px]">
              <ServicesHero3D />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
