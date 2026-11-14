import { useState, useEffect } from 'react'
import { ArrowUp, ArrowUpRight, X } from 'lucide-react'
import { smoothScrollTo } from '../../utils/smoothScroll'
import { AppRoute, navigateTo } from '../../utils/router'

interface SitemapItem {
  label: string
  route: AppRoute
  hash?: string
}

const sitemap: SitemapItem[] = [
  { label: 'Selected Work', route: '/', hash: '#work' },
  { label: 'About Studio', route: '/about' },
  { label: 'Process Lifecycle', route: '/', hash: '#process' },
  { label: 'Technology Capabilities', route: '/about', hash: '#technology-expertise' },
  { label: 'Initiate Collaboration', route: '/', hash: '#contact' },
]

const servicesList = [
  'Web Platforms & Micro-frontends',
  'Mobile Ecosystems (iOS/Android)',
  'Scalable E-Commerce Infrastructure',
  'Custom Enterprise Software',
  'AI & Neural Intelligent Systems',
  'Digital Architecture Advisory',
]

const projectsList = [
  'B2B E-Commerce & Distribution Platform',
  'Retail Commerce Application (Android + Web)',
  'AI Hardware Circularity Platform',
  'Enterprise Logistics & Operations Engine',
]

type LegalDocType = 'privacy' | 'terms' | null

export default function Footer() {
  const [legalDoc, setLegalDoc] = useState<LegalDocType>(null)

  useEffect(() => {
    if (!legalDoc) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLegalDoc(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [legalDoc])

  const scrollToTop = () => {
    smoothScrollTo(0, { duration: 1.4 })
  }

  const handleNavClick = (item: SitemapItem) => {
    navigateTo(item.route, item.hash)
  }

  return (
    <footer
      role="contentinfo"
      style={{
        background: '#090A0D',
        padding: 'clamp(5rem, 9vw, 7rem) 0 2.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative',
      }}
    >
      <div className="container-wide">
        {/* Top Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: 'clamp(2.5rem, 5vw, 4rem)',
            marginBottom: 'clamp(3rem, 6vw, 5rem)',
            paddingBottom: 'clamp(3rem, 6vw, 4rem)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          {/* Brand Info */}
          <div>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault()
                navigateTo('/')
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.875rem',
                marginBottom: '1.25rem',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  border: '1px solid rgba(201, 169, 110, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 0, 0, 0.85)',
                  boxShadow: '0 0 20px rgba(201, 169, 110, 0.2)',
                  overflow: 'hidden',
                  padding: '3px',
                }}
              >
                <img
                  src="/assets/logo/quister-emblem.png"
                  alt="Quister Technologies Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    color: 'var(--color-champagne)',
                  }}
                >
                  QUISTER
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--color-ivory)',
                  }}
                >
                  TECHNOLOGIES
                </span>
              </div>
            </a>

            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8125rem',
                fontWeight: 300,
                lineHeight: 1.7,
                color: 'rgba(245, 240, 232, 0.45)',
                marginBottom: '1.75rem',
                maxWidth: '280px',
              }}
            >
              Engineering Digital Excellence. An independent software engineering studio crafting
              high-velocity platforms for visionary teams.
            </p>

            <a
              href="mailto:hello@quistertech.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-champagne)',
                textDecoration: 'none',
              }}
            >
              hello@quistertech.com
              <ArrowUpRight size={12} strokeWidth={1.5} />
            </a>
          </div>

          {/* Navigation Sitemap */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5625rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(245, 240, 232, 0.35)',
                marginBottom: '1.25rem',
              }}
            >
              INDEX // NAVIGATION
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {sitemap.map((item) => {
                const href = item.hash
                  ? `${item.route === '/' ? '' : item.route}/${item.hash}`.replace('//', '/')
                  : item.route
                return (
                  <li key={item.label}>
                    <a
                      href={href}
                      onClick={(e) => {
                        e.preventDefault()
                        handleNavClick(item)
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.8125rem',
                        color: 'rgba(245, 240, 232, 0.6)',
                        transition: 'color 200ms',
                        padding: 0,
                        textDecoration: 'none',
                        display: 'inline-block',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-champagne)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245, 240, 232, 0.6)')}
                    >
                      {item.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Core Services */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5625rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(245, 240, 232, 0.35)',
                marginBottom: '1.25rem',
              }}
            >
              CAPABILITIES // MATRIX
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {servicesList.map((srv) => (
                <li
                  key={srv}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8125rem',
                    color: 'rgba(245, 240, 232, 0.5)',
                  }}
                >
                  {srv}
                </li>
              ))}
            </ul>
          </div>

          {/* Featured Platforms */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5625rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(245, 240, 232, 0.35)',
                marginBottom: '1.25rem',
              }}
            >
              PLATFORMS // ARCHITECTURE
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {projectsList.map((proj) => (
                <li
                  key={proj}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8125rem',
                    color: 'rgba(245, 240, 232, 0.5)',
                  }}
                >
                  {proj}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem' }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5625rem',
                letterSpacing: '0.15em',
                color: 'rgba(245, 240, 232, 0.35)',
                margin: 0,
              }}
            >
              © {new Date().getFullYear()} QUISTER TECHNOLOGIES. ALL RIGHTS RESERVED.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setLegalDoc('privacy')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5625rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(245, 240, 232, 0.48)',
                  padding: 0,
                  transition: 'color 200ms',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-champagne)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245, 240, 232, 0.48)')}
              >
                Privacy Policy
              </button>
              <span aria-hidden="true" style={{ color: 'rgba(245, 240, 232, 0.2)', fontSize: '0.65rem' }}>
                /
              </span>
              <button
                type="button"
                onClick={() => setLegalDoc('terms')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5625rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(245, 240, 232, 0.48)',
                  padding: 0,
                  transition: 'color 200ms',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-champagne)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245, 240, 232, 0.48)')}
              >
                Terms of Service
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'rgba(245, 240, 232, 0.6)',
              padding: '0.4rem 0.85rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5625rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 200ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-champagne)'
              e.currentTarget.style.color = 'var(--color-champagne)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.color = 'rgba(245, 240, 232, 0.6)'
            }}
          >
            Back to Top
            <ArrowUp size={12} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Accessible Privacy Policy & Terms Dialog */}
      {legalDoc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-dialog-title"
          onClick={() => setLegalDoc(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 120,
            background: 'rgba(9, 9, 14, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '640px',
              width: '100%',
              background: '#101016',
              border: '1px solid rgba(201, 164, 102, 0.35)',
              borderRadius: '16px',
              padding: 'clamp(1.75rem, 4vw, 2.5rem)',
              color: '#F3EFE8',
              boxShadow: '0 30px 70px rgba(0, 0, 0, 0.75)',
            }}
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    letterSpacing: '0.2em',
                    color: '#C9A466',
                    textTransform: 'uppercase',
                  }}
                >
                  QUISTER TECHNOLOGIES // STUDIO POLICY
                </span>
                <h2
                  id="legal-dialog-title"
                  className="mt-1"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    color: '#F8F5EF',
                  }}
                >
                  {legalDoc === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
                </h2>
              </div>

              <button
                type="button"
                aria-label="Close policy dialog"
                onClick={() => setLegalDoc(null)}
                className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  color: '#F3EFE8',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {legalDoc === 'privacy' ? (
              <div
                className="space-y-3"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.92rem',
                  lineHeight: 1.75,
                  color: 'rgba(243, 239, 232, 0.75)',
                }}
              >
                <p>
                  QUISTER TECHNOLOGIES collects only the project inquiry information you voluntarily
                  submit when contacting our studio (such as your name, email address and project
                  details) solely to evaluate and respond to your inquiry.
                </p>
                <p>
                  We do not sell personal information or share inquiry submissions with third-party
                  marketers. Questions or deletion requests can be sent directly to{' '}
                  <a href="mailto:hello@quistertech.com" style={{ color: '#D9B978' }}>
                    hello@quistertech.com
                  </a>
                  .
                </p>
              </div>
            ) : (
              <div
                className="space-y-3"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.92rem',
                  lineHeight: 1.75,
                  color: 'rgba(243, 239, 232, 0.75)',
                }}
              >
                <p>
                  All showcase materials and descriptions presented on this website remain the
                  intellectual property of QUISTER TECHNOLOGIES or their respective project owners.
                </p>
                <p>
                  Project engagements, deliverables, milestones and ownership terms are governed
                  exclusively by formal written project proposals executed between QUISTER
                  TECHNOLOGIES and each client prior to commencement of work.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  )
}
