import { ENGAGEMENT_PILLARS } from './servicesData'

export default function ServicesEngagement() {
  return (
    <section
      id="services-engagement"
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
              ENGAGEMENT // HOW WE OPERATE
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
            A clearer way to
            <br />
            <span className="italic font-normal" style={{ color: '#7A5C2E' }}>
              build together.
            </span>
          </h2>

          <p
            className="font-sans text-base sm:text-lg leading-relaxed font-light"
            style={{ color: 'rgba(20, 20, 26, 0.74)' }}
          >
            We structure client partnerships around clarity, mutual respect, and defined deliverables.
            No ambiguous meters, no surprise invoices, and no opaque codebases.
          </p>
        </div>

        {/* 5 Engagement Pillars List / Horizontal Cards */}
        <div className="space-y-4 sm:space-y-5">
          {ENGAGEMENT_PILLARS.map((pillar) => (
            <div
              key={pillar.number}
              className="p-6 sm:p-8 rounded-xl transition-all duration-300 group flex flex-col md:flex-row md:items-center justify-between gap-6"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 4px 18px rgba(0, 0, 0, 0.03)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(122, 92, 46, 0.4)'
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.06)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)'
                e.currentTarget.style.boxShadow = '0 4px 18px rgba(0, 0, 0, 0.03)'
              }}
            >
              {/* Left Column: Number & Title */}
              <div className="flex items-start sm:items-center gap-5 md:w-1/3">
                <span
                  className="font-mono text-xs sm:text-sm font-semibold px-2.5 py-1 rounded"
                  style={{
                    backgroundColor: 'rgba(122, 92, 46, 0.1)',
                    color: '#7A5C2E',
                  }}
                >
                  {pillar.number}
                </span>
                <h3 className="font-mono text-sm sm:text-base uppercase tracking-wider font-semibold text-[#14141A]">
                  {pillar.title}
                </h3>
              </div>

              {/* Middle Column: Short Summary */}
              <div className="md:w-1/3">
                <p
                  className="font-sans text-sm sm:text-[14.5px] font-normal leading-relaxed"
                  style={{ color: 'rgba(20, 20, 26, 0.88)' }}
                >
                  {pillar.description}
                </p>
              </div>

              {/* Right Column: In-depth Detail */}
              <div className="md:w-1/3 md:pl-4 border-t md:border-t-0 md:border-l pt-3 md:pt-0"
                style={{ borderColor: 'rgba(0, 0, 0, 0.08)' }}
              >
                <p
                  className="font-sans text-xs sm:text-[13.5px] font-light leading-relaxed"
                  style={{ color: 'rgba(20, 20, 26, 0.65)' }}
                >
                  {pillar.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
