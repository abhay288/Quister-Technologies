import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

declare global {
  interface Window {
    __lenis?: Lenis | null
  }
}

let lenisInstance: Lenis | null = null

export interface SmoothScrollOptions {
  offset?: number
  duration?: number
  immediate?: boolean
  easing?: (t: number) => number
  onComplete?: () => void
}

/**
 * Custom quintic-exponential easing for buttery inertia feel
 */
export const defaultScrollEasing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))

/**
 * Initializes Lenis smooth scroll engine and binds to GSAP ScrollTrigger
 */
export function initSmoothScroll(): () => void {
  // Respect user's motion preferences
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    return () => {}
  }

  // Create Lenis instance with tuned cinematic parameters
  const lenis = new Lenis({
    duration: 1.25,
    easing: defaultScrollEasing,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.05,
    touchMultiplier: 1.6,
    infinite: false,
  })

  lenisInstance = lenis
  window.__lenis = lenis

  // Synchronize Lenis scroll with GSAP ScrollTrigger
  lenis.on('scroll', (e) => {
    ScrollTrigger.update()
    // Dispatch custom scroll telemetry event for companion HUD tools
    window.dispatchEvent(
      new CustomEvent('lenis:scroll', {
        detail: {
          scroll: e.scroll,
          limit: e.limit,
          velocity: e.velocity,
          direction: e.direction,
          progress: e.progress,
        },
      })
    )
  })

  // Hook into GSAP's high-precision ticker loop
  const tickerCallback = (time: number) => {
    lenis.raf(time * 1000)
  }

  gsap.ticker.add(tickerCallback)
  gsap.ticker.lagSmoothing(0)

  // Global anchor link interceptor for smooth scrolling
  const handleAnchorClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null
    const anchor = target?.closest('a') as HTMLAnchorElement | null
    if (!anchor) return

    const href = anchor.getAttribute('href')
    if (href && href.startsWith('#') && href.length > 1) {
      const destination = document.querySelector(href) as HTMLElement | null
      if (destination) {
        e.preventDefault()
        smoothScrollTo(destination, {
          offset: -20,
          duration: 1.35,
        })
      }
    }
  }

  document.addEventListener('click', handleAnchorClick, { passive: false })

  // Return comprehensive cleanup function
  return () => {
    document.removeEventListener('click', handleAnchorClick)
    gsap.ticker.remove(tickerCallback)
    lenis.destroy()
    lenisInstance = null
    window.__lenis = null
  }
}

/**
 * Returns the active Lenis smooth scroll instance
 */
export function getLenis(): Lenis | null {
  return lenisInstance || window.__lenis || null
}

/**
 * Universal smooth scroll function for buttons, navigation, and script triggers
 */
export function smoothScrollTo(
  target: string | number | HTMLElement,
  options: SmoothScrollOptions = {}
): void {
  const lenis = getLenis()
  const {
    offset = 0,
    duration = 1.35,
    immediate = false,
    easing = defaultScrollEasing,
    onComplete,
  } = options

  if (lenis) {
    lenis.scrollTo(target, {
      offset,
      duration,
      immediate,
      easing,
      onComplete,
    })
    return
  }

  // Graceful fallback if Lenis is disabled (e.g. reduced motion)
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' })
    if (onComplete) setTimeout(onComplete, 400)
  } else if (typeof target === 'string') {
    const el = document.querySelector(target) as HTMLElement | null
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY + offset
      window.scrollTo({ top, behavior: immediate ? 'auto' : 'smooth' })
      if (onComplete) setTimeout(onComplete, 400)
    }
  } else if (target instanceof HTMLElement) {
    const top = target.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top, behavior: immediate ? 'auto' : 'smooth' })
    if (onComplete) setTimeout(onComplete, 400)
  }
}
