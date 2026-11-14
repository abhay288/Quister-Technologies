import { ArrowRight, Sparkles } from 'lucide-react'
import { PROCESS_CTA_DATA } from './processPhasesData'
import { navigateTo } from '../../../utils/router'

export default function ProcessCtaSection() {
  const handlePrimaryClick = (e: React.MouseEvent) => {
    e.preventDefault()
    navigateTo('/', '#contact')
  }

  const handleSecondaryClick = (e: React.MouseEvent) => {
    e.preventDefault()
    navigateTo('/', '#work')
  }

  return (
    <div
      className="w-full mt-24 sm:mt-32 rounded-3xl p-8 sm:p-14 lg:p-20 relative overflow-hidden"
      style={{
        backgroundColor: '#0F1015',
        border: '1px solid rgba(201, 164, 102, 0.25)',
        boxShadow:
          '0 32px 72px -24px rgba(0, 0, 0, 0.65), inset 0 0 80px rgba(201, 164, 102, 0.04)',
      }}
    >
      {/* Ambient Radial Champagne Sheen */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 10%, rgba(201, 164, 102, 0.12) 0%, rgba(15, 16, 21, 0) 70%)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 mb-6">
          <Sparkles className="w-3 h-3 text-[#ECC87A]" />
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#ECC87A] font-semibold">
            {PROCESS_CTA_DATA.eyebrow}
          </span>
        </div>

        {/* Headline */}
        <h3
          className="font-display text-3xl sm:text-5xl lg:text-[3.5rem] leading-[1.06] tracking-tight mb-6"
          style={{ color: '#F8F5EE' }}
        >
          {PROCESS_CTA_DATA.headline}
        </h3>

        {/* Supporting Copy */}
        <p className="font-sans text-sm sm:text-base lg:text-lg leading-relaxed text-[#F8F5EE]/75 font-light max-w-xl mb-10">
          {PROCESS_CTA_DATA.supportingCopy}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <a
            href={PROCESS_CTA_DATA.primaryCta.href}
            onClick={handlePrimaryClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-mono text-xs tracking-wider uppercase font-semibold transition-all duration-300 group outline-none"
            style={{
              backgroundColor: '#ECC87A',
              color: '#0F1015',
              boxShadow: '0 8px 24px -6px rgba(236, 200, 122, 0.35)',
            }}
          >
            <span>{PROCESS_CTA_DATA.primaryCta.label}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
          </a>

          <a
            href={PROCESS_CTA_DATA.secondaryCta.href}
            onClick={handleSecondaryClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-mono text-xs tracking-wider uppercase font-medium text-[#F8F5EE]/80 border border-white/15 hover:border-white/35 hover:text-white transition-all duration-300 outline-none"
          >
            <span>{PROCESS_CTA_DATA.secondaryCta.label}</span>
          </a>
        </div>
      </div>
    </div>
  )
}
