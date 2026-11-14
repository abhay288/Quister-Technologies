import AboutHeroSection from '../components/about-page/AboutHeroSection'
import StudioStorySection from '../components/about-page/StudioStorySection'
import OperatingPrinciplesSection from '../components/about-page/OperatingPrinciplesSection'
import TechnologyExpertiseSection from '../components/about-page/TechnologyExpertiseSection'
import OurTeamSection from '../components/about-page/OurTeamSection'
import AboutFaqSection from '../components/about-page/AboutFaqSection'
import AboutConversionSection from '../components/about-page/AboutConversionSection'

export default function AboutPage() {
  return (
    <main>
      <AboutHeroSection />
      <StudioStorySection />
      <OperatingPrinciplesSection />
      <TechnologyExpertiseSection />
      <OurTeamSection />
      <AboutFaqSection />
      <AboutConversionSection />
    </main>
  )
}
