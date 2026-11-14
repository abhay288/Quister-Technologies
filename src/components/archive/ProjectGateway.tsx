import { useState, useRef, useEffect } from 'react'

interface ProjectGatewayProps {
  onActivate?: () => void
  onEnter?: () => void
}

export default function ProjectGateway({ onActivate, onEnter }: ProjectGatewayProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isActivating, setIsActivating] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0, mx: 0, my: 0 })

  useEffect(() => {
    const btn = buttonRef.current
    if (!btn) return

    const handlePointerMove = (e: PointerEvent) => {
      const rect = btn.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dx = (e.clientX - centerX) / (rect.width / 2)
      const dy = (e.clientY - centerY) / (rect.height / 2)

      // Only apply magnetic pull when pointer is near the button
      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY)
      if (dist < 180) {
        setTilt({
          x: -dy * 12, // subtle 3D tilt
          y: dx * 14,
          mx: dx * 10, // magnetic pull
          my: dy * 8,
        })
      } else {
        setTilt({ x: 0, y: 0, mx: 0, my: 0 })
      }
    }

    const handlePointerLeave = () => {
      setTilt({ x: 0, y: 0, mx: 0, my: 0 })
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    btn.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      btn.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  const handleActivate = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isActivating) return

    setIsActivating(true)
    const callback = onActivate || onEnter
    if (callback) callback()
    setTimeout(() => setIsActivating(false), 600)
  }

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        perspective: '1000px',
        marginTop: 'clamp(1.5rem, 3vh, 2.5rem)',
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={handleActivate}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Explore Our Projects — Enter the 3D Project Archive"
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '1.4rem',
          padding: '1.05rem 2.4rem',
          background: isActivating
            ? 'linear-gradient(135deg, rgba(243, 209, 140, 0.35) 0%, rgba(20, 16, 26, 0.98) 100%)'
            : isHovered
            ? 'linear-gradient(135deg, rgba(212, 178, 118, 0.22) 0%, rgba(14, 15, 20, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(212, 178, 118, 0.12) 0%, rgba(10, 11, 15, 0.92) 100%)',
          border: '1px solid',
          borderColor: isActivating
            ? '#F3D18C'
            : isHovered
            ? 'rgba(243, 209, 140, 0.75)'
            : 'rgba(212, 178, 118, 0.42)',
          borderRadius: '9999px',
          boxShadow: isActivating
            ? '0 0 45px rgba(243, 209, 140, 0.55), 0 20px 50px rgba(0, 0, 0, 0.9)'
            : isHovered
            ? '0 16px 45px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 178, 118, 0.35)'
            : '0 12px 35px rgba(0, 0, 0, 0.7), 0 0 20px rgba(212, 178, 118, 0.15)',
          cursor: 'pointer',
          transform: `translate3d(${tilt.mx}px, ${tilt.my}px, 0) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${
            isActivating ? 1.04 : isHovered ? 1.02 : 1
          })`,
          transition: isActivating
            ? 'all 280ms cubic-bezier(0.16, 1, 0.3, 1)'
            : 'transform 180ms ease-out, background 300ms, border-color 300ms, box-shadow 300ms',
          outline: 'none',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        {/* Subtle internal metallic sheen */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '9999px',
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, transparent 60%, rgba(0, 0, 0, 0.3) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Text Group */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.72rem, 0.85vw, 0.82rem)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: isActivating ? '#FFF8ED' : isHovered ? '#FFF2D6' : '#EDE8DF',
              fontWeight: 600,
              display: 'block',
              transition: 'color 200ms',
            }}
          >
            EXPLORE OUR PROJECTS
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5625rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#D4B276',
              opacity: 0.85,
              marginTop: '2px',
            }}
          >
            ENTER THE PROJECT ARCHIVE
          </span>
        </div>

        {/* Sculptural Directional Control Circle */}
        <div
          aria-hidden="true"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: isActivating
              ? '#F3D18C'
              : isHovered
              ? 'rgba(243, 209, 140, 0.25)'
              : 'rgba(212, 178, 118, 0.15)',
            border: '1px solid',
            borderColor: isActivating ? '#F3D18C' : 'rgba(243, 209, 140, 0.55)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isActivating ? '#0A0B0E' : '#D4B276',
            boxShadow: isHovered ? '0 0 15px rgba(243, 209, 140, 0.4)' : 'none',
            transform: `rotate(${isActivating ? '90deg' : isHovered ? '45deg' : '0deg'}) scale(${
              isHovered ? 1.08 : 1
            })`,
            transition: 'transform 350ms cubic-bezier(0.16, 1, 0.3, 1), background 300ms, color 300ms',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </div>
      </button>
    </div>
  )
}

