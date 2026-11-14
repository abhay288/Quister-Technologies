import anujImg from '../../assets/projects/anuj.jpg'
import kanhaiyaImg from '../../assets/projects/kanhaiya.jpg'
import ecointelImg from '../../assets/projects/ecointel.jpg'

export interface FeaturedProject {
  id: string
  number: string
  name: string
  category: string
  domain: string
  clientLocation: string
  clientVerdict: string
  liveUrl?: string
  isApp?: boolean
  tagline: string
  description: string
  challenge: string
  architecture: string
  tags: string[]
  status: string
  statusType: 'live' | 'progress' | 'concept'
  year: string
  themeColor: string
  accentColor: string
  image: string
}

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: 'b2b-ecommerce-platform',
    number: '01',
    name: 'B2B E-COMMERCE PLATFORM',
    category: 'B2B Distribution Platform',
    domain: 'B2B Wholesale & Supply Chain',
    clientLocation: 'Regional Distribution Hub',
    clientVerdict: 'Production wholesale commerce platform delivered with sub-second catalog velocity.',
    tagline: 'High-throughput wholesale B2B commerce with dynamic tier pricing & automated GST billing.',
    description:
      'A full-scale B2B e-commerce platform engineered for wholesale distribution operations, featuring rapid bulk-order workflows, role-based multi-tier pricing, real-time inventory ledgering, and instant digital GST invoicing.',
    challenge:
      'Replacing manual wholesale order logs with a sub-second transactional portal handling thousands of SKU price adjustments across regional wholesale distribution centers.',
    architecture:
      'React frontend with dense high-velocity catalog grids, Node REST API services, PostgreSQL with ACID concurrency controls for stock preservation, and automated PDF invoice generation pipelines.',
    tags: ['B2B E-Commerce', 'Wholesale Engine', 'React', 'PostgreSQL', 'Digital Invoicing', 'REST APIs'],
    status: 'DELIVERED & IN PRODUCTION',
    statusType: 'live',
    year: '2024',
    themeColor: '#1A140B',
    accentColor: '#D4B276',
    image: anujImg,
  },
  {
    id: 'retail-commerce-application',
    number: '02',
    name: 'RETAIL COMMERCE APPLICATION',
    category: 'Retail Commerce Application',
    domain: 'Hyperlocal Commerce & Retail App',
    clientLocation: 'Multi-Store Deployment',
    clientVerdict: 'Native Android application and storefront ecosystem delivered for active retail operations.',
    isApp: true,
    tagline: 'Hyperlocal retail ecosystem available on Google Play Store and modern web.',
    description:
      'A complete dual-channel local commerce platform comprising an Android mobile app published on Google Play Store and an intuitive web storefront for neighborhood retail, instant ordering, and local credit ledgers.',
    challenge:
      'Designing an ultra-responsive, lightweight interface allowing non-technical store operators and neighborhood shoppers to complete orders in 3 taps even under intermittent connectivity.',
    architecture:
      'Flutter Android application deployed to Google Play Store, synchronized with real-time web portal, Firebase Cloud messaging for instant order rings, and offline-first SQLite sync.',
    tags: ['Android App', 'Google Play Store', 'Flutter Native', 'Web Portal', 'Firebase', 'Local Commerce'],
    status: 'ACTIVE DEPLOYMENT',
    statusType: 'progress',
    year: '2024',
    themeColor: '#18120C',
    accentColor: '#F59E0B',
    image: kanhaiyaImg,
  },
  {
    id: 'ai-circularity-platform',
    number: '03',
    name: 'AI CIRCULARITY PLATFORM',
    category: 'AI Circular Electronics Platform',
    domain: 'AI Hardware Lifecycle & Circularity R&D',
    clientLocation: 'Advanced Hardware R&D',
    clientVerdict: 'Automated circuit component lifecycle telemetry & computer vision diagnostics.',
    tagline: 'Intelligent diagnostic AI platform evaluating electronic components and circular reuse yield.',
    description:
      'An avant-garde circular electronics intelligence system using computer vision and edge board telemetry to inspect printed circuit boards, evaluate salvageable silicon semiconductors, and optimize recycled hardware lifecycle pipelines.',
    challenge:
      'Automating complex PCB component degradation inspection with microsecond computer vision inference and real-time scrap reduction forecasting.',
    architecture:
      'WebGL 3D circuit board visualizer, PyTorch edge inference microservices, FastAPI event stream, and real-time telemetry dashboard for semiconductor yield tracking.',
    tags: ['AI Circularity', 'Computer Vision', 'Circuit Telemetry', 'WebGL', 'FastAPI', 'PyTorch'],
    status: 'R&D / PRODUCTION PILOT',
    statusType: 'concept',
    year: '2024',
    themeColor: '#0A141A',
    accentColor: '#38BDF8',
    image: ecointelImg,
  },
]
