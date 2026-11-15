import { Fragment } from 'react'
import { TECH_STACK_CATEGORIES } from './servicesData'

export default function ServicesTechStack() {
  return (
    <section
      id="services-tech-stack"
      data-scroll-section
      className="relative w-full py-20 sm:py-28 lg:py-32 overflow-hidden"
      style={{
        backgroundColor: '#09090E',
        color: '#F8F5EE',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="container-wide relative z-10">
        {/* Section Header */}
        <div className="mb-14 sm:mb-18 lg:mb-20 max-w-3xl">
          <div className="flex items-center gap-3 mb-5">
            <span
              className="font-mono text-xs tracking-[0.24em] uppercase font-semibold"
              style={{ color: '#D4B276' }}
            >
              TECHNOLOGY // STACK & TOOLS
            </span>
            <div
              className="w-10 h-[1px]"
              style={{ backgroundColor: '#D4B276', opacity: 0.4 }}
            />
          </div>

          <h2
            className="font-display font-light leading-[1.08] tracking-tight mb-5"
            style={{ fontSize: 'clamp(2.3rem, 4.2vw, 3.6rem)' }}
          >
            The right tools
            <br />
            <span
              className="italic font-normal"
              style={{
                background: 'linear-gradient(135deg, #F3E0B5 0%, #D4B276 50%, #9A7A4A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              for the work.
            </span>
          </h2>

          <p
            className="font-sans text-base sm:text-lg leading-relaxed font-light"
            style={{ color: 'rgba(248, 245, 238, 0.72)' }}
          >
            We select technologies for longevity, developer velocity, and proven production resilience.
            Our core stack reflects modern engineering standards without unnecessary dependencies.
          </p>
        </div>

        {/* Compact Tech Stack Lines */}
        <div
          className="rounded-2xl divide-y overflow-hidden"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.015)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderColor: 'rgba(255, 255, 255, 0.08)',
          }}
        >
          {TECH_STACK_CATEGORIES.map((cat) => (
            <div
              key={cat.category}
              className="p-6 sm:p-7 transition-colors duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(212, 178, 118, 0.03)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {/* Category Identifier */}
              <div className="flex items-center gap-4 md:w-5/12">
                <span
                  className="font-mono text-[11px] font-semibold px-2.5 py-1 rounded"
                  style={{
                    backgroundColor: 'rgba(212, 178, 118, 0.1)',
                    color: '#D4B276',
                  }}
                >
                  {cat.category}
                </span>
                <span className="font-mono text-xs sm:text-sm uppercase tracking-wider text-[#F8F5EE] group-hover:text-[#ECC87A] transition-colors duration-200 font-medium">
                  {cat.label}
                </span>
              </div>

              {/* Technology Dots Line */}
              <div className="md:w-7/12 flex flex-wrap items-center gap-x-3 gap-y-2">
                {cat.technologies.map((tech, tIdx) => (
                  <Fragment key={tech}>
                    <span className="font-sans text-sm sm:text-[15px] font-light text-stone-300">
                      {tech}
                    </span>
                    {tIdx < cat.technologies.length - 1 && (
                      <span className="text-[#D4B276] opacity-40 text-xs">•</span>
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
