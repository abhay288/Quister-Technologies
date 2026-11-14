import { ArrowUpRight } from 'lucide-react'
import { navigateTo } from '../../utils/router'

export default function AboutConversionSection() {
  return (
    <section
      id="about-cta"
      data-scroll-section="COLLABORATE"
      aria-labelledby="about-cta-heading"
      style={{
        background: '#F3EFE8',
        color: '#101016',
        padding: 'clamp(4.5rem, 8vw, 7rem) 0',
        borderTop: '1px solid rgba(16, 16, 22, 0.08)',
      }}
    >
      <div className="container-wide">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <span
            className="mb-5"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              color: '#8B6B35',
              fontWeight: 600,
            }}
          >
            HAVE SOMETHING MEANINGFUL TO BUILD?
          </span>

          <h2
            id="about-cta-heading"
            className="mb-6"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.8rem, 6vw, 5.4rem)',
              fontWeight: 400,
              lineHeight: 1.03,
              letterSpacing: '-0.015em',
              color: '#101016',
            }}
          >
            Let&rsquo;s build something{' '}
            <span className="italic" style={{ color: '#8B6B35' }}>
              remarkable.
            </span>
          </h2>

          <p
            className="max-w-2xl mb-10"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(1rem, 1.15vw, 1.125rem)',
              lineHeight: 1.78,
              color: 'rgba(16, 16, 22, 0.72)',
              fontWeight: 400,
            }}
          >
            If you are planning a new digital product, re-architecting an existing platform or
            exploring an ambitious interactive experience, we would welcome a conversation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/#contact"
              onClick={(e) => {
                e.preventDefault()
                navigateTo('/', '#contact')
              }}
              className="btn-primary rounded-full"
              style={{
                backgroundColor: '#101016',
                color: '#F8F5EF',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                padding: '0.95rem 2.3rem',
                boxShadow: '0 14px 35px -12px rgba(16, 16, 22, 0.45)',
              }}
            >
              <span>START A PROJECT</span>
              <ArrowUpRight size={15} strokeWidth={1.8} />
            </a>

            <a
              href="/#work"
              onClick={(e) => {
                e.preventDefault()
                navigateTo('/', '#work')
              }}
              className="btn-secondary rounded-full"
              style={{
                borderColor: 'rgba(16, 16, 22, 0.28)',
                color: '#101016',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                padding: '0.95rem 2.2rem',
              }}
            >
              <span>EXPLORE OUR WORK</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

