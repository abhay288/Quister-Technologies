import React, { useState, useRef } from 'react'
import {
  ArrowRight,
  Copy,
  Check,
  CheckCircle2,
  Edit3,
  Mail,
  Send,
  AlertCircle,
  Sparkles,
  RotateCcw,
} from 'lucide-react'
import {
  DISCIPLINE_OPTIONS,
  TIMELINE_OPTIONS,
  BUDGET_OPTIONS,
  INITIAL_FORM_STATE,
  ProjectInquiryFormState,
  FormErrors,
  buildMailtoUrl,
  formatProjectBriefText,
} from './contactData'

const QUICK_FEATURE_SUGGESTIONS = [
  'Payment Gateway (Razorpay/Stripe)',
  'Custom Admin Dashboard',
  'Third-Party API Integration',
  'AI Agent / Automation',
  'Real-Time Telemetry & Sync',
  'High-Concurrency Architecture',
]

export default function ProjectInquiryForm() {
  const [form, setForm] = useState<ProjectInquiryFormState>(INITIAL_FORM_STATE)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [isCopiedEmail, setIsCopiedEmail] = useState<boolean>(false)
  const [isCopiedBrief, setIsCopiedBrief] = useState<boolean>(false)
  const [activeReviewMode, setActiveReviewMode] = useState<boolean>(false)

  const nameInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const requirementsInputRef = useRef<HTMLTextAreaElement>(null)
  const formTopRef = useRef<HTMLFormElement>(null)

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------
  const toggleDiscipline = (discipline: string) => {
    setForm((prev) => {
      const exists = prev.disciplines.includes(discipline)
      let next: string[]
      if (exists) {
        next = prev.disciplines.filter((d) => d !== discipline)
      } else {
        next = [...prev.disciplines, discipline]
      }
      return { ...prev, disciplines: next }
    })
    if (errors.disciplines) {
      setErrors((prev) => ({ ...prev, disciplines: undefined }))
    }
  }

  const setTimeline = (timeline: string) => {
    setForm((prev) => ({ ...prev, timeline }))
    if (errors.timeline) {
      setErrors((prev) => ({ ...prev, timeline: undefined }))
    }
  }

  const toggleBudget = (budget: string) => {
    setForm((prev) => ({
      ...prev,
      budget: prev.budget === budget ? '' : budget,
    }))
  }

  const handleTextChange = (
    field: keyof ProjectInquiryFormState,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleAddFeatureTag = (tag: string) => {
    setForm((prev) => {
      const current = prev.specialRequirements.trim()
      if (current.includes(tag)) return prev
      const updated = current ? `${current}\n• ${tag}` : `• ${tag}`
      return { ...prev, specialRequirements: updated.slice(0, 2000) }
    })
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('hello@quistertech.com')
    setIsCopiedEmail(true)
    setTimeout(() => setIsCopiedEmail(false), 2600)
  }

  const handleCopyBrief = () => {
    const briefText = formatProjectBriefText(form)
    navigator.clipboard.writeText(briefText)
    setIsCopiedBrief(true)
    setTimeout(() => setIsCopiedBrief(false), 2600)
  }

  // -------------------------------------------------------------------------
  // Validation
  // -------------------------------------------------------------------------
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (form.disciplines.length === 0) {
      newErrors.disciplines = 'Please select at least one project discipline.'
    }

    if (!form.timeline) {
      newErrors.timeline = 'Please select your target timeline.'
    }

    if (!form.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.'
    }

    if (!form.email.trim()) {
      newErrors.email = 'Work Email is required.'
    } else {
      // Standard email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(form.email.trim())) {
        newErrors.email = 'Please provide a valid email address.'
      }
    }

    // Optional phone validation (international friendly)
    if (form.phone.trim()) {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,16}$/
      if (!phoneRegex.test(form.phone.trim())) {
        newErrors.phone = 'Please provide a valid phone number or leave blank.'
      }
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      // Focus on the first invalid field
      if (newErrors.disciplines || newErrors.timeline) {
        formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else if (newErrors.fullName) {
        nameInputRef.current?.focus()
      } else if (newErrors.email) {
        emailInputRef.current?.focus()
      }
      return false
    }

    return true
  }

  // -------------------------------------------------------------------------
  // Submission
  // -------------------------------------------------------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // 1. Prepare formatted project brief
    const mailtoUrl = buildMailtoUrl(form)
    const briefText = formatProjectBriefText(form)

    // 2. Write to clipboard as a reliable fallback
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(briefText)
      }
    } catch {
      // Non-blocking clipboard fallback
    }

    // 3. Trigger email client draft
    window.location.href = mailtoUrl

    // 4. Set state to confirmed view
    setIsSubmitted(true)
  }

  // -------------------------------------------------------------------------
  // 1. CONFIRMATION VIEW (Post-Submission)
  // -------------------------------------------------------------------------
  if (isSubmitted) {
    return (
      <div
        className="w-full text-left"
        style={{
          background: 'rgba(16, 18, 24, 0.85)',
          border: '1px solid rgba(215, 179, 106, 0.35)',
          backdropFilter: 'blur(20px)',
          padding: 'clamp(2rem, 5vw, 3.5rem)',
          boxShadow: '0 24px 64px -12px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(215, 179, 106, 0.15)',
              border: '1px solid #D7B36A',
            }}
          >
            <CheckCircle2 size={24} color="#D7B36A" />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#D7B36A',
              }}
            >
              DISCOVERY BRIEF DISPATCHED
            </span>
            <h3
              className="font-display text-2xl sm:text-3xl font-light text-[#FAF7F0]"
              style={{ marginTop: '0.25rem' }}
            >
              Inquiry Blueprint Generated
            </h3>
          </div>
        </div>

        {/* Required Success Message verbatim */}
        <div
          className="p-5 mb-8"
          style={{
            background: 'rgba(215, 179, 106, 0.05)',
            borderLeft: '3px solid #D7B36A',
          }}
        >
          <p
            className="text-base sm:text-lg leading-relaxed text-[#FAF7F0]"
            style={{ fontWeight: 350 }}
          >
            &ldquo;Thank you for considering QUISTER TECHNOLOGIES. Your project brief is ready.
            We&apos;ll review your requirements and discuss the next steps with you.&rdquo;
          </p>
        </div>

        {/* Submitted Brief Summary Snapshot */}
        <div
          className="p-5 mb-8"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#D7B36A',
              }}
            >
              SUMMARY OF PREPARED BRIEF
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                color: 'rgba(245, 240, 232, 0.45)',
              }}
            >
              DELIVERY: HELLO@QUISTERTECH.COM
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#FAF7F0]">
            <div>
              <span className="block text-xs uppercase tracking-wider text-[#D7B36A] font-mono mb-1">
                Client Name
              </span>
              <p className="font-sans font-light">{form.fullName}</p>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-wider text-[#D7B36A] font-mono mb-1">
                Work Email
              </span>
              <p className="font-sans font-light">{form.email}</p>
            </div>
            {form.company.trim() && (
              <div>
                <span className="block text-xs uppercase tracking-wider text-[#D7B36A] font-mono mb-1">
                  Company / Brand
                </span>
                <p className="font-sans font-light">{form.company}</p>
              </div>
            )}
            {form.phone.trim() && (
              <div>
                <span className="block text-xs uppercase tracking-wider text-[#D7B36A] font-mono mb-1">
                  WhatsApp / Phone
                </span>
                <p className="font-sans font-light">{form.phone}</p>
              </div>
            )}
            <div>
              <span className="block text-xs uppercase tracking-wider text-[#D7B36A] font-mono mb-1">
                Disciplines
              </span>
              <p className="font-sans font-light">{form.disciplines.join(', ')}</p>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-wider text-[#D7B36A] font-mono mb-1">
                Target Timeline
              </span>
              <p className="font-sans font-light">{form.timeline}</p>
            </div>
            {form.budget.trim() && (
              <div>
                <span className="block text-xs uppercase tracking-wider text-[#D7B36A] font-mono mb-1">
                  Estimated Budget
                </span>
                <p className="font-sans font-light">{form.budget}</p>
              </div>
            )}
          </div>

          {form.specialRequirements.trim() && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <span className="block text-xs uppercase tracking-wider text-[#D7B36A] font-mono mb-1">
                Special Requirements &amp; Customisation
              </span>
              <p className="font-sans font-light text-sm whitespace-pre-line text-white/80">
                {form.specialRequirements}
              </p>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href={buildMailtoUrl(form)}
            className="btn-primary text-xs"
            style={{ padding: '0.75rem 1.75rem' }}
          >
            <Mail size={15} strokeWidth={1.5} />
            <span>Launch Email Client (hello@quistertech.com)</span>
            <ArrowRight size={14} strokeWidth={1.5} />
          </a>

          <button
            type="button"
            onClick={handleCopyBrief}
            className="btn-secondary text-xs"
            style={{ padding: '0.75rem 1.5rem' }}
          >
            {isCopiedBrief ? <Check size={14} color="#55D88A" /> : <Copy size={14} />}
            <span>{isCopiedBrief ? 'Brief Copied to Clipboard!' : 'Copy Complete Brief'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="inline-flex items-center gap-2 px-4 py-3 font-mono text-xs text-[#D7B36A] hover:text-[#FAF7F0] transition-colors uppercase tracking-wider"
          >
            <RotateCcw size={13} />
            <span>Edit Information / Resubmit</span>
          </button>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------------------
  // 2. MAIN INTERACTIVE FORM VIEW
  // -------------------------------------------------------------------------
  return (
    <form
      ref={formTopRef}
      onSubmit={handleSubmit}
      noValidate
      className="w-full text-left transition-all duration-300"
      style={{
        background: 'rgba(18, 20, 26, 0.78)',
        border: '1px solid rgba(215, 179, 106, 0.22)',
        backdropFilter: 'blur(18px)',
        padding: 'clamp(1.75rem, 4vw, 3.25rem)',
        marginBottom: '3.5rem',
        boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.55)',
      }}
    >
      {/* Console Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-white/5">
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#D7B36A',
              display: 'block',
              marginBottom: '0.25rem',
            }}
          >
            PROJECT INQUIRY &amp; DISCOVERY CONSOLE
          </span>
          <p className="text-xs text-[#FAF7F0]/60 font-sans">
            Configure your technical scope for architectural consultation.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyEmail}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-white/10 hover:border-[#D7B36A]/40 bg-white/[0.02] hover:bg-[#D7B36A]/10 font-mono text-[0.6875rem] text-[#FAF7F0]/80 transition-all"
          aria-label="Copy studio email address"
        >
          {isCopiedEmail ? <Check size={12} color="#55D88A" /> : <Copy size={12} />}
          <span>{isCopiedEmail ? 'hello@quistertech.com Copied' : 'hello@quistertech.com'}</span>
        </button>
      </div>

      {/* ===================================================================
          01 — PROJECT DISCIPLINE
          =================================================================== */}
      <div className="mb-10">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
          <label
            className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase font-semibold text-[#D7B36A]"
            htmlFor="discipline-group"
          >
            01 — PROJECT DISCIPLINE
          </label>
          <span className="font-mono text-[0.625rem] text-[#FAF7F0]/45">
            {form.disciplines.length} Selected (Multi-select allowed)
          </span>
        </div>
        <p className="text-xs text-[#FAF7F0]/65 mb-4 font-sans font-light">
          Select one or more capabilities your project requires.
        </p>

        <div
          id="discipline-group"
          role="group"
          aria-label="Select Project Disciplines"
          className="flex flex-wrap gap-2.5"
        >
          {DISCIPLINE_OPTIONS.map((discipline) => {
            const isSelected = form.disciplines.includes(discipline)
            return (
              <button
                key={discipline}
                type="button"
                onClick={() => toggleDiscipline(discipline)}
                aria-pressed={isSelected}
                className="group inline-flex items-center gap-2 px-3.5 py-2 font-mono text-[0.6875rem] tracking-wider uppercase transition-all duration-200"
                style={{
                  border: isSelected
                    ? '1px solid #D7B36A'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isSelected
                    ? 'rgba(215, 179, 106, 0.16)'
                    : 'rgba(255, 255, 255, 0.02)',
                  color: isSelected ? '#ECC87A' : 'rgba(245, 240, 232, 0.7)',
                  cursor: 'pointer',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full transition-colors"
                  style={{
                    backgroundColor: isSelected ? '#ECC87A' : 'rgba(255, 255, 255, 0.2)',
                  }}
                />
                <span>{discipline}</span>
              </button>
            )
          })}
        </div>

        {errors.disciplines && (
          <div className="flex items-center gap-1.5 mt-2.5 text-xs text-rose-400 font-mono">
            <AlertCircle size={13} />
            <span>{errors.disciplines}</span>
          </div>
        )}
      </div>

      {/* ===================================================================
          02 — TARGET TIMELINE
          =================================================================== */}
      <div className="mb-10 pt-8 border-t border-white/5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
          <label
            className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase font-semibold text-[#D7B36A]"
            htmlFor="timeline-group"
          >
            02 — TARGET TIMELINE
          </label>
          <span className="font-mono text-[0.625rem] text-[#FAF7F0]/45">
            Single Selection
          </span>
        </div>
        <p className="text-xs text-[#FAF7F0]/65 mb-4 font-sans font-light">
          Select your desired delivery sprint or engagement cadence.
        </p>

        <div
          id="timeline-group"
          role="radiogroup"
          aria-label="Select Target Timeline"
          className="flex flex-wrap gap-2.5"
        >
          {TIMELINE_OPTIONS.map((t) => {
            const isSelected = form.timeline === t
            return (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setTimeline(t)}
                className="inline-flex items-center gap-2 px-3.5 py-2 font-mono text-[0.6875rem] tracking-wider uppercase transition-all duration-200"
                style={{
                  border: isSelected
                    ? '1px solid #D7B36A'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isSelected
                    ? 'rgba(215, 179, 106, 0.16)'
                    : 'rgba(255, 255, 255, 0.02)',
                  color: isSelected ? '#ECC87A' : 'rgba(245, 240, 232, 0.7)',
                  cursor: 'pointer',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: isSelected ? '#ECC87A' : 'rgba(255, 255, 255, 0.2)',
                  }}
                />
                <span>{t}</span>
              </button>
            )
          })}
        </div>

        {errors.timeline && (
          <div className="flex items-center gap-1.5 mt-2.5 text-xs text-rose-400 font-mono">
            <AlertCircle size={13} />
            <span>{errors.timeline}</span>
          </div>
        )}
      </div>

      {/* ===================================================================
          03 — ESTIMATED PROJECT BUDGET (NEW)
          =================================================================== */}
      <div className="mb-10 pt-8 border-t border-white/5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
          <label
            className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase font-semibold text-[#D7B36A]"
            htmlFor="budget-group"
          >
            03 — ESTIMATED PROJECT BUDGET
          </label>
          <span className="font-mono text-[0.625rem] text-[#FAF7F0]/45">
            Optional // Single Selection
          </span>
        </div>
        <p className="text-xs text-[#FAF7F0]/65 mb-4 font-sans font-light">
          Choose an approximate budget so we can recommend the right approach for your project.
        </p>

        <div
          id="budget-group"
          role="radiogroup"
          aria-label="Estimated Project Budget"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5"
        >
          {BUDGET_OPTIONS.map((b) => {
            const isSelected = form.budget === b
            const isNeedGuidance = b.includes('Need guidance')
            return (
              <button
                key={b}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => toggleBudget(b)}
                className={`text-left px-3.5 py-2.5 font-mono text-[0.6875rem] tracking-wider transition-all duration-200 flex items-center justify-between ${
                  isNeedGuidance ? 'sm:col-span-2 md:col-span-3' : ''
                }`}
                style={{
                  border: isSelected
                    ? '1px solid #D7B36A'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isSelected
                    ? 'rgba(215, 179, 106, 0.16)'
                    : 'rgba(255, 255, 255, 0.02)',
                  color: isSelected ? '#ECC87A' : 'rgba(245, 240, 232, 0.7)',
                  cursor: 'pointer',
                }}
              >
                <span>{b}</span>
                <span
                  className="w-1.5 h-1.5 rounded-full ml-2 flex-shrink-0"
                  style={{
                    backgroundColor: isSelected ? '#ECC87A' : 'transparent',
                    border: isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.25)',
                  }}
                />
              </button>
            )
          })}
        </div>

        {/* Pricing negotiation note */}
        <p className="mt-3 text-[0.6875rem] text-[#D7B36A]/75 font-mono flex items-center gap-1.5">
          <Sparkles size={11} />
          <span>Flexible scope &amp; negotiated milestone pricing available for all engagement tiers.</span>
        </p>
      </div>

      {/* ===================================================================
          04 — SPECIAL REQUIREMENTS & CUSTOMISATION (NEW)
          =================================================================== */}
      <div className="mb-10 pt-8 border-t border-white/5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
          <label
            htmlFor="special-requirements"
            className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase font-semibold text-[#D7B36A]"
          >
            04 — SPECIAL REQUIREMENTS &amp; CUSTOMISATION
          </label>
          <span className="font-mono text-[0.625rem] text-[#FAF7F0]/45">
            Optional // {form.specialRequirements.length} / 2000 chars
          </span>
        </div>
        <p className="text-xs text-[#FAF7F0]/65 mb-4 font-sans font-light">
          Tell us about the specific features, integrations or custom requirements you have in mind.
        </p>

        <textarea
          id="special-requirements"
          ref={requirementsInputRef}
          value={form.specialRequirements}
          onChange={(e) => handleTextChange('specialRequirements', e.target.value.slice(0, 2000))}
          rows={5}
          placeholder="Describe your project, required features, preferred design style, third-party integrations, automation, payment systems, APIs, existing software or anything special you would like us to build..."
          className="w-full p-4 font-sans text-sm text-[#FAF7F0] placeholder-[#FAF7F0]/30 transition-all duration-200 resize-y focus:outline-none focus:ring-1 focus:ring-[#D7B36A]"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            lineHeight: 1.65,
            minHeight: '120px',
          }}
        />

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="font-mono text-[0.625rem] text-[#FAF7F0]/40 uppercase tracking-wider">
            Quick Add:
          </span>
          {QUICK_FEATURE_SUGGESTIONS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleAddFeatureTag(tag)}
              className="px-2.5 py-1 rounded-sm border border-white/5 hover:border-[#D7B36A]/40 bg-white/[0.01] hover:bg-[#D7B36A]/10 font-mono text-[0.625rem] text-[#FAF7F0]/70 hover:text-[#ECC87A] transition-colors"
            >
              + {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ===================================================================
          05 — YOUR DETAILS (NEW)
          =================================================================== */}
      <div className="mb-10 pt-8 border-t border-white/5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
          <span className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase font-semibold text-[#D7B36A]">
            05 — YOUR DETAILS
          </span>
          <span className="font-mono text-[0.625rem] text-[#FAF7F0]/45">
            * Indicates required field
          </span>
        </div>
        <p className="text-xs text-[#FAF7F0]/65 mb-5 font-sans font-light">
          Where our engineering team should deliver your blueprint and schedule discussion.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="inquiry-fullname"
              className="block font-mono text-[0.625rem] tracking-wider uppercase text-[#FAF7F0]/80 mb-2"
            >
              Full Name <span className="text-[#D7B36A]">*</span>
            </label>
            <input
              id="inquiry-fullname"
              ref={nameInputRef}
              type="text"
              required
              value={form.fullName}
              onChange={(e) => handleTextChange('fullName', e.target.value)}
              placeholder="e.g. Vikramaditya Sharma"
              className="w-full px-3.5 py-2.5 font-sans text-sm text-[#FAF7F0] placeholder-[#FAF7F0]/30 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#D7B36A]"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: errors.fullName
                  ? '1px solid #F87171'
                  : '1px solid rgba(255, 255, 255, 0.08)',
              }}
            />
            {errors.fullName && (
              <p className="flex items-center gap-1 mt-1.5 text-xs text-rose-400 font-mono">
                <AlertCircle size={12} />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          {/* Work Email */}
          <div>
            <label
              htmlFor="inquiry-email"
              className="block font-mono text-[0.625rem] tracking-wider uppercase text-[#FAF7F0]/80 mb-2"
            >
              Work Email <span className="text-[#D7B36A]">*</span>
            </label>
            <input
              id="inquiry-email"
              ref={emailInputRef}
              type="email"
              required
              value={form.email}
              onChange={(e) => handleTextChange('email', e.target.value)}
              placeholder="name@company.com"
              className="w-full px-3.5 py-2.5 font-sans text-sm text-[#FAF7F0] placeholder-[#FAF7F0]/30 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#D7B36A]"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: errors.email
                  ? '1px solid #F87171'
                  : '1px solid rgba(255, 255, 255, 0.08)',
              }}
            />
            {errors.email && (
              <p className="flex items-center gap-1 mt-1.5 text-xs text-rose-400 font-mono">
                <AlertCircle size={12} />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Company / Brand Name */}
          <div>
            <label
              htmlFor="inquiry-company"
              className="block font-mono text-[0.625rem] tracking-wider uppercase text-[#FAF7F0]/80 mb-2"
            >
              Company / Brand <span className="text-white/40 text-[0.5625rem]">(Optional)</span>
            </label>
            <input
              id="inquiry-company"
              type="text"
              value={form.company}
              onChange={(e) => handleTextChange('company', e.target.value)}
              placeholder="e.g. Acme Corp / Stealth Venture"
              className="w-full px-3.5 py-2.5 font-sans text-sm text-[#FAF7F0] placeholder-[#FAF7F0]/30 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#D7B36A]"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            />
          </div>

          {/* WhatsApp / Phone */}
          <div>
            <label
              htmlFor="inquiry-phone"
              className="block font-mono text-[0.625rem] tracking-wider uppercase text-[#FAF7F0]/80 mb-2"
            >
              WhatsApp / Phone <span className="text-white/40 text-[0.5625rem]">(Optional)</span>
            </label>
            <input
              id="inquiry-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => handleTextChange('phone', e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 font-sans text-sm text-[#FAF7F0] placeholder-[#FAF7F0]/30 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#D7B36A]"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: errors.phone
                  ? '1px solid #F87171'
                  : '1px solid rgba(255, 255, 255, 0.08)',
              }}
            />
            {errors.phone && (
              <p className="flex items-center gap-1 mt-1.5 text-xs text-rose-400 font-mono">
                <AlertCircle size={12} />
                <span>{errors.phone}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ===================================================================
          06 — PROJECT BRIEF SUMMARY (REVIEW CARD)
          =================================================================== */}
      <div
        className="mb-8 pt-6 pb-6 px-5 border transition-all duration-200"
        style={{
          background: 'rgba(215, 179, 106, 0.03)',
          borderColor: activeReviewMode ? '#D7B36A' : 'rgba(215, 179, 106, 0.2)',
        }}
      >
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#D7B36A',
                fontWeight: 600,
              }}
            >
              PROJECT BRIEF SUMMARY
            </span>
            <span className="text-[0.625rem] text-[#FAF7F0]/40 font-mono">
              // Live Synthesis
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveReviewMode(!activeReviewMode)
              nameInputRef.current?.focus()
            }}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#D7B36A] hover:text-[#ECC87A] transition-colors uppercase"
          >
            <Edit3 size={12} />
            <span>Edit Answers</span>
          </button>
        </div>

        {/* Dynamic Summary Tags & Preview */}
        <div className="space-y-3 text-xs text-[#FAF7F0]/85 font-sans">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[0.625rem] uppercase text-[#D7B36A]">
              Disciplines:
            </span>
            {form.disciplines.length > 0 ? (
              form.disciplines.map((d) => (
                <span
                  key={d}
                  className="px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-[#FAF7F0] font-mono text-[0.625rem]"
                >
                  {d}
                </span>
              ))
            ) : (
              <span className="text-rose-400 font-mono text-[0.625rem]">None selected</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div>
              <span className="font-mono text-[0.625rem] uppercase text-[#D7B36A] mr-2">
                Timeline:
              </span>
              <span className="font-sans font-light">{form.timeline}</span>
            </div>

            {form.budget && (
              <div>
                <span className="font-mono text-[0.625rem] uppercase text-[#D7B36A] mr-2">
                  Budget:
                </span>
                <span className="font-sans font-light">{form.budget}</span>
              </div>
            )}
          </div>

          {(form.fullName || form.email) && (
            <div className="flex flex-wrap items-center gap-4 pt-1">
              {form.fullName && (
                <div>
                  <span className="font-mono text-[0.625rem] uppercase text-[#D7B36A] mr-1.5">
                    Lead:
                  </span>
                  <span className="font-sans font-light">{form.fullName}</span>
                </div>
              )}
              {form.email && (
                <div>
                  <span className="font-mono text-[0.625rem] uppercase text-[#D7B36A] mr-1.5">
                    Email:
                  </span>
                  <span className="font-sans font-light">{form.email}</span>
                </div>
              )}
              {form.company && (
                <div>
                  <span className="font-mono text-[0.625rem] uppercase text-[#D7B36A] mr-1.5">
                    Company:
                  </span>
                  <span className="font-sans font-light">{form.company}</span>
                </div>
              )}
              {form.phone && (
                <div>
                  <span className="font-mono text-[0.625rem] uppercase text-[#D7B36A] mr-1.5">
                    Phone:
                  </span>
                  <span className="font-sans font-light">{form.phone}</span>
                </div>
              )}
            </div>
          )}

          {form.specialRequirements.trim() && (
            <div className="pt-2 border-t border-white/5">
              <span className="font-mono text-[0.625rem] uppercase text-[#D7B36A] block mb-1">
                Custom Requirements:
              </span>
              <p className="line-clamp-2 text-white/70 italic text-[0.75rem]">
                &ldquo;{form.specialRequirements}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ===================================================================
          DIRECT ACTIONS
          =================================================================== */}
      <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-white/5">
        <button
          type="submit"
          id="contact-send-inquiry"
          className="btn-primary"
          style={{ fontSize: '0.8125rem' }}
        >
          <Send size={14} strokeWidth={1.5} />
          <span>Send Project Brief</span>
          <ArrowRight size={14} strokeWidth={1.5} />
        </button>

        <button
          type="button"
          onClick={handleCopyEmail}
          className="btn-secondary"
          style={{ fontSize: '0.8125rem' }}
          aria-label="Copy studio contact email"
        >
          {isCopiedEmail ? <Check size={14} color="#55D88A" /> : <Copy size={14} />}
          <span>{isCopiedEmail ? 'Email Copied to Clipboard' : 'Copy hello@quistertech.com'}</span>
        </button>

        <button
          type="button"
          onClick={handleCopyBrief}
          className="inline-flex items-center gap-2 px-4 py-2 font-mono text-xs text-[#FAF7F0]/65 hover:text-[#ECC87A] transition-colors uppercase tracking-wider"
        >
          {isCopiedBrief ? <Check size={12} color="#55D88A" /> : <Copy size={12} />}
          <span>{isCopiedBrief ? 'Brief Copied!' : 'Copy Brief Directly'}</span>
        </button>
      </div>
    </form>
  )
}
