import {
  PROJECT_COMMITMENTS,
  COLLABORATION_RULES,
  type ProjectCommitment,
  type CollaborationRule,
} from './processPhasesData'

export default function ProcessCommitmentsSection() {
  return (
    <div className="w-full mt-20 sm:mt-28 space-y-16 sm:space-y-20">
      {/* =====================================================================
          TRUST GRID: OUR PROJECT COMMITMENTS
          ===================================================================== */}
      <div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="font-mono text-xs tracking-[0.22em] uppercase font-semibold text-[#9A7A4A]">
                06 // OUR PROJECT COMMITMENTS
              </span>
              <div className="w-8 h-[1px] bg-[#9A7A4A]/30" />
            </div>

            <h3
              className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] leading-[1.1] tracking-tight max-w-2xl"
              style={{ color: '#14161C' }}
            >
              Direct, honest{' '}
              <span
                className="italic font-normal"
                style={{
                  background:
                    'linear-gradient(135deg, #A88349 0%, #D4B276 50%, #9A7A4A 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                delivery standards.
              </span>
            </h3>
          </div>

          <p className="font-sans text-sm sm:text-base text-[#14161C]/70 max-w-md font-light leading-relaxed">
            We believe enduring digital products are built on mutual clarity, unvarnished
            communication, and disciplined technical execution.
          </p>
        </div>

        {/* 6 Principles in a 3-column (2-column tablet) Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {PROJECT_COMMITMENTS.map((commitment: ProjectCommitment) => (
            <div
              key={commitment.number}
              className="rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:shadow-stone-900/5 group"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(20, 22, 28, 0.08)',
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-xs tracking-widest text-[#9A7A4A] font-semibold">
                    {commitment.number} // COMMITMENT
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#9A7A4A]/30 group-hover:bg-[#9A7A4A] transition-colors duration-300" />
                </div>

                <h4 className="font-display text-xl sm:text-[1.35rem] leading-snug tracking-tight mb-3 text-[#14161C]">
                  {commitment.title}
                </h4>

                <p className="font-sans text-xs sm:text-[13.5px] leading-relaxed text-[#14161C]/72 font-light">
                  {commitment.description}
                </p>
              </div>

              <div className="pt-5 mt-6 border-t border-stone-200/60 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-wider uppercase text-[#14161C]/40">
                  GUARANTEED PRINCIPLE
                </span>
                <span className="font-mono text-[10px] text-[#9A7A4A] font-semibold">
                  VERIFIED
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================================
          PROJECT APPROVAL & COMMUNICATION GUIDELINES
          ===================================================================== */}
      <div
        className="rounded-2xl p-8 sm:p-10 lg:p-12"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.70)',
          border: '1px solid rgba(20, 22, 28, 0.08)',
        }}
      >
        <div className="flex items-center gap-2.5 mb-3">
          <span className="font-mono text-xs tracking-[0.22em] uppercase font-semibold text-[#9A7A4A]">
            WORKING TOGETHER
          </span>
          <div className="w-8 h-[1px] bg-[#9A7A4A]/30" />
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#14161C]/50">
            COLLABORATION GUIDELINES
          </span>
        </div>

        <h4 className="font-display text-2xl sm:text-3xl leading-tight tracking-tight text-[#14161C] mb-8">
          Project Approval & Communication
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLLABORATION_RULES.map((rule: CollaborationRule) => (
            <div key={rule.number} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#9A7A4A] font-semibold">
                  {rule.number}.
                </span>
                <h5 className="font-sans text-sm font-semibold text-[#14161C]">
                  {rule.title}
                </h5>
              </div>
              <p className="font-sans text-xs sm:text-[13px] leading-relaxed text-[#14161C]/70 font-light">
                {rule.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
