interface PrincipleItem {
  number: string
  title: string
  description: string
}

const PRINCIPLES: PrincipleItem[] = [
  {
    number: '01',
    title: 'Engineering First',
    description:
      'Strong architecture, considered implementation and maintainable systems designed to eliminate technical debt before it begins.',
  },
  {
    number: '02',
    title: 'Design With Purpose',
    description:
      'Interfaces and interactions shaped around real user needs, combining visual distinction with seamless usability.',
  },
  {
    number: '03',
    title: 'Ownership Through Delivery',
    description:
      'Careful execution across the product lifecycle, from initial system architecture to production deployment.',
  },
]

export default function StudioPrinciples() {
  return (
    <div
      role="region"
      aria-label="Studio Engineering Principles"
      className="w-full pt-12 lg:pt-16 mt-16 lg:mt-24"
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        {PRINCIPLES.map((principle, idx) => (
          <div
            key={idx}
            className="group flex flex-col justify-start transition-colors duration-300"
          >
            {/* Minimal Index & Hairline Accent */}
            <div className="flex items-center gap-3 mb-3.5">
              <span
                className="font-mono text-xs tracking-[0.22em] font-semibold"
                style={{ color: '#D4B276' }}
              >
                {principle.number}
              </span>
              <div
                className="w-8 h-[1px] transition-all duration-300 origin-left"
                style={{
                  backgroundColor: '#D4B276',
                  opacity: 0.35,
                }}
              />
            </div>

            {/* Principle Title */}
            <h3
              className="font-display text-xl sm:text-2xl text-[#FAF7F0] font-normal tracking-tight mb-2.5 transition-colors duration-300 group-hover:text-white"
            >
              {principle.title}
            </h3>

            {/* Principle Description */}
            <p
              className="font-sans text-[13.5px] leading-relaxed font-light"
              style={{
                color: 'rgba(245, 240, 232, 0.62)',
              }}
            >
              {principle.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

