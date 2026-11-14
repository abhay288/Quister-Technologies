import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { smoothScrollTo } from '../../utils/smoothScroll'
import { AppRoute, navigateTo } from '../../utils/router'

interface NavLinkItem {
  label: string
  route: AppRoute
  hash?: string
}

const navLinks: NavLinkItem[] = [
  { label: 'Work', route: '/', hash: '#work' },
  { label: 'About', route: '/about' },
  { label: 'Process', route: '/', hash: '#process' },
  { label: 'Contact', route: '/', hash: '#contact' },
]

interface NavigationProps {
  currentRoute: AppRoute
}

export default function Navigation({ currentRoute }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [timeString, setTimeString] = useState('')
  const navRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Live UTC / IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeString(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }) + ' IST'
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Reveal nav on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -25,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.2,
      })
    })
    return () => ctx.revert()
  }, [])

  // Scroll state
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Mobile menu animation
  useEffect(() => {
    if (!menuRef.current) return
    if (menuOpen) {
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      )
    }
  }, [menuOpen])

  const handleNavClick = (item: NavLinkItem) => {
    setMenuOpen(false)
    navigateTo(item.route, item.hash)
  }

  return (
    <>
      <header
        ref={navRef}
        role="banner"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-3.5 backdrop-blur-xl border-b border-white/5'
            : 'py-5'
        }`}
        style={{
          background: scrolled
            ? 'rgba(11, 12, 16, 0.88)'
            : 'transparent',
        }}
      >
        <div className="container-wide flex items-center justify-between">
          {/* Left: Brand Emblem + Wordmark */}
          <div className="flex items-center gap-6">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault()
                setMenuOpen(false)
                if (currentRoute === '/') {
                  smoothScrollTo(0, { duration: 1.4 })
                } else {
                  navigateTo('/')
                }
              }}
              aria-label="QUISTER TECHNOLOGIES — Home"
              className="flex items-center gap-3 group"
              style={{ textDecoration: 'none' }}
            >
              {/* Official 3D Metallic Golden Q Emblem */}
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  border: '1px solid rgba(216, 180, 109, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'radial-gradient(circle at 35% 35%, #181A22 0%, #0A0C0E 100%)',
                  boxShadow: '0 0 16px rgba(216, 180, 109, 0.16)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 350ms cubic-bezier(0.16, 1, 0.3, 1)',
                  padding: '3px',
                }}
                className="group-hover:border-champagne group-hover:scale-105 group-hover:shadow-[0_0_24px_rgba(216,180,109,0.35)]"
              >
                <img
                  src="/assets/logo/quister-emblem.png"
                  alt="Quister Technologies Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>

              <div className="flex flex-col leading-tight">
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    color: 'var(--color-champagne)',
                    transition: 'opacity 300ms',
                  }}
                  className="group-hover:opacity-85"
                >
                  QUISTER
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.78125rem',
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--color-ivory)',
                  }}
                >
                  TECHNOLOGIES
                </span>
              </div>
            </a>

            {/* Studio Time Indicator with Live IST Clock */}
            <div className="hidden xl:flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.2em] text-champagne/80 pl-4 border-l border-white/10">
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 8px rgba(16, 185, 129, 0.9)',
                  display: 'inline-block',
                }}
              />
              <span>STUDIO // {timeString || '22:46 IST'}</span>
            </div>
          </div>

          {/* Center & Right Navigation */}
          <div className="flex items-center gap-6 lg:gap-8">
            {/* Desktop Nav Links */}
            <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-7 xl:gap-8">
              {navLinks.map((link) => {
                const isActive = link.route === '/about' && currentRoute === '/about'
                const href = link.hash ? `${link.route === '/' ? '' : link.route}/${link.hash}`.replace('//', '/') : link.route

                return (
                  <a
                    key={link.label}
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavClick(link)
                    }}
                    className="group relative"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px 0',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.75rem',
                      fontWeight: isActive ? 600 : 500,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      color: isActive ? 'var(--color-champagne)' : 'rgba(243, 239, 232, 0.72)',
                      transition: 'color 300ms',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = isActive ? 'var(--color-champagne-light)' : 'var(--color-ivory)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = isActive
                        ? 'var(--color-champagne)'
                        : 'rgba(243, 239, 232, 0.72)'
                    }}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: isActive ? '100%' : '0%',
                        height: '1px',
                        background: 'var(--color-champagne)',
                        transition: 'width 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      className="group-hover:w-full"
                    />
                  </a>
                )
              })}
            </nav>

            {/* Right Group: START A PROJECT Button + 3x3 Dots */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <a
                href="/#contact"
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick({ label: 'Contact', route: '/', hash: '#contact' })
                }}
                className="btn-primary whitespace-nowrap"
                style={{
                  padding: '0.58rem 1.05rem',
                  fontSize: '0.625rem',
                  letterSpacing: '0.13em',
                  fontWeight: 600,
                  borderRadius: '9999px',
                  backgroundColor: 'var(--color-champagne)',
                  color: 'var(--color-near-black)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 20px rgba(215, 179, 106, 0.28)',
                }}
              >
                <span className="sm:hidden">START</span>
                <span className="hidden sm:inline">START A PROJECT</span>
                <span style={{ fontSize: '0.825rem', transform: 'translateY(-0.5px)' }}>↗</span>
              </a>

              {/* 3x3 Dots Grid Icon Button */}
              <button
                type="button"
                aria-label="Toggle navigation drawer"
                onClick={() => setMenuOpen(!menuOpen)}
                className="hidden sm:flex w-9 h-9 rounded-lg border border-champagne/30 items-center justify-center text-champagne hover:border-champagne/80 hover:bg-champagne/10 transition-all cursor-pointer"
                style={{
                  background: 'rgba(20, 16, 28, 0.45)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div className="grid grid-cols-3 gap-1">
                  {[...Array(9)].map((_, i) => (
                    <span key={i} className="w-1 h-1 rounded-full bg-current opacity-85" />
                  ))}
                </div>
              </button>
            </div>
          </div>

          {/* Mobile & Tablet menu toggle */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2 ml-2 shrink-0"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span
              style={{
                display: 'block',
                width: '24px',
                height: '1px',
                background: 'var(--color-ivory)',
                transition: 'transform 300ms',
                transformOrigin: 'center',
                transform: menuOpen ? 'translateY(5px) rotate(45deg)' : 'none',
              }}
            />
            <span
              style={{
                display: 'block',
                width: '18px',
                height: '1px',
                background: 'var(--color-champagne)',
                transition: 'opacity 300ms',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: 'block',
                width: '24px',
                height: '1px',
                background: 'var(--color-ivory)',
                transition: 'transform 300ms',
                transformOrigin: 'center',
                transform: menuOpen ? 'translateY(-5px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 48,
            background: 'rgba(11, 12, 16, 0.98)',
            backdropFilter: 'blur(25px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
          }}
        >
          {navLinks.map((link) => {
            const isActive = link.route === '/about' && currentRoute === '/about'
            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.2rem, 7vw, 3.5rem)',
                  fontWeight: 300,
                  letterSpacing: '0.04em',
                  color: isActive ? 'var(--color-champagne)' : 'var(--color-ivory)',
                  transition: 'color 300ms',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-champagne)')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = isActive ? 'var(--color-champagne)' : 'var(--color-ivory)')
                }
              >
                {link.label}
              </button>
            )
          })}
          <a
            href="/#contact"
            onClick={(e) => {
              e.preventDefault()
              handleNavClick({ label: 'Contact', route: '/', hash: '#contact' })
            }}
            className="btn-primary mt-4"
          >
            Start a Project
          </a>
        </div>
      )}
    </>
  )
}
