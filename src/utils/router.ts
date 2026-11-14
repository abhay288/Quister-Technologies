
import { useEffect, useSyncExternalStore } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLenis, smoothScrollTo } from './smoothScroll'

export type AppRoute = '/' | '/about'

export type TransitionPhase = 'idle' | 'covering' | 'loading' | 'revealing'

export interface PageTransitionState {
  phase: TransitionPhase
  progress: number
  statusLabel: string
  targetRoute: AppRoute
  transitionId: number
}

interface RouteMetadata {
  title: string
  description: string
  ogTitle: string
  ogDescription: string
}

const ROUTE_METADATA: Record<AppRoute, RouteMetadata> = {
  '/': {
    title: 'QUISTER TECHNOLOGIES — Engineering Digital Excellence',
    description:
      'QUISTER TECHNOLOGIES — Engineering Digital Excellence. We design and build digital products, intelligent platforms, and experiences that move businesses forward.',
    ogTitle: 'QUISTER TECHNOLOGIES — Engineering Digital Excellence',
    ogDescription:
      'We design and build digital products, intelligent platforms, and experiences that move businesses forward.',
  },
  '/about': {
    title: 'About QUISTER TECHNOLOGIES | Independent Digital Engineering Studio',
    description:
      'QUISTER TECHNOLOGIES is an independent digital engineering studio combining thoughtful design, software architecture and modern technology to build dependable digital products.',
    ogTitle: 'About QUISTER TECHNOLOGIES | Independent Digital Engineering Studio',
    ogDescription:
      'Independent by design. Engineering-led by default. Discover how QUISTER TECHNOLOGIES approaches design, software architecture, operating principles and delivery.',
  },
}

export function normalizePathname(pathname: string): AppRoute {
  const cleaned = pathname.replace(/\/+$/, '') || '/'
  if (cleaned === '/about') return '/about'
  return '/'
}

function setMetaTag(attrName: 'name' | 'property', attrValue: string, content: string) {
  if (typeof document === 'undefined') return
  let meta = document.querySelector<HTMLMetaElement>(`meta[${attrName}="${attrValue}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(attrName, attrValue)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

export function syncRouteMetadata(route: AppRoute) {
  if (typeof document === 'undefined') return
  const meta = ROUTE_METADATA[route]
  document.title = meta.title
  setMetaTag('name', 'description', meta.description)
  setMetaTag('property', 'og:title', meta.ogTitle)
  setMetaTag('property', 'og:description', meta.ogDescription)
  setMetaTag('property', 'og:url', window.location.origin + route)

  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  canonical.setAttribute('href', window.location.origin + route)
}

// ============================================================================
// SINGLETON ROUTE & GLOBAL PAGE TRANSITION STORE
// ============================================================================

let activeRoute: AppRoute =
  typeof window !== 'undefined' ? normalizePathname(window.location.pathname) : '/'

let transitionState: PageTransitionState = {
  phase: 'idle',
  progress: 0,
  statusLabel: 'READY',
  targetRoute: activeRoute,
  transitionId: 0,
}

let activeToken = 0
let watchdogTimer: number | null = null
let revealCompleteTimer: number | null = null

const routeSubscribers = new Set<() => void>()
const transitionSubscribers = new Set<() => void>()

function emitRoute() {
  routeSubscribers.forEach((cb) => cb())
}

function emitTransition() {
  transitionSubscribers.forEach((cb) => cb())
}

function setActiveRoute(nextRoute: AppRoute) {
  if (activeRoute !== nextRoute) {
    activeRoute = nextRoute
    emitRoute()
  }
  syncRouteMetadata(nextRoute)
}

function updateTransition(partial: Partial<PageTransitionState>) {
  transitionState = { ...transitionState, ...partial }
  emitTransition()
}

function subscribeRoute(cb: () => void) {
  routeSubscribers.add(cb)
  return () => {
    routeSubscribers.delete(cb)
  }
}

function getRouteSnapshot(): AppRoute {
  return activeRoute
}

function subscribeTransition(cb: () => void) {
  transitionSubscribers.add(cb)
  return () => {
    transitionSubscribers.delete(cb)
  }
}

function getTransitionSnapshot(): PageTransitionState {
  return transitionState
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function waitFrames(count = 2): Promise<void> {
  return new Promise((resolve) => {
    let remaining = count
    const step = () => {
      remaining -= 1
      if (remaining <= 0) {
        resolve()
      } else {
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  })
}

async function waitForDestinationAssets(maxTimeoutMs = 680): Promise<void> {
  if (typeof document === 'undefined') return

  const fontReady = document.fonts ? document.fonts.ready.catch(() => undefined) : Promise.resolve()

  const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('img'))
  const aboveFoldPending = imgs.filter((img) => {
    if (!img.getAttribute('src') || img.complete) return false
    const rect = img.getBoundingClientRect()
    return rect.top < window.innerHeight * 1.4
  })

  const imgPromises = aboveFoldPending.map(
    (img) =>
      new Promise<void>((resolve) => {
        const done = () => {
          img.removeEventListener('load', done)
          img.removeEventListener('error', done)
          resolve()
        }
        img.addEventListener('load', done, { once: true })
        img.addEventListener('error', done, { once: true })
      })
  )

  await Promise.race([Promise.all([fontReady, ...imgPromises]), delay(maxTimeoutMs)])
}

function positionScrollImmediate(hash?: string) {
  const lenis = getLenis()
  lenis?.start()

  if (hash) {
    const el = document.querySelector<HTMLElement>(hash)
    if (el) {
      const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - 20)
      window.scrollTo({ top, left: 0, behavior: 'auto' })
      lenis?.scrollTo(el, { offset: -20, immediate: true })
      return
    }
  }

  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  lenis?.scrollTo(0, { immediate: true })
}

function clearTimers() {
  if (watchdogTimer !== null) {
    window.clearTimeout(watchdogTimer)
    watchdogTimer = null
  }
  if (revealCompleteTimer !== null) {
    window.clearTimeout(revealCompleteTimer)
    revealCompleteTimer = null
  }
}

async function runRouteTransition(targetRoute: AppRoute, normalizedHash: string) {
  const token = ++activeToken
  clearTimers()

  const reduced = prefersReducedMotion()
  const wasAlreadyCovering = transitionState.phase !== 'idle'

  // Hard safety watchdog so no navigation can ever hang at 99% or trap the viewport
  watchdogTimer = window.setTimeout(() => {
    if (token !== activeToken) return
    setActiveRoute(targetRoute)
    positionScrollImmediate(normalizedHash)
    ScrollTrigger.refresh()
    updateTransition({
      phase: 'revealing',
      progress: 100,
      statusLabel: 'READY',
    })
    revealCompleteTimer = window.setTimeout(() => {
      if (token !== activeToken) return
      updateTransition({ phase: 'idle', progress: 0, statusLabel: 'READY' })
    }, reduced ? 40 : 340)
  }, 3200)

  try {
    // 1. Cover viewport (or keep solid curtain if superseding an active transition)
    updateTransition({
      phase: wasAlreadyCovering ? 'loading' : 'covering',
      progress: wasAlreadyCovering ? Math.max(transitionState.progress, 26) : 18,
      statusLabel: 'PREPARING STUDIO',
      targetRoute,
      transitionId: token,
    })

    if (!wasAlreadyCovering) {
      await delay(reduced ? 15 : 220)
    } else {
      // Brief debounce when superseding in-flight rapid clicks so intermediate heavy routes aren't mounted
      await delay(reduced ? 10 : 85)
    }
    if (token !== activeToken) return

    getLenis()?.stop()

    // 2. Commit React route & document metadata while curtain hides previous route
    setActiveRoute(targetRoute)
    updateTransition({
      phase: 'loading',
      progress: 48,
      statusLabel: 'MOUNTING ARCHITECTURE',
    })

    // 3. Let React render destination tree & mount frames
    await waitFrames(2)
    if (token !== activeToken) return

    updateTransition({
      progress: 76,
      statusLabel: 'SYNCHRONIZING ASSETS',
    })

    // 4. Wait for real route font & above-the-fold media readiness (bounded)
    await waitForDestinationAssets(500)
    if (token !== activeToken) return

    // Guarantee a crisp post-mount editorial beat so progress glides to 100% visibly
    if (!reduced) {
      await delay(260)
      if (token !== activeToken) return
    }

    // 5. Calibrate scroll & GSAP triggers behind opaque curtain before reveal
    positionScrollImmediate(normalizedHash)
    ScrollTrigger.refresh()
    await waitFrames(1)
    if (token !== activeToken) return
    positionScrollImmediate(normalizedHash)

    // 6. Reach true 100% completion cleanly (never stuck at 99%)
    updateTransition({
      progress: 100,
      statusLabel: 'READY',
    })

    await delay(reduced ? 15 : 110)
    if (token !== activeToken) return

    // 7. Reveal new route cleanly
    clearTimers()
    updateTransition({
      phase: 'revealing',
      progress: 100,
      statusLabel: 'READY',
    })

    await delay(reduced ? 40 : 320)
    if (token !== activeToken) return

    updateTransition({
      phase: 'idle',
      progress: 0,
      statusLabel: 'READY',
    })
  } catch {
    if (token !== activeToken) return
    clearTimers()
    setActiveRoute(targetRoute)
    positionScrollImmediate(normalizedHash)
    updateTransition({
      phase: 'revealing',
      progress: 100,
      statusLabel: 'READY',
    })
    await delay(reduced ? 40 : 320)
    if (token !== activeToken) return
    updateTransition({
      phase: 'idle',
      progress: 0,
      statusLabel: 'READY',
    })
  }
}

export function navigateTo(targetRoute: AppRoute, hash?: string) {
  if (typeof window === 'undefined') return

  const currentRoute = normalizePathname(window.location.pathname)
  const normalizedHash = hash ? (hash.startsWith('#') ? hash : `#${hash}`) : ''
  const targetUrl = normalizedHash ? `${targetRoute}${normalizedHash}` : targetRoute

  // In-page anchor scroll when already idle on target route -> NO full-screen loader
  if (currentRoute === targetRoute && transitionState.phase === 'idle') {
    if (normalizedHash) {
      window.history.replaceState(null, '', targetUrl)
      smoothScrollTo(normalizedHash, { offset: -20, duration: 1.25 })
    } else {
      window.history.replaceState(null, '', targetRoute)
      smoothScrollTo(0, { duration: 1.25 })
    }
    return
  }

  // Update history only when URL actually changes
  if (currentRoute === targetRoute) {
    window.history.replaceState({ route: targetRoute, hash: normalizedHash }, '', targetUrl)
  } else {
    window.history.pushState({ route: targetRoute, hash: normalizedHash }, '', targetUrl)
  }

  void runRouteTransition(targetRoute, normalizedHash)
}

export function usePageTransition(): PageTransitionState {
  return useSyncExternalStore(subscribeTransition, getTransitionSnapshot, getTransitionSnapshot)
}

let listenersAttached = false

export function useAppRoute(): AppRoute {
  const route = useSyncExternalStore(subscribeRoute, getRouteSnapshot, getRouteSnapshot)

  useEffect(() => {
    syncRouteMetadata(route)
  }, [route])

  useEffect(() => {
    if (listenersAttached) return
    listenersAttached = true

    // Handle initial deep-link hash on direct page load (no transition overlay on initial load)
    const initialHash = window.location.hash
    if (initialHash) {
      window.setTimeout(() => {
        ScrollTrigger.refresh()
        const el = document.querySelector(initialHash)
        if (el) {
          smoothScrollTo(initialHash, { offset: -20, duration: 1.1 })
        }
      }, 90)
    }

    const onPopState = () => {
      const nextRoute = normalizePathname(window.location.pathname)
      const nextHash = window.location.hash || ''

      if (nextRoute === activeRoute && transitionState.phase === 'idle') {
        if (nextHash) {
          smoothScrollTo(nextHash, { offset: -20, duration: 1.15 })
        } else {
          smoothScrollTo(0, { duration: 1.15 })
        }
        return
      }

      void runRouteTransition(nextRoute, nextHash)
    }

    window.addEventListener('popstate', onPopState)
    return () => {
      listenersAttached = false
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  return route
}
