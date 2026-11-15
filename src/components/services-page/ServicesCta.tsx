import { ArrowUpRight, Shield, Clock, FileCheck } from 'lucide-react'
import { navigateTo } from '../../utils/router'

export default function ServicesCta() {
  const handleStartProject = () => {
    navigateTo('/', '#contact')
  }

  const handleExploreWork = () => {
    navigateTo('/', '#work')
  }

  return (
    <section
      id="services-cta"
      data-scroll-section
      className="relative w-full py-24 sm:py-32 lg:py-36 overflow-hidden"
      style={{
        backgroundColor: '#09090E',
        color: '#F8F5EE',
      }}
    >
      {/* Background Radial Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(201, 164, 102, 0.1) 0%, transparent 70%)',
        }}
      />

      <div className="container-wide relative z-10 text-center max-w-4xl mx-auto">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-3 mb-6 px-4 py-1.5 rounded-full"
          style={{
            backgroundColor: 'rgba(212, 178, 118, 0.08)',
            border: '1px solid rgba(212, 178, 118, 0.2)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4B276] animate-pulse" />
          <span
            className="font-mono text-[11px] tracking-[0.24em] uppercase font-semibold"
            style={{ color: '#D4B276' }}
          >
            INITIATE A CONVERSATION
          </span>
        </div>

        {/* Headline */}
        <h2
          className="font-display font-light leading-[1.06] tracking-tight mb-6"
          style={{ fontSize: 'clamp(2.5rem, 5.2vw, 4.4rem)' }}
        >
          Ready to turn ambition into
          <br />
          <span
            className="italic font-normal"
            style={{
              background: 'linear-gradient(135deg, #F3E0B5 0%, #D4B276 50%, #9A7A4A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            production?
          </span>
        </h2>

        {/* Subtitle */}
        <p
          className="font-sans text-base sm:text-lg leading-relaxed font-light mb-10 max-w-2xl mx-auto"
          style={{ color: 'rgba(248, 245, 238, 0.76)' }}
        >
          Tell us about your digital product requirements, architecture considerations, and target
          timeline. We will review your brief and prepare a structured preliminary assessment.
        </p>

        {/* Dual Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 mb-14">
          <button
            type="button"
            onClick={handleStartProject}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-mono text-xs tracking-wider uppercase font-semibold transition-all duration-300 group"
            style={{
              backgroundColor: '#D4B276',
              color: '#09090E',
              boxShadow: '0 10px 28px -6px rgba(212, 178, 118, 0.4)',
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
            <span>Start a Project</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          <button
            type="button"
            onClick={handleExploreWork}
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
            <span>Explore Our Work</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Studio Guarantees Row */}
        <div
          className="pt-8 border-t max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4"
          style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
        >
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-stone-400">
            <Clock className="w-3.5 h-3.5 text-[#D4B276]" />
            <span>24–48h Response Window</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-stone-400">
            <Shield className="w-3.5 h-3.5 text-[#D4B276]" />
            <span>Mutual NDA Protection</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-stone-400">
            <FileCheck className="w-3.5 h-3.5 text-[#D4B276]" />
            <span>Clear Milestone Scope</span>
          </div>
        </div>
      </div>
    </section>
  )
}
