import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ABOUT_FAQS } from './aboutPageData'

export default function AboutFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleIndex = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx))
  }

  return (
    <section
      id="about-faq"
      data-scroll-section="FAQ"
      aria-labelledby="about-faq-heading"
      style={{
        background: '#09090E',
        color: '#F3EFE8',
        padding: 'clamp(4.5rem, 8vw, 7rem) 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Header */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: '#C9A466',
                  fontWeight: 600,
                }}
              >
                05 // QUESTIONS
              </span>
              <span aria-hidden="true" style={{ width: '36px', height: '1px', background: '#C9A466', opacity: 0.45 }} />
            </div>

            <h2
              id="about-faq-heading"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.35rem, 4vw, 3.8rem)',
                fontWeight: 400,
                lineHeight: 1.06,
                letterSpacing: '-0.015em',
                color: '#F8F5EF',
              }}
            >
              Common{' '}
              <span className="italic" style={{ color: '#D9B978' }}>
                questions.
              </span>
            </h2>
          </div>

          {/* Right Accessible 5-Item Accordion */}
          <div className="lg:col-span-8">
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              {ABOUT_FAQS.map((item, idx) => {
                const isOpen = openIndex === idx
                const triggerId = `about-faq-trigger-${idx}`
                const panelId = `about-faq-panel-${idx}`

                return (
                  <div
                    key={item.number}
                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
                  >
                    <button
                      id={triggerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleIndex(idx)}
                      className="w-full py-5 sm:py-6 text-left flex items-center justify-between gap-6 cursor-pointer"
                      style={{ background: 'transparent', border: 'none' }}
                    >
                      <div className="flex items-baseline gap-4 sm:gap-5">
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.6875rem',
                            letterSpacing: '0.18em',
                            color: isOpen ? '#D9B978' : 'rgba(243, 239, 232, 0.4)',
                            flexShrink: 0,
                          }}
                        >
                          {item.number}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(1.25rem, 2vw, 1.65rem)',
                            fontWeight: 400,
                            lineHeight: 1.25,
                            color: isOpen ? '#F8F5EF' : 'rgba(243, 239, 232, 0.85)',
                          }}
                        >
                          {item.question}
                        </span>
                      </div>

                      <span
                        aria-hidden="true"
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300"
                        style={{
                          border: isOpen
                            ? '1px solid rgba(217, 185, 120, 0.65)'
                            : '1px solid rgba(255, 255, 255, 0.16)',
                          color: isOpen ? '#D9B978' : 'rgba(243, 239, 232, 0.68)',
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      >
                        <ChevronDown size={15} strokeWidth={1.75} />
                      </span>
                    </button>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      hidden={!isOpen}
                      className="pb-6 pl-9 sm:pl-12 pr-4"
                    >
                      <p
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.94rem',
                          lineHeight: 1.72,
                          color: 'rgba(243, 239, 232, 0.72)',
                          fontWeight: 300,
                          maxWidth: '64ch',
                        }}
                      >
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
