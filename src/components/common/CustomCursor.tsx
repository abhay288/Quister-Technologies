import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show on desktop devices with fine pointer
    if (!window.matchMedia('(pointer: fine)').matches) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let animationFrameId: number

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!isVisible) setIsVisible(true)

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      }
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    // Check for interactive element hovering
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target) return

      const isInteractive = Boolean(
        target.closest('a, button, [role="button"], .work-card, input, textarea')
      )
      setIsHovering(isInteractive)
    }

    // Smooth lerp loop for the outer ring
    const render = () => {
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      }

      animationFrameId = requestAnimationFrame(render)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseover', handleElementHover, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
    animationFrameId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleElementHover)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <>
      {/* Center sharp dot */}
      <div
        ref={cursorDotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          marginTop: '-3px',
          marginLeft: '-3px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-champagne)',
          pointerEvents: 'none',
          zIndex: 99999,
          transform: 'translate3d(-100px, -100px, 0)',
          transition: 'width 200ms, height 200ms, background-color 200ms',
          boxShadow: '0 0 10px rgba(201, 169, 110, 0.8)',
        }}
      />

      {/* Lagging outer halo */}
      <div
        ref={cursorRingRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovering ? '44px' : '26px',
          height: isHovering ? '44px' : '26px',
          marginTop: isHovering ? '-22px' : '-13px',
          marginLeft: isHovering ? '-22px' : '-13px',
          borderRadius: '50%',
          border: '1px solid rgba(201, 169, 110, 0.45)',
          backgroundColor: isHovering ? 'rgba(201, 169, 110, 0.08)' : 'transparent',
          pointerEvents: 'none',
          zIndex: 99998,
          transform: 'translate3d(-100px, -100px, 0)',
          transition: 'width 250ms cubic-bezier(0.16, 1, 0.3, 1), height 250ms cubic-bezier(0.16, 1, 0.3, 1), margin 250ms cubic-bezier(0.16, 1, 0.3, 1), border-color 200ms, background-color 200ms',
        }}
      />
    </>
  )
}
