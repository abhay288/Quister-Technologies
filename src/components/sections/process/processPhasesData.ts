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
 * The Five-Stage Client-Facing Delivery Process for QUISTER TECHNOLOGIES
 * Simple, premium, transparent and honest.
 */
export const PROCESS_STAGES: ProcessStage[] = [
  {
    id: 'discover',
    number: '01',
    eyebrow: 'UNDERSTAND THE PROBLEM.',
    title: 'Discovery & Strategy',
    description:
      'We begin by understanding your business, audience, requirements, existing systems and project objectives before deciding how to build.',
    whatYouReceive: [
      'Initial discovery discussion.',
      'Requirements and scope definition.',
      'Technical recommendations.',
      'Preliminary timeline and estimate.',
    ],
    whatWeNeed: [
      'Your business goals.',
      'Key requirements and priorities.',
      'Budget expectations.',
      'Relevant existing materials and references.',
    ],
  },
  {
    id: 'design',
    number: '02',
    eyebrow: 'PLAN BEFORE WE BUILD.',
    title: 'Experience & Architecture',
    description:
      'We define how the product works before development begins. User journeys, interface design and technical architecture are shaped around your actual requirements.',
    whatYouReceive: [
      'User flows and wireframes.',
      'Interface designs and prototypes, where applicable.',
      'Technical architecture.',
      'Defined implementation plan.',
    ],
    whatWeNeed: [
      'Timely feedback.',
      'Design preferences.',
      'Required content and brand assets.',
      'Approval of the agreed direction.',
    ],
  },
  {
    id: 'develop',
    number: '03',
    eyebrow: 'BUILD WITH PURPOSE.',
    title: 'Development & Integration',
    description:
      'We develop the product through structured implementation, integrating the frontend, backend, databases and third-party services required by the approved scope.',
    whatYouReceive: [
      'Working development builds.',
      'Feature implementation updates.',
      'Relevant technical documentation.',
      'Opportunities to review progress.',
    ],
    whatWeNeed: [
      'Consolidated feedback.',
      'Access to necessary third-party services.',
      'Required content and test information.',
      'Timely review and approvals.',
    ],
  },
  {
    id: 'launch',
    number: '04',
    eyebrow: 'READY FOR THE REAL WORLD.',
    title: 'Testing & Deployment',
    description:
      'We validate the agreed functionality, resolve identified issues and prepare the application or website for its production release.',
    whatYouReceive: [
      'Functional and responsive testing.',
      'Release preparation.',
      'Production deployment.',
      'Agreed source-code and documentation handover.',
    ],
    whatWeNeed: [
      'Final approvals.',
      'Required hosting, domain and store accounts.',
      'Production content and credentials through secure channels.',
    ],
  },
  {
    id: 'evolve',
    number: '05',
    eyebrow: 'BEYOND THE LAUNCH.',
    title: 'Support & Improvement',
    description:
      'After release, we can continue supporting your product through agreed maintenance, improvements, updates and technical enhancements.',
    whatYouReceive: [
      'Post-launch stabilization.',
      'Issue resolution during agreed support period.',
      'Planned technical updates and feature additions.',
      'Documentation updates.',
    ],
    whatWeNeed: [
      'Documented issue reports.',
      'Clear enhancement priorities.',
      'Continued access where required.',
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
