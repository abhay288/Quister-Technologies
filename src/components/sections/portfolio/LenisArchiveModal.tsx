import { useState, useRef, useEffect, useCallback } from 'react'
import { X, ExternalLink, ArrowRight, ArrowLeft, ArrowDown, Globe, Play, BookOpen, Gamepad2 } from 'lucide-react'
import { ARCHIVE_PROJECTS, PROJECT_EXTERNAL_LINKS } from './portfolioData'
import LenisMetallicHand3D from '../../visuals/LenisMetallicHand3D'
import { getLenis } from '../../../utils/smoothScroll'

interface LenisArchiveModalProps {
  isOpen: boolean
  onClose: () => void
  onContinueWebsite?: () => void
}

const INTRO_END = 0.12
const FINALE_START = 0.77

const CARD_THRESHOLDS = [
  { start: 0.12, end: 0.22 }, // Card 01
  { start: 0.23, end: 0.33 }, // Card 02
  { start: 0.34, end: 0.44 }, // Card 03
  { start: 0.45, end: 0.55 }, // Card 04
  { start: 0.56, end: 0.66 }, // Card 05
  { start: 0.67, end: 0.77 }, // Card 06
]

const CARD_STOP_PROGRESS = [0.22, 0.33, 0.44, 0.55, 0.66, 0.77]

interface StageMetrics {
  stageW: number
  stageH: number
  boxW: number
  boxH: number
  heroScale: number
  lineWidths: number[]
  isDesktop: boolean
  isTablet: boolean
  isMobile: boolean
  isShortViewport: boolean
}

export default function LenisArchiveModal({ isOpen, onClose, onContinueWebsite }: LenisArchiveModalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stageInnerRef = useRef<HTMLDivElement>(null)
  const heroAtmosphereRef = useRef<HTMLDivElement>(null)
  const heroGridRef = useRef<HTMLDivElement>(null)
  const heroVignetteRef = useRef<HTMLDivElement>(null)
  const editorialTitleRef = useRef<HTMLDivElement>(null)
  const lineRefs = useRef<(HTMLElement | null)[]>([])

  const targetProgressRef = useRef<number>(0)
  const currentProgressRef = useRef<number>(0)
  const progressRef = useRef<number>(0)
  const mouseStateRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const progressBarRef = useRef<HTMLDivElement>(null)
  const indexBadgeRef = useRef<HTMLSpanElement>(null)
  const finaleCuePercentRef = useRef<HTMLSpanElement>(null)
  const finaleFooterPercentRef = useRef<HTMLSpanElement>(null)
  const rafIdRef = useRef<number | null>(null)
  const finaleCloseTimerRef = useRef<number | null>(null)

  const metricsRef = useRef<StageMetrics>({
    stageW: 1200,
    stageH: 700,
    boxW: 360,
    boxH: 320,
    heroScale: 1.45,
    lineWidths: [],
    isDesktop: true,
    isTablet: false,
    isMobile: false,
    isShortViewport: false,
  })

  const isDraggingRef = useRef<boolean>(false)
  const dragStartXRef = useRef<number>(0)
  const dragStartYRef = useRef<number>(0)
  const dragStartProgressRef = useRef<number>(0)

  const overscrollDeltaRef = useRef<number>(0)
  const isClosingRef = useRef<boolean>(false)

  // -1 represents initial Full-Screen Hero view before Card 01 enters
  const [activeCardIndex, setActiveCardIndex] = useState<number>(-1)
  const activeCardIndexRef = useRef<number>(-1)
  const [hasScrolled, setHasScrolled] = useState<boolean>(false)
  const [isHeroPhase, setIsHeroPhase] = useState<boolean>(true)
  const isHeroPhaseRef = useRef<boolean>(true)
  const [isAllCardsFinished, setIsAllCardsFinished] = useState<boolean>(false)
  const isAllCardsFinishedRef = useRef<boolean>(false)

  const totalCards = ARCHIVE_PROJECTS.length

  // Measure Hero & Stage dimensions once on mount, font readiness, and resize (never per RAF frame)
  const measureMetrics = useCallback(() => {
    const stageEl = stageInnerRef.current
    const titleEl = editorialTitleRef.current
    if (!stageEl || !titleEl || typeof window === 'undefined') return

    const stageW = stageEl.clientWidth || window.innerWidth
    const stageH = stageEl.clientHeight || window.innerHeight * 0.72
    const boxW = titleEl.offsetWidth || 360
    const boxH = titleEl.offsetHeight || 320

    const isMobile = window.innerWidth < 768
    const isDesktop = window.innerWidth >= 1024
    const isTablet = !isMobile && !isDesktop
    const isShortViewport = window.innerHeight < 760

    const maxScaleW = (stageW * (isDesktop ? 0.7 : 0.88)) / Math.max(1, boxW)
    const maxScaleH = (stageH * (isDesktop ? 0.8 : 0.74)) / Math.max(1, boxH)
    const heroScale = Math.max(0.75, Math.min(isDesktop ? 1.54 : 1.15, maxScaleW, maxScaleH))

    const lineWidths = lineRefs.current.map((el) => (el ? el.offsetWidth : boxW))

    metricsRef.current = {
      stageW,
      stageH,
      boxW,
      boxH,
      heroScale,
      lineWidths,
      isDesktop,
      isTablet,
      isMobile,
      isShortViewport,
    }
  }, [])

  // Exit modal and smoothly continue the website to the next section
  const handleFinishAndContinue = useCallback(() => {
    if (isClosingRef.current) return
    isClosingRef.current = true

    if (onContinueWebsite) {
      onContinueWebsite()
    } else {
      onClose()
      setTimeout(() => {
        const lenis = getLenis()
        if (lenis) {
          lenis.scrollTo('#about', { duration: 1.2, offset: 0 })
        } else {
          const aboutEl = document.getElementById('about')
          aboutEl?.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [onContinueWebsite, onClose])

  // Direct GPU-accelerated Hero-to-Left Shift & 1-by-1 Card Cascade Engine
  const updateCardsDirectly = useCallback(
    (progress: number) => {
      progressRef.current = progress

      // Update top hairline progress bar cleanly via GPU scaleX
      if (progressBarRef.current) {
        const ratio = Math.min(1, Math.max(0.03, progress))
        progressBarRef.current.style.transform = `scaleX(${ratio})`
      }

      // Discrete card index (Hero: -1, Cards: 0..5)
      // Switches once a card crosses visibly into view rather than off-screen start
      let curIdx = -1
      for (let i = 0; i < CARD_THRESHOLDS.length; i++) {
        const span = CARD_THRESHOLDS[i].end - CARD_THRESHOLDS[i].start
        const activationPoint =
          i === 0 ? CARD_THRESHOLDS[0].start + span * 0.25 : CARD_THRESHOLDS[i].start + span * 0.5
        if (progress >= activationPoint) {
          curIdx = i
        }
      }

      if (curIdx !== activeCardIndexRef.current) {
        activeCardIndexRef.current = curIdx
        setActiveCardIndex(curIdx)
      }

      const heroActive = progress < 0.06
      if (heroActive !== isHeroPhaseRef.current) {
        isHeroPhaseRef.current = heroActive
        setIsHeroPhase(heroActive)
      }

      const atEnd = progress >= FINALE_START - 0.01 && curIdx === totalCards - 1
      if (atEnd !== isAllCardsFinishedRef.current) {
        isAllCardsFinishedRef.current = atEnd
        setIsAllCardsFinished(atEnd)
      }

      const finaleT = progress > FINALE_START ? Math.min(1, (progress - FINALE_START) / (1 - FINALE_START)) : 0
      const finalePctLabel = `${Math.round(finaleT * 100)}%`
      if (finaleCuePercentRef.current) {
        finaleCuePercentRef.current.innerText = finalePctLabel
      }
      if (finaleFooterPercentRef.current) {
        finaleFooterPercentRef.current.innerText = finalePctLabel
      }

      if (indexBadgeRef.current) {
        if (curIdx < 0) {
          indexBadgeRef.current.innerText = `00 // 0${totalCards}`
        } else {
          indexBadgeRef.current.innerText = `0${curIdx + 1} // 0${totalCards}`
        }
      }

      const m = metricsRef.current

      // Smooth Hero intro morph over first scroll [0 -> 0.12]
      const introT = Math.min(1, Math.max(0, progress / INTRO_END))
      const introEase = 1 - Math.pow(1 - introT, 3)

      // Soften Hero purple radial glow & vignette as cards take center-right stage
      if (heroAtmosphereRef.current) {
        heroAtmosphereRef.current.style.opacity = `${1 - introEase * 0.65}`
      }
      if (heroGridRef.current) {
        heroGridRef.current.style.opacity = `${0.12 - introEase * 0.08}`
      }
      if (heroVignetteRef.current) {
        heroVignetteRef.current.style.opacity = `${1 - introEase}`
      }

      // -----------------------------------------------------------------------
      // 1. FULL-SCREEN HERO -> LEFT-DOCKED EDITORIAL COLUMN
      // -----------------------------------------------------------------------
      if (editorialTitleRef.current) {
        const curScale = m.heroScale + (1 - m.heroScale) * introEase
        const centerParentX = (m.stageW - m.boxW * m.heroScale) / 2

        if (m.isDesktop) {
          // Desktop: Smoothly glides from dead-center full-screen Hero -> flush left column
          const curParentX = (1 - introEase) * centerParentX
          editorialTitleRef.current.style.transform = `translate3d(${curParentX}px, 0, 0) scale(${curScale})`
          editorialTitleRef.current.style.opacity = '1'
        } else {
          // Mobile / Tablet: Centered Hero initially, smoothly slides left & dissolves before Card 01 enters
          const exitT = Math.min(1, Math.max(0, (progress - 0.015) / (INTRO_END - 0.015)))
          const exitEase = exitT * exitT
          const curParentX = centerParentX - exitEase * Math.min(240, m.stageW * 0.45)
          const curScaleMobile = curScale * (1 - exitEase * 0.12)
          editorialTitleRef.current.style.transform = `translate3d(${curParentX}px, 0, 0) scale(${curScaleMobile})`
          editorialTitleRef.current.style.opacity = `${1 - exitEase}`
        }

        // Shift individual lines from center-aligned Hero -> flush-left editorial column
        lineRefs.current.forEach((lineEl, i) => {
          if (!lineEl) return
          const w = m.lineWidths[i] ?? m.boxW
          const lineCenterShift = Math.max(0, (m.boxW - w) / 2)
          const curLineX = (1 - introEase) * lineCenterShift
          lineEl.style.transform = `translate3d(${curLineX}px, 0, 0)`
        })
      }

      // -----------------------------------------------------------------------
      // 2. RIGHT STAGE: 1-BY-1 DOWNWARD DIAGONAL CARD CASCADE
      // Cards enter strictly one after another from off-screen right once text shifts left
      // -----------------------------------------------------------------------
      const stepOffsetX = m.isMobile ? 8 : m.isTablet ? 14 : m.stageW >= 1220 ? 30 : 22
      const stepOffsetY = m.isMobile ? 8 : m.isTablet ? 11 : m.isShortViewport ? 12 : 16
      const offscreenX = Math.max(520, m.stageW * 0.65)

      cardRefs.current.forEach((cardEl, idx) => {
        if (!cardEl) return

        const finalX = idx * stepOffsetX
        const finalY = idx * stepOffsetY
        const { start, end } = CARD_THRESHOLDS[idx]

        if (progress < start) {
          cardEl.style.transform = `translate3d(${offscreenX}px, ${finalY}px, 0) scale(0.94)`
          cardEl.style.opacity = '0'
          cardEl.style.zIndex = `${10 + idx}`
          cardEl.style.pointerEvents = 'none'
        } else if (progress >= end) {
          // Subtle soft recession during final hand turn keeps focus on the 3D hand move
          const finaleFade = 1 - finaleT * 0.24
          const finaleScale = 1 - finaleT * 0.025
          cardEl.style.transform = `translate3d(${finalX}px, ${finalY}px, 0) scale(${finaleScale})`
          cardEl.style.opacity = `${finaleFade}`
          cardEl.style.zIndex = `${10 + idx}`
          cardEl.style.pointerEvents = idx === curIdx ? 'auto' : 'none'
        } else {
          const t = (progress - start) / (end - start)
          const ease = 1 - Math.pow(1 - t, 3)
          const curX = finalX + (1 - ease) * offscreenX
          const curY = finalY + (1 - ease) * 28
          const curOpacity = Math.min(1, t * 2.4)
          const curScale = 0.94 + ease * 0.06

          cardEl.style.transform = `translate3d(${curX}px, ${curY}px, 0) scale(${curScale})`
          cardEl.style.opacity = `${curOpacity}`
          cardEl.style.zIndex = `${10 + idx}`
          cardEl.style.pointerEvents = t > 0.55 ? 'auto' : 'none'
        }
      })
    },
    [totalCards]
  )

  // Stop background page scrolling and initialize measurements/state
  useEffect(() => {
    if (isOpen) {
      const lenis = getLenis()
      lenis?.stop()
      document.body.style.overflow = 'hidden'

      targetProgressRef.current = 0
      currentProgressRef.current = 0
      progressRef.current = 0
      overscrollDeltaRef.current = 0
      isClosingRef.current = false
      activeCardIndexRef.current = -1
      isHeroPhaseRef.current = true
      isAllCardsFinishedRef.current = false
      setActiveCardIndex(-1)
      setHasScrolled(false)
      setIsHeroPhase(true)
      setIsAllCardsFinished(false)

      const syncLayout = () => {
        measureMetrics()
        updateCardsDirectly(currentProgressRef.current)
      }

      const rafPrime = requestAnimationFrame(syncLayout)
      const timer = setTimeout(syncLayout, 60)

      if (typeof document !== 'undefined' && 'fonts' in document) {
        document.fonts.ready.then(syncLayout)
      }

      window.addEventListener('resize', syncLayout)

      return () => {
        cancelAnimationFrame(rafPrime)
        clearTimeout(timer)
        if (finaleCloseTimerRef.current) {
          window.clearTimeout(finaleCloseTimerRef.current)
          finaleCloseTimerRef.current = null
        }
        window.removeEventListener('resize', syncLayout)
      }
    } else {
      const lenis = getLenis()
      lenis?.start()
      document.body.style.overflow = ''
      isClosingRef.current = false
    }

    return () => {
      const lenis = getLenis()
      lenis?.start()
      document.body.style.overflow = ''
      isClosingRef.current = false
    }
  }, [isOpen, measureMetrics, updateCardsDirectly])

  // Butter-Smooth RAF Interpolation Loop
  // Automatically closes the archive once the post-Card-06 complete 360° hand move finishes
  useEffect(() => {
    if (!isOpen) return

    let isRunning = true

    const loop = () => {
      if (!isRunning) return

      const diff = targetProgressRef.current - currentProgressRef.current
      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * 0.08
        updateCardsDirectly(currentProgressRef.current)
      }

      if (
        !isClosingRef.current &&
        targetProgressRef.current >= 0.998 &&
        currentProgressRef.current >= 0.992 &&
        finaleCloseTimerRef.current === null
      ) {
        finaleCloseTimerRef.current = window.setTimeout(() => {
          finaleCloseTimerRef.current = null
          if (targetProgressRef.current >= 0.995) {
            handleFinishAndContinue()
          }
        }, 220)
      }

      rafIdRef.current = requestAnimationFrame(loop)
    }

    rafIdRef.current = requestAnimationFrame(loop)

    return () => {
      isRunning = false
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      if (finaleCloseTimerRef.current) {
        window.clearTimeout(finaleCloseTimerRef.current)
        finaleCloseTimerRef.current = null
      }
    }
  }, [isOpen, updateCardsDirectly, handleFinishAndContinue])

  // Wheel listener: accumulates progress through Hero -> 6 cards -> 1 complete hand move -> close
  useEffect(() => {
    if (!isOpen) return

    const containerEl = containerRef.current
    if (!containerEl) return

    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (isClosingRef.current) return

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      const inFinale = targetProgressRef.current >= FINALE_START
      const sensitivity = inFinale ? 0.00042 : 0.00055

      if (delta < 0 && finaleCloseTimerRef.current !== null) {
        window.clearTimeout(finaleCloseTimerRef.current)
        finaleCloseTimerRef.current = null
      }

      if (targetProgressRef.current >= 0.998 && delta > 0) {
        // User scrolled once more right as the finale hand move completes
        if (currentProgressRef.current >= 0.98) {
          overscrollDeltaRef.current += Math.abs(delta)
          if (overscrollDeltaRef.current >= 18) {
            handleFinishAndContinue()
            return
          }
        }
      } else {
        overscrollDeltaRef.current = 0
        targetProgressRef.current = Math.min(1, Math.max(0, targetProgressRef.current + delta * sensitivity))
      }

      if (!hasScrolled) setHasScrolled(true)
    }

    containerEl.addEventListener('wheel', handleWheelEvent, { passive: false })

    return () => {
      containerEl.removeEventListener('wheel', handleWheelEvent)
    }
  }, [isOpen, hasScrolled, handleFinishAndContinue])

  // Chapter jump handler (-1 = Hero view, 0..5 = Card 01..06, 6 = Finale hand move -> close)
  const jumpToCard = useCallback(
    (targetIndex: number) => {
      if (finaleCloseTimerRef.current !== null) {
        window.clearTimeout(finaleCloseTimerRef.current)
        finaleCloseTimerRef.current = null
      }
      if (targetIndex >= totalCards) {
        if (targetProgressRef.current < 0.96) {
          // Trigger the complete post-Card-06 hand move cleanly; RAF closes when finished
          overscrollDeltaRef.current = 0
          targetProgressRef.current = 1
          setHasScrolled(true)
          return
        }
        handleFinishAndContinue()
        return
      }
      if (targetIndex < 0) {
        overscrollDeltaRef.current = 0
        targetProgressRef.current = 0
        return
      }
      overscrollDeltaRef.current = 0
      targetProgressRef.current = CARD_STOP_PROGRESS[targetIndex] ?? FINALE_START
      setHasScrolled(true)
    },
    [totalCards, handleFinishAndContinue]
  )

  // Keyboard navigation & mouse parallax listener
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isClosingRef.current) return

      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        if (targetProgressRef.current >= 0.96) {
          if (currentProgressRef.current >= 0.97) {
            handleFinishAndContinue()
          }
          return
        }
        jumpToCard(activeCardIndexRef.current + 1)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        overscrollDeltaRef.current = 0
        jumpToCard(activeCardIndexRef.current - 1)
      }
    }

    const handleWindowPointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -(e.clientY / window.innerHeight) * 2 + 1
      mouseStateRef.current = { x: nx, y: ny }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('pointermove', handleWindowPointerMove, { passive: true })

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('pointermove', handleWindowPointerMove)
    }
  }, [isOpen, onClose, handleFinishAndContinue, jumpToCard])

  // Pointer drag gestures for touch and mouse (supports horizontal or vertical drag)
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true
    dragStartXRef.current = e.clientX
    dragStartYRef.current = e.clientY
    dragStartProgressRef.current = targetProgressRef.current
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || isClosingRef.current) return
    const dx = e.clientX - dragStartXRef.current
    const dy = e.clientY - dragStartYRef.current
    const dominantDelta = Math.abs(dy) > Math.abs(dx) ? dy : dx
    const sensitivity = 0.0014

    targetProgressRef.current = Math.min(1, Math.max(0, dragStartProgressRef.current - dominantDelta * sensitivity))
    if (!hasScrolled) setHasScrolled(true)
  }

  const handlePointerUp = () => {
    isDraggingRef.current = false
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Quister Technologies — Project Archive"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="fixed inset-0 z-50 overflow-hidden select-none bg-[#050508] flex flex-col justify-between"
      style={{
        touchAction: 'none',
      }}
    >
      {/* =====================================================================
          1. TOP HAIRLINE PROGRESS BAR & MINIMAL HUD HEADER
          ===================================================================== */}
      <div
        ref={progressBarRef}
        className="absolute top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none origin-left"
        style={{
          transform: 'scaleX(0.03)',
          background: 'linear-gradient(90deg, #D4B276 0%, #ECC87A 35%, #60A5FA 70%, #34D399 100%)',
          boxShadow: '0 0 10px rgba(236, 200, 122, 0.7)',
          willChange: 'transform',
        }}
      />

      <header className="relative z-40 flex items-center justify-between px-6 sm:px-12 py-4 border-b border-white/5 bg-[#050508]/85 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#FAF8F5',
              fontWeight: 600,
            }}
          >
            QUISTER TECHNOLOGIES
          </span>
          <span className="text-[#FAF8F5]/30 font-mono text-xs">//</span>
          <span
            ref={indexBadgeRef}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              letterSpacing: '0.2em',
              color: '#D4B276',
              fontWeight: 600,
            }}
          >
            00 // 0{totalCards}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Close Project Archive Modal"
          className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-[#D4B276] hover:text-[#090A0E] text-[#FAF8F5] transition-all duration-200 font-mono text-xs cursor-pointer"
        >
          <span className="font-mono text-[0.6875rem] tracking-wider font-medium">CLOSE [ESC]</span>
          <X size={14} className="transition-transform group-hover:rotate-90 duration-200" />
        </button>
      </header>

      {/* =====================================================================
          2. CENTRAL PRESENTATION STAGE
             - Open (p=0): Hero-like full-screen centered editorial composition
             - First scroll (p: 0->0.16): Text smoothly scales & shifts to LEFT
             - Scroll cards (p: 0.16->0.94): Cards cascade 1-by-1 on the RIGHT
             - 3D Translucent Hand rotates a full 360° behind the composition
          ===================================================================== */}
      <div className="relative w-full flex-grow px-5 sm:px-8 lg:px-12 overflow-hidden">
        {/* Hero-Matching Deep Plum + Obsidian Radial Atmosphere (Dims as Cards Enter) */}
        <div
          ref={heroAtmosphereRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 35%, rgba(36, 16, 54, 0.34) 0%, rgba(10, 8, 16, 0.86) 65%, #050508 100%)',
          }}
        />

        {/* Hero-Matching Precision Grid Overlay */}
        <div
          ref={heroGridRef}
          aria-hidden="true"
          className="grid-overlay absolute inset-0 pointer-events-none z-0"
          style={{ opacity: 0.12 }}
        />

        {/* Background 3D Real Human Hand Canvas (Full-Bleed Centered, Rotates 360°, Soft Translucent Opacity) */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
          <LenisMetallicHand3D progressRef={progressRef} mouseStateRef={mouseStateRef} />
        </div>

        {/* Soft Central Hero Readability Vignette (Matches HeroSection, Fades on Scroll) */}
        <div
          ref={heroVignetteRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-[15]"
          style={{
            background:
              'radial-gradient(ellipse 58% 52% at 50% 50%, rgba(5, 5, 8, 0.42) 0%, rgba(5, 5, 8, 0.16) 55%, transparent 100%)',
          }}
        />

        {/* Inner Safe Stage Wrapper (Excludes Horizontal Padding for Exact Math) */}
        <div ref={stageInnerRef} className="relative w-full h-full flex items-center">
          {/* LEFT-ANCHORED / HERO-CENTERED EDITORIAL TYPOGRAPHY */}
          <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-20">
            <div
              ref={editorialTitleRef}
              className="flex flex-col items-start justify-center"
              style={{
                width: 'max-content',
                transformOrigin: 'left center',
                willChange: 'transform, opacity',
              }}
            >
              {/* Line 0: Hero Eyebrow Pill */}
              <div
                ref={(el) => {
                  lineRefs.current[0] = el
                }}
                style={{
                  width: 'max-content',
                  marginBottom: '0.85rem',
                  willChange: 'transform',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    color: '#F3D18C',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0.32rem 0.95rem',
                    backgroundColor: 'rgba(10, 6, 18, 0.68)',
                    border: '1px solid rgba(243, 209, 140, 0.28)',
                    borderRadius: '9999px',
                    boxShadow: '0 4px 18px rgba(0, 0, 0, 0.7), inset 0 0 12px rgba(243, 209, 140, 0.05)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    textShadow: '0 0 14px rgba(243, 209, 140, 0.4)',
                  }}
                >
                  <span>PRODUCTION ARCHIVE</span>
                  <span style={{ opacity: 0.65, color: '#F3D18C' }}>·</span>
                  <span style={{ opacity: 0.95 }}>WEB · APPS · GAMES</span>
                </div>
              </div>

              {/* Lines 1 & 2: Editorial Serif Headline (Matches HeroSection Pairing & Gradient) */}
              <h2
                className="m-0 flex flex-col items-start mb-4"
                style={{
                  lineHeight: 1.05,
                  letterSpacing: '-0.015em',
                }}
              >
                <span
                  ref={(el) => {
                    lineRefs.current[1] = el
                  }}
                  style={{
                    width: 'max-content',
                    whiteSpace: 'nowrap',
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.35rem, 3.1vw, 3.3rem)',
                    fontWeight: 400,
                    color: '#FFF8ED',
                    display: 'block',
                    lineHeight: 1.04,
                    textShadow: '0 2px 24px rgba(0, 0, 0, 0.98), 0 4px 40px rgba(0, 0, 0, 0.9)',
                    willChange: 'transform',
                  }}
                >
                  QUISTER DELIVERS
                </span>

                <span
                  ref={(el) => {
                    lineRefs.current[2] = el
                  }}
                  style={{
                    width: 'max-content',
                    whiteSpace: 'nowrap',
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.7rem, 3.55vw, 3.8rem)',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    display: 'block',
                    lineHeight: 1.08,
                    padding: '0.04em 0.16em 0.06em 0.02em',
                    background: 'linear-gradient(135deg, #FAF4FF 0%, #EBD8FF 32%, #FFF2DE 70%, #F5D18A 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 2px 20px rgba(0, 0, 0, 0.98)) drop-shadow(0 4px 36px rgba(0, 0, 0, 0.92))',
                    willChange: 'transform',
                  }}
                >
                  the code.
                </span>
              </h2>

              {/* Lines 3, 4, 5: Supporting Copy (Balanced Lines for Crisp Center-to-Left Glide) */}
              <div
                className="font-sans flex flex-col items-start gap-0.5 mb-4"
                style={{
                  fontSize: 'clamp(0.76rem, 0.92vw, 0.875rem)',
                  lineHeight: 1.55,
                  color: '#DED8E2',
                  fontWeight: 400,
                  textShadow: '0 2px 14px rgba(0, 0, 0, 0.98)',
                }}
              >
                <span
                  ref={(el) => {
                    lineRefs.current[3] = el
                  }}
                  style={{ width: 'max-content', whiteSpace: 'nowrap', willChange: 'transform' }}
                >
                  Disciplined software engineering across{' '}
                  <strong className="text-[#FAF8F5] font-semibold">Web Platforms</strong>,
                </span>
                <span
                  ref={(el) => {
                    lineRefs.current[4] = el
                  }}
                  style={{ width: 'max-content', whiteSpace: 'nowrap', willChange: 'transform' }}
                >
                  <strong className="text-[#FAF8F5] font-semibold">Retail Mobile Apps</strong>,{' '}
                  <strong className="text-[#FAF8F5] font-semibold">Educational Software</strong> and
                </span>
                <span
                  ref={(el) => {
                    lineRefs.current[5] = el
                  }}
                  style={{ width: 'max-content', whiteSpace: 'nowrap', willChange: 'transform' }}
                >
                  <strong className="text-[#FAF8F5] font-semibold">Interactive 60fps Mobile Games</strong> across India.
                </span>
              </div>

              {/* Line 6: Discipline Tags Row */}
              <div
                ref={(el) => {
                  lineRefs.current[6] = el
                }}
                className="flex items-center flex-nowrap gap-1.5 mb-5"
                style={{ width: 'max-content', willChange: 'transform' }}
              >
                <span className="font-mono text-[0.5625rem] px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[#ECC87A]">
                  WEB PLATFORMS
                </span>
                <span className="font-mono text-[0.5625rem] px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[#34D399]">
                  MOBILE APPS
                </span>
                <span className="font-mono text-[0.5625rem] px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[#A78BFA]">
                  EDUCATIONAL APPS
                </span>
                <span className="font-mono text-[0.5625rem] px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[#FB923C]">
                  MOBILE GAMES
                </span>
              </div>

              {/* Line 7: Dynamic Scroll Cue / Quick Action */}
              <div
                ref={(el) => {
                  lineRefs.current[7] = el
                }}
                style={{ width: 'max-content', willChange: 'transform' }}
              >
                <button
                  type="button"
                  onClick={() => jumpToCard(isHeroPhase ? 0 : totalCards)}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2.5 cursor-pointer"
                  style={{
                    pointerEvents: isHeroPhase || isAllCardsFinished ? 'auto' : 'none',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: isAllCardsFinished ? '#ECC87A' : '#D4B276',
                      fontWeight: isAllCardsFinished ? 600 : 500,
                    }}
                  >
                    {isAllCardsFinished ? (
                      <>
                        SCROLL FOR FINAL HAND MOVE (<span ref={finaleCuePercentRef}>0%</span>)
                      </>
                    ) : isHeroPhase ? (
                      'SCROLL TO SHIFT LEFT & REVEAL PROJECTS'
                    ) : (
                      'SCROLL TO CASCADE CARDS 1 BY 1'
                    )}
                  </span>
                  {isAllCardsFinished ? (
                    <ArrowDown size={13} className="text-[#ECC87A] animate-bounce" />
                  ) : (
                    <ArrowRight size={13} className="text-[#D4B276] animate-pulse" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: 1-BY-1 DOWNWARD DIAGONAL CASCADING PROJECT CARDS */}
          <div
            className="relative z-20 mx-auto lg:ml-auto lg:mr-0 flex items-start cursor-grab active:cursor-grabbing"
            style={{
              width: 'clamp(290px, 41vw, 555px)',
              height: 'clamp(365px, 58vh, 520px)',
            }}
          >
            {ARCHIVE_PROJECTS.map((project, idx) => {
              const isWeb = project.platformType === 'web'
              const isEdu = project.platformType === 'education'
              const isGame = project.platformType === 'game'

              return (
                <div
                  key={project.id}
                  ref={(el) => {
                    cardRefs.current[idx] = el
                  }}
                  className="absolute top-0 left-0 rounded-2xl overflow-hidden border transition-shadow duration-300 flex flex-col justify-between"
                  style={{
                    width: 'clamp(275px, 28vw, 395px)',
                    height: 'clamp(330px, 50vh, 435px)',
                    opacity: 0,
                    background: 'rgba(12, 13, 20, 0.94)',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow:
                      '0 25px 60px -15px rgba(0, 0, 0, 0.95), 0 0 35px rgba(212, 178, 118, 0.08), inset 0 0 20px rgba(255, 255, 255, 0.02)',
                    willChange: 'transform, opacity',
                  }}
                >
                  {/* Card Top: Bold Project Index (01..06) + Category Badge */}
                  <div className="p-4 sm:p-5 pb-1.5 flex items-start justify-between">
                    <span
                      className="font-display font-light leading-none tracking-tighter"
                      style={{
                        fontSize: 'clamp(2.8rem, 4.8vw, 4.1rem)',
                        color: project.accentColor,
                        letterSpacing: '-0.04em',
                      }}
                    >
                      {project.number}
                    </span>

                    <div className="flex flex-col items-end gap-1">
                      <span
                        className="font-mono text-[0.5625rem] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold border flex items-center gap-1.5"
                        style={{
                          borderColor: 'rgba(255, 255, 255, 0.15)',
                          color: project.accentColor,
                          background: 'rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        {isEdu ? <BookOpen size={10} /> : isGame ? <Gamepad2 size={10} /> : isWeb ? <Globe size={10} /> : <Play size={10} />}
                        {project.badgeLabel}
                      </span>
                      <span className="font-mono text-[0.5rem] text-white/40 uppercase tracking-widest">
                        {project.shortCategory}
                      </span>
                    </div>
                  </div>

                  {/* Card Center: Flexible High-Res Screenshot Preview */}
                  <div className="px-4 sm:px-5 py-1.5 flex-1 min-h-0 flex items-center justify-center">
                    <div
                      className="w-full h-full min-h-[120px] max-h-[205px] rounded-xl overflow-hidden border border-white/10 shadow-xl relative group"
                      style={{ background: '#090A0E' }}
                    >
                      <img
                        src={project.primaryImage}
                        alt={project.title}
                        loading="eager"
                        decoding="async"
                        className="w-full h-full object-cover object-top filter brightness-95 contrast-105 transition-transform duration-500 group-hover:scale-105"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 rounded-xl border border-white/10 pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Card Bottom: Title, Description & Live Link Button */}
                  <div className="p-4 sm:p-5 pt-2 border-t border-white/5 flex flex-col gap-2">
                    <div>
                      <h3
                        className="font-display text-sm sm:text-base text-[#FAF8F5] uppercase tracking-tight font-medium mb-0.5"
                        style={{ letterSpacing: '0.02em' }}
                      >
                        {project.title}
                      </h3>
                      <p className="font-sans text-[0.72rem] sm:text-xs text-[#FAF8F5]/70 line-clamp-2 leading-snug font-light">
                        {project.categoryDescription}
                      </p>
                    </div>

                    <div className="pt-0.5 flex items-center justify-between gap-2">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onPointerDown={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-[#D4B276] hover:text-[#090A0E] hover:border-[#D4B276] text-[#FAF8F5] transition-all font-mono text-[0.625rem] tracking-wider uppercase font-semibold cursor-pointer whitespace-nowrap"
                      >
                        <span>{isWeb ? 'VISIT LIVE PLATFORM' : isGame ? 'PLAY ON GOOGLE PLAY' : 'GOOGLE PLAY STORE'}</span>
                        <ExternalLink size={11} />
                      </a>

                      <div className="hidden sm:flex items-center gap-1 overflow-hidden">
                        {project.technologies.slice(0, 2).map((tech) => (
                          <span key={tech} className="font-mono text-[0.5rem] px-1.5 py-0.5 rounded bg-white/5 text-white/50 truncate">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* =====================================================================
          3. DEDICATED ALL PROJECT DIRECT ACCESS LINKS (BELOW SIDE)
          ===================================================================== */}
      <div className="relative z-40 px-4 sm:px-8 lg:px-12 py-2.5 bg-[#050508]/95 border-t border-white/5 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4B276] animate-pulse" />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#D4B276',
                fontWeight: 600,
              }}
            >
              LIVE CLIENT PLATFORMS &amp; APPS:
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {PROJECT_EXTERNAL_LINKS.map((link, i) => {
              const isActive = activeCardIndex === i
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[0.6875rem] font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#D4B276]/20 border-[#D4B276] text-[#ECC87A] shadow-[0_0_12px_rgba(212,178,118,0.25)] font-semibold'
                      : 'bg-white/[0.04] border-white/10 text-[#FAF8F5]/75 hover:bg-white/[0.08] hover:border-[#D4B276]/40 hover:text-[#FAF8F5]'
                  }`}
                  title={`${link.name} — ${link.type}`}
                >
                  <span className="text-[0.5625rem] text-[#D4B276]/70 font-bold">0{i + 1}</span>
                  <span>{link.name}</span>
                  <ExternalLink size={10} className="opacity-70" />
                </a>
              )
            })}
          </div>
        </div>
      </div>

      {/* =====================================================================
          4. BOTTOM STATUS & HINT BAR (With Final Scroll Exit Trigger)
          ===================================================================== */}
      <footer className="relative z-40 flex items-center justify-between px-6 sm:px-12 py-3 border-t border-white/5 bg-[#050508]/85 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {isAllCardsFinished ? (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#ECC87A',
                fontWeight: 600,
              }}
              className="flex items-center gap-2 animate-pulse"
            >
              <span>
                ✓ ALL 6 PROJECTS DISPLAYED — SCROLL TO COMPLETE FINAL HAND MOVE (
                <span ref={finaleFooterPercentRef}>0%</span>)
              </span>
              <ArrowDown size={13} className="text-[#D4B276] animate-bounce" />
            </span>
          ) : (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: hasScrolled ? 'rgba(245, 240, 232, 0.45)' : '#ECC87A',
                transition: 'color 300ms',
              }}
            >
              {isHeroPhase
                ? 'SCROLL DOWN OR DRAG TO SHIFT TEXT & REVEAL PROJECTS'
                : 'SMOOTH MOUSE SCROLL ACTIVE — CARDS ENTER 1 BY 1'}
            </span>
          )}
        </div>

        {/* Center: Numeric Card Dots */}
        <div className="flex items-center gap-2" onPointerDown={(e) => e.stopPropagation()}>
          {ARCHIVE_PROJECTS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => jumpToCard(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeCardIndex === i ? 'w-8 bg-[#D4B276]' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Jump to card 0${i + 1}`}
            />
          ))}
        </div>

        {/* Right: Step Arrow Triggers & Continue Button */}
        <div className="flex items-center gap-2" onPointerDown={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => jumpToCard(activeCardIndex - 1)}
            disabled={activeCardIndex < 0}
            className="w-8 h-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center text-[#FAF7F0] transition-colors cursor-pointer"
            aria-label="Previous Step"
          >
            <ArrowLeft size={14} />
          </button>

          {activeCardIndex === totalCards - 1 ? (
            <button
              type="button"
              onClick={handleFinishAndContinue}
              className="h-8 px-3.5 rounded-full border border-[#D4B276]/60 bg-[#D4B276]/15 hover:bg-[#D4B276] hover:text-[#090A0E] text-[#ECC87A] flex items-center gap-1.5 transition-all cursor-pointer font-mono text-[0.625rem] font-semibold tracking-wider"
              title="Finish and continue down the website"
            >
              <span>CONTINUE WEBSITE</span>
              <ArrowDown size={13} className="animate-bounce" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => jumpToCard(activeCardIndex + 1)}
              className="w-8 h-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 flex items-center justify-center text-[#FAF7F0] transition-colors cursor-pointer"
              aria-label="Next Project"
            >
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}
