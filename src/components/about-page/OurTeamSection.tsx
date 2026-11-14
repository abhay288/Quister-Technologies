import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, CheckCircle2, Code2, Cpu, Eye, Globe2, Layers, Smartphone, Sparkles, Terminal } from 'lucide-react'
import {
  TEAM_STUDIO_CONFIG,
  TEAM_MEMBERS,
  TEAM_EXPERTISE_AREAS,
  TeamExpertiseArea,
} from './aboutPageData'

gsap.registerPlugin(ScrollTrigger)

const EXPERTISE_ICONS: Record<string, typeof Code2> = {
  frontend: Globe2,
  backend: Terminal,
  mobile: Smartphone,
  uiux: Eye,
  ai: Cpu,
  '3d-interactive': Sparkles,
  'qa-deployment': Layers,
}

export default function OurTeamSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const expertiseGridRef = useRef<HTMLDivElement>(null)

  const [activeAreaId, setActiveAreaId] = useState<string | null>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !sectionRef.current) return

    const ctx = gsap.context(() => {
      // Header reveal
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: 22, opacity: 0 },
          {
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              once: true,
            },
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
          }
        )
      }

      // Stats reveal
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.children,
          { y: 16, opacity: 0 },
          {
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 85%',
              once: true,
            },
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.06,
            ease: 'power3.out',
          }
        )
      }

      // Profile & Abstract visual reveal
      if (profileRef.current) {
        gsap.fromTo(
          profileRef.current,
          { y: 20, opacity: 0 },
          {
            scrollTrigger: {
              trigger: profileRef.current,
              start: 'top 85%',
              once: true,
            },
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: 'power3.out',
          }
        )
      }

      // Expertise grid reveal
      if (expertiseGridRef.current) {
        gsap.fromTo(
          expertiseGridRef.current.children,
          { y: 18, opacity: 0 },
          {
            scrollTrigger: {
              trigger: expertiseGridRef.current,
              start: 'top 85%',
              once: true,
            },
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.05,
            ease: 'power3.out',
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const config = TEAM_STUDIO_CONFIG
  const primaryMember = TEAM_MEMBERS[0]

  return (
    <section
      id="our-team"
      ref={sectionRef}
      data-scroll-section="TEAM"
      aria-labelledby="our-team-heading"
      style={{
        background: '#09090E',
        color: '#F3EFE8',
        padding: 'clamp(5rem, 9vw, 8rem) 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle radial atmosphere */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '20%',
          right: '-10%',
          width: '650px',
          height: '650px',
          background: 'radial-gradient(circle, rgba(201, 164, 102, 0.05) 0%, rgba(118, 80, 181, 0.03) 45%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        className="grid-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          pointerEvents: 'none',
        }}
      />

      <div className="container-wide relative z-10">
        {/* =====================================================================
            1. SECTION INTRODUCTION
            ===================================================================== */}
        <div ref={headerRef} className="max-w-3xl mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: '#C9A466',
                fontWeight: 600,
              }}
            >
              {config.eyebrow}
            </span>
            <span
              aria-hidden="true"
              style={{ width: '36px', height: '1px', background: '#C9A466', opacity: 0.45 }}
            />
          </div>

          <h2
            id="our-team-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.45rem, 4.8vw, 4.4rem)',
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: '-0.015em',
              color: '#F8F5EF',
              marginBottom: '1.25rem',
            }}
          >
            <span>{config.headline}</span>
            <span
              className="block italic mt-1"
              style={{
                background: 'linear-gradient(125deg, #F8F5EF 20%, #D9B978 70%, #B89AE5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {config.subheadline}
            </span>
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(0.98rem, 1.12vw, 1.1rem)',
              lineHeight: 1.78,
              fontWeight: 300,
              color: 'rgba(243, 239, 232, 0.78)',
            }}
          >
            {config.supportingText}
          </p>
        </div>

        {/* =====================================================================
            2. TEAM STRENGTH STATISTICS (VERIFIED EDITABLE DATA)
            ===================================================================== */}
        <div className="mb-14 sm:mb-20">
          {/* Top meta pill */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#10B981',
                  boxShadow: '0 0 8px rgba(16, 185, 129, 0.7)',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(243, 239, 232, 0.7)',
                }}
              >
                {config.teamTypeBadge}
              </span>
            </div>

            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5625rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#C9A466',
              }}
            >
              VERIFIED STUDIO CAPACITY // 2026
            </span>
          </div>

          {/* 4-Stat Metric Strip */}
          <div
            ref={statsRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {/* Stat 1: Core Team */}
            <div
              className="p-6 rounded-xl relative overflow-hidden transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(201, 164, 102, 0.28)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#C9A466',
                }}
              >
                01 // CORE TEAM
              </span>
              <div
                className="mt-3 flex items-baseline gap-2"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                    fontWeight: 400,
                    lineHeight: 1,
                    color: '#F8F5EF',
                  }}
                >
                  {String(config.stats.totalCoreMembers).padStart(2, '0')}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    color: '#D9B978',
                    letterSpacing: '0.1em',
                  }}
                >
                  MEMBER
                </span>
              </div>
              <p
                className="mt-2"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8125rem',
                  color: 'rgba(243, 239, 232, 0.75)',
                  lineHeight: 1.5,
                }}
              >
                100% full-time founder & lead software architect dedicated to direct client delivery.
              </p>
            </div>

            {/* Stat 2: Engineering */}
            <div
              className="p-6 rounded-xl relative overflow-hidden transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(243, 239, 232, 0.45)',
                }}
              >
                02 // ENGINEERING
              </span>
              <div
                className="mt-3 flex items-baseline gap-2"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                    fontWeight: 400,
                    lineHeight: 1,
                    color: '#F8F5EF',
                  }}
                >
                  {String(config.stats.developmentEngineering).padStart(2, '0')}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    color: 'rgba(243, 239, 232, 0.45)',
                    letterSpacing: '0.1em',
                  }}
                >
                  PILLAR
                </span>
              </div>
              <p
                className="mt-2"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8125rem',
                  color: 'rgba(243, 239, 232, 0.65)',
                  lineHeight: 1.5,
                }}
              >
                End-to-end full-stack, WebGL, mobile ecosystems and database systems.
              </p>
            </div>

            {/* Stat 3: Creative & Design */}
            <div
              className="p-6 rounded-xl relative overflow-hidden transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(243, 239, 232, 0.45)',
                }}
              >
                03 // DESIGN & CREATIVE
              </span>
              <div
                className="mt-3 flex items-baseline gap-2"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                    fontWeight: 400,
                    lineHeight: 1,
                    color: '#F8F5EF',
                  }}
                >
                  {String(config.stats.designCreative).padStart(2, '0')}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    color: 'rgba(243, 239, 232, 0.45)',
                    letterSpacing: '0.1em',
                  }}
                >
                  DISCIPLINE
                </span>
              </div>
              <p
                className="mt-2"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8125rem',
                  color: 'rgba(243, 239, 232, 0.65)',
                  lineHeight: 1.5,
                }}
              >
                Editorial typography, interactive 3D aesthetics, and high-fidelity UX prototypes.
              </p>
            </div>

            {/* Stat 4: Specialist Network */}
            <div
              className="p-6 rounded-xl relative overflow-hidden transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(243, 239, 232, 0.45)',
                }}
              >
                04 // COLLABORATORS
              </span>
              <div
                className="mt-3 flex items-baseline gap-2"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                    fontWeight: 400,
                    lineHeight: 1,
                    color: '#D9B978',
                  }}
                >
                  On-Demand
                </span>
              </div>
              <p
                className="mt-2"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8125rem',
                  color: 'rgba(243, 239, 232, 0.65)',
                  lineHeight: 1.5,
                }}
              >
                Vetted specialist network engaged as needed for niche sound, 3D modelling, or domain advisory.
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================================
            3. VERIFIED TEAM PROFILE & ARCHITECTURAL VISUAL
            ===================================================================== */}
        <div ref={profileRef} className="mb-16 sm:mb-24">
          <div className="flex items-center gap-3 mb-6">
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#C9A466',
              }}
            >
              STUDIO ARCHITECT & LEADERSHIP
            </span>
            <span
              aria-hidden="true"
              style={{ width: '24px', height: '1px', background: 'rgba(201, 164, 102, 0.35)' }}
            />
          </div>

          <div
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch p-6 sm:p-10 rounded-2xl"
            style={{
              background: 'linear-gradient(145deg, #101016 0%, #0B0C10 100%)',
              border: '1px solid rgba(201, 164, 102, 0.32)',
              boxShadow: '0 25px 60px -25px rgba(0, 0, 0, 0.7)',
            }}
          >
            {/* Left: Monogram / Visual Identity Emblem */}
            <div className="lg:col-span-4 flex flex-col justify-between items-center text-center p-6 rounded-xl border border-white/5 bg-black/30">
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center relative overflow-hidden my-4"
                style={{
                  border: '1px solid rgba(201, 164, 102, 0.45)',
                  background: 'radial-gradient(circle at 35% 35%, #181A22 0%, #0A0C0E 100%)',
                  boxShadow: '0 12px 35px rgba(201, 164, 102, 0.16)',
                }}
              >
                {primaryMember.portraitUrl ? (
                  <img
                    src={primaryMember.portraitUrl}
                    alt={primaryMember.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(2.2rem, 3vw, 2.75rem)',
                      color: '#F8F5EF',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {primaryMember.monogram}
                  </span>
                )}
                {/* Subtle sheen highlight */}
                <div
                  aria-hidden="true"
                  className="qt-transition-sheen"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '45%',
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(201, 164, 102, 0.28) 50%, transparent 100%)',
                    pointerEvents: 'none',
                  }}
                />
              </div>

              <div>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3"
                  style={{
                    background: 'rgba(201, 164, 102, 0.12)',
                    border: '1px solid rgba(201, 164, 102, 0.35)',
                    color: '#D9B978',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.5625rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                  }}
                >
                  <CheckCircle2 size={11} strokeWidth={2} />
                  {primaryMember.employmentType}
                </span>

                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.75rem, 2.4vw, 2.2rem)',
                    fontWeight: 400,
                    color: '#F8F5EF',
                    lineHeight: 1.15,
                    marginBottom: '0.25rem',
                  }}
                >
                  {primaryMember.name}
                </h3>

                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: '#C9A466',
                  }}
                >
                  {primaryMember.role}
                </p>
              </div>

              {/* Profile links */}
              <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/10 w-full justify-center">
                {primaryMember.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 group"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'rgba(243, 239, 232, 0.7)',
                      textDecoration: 'none',
                      transition: 'color 200ms',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#D9B978')}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = 'rgba(243, 239, 232, 0.7)')
                    }
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight
                      size={12}
                      strokeWidth={1.75}
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Technical Focus & Philosophy */}
            <div className="lg:col-span-8 flex flex-col justify-between py-2 lg:pl-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: '#C9A466',
                    }}
                  >
                    TECHNICAL FOCUS & APPROACH
                  </span>
                </div>

                <h4
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.4rem, 2vw, 1.85rem)',
                    fontWeight: 400,
                    lineHeight: 1.25,
                    color: '#F8F5EF',
                  }}
                >
                  Direct engineering involvement from first principles to launch.
                </h4>

                <p
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.94rem',
                    lineHeight: 1.76,
                    color: 'rgba(243, 239, 232, 0.85)',
                    fontWeight: 300,
                  }}
                >
                  {primaryMember.bio}
                </p>

                <p
                  className="mb-6"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9rem',
                    lineHeight: 1.72,
                    color: 'rgba(243, 239, 232, 0.65)',
                    fontWeight: 300,
                  }}
                >
                  {primaryMember.specialisation}
                </p>
              </div>

              {/* Core Disciplines Badges */}
              <div>
                <span
                  className="block mb-2.5"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.5625rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(243, 239, 232, 0.45)',
                  }}
                >
                  CORE TECHNICAL DISCIPLINES
                </span>
                <div className="flex flex-wrap gap-2">
                  {primaryMember.disciplines.map((d) => (
                    <span
                      key={d}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.625rem',
                        letterSpacing: '0.12em',
                        padding: '0.4rem 0.85rem',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'rgba(243, 239, 232, 0.85)',
                      }}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================================
            4. TECHNICAL EXPERTISE AREAS (7 GENUINE SUPPORTED CAPABILITIES)
            ===================================================================== */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8 sm:mb-10 pb-4 border-b border-white/10">
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#C9A466',
                  display: 'block',
                  marginBottom: '0.5rem',
                }}
              >
                SPECIALISED DOMAINS // 07 PILLARS
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 3.2vw, 2.85rem)',
                  fontWeight: 400,
                  color: '#F8F5EF',
                  lineHeight: 1.1,
                }}
              >
                Capabilities we{' '}
                <span className="italic" style={{ color: '#D9B978' }}>
                  directly support.
                </span>
              </h3>
            </div>

            <p
              className="max-w-md"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.875rem',
                lineHeight: 1.65,
                color: 'rgba(243, 239, 232, 0.6)',
              }}
            >
              Every capability is backed by real production architecture, proven libraries, and continuous delivery experience.
            </p>
          </div>

          <div
            ref={expertiseGridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {TEAM_EXPERTISE_AREAS.map((area: TeamExpertiseArea, idx: number) => {
              const Icon = EXPERTISE_ICONS[area.id] || Code2
              const isHovered = activeAreaId === area.id
              const isFeatured = idx === 0 // First card has subtle prominent accent

              return (
                <article
                  key={area.id}
                  onMouseEnter={() => setActiveAreaId(area.id)}
                  onMouseLeave={() => setActiveAreaId(null)}
                  className="p-6 sm:p-7 rounded-xl flex flex-col justify-between transition-all duration-300"
                  style={{
                    background: isFeatured
                      ? 'linear-gradient(155deg, rgba(201, 164, 102, 0.05) 0%, rgba(16, 16, 22, 0.95) 100%)'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: isHovered
                      ? '1px solid rgba(201, 164, 102, 0.45)'
                      : isFeatured
                      ? '1px solid rgba(201, 164, 102, 0.24)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: isHovered
                      ? '0 16px 36px -16px rgba(201, 164, 102, 0.16)'
                      : 'none',
                    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                  }}
                >
                  <div>
                    {/* Top Row: Number & Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.625rem',
                          letterSpacing: '0.2em',
                          color: '#C9A466',
                          fontWeight: 600,
                        }}
                      >
                        {area.number}
                      </span>
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300"
                        style={{
                          background: isHovered
                            ? 'rgba(201, 164, 102, 0.2)'
                            : 'rgba(255, 255, 255, 0.04)',
                          border: isHovered
                            ? '1px solid rgba(201, 164, 102, 0.45)'
                            : '1px solid rgba(255, 255, 255, 0.09)',
                          color: isHovered ? '#F8F5EF' : '#D9B978',
                        }}
                      >
                        <Icon size={16} strokeWidth={1.6} />
                      </div>
                    </div>

                    <h4
                      className="mb-2.5"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.35rem, 1.8vw, 1.65rem)',
                        fontWeight: 400,
                        lineHeight: 1.2,
                        color: '#F8F5EF',
                      }}
                    >
                      {area.title}
                    </h4>

                    <p
                      className="mb-5"
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.875rem',
                        lineHeight: 1.68,
                        color: 'rgba(243, 239, 232, 0.68)',
                        fontWeight: 300,
                      }}
                    >
                      {area.description}
                    </p>
                  </div>

                  {/* Tech Tags */}
                  <div className="pt-4 border-t border-white/5 flex flex-wrap gap-1.5">
                    {area.technologies.map((tech) => (
                      <span
                        key={tech}
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.5625rem',
                          letterSpacing: '0.08em',
                          padding: '0.25rem 0.55rem',
                          borderRadius: '4px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          color: 'rgba(243, 239, 232, 0.65)',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
