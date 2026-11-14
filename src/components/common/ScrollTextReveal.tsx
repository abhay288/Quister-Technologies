import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollTextRevealProps {
  children: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div'
  style?: React.CSSProperties
  stagger?: number
  duration?: number
  delay?: number
  scrubHighlight?: boolean
  highlightClass?: string
  accentWords?: string[]
  theme?: 'dark' | 'light'
}

/**
 * Noomo Agency Inspired Scroll-Triggered Text Reveal
 * - Wraps words in overflow-hidden masks
 * - Smoothly slides words up from 100% translateY with 3D rotation & opacity
 * - Optional scroll-scrub highlight (words illuminate as you scroll through)
 */
export default function ScrollTextReveal({
  children,
  className = '',
  as = 'div',
  style = {},
  stagger = 0.035,
  duration = 1.0,
  delay = 0,
  scrubHighlight = false,
  accentWords = [],
  theme = 'dark',
}: ScrollTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wordsRef = useRef<HTMLSpanElement[]>([])

  wordsRef.current = []

  const words = children.split(' ')

  const isLight = theme === 'light'
  const baseColor = isLight ? 'rgba(22, 24, 29, 0.25)' : 'rgba(245, 240, 232, 0.25)'
  const highlightColor = isLight ? '#16181D' : '#F5F0E8'
  const accentColor = isLight ? 'var(--color-champagne-dark)' : 'var(--color-champagne)'

  useEffect(() => {
    const el = containerRef.current
    if (!el || wordsRef.current.length === 0) return

    const ctx = gsap.context(() => {
      if (scrubHighlight) {
        // Noomo Agency Signature: Scroll-scrub word illumination
        gsap.fromTo(
          wordsRef.current,
          {
            opacity: 0.25,
            color: baseColor,
          },
          {
            opacity: 1,
            color: highlightColor,
            stagger: 0.05,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end: 'bottom 55%',
              scrub: 0.8,
            },
          }
        )
      } else {
        // Masked upward slide with perspective tilt
        gsap.fromTo(
          wordsRef.current,
          {
            yPercent: 120,
            rotateX: 25,
            opacity: 0,
            transformPerspective: 1000,
          },
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            duration,
            delay,
            stagger,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [scrubHighlight, duration, delay, stagger])

  const Component = as as any

  return (
    <Component
      ref={containerRef}
      className={className}
      style={{
        ...style,
        display: 'inline-block',
      }}
    >
      {words.map((word, index) => {
        const isAccent = accentWords.some(
          (acc) => word.toLowerCase().includes(acc.toLowerCase())
        )

        return (
          <span
            key={index}
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              verticalAlign: 'top',
              marginRight: '0.28em',
              lineHeight: 'inherit',
            }}
          >
            <span
              ref={(node) => {
                if (node) wordsRef.current.push(node)
              }}
              style={{
                display: 'inline-block',
                willChange: 'transform, opacity',
                color: isAccent ? accentColor : undefined,
                fontStyle: isAccent ? 'italic' : undefined,
              }}
            >
              {word}
            </span>
          </span>
        )
      })}
    </Component>
  )
}
