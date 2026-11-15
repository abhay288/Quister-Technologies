import { useEffect } from 'react'
import ServicesHero from '../components/services-page/ServicesHero'
import CapabilityChapters from '../components/services-page/CapabilityChapters'
import ServicesExpectations from '../components/services-page/ServicesExpectations'
import ServicesEngagement from '../components/services-page/ServicesEngagement'
import ServicesTechStack from '../components/services-page/ServicesTechStack'
import ServicesProcessBridge from '../components/services-page/ServicesProcessBridge'
import ServicesFaq from '../components/services-page/ServicesFaq'
import ServicesCta from '../components/services-page/ServicesCta'
import { getLenis } from '../utils/smoothScroll'

export default function ServicesPage() {
  // Ensure view starts at top on direct route entry
  useEffect(() => {
    window.scrollTo(0, 0)
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    }
  }, [])

  return (
    <main id="services-page-root" className="relative w-full">
      <ServicesHero />
      <CapabilityChapters />
      <ServicesExpectations />
      <ServicesEngagement />
      <ServicesTechStack />
      <ServicesProcessBridge />
      <ServicesFaq />
      <ServicesCta />
    </main>
  )
}
