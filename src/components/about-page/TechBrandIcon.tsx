export type TechIconId =
  | 'react'
  | 'nextjs'
  | 'typescript'
  | 'tailwind'
  | 'threejs'
  | 'gsap'
  | 'nodejs'
  | 'python'
  | 'postgresql'
  | 'mongodb'
  | 'firebase'
  | 'flutter'

export const TECH_BRAND_ACCENTS: Record<TechIconId, { hex: string; softBg: string; border: string }> = {
  react: { hex: '#087EA4', softBg: 'rgba(97, 218, 251, 0.14)', border: 'rgba(8, 126, 164, 0.35)' },
  nextjs: { hex: '#101016', softBg: 'rgba(16, 16, 22, 0.08)', border: 'rgba(16, 16, 22, 0.28)' },
  typescript: { hex: '#3178C6', softBg: 'rgba(49, 120, 198, 0.12)', border: 'rgba(49, 120, 198, 0.36)' },
  tailwind: { hex: '#0284C7', softBg: 'rgba(56, 189, 248, 0.14)', border: 'rgba(2, 132, 199, 0.34)' },
  threejs: { hex: '#049EF4', softBg: 'rgba(4, 158, 244, 0.12)', border: 'rgba(4, 158, 244, 0.34)' },
  gsap: { hex: '#0AE448', softBg: 'rgba(10, 228, 72, 0.12)', border: 'rgba(22, 163, 74, 0.36)' },
  nodejs: { hex: '#339933', softBg: 'rgba(51, 153, 51, 0.12)', border: 'rgba(51, 153, 51, 0.36)' },
  python: { hex: '#3776AB', softBg: 'rgba(55, 118, 171, 0.12)', border: 'rgba(55, 118, 171, 0.35)' },
  postgresql: { hex: '#336791', softBg: 'rgba(51, 103, 145, 0.12)', border: 'rgba(51, 103, 145, 0.36)' },
  mongodb: { hex: '#00684A', softBg: 'rgba(0, 237, 100, 0.14)', border: 'rgba(19, 170, 82, 0.36)' },
  firebase: { hex: '#F57C00', softBg: 'rgba(255, 202, 40, 0.16)', border: 'rgba(245, 124, 0, 0.36)' },
  flutter: { hex: '#02569B', softBg: 'rgba(84, 197, 248, 0.16)', border: 'rgba(2, 86, 155, 0.34)' },
}

function MonochromeTechMark({ id }: { id: TechIconId }) {
  const stroke = 'currentColor'
  switch (id) {
    case 'react':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={stroke} strokeWidth="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="1.8" fill={stroke} stroke="none" />
          <ellipse cx="12" cy="12" rx="9.5" ry="3.8" />
          <ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(120 12 12)" />
        </svg>
      )
    case 'nextjs':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={stroke} strokeWidth="1.6" aria-hidden="true">
          <circle cx="12" cy="12" r="9.2" />
          <path d="M8.8 16.2V8.2l8.4 10.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15.2 8.2v4.4" strokeLinecap="round" />
        </svg>
      )
    case 'typescript':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={stroke} strokeWidth="1.6" aria-hidden="true">
          <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="3" />
          <path d="M7 10.5h5.2M9.6 10.5v6.8" strokeLinecap="round" />
          <path
            d="M17.2 11.4c-.5-.6-1.2-.9-2-.9-1.2 0-2 .6-2 1.5s.7 1.3 2.1 1.6c1.4.3 2.1.8 2.1 1.8 0 1-.9 1.8-2.2 1.8-1 0-1.9-.4-2.4-1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'tailwind':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7.5 9.8C8.3 7.4 10 6.2 12.2 6.2c3.2 0 3.6 2.4 5.2 2.8 1 .2 1.9-.2 2.8-1.2-.8 2.4-2.5 3.6-4.7 3.6-3.2 0-3.6-2.4-5.2-2.8-1-.2-1.9.2-2.8 1.2Z" />
          <path d="M3.8 15.8c.8-2.4 2.5-3.6 4.7-3.6 3.2 0 3.6 2.4 5.2 2.8 1 .2 1.9-.2 2.8-1.2-.8 2.4-2.5 3.6-4.7 3.6-3.2 0-3.6-2.4-5.2-2.8-1-.2-1.9.2-2.8 1.2Z" />
        </svg>
      )
    case 'threejs':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
          <polygon points="12,3.2 20.5,18.2 3.5,18.2" />
          <polygon points="12,8.5 16.2,16 7.8,16" />
          <line x1="12" y1="3.2" x2="12" y2="8.5" />
          <line x1="20.5" y1="18.2" x2="16.2" y2="16" />
          <line x1="3.5" y1="18.2" x2="7.8" y2="16" />
        </svg>
      )
    case 'gsap':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18.5 8.5A7.5 7.5 0 1 0 19.5 12h-6.8" />
          <circle cx="12" cy="12" r="1.4" fill={stroke} stroke="none" />
        </svg>
      )
    case 'nodejs':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={stroke} strokeWidth="1.55" strokeLinejoin="round" aria-hidden="true">
          <polygon points="12,2.8 20,7.4 20,16.6 12,21.2 4,16.6 4,7.4" />
          <path d="M9.2 14.8V9.2l5.6 5.6V9.2" strokeLinecap="round" />
        </svg>
      )
    case 'python':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={stroke} strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3.5c-3 0-3.2 1.4-3.2 3v1.8h6.4v1H6.5C4.5 9.3 3.5 10.6 3.5 13c0 2.4 1 3.7 3 3.7h1.4v-2c0-1.6 1.2-2.7 2.8-2.7h4.2c1.2 0 2.1-.9 2.1-2.1V6.5c0-1.6-.9-3-5-3Z" />
          <path d="M12 20.5c3 0 3.2-1.4 3.2-3v-1.8H8.8v-1h8.7c2 0 3-1.3 3-3.7 0-2.4-1-3.7-3-3.7h-1.4v2c0 1.6-1.2 2.7-2.8 2.7H9.1c-1.2 0-2.1.9-2.1 2.1v3.4c0 1.6.9 3 5 3Z" />
          <circle cx="10.4" cy="5.8" r="0.7" fill={stroke} stroke="none" />
          <circle cx="13.6" cy="18.2" r="0.7" fill={stroke} stroke="none" />
        </svg>
      )
    case 'postgresql':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={stroke} strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <ellipse cx="12" cy="6.2" rx="7" ry="2.8" />
          <path d="M5 6.2v5.4c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8V6.2" />
          <path d="M5 11.6v5.4c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8v-5.4" />
        </svg>
      )
    case 'mongodb':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={stroke} strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3.2C14.8 6.4 16.5 9.6 16.5 13c0 3.2-1.9 5.7-4.5 7-2.6-1.3-4.5-3.8-4.5-7 0-3.4 1.7-6.6 4.5-9.8Z" />
          <line x1="12" y1="8.5" x2="12" y2="21.5" />
        </svg>
      )
    case 'firebase':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={stroke} strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5.5 16.5 8.2 4.5l3.6 6.2 3.8-3.8 2.9 9.6L12 20.5l-6.5-4Z" />
          <path d="M5.5 16.5 15.6 6.9" />
        </svg>
      )
    case 'flutter':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={stroke} strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="13.5,3.2 5,11.7 7.8,14.5 19.1,3.2" />
          <polygon points="13.5,11.6 9.3,15.8 13.5,20 19.1,20 14.9,15.8 19.1,11.6" />
        </svg>
      )
  }
}

function ColorTechMark({ id }: { id: TechIconId }) {
  switch (id) {
    case 'react':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#087EA4" strokeWidth="1.6" aria-hidden="true">
          <circle cx="12" cy="12" r="2.1" fill="#087EA4" stroke="none" />
          <ellipse cx="12" cy="12" rx="9.5" ry="3.8" />
          <ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(120 12 12)" />
        </svg>
      )
    case 'nextjs':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9.6" fill="#09090E" />
          <path d="M8.8 16.2V8.2l8.4 10.6" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15.2 8.2v4.4" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      )
    case 'typescript':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
          <rect x="2.8" y="2.8" width="18.4" height="18.4" rx="3.2" fill="#3178C6" />
          <path d="M7 10.8h5.2M9.6 10.8v6.8" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
          <path
            d="M17.4 11.7c-.5-.6-1.2-.9-2-.9-1.2 0-2 .6-2 1.5s.7 1.3 2.1 1.6c1.4.3 2.1.8 2.1 1.8 0 1-.9 1.8-2.2 1.8-1 0-1.9-.4-2.4-1"
            stroke="#FFFFFF"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'tailwind':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#06B6D4" aria-hidden="true">
          <path d="M7.5 10C8.4 7.4 10.1 6.1 12.4 6.1c3.3 0 3.7 2.5 5.4 2.9 1.1.3 2.1-.1 3.1-1.2-.9 2.6-2.6 3.9-4.9 3.9-3.3 0-3.7-2.5-5.4-2.9-1.1-.3-2.1.1-3.1 1.2Zm-4.2 5.9C4.2 13.3 5.9 12 8.2 12c3.3 0 3.7 2.5 5.4 2.9 1.1.3 2.1-.1 3.1-1.2-.9 2.6-2.6 3.9-4.9 3.9-3.3 0-3.7-2.5-5.4-2.9-1.1-.3-2.1.1-3.1 1.2Z" />
        </svg>
      )
    case 'threejs':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" strokeLinejoin="round" aria-hidden="true">
          <polygon points="12,3.2 20.5,18.2 3.5,18.2" fill="rgba(4, 158, 244, 0.14)" stroke="#049EF4" strokeWidth="1.65" />
          <polygon points="12,8.5 16.2,16 7.8,16" fill="#049EF4" stroke="#049EF4" strokeWidth="1.2" />
          <line x1="12" y1="3.2" x2="12" y2="8.5" stroke="#049EF4" strokeWidth="1.5" />
          <line x1="20.5" y1="18.2" x2="16.2" y2="16" stroke="#049EF4" strokeWidth="1.5" />
          <line x1="3.5" y1="18.2" x2="7.8" y2="16" stroke="#049EF4" strokeWidth="1.5" />
        </svg>
      )
    case 'gsap':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9.4" fill="#0AE448" fillOpacity="0.16" />
          <path d="M18.5 8.5A7.5 7.5 0 1 0 19.5 12h-6.8" stroke="#16A34A" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="1.8" fill="#16A34A" />
        </svg>
      )
    case 'nodejs':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
          <polygon points="12,2.8 20,7.4 20,16.6 12,21.2 4,16.6 4,7.4" fill="#339933" />
          <path d="M9.2 14.8V9.2l5.6 5.6V9.2" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'python':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
          <path
            d="M12 3.3c-3.1 0-3.3 1.4-3.3 3.1v1.9h6.5v1H6.5c-2.1 0-3.1 1.4-3.1 3.8 0 2.4 1 3.8 3.1 3.8h1.5v-2.1c0-1.6 1.2-2.7 2.8-2.7h4.2c1.2 0 2.2-.9 2.2-2.2V6.4c0-1.7-.9-3.1-5.2-3.1Z"
            fill="#3776AB"
          />
          <path
            d="M12 20.7c3.1 0 3.3-1.4 3.3-3.1v-1.9H8.8v-1h8.7c2.1 0 3.1-1.4 3.1-3.8 0-2.4-1-3.8-3.1-3.8H16v2.1c0 1.6-1.2 2.7-2.8 2.7H9c-1.2 0-2.2.9-2.2 2.2v3.5c0 1.7.9 3.1 5.2 3.1Z"
            fill="#F5B82E"
          />
          <circle cx="10.4" cy="5.8" r="0.85" fill="#FFFFFF" />
          <circle cx="13.6" cy="18.2" r="0.85" fill="#FFFFFF" />
        </svg>
      )
    case 'postgresql':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#336791" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <ellipse cx="12" cy="6.2" rx="7" ry="2.8" fill="rgba(51, 103, 145, 0.2)" />
          <path d="M5 6.2v5.4c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8V6.2" fill="rgba(51, 103, 145, 0.1)" />
          <path d="M5 11.6v5.4c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8v-5.4" fill="rgba(51, 103, 145, 0.16)" />
        </svg>
      )
    case 'mongodb':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
          <path d="M12 3.2C14.8 6.4 16.5 9.6 16.5 13c0 3.2-1.9 5.7-4.5 7-2.6-1.3-4.5-3.8-4.5-7 0-3.4 1.7-6.6 4.5-9.8Z" fill="#13AA52" />
          <line x1="12" y1="8.5" x2="12" y2="21.5" stroke="#0B5E31" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    case 'firebase':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
          <polygon points="5.5,16.5 8.2,4.5 11.8,10.7 5.5,16.5" fill="#FFA000" />
          <polygon points="5.5,16.5 15.6,6.9 18.5,16.5 12,20.5" fill="#FFCA28" />
          <polygon points="5.5,16.5 11.8,10.7 13.7,14.1" fill="#F57C00" />
        </svg>
      )
    case 'flutter':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
          <polygon points="13.5,3.2 5,11.7 7.8,14.5 19.1,3.2" fill="#54C5F8" />
          <polygon points="13.5,11.6 9.3,15.8 12.1,18.6 19.1,11.6" fill="#29B6F6" />
          <polygon points="12.1,18.6 13.5,20 19.1,20 14.9,15.8" fill="#01579B" />
        </svg>
      )
  }
}

export default function TechBrandIcon({
  id,
  active = false,
}: {
  id: TechIconId
  active?: boolean
}) {
  return (
    <span className="relative w-5 h-5 flex items-center justify-center">
      <span
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          active ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
        }`}
      >
        <MonochromeTechMark id={id} />
      </span>
      <span
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <ColorTechMark id={id} />
      </span>
    </span>
  )
}
