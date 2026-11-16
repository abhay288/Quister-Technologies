/**
 * QUISTER TECHNOLOGIES — SERVICES & CAPABILITIES DATA SPECIFICATION
 * 
 * Truthful, disciplined, and refined data structures reflecting the studio's
 * actual digital engineering, business systems, and advanced technology capabilities.
 */

export interface ServiceDiscipline {
  id: string
  letter: string
  title: string
  eyebrow: string
  shortDesc: string
  detailedDesc: string
  capabilities: string[]
  deliverables: string[]
  techTags: string[]
  inquiryDiscipline: string
}

export interface ServiceFamily {
  id: string
  number: string
  eyebrow: string
  headline: string
  description: string
  theme: 'light' | 'dark'
  disciplines: ServiceDiscipline[]
  visualConcept: string
}

export interface WorkingPrinciple {
  number: string
  title: string
  description: string
}

export interface ServiceFaqItem {
  number: string
  question: string
  answer: string
}

// ---------------------------------------------------------------------------
// 1. PRIMARY SERVICE CAPABILITY: DIGITAL EXPERIENCES
// ---------------------------------------------------------------------------
export const SERVICE_FAMILIES: ServiceFamily[] = [
  {
    id: 'digital-products',
    number: '01',
    eyebrow: '01 // DIGITAL EXPERIENCES',
    headline: 'Experiences built around people.',
    description:
      'We create thoughtful digital products across web and mobile, combining interface design, usability and reliable software engineering.',
    theme: 'light',
    visualConcept: 'desktop-interface',
    disciplines: [
      {
        id: 'web-platforms',
        letter: 'A',
        title: 'Web & Digital Platforms',
        eyebrow: 'WEB ENGINEERING // FRONTEND ARCHITECTURE',
        shortDesc:
          'We design and develop responsive websites, portals and custom web applications with strong visual identity, accessibility and maintainable architecture.',
        detailedDesc:
          'From public-facing flagship web experiences to high-utility customer portals, we engineer frontend systems that prioritize instantaneous page speed, clear semantic structure, fluid responsiveness, and maintainable TypeScript codebases.',
        capabilities: [
          'Business and marketing websites.',
          'Custom web applications.',
          'Interactive digital experiences.',
          'Admin portals and dashboards.',
          'Responsive interface development.',
        ],
        deliverables: [
          'Production Next.js / React application codebase',
          'Modular UI component library with Tailwind CSS',
          'Responsive layouts tested across mobile, tablet, & desktop',
          'SEO meta tags, OpenGraph previews & lighthouse score optimization',
        ],
        techTags: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vite'],
        inquiryDiscipline: 'Custom Web Platform',
      },
      {
        id: 'mobile-development',
        letter: 'B',
        title: 'Mobile Application Development',
        eyebrow: 'MOBILE ECOSYSTEMS // NATIVE & HYBRID',
        shortDesc:
          'We build mobile applications with intuitive interfaces, reliable backends and carefully designed application workflows.',
        detailedDesc:
          'We construct mobile experiences that respect device capabilities, battery efficiency, offline caching, and responsive touch gestures. Our unified cross-platform Flutter and React Native approaches deliver native performance with single-codebase reliability.',
        capabilities: [
          'Android applications.',
          'Cross-platform applications.',
          'Flutter development.',
          'Mobile backend integration.',
          'Push notifications and application workflows.',
          'App deployment support.',
        ],
        deliverables: [
          'Compiled release APK / AAB binaries',
          'Cross-platform Flutter / React Native project source',
          'RESTful API client with token authentication & error recovery',
          'Push notification pipeline integration',
        ],
        techTags: ['Flutter', 'React Native', 'Android SDK', 'Firebase', 'REST APIs'],
        inquiryDiscipline: 'Mobile App (iOS/Android)',
      },
      {
        id: 'product-design',
        letter: 'C',
        title: 'UI/UX & Product Design',
        eyebrow: 'INTERFACE ARCHITECTURE // USER EXPERIENCE',
        shortDesc:
          'We transform requirements into usable and visually consistent digital experiences.',
        detailedDesc:
          'We bridge analytical thinking with editorial aesthetics. By mapping user flows, defining consistent design tokens, and validating wireframes before writing code, we ensure your product looks distinctive while remaining easy to use.',
        capabilities: [
          'User journeys.',
          'Wireframes.',
          'Interface design.',
          'Design systems.',
          'Interactive prototypes.',
          'Responsive experience planning.',
        ],
        deliverables: [
          'Interactive Figma prototypes & wireframes',
          'Standardized design system (typography, palette, components)',
          'User journey maps & navigation architecture',
          'Handoff specifications with developer documentation',
        ],
        techTags: ['Figma', 'Design Systems', 'Interactive Prototypes', 'Wireframing'],
        inquiryDiscipline: 'Custom Web Platform',
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// 2. WHAT WORKING WITH QUISTER MEANS
// ---------------------------------------------------------------------------
export const WORKING_PRINCIPLES: WorkingPrinciple[] = [
  {
    number: '01',
    title: 'UNDERSTAND BEFORE BUILDING',
    description:
      'We establish the business problem, requirements and project scope before implementation. We do not jump into code without clarity on the end goal.',
  },
  {
    number: '02',
    title: 'TECHNOLOGY WITH PURPOSE',
    description:
      'We select appropriate tools and architecture according to actual product needs, rather than chasing temporary industry hype or unneeded complexity.',
  },
  {
    number: '03',
    title: 'TRANSPARENT COLLABORATION',
    description:
      'We communicate progress, decisions, milestones and important changes clearly. Clients have direct visibility into what is being built and why.',
  },
  {
    number: '04',
    title: 'QUALITY IN THE DETAILS',
    description:
      'We consider functionality, responsive behaviour, usability, security, and maintainability across every screen size and user interaction.',
  },
  {
    number: '05',
    title: 'CLEAR HANDOVER',
    description:
      'We document agreed deliverables and handover arrangements for the completed project, providing your team with complete ownership and operational clarity.',
  },
]

// ---------------------------------------------------------------------------
// 3. SERVICE-SPECIFIC FAQ
// ---------------------------------------------------------------------------
export const SERVICES_FAQS: ServiceFaqItem[] = [
  {
    number: '01',
    question: 'What types of websites and applications do you build?',
    answer:
      'We build high-performance marketing and company websites, custom web applications, SaaS dashboards, client portals, and e-commerce platforms. Every project is crafted from scratch using modern frameworks such as React, Next.js, and TypeScript, tailored to specific brand guidelines and functional needs.',
  },
  {
    number: '02',
    question: 'Can you develop both frontend and backend systems?',
    answer:
      'Yes. We provide full-stack engineering services. We develop responsive, accessible frontends as well as robust backend systems, REST APIs, database schemas (PostgreSQL, MongoDB), authentication flows, and third-party integrations in Node.js and Python.',
  },
  {
    number: '03',
    question: 'Do you develop Android and cross-platform mobile apps?',
    answer:
      'Yes. We specialize in cross-platform mobile development using Flutter and React Native, delivering native Android and iOS experiences from a unified, maintainable codebase. We also handle API synchronization, offline data handling, and app store submission support.',
  },
  {
    number: '04',
    question: 'Can you integrate AI or third-party APIs into existing products?',
    answer:
      'Yes. We frequently integrate AI capabilities (such as OpenAI, Anthropic, or custom inference endpoints) into existing applications to automate workflows, power intelligent search, or generate summaries. We also integrate payment gateways, CRMs, logistics APIs, and transactional mail services.',
  },
  {
    number: '05',
    question: 'Do you provide custom e-commerce and business platforms?',
    answer:
      'Yes. When standard e-commerce templates fall short of unique business rules, multi-tier pricing, or inventory requirements, we build tailored commerce platforms and operational portals that connect directly to your back-office systems.',
  },
  {
    number: '06',
    question: 'Can you redesign or extend an existing application?',
    answer:
      'Yes. We evaluate existing codebases and interfaces, identify architectural bottlenecks or usability limitations, and systematically modernize the user experience, improve performance, or add requested feature sets without disrupting live operations.',
  },
  {
    number: '07',
    question: 'How is the project budget determined?',
    answer:
      'Pricing is determined directly by technical scope, number of custom views, third-party integrations, and timeline requirements. We provide clear, itemized milestone estimates after our initial discovery consultation so you know exactly what is included.',
  },
  {
    number: '08',
    question: 'Do you provide post-launch maintenance?',
    answer:
      'Yes. After project delivery and handover, we offer structured maintenance and support agreements for security patches, dependency updates, server monitoring, and ongoing feature enhancements as your product grows.',
  },
]
