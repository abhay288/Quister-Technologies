import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mail, MapPin } from 'lucide-react'
import ProjectInquiryForm from './contact/ProjectInquiryForm'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.from(contentRef.current.children, {
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
          },
          y: 40,
          opacity: 0,
          duration: 1.0,
          stagger: 0.12,
          ease: 'power3.out',
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-heading"
      style={{
        background: '#0B0C10',
        padding: 'clamp(6rem, 14vw, 12rem) 0',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* Background radial atmosphere */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(500px, 70vw, 900px)',
          height: 'clamp(500px, 70vw, 900px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201, 169, 110, 0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container-wide" ref={contentRef} style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
          {/* Section Eyebrow Label */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'var(--color-champagne)',
              }}
            >
              05 // INITIATE COLLABORATION
            </span>
          </div>

          {/* Heading */}
          <h2
            id="contact-heading"
            className="heading-section"
            style={{
              color: 'var(--color-ivory)',
              marginBottom: '1.5rem',
              fontSize: 'clamp(2.5rem, 5vw, 4.8rem)',
            }}
          >
            Let&apos;s Engineer Something{' '}
            <span className="text-gradient-gold" style={{ fontStyle: 'italic' }}>
              Remarkable.
            </span>
          </h2>

          <p
            className="body-text"
            style={{
              maxWidth: '580px',
              margin: '0 auto 3rem',
              fontSize: '1.0625rem',
              color: 'rgba(245, 240, 232, 0.72)',
            }}
          >
            Whether embarking on a greenfield venture or modernizing an enterprise system,
            we welcome challenging technical problems.
          </p>

          {/* Project Discovery & Inquiry Form Console */}
          <ProjectInquiryForm />

          {/* Operational Verification Row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2.5rem',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: '2.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <MapPin size={14} color="var(--color-champagne)" strokeWidth={1.5} />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,240,232,0.45)',
                }}
              >
                INDIA // GLOBAL DEPLOYMENT
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <Mail size={14} color="var(--color-champagne)" strokeWidth={1.5} />
              <a
                href="mailto:hello@quistertech.com"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--color-champagne)',
                  textDecoration: 'none',
                }}
              >
                hello@quistertech.com
              </a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#5EC96E',
                  boxShadow: '0 0 8px #5EC96E',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,240,232,0.45)',
                }}
              >
                ACCEPTING Q4–Q1 ENGAGEMENTS
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
