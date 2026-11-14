import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { smoothScrollTo } from '../../utils/smoothScroll'
import { AppRoute } from '../../utils/router'

export default function ScrollHUD({ currentRoute }: { currentRoute: AppRoute }) {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [currentSection, setCurrentSection] = useState(currentRoute === '/about' ? 'ABOUT' : 'HERO')

  useEffect(() => {
    setCurrentSection(currentRoute === '/about' ? 'ABOUT' : 'HERO')
  }, [currentRoute])

  useEffect(() => {
    // Listen for high-frequency Lenis scroll telemetry events
    const handleLenisScroll = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail && typeof detail.progress === 'number') {
        const p = Math.min(Math.max(detail.progress, 0), 1)
        setProgress(p)
        setIsVisible(detail.scroll > 280)
      }
    }

    // Standard fallback listener
    const handleNativeScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const p = maxScroll > 0 ? scrollY / maxScroll : 0
      setProgress(Math.min(Math.max(p, 0), 1))
      setIsVisible(scrollY > 280)

      if (currentRoute === '/about') {
        const aboutSections = Array.from(
          document.querySelectorAll<HTMLElement>('[data-scroll-section]')
        ).reverse()
        for (const el of aboutSections) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= 0) {
            setCurrentSection(el.dataset.scrollSection || 'ABOUT')
            break
          }
        }
        return
      }

      // Detect current section in view on home route
      const sections = ['contact', 'process', 'about', 'work', 'hero']
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= 0) {
            setCurrentSection(id.toUpperCase())
            break
          }
        }
      }
    }

    window.addEventListener('lenis:scroll', handleLenisScroll)
    window.addEventListener('scroll', handleNativeScroll, { passive: true })
    handleNativeScroll()

    return () => {
      window.removeEventListener('lenis:scroll', handleLenisScroll)
      window.removeEventListener('scroll', handleNativeScroll)
    }
  }, [currentRoute])

  const handleScrollToTop = () => {
    smoothScrollTo(0, { duration: 1.5 })
  }

  // Calculate SVG circular stroke offset
  const radius = 18
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - progress * circumference
  const percentText = Math.round(progress * 100)

  return (
    <>
      {/* Floating Smooth Scroll Companion Dial (Bottom-Right) */}
      <div
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 80,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.92)',
          pointerEvents: isVisible ? 'auto' : 'none',
          transition: 'opacity 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Monospace Section Telemetry Pill */}
        <div
          style={{
            padding: '0.4rem 0.75rem',
            background: 'rgba(11, 13, 18, 0.88)',
            border: '1px solid rgba(212, 178, 118, 0.25)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          }}
        >
          <span
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              backgroundColor: '#D4B276',
              boxShadow: '0 0 6px #D4B276',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5625rem',
              letterSpacing: '0.18em',
              color: 'var(--color-ivory)',
              textTransform: 'uppercase',
            }}
          >
            {currentSection} // {percentText}%
          </span>
        </div>

        {/* Circular Progress Ring with Smooth Return Button */}
        <button
          onClick={handleScrollToTop}
          aria-label="Smooth scroll back to top"
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: 'rgba(11, 13, 18, 0.92)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(212, 178, 118, 0.15)',
            transition: 'transform 300ms, box-shadow 300ms',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.8), 0 0 20px rgba(212, 178, 118, 0.35)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)'
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(212, 178, 118, 0.15)'
          }}
        >
          {/* Circular SVG Progress Ring */}
          <svg
            width="46"
            height="46"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: 'rotate(-90deg)',
            }}
          >
            {/* Background track */}
            <circle
              cx="23"
              cy="23"
              r={radius}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="2"
              fill="transparent"
            />
            {/* Active progress stroke */}
            <circle
              cx="23"
              cy="23"
              r={radius}
              stroke="var(--color-champagne)"
              strokeWidth="2"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{
                transition: 'stroke-dashoffset 80ms linear',
              }}
            />
          </svg>

          {/* Up Arrow Icon */}
          <ArrowUp size={16} color="var(--color-ivory)" strokeWidth={2} style={{ position: 'relative', zIndex: 2 }} />
        </button>
      </div>
    </>
  )
}
