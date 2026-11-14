import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowLeft, ChevronLeft, ChevronRight, Layers, CheckCircle } from 'lucide-react'
import { ARCHIVE_PROJECTS, ProjectCaseStudy } from './portfolioData'
import HandGestureGuide from './HandGestureGuide'
import { smoothScrollTo } from '../../../utils/smoothScroll'

gsap.registerPlugin(ScrollTrigger)

interface LenisProjectArchiveProps {
  onReturnToOverview: () => void
}

export default function LenisProjectArchive({ onReturnToOverview }: LenisProjectArchiveProps) {
  const pinSectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeProjectIndex, setActiveProjectIndex] = useState<number>(0)
  const [hasInteracted, setHasInteracted] = useState<boolean>(false)
  const activeIndexRef = useRef<number>(0)

  useEffect(() => {
    const pinEl = pinSectionRef.current
    const trackEl = trackRef.current
    if (!pinEl || !trackEl) return

    // Check prefers reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) return

    const isMobile = window.innerWidth < 768
    if (isMobile) return // On mobile, render the clean touch sequence

    const ctx = gsap.context(() => {
      // Horizontal scroll pinned timeline inspired by Lenis.dev
      // Maps vertical mouse-wheel/trackpad scroll to horizontal panel movement
      const totalPanels = ARCHIVE_PROJECTS.length
      // Total horizontal distance to translate: (totalPanels - 1) * 100vw
      const xDist = (totalPanels - 1) * 100

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinEl,
          start: 'top top',
          end: `+=${(totalPanels - 1) * 130}%`,
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress
            // Mark interaction to dismiss initial hand hint
            if (p > 0.08 && !hasInteracted) {
              setHasInteracted(true)
            }

            // Calculate active index cleanly without continuous re-renders
            const newIndex = Math.min(totalPanels - 1, Math.floor(p * totalPanels + 0.15))
            if (newIndex !== activeIndexRef.current) {
              activeIndexRef.current = newIndex
              setActiveProjectIndex(newIndex)
            }
          },
        },
      })

      // Smooth horizontal translation of the project track
      tl.to(trackEl, {
        xPercent: -xDist * 0.72,
        ease: 'none',
      })
    }, pinSectionRef)

    return () => ctx.revert()
  }, [hasInteracted])

  // Direct chapter navigation
  const navigateToChapter = (index: number) => {
    const pinEl = pinSectionRef.current
    if (!pinEl) return
    const st = ScrollTrigger.getAll().find((s) => s.trigger === pinEl)
    if (st) {
      const targetP = index === 0 ? 0.02 : index === 1 ? 0.48 : 0.96
      const targetScroll = st.start + (st.end - st.start) * targetP
      smoothScrollTo(targetScroll, { duration: 1.2 })
    }
  }

  const handlePrev = () => {
    const nextIdx = Math.max(0, activeProjectIndex - 1)
    navigateToChapter(nextIdx)
  }

  const handleNext = () => {
    const nextIdx = Math.min(ARCHIVE_PROJECTS.length - 1, activeProjectIndex + 1)
    navigateToChapter(nextIdx)
  }

  return (
    <div
      ref={pinSectionRef}
      id="project-archive"
      className="relative w-full overflow-hidden select-none"
      style={{
        background: '#050508',
        minHeight: '100vh',
      }}
    >
      {/* =====================================================================
          1. STAGE B HUD HEADER NAVIGATION (Lenis Inspired)
          ===================================================================== */}
      <div
        className="fixed top-0 left-0 right-0 z-40 pointer-events-none flex items-center justify-between px-6 sm:px-12 py-6"
        style={{
          background: 'linear-gradient(to bottom, rgba(5, 5, 8, 0.9) 0%, transparent 100%)',
        }}
      >
        {/* Left: Section Indicator & Chapter Tag */}
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            type="button"
            onClick={onReturnToOverview}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-black/60 hover:bg-[#D4B276]/15 hover:border-[#D4B276]/40 text-[#FAF7F0] font-mono text-xs transition-colors"
          >
            <ArrowLeft size={13} />
            <span className="hidden sm:inline">RETURN TO OVERVIEW</span>
            <span className="sm:hidden">BACK</span>
          </button>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-black/40 font-mono text-xs text-[#D4B276]">
            <Layers size={13} />
            <span>
              SPATIAL ARCHIVE // 0{activeProjectIndex + 1} OF 0{ARCHIVE_PROJECTS.length}
            </span>
          </div>
        </div>

        {/* Center/Right: Chapter Jump Pills */}
        <div className="pointer-events-auto hidden md:flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {ARCHIVE_PROJECTS.map((proj, idx) => {
            const isActive = activeProjectIndex === idx
            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => navigateToChapter(idx)}
                className={`font-mono text-xs tracking-wider transition-all px-3 py-1 rounded-full ${
                  isActive
                    ? 'bg-[#D4B276] text-[#090A0E] font-semibold shadow-md'
                    : 'text-[#FAF7F0]/60 hover:text-[#FAF7F0] hover:bg-white/5'
                }`}
              >
                {proj.number} — {proj.shortCategory}
              </button>
            )
          })}
        </div>

        {/* Right: Step Controls (Prev / Next) */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={activeProjectIndex === 0}
            className="w-9 h-9 rounded-full border border-white/10 bg-black/50 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[#FAF7F0] transition-colors"
            aria-label="Previous Project"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={activeProjectIndex === ARCHIVE_PROJECTS.length - 1}
            className="w-9 h-9 rounded-full border border-white/10 bg-black/50 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[#FAF7F0] transition-colors"
            aria-label="Next Project"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* =====================================================================
          2. HORIZONTAL SPATIAL GALLERY TRACK (DESKTOP)
          ===================================================================== */}
      <div className="hidden md:block w-full h-screen relative">
        <div
          ref={trackRef}
          className="flex items-center h-full pl-[5vw] pr-[20vw] absolute top-0 left-0"
          style={{
            willChange: 'transform',
            gap: 'clamp(3rem, 6vw, 6rem)',
          }}
        >
          {ARCHIVE_PROJECTS.map((project, idx) => {
            const isActive = activeProjectIndex === idx
            return (
              <ArchiveProjectCard
                key={project.id}
                project={project}
                index={idx}
                isActive={isActive}
              />
            )
          })}
        </div>

        {/* Floating Animated Hand Gesture Guide & Scroll Cue */}
        <div className="absolute bottom-10 left-12 z-30 pointer-events-none">
          <HandGestureGuide visible={!hasInteracted || activeProjectIndex === 0} />
        </div>

        {/* Bottom Progress Bar */}
        <div
          className="absolute bottom-10 right-12 z-30 pointer-events-none flex items-center gap-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
        >
          <span className="font-mono text-xs text-[#D4B276]">
            0{activeProjectIndex + 1} / 0{ARCHIVE_PROJECTS.length}
          </span>
          <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D4B276] transition-all duration-300 rounded-full"
              style={{
                width: `${((activeProjectIndex + 1) / ARCHIVE_PROJECTS.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* =====================================================================
          3. CLEAN VERTICAL SEQUENCE FOR MOBILE (TOUCH-SAFE, NO HIJACKING)
          ===================================================================== */}
      <div className="block md:hidden px-4 pt-24 pb-16 space-y-12">
        {ARCHIVE_PROJECTS.map((project, idx) => (
          <MobileArchiveProjectCard key={project.id} project={project} index={idx} />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Desktop Cinematic Project Panel Card (Overlapping & Editorial)
// ---------------------------------------------------------------------------
function ArchiveProjectCard({
  project,
  index,
  isActive,
}: {
  project: ProjectCaseStudy
  index: number
  isActive: boolean
}) {
  return (
    <div
      className="relative flex-shrink-0 h-[78vh] rounded-2xl overflow-hidden border transition-all duration-700 flex flex-col justify-between"
      style={{
        width: 'clamp(720px, 76vw, 1100px)',
        background: 'rgba(13, 14, 20, 0.88)',
        borderColor: isActive ? 'rgba(212, 178, 118, 0.35)' : 'rgba(255, 255, 255, 0.08)',
        boxShadow: isActive
          ? '0 30px 80px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(212, 178, 118, 0.12)'
          : '0 20px 50px rgba(0, 0, 0, 0.7)',
        transform: isActive ? 'scale(1)' : 'scale(0.96)',
        opacity: isActive ? 1 : 0.55,
      }}
    >
      {/* Top Bar: Number, Title, Badge */}
      <div className="p-8 pb-4 flex items-start justify-between border-b border-white/5 relative z-10">
        <div>
          <div className="flex items-center gap-3 font-mono text-xs text-[#D4B276] uppercase tracking-widest mb-1.5">
            <span>0{index + 1}</span>
            <span>//</span>
            <span>{project.shortCategory}</span>
          </div>
          <h3
            className="font-display text-3xl lg:text-4xl text-[#FAF8F5] tracking-tight font-light"
          >
            {project.title}
          </h3>
        </div>

        <span
          className="font-mono text-[0.625rem] px-3 py-1 rounded-full uppercase tracking-wider font-semibold border"
          style={{
            borderColor: 'rgba(212, 178, 118, 0.4)',
            color: '#ECC87A',
            background: 'rgba(212, 178, 118, 0.1)',
          }}
        >
          {project.badgeLabel}
        </span>
      </div>

      {/* Center Body: 2-Column Split (Left: Editorial Details, Right: Large Genuine Screenshot) */}
      <div className="grid grid-cols-12 gap-8 px-8 py-4 flex-grow items-center relative z-10">
        {/* Left Editorial Narrative Column (5 Cols) */}
        <div className="col-span-5 flex flex-col justify-center space-y-4">
          <p className="font-sans text-sm lg:text-base leading-relaxed text-[#FAF8F5]/85 font-light">
            {project.categoryDescription}
          </p>

          <p className="font-sans text-xs lg:text-sm leading-relaxed text-[#FAF8F5]/65 font-light">
            {project.summary}
          </p>

          {/* Verified Capabilities */}
          {project.verifiedCapabilities && (
            <div className="pt-2">
              <span className="font-mono text-[0.625rem] tracking-wider text-[#D4B276] uppercase block mb-2">
                Verified Platform Capabilities
              </span>
              <ul className="space-y-1.5 font-sans text-xs text-[#FAF8F5]/80">
                {project.verifiedCapabilities.map((cap: string, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle size={12} className="text-[#34D399] flex-shrink-0" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Badges */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[0.625rem] px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/70"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Right Screenshot Showcase Column (7 Cols) */}
        <div className="col-span-7 h-full flex items-center justify-center relative">
          <div
            className="w-full h-[46vh] rounded-xl overflow-hidden border border-white/10 shadow-2xl relative group"
            style={{
              background: '#090A0E',
            }}
          >
            {/* Primary Real Screenshot */}
            <img
              src={project.primaryImage}
              alt={project.title}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover object-top filter brightness-95 contrast-105"
            />

            {/* Subtle Gradient Vignette around the screenshot frame */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, rgba(5,5,8,0.1) 0%, transparent 60%, rgba(5,5,8,0.6) 100%)',
              }}
            />

            {/* Inset Metallic Bevel Frame Accent */}
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-xl border border-[#D4B276]/20 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Bottom Footer Details */}
      <div className="px-8 py-3 bg-black/40 border-t border-white/5 flex items-center justify-between font-mono text-[0.625rem] text-[#FAF8F5]/45 relative z-10">
        <span>QUISTER TECHNOLOGIES ARCHIVE</span>
        <span className="text-[#D4B276]">PROVEN IN PRODUCTION // INDIA</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mobile Card (Vertically Stacked, Touch-Safe)
// ---------------------------------------------------------------------------
function MobileArchiveProjectCard({
  project,
  index,
}: {
  project: ProjectCaseStudy
  index: number
}) {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0D0E14] shadow-xl p-5"
    >
      {/* Eyebrow & Number */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-xs text-[#D4B276] uppercase tracking-widest">
          0{index + 1} // {project.shortCategory}
        </span>
        <span className="font-mono text-[0.5625rem] px-2.5 py-0.5 rounded-full border border-[#D4B276]/30 text-[#ECC87A]">
          {project.badgeLabel}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display text-2xl text-[#FAF8F5] font-light mb-3">
        {project.title}
      </h3>

      {/* Image Preview */}
      <div className="w-full h-48 rounded-lg overflow-hidden border border-white/10 mb-4 bg-black">
        <img
          src={project.primaryImage}
          alt={project.title}
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* Description */}
      <p className="font-sans text-xs text-[#FAF8F5]/80 leading-relaxed mb-4">
        {project.categoryDescription}
      </p>

      {/* Verified Capabilities */}
      {project.verifiedCapabilities && (
        <ul className="space-y-1.5 font-sans text-xs text-[#FAF8F5]/70 mb-4">
          {project.verifiedCapabilities.slice(0, 3).map((cap: string, i: number) => (
            <li key={i} className="flex items-center gap-2">
              <CheckCircle size={11} className="text-[#34D399] flex-shrink-0" />
              <span>{cap}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Tech Tags */}
      <div className="flex flex-wrap gap-1.5">
        {project.technologies.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="font-mono text-[0.5625rem] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}
