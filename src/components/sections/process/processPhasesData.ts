export interface ProcessStage {
  id: string
  number: string
  eyebrow: string
  title: string
  description: string
  whatYouReceive: string[]
  whatWeNeed: string[]
}

export interface EngagementPrinciple {
  number: string
  title: string
  description: string
}

export interface ProjectCommitment {
  number: string
  title: string
  description: string
}

export interface CollaborationRule {
  number: string
  title: string
  description: string
}

export interface ProofOfConceptConfig {
  label: string
  title: string
  description: string
  highlights: string[]
}

export interface ProcessCtaConfig {
  eyebrow: string
  headline: string
  supportingCopy: string
  primaryCta: {
    label: string
    href: string
  }
  secondaryCta: {
    label: string
    href: string
  }
}

/**
 * The Six-Stage Client-Facing Engineering Lifecycle for QUISTER TECHNOLOGIES
 * Simple, premium, transparent, and honest.
 */
export const PROCESS_STAGES: ProcessStage[] = [
  {
    id: 'discovery',
    number: '01',
    eyebrow: 'UNDERSTAND THE PROBLEM.',
    title: 'Discovery & Strategy',
    description:
      'We begin by understanding your business, target audience, technical requirements, existing infrastructure, and strategic objectives before determining the optimal engineering approach.',
    whatYouReceive: [
      'Comprehensive discovery consultation.',
      'Requirements & product scope definition.',
      'System architecture & tech stack recommendations.',
      'Milestone roadmap, timeline & transparent estimates.',
    ],
    whatWeNeed: [
      'Core business goals & target metrics.',
      'Key feature priorities and user constraints.',
      'Budget expectations and delivery horizons.',
      'Relevant brand materials, API docs & benchmarks.',
    ],
  },
  {
    id: 'architecture',
    number: '02',
    eyebrow: 'PLAN BEFORE WE BUILD.',
    title: 'Architecture & Planning',
    description:
      'We establish the technical foundations, data schemas, security perimeters, and service contracts before writing production code, mitigating risks early.',
    whatYouReceive: [
      'Comprehensive system architecture diagram.',
      'Database schema & entity relationship models.',
      'API contracts & integration specifications.',
      'Technical sprint plan & dependency map.',
    ],
    whatWeNeed: [
      'Third-party software & credential access.',
      'Compliance, security, or compliance constraints.',
      'Expected data scale and throughput projections.',
      'Sign-off on chosen architecture & infrastructure.',
    ],
  },
  {
    id: 'design',
    number: '03',
    eyebrow: 'EXPERIENCE CRAFT & CLARITY.',
    title: 'Experience & Interface Design',
    description:
      'We shape user journeys, interactive wireframes, and production design systems with obsessive typographic hierarchy and tactile interactive polish.',
    whatYouReceive: [
      'Interactive Figma prototypes & wireframes.',
      'Component library & design token system.',
      'Micro-interactions & animation choreography.',
      'Responsive multi-viewport screen layouts.',
    ],
    whatWeNeed: [
      'Consolidated design feedback rounds.',
      'Brand guidelines, vector assets & typography licenses.',
      'Key customer persona feedback & copy inputs.',
      'Design direction approval before engineering sprint.',
    ],
  },
  {
    id: 'development',
    number: '04',
    eyebrow: 'BUILD WITH PURPOSE.',
    title: 'Development & Integration',
    description:
      'We craft high-performance code with modular React/TypeScript frontends, resilient backend architectures, real-time sync, and scalable database layers.',
    whatYouReceive: [
      'Bi-weekly staging build deployments.',
      'Transparent git commits & progress updates.',
      'Modular, type-safe, and self-documenting code.',
      'Direct staging review links with instant preview.',
    ],
    whatWeNeed: [
      'Timely sprint feedback and validation.',
      'Sandbox API credentials & test accounts.',
      'Domain DNS or cloud console access when required.',
      'Sprint review approvals.',
    ],
  },
  {
    id: 'testing',
    number: '05',
    eyebrow: 'RIGOROUS QUALITY & ASSURANCE.',
    title: 'Testing & Quality Assurance',
    description:
      'Every interaction, endpoint, and edge case undergoes rigorous automated and manual validation across devices, screen sizes, network conditions, and browsers.',
    whatYouReceive: [
      'Cross-browser and cross-device audit reports.',
      'Nyquist validation & edge-case test coverage.',
      'Performance, Core Web Vitals & accessibility benchmarks.',
      'Security review & vulnerability scan summary.',
    ],
    whatWeNeed: [
      'Client UAT test case sign-off.',
      'Real-world test data sets or staging accounts.',
      'Consolidated bug review & prioritization.',
      'Final production launch authorization.',
    ],
  },
  {
    id: 'deployment',
    number: '06',
    eyebrow: 'READY FOR THE REAL WORLD.',
    title: 'Deployment & Ongoing Support',
    description:
      'We execute zero-downtime production cutovers, transfer full code ownership, and provide proactive post-launch monitoring and continuous enhancement.',
    whatYouReceive: [
      'Zero-downtime production deployment.',
      'Full repository transfer & IP documentation.',
      'CI/CD automation pipelines & backup setup.',
      '30-day post-launch warranty & ongoing care plans.',
    ],
    whatWeNeed: [
      'Production hosting & DNS provider access.',
      'Payment gateway & live merchant accounts.',
      'Final launch schedule coordination.',
      'Sign-off on project handover.',
    ],
  },
]

/**
 * How Projects Are Structured
 */
export const ENGAGEMENT_STRUCTURE: EngagementPrinciple[] = [
  {
    number: '01',
    title: 'Defined Project Scope',
    description:
      'Every project starts with an agreed scope, technical architecture and deliverables.',
  },
  {
    number: '02',
    title: 'Agreed Milestones',
    description:
      'Work is divided into structured milestones so progress can be reviewed at each stage.',
  },
  {
    number: '03',
    title: 'Transparent Payments',
    description:
      'Invoicing is linked to agreed milestones rather than unexpected hours.',
  },
  {
    number: '04',
    title: 'Clear Handover',
    description:
      'Upon completion, you receive the agreed source code, assets and documentation.',
  },
]

/**
 * Optional Proof of Concept Callout
 */
export const PROOF_OF_CONCEPT_DATA: ProofOfConceptConfig = {
  label: 'TECHNICAL VALIDATION // PROOF OF CONCEPT',
  title: 'Feasibility First: Optional Proof of Concept',
  description:
    'When a project involves unfamiliar technology, complex integrations or unvalidated ideas, we can begin with a focused Proof of Concept to confirm feasibility before committing to full development.',
  highlights: [
    'A focused exploratory sprint validating core feasibility.',
    'Early risk reduction for custom APIs, 3D graphics or AI systems.',
    'Clear architectural findings before committing full development budget.',
  ],
}

/**
 * Our Project Commitments (Trust Grid)
 */
export const PROJECT_COMMITMENTS: ProjectCommitment[] = [
  {
    number: '01',
    title: 'Clear Project Scope',
    description: 'We agree on deliverables, assumptions and boundaries before work begins.',
  },
  {
    number: '02',
    title: 'Direct Communication',
    description: 'You work directly with the people building your product.',
  },
  {
    number: '03',
    title: 'Maintainable Code',
    description:
      'We build using modern, established technologies that can be maintained and extended.',
  },
  {
    number: '04',
    title: 'Regular Progress Visibility',
    description: 'You can see your product take shape through structured updates and builds.',
  },
  {
    number: '05',
    title: 'Agreed Ownership & Handover',
    description: 'You retain ownership of the developed work upon completion of agreed terms.',
  },
  {
    number: '06',
    title: 'Transparent Post-Launch Support',
    description: 'We provide clear handover and can agree on ongoing support arrangements.',
  },
]

/**
 * Project Approval and Communication Guidelines
 */
export const COLLABORATION_RULES: CollaborationRule[] = [
  {
    number: '01',
    title: 'Consolidated Feedback',
    description: 'One consolidated feedback submission per review round where practical.',
  },
  {
    number: '02',
    title: 'Scope Alignment',
    description: 'Important scope changes are discussed before implementation.',
  },
  {
    number: '03',
    title: 'Agreed Cadence',
    description: 'Progress is shared at agreed intervals.',
  },
  {
    number: '04',
    title: 'Documented Sign-off',
    description: 'Approvals are recorded before moving through major milestones.',
  },
]

/**
 * Final Process Call to Action
 */
export const PROCESS_CTA_DATA: ProcessCtaConfig = {
  eyebrow: 'START THE CONVERSATION',
  headline: 'Have something worth building?',
  supportingCopy:
    'Tell us what you have in mind. We will understand your requirements, discuss the right approach and outline the next steps.',
  primaryCta: {
    label: 'START A PROJECT',
    href: '#contact',
  },
  secondaryCta: {
    label: 'EXPLORE OUR WORK',
    href: '#work',
  },
}
