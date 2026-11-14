import { useEffect } from 'react'
import { X, ExternalLink, ShieldCheck, Server, Layers } from 'lucide-react'
import { FeaturedProject } from './projectData'

interface CaseStudyDetailModalProps {
  project: FeaturedProject | null
  onClose: () => void
}

export default function CaseStudyDetailModal({
  project,
  onClose,
}: CaseStudyDetailModalProps) {
  useEffect(() => {
    if (!project) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = 'auto'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [project, onClose])

  if (!project) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{
        background: 'rgba(5, 5, 8, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-amber-500/20 text-white shadow-2xl p-6 md:p-10"
        style={{
          background: 'linear-gradient(145deg, rgba(18, 14, 26, 0.96) 0%, rgba(10, 8, 14, 0.98) 100%)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 178, 118, 0.08)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Case Study"
          className="absolute top-6 right-6 p-2 rounded-full border border-white/10 hover:border-amber-400/40 text-neutral-400 hover:text-white transition-all bg-white/5 hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Metadata */}
        <div className="flex items-center gap-3 mb-4 font-mono text-xs text-amber-300/80 tracking-widest uppercase">
          <span>{project.number} // FEATURED ARCHIVE</span>
          <span>·</span>
          <span>{project.category}</span>
          <span>·</span>
          <span>{project.year}</span>
        </div>

        {/* Project Name */}
        <h2
          id="modal-project-title"
          className="text-3xl md:text-5xl font-serif text-amber-50 mb-4"
          style={{ letterSpacing: '-0.02em' }}
        >
          {project.name}
        </h2>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-neutral-300 font-light mb-8 max-w-2xl leading-relaxed">
          {project.tagline}
        </p>

        {/* Project Real Visual Preview Surface */}
        <div className="relative w-full rounded-xl overflow-hidden mb-8 border border-white/10 shadow-2xl">
          <img
            src={project.image}
            alt={`${project.name} Production Interface`}
            className="w-full h-auto object-cover max-h-[460px]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Grid: Challenge & Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs tracking-wider uppercase mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>The Engineering Challenge</span>
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed font-light">
              {project.challenge}
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs tracking-wider uppercase mb-3">
              <Server className="w-4 h-4" />
              <span>Production Architecture</span>
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed font-light">
              {project.architecture}
            </p>
          </div>
        </div>

        {/* Client Verdict */}
        <div className="p-5 rounded-xl bg-amber-500/[0.05] border border-amber-500/20 mb-8">
          <div className="text-xs font-mono text-amber-300/80 uppercase tracking-widest mb-1">
            Client Delivery & Outcome
          </div>
          <div className="text-base text-amber-100 font-serif italic">
            "{project.clientVerdict}"
          </div>
          <div className="text-xs text-neutral-400 font-mono mt-1">
            Client Location: {project.clientLocation}
          </div>
        </div>

        {/* Tech Tags */}
        <div className="mb-8">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Core Technologies & Frameworks</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-neutral-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Live URL CTA */}
        {project.liveUrl && (
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-mono uppercase tracking-widest font-semibold transition-all shadow-lg"
              style={{
                backgroundColor: '#D4B276',
                color: '#0D0E12',
              }}
            >
              <span>Visit Live Production System</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active in Production</span>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
