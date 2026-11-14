import { Shield, Sparkles } from 'lucide-react'
import {
  ENGAGEMENT_STRUCTURE,
  PROOF_OF_CONCEPT_DATA,
  type EngagementPrinciple,
} from './processPhasesData'

export default function ProcessEngagementSection() {
  return (
    <div className="w-full mt-20 sm:mt-28 space-y-16 sm:space-y-20">
      {/* =====================================================================
          ENGAGEMENT STRUCTURE: HOW PROJECTS ARE STRUCTURED
          ===================================================================== */}
      <div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="font-mono text-xs tracking-[0.22em] uppercase font-semibold text-[#9A7A4A]">
                ENGAGEMENT STRUCTURE
              </span>
              <div className="w-8 h-[1px] bg-[#9A7A4A]/30" />
              <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#14161C]/50">
                HOW PROJECTS ARE STRUCTURED
              </span>
            </div>

            <h3
              className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] leading-[1.1] tracking-tight max-w-2xl"
              style={{ color: '#14161C' }}
            >
              Clear scope. Defined milestones.{' '}
              <span
                className="italic font-normal"
                style={{
                  background:
                    'linear-gradient(135deg, #A88349 0%, #D4B276 50%, #9A7A4A 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Transparent delivery.
              </span>
            </h3>
          </div>

          <p className="font-sans text-sm sm:text-base text-[#14161C]/70 max-w-md font-light leading-relaxed">
            We structure engagements around predictable stages and verifiable deliverables,
            ensuring both client and studio have complete clarity at every step.
          </p>
        </div>

        {/* 4-Item Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {ENGAGEMENT_STRUCTURE.map((item: EngagementPrinciple) => (
            <div
              key={item.number}
              className="rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:shadow-stone-900/5 group"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(20, 22, 28, 0.08)',
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs tracking-widest text-[#9A7A4A] font-semibold">
                    {item.number} // STRUCTURE
                  </span>
                  <div className="w-2 h-2 rounded-full bg-[#9A7A4A]/20 group-hover:bg-[#9A7A4A] transition-colors duration-300" />
                </div>

                <h4 className="font-display text-xl sm:text-[1.35rem] leading-snug tracking-tight mb-3 text-[#14161C]">
                  {item.title}
                </h4>

                <p className="font-sans text-xs sm:text-[13.5px] leading-relaxed text-[#14161C]/70 font-light">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-200/60">
                <span className="font-mono text-[10px] tracking-wider uppercase text-[#9A7A4A]/80 font-medium">
                  STAGE VERIFICATION
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================================
          OPTIONAL PROOF OF CONCEPT CALLOUT
          - Dark obsidian luxury card with champagne-gold architectural border
          ===================================================================== */}
      <div
        className="rounded-3xl p-8 sm:p-12 lg:p-14 relative overflow-hidden"
        style={{
          backgroundColor: '#0F1015',
          border: '1px solid rgba(201, 164, 102, 0.22)',
          boxShadow:
            '0 28px 64px -24px rgba(0, 0, 0, 0.55), inset 0 0 60px rgba(201, 164, 102, 0.03)',
        }}
      >
        {/* Ambient atmospheric radial gold */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 85% 20%, rgba(201, 164, 102, 0.08) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#ECC87A]" />
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase font-semibold text-[#ECC87A]">
                {PROOF_OF_CONCEPT_DATA.label}
              </span>
            </div>

            <h3
              className="font-display text-2xl sm:text-3xl lg:text-4xl leading-[1.12] tracking-tight mb-5"
              style={{ color: '#F8F5EE' }}
            >
              {PROOF_OF_CONCEPT_DATA.title}
            </h3>

            <p className="font-sans text-sm sm:text-base leading-relaxed text-[#F8F5EE]/75 font-light mb-6">
              {PROOF_OF_CONCEPT_DATA.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-[#ECC87A]">
                <Shield className="w-4 h-4" />
                <span>RISK MITIGATION</span>
              </div>
              <span className="text-white/20 text-xs">//</span>
              <span className="text-xs font-mono tracking-wider text-white/50">
                1–2 WEEK FOCUSED SPRINT
              </span>
              <span className="text-white/20 text-xs">//</span>
              <span className="text-xs font-mono tracking-wider text-white/50">
                FEASIBILITY CERTAINTY
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/[0.04] rounded-2xl p-6 sm:p-7 border border-white/[0.08]">
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#ECC87A] block mb-4 font-semibold">
              CORE HIGHLIGHTS
            </span>

            <ul className="space-y-3.5">
              {PROOF_OF_CONCEPT_DATA.highlights.map((highlight: string, idx: number) => (
                <li
                  key={`poc-${idx}`}
                  className="flex items-start gap-3 text-xs sm:text-[13.5px] leading-relaxed text-[#F8F5EE]/80"
                >
                  <span className="w-1.5 h-1.5 mt-2 rounded-full bg-[#ECC87A] shrink-0" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
