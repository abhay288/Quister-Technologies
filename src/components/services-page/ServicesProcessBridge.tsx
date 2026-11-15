import { ArrowUpRight } from 'lucide-react'
import { navigateTo } from '../../utils/router'

export default function ServicesProcessBridge() {
  const handleProcessClick = () => {
    navigateTo('/process')
  }

  return (
    <section
      id="services-process-bridge"
      data-scroll-section
      className="relative w-full py-20 sm:py-24 lg:py-28 overflow-hidden"
      style={{
        backgroundColor: '#0D0E14',
        color: '#F8F5EE',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="container-wide relative z-10">
        <div
          className="rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, rgba(26, 28, 38, 0.6) 0%, rgba(13, 14, 20, 0.95) 100%)',
            border: '1px solid rgba(212, 178, 118, 0.25)',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
          }}
        >
          {/* Subtle Ambient Radial Highlight */}
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
            style={{
              background: 'radial-gradient(circle, #D4B276 0%, transparent 70%)',
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Narrative */}
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="font-mono text-xs tracking-[0.24em] uppercase font-semibold"
                  style={{ color: '#D4B276' }}
                >
                  THE LIFECYCLE // HOW WE BUILD
                </span>
                <div
                  className="w-10 h-[1px]"
                  style={{ backgroundColor: '#D4B276', opacity: 0.4 }}
                />
              </div>

              <h2
                className="font-display font-light leading-[1.08] tracking-tight mb-5"
                style={{ fontSize: 'clamp(2.1rem, 3.8vw, 3.2rem)' }}
              >
                From the first conversation
                <br />
                <span
                  className="italic font-normal"
                  style={{
                    background: 'linear-gradient(135deg, #F3E0B5 0%, #D4B276 50%, #9A7A4A 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  to the final handover.
                </span>
              </h2>

              <p
                className="font-sans text-base sm:text-lg leading-relaxed font-light mb-8 max-w-2xl"
                style={{ color: 'rgba(248, 245, 238, 0.78)' }}
              >
                Capabilities mean little without disciplined execution. Our structured five-stage
                delivery framework provides continuous transparency, milestone verification, and
                unwavering code quality from kickoff to post-launch support.
              </p>

              {/* Six Phase Micro-Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-8">
                {[
                  '01 DISCOVERY & STRATEGY',
                  '02 ARCHITECTURE & PLANNING',
                  '03 EXPERIENCE & DESIGN',
                  '04 DEVELOPMENT & INTEGRATION',
                  '05 TESTING & QA',
                  '06 DEPLOYMENT & SUPPORT',
                ].map((phase, idx) => (
                  <span
                    key={phase}
                    className="font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: idx === 0 ? '#ECC87A' : 'rgba(248, 245, 238, 0.65)',
                    }}
                  >
                    {phase}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Action Button */}
            <div className="lg:col-span-4 flex lg:justify-end">
              <button
                type="button"
                onClick={handleProcessClick}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-mono text-xs tracking-wider uppercase font-semibold transition-all duration-300 group"
                style={{
                  backgroundColor: '#D4B276',
                  color: '#09090E',
                  boxShadow: '0 10px 30px -6px rgba(212, 178, 118, 0.4)',
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
                <span>Explore Our Process</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
