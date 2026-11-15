import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { SERVICES_FAQS } from './servicesData'

export default function ServicesFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleIndex = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section
      id="services-faq"
      data-scroll-section
      className="relative w-full py-20 sm:py-28 lg:py-32"
      style={{
        backgroundColor: '#F8F5EE',
        color: '#14141A',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
      }}
    >
      <div className="container-wide relative z-10">
        {/* Section Header */}
        <div className="mb-14 sm:mb-18 lg:mb-20 max-w-3xl">
          <div className="flex items-center gap-3 mb-5">
            <span
              className="font-mono text-xs tracking-[0.24em] uppercase font-semibold"
              style={{ color: '#7A5C2E' }}
            >
              QUESTIONS // CLARIFICATIONS
            </span>
            <div
              className="w-10 h-[1px]"
              style={{ backgroundColor: '#7A5C2E', opacity: 0.35 }}
            />
          </div>

          <h2
            className="font-display font-light leading-[1.08] tracking-tight mb-5"
            style={{ fontSize: 'clamp(2.3rem, 4.2vw, 3.6rem)' }}
          >
            Common questions regarding
            <br />
            <span className="italic font-normal" style={{ color: '#7A5C2E' }}>
              our capabilities.
            </span>
          </h2>

          <p
            className="font-sans text-base sm:text-lg leading-relaxed font-light"
            style={{ color: 'rgba(20, 20, 26, 0.74)' }}
          >
            Direct answers to frequent inquiries about technical capabilities, collaboration structures,
            and engineering delivery.
          </p>
        </div>

        {/* 8 Accordion Items */}
        <div className="max-w-4xl divide-y border-y"
          style={{ borderColor: 'rgba(0, 0, 0, 0.08)' }}
        >
          {SERVICES_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={faq.number}
                className="py-6 sm:py-7 transition-colors duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="w-full text-left flex items-start justify-between gap-5 group"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-baseline gap-4 sm:gap-6">
                    <span
                      className="font-mono text-xs sm:text-sm font-semibold tracking-wider"
                      style={{ color: '#7A5C2E' }}
                    >
                      {faq.number}
                    </span>
                    <h3 className="font-display text-lg sm:text-xl font-normal tracking-tight text-[#14141A] group-hover:text-[#7A5C2E] transition-colors duration-200">
                      {faq.question}
                    </h3>
                  </div>

                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                    style={{
                      backgroundColor: isOpen
                        ? 'rgba(122, 92, 46, 0.12)'
                        : 'rgba(0, 0, 0, 0.04)',
                      color: isOpen ? '#7A5C2E' : '#14141A',
                    }}
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {/* Collapsible Answer */}
                {isOpen && (
                  <div className="pt-4 pl-8 sm:pl-12 pr-4 transition-all duration-300">
                    <p
                      className="font-sans text-sm sm:text-base font-light leading-relaxed"
                      style={{ color: 'rgba(20, 20, 26, 0.72)', lineHeight: 1.75 }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
