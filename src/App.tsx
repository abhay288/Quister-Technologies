import { useEffect } from 'react'
import 'lenis/dist/lenis.css'
import { initSmoothScroll } from './utils/smoothScroll'
import { useAppRoute } from './utils/router'
import Navigation from './components/navigation/Navigation'
import HeroSection from './components/hero/HeroSection'
import SelectedWork from './components/sections/SelectedWork'
import About from './components/sections/About'
import Process from './components/sections/Process'
import Contact from './components/sections/Contact'
import Footer from './components/layout/Footer'
import CustomCursor from './components/common/CustomCursor'
import ScrollHUD from './components/common/ScrollHUD'
import GlobalPageTransition from './components/common/GlobalPageTransition'
import AboutPage from './pages/AboutPage'

function App() {
  const currentRoute = useAppRoute()

  useEffect(() => {
    // Initialize unified Lenis smooth scroll engine
    const cleanup = initSmoothScroll()
    return () => cleanup()
  }, [])

  return (
    <div className="relative selection:bg-champagne selection:text-black">
      {/* Precision Scroll Progress & Telemetry HUD */}
      <ScrollHUD currentRoute={currentRoute} />

      {/* Interactive agency custom cursor */}
      <CustomCursor />

      {/* Subtle organic noise texture overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Global Page Transition Loader across genuine SPA routes */}
      <GlobalPageTransition />

      {/* Sticky Top Header Navigation */}
      <Navigation currentRoute={currentRoute} />

      {/* Route View */}
      {currentRoute === '/about' ? (
        <AboutPage />
      ) : (
        <main>
          <HeroSection />
          <SelectedWork />
          <About />
          <Process />
          <Contact />
        </main>
      )}

      {/* Studio Footer */}
      <Footer />
    </div>
  )
}

export default App
