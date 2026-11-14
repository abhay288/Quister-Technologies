export interface ProjectInquiryFormState {
  disciplines: string[]
  timeline: string
  budget: string
  specialRequirements: string
  fullName: string
  email: string
  company: string
  phone: string
}

export interface FormErrors {
  disciplines?: string
  timeline?: string
  fullName?: string
  email?: string
  phone?: string
  general?: string
}

export const DISCIPLINE_OPTIONS = [
  'Custom Web Platform',
  'Mobile App (iOS/Android)',
  'Enterprise B2B System',
  'Scalable E-commerce',
  'AI Integration & Agents',
  'Architecture Advisory',
] as const

export const TIMELINE_OPTIONS = [
  'Less than 1 month (Sprint)',
  '1–3 Months',
  '3–6 Months',
  'Ongoing Technical Partner',
] as const

export const BUDGET_OPTIONS = [
  'Under ₹25,000',
  '₹25,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  '₹1,00,000 – ₹3,00,000',
  '₹3,00,000 – ₹5,00,000',
  'Above ₹5,00,000',
  'Not sure yet — Need guidance',
] as const

export const INITIAL_FORM_STATE: ProjectInquiryFormState = {
  disciplines: ['Custom Web Platform'],
  timeline: '1–3 Months',
  budget: '',
  specialRequirements: '',
  fullName: '',
  email: '',
  company: '',
  phone: '',
}

/**
 * Generates a clean, plain-text formatted project brief.
 * Omits empty optional fields as per specification.
 */
export function formatProjectBriefText(form: ProjectInquiryFormState): string {
  const lines: string[] = [
    '======================================================',
    'QUISTER TECHNOLOGIES — PROJECT INQUIRY & DISCOVERY BRIEF',
    '======================================================',
    '',
    '01 // CLIENT INFORMATION',
    `• Full Name: ${form.fullName.trim()}`,
    `• Work Email: ${form.email.trim()}`,
  ]

  if (form.company.trim()) {
    lines.push(`• Company / Brand: ${form.company.trim()}`)
  }

  if (form.phone.trim()) {
    lines.push(`• WhatsApp / Phone: ${form.phone.trim()}`)
  }

  lines.push(
    '',
    '02 // PROJECT SCOPE',
    `• Project Discipline(s): ${form.disciplines.join(', ')}`,
    `• Target Timeline: ${form.timeline}`
  )

  if (form.budget.trim()) {
    lines.push(`• Estimated Budget: ${form.budget.trim()}`)
  }

  if (form.specialRequirements.trim()) {
    lines.push(
      '',
      '03 // SPECIAL REQUIREMENTS & CUSTOMISATION',
      form.specialRequirements.trim()
    )
  }

  lines.push(
    '',
    '======================================================',
    'Submitted via quistertech.com Project Discovery Console'
  )

  return lines.join('\n')
}

/**
 * Builds the mailto: URL with prefilled subject and formatted body.
 */
export function buildMailtoUrl(form: ProjectInquiryFormState): string {
  const disciplineSummary =
    form.disciplines.length > 0 ? form.disciplines.join(' & ') : 'Digital System'
  const subject = `Project Inquiry — ${disciplineSummary} [${form.fullName.trim() || 'Client'}]`
  const body = formatProjectBriefText(form)

  return `mailto:hello@quistertech.com?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`
}

