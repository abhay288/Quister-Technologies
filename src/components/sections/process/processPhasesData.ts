export interface ProcessPhase {
  number: string
  subtitle: string
  title: string
  description: string
  deliverable: string
}

export const PROCESS_PHASES: ProcessPhase[] = [
  {
    number: '01',
    subtitle: 'DISCOVERY & STRATEGY',
    title: 'Discovery & Strategy',
    description:
      'We understand the business, audience, requirements, constraints and intended outcomes before defining the scope.',
    deliverable: 'Project Brief & Scope Definition',
  },
  {
    number: '02',
    subtitle: 'ARCHITECTURE & PLANNING',
    title: 'Architecture & Planning',
    description:
      'We design the technical foundation, data structures, APIs, integrations and system architecture.',
    deliverable: 'Technical Architecture & Implementation Plan',
  },
  {
    number: '03',
    subtitle: 'EXPERIENCE & INTERFACE DESIGN',
    title: 'Experience & Interface Design',
    description:
      'We develop user journeys, visual systems, responsive layouts and interaction prototypes.',
    deliverable: 'Approved Design System & Interface Specifications',
  },
  {
    number: '04',
    subtitle: 'DEVELOPMENT & INTEGRATION',
    title: 'Development & Integration',
    description:
      'We build the frontend, backend, database integrations and application functionality in structured development cycles.',
    deliverable: 'Working Application & Integrated Features',
  },
  {
    number: '05',
    subtitle: 'TESTING & QUALITY ASSURANCE',
    title: 'Testing & Quality Assurance',
    description:
      'We validate functionality, responsiveness, security controls and performance, resolving issues before release.',
    deliverable: 'Test Results & Release Readiness Review',
  },
  {
    number: '06',
    subtitle: 'DEPLOYMENT & ONGOING SUPPORT',
    title: 'Deployment & Ongoing Support',
    description:
      'We configure production environments, deploy the product, monitor important behaviour and provide agreed post-launch support.',
    deliverable: 'Production Release & Handover Documentation',
  },
]

