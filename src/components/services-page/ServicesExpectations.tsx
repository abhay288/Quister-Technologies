import { WORKING_PRINCIPLES } from './servicesData'

export default function ServicesExpectations() {
  return (
    <section
      id="services-principles"
      data-scroll-section
      className="relative w-full py-20 sm:py-28 lg:py-32 overflow-hidden"
      style={{
        backgroundColor: '#09090E',
        color: '#F8F5EE',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(201, 164, 102, 0.06) 0%, transparent 70%)',
        }}
      />

      <div className="container-wide relative z-10">
        {/* Section Header */}
        <div className="mb-14 sm:mb-18 lg:mb-20 max-w-3xl">
          <div className="flex items-center gap-3 mb-5">
            <span
              className="font-mono text-xs tracking-[0.24em] uppercase font-semibold"
              style={{ color: '#D4B276' }}
            >
              WORKING WITH US // PRINCIPLES
            </span>
            <div
              className="w-10 h-[1px]"
              style={{ backgroundColor: '#D4B276', opacity: 0.4 }}
            />
          </div>

          <h2
            className="font-display font-light leading-[1.08] tracking-tight mb-5"
            style={{ fontSize: 'clamp(2.3rem, 4.2vw, 3.6rem)' }}
          >
            Disciplined engineering.
            <br />
            <span
              className="italic font-normal"
              style={{
                background: 'linear-gradient(135deg, #F3E0B5 0%, #D4B276 50%, #9A7A4A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Predictable delivery.
            </span>
          </h2>

          <p
            className="font-sans text-base sm:text-lg leading-relaxed font-light"
            style={{ color: 'rgba(248, 245, 238, 0.72)' }}
          >
            We approach digital engineering as an exacting discipline. Our operating principles
            ensure that every system we deliver is founded on clarity, technical integrity, and
            unambiguous accountability.
          </p>
        </div>

        {/* 5 Working Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {WORKING_PRINCIPLES.map((principle, idx) => (
            <div
              key={principle.number}
              className={`p-7 sm:p-8 rounded-xl transition-all duration-300 relative group flex flex-col justify-between ${
                idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 178, 118, 0.35)'
                e.currentTarget.style.backgroundColor = 'rgba(212, 178, 118, 0.03)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)'
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'
              }}
            >
              <div>
                {/* Number & Hairline */}
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="font-mono text-xs tracking-[0.2em] font-semibold"
                    style={{ color: '#D4B276' }}
                  >
                    {principle.number}
                  </span>
                  <div
                    className="w-8 h-[1px]"
                    style={{ backgroundColor: '#D4B276', opacity: 0.35 }}
                  />
                </div>

                {/* Principle Title */}
                <h3 className="font-mono text-sm uppercase tracking-wider font-semibold text-[#F8F5EE] mb-3.5 group-hover:text-[#ECC87A] transition-colors duration-200">
                  {principle.title}
                </h3>

                {/* Principle Description */}
                <p
                  className="font-sans text-sm sm:text-[14.5px] leading-relaxed font-light"
                  style={{ color: 'rgba(248, 245, 238, 0.65)' }}
                >
                  {principle.description}
                </p>
              </div>

              {/* Bottom Subtle Corner Accent */}
              <div
                className="mt-6 pt-4 border-t flex items-center justify-between text-[10px] font-mono tracking-widest text-stone-500 uppercase"
                style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                <span>STANDARD</span>
                <span className="text-[#D4B276] opacity-60">VERIFIED</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
