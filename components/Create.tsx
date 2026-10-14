'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

type FieldName = 'title' | 'date' | 'theme' | 'address' | 'instructions'
type Errors = Partial<Record<FieldName | 'submit', string>>

export default function CreatePotluckForm() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [theme, setTheme] = useState('')
  const [address, setAddress] = useState('')
  const [instructions, setInstructions] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  function clearError(field: FieldName) {
    setErrors(previous => ({ ...previous, [field]: undefined, submit: undefined }))
  }

  async function createEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Errors = {}
    const eventDate = new Date(date)
    if (!title.trim()) nextErrors.title = 'Please give your potluck a name.'
    else if (title.trim().length > 60) nextErrors.title = 'Keep the name under 60 characters.'
    if (!date || Number.isNaN(eventDate.getTime())) nextErrors.date = 'Choose a valid date and time.'
    else if (eventDate.getTime() <= Date.now()) nextErrors.date = 'Choose a future date and time.'
    if (theme.length > 60) nextErrors.theme = 'Keep the theme under 60 characters.'
    if (address.length > 120) nextErrors.address = 'Keep the location under 120 characters.'
    if (instructions.length > 500) nextErrors.instructions = 'Keep the note under 500 characters.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/newEvent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          datetime: eventDate.toISOString(),
          theme: theme.trim(),
          address: address.trim(),
          instructions: instructions.trim(),
        }),
      })
      const data = await response.json()
      if (!response.ok || !data.id) throw new Error('Unable to create your potluck. Please try again.')
      router.push(`/${data.id}`)
    } catch {
      setErrors({ submit: 'Unable to create your potluck. Please try again.' })
      setSubmitting(false)
    }
  }

  return (
    <main className="container">
      <div className="page-intro">
        <span className="eyebrow">Start gathering</span>
        <h1 className="display">Let&apos;s plan something good.</h1>
        <p>Set the details for your get-together. Once it&apos;s ready, you&apos;ll get a link to share with everyone.</p>
      </div>
      <div className="form-layout">
        <form className="card form-card" onSubmit={createEvent} noValidate>
          <h2>The details</h2>
          <p className="form-lede">Just a few things to get the table set.</p>
          <div className="form-grid">
            <div className="field field-full">
              <label htmlFor="event-title">Potluck name <span>*</span></label>
              <input id="event-title" className="input" value={title} maxLength={61} placeholder="e.g. Sunday supper with friends" onChange={e => { setTitle(e.target.value); clearError('title') }} aria-invalid={!!errors.title} aria-describedby={errors.title ? 'title-error' : undefined} />
              {errors.title && <span className="field-error" id="title-error">{errors.title}</span>}
            </div>
            <div className="field">
              <label htmlFor="event-date">Date &amp; time <span>*</span></label>
              <input id="event-date" className="input" type="datetime-local" value={date} onChange={e => { setDate(e.target.value); clearError('date') }} aria-invalid={!!errors.date} aria-describedby={errors.date ? 'date-error' : undefined} />
              {errors.date && <span className="field-error" id="date-error">{errors.date}</span>}
            </div>
            <div className="field">
              <label htmlFor="event-theme">Theme <span className="muted">(optional)</span></label>
              <input id="event-theme" className="input" value={theme} maxLength={61} placeholder="e.g. Cozy comfort food" onChange={e => { setTheme(e.target.value); clearError('theme') }} aria-invalid={!!errors.theme} aria-describedby={errors.theme ? 'theme-error' : undefined} />
              {errors.theme && <span className="field-error" id="theme-error">{errors.theme}</span>}
            </div>
            <div className="field field-full">
              <label htmlFor="event-address">Location <span className="muted">(optional)</span></label>
              <input id="event-address" className="input" value={address} maxLength={121} placeholder="e.g. My place, 123 Maple Street" onChange={e => { setAddress(e.target.value); clearError('address') }} aria-invalid={!!errors.address} aria-describedby={errors.address ? 'address-error' : undefined} />
              {errors.address && <span className="field-error" id="address-error">{errors.address}</span>}
            </div>
            <div className="field field-full">
              <label htmlFor="event-instructions">A note for your guests <span className="muted">(optional)</span></label>
              <textarea id="event-instructions" className="input" value={instructions} maxLength={501} placeholder="Parking tips, dietary notes, or anything else guests should know..." onChange={e => { setInstructions(e.target.value); clearError('instructions') }} aria-invalid={!!errors.instructions} aria-describedby={errors.instructions ? 'instructions-error' : undefined} />
              {errors.instructions && <span className="field-error" id="instructions-error">{errors.instructions}</span>}
            </div>
          </div>
          <div className="form-bottom">
            <p>Fields marked * are required.</p>
            <button className="button button-primary" type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create potluck ↗'}</button>
          </div>
          {errors.submit && <p className="field-error" role="alert">{errors.submit}</p>}
        </form>
        <aside className="aside-card">
          <span className="step-icon" aria-hidden="true">♡</span>
          <h2>Good things are shared.</h2>
          <p>Once your event is created, send its link to your guests. They can add a dish to the menu so everyone knows what&apos;s coming.</p>
          <ul className="aside-list">
            <li><span aria-hidden="true">✓</span> No guest accounts needed</li>
            <li><span aria-hidden="true">✓</span> One shared menu for everyone</li>
            <li><span aria-hidden="true">✓</span> More time around the table</li>
          </ul>
        </aside>
      </div>
    </main>
  )
}
