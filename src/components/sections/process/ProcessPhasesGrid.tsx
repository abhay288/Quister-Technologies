import { PROCESS_PHASES } from './processPhasesData'

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
  return (
    <div
      role="region"
      aria-label="Engineering Lifecycle Phases"
      className="w-full relative"
    >
      {/* 3-Column, 2-Row Editorial Grid */}
      <ol
        className="list-none grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px]"
        style={{
          backgroundColor: 'rgba(20, 22, 28, 0.09)',
          border: '1px solid rgba(20, 22, 28, 0.09)',
        }}
      >
        {PROCESS_PHASES.map((phase, idx) => {
          const isActive = activePhase === idx
          const isCompleted = idx < activePhase

          return (
            <li
              key={phase.number}
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
              className="group relative flex flex-col transition-all duration-300 cursor-pointer outline-none select-none"
              style={{
                backgroundColor: isActive ? 'rgba(238, 230, 218, 0.65)' : '#F8F5EE',
                padding: 'clamp(2rem, 3.2vw, 2.75rem)',
                minHeight: '290px',
              }}
            >
              {/* Slim Champagne-Gold Left Active Indicator (No heavy card boxes) */}
              <div
                aria-hidden="true"
                className="absolute left-0 top-3 bottom-3 w-[2.5px] transition-all duration-300 origin-center rounded-full pointer-events-none"
                style={{
                  backgroundColor: '#9A7A4A',
                  transform: isActive ? 'scaleY(1)' : 'scaleY(0)',
                  opacity: isActive ? 1 : 0,
                }}
              />

              {/* Phase Header: Number and Subtitle Descriptor */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <span
                    className="font-mono text-xs tracking-[0.2em] font-semibold transition-colors duration-300"
                    style={{
                      color: isActive ? '#7A5B28' : isCompleted ? '#9A7A4A' : 'rgba(20, 22, 28, 0.42)',
                    }}
                  >
                    PHASE // {phase.number}
                  </span>
                  {isActive && (
                    <span
                      className="w-1.5 h-1.5 rounded-full inline-block animate-pulse"
                      style={{ backgroundColor: '#9A7A4A' }}
                    />
                  )}
                </div>

                <span
                  className="font-mono text-[10px] tracking-[0.14em] uppercase transition-colors duration-300"
                  style={{
                    color: isActive ? 'rgba(20, 22, 28, 0.75)' : 'rgba(20, 22, 28, 0.42)',
                  }}
                >
                  {phase.subtitle}
                </span>
              </div>

              {/* Elegant Serif Title */}
              <h3
                className="font-display text-xl sm:text-2xl lg:text-[1.65rem] leading-snug tracking-tight mb-3 transition-colors duration-300"
                style={{
                  color: isActive ? '#0E1015' : '#14161C',
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                {phase.title}
              </h3>

              {/* Concise Description */}
              <p
                className="font-sans text-[13px] sm:text-[14px] leading-relaxed mb-6 flex-grow transition-colors duration-300"
                style={{
                  color: isActive ? 'rgba(20, 22, 28, 0.85)' : 'rgba(20, 22, 28, 0.65)',
                  fontWeight: 350,
                }}
              >
                {phase.description}
              </p>

              {/* Understated Editorial Deliverable Line (Heavy grey box removed) */}
              <div
                className="pt-3.5 mt-auto flex flex-wrap items-baseline gap-2 transition-colors duration-300"
                style={{
                  borderTop: '1px solid rgba(20, 22, 28, 0.08)',
                }}
              >
                <span
                  className="font-mono text-[10px] tracking-wider uppercase font-semibold shrink-0"
                  style={{ color: '#9A7A4A' }}
                >
                  DELIVERABLE &mdash;
                </span>
                <span
                  className="font-sans text-xs transition-colors duration-300"
                  style={{
                    color: isActive ? '#14161C' : 'rgba(20, 22, 28, 0.72)',
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
                  {phase.deliverable}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

