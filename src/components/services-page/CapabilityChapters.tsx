import { useState } from 'react'
import { ArrowUpRight, Check, Code2, Layers, Cpu } from 'lucide-react'
import { SERVICE_FAMILIES, ServiceFamily, ServiceDiscipline } from './servicesData'
import { navigateTo } from '../../utils/router'

export default function CapabilityChapters() {
  return (
    <div id="capability-chapters" className="relative w-full">
      {SERVICE_FAMILIES.map((family, idx) => (
        <FamilyChapterSection key={family.id} family={family} index={idx} />
      ))}
    </div>
  )
}

function FamilyChapterSection({
  family,
  index,
}: {
  family: ServiceFamily
  index: number
}) {
  const isDark = family.theme === 'dark'
  const [activeDisciplineId, setActiveDisciplineId] = useState<string>(
    family.disciplines[0].id
  )

  const activeDiscipline =
    family.disciplines.find((d) => d.id === activeDisciplineId) ||
    family.disciplines[0]

  const handleEnquire = (discipline: ServiceDiscipline) => {
    // Navigate to contact form with preselected discipline
    const encoded = encodeURIComponent(discipline.inquiryDiscipline)
    navigateTo('/', `#contact?discipline=${encoded}`)
  }

  // Visual icons for chapter indicators
  const ChapterIcon = index === 0 ? Layers : index === 1 ? Code2 : Cpu

  return (
    <section
      id={`family-${family.id}`}
      data-scroll-section
      className="relative w-full py-20 sm:py-28 lg:py-32 transition-colors duration-300"
      style={{
        backgroundColor: isDark ? '#0A0B10' : '#F8F5EE',
        color: isDark ? '#FAF7F0' : '#14141A',
        borderBottom: isDark
          ? '1px solid rgba(255, 255, 255, 0.08)'
          : '1px solid rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Background Ambience */}
      {isDark ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(201, 164, 102, 0.07) 0%, transparent 70%)',
          }}
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 10%, rgba(212, 178, 118, 0.08) 0%, transparent 65%)',
          }}
        />
      )}

      <div className="container-wide relative z-10">
        {/* =====================================================================
            CHAPTER HEADER
            ===================================================================== */}
        <div className="mb-14 sm:mb-18 lg:mb-20 max-w-4xl">
          {/* Eyebrow with Monospace Index */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{
                backgroundColor: isDark
                  ? 'rgba(212, 178, 118, 0.12)'
                  : 'rgba(201, 164, 102, 0.2)',
                color: '#D4B276',
              }}
            >
              <ChapterIcon className="w-3.5 h-3.5 text-[#D4B276]" />
            </div>
            <span
              className="font-mono text-xs tracking-[0.24em] uppercase font-semibold"
              style={{ color: '#D4B276' }}
            >
              {family.eyebrow}
            </span>
            <div
              className="w-10 h-[1px]"
              style={{ backgroundColor: '#D4B276', opacity: 0.4 }}
            />
          </div>

          {/* Chapter Main Headline */}
          <h2
            className="font-display font-light leading-[1.08] tracking-tight mb-5"
            style={{
              fontSize: 'clamp(2.4rem, 4.4vw, 3.8rem)',
              color: isDark ? '#FAF7F0' : '#14141A',
            }}
          >
            {family.headline}
          </h2>

          {/* Chapter Mission Description */}
          <p
            className="font-sans text-base sm:text-lg leading-relaxed font-light"
            style={{
              color: isDark ? 'rgba(250, 247, 240, 0.72)' : 'rgba(20, 20, 26, 0.76)',
              lineHeight: 1.7,
            }}
          >
            {family.description}
          </p>
        </div>

        {/* =====================================================================
            DISCIPLINE SELECTOR PILL TABS
            ===================================================================== */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none border-b"
            style={{
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
            }}
          >
            {family.disciplines.map((discipline) => {
              const isSelected = discipline.id === activeDiscipline.id
              return (
                <button
                  key={discipline.id}
                  type="button"
                  onClick={() => setActiveDisciplineId(discipline.id)}
                  className="flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-200 shrink-0"
                  style={{
                    backgroundColor: isSelected
                      ? isDark
                        ? '#D4B276'
                        : '#14141A'
                      : isDark
                      ? 'rgba(255, 255, 255, 0.04)'
                      : 'rgba(0, 0, 0, 0.04)',
                    color: isSelected
                      ? isDark
                        ? '#0A0B10'
                        : '#F8F5EE'
                      : isDark
                      ? 'rgba(250, 247, 240, 0.65)'
                      : 'rgba(20, 20, 26, 0.65)',
                    border: isSelected
                      ? '1px solid transparent'
                      : isDark
                      ? '1px solid rgba(255, 255, 255, 0.08)'
                      : '1px solid rgba(0, 0, 0, 0.08)',
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                    style={{
                      backgroundColor: isSelected
                        ? isDark
                          ? 'rgba(0,0,0,0.18)'
                          : 'rgba(255,255,255,0.2)'
                        : isDark
                        ? 'rgba(255,255,255,0.06)'
                        : 'rgba(0,0,0,0.06)',
                    }}
                  >
                    {discipline.letter}
                  </span>
                  <span>{discipline.title}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* =====================================================================
            ACTIVE DISCIPLINE DETAIL CARD
            ===================================================================== */}
        <div
          className="rounded-2xl p-6 sm:p-9 lg:p-12 transition-all duration-300"
          style={{
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : '#FFFFFF',
            border: isDark
              ? '1px solid rgba(255, 255, 255, 0.08)'
              : '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: isDark
              ? '0 20px 50px -15px rgba(0, 0, 0, 0.6)'
              : '0 20px 45px -15px rgba(0, 0, 0, 0.06)',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left Column: Narrative, Tech Stack & Action */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* Discipline Eyebrow */}
                <div className="flex items-center gap-2 mb-3.5">
                  <span
                    className="font-mono text-[11px] tracking-[0.22em] uppercase font-semibold"
                    style={{ color: '#D4B276' }}
                  >
                    {activeDiscipline.eyebrow}
                  </span>
                </div>

                {/* Discipline Title */}
                <h3
                  className="font-display font-light text-2xl sm:text-3xl lg:text-4xl tracking-tight mb-5"
                  style={{
                    color: isDark ? '#FAF7F0' : '#14141A',
                  }}
                >
                  {activeDiscipline.title}
                </h3>

                {/* Short Overview */}
                <p
                  className="font-sans text-base sm:text-lg font-normal leading-relaxed mb-4"
                  style={{
                    color: isDark ? 'rgba(250, 247, 240, 0.9)' : 'rgba(20, 20, 26, 0.88)',
                  }}
                >
                  {activeDiscipline.shortDesc}
                </p>

                {/* Detailed Architectural Narrative */}
                <p
                  className="font-sans text-sm sm:text-base font-light leading-relaxed mb-8"
                  style={{
                    color: isDark ? 'rgba(250, 247, 240, 0.64)' : 'rgba(20, 20, 26, 0.68)',
                    lineHeight: 1.75,
                  }}
                >
                  {activeDiscipline.detailedDesc}
                </p>

                {/* Technology Tags */}
                <div className="mb-8">
                  <span
                    className="block font-mono text-[10.5px] tracking-[0.2em] uppercase mb-3 font-semibold"
                    style={{
                      color: isDark ? 'rgba(250, 247, 240, 0.5)' : 'rgba(20, 20, 26, 0.55)',
                    }}
                  >
                    CORE TECHNOLOGIES & STACK
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeDiscipline.techTags.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 rounded font-mono text-[11px] tracking-wide"
                        style={{
                          backgroundColor: isDark
                            ? 'rgba(212, 178, 118, 0.08)'
                            : 'rgba(201, 164, 102, 0.12)',
                          color: isDark ? '#ECC87A' : '#7A5C2E',
                          border: isDark
                            ? '1px solid rgba(212, 178, 118, 0.2)'
                            : '1px solid rgba(201, 164, 102, 0.3)',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleEnquire(activeDiscipline)}
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full font-mono text-xs tracking-wider uppercase font-semibold transition-all duration-300 group"
                  style={{
                    backgroundColor: isDark ? '#D4B276' : '#14141A',
                    color: isDark ? '#0A0B10' : '#F8F5EE',
                    boxShadow: isDark
                      ? '0 8px 24px -6px rgba(212, 178, 118, 0.3)'
                      : '0 8px 20px -6px rgba(0, 0, 0, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    if (isDark) {
                      e.currentTarget.style.backgroundColor = '#ECC87A'
                    } else {
                      e.currentTarget.style.backgroundColor = '#2B2B36'
                    }
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    if (isDark) {
                      e.currentTarget.style.backgroundColor = '#D4B276'
                    } else {
                      e.currentTarget.style.backgroundColor = '#14141A'
                    }
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <span>Enquire About This Service</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>

            {/* Right Column: What We Build + Concrete Deliverables */}
            <div
              className="lg:col-span-6 rounded-xl p-6 sm:p-8 flex flex-col justify-between"
              style={{
                backgroundColor: isDark
                  ? 'rgba(0, 0, 0, 0.35)'
                  : 'rgba(248, 245, 238, 0.7)',
                border: isDark
                  ? '1px solid rgba(255, 255, 255, 0.05)'
                  : '1px solid rgba(0, 0, 0, 0.06)',
              }}
            >
              {/* Scope & Capabilities List */}
              <div className="mb-8">
                <div className="flex items-center justify-between pb-3 mb-5 border-b"
                  style={{
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <span
                    className="font-mono text-xs tracking-[0.2em] uppercase font-semibold"
                    style={{ color: '#D4B276' }}
                  >
                    CAPABILITIES // WHAT WE BUILD
                  </span>
                  <span
                    className="font-mono text-[11px] opacity-60"
                    style={{ color: isDark ? '#FAF7F0' : '#14141A' }}
                  >
                    {activeDiscipline.capabilities.length} FOCUS AREAS
                  </span>
                </div>

                <ul className="space-y-3">
                  {activeDiscipline.capabilities.map((cap, cIdx) => (
                    <li
                      key={cIdx}
                      className="flex items-start gap-3 text-sm font-sans"
                      style={{
                        color: isDark ? 'rgba(250, 247, 240, 0.82)' : 'rgba(20, 20, 26, 0.85)',
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                        style={{ backgroundColor: '#D4B276' }}
                      />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Concrete Deliverables Section */}
              <div
                className="pt-6 border-t"
                style={{
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                }}
              >
                <span
                  className="block font-mono text-xs tracking-[0.2em] uppercase mb-4 font-semibold"
                  style={{ color: '#D4B276' }}
                >
                  DELIVERABLES // WHAT YOU RECEIVE
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeDiscipline.deliverables.map((deliv, dIdx) => (
                    <div
                      key={dIdx}
                      className="p-3 rounded-lg flex items-start gap-2.5 text-xs font-sans"
                      style={{
                        backgroundColor: isDark
                          ? 'rgba(255, 255, 255, 0.03)'
                          : '#FFFFFF',
                        border: isDark
                          ? '1px solid rgba(255, 255, 255, 0.06)'
                          : '1px solid rgba(0, 0, 0, 0.06)',
                        color: isDark ? 'rgba(250, 247, 240, 0.75)' : 'rgba(20, 20, 26, 0.75)',
                      }}
                    >
                      <Check className="w-3.5 h-3.5 text-[#D4B276] shrink-0 mt-0.5" />
                      <span className="leading-snug">{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
