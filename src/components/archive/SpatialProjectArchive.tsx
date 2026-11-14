import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ExternalLink, ArrowRight } from 'lucide-react'
import SpatialScene3D from './SpatialScene3D'
import CaseStudyDetailModal from './CaseStudyDetailModal'
import { FEATURED_PROJECTS, FeaturedProject } from './projectData'

gsap.registerPlugin(ScrollTrigger)

export default function SpatialProjectArchive() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState<number>(0)
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0)
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<FeaturedProject | null>(null)
  const [mouseState, setMouseState] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  const currentProject = FEATURED_PROJECTS[activeChapterIndex] || FEATURED_PROJECTS[0]

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -(e.clientY / window.innerHeight) * 2 + 1
      setMouseState({ x: nx, y: ny })
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    // Coordinated GSAP ScrollTrigger for 3D Spatial Progression
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: '+=260%',
      pin: true,
      pinSpacing: true,
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress
        setScrollProgress(p)

        // Chapter 0: Anuj (0.00 - 0.35)
        // Chapter 1: Kanhaiya (0.35 - 0.70)
        // Chapter 2: EcoIntel (0.70 - 1.00)
        let idx = 0
        if (p < 0.35) idx = 0
        else if (p < 0.70) idx = 1
        else idx = 2

        setActiveChapterIndex(idx)
      },
    })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      st.kill()
    }
  }, [])

  const jumpToChapter = (index: number) => {
    if (!containerRef.current) return
    const el = containerRef.current
    const st = ScrollTrigger.getById('archive-pin') || ScrollTrigger.getAll().find(s => s.trigger === el)
    if (st) {
      const targetP = index === 0 ? 0.05 : index === 1 ? 0.50 : 0.85
      const targetScroll = st.start + (st.end - st.start) * targetP
      window.scrollTo({ top: targetScroll, behavior: 'smooth' })
    }
  }

  return (
    <div
      ref={containerRef}
      id="project-archive"
      className="relative w-full h-screen overflow-hidden select-none"
      style={{
        background: '#050508',
      }}
    >
      {/* 3D Spatial WebGL Journey */}
      <div className="absolute inset-0 z-0">
        <SpatialScene3D progress={scrollProgress} mouseState={mouseState} />
      </div>

      {/* Subtle Luxury Gradient Vignette to Frame UI Text */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'radial-gradient(circle at 25% 50%, rgba(5, 5, 8, 0.75) 0%, rgba(5, 5, 8, 0.4) 45%, transparent 75%), linear-gradient(180deg, rgba(5, 5, 8, 0.6) 0%, transparent 20%, transparent 80%, rgba(5, 5, 8, 0.8) 100%)',
        }}
      />

      {/* =====================================================================
          FLOATING MINIMAL HUD NAVIGATION
          ===================================================================== */}
      <div className="absolute top-8 left-8 right-8 z-20 flex items-center justify-between pointer-events-none">
        {/* Left: Section Indicator */}
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-mono text-xs tracking-widest text-amber-200/90 uppercase">
            SPATIAL ARCHIVE // 0{activeChapterIndex + 1} OF 03
          </span>
        </div>

        {/* Right: Chapter Switcher Jump Links */}
        <div className="pointer-events-auto flex items-center gap-2 md:gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          {FEATURED_PROJECTS.map((proj, idx) => {
            const isActive = activeChapterIndex === idx
            return (
              <button
                key={proj.id}
                onClick={() => jumpToChapter(idx)}
                className={`font-mono text-xs tracking-wider transition-all px-3 py-1 rounded-full ${
                  isActive
                    ? 'bg-amber-400 text-black font-semibold shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {proj.number} // {proj.name.split(' ')[0]}
              </button>
            )
          })}
        </div>
      </div>

      {/* =====================================================================
          ACTIVE CHAPTER EDITORIAL OVERLAY
          ===================================================================== */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end md:justify-center p-8 md:p-16 max-w-2xl pointer-events-none">
        <div className="pointer-events-auto">
          {/* Chapter Category & Year */}
          <div className="flex items-center gap-3 font-mono text-xs text-amber-400/90 tracking-widest uppercase mb-3">
            <span>{currentProject.number}</span>
            <span>·</span>
            <span>{currentProject.category}</span>
            <span>·</span>
            <span>{currentProject.year}</span>
          </div>

          {/* Project Title */}
          <h2
            className="text-4xl md:text-6xl font-serif text-white tracking-tight mb-4"
            style={{
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 0, 0, 0.8)',
            }}
          >
            {currentProject.name}
          </h2>

          {/* Tagline */}
          <p
            className="text-sm md:text-base text-neutral-300 font-light leading-relaxed mb-6 max-w-lg"
            style={{
              textShadow: '0 1px 12px rgba(0, 0, 0, 0.9)',
            }}
          >
            {currentProject.description}
          </p>

          {/* Tech Badges */}
          <div className="flex flex-wrap gap-2 mb-8 max-w-md">
            {currentProject.tags.slice(0, 4).map((tag, tIdx) => (
              <span
                key={tIdx}
                className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-white/10 backdrop-blur-sm border border-white/15 text-neutral-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Interactive Actions */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setSelectedCaseStudy(currentProject)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-mono uppercase tracking-widest font-semibold transition-all border border-amber-400/40 bg-amber-400/10 hover:bg-amber-400 hover:text-black text-amber-200 shadow-lg hover:shadow-amber-400/20"
            >
              <span>View Case Study</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {currentProject.liveUrl && (
              <a
                href={currentProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-mono uppercase tracking-widest text-neutral-300 hover:text-white transition-all bg-white/5 hover:bg-white/10 border border-white/10"
              >
                <span>Live Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Progress Track Bottom HUD */}
      <div className="absolute bottom-6 left-8 right-8 z-20 flex items-center justify-between font-mono text-xs text-neutral-500 pointer-events-none">
        <span className="tracking-widest uppercase">SCROLL TO TRAVERSE ARCHIVE</span>
        <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 rounded-full transition-all duration-150"
            style={{ width: `${Math.round(scrollProgress * 100)}%` }}
          />
        </div>
        <span>{Math.round(scrollProgress * 100)}%</span>
      </div>

      {/* Comprehensive Case Study Detail Modal */}
      <CaseStudyDetailModal
        project={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
      />
    </div>
  )
}
