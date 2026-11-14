import { TechIconId } from './TechBrandIcon'

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

export interface TeamStudioConfig {
  eyebrow: string
  headline: string
  subheadline: string
  supportingText: string
  teamTypeBadge: string
  stats: {
    totalCoreMembers: number
    fullTimeCore: number
    partTimeCore: number
    developmentEngineering: number
    designCreative: number
    extendedCollaboratorsCount: number
    extendedCollaboratorsLabel: string
  }
}

export interface TeamMemberProfile {
  id: string
  name: string
  role: string
  employmentType: 'Full-Time Core' | 'Part-Time' | 'Specialist Collaborator'
  disciplines: string[]
  specialisation: string
  bio: string
  monogram: string
  portraitUrl: string | null
  links: Array<{ label: string; href: string }>
}

export interface TeamExpertiseArea {
  id: string
  number: string
  title: string
  description: string
  technologies: string[]
}

export interface TechStackItem {
  id: TechIconId
  name: string
  summary: string
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
  name: 'Abhay Kushwaha',
  monogram: 'AK',
  role: 'Founder & Principal Software Architect',
  portraitUrl: null,
  links: [
    { label: 'GitHub', href: 'https://github.com/abhay288' },
    { label: 'Studio Contact', href: 'mailto:hello@quistertech.com' },
  ],
}

/**
 * Central Editable Team Configuration
 * - Actual verified team numbers only (founder-led studio with extended specialist network)
 * - Clear distinction between full-time core, part-time, and external specialist collaborators
 */
export const TEAM_STUDIO_CONFIG: TeamStudioConfig = {
  eyebrow: '04 // THE PEOPLE BEHIND THE WORK',
  headline: 'A focused team.',
  subheadline: 'Diverse expertise.',
  supportingText:
    'Behind every digital product is a combination of creative thinking, technical expertise and thoughtful collaboration. Our team brings these disciplines together to turn complex ideas into dependable digital experiences.',
  teamTypeBadge: 'FOUNDER-LED STUDIO WITH EXTENDED SPECIALIST NETWORK',
  stats: {
    totalCoreMembers: 1,
    fullTimeCore: 1,
    partTimeCore: 0,
    developmentEngineering: 1,
    designCreative: 1,
    extendedCollaboratorsCount: 3,
    extendedCollaboratorsLabel: 'Specialist Collaborators (On Demand)',
  },
}

/**
 * Data-Driven Team Member Profiles
 * - Easy to update or add verified members as the studio expands
 * - Renders an elegant typographic monogram badge when portraitUrl is null
 */
export const TEAM_MEMBERS: TeamMemberProfile[] = [
  {
    id: 'abhay-kushwaha',
    name: 'Abhay Kushwaha',
    role: 'Founder & Principal Software Architect',
    employmentType: 'Full-Time Core',
    disciplines: [
      'Full-Stack Architecture',
      'WebGL & Three.js',
      'Mobile Ecosystems',
      'UI/UX Direction',
    ],
    specialisation:
      'End-to-end digital architecture, real-time interactive 3D web platforms, and robust enterprise software systems.',
    bio:
      'Directly leads software architecture, creative engineering, and deployment discipline across all client platforms — ensuring zero disconnect between concept, visual precision, and production resilience.',
    monogram: 'AK',
    portraitUrl: null,
    links: [
      { label: 'GitHub', href: 'https://github.com/abhay288' },
      { label: 'Contact', href: 'mailto:hello@quistertech.com' },
    ],
  },
]

/**
 * Genuine Team Expertise Areas
 * - Represents capabilities that the team directly supports in production
 */
export const TEAM_EXPERTISE_AREAS: TeamExpertiseArea[] = [
  {
    id: 'frontend',
    number: '01',
    title: 'Frontend & Web Engineering',
    description:
      'High-performance web applications built on React and Next.js with sub-second page transitions, responsive layout systems, and strict Core Web Vitals optimization.',
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Micro-frontends'],
  },
  {
    id: 'backend',
    number: '02',
    title: 'Backend & System Architecture',
    description:
      'Dependable API layers, relational and document databases, asynchronous worker pipelines, and event-driven services engineered for zero downtime.',
    technologies: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'REST & GraphQL'],
  },
  {
    id: 'mobile',
    number: '03',
    title: 'Mobile Application Development',
    description:
      'Cross-platform applications for iOS and Android delivering fluid 60fps animations, offline data synchronization, and native hardware integration.',
    technologies: ['Flutter', 'React Native', 'Android SDK', 'App Store / Play Store Delivery'],
  },
  {
    id: 'uiux',
    number: '04',
    title: 'UI/UX & Product Design',
    description:
      'Design systems, typographic rhythm, accessible component hierarchies, and interactive prototypes calibrated around genuine user mental models.',
    technologies: ['Design Systems', 'Figma', 'Interactive Prototyping', 'Accessibility (WCAG)'],
  },
  {
    id: 'ai',
    number: '05',
    title: 'AI & Intelligent Systems',
    description:
      'Context-aware automation, document intelligence, intelligent conversational agents, and data orchestration integrated into real operational workflows.',
    technologies: ['FastAPI', 'LLM Integration', 'Vector Indexing', 'Workflow Automation'],
  },
  {
    id: '3d-interactive',
    number: '06',
    title: '3D & Interactive Experiences',
    description:
      'Custom Three.js geometries, physically based specular materials, WebGL shaders, and restrained GSAP choreography that elevate brand identity.',
    technologies: ['Three.js', 'WebGL', 'GLSL Shaders', 'GSAP ScrollTrigger', 'React Three Fiber'],
  },
  {
    id: 'qa-deployment',
    number: '07',
    title: 'Quality Assurance & Deployment',
    description:
      'Static analysis, end-to-end integration tests, containerized micro-environments, and automated CI/CD pipelines ensuring predictable production releases.',
    technologies: ['CI/CD Workflows', 'Docker', 'Oxlint / ESLint', 'Cloud Hosting', 'SSL & DNS'],
  },
]

export const TECH_STACK_ITEMS: TechStackItem[] = [
  {
    id: 'react',
    name: 'React',
    summary: 'Component-driven interfaces engineered for responsive web products.',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    summary: 'Structured React architecture with fast server and client routing.',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    summary: 'Strict static typing across interfaces, state and API contracts.',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    summary: 'Consistent design tokens, fluid grids and utility-first styling.',
  },
  {
    id: 'threejs',
    name: 'Three.js',
    summary: 'Interactive 3D sculptures, materials and real-time WebGL graphics.',
  },
  {
    id: 'gsap',
    name: 'GSAP',
    summary: 'Restrained motion choreography and precision scroll interactions.',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    summary: 'Scalable API layers, integrations and event-driven backends.',
  },
  {
    id: 'python',
    name: 'Python',
    summary: 'FastAPI backends, data automation and intelligent AI workflows.',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    summary: 'Relational transactional storage with strict data integrity.',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    summary: 'Flexible document storage built for evolving product schemas.',
  },
  {
    id: 'firebase',
    name: 'Firebase',
    summary: 'Real-time state sync, cloud messaging and rapid deployment.',
  },
  {
    id: 'flutter',
    name: 'Flutter',
    summary: 'Native-speed cross-platform mobile apps for iOS and Android.',
  },
]

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
