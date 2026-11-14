import { useRef } from 'react'
import { CheckCircle2, ArrowRightLeft, Sparkles } from 'lucide-react'
import { PROCESS_STAGES, type ProcessStage } from './processPhasesData'

interface ProcessPhasesGridProps {
  activePhase: number
  onPhaseSelect: (index: number) => void
  onPhaseHover: (index: number) => void
}

export default function ProcessPhasesGrid({
  activePhase,
  onPhaseSelect,
  onPhaseHover,
}: ProcessPhasesGridProps) {
  const listRef = useRef<HTMLDivElement>(null)

  return (
    <div
      role="region"
      aria-label="Five Delivery Stages"
      className="w-full relative"
    >
      {/* =====================================================================
          INTERACTIVE STAGE NAVIGATOR PILLS (Quick Jump)
          ===================================================================== */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-6 sm:mb-8 no-scrollbar">
        {PROCESS_STAGES.map((stage: ProcessStage, idx: number) => {
          const isActive = activePhase === idx
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => onPhaseSelect(idx)}
              aria-label={`Jump to stage ${stage.number} - ${stage.title}`}
              aria-pressed={isActive}
              className="group shrink-0 flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 outline-none"
              style={{
                backgroundColor: isActive ? '#14161C' : 'rgba(255, 255, 255, 0.65)',
                color: isActive ? '#F8F5EE' : 'rgba(20, 22, 28, 0.72)',
                border: isActive
                  ? '1px solid #14161C'
                  : '1px solid rgba(20, 22, 28, 0.10)',
                boxShadow: isActive
                  ? '0 6px 16px -4px rgba(20, 22, 28, 0.18)'
                  : 'none',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: isActive ? '#D4B276' : 'rgba(20, 22, 28, 0.28)',
                }}
              />
              <span className="font-semibold">{stage.number}</span>
              <span className="hidden sm:inline font-normal opacity-85">
                {stage.title.split(' ')[0]}
              </span>
            </button>
          )
        })}
      </div>

      {/* =====================================================================
          FIVE STAGES EDITORIAL STACK
          - Each stage features clear deliverables and client requirements side-by-side
          - Smoothly coordinated with the 3D continuous ribbon sculpture above
          ===================================================================== */}
      <div ref={listRef} className="space-y-4 sm:space-y-6">
        {PROCESS_STAGES.map((stage: ProcessStage, idx: number) => {
          const isActive = activePhase === idx
          const isCompleted = idx < activePhase

          return (
            <div
              key={stage.id}
              role="button"
              tabIndex={0}
              aria-selected={isActive}
              onClick={() => onPhaseSelect(idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onPhaseSelect(idx)
                }
              }}
              onMouseEnter={() => onPhaseHover(idx)}
              className="group relative transition-all duration-300 rounded-2xl p-6 sm:p-8 lg:p-10 outline-none cursor-pointer select-none"
              style={{
                backgroundColor: isActive
                  ? '#FFFFFF'
                  : 'rgba(255, 255, 255, 0.65)',
                border: isActive
                  ? '1px solid rgba(181, 143, 80, 0.45)'
                  : '1px solid rgba(20, 22, 28, 0.08)',
                boxShadow: isActive
                  ? '0 20px 48px -18px rgba(20, 22, 28, 0.10), 0 0 0 1px rgba(201, 164, 102, 0.15)'
                  : '0 4px 14px -6px rgba(20, 22, 28, 0.03)',
              }}
            >
              {/* Active Left Indicator Bar */}
              <div
                aria-hidden="true"
                className="absolute left-0 top-6 bottom-6 w-[3px] rounded-r-full transition-all duration-300 pointer-events-none"
                style={{
                  backgroundColor: '#9A7A4A',
                  transform: isActive ? 'scaleY(1)' : 'scaleY(0)',
                  opacity: isActive ? 1 : 0,
                }}
              />

              {/* Stage Top Bar: Number + Eyebrow + Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <span
                    className="font-mono text-xs sm:text-[13px] tracking-[0.22em] font-semibold transition-colors duration-300"
                    style={{
                      color: isActive ? '#7A5B28' : isCompleted ? '#9A7A4A' : 'rgba(20, 22, 28, 0.45)',
                    }}
                  >
                    STAGE // {stage.number}
                  </span>
                  {isActive && (
                    <span
                      className="w-1.5 h-1.5 rounded-full inline-block animate-pulse"
                      style={{ backgroundColor: '#9A7A4A' }}
                    />
                  )}
                  <span
                    className="hidden sm:inline-block w-8 h-[1px]"
                    style={{ backgroundColor: 'rgba(20, 22, 28, 0.12)' }}
                  />
                  <span
                    className="font-mono text-[11px] tracking-[0.16em] uppercase transition-colors duration-300"
                    style={{
                      color: isActive ? '#9A7A4A' : 'rgba(20, 22, 28, 0.50)',
                      fontWeight: 500,
                    }}
                  >
                    {stage.eyebrow}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-[10px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full transition-colors duration-300"
                    style={{
                      backgroundColor: isActive
                        ? 'rgba(201, 164, 102, 0.15)'
                        : 'rgba(20, 22, 28, 0.04)',
                      color: isActive ? '#7A5B28' : 'rgba(20, 22, 28, 0.42)',
                      fontWeight: 600,
                    }}
                  >
                    {isActive ? 'CURRENTLY ACTIVE IN 3D' : `STAGE 0${idx + 1}`}
                  </span>
                </div>
              </div>

              {/* Stage Main Title */}
              <h3
                className="font-display text-2xl sm:text-3xl lg:text-[2rem] leading-tight tracking-tight mb-3 transition-colors duration-300"
                style={{
                  color: isActive ? '#0E1015' : '#14161C',
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                {stage.title}
              </h3>

              {/* Stage Description */}
              <p
                className="font-sans text-[14px] sm:text-[15.5px] leading-relaxed mb-8 max-w-4xl transition-colors duration-300"
                style={{
                  color: isActive ? 'rgba(20, 22, 28, 0.88)' : 'rgba(20, 22, 28, 0.68)',
                  fontWeight: 350,
                }}
              >
                {stage.description}
              </p>

              {/* =====================================================================
                  DUAL SIDE-BY-SIDE COLUMNS:
                  - Left: WHAT YOU RECEIVE (Studio Deliverables)
                  - Right: WHAT WE NEED FROM YOU (Client Collaboration Inputs)
                  ===================================================================== */}
              <div
                className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 transition-colors duration-300"
                style={{
                  borderTop: isActive
                    ? '1px solid rgba(201, 164, 102, 0.25)'
                    : '1px solid rgba(20, 22, 28, 0.08)',
                }}
              >
                {/* Column A: WHAT YOU RECEIVE */}
                <div
                  className="rounded-xl p-5 sm:p-6 transition-colors duration-300"
                  style={{
                    backgroundColor: isActive
                      ? 'rgba(248, 245, 238, 0.65)'
                      : 'rgba(248, 245, 238, 0.45)',
                    border: '1px solid rgba(20, 22, 28, 0.05)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-3.5">
                    <Sparkles
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: '#9A7A4A' }}
                    />
                    <h4
                      className="font-mono text-[11px] tracking-[0.18em] uppercase font-semibold"
                      style={{ color: '#9A7A4A' }}
                    >
                      WHAT YOU RECEIVE
                    </h4>
                  </div>

                  <ul className="space-y-2.5">
                    {stage.whatYouReceive.map((item, itemIdx) => (
                      <li
                        key={`receive-${itemIdx}`}
                        className="flex items-start gap-2.5 font-sans text-xs sm:text-[13.5px] leading-snug"
                        style={{
                          color: isActive ? '#14161C' : 'rgba(20, 22, 28, 0.78)',
                        }}
                      >
                        <CheckCircle2
                          className="w-3.5 h-3.5 mt-0.5 shrink-0"
                          style={{
                            color: '#9A7A4A',
                            opacity: isActive ? 1 : 0.75,
                          }}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column B: WHAT WE NEED FROM YOU */}
                <div
                  className="rounded-xl p-5 sm:p-6 transition-colors duration-300"
                  style={{
                    backgroundColor: isActive
                      ? 'rgba(248, 245, 238, 0.65)'
                      : 'rgba(248, 245, 238, 0.45)',
                    border: '1px solid rgba(20, 22, 28, 0.05)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-3.5">
                    <ArrowRightLeft
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: 'rgba(20, 22, 28, 0.55)' }}
                    />
                    <h4
                      className="font-mono text-[11px] tracking-[0.18em] uppercase font-semibold"
                      style={{ color: 'rgba(20, 22, 28, 0.65)' }}
                    >
                      WHAT WE NEED FROM YOU
                    </h4>
                  </div>

                  <ul className="space-y-2.5">
                    {stage.whatWeNeed.map((item, itemIdx) => (
                      <li
                        key={`need-${itemIdx}`}
                        className="flex items-start gap-2.5 font-sans text-xs sm:text-[13.5px] leading-snug"
                        style={{
                          color: isActive ? '#14161C' : 'rgba(20, 22, 28, 0.78)',
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 mt-1.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: isActive
                              ? '#9A7A4A'
                              : 'rgba(20, 22, 28, 0.35)',
                          }}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
