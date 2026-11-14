import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Sparkles, Cpu, ShieldCheck, Zap, Globe } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export interface FloatingItem {
  id: string
  label: string
  icon?: any
  color?: string
  top?: string
  left?: string
  right?: string
  bottom?: string
  speed?: number
  delay?: number
}

const defaultPills: FloatingItem[] = [
  {
    id: '1',
    label: 'ZERO-LATENCY DISPATCH',
    icon: Zap,
    color: '#D4B276',
    top: '12%',
    left: '4%',
    speed: -0.25,
    delay: 0,
  },
  {
    id: '2',
    label: '100% PRODUCTION DELIVERED',
    icon: ShieldCheck,
    color: '#4ADE80',
    top: '22%',
    right: '5%',
    speed: 0.35,
    delay: 0.6,
  },
  {
    id: '3',
    label: 'NEURAL WEBGL CORE',
    icon: Cpu,
    color: '#60A5FA',
    top: '68%',
    left: '3%',
    speed: -0.3,
    delay: 1.2,
  },
  {
    id: '4',
    label: 'HIGH-THROUGHPUT COMMERCE',
    icon: Globe,
    color: '#E5C07B',
    top: '78%',
    right: '6%',
    speed: 0.2,
    delay: 0.9,
  },
]

interface FloatingElementsProps {
  items?: FloatingItem[]
  className?: string
  containerStyle?: React.CSSProperties
}

/**
 * Noomo Agency Inspired Floating Elements
 * - Ambient sine-wave zero gravity hover float
 * - Scroll-triggered multi-speed parallax drift
 * - Interactive pointer repulsion/tracking
 */
export default function FloatingElements({
  items = defaultPills,
  className = '',
  containerStyle = {},
}: FloatingElementsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      // Setup continuous floating bob + scroll parallax for each pill
      itemRefs.current.forEach((el, index) => {
        if (!el) return
        const item = items[index]
        const speed = item.speed || 0.2
        const delay = item.delay || 0

        // 1. Ambient zero-gravity floating oscillation
        gsap.to(el, {
          y: '-=16',
          rotateZ: index % 2 === 0 ? 3 : -3,
          duration: 3 + index * 0.7,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay,
        })

        // 2. Scroll-triggered parallax trajectory
        gsap.to(el, {
          yPercent: speed * 120,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        })
      })

      // 3. Pointer proximity deflection (Noomo interactive feel)
      const handlePointerMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        itemRefs.current.forEach((el) => {
          if (!el) return
          const pillRect = el.getBoundingClientRect()
          const pillCenterX = pillRect.left + pillRect.width / 2 - rect.left
          const pillCenterY = pillRect.top + pillRect.height / 2 - rect.top

          const distDX = mouseX - pillCenterX
          const distDY = mouseY - pillCenterY
          const distance = Math.sqrt(distDX * distDX + distDY * distDY)

          // If mouse is within 220px, apply subtle magnetic deflection
          if (distance < 220) {
            const force = (1 - distance / 220) * 18
            const moveX = (distDX / distance) * -force
            const moveY = (distDY / distance) * -force

            gsap.to(el, {
              x: moveX,
              y: moveY,
              duration: 0.5,
              ease: 'power2.out',
              overwrite: 'auto',
            })
          } else {
            gsap.to(el, {
              x: 0,
              duration: 0.8,
              ease: 'power2.out',
              overwrite: 'auto',
            })
          }
        })
      }

      window.addEventListener('mousemove', handlePointerMove, { passive: true })

      return () => {
        window.removeEventListener('mousemove', handlePointerMove)
      }
    }, containerRef)

    return () => ctx.revert()
  }, [items])

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 3,
        ...containerStyle,
      }}
    >
      {items.map((item, index) => {
        const Icon = item.icon || Sparkles
        const color = item.color || '#D4B276'

        return (
          <div
            key={item.id}
            ref={(node) => (itemRefs.current[index] = node)}
            style={{
              position: 'absolute',
              top: item.top,
              left: item.left,
              right: item.right,
              bottom: item.bottom,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 0.9rem',
              background: 'rgba(12, 14, 20, 0.78)',
              border: `1px solid ${color}45`,
              backdropFilter: 'blur(12px)',
              boxShadow: `0 12px 30px rgba(0, 0, 0, 0.6), 0 0 15px ${color}15`,
              borderRadius: '100px',
              pointerEvents: 'auto',
              cursor: 'default',
              userSelect: 'none',
              transformStyle: 'preserve-3d',
              transition: 'border-color 300ms, box-shadow 300ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = color
              e.currentTarget.style.boxShadow = `0 14px 40px rgba(0, 0, 0, 0.8), 0 0 25px ${color}35`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = `${color}45`
              e.currentTarget.style.boxShadow = `0 12px 30px rgba(0, 0, 0, 0.6), 0 0 15px ${color}15`
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: color,
                boxShadow: `0 0 8px ${color}`,
              }}
            />
            <Icon size={13} color={color} strokeWidth={1.75} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5625rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--color-ivory)',
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
