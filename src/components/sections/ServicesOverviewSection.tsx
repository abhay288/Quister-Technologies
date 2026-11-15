import { MouseEvent } from 'react'
import { ArrowUpRight, Layers, Code2, Cpu } from 'lucide-react'
import { navigateTo } from '../../utils/router'

interface ServiceFamilyOverview {
  number: string
  title: string
  category: string
  description: string
  highlights: string[]
  icon: typeof Layers
}

const OVERVIEW_FAMILIES: ServiceFamilyOverview[] = [
  {
    number: '01',
    title: 'Digital Experiences',
    category: 'WEB & MOBILE ENGINEERING',
    description:
      'Responsive web platforms, cross-platform mobile apps, and refined UI/UX design systems crafted for intuitive interaction and performance.',
    highlights: ['Web & Digital Platforms', 'Android & Flutter Apps', 'Interface & Design Systems'],
    icon: Layers,
  },
  {
    number: '02',
    title: 'Business Engineering',
    category: 'COMMERCE & CUSTOM SYSTEMS',
    description:
      'Bespoke commerce engines, operational dashboards, and backend architectures designed to give businesses reliable control over their digital processes.',
    highlights: ['E-Commerce Platforms', 'Custom Business Software', 'REST APIs & Data Schemas'],
    icon: Code2,
  },
  {
    number: '03',
    title: 'Advanced Technology',
    category: 'APPLIED AI & INTERACTIVE 3D',
    description:
      'Intelligent workflows powered by applied machine learning alongside spatial 3D computing and WebGL environments that push browser boundaries.',
    highlights: ['Applied AI & LLM Workflows', 'Three.js & WebGL Visuals', 'GPU Shader Choreography'],
    icon: Cpu,
  },
]

export default function ServicesOverviewSection() {
  const handleExploreAll = (e: MouseEvent) => {
    e.preventDefault()
    navigateTo('/services')
  }

  return (
    <section
      id="services-overview"
      data-scroll-section
      aria-label="Capabilities Overview"
      className="relative w-full py-20 sm:py-28 lg:py-32 overflow-hidden"
      style={{
        backgroundColor: '#07080C',
        color: '#F8F5EE',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* Background Ambience */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(201, 164, 102, 0.08) 0%, transparent 70%)',
        }}
      />

      <div className="container-wide relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 sm:mb-18 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <span
                className="font-mono text-xs tracking-[0.24em] uppercase font-semibold"
                style={{ color: '#D4B276' }}
              >
                02 // CAPABILITIES
              </span>
              <div
                className="w-10 h-[1px]"
                style={{ backgroundColor: '#D4B276', opacity: 0.4 }}
              />
            </div>

            <h2
              className="font-display font-light leading-[1.08] tracking-tight"
              style={{ fontSize: 'clamp(2.3rem, 4.4vw, 3.8rem)' }}
            >
              Technology, shaped around
              <br />
              <span
                className="italic font-normal"
                style={{
                  background: 'linear-gradient(135deg, #F3E0B5 0%, #D4B276 50%, #9A7A4A 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                your ambition.
              </span>
            </h2>
          </div>

          {/* Understated, elegant link to /services */}
          <div className="shrink-0">
            <a
              href="/services"
              onClick={handleExploreAll}
              className="inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.18em] uppercase font-semibold transition-all duration-300 group"
              style={{ color: '#D4B276' }}
            >
              <span className="border-b border-[#D4B276]/40 pb-0.5 group-hover:border-[#D4B276] transition-colors">
                Explore All Services
              </span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* 3 Concise Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {OVERVIEW_FAMILIES.map((family) => {
            const Icon = family.icon
            return (
              <div
                key={family.number}
                className="p-7 sm:p-8 rounded-2xl transition-all duration-300 group flex flex-col justify-between"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 178, 118, 0.35)'
                  e.currentTarget.style.backgroundColor = 'rgba(212, 178, 118, 0.025)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)'
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'
                }}
              >
                <div>
                  {/* Top Category Badge & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className="font-mono text-xs tracking-wider font-semibold"
                      style={{ color: '#D4B276' }}
                    >
                      {family.number} // {family.category}
                    </span>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: 'rgba(212, 178, 118, 0.08)',
                        color: '#D4B276',
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-2xl font-light tracking-tight text-[#F8F5EE] mb-3 group-hover:text-[#ECC87A] transition-colors duration-200">
                    {family.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="font-sans text-sm leading-relaxed font-light mb-6"
                    style={{ color: 'rgba(248, 245, 238, 0.65)' }}
                  >
                    {family.description}
                  </p>

                  {/* Discipline Focus Bullets */}
                  <ul className="space-y-2 mb-8">
                    {family.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2.5 text-xs font-mono tracking-wide text-stone-300"
                      >
                        <span className="w-1 h-1 rounded-full bg-[#D4B276]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Bottom Link */}
                <div
                  className="pt-4 border-t flex items-center justify-between"
                  style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}
                >
                  <a
                    href="/services"
                    onClick={handleExploreAll}
                    className="font-mono text-[11px] tracking-wider uppercase text-[#D4B276] flex items-center gap-1.5 transition-colors group-hover:text-[#ECC87A]"
                  >
                    <span>View Specifications</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
