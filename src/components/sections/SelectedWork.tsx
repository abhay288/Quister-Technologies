import { useState, useRef } from 'react'
import WorkOverviewShowcase from './portfolio/WorkOverviewShowcase'
import LenisArchiveModal from './portfolio/LenisArchiveModal'
import { getLenis } from '../../utils/smoothScroll'

export default function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState<boolean>(false)

  const handleOpenModal = () => {
    setIsArchiveModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsArchiveModalOpen(false)
  }

  const handleFinishAndContinue = () => {
    setIsArchiveModalOpen(false)
    setTimeout(() => {
      const lenis = getLenis()
      if (lenis) {
        lenis.scrollTo('#about', { duration: 1.2, offset: 0 })
      } else {
        const aboutEl = document.getElementById('about')
        aboutEl?.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  return (
    <section
      id="work"
      ref={sectionRef}
      aria-label="Quister Technologies — Selected Work"
      style={{
        background: '#050508',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* =====================================================================
          SELECTED WORK OVERVIEW & 3D JELLYFISH COMPANION
          - 3D Real-time Golden Jellyfish with tentacles & suspended droplets
          - Continuous CSS moving screenshot lanes with authentic platform visuals
          - Grand editorial typography: "PROVEN Production." (shifted up)
          - 4-column balanced verified statistics (shifted up)
          - 3D Golden Jellyfish companion (shifted lower down)
          - Interactive 3D Project Gateway Button that opens the Popup Archive
          ===================================================================== */}
      <WorkOverviewShowcase onExploreProjects={handleOpenModal} />

      {/* =====================================================================
          POPUP MODAL: 3D SCROLL-TRIGGERED LENIS CARD ARCHIVE
          - Opens exclusively on popup when clicking "EXPLORE OUR PROJECTS"
          - Minimized, elegant editorial card layout (zero clutter)
          - 3D scroll-triggered card animation with perspective tilt & depth
          - Moving animated hand gesture guide inspired by lenis.dev
          - Keyboard ESC & directional arrow navigation
          - Seamless exit on final scroll to continue down the website
          ===================================================================== */}
      <LenisArchiveModal
        isOpen={isArchiveModalOpen}
        onClose={handleCloseModal}
        onContinueWebsite={handleFinishAndContinue}
      />
    </section>
  )
}
