// ---------------------------------------------------------------------------
// 1. Central Portfolio Statistics Configuration (Editable & Verified)
// ---------------------------------------------------------------------------
export interface PortfolioStatsConfig {
  completedProjects: string | null
  webAndMobileApps: string | null
  happyClients: string | null
  citiesServed: string | null
  statesServed: string | null
}

export const PORTFOLIO_STATS: PortfolioStatsConfig = {
  completedProjects: '14+',
  webAndMobileApps: '20+',
  happyClients: '100%',
  citiesServed: 'Multi-State Regional Reach',
  statesServed: 'UP, Karnataka & Maharashtra',
}

// ---------------------------------------------------------------------------
// 2. Continuous Marquee Screenshot Assets (Authentic Platform Previews)
// ---------------------------------------------------------------------------
export interface ShowcaseScreenshot {
  id: string
  image: string
  category: string
  alt: string
  aspect: 'landscape' | 'portrait' | 'square'
}

export const SHOWCASE_SCREENSHOTS: ShowcaseScreenshot[] = [
  {
    id: 'b2b-commerce-1',
    image: '/assets/Project-showcase-images/1.png',
    category: 'B2B COMMERCE PLATFORM',
    alt: 'Anuj FMCG high-throughput wholesale distribution platform',
    aspect: 'landscape',
  },
  {
    id: 'operations-1',
    image: '/assets/Project-showcase-images/2.png',
    category: 'FLEET & TRAVEL LOGISTICS',
    alt: 'Piyush Travels fleet and operations portal',
    aspect: 'landscape',
  },
  {
    id: 'retail-1',
    image: '/assets/Project-showcase-images/3.png',
    category: 'LUXURY RETAIL STOREFRONT',
    alt: 'Radhika Jewellers luxury digital retail storefront',
    aspect: 'landscape',
  },
  {
    id: 'mobile-app-1',
    image: '/assets/Project-showcase-images/Screenshot_20261107-005728-763.png',
    category: 'RETAIL COMMERCE APP',
    alt: 'Kanhaiya Store mobile ordering storefront',
    aspect: 'portrait',
  },
  {
    id: 'education-1',
    image: '/assets/Project-showcase-images/Screenshot_20261107-005749_Google Play Store.png',
    category: 'EDUCATIONAL APP',
    alt: 'CampusSathi student companion educational platform',
    aspect: 'portrait',
  },
  {
    id: 'game-1',
    image: '/assets/Project-showcase-images/Screenshot_20261107-005846-113.png',
    category: 'MOBILE ARCADE GAME',
    alt: 'ArrowFlow fast-paced mobile puzzle action game',
    aspect: 'portrait',
  },
]

// ---------------------------------------------------------------------------
// 3. Stage B Detailed Project Archive (6 Real Showcased Platforms & Apps)
// Uses exact public/assets/Project-showcase-images/ provided by the client
// Includes Web Platforms, Mobile Apps, Educational Apps and Mobile Games
// ---------------------------------------------------------------------------
export interface ProjectCaseStudy {
  id: string
  number: string
  title: string
  shortCategory: string
  categoryDescription: string
  summary?: string
  verifiedCapabilities?: string[]
  liveUrl: string
  platformType: 'web' | 'android' | 'education' | 'game'
  technologies: string[]
  primaryImage: string
  accentColor: string
  badgeLabel: string
}

export const ARCHIVE_PROJECTS: ProjectCaseStudy[] = [
  {
    id: 'anuj-fmcg',
    number: '01',
    title: 'ANUJ ENTERPRISES FMCG',
    shortCategory: 'B2B WHOLESALE COMMERCE',
    categoryDescription:
      'A connected wholesale distribution platform handling thousands of product SKUs, bulk ordering, live warehouse inventory and automated GST billing.',
    liveUrl: 'https://www.anujfmcg.com/',
    platformType: 'web',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Digital GST Billing', 'Enterprise Inventory'],
    primaryImage: '/assets/Project-showcase-images/1.png',
    accentColor: '#ECC87A',
    badgeLabel: 'DELIVERED & LIVE',
  },
  {
    id: 'piyush-travels',
    number: '02',
    title: 'PIYUSH TRAVELS FLEET SYSTEM',
    shortCategory: 'FLEET & TRAVEL LOGISTICS',
    categoryDescription:
      'Full-scale logistics and travel booking portal featuring dynamic fleet scheduling, driver telemetry, ticket issuance and real-time operations dashboard.',
    liveUrl: 'https://www.piyush-travels.com/',
    platformType: 'web',
    technologies: ['React', 'TypeScript', 'Node.js', 'Fleet Telemetry', 'Booking Engine'],
    primaryImage: '/assets/Project-showcase-images/2.png',
    accentColor: '#ECC87A',
    badgeLabel: 'DELIVERED & LIVE',
  },
  {
    id: 'radhika-jewellers',
    number: '03',
    title: 'RADHIKA JEWELLERS STORE',
    shortCategory: 'LUXURY DIGITAL STOREFRONT',
    categoryDescription:
      'Bespoke digital luxury retail storefront with live gold rate feeds, secure customer checkout, catalog showcase and order processing.',
    liveUrl: 'https://www.radhikajewellers.store/',
    platformType: 'web',
    technologies: ['Next.js', 'Tailwind CSS', 'Live Price Engine', 'Payment Gateway'],
    primaryImage: '/assets/Project-showcase-images/3.png',
    accentColor: '#38BDF8',
    badgeLabel: 'DELIVERED & LIVE',
  },
  {
    id: 'kanhaiya-store',
    number: '04',
    title: 'KANHAIYA GENERAL STORE',
    shortCategory: 'RETAIL MOBILE APP',
    categoryDescription:
      'Native Android mobile commerce application for hyperlocal neighborhood grocery orders, product discovery, and instant merchant fulfillment.',
    liveUrl: 'https://play.google.com/store/apps/details?id=com.kanhaiya.store.customer',
    platformType: 'android',
    technologies: ['Android Native', 'Google Play', 'Firebase', 'Real-Time Sync'],
    primaryImage: '/assets/Project-showcase-images/Screenshot_20261107-005728-763.png',
    accentColor: '#34D399',
    badgeLabel: 'GOOGLE PLAY STORE',
  },
  {
    id: 'campussathi-education',
    number: '05',
    title: 'CAMPUSSATHI EDUCATION APP',
    shortCategory: 'EDUCATIONAL PLATFORM',
    categoryDescription:
      'Comprehensive student companion educational application uniting syllabus tracking, campus notifications, peer networking and academic resources.',
    liveUrl: 'https://play.google.com/store/apps/details?id=com.campussathi.app',
    platformType: 'education',
    technologies: ['Flutter / Android', 'Google Play', 'EdTech Systems', 'Cloud Backend'],
    primaryImage: '/assets/Project-showcase-images/Screenshot_20261107-005749_Google Play Store.png',
    accentColor: '#A78BFA',
    badgeLabel: 'EDUCATION & EDTECH',
  },
  {
    id: 'arrowflow-game',
    number: '06',
    title: 'ARROWFLOW MOBILE GAME',
    shortCategory: 'INTERACTIVE ARCADE GAME',
    categoryDescription:
      'Fast-paced arcade puzzle action game engineered for high-performance 60fps mobile gameplay with custom physics and engaging mechanics.',
    liveUrl: 'https://play.google.com/store/apps/details?id=com.arrowflow.game.arrowflow',
    platformType: 'game',
    technologies: ['Game Engine', 'Android', 'Google Play', '60fps Physics', 'Haptics'],
    primaryImage: '/assets/Project-showcase-images/Screenshot_20261107-005846-113.png',
    accentColor: '#FB923C',
    badgeLabel: 'GAME DEVELOPMENT',
  },
]

// ---------------------------------------------------------------------------
// 4. Direct Public Project Links (Separately Accessible)
// ---------------------------------------------------------------------------
export const PROJECT_EXTERNAL_LINKS = [
  {
    id: 'link-anuj',
    name: 'Anuj FMCG',
    url: 'https://www.anujfmcg.com/',
    type: 'B2B Wholesale Platform',
  },
  {
    id: 'link-piyush',
    name: 'Piyush Travels',
    url: 'https://www.piyush-travels.com/',
    type: 'Fleet & Travel Logistics',
  },
  {
    id: 'link-radhika',
    name: 'Radhika Jewellers',
    url: 'https://www.radhikajewellers.store/',
    type: 'Retail Digital Storefront',
  },
  {
    id: 'link-kanhaiya',
    name: 'Kanhaiya Store',
    url: 'https://play.google.com/store/apps/details?id=com.kanhaiya.store.customer',
    type: 'Android Retail App (Google Play)',
  },
  {
    id: 'link-campussathi',
    name: 'CampusSathi',
    url: 'https://play.google.com/store/apps/details?id=com.campussathi.app',
    type: 'Educational Application (Google Play)',
  },
  {
    id: 'link-arrowflow',
    name: 'ArrowFlow',
    url: 'https://play.google.com/store/apps/details?id=com.arrowflow.game.arrowflow',
    type: 'Interactive Mobile Game (Google Play)',
  },
]
