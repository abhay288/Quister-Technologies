import { memo } from 'react'
import { SHOWCASE_SCREENSHOTS, ShowcaseScreenshot } from './portfolioData'

// Separate distinct image sequences for the lanes to ensure visual variety across lanes
const LANE_1_ITEMS: ShowcaseScreenshot[] = [
  SHOWCASE_SCREENSHOTS[0], // Anuj FMCG B2B
  SHOWCASE_SCREENSHOTS[1], // Piyush Travels
  SHOWCASE_SCREENSHOTS[2], // Radhika Jewellers
  SHOWCASE_SCREENSHOTS[3], // Kanhaiya Store
  SHOWCASE_SCREENSHOTS[4], // CampusSathi Education
  SHOWCASE_SCREENSHOTS[5], // ArrowFlow Mobile Game
]

const LANE_2_ITEMS: ShowcaseScreenshot[] = [
  SHOWCASE_SCREENSHOTS[5], // ArrowFlow Mobile Game
  SHOWCASE_SCREENSHOTS[4], // CampusSathi Education
  SHOWCASE_SCREENSHOTS[3], // Kanhaiya Store
  SHOWCASE_SCREENSHOTS[2], // Radhika Jewellers
  SHOWCASE_SCREENSHOTS[1], // Piyush Travels
  SHOWCASE_SCREENSHOTS[0], // Anuj FMCG B2B
]

const LANE_3_ITEMS: ShowcaseScreenshot[] = [
  SHOWCASE_SCREENSHOTS[2], // Radhika Jewellers
  SHOWCASE_SCREENSHOTS[0], // Anuj FMCG B2B
  SHOWCASE_SCREENSHOTS[4], // CampusSathi Education
  SHOWCASE_SCREENSHOTS[1], // Piyush Travels
  SHOWCASE_SCREENSHOTS[5], // ArrowFlow Mobile Game
  SHOWCASE_SCREENSHOTS[3], // Kanhaiya Store
]

const LANE_4_ITEMS: ShowcaseScreenshot[] = [
  SHOWCASE_SCREENSHOTS[3], // Kanhaiya Store
  SHOWCASE_SCREENSHOTS[5], // ArrowFlow Mobile Game
  SHOWCASE_SCREENSHOTS[1], // Piyush Travels
  SHOWCASE_SCREENSHOTS[4], // CampusSathi Education
  SHOWCASE_SCREENSHOTS[0], // Anuj FMCG B2B
  SHOWCASE_SCREENSHOTS[2], // Radhika Jewellers
]

interface MarqueeLaneProps {
  items: ShowcaseScreenshot[]
  direction: 'left' | 'right'
  durationSeconds: number
  laneIndex: number
}

function MarqueeLane({ items, direction, durationSeconds, laneIndex }: MarqueeLaneProps) {
  // Duplicate array once for seamless infinite loop
  const duplicated = [...items, ...items, ...items]

  const animationName = direction === 'left' ? 'quister-marquee-l' : 'quister-marquee-r'

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{
        height: 'clamp(140px, 18vh, 190px)',
        marginBottom: 'clamp(0.75rem, 1.2vh, 1.25rem)',
        transform: 'translateZ(0)',
      }}
    >
      <div
        className="flex items-center gap-6 absolute top-0 left-0 h-full whitespace-nowrap"
        style={{
          width: 'max-content',
          animation: `${animationName} ${durationSeconds}s linear infinite`,
          willChange: 'transform',
        }}
      >
        {duplicated.map((item, idx) => (
          <div
            key={`${item.id}-${laneIndex}-${idx}`}
            className="relative flex-shrink-0 rounded-lg overflow-hidden border border-white/[0.06] shadow-xl group transition-transform duration-500"
            style={{
              width: item.aspect === 'portrait' ? 'clamp(110px, 14vw, 150px)' : 'clamp(260px, 32vw, 360px)',
              height: '100%',
              background: '#0D0E14',
            }}
          >
            {/* Real Screenshot Image */}
            <img
              src={item.image}
              alt={item.alt}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover object-top opacity-40 group-hover:opacity-60 transition-opacity duration-500 filter brightness-95 contrast-105"
              style={{
                display: 'block',
              }}
            />

            {/* Subtle Gradient Sheen across each frame */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, rgba(5,5,8,0.2) 0%, transparent 40%, rgba(5,5,8,0.7) 100%)',
              }}
            />

            {/* Discreet Generic Category Badge (Zero client names / Zero URLs) */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5625rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#ECC87A',
                  background: 'rgba(9, 10, 14, 0.85)',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '2px',
                  border: '1px solid rgba(212, 178, 118, 0.25)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {item.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MovingScreenshotLanes() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      style={{
        zIndex: 0,
        opacity: 0.88,
        perspective: '1200px',
      }}
    >
      <style>{`
        @keyframes quister-marquee-l {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.333333%, 0, 0);
          }
        }
        @keyframes quister-marquee-r {
          0% {
            transform: translate3d(-33.333333%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>

      {/* 4 Wide Continuous Marquee Lanes in Alternating Directions */}
      <div
        className="w-full h-full flex flex-col justify-center"
        style={{
          transform: 'rotate(-2deg) scale(1.08)',
          transformOrigin: 'center center',
        }}
      >
        {/* Lane 1: Right to Left */}
        <MarqueeLane
          items={LANE_1_ITEMS}
          direction="left"
          durationSeconds={42}
          laneIndex={1}
        />

        {/* Lane 2: Left to Right */}
        <MarqueeLane
          items={LANE_2_ITEMS}
          direction="right"
          durationSeconds={48}
          laneIndex={2}
        />

        {/* Lane 3: Right to Left */}
        <MarqueeLane
          items={LANE_3_ITEMS}
          direction="left"
          durationSeconds={45}
          laneIndex={3}
        />

        {/* Lane 4: Left to Right (Visible on Desktop/Large Tablets) */}
        <div className="hidden md:block">
          <MarqueeLane
            items={LANE_4_ITEMS}
            direction="right"
            durationSeconds={52}
            laneIndex={4}
          />
        </div>
      </div>

      {/* Soft Vignette Gradients: Top, Bottom, Left, and Right so NO sharp boundaries appear */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(5, 5, 8, 0.45) 0%, rgba(5, 5, 8, 0.82) 65%, #050508 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, #050508 0%, transparent 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-36 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #050508 0%, transparent 100%)',
        }}
      />
      <div
        className="absolute inset-y-0 left-0 w-24 sm:w-48 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, #050508 0%, transparent 100%)',
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-24 sm:w-48 pointer-events-none"
        style={{
          background: 'linear-gradient(to left, #050508 0%, transparent 100%)',
        }}
      />
    </div>
  )
}

export default memo(MovingScreenshotLanes)

