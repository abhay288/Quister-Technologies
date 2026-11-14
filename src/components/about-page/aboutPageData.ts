export interface CorePrinciple {
  number: string
  icon: 'users' | 'compass' | 'layers' | 'key'
  title: string
  description: string
}

export interface FounderProfileConfig {
  name: string | null
  monogram: string
  role: string
  portraitUrl: string | null
  links: Array<{ label: string; href: string }>
}

export interface CompactTechCategory {
  category: string
  technologies: string
}

export interface CompactSocialLink {
  label: string
  href: string | null
}

export interface CompactTeamConfig {
  eyebrow: string
  headlineMain: string
  headlineSub: string
  statNumber: string
  statLabel: string
  description: string
  techHeading: string
  categories: CompactTechCategory[]
  socialLinks: CompactSocialLink[]
}

export const COMPACT_TEAM_CONFIG: CompactTeamConfig = {
  eyebrow: '04 // OUR PEOPLE',
  headlineMain: 'A focused team.',
  headlineSub: 'Collective expertise.',
  statNumber: '10+',
  statLabel: 'TEAM MEMBERS',
  description:
    'A multidisciplinary team bringing together engineering, product design and creative technology to build reliable digital experiences.',
  techHeading: 'TECHNOLOGY EXPERTISE',
  categories: [
    {
      category: 'WEB & FRONTEND',
      technologies: 'React · Next.js · TypeScript · Tailwind CSS',
    },
    {
      category: 'BACKEND & SYSTEMS',
      technologies: 'Node.js · Python · FastAPI',
    },
    {
      category: 'DATABASES',
      technologies: 'MongoDB · PostgreSQL · Firebase',
    },
    {
      category: 'MOBILE',
      technologies: 'Flutter · React Native',
    },
    {
      category: 'CREATIVE ENGINEERING',
      technologies: 'Three.js · WebGL · GSAP',
    },
  ],
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com/abhay288' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/abhay-kushwaha-a2a1b21b3/' },
  ],
}

export interface AboutFaqItem {
  number: string
  question: string
  answer: string
}

export const CORE_PRINCIPLES: CorePrinciple[] = [
  {
    number: '01',
    icon: 'users',
    title: 'Direct Collaboration',
    description:
      'You work directly with the engineers and designers building your product — keeping decisions fast and context intact.',
  },
  {
    number: '02',
    icon: 'compass',
    title: 'Clarity Before Code',
    description:
      'We align architecture, user flows and scope boundaries early so visual craft sits on dependable engineering.',
  },
  {
    number: '03',
    icon: 'layers',
    title: 'Clean Maintainability',
    description:
      'Typed components, sensible dependencies and clear conventions let your team scale and extend systems with confidence.',
  },
  {
    number: '04',
    icon: 'key',
    title: 'Full Ownership',
    description:
      'From initial prototype to live deployment, we ship complete documentation and transfer full repository ownership cleanly.',
  },
]

export const FOUNDER_PROFILE_CONFIG: FounderProfileConfig = {
  name: null,
  monogram: 'QT',
  role: 'Independent Digital Engineering Studio',
  portraitUrl: null,
  links: [],
}

export const ABOUT_FAQS: AboutFaqItem[] = [
  {
    number: '01',
    question: 'What types of projects do you take on?',
    answer:
      'Custom web applications, B2B and retail commerce platforms, cross-platform mobile apps and interactive 3D web experiences.',
  },
  {
    number: '02',
    question: 'How do pricing and timelines work?',
    answer:
      'Both are defined transparently from real project scope and milestone structure right after our initial Discovery discussion.',
  },
  {
    number: '03',
    question: 'Do we receive full code ownership?',
    answer:
      'Yes. At handover, you retain complete ownership of the repository history, source code, design assets and deployment setup.',
  },
  {
    number: '04',
    question: 'Can you rebuild an existing platform?',
    answer:
      'Yes. We redesign and re-engineer existing websites or software products to improve speed, UX clarity and maintainability.',
  },
  {
    number: '05',
    question: 'How do we start a project?',
    answer:
      'Share your goals via our Start a Project form and we will follow up to schedule an initial Discovery conversation.',
  },
]
