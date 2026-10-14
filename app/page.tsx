import Link from 'next/link'

const previewDishes = [
  { icon: '🥘', dish: 'Baked pasta', person: 'Alex is bringing this' },
  { icon: '🥗', dish: 'Harvest salad', person: 'Sam is bringing this' },
  { icon: '🍰', dish: 'Apple crumble', person: 'You could bring this' },
]

export default function Home() {
  return (
    <main>
      <section className="container hero">
        <div className="hero-copy">
          <span className="eyebrow">Good food. Great company.</span>
          <h1 className="display">Bring everyone <em>to the table.</em></h1>
          <p className="hero-description">Plan a potluck everyone looks forward to. Set the date, share one link, and let friends claim what they&apos;re bringing.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/create">Plan a potluck <span aria-hidden="true">↗</span></Link>
            <Link className="button button-secondary" href="#how-it-works">See how it works <span aria-hidden="true">↓</span></Link>
          </div>
          <p className="hero-note"><span aria-hidden="true">✳</span> Simple to set up. Easy to share. Better together.</p>
        </div>
        <div className="preview-wrap" aria-label="Preview of a potluck menu">
          <div className="preview-card card">
            <div className="preview-top"><span>On the menu</span><div className="preview-avatar" aria-hidden="true">P</div></div>
            <div className="preview-heading">
              <div className="preview-illustration" aria-hidden="true">🍂</div>
              <div><h2>Autumn at our place</h2><p>Saturday, 6:30 PM · Everyone&apos;s invited</p></div>
            </div>
            <p className="preview-divider">The good stuff</p>
            {previewDishes.map((item) => (
              <div className="preview-row" key={item.dish}>
                <span className="preview-emoji" aria-hidden="true">{item.icon}</span>
                <span><strong>{item.dish}</strong><small>{item.person}</small></span>
                <span className="preview-check" aria-hidden="true">✓</span>
              </div>
            ))}
          </div>
          <div className="floating-note" aria-hidden="true">✦ One less thing to coordinate</div>
        </div>
      </section>
      <section className="steps-section" id="how-it-works">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">How it works</span>
            <h2 className="display">A gathering, made easy.</h2>
            <p>Everything you need to organize a meal together, without the endless group chat.</p>
          </div>
          <div className="steps-grid">
            <article className="step-card"><span className="step-icon" aria-hidden="true">✎</span><h3>Set the scene</h3><p>Add a date, a place, and any details your guests should know.</p></article>
            <article className="step-card"><span className="step-icon" aria-hidden="true">↗</span><h3>Invite your people</h3><p>Share your event link with the whole table in one tap.</p></article>
            <article className="step-card"><span className="step-icon" aria-hidden="true">♡</span><h3>Fill the table</h3><p>Friends add their dishes to the menu so everyone knows what&apos;s covered.</p></article>
          </div>
        </div>
      </section>
    </main>
  )
}
