'use client'

import { FormEvent, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import { Event as PotluckEvent, DishEntry } from './types'
import { dishTags, DishTagKey } from './dishTags'

const categories = [
  { key: 'mains', label: 'Mains', option: 'Main', symbol: '🍲' },
  { key: 'sides', label: 'Sides', option: 'Side', symbol: '🥗' },
  { key: 'desserts', label: 'Desserts', option: 'Dessert', symbol: '🍰' },
  { key: 'drinks', label: 'Drinks', option: 'Drink', symbol: '🥂' },
  { key: 'misc', label: 'Other', option: 'Other', symbol: '✳' },
] as const

type Category = typeof categories[number]['key']

export default function PotluckPage({ id }: { id: string }) {
  const router = useRouter()
  const [eventData, setEventData] = useState<PotluckEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [newDishType, setNewDishType] = useState<Category>('mains')
  const [newDishName, setNewDishName] = useState('')
  const [newDishPerson, setNewDishPerson] = useState('')
  const [newDishTags, setNewDishTags] = useState<DishTagKey[]>([])
  const [signupStep, setSignupStep] = useState(0)
  const [errors, setErrors] = useState<{ dish?: string; name?: string; submit?: string }>({})
  const [submitting, setSubmitting] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)

  const getEvent = useCallback(async () => {
    try {
      const response = await fetch(`/api/${id}`, { cache: 'no-store' })
      if (response.status === 400 || response.status === 404) {
        router.push('/not-found')
        return
      }
      if (!response.ok) throw new Error('Event unavailable')
      const result = await response.json()
      setEventData(result.data)
      setLoadError(null)
    } catch {
      setLoadError('Could not load the event. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    getEvent()
    const interval = window.setInterval(getEvent, 15000)
    return () => window.clearInterval(interval)
  }, [getEvent])

  async function submitNewDish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (signupStep === 0) {
      if (!newDishName.trim()) {
        setErrors({ dish: 'Please enter a dish.' })
        return
      }
      setErrors({})
      setSignupStep(1)
      return
    }
    if (signupStep === 1) {
      setSignupStep(2)
      return
    }
    if (signupStep === 2) {
      setSignupStep(3)
      return
    }
    if (!newDishPerson.trim()) {
      setErrors({ name: 'Please enter your name.' })
      return
    }
    setErrors({})
    setSubmitting(true)
    try {
      const response = await fetch(`/api/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: newDishType, dish: newDishName.trim(), name: newDishPerson.trim(), tags: newDishTags }),
      })
      if (!response.ok) throw new Error('Could not add dish')
      const saved = await response.json()
      if (!saved.dish) throw new Error('Missing saved dish')
      setEventData(current => current
        ? { ...current, [newDishType]: [...(current[newDishType] ?? []), saved.dish] }
        : current
      )
      setNewDishName('')
      setNewDishPerson('')
      setNewDishType('mains')
      setNewDishTags([])
      setSignupStep(0)
    } catch {
      setErrors({ submit: 'Could not add your dish. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  function toggleTag(tag: DishTagKey) {
    setNewDishTags(previous => previous.includes(tag) ? previous.filter(item => item !== tag) : [...previous, tag])
  }

  async function deleteDish(dish: DishEntry) {
    const key = dish.id ?? `${dish.type}-${dish.name}-${dish.dish}`
    setRemoving(key)
    setActionError(null)
    try {
      const response = await fetch(`/api/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dish),
      })
      if (!response.ok) throw new Error('Could not remove dish')
      await getEvent()
    } catch {
      setActionError('Could not remove that dish. Please try again.')
    } finally {
      setRemoving(null)
    }
  }

  if (loading) {
    return <main className="container"><div className="card loading-card" role="status">Setting the table...</div></main>
  }
  if (!eventData) {
    return <main className="container"><div className="card loading-card" role="alert"><p>{loadError ?? 'Could not load the event.'}</p><button className="button button-secondary" type="button" onClick={getEvent}>Try again</button></div></main>
  }

  const dishCount = categories.reduce((total, category) => total + (eventData[category.key]?.length ?? 0), 0)

  return (
    <main className="container event-page">
      {loadError && <p className="field-error" role="alert">{loadError} Showing the last loaded menu.</p>}
      <section className="card event-hero">
        <span className="eyebrow">You&apos;re invited</span>
        <h1 className="display">{eventData.title}</h1>
        <div className="event-meta">
          <span className="meta-pill"><span aria-hidden="true">◷</span> {dayjs(eventData.datetime).format('dddd, MMMM D · h:mm A')}</span>
          {eventData.address && <span className="meta-pill"><span aria-hidden="true">⌖</span> {eventData.address}</span>}
          {eventData.theme && <span className="meta-pill"><span aria-hidden="true">✳</span> {eventData.theme}</span>}
        </div>
        {eventData.instructions && <p className="event-instructions"><strong>A note from the host:</strong> {eventData.instructions}</p>}
      </section>
      <div className="event-content">
        <section className="card menu-card">
          <div className="card-header">
            <div><h2>The menu</h2><p>See what everyone is bringing to the table.</p></div>
            <span className="count-badge">{dishCount} {dishCount === 1 ? 'dish' : 'dishes'}</span>
          </div>
          {actionError && <p className="field-error" role="alert">{actionError}</p>}
          {dishCount === 0 ? (
            <div className="empty-menu"><span aria-hidden="true">🍽️</span><h3>There&apos;s room at the table.</h3><p>Be the first to add something delicious.</p></div>
          ) : (
            categories.map(category => {
              const dishes = eventData[category.key]
              if (!dishes?.length) return null
              return (
                <div className="menu-section" key={category.key}>
                  <h3 className="menu-section-heading">{category.label}</h3>
                  {dishes.map((dish, index) => {
                    const key = dish.id ?? `${category.key}-${dish.name}-${dish.dish}`
                    return (
                      <div className="dish-row" key={dish.id ?? `${key}-${index}`}>
                        <span className="dish-symbol" aria-hidden="true">{category.symbol}</span>
                        <div className="dish-info">
                          <div className="dish-title-line">
                            <strong>{dish.dish}</strong>
                            {dish.tags?.map(tagKey => {
                              const tag = dishTags.find(item => item.key === tagKey)
                              return tag ? <span className={`tag-badge tag-badge-${tag.group}`} key={tag.key} aria-label={tag.label} title={tag.label}>{tag.badge}</span> : null
                            })}
                          </div>
                          <small>Brought by {dish.name}</small>
                        </div>
                        <button type="button" className="remove-button" onClick={() => deleteDish({ ...dish, type: category.key })} disabled={removing === key} aria-label={`Remove ${dish.dish} by ${dish.name}`} title="Remove dish">×</button>
                      </div>
                    )
                  })}
                </div>
              )
            })
          )}
        </section>
        <section className="card signup-card">
          <span className="eyebrow">Pull up a chair</span>
          <h2 style={{ marginTop: 10 }}>What are you bringing?</h2>
          <p className="form-lede">A few quick steps and you&apos;re on the menu.</p>
          <div className="signup-progress-label"><span>Step {signupStep + 1} of 4</span><span>{['Your dish', 'Category', 'Tags', 'Your name'][signupStep]}</span></div>
          <div className="signup-progress" role="progressbar" aria-label="Add a dish progress" aria-valuemin={1} aria-valuemax={4} aria-valuenow={signupStep + 1}>
            <span style={{ width: `${((signupStep + 1) / 4) * 100}%` }} />
          </div>
          <form className="signup-form" onSubmit={submitNewDish} noValidate>
            {signupStep === 0 && (
              <div className="field">
                <label htmlFor="dish-name">What dish will you bring? <span>*</span></label>
                <input id="dish-name" className="input" value={newDishName} maxLength={40} placeholder="e.g. Grandma's mac and cheese" onChange={e => { setNewDishName(e.target.value); setErrors(previous => ({ ...previous, dish: undefined, submit: undefined })) }} aria-invalid={!!errors.dish} aria-describedby={errors.dish ? 'dish-error' : undefined} />
                {errors.dish && <span className="field-error" id="dish-error" role="alert">{errors.dish}</span>}
              </div>
            )}
            {signupStep === 1 && (
              <div className="field">
                <p className="signup-field-label" id="category-label">Which part of the menu? <span>*</span></p>
                <div className="category-options" role="group" aria-labelledby="category-label">
                  {categories.map(category => (
                    <button className="category-choice" type="button" aria-pressed={newDishType === category.key} key={category.key} onClick={() => setNewDishType(category.key)}>
                      <span aria-hidden="true">{category.symbol}</span>{category.option}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {signupStep === 2 && (
              <div className="field">
                <p className="signup-field-label">Add any tags that apply <span className="muted">(optional)</span></p>
                <p className="tag-step-hint">Choose all that apply. Guests will see these beside your dish.</p>
                <p className="tag-group-label" id="allergen-tags-label">Contains</p>
                <div className="tag-options" role="group" aria-labelledby="allergen-tags-label">
                  {dishTags.filter(tag => tag.group === 'allergen').map(tag => (
                    <button className="tag-option" type="button" key={tag.key} aria-pressed={newDishTags.includes(tag.key)} onClick={() => toggleTag(tag.key)}>
                      <span className="tag-badge tag-badge-allergen" aria-hidden="true">{tag.badge}</span><span>{tag.label}</span>
                    </button>
                  ))}
                </div>
                <p className="tag-group-label" id="preparation-tags-label">Prepared as</p>
                <div className="tag-options" role="group" aria-labelledby="preparation-tags-label">
                  {dishTags.filter(tag => tag.group === 'preparation').map(tag => (
                    <button className="tag-option" type="button" key={tag.key} aria-pressed={newDishTags.includes(tag.key)} onClick={() => toggleTag(tag.key)}>
                      <span className="tag-badge tag-badge-preparation" aria-hidden="true">{tag.badge}</span><span>{tag.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {signupStep === 3 && (
              <>
                <div className="signup-summary">
                  <span>You&apos;re bringing</span>
                  <strong>{newDishName.trim()}</strong>
                  <small>{categories.find(category => category.key === newDishType)?.option}</small>
                  {newDishTags.length > 0 && <div className="dish-title-line">{newDishTags.map(tagKey => {
                    const tag = dishTags.find(item => item.key === tagKey)
                    return tag ? <span className={`tag-badge tag-badge-${tag.group}`} key={tag.key} title={tag.label}>{tag.badge}</span> : null
                  })}</div>}
                </div>
                <div className="field">
                  <label htmlFor="guest-name">What&apos;s your name? <span>*</span></label>
                  <input id="guest-name" className="input" value={newDishPerson} maxLength={40} placeholder="e.g. Jordan" onChange={e => { setNewDishPerson(e.target.value); setErrors(previous => ({ ...previous, name: undefined, submit: undefined })) }} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'guest-name-error' : undefined} />
                  {errors.name && <span className="field-error" id="guest-name-error" role="alert">{errors.name}</span>}
                </div>
              </>
            )}
            {errors.submit && <p className="field-error" role="alert">{errors.submit}</p>}
            {signupStep === 2 && <button className="signup-skip" type="button" onClick={() => { setNewDishTags([]); setSignupStep(3) }}>Skip tags for now</button>}
            <div className="signup-actions">
              {signupStep > 0 && <button className="button button-secondary" type="button" onClick={() => { setErrors({}); setSignupStep(step => step - 1) }} disabled={submitting}>← Back</button>}
              <button className="button button-primary" type="submit" disabled={submitting}>{submitting ? 'Adding...' : signupStep === 3 ? 'Add to the menu ↗' : 'Continue ↗'}</button>
            </div>
          </form>
        </section>
      </div>
      <section className="card tag-legend" aria-labelledby="tag-legend-title">
        <div className="card-header">
          <div><h2 id="tag-legend-title">Badge guide</h2><p>What the tags beside each dish mean.</p></div>
        </div>
        <div className="legend-groups">
          <div>
            <h3>Contains</h3>
            <div className="legend-list">{dishTags.filter(tag => tag.group === 'allergen').map(tag => (
              <div className="legend-item" key={tag.key}><span className="tag-badge tag-badge-allergen">{tag.badge}</span><span>{tag.description}</span></div>
            ))}</div>
          </div>
          <div>
            <h3>Prepared as</h3>
            <div className="legend-list">{dishTags.filter(tag => tag.group === 'preparation').map(tag => (
              <div className="legend-item" key={tag.key}><span className="tag-badge tag-badge-preparation">{tag.badge}</span><span>{tag.description}</span></div>
            ))}</div>
          </div>
        </div>
        <p className="legend-note">Tags are supplied by guests. An untagged dish is not confirmed allergen-free; ask the cook about ingredients and cross-contact.</p>
      </section>
    </main>
  )
}
