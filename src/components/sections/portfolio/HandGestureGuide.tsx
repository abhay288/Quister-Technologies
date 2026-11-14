import { memo } from 'react'

interface HandGestureGuideProps {
  progress?: number
  visible?: boolean
}

function HandGestureGuide({ visible = true }: HandGestureGuideProps) {
  if (!visible) return null

  return (
    <div
      aria-hidden="true"
      className="inline-flex items-center gap-3.5 px-4 py-2 rounded-full border border-white/10 bg-black/70 backdrop-blur-md select-none pointer-events-none transition-opacity duration-500"
      style={{
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.7), inset 0 0 14px rgba(212, 178, 118, 0.1)',
      }}
    >
      <style>{`
        @keyframes lenis-hand-swipe {
          0% {
            transform: translate3d(-12px, 0, 0) rotate(-6deg);
            opacity: 0.75;
          }
          35% {
            transform: translate3d(14px, -2px, 0) rotate(8deg);
            opacity: 1;
          }
          50% {
            transform: translate3d(14px, -2px, 0) rotate(8deg);
            opacity: 1;
          }
          85% {
            transform: translate3d(-12px, 0, 0) rotate(-6deg);
            opacity: 0.8;
          }
          100% {
            transform: translate3d(-12px, 0, 0) rotate(-6deg);
            opacity: 0.75;
          }
        }
        @keyframes lenis-dot-pulse {
          0%, 100% { transform: scale(0.85); opacity: 0.4; }
          50% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>

      {/* Animated Hand Illustration (Lenis.dev inspired) */}
      <div
        className="relative flex items-center justify-center w-7 h-6"
        style={{
          animation: 'lenis-hand-swipe 2.8s cubic-bezier(0.45, 0, 0.25, 1) infinite',
          willChange: 'transform',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#ECC87A]"
        >
          {/* Detailed Finger and Hand Contour */}
          <path
            d="M9.5 3.5C9.5 2.67 10.17 2 11 2C11.83 2 12.5 2.67 12.5 3.5V11H13.5C14.33 11 15 11.67 15 12.5V13.8C15 14.1 15.2 14.3 15.5 14.3C16.33 14.3 17 14.97 17 15.8V16.8C17 19.67 14.67 22 11.8 22H10.2C7.9 22 6 20.1 6 17.8V13.5C6 12.7 6.67 12 7.5 12C8.33 12 9 12.7 9 13.5V8.5C9 7.67 9.5 7 9.5 7V3.5Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(236, 200, 122, 0.18)"
          />
        </svg>

        {/* Small Touch Contact Indicator Ring */}
        <span
          className="absolute -top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-[#34D399]"
          style={{ animation: 'lenis-dot-pulse 2s ease-in-out infinite' }}
        />
      </div>

      {/* Minimal Cue Text */}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.625rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#ECC87A',
          fontWeight: 600,
        }}
      >
        SCROLL OR DRAG TO EXPLORE
      </span>

      {/* Minimal Indicator Track */}
      <div className="flex items-center gap-1.5 opacity-65">
        <span className="w-1 h-1 rounded-full bg-[#ECC87A]" />
        <span className="w-1.5 h-0.5 rounded-full bg-[#ECC87A]/40" />
        <span className="w-1.5 h-0.5 rounded-full bg-[#ECC87A]/20" />
      </div>
    </div>
  )
}

export default memo(HandGestureGuide)
