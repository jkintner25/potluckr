'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { id } = useParams()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
  }, [])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    localStorage.setItem('potluckr-theme', next)
    setTheme(next)
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <header className="site-header">
      <nav className="container nav-inner" aria-label="Main navigation">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden="true">✳</span>
          <span>Potluckr<span style={{ color: 'var(--accent)' }}>.</span></span>
        </Link>
        <div className="nav-actions">
          {id ? (
            <button type="button" className="button button-secondary button-small" onClick={copyLink}>
              {copied ? '✓ Copied!' : '↗ Share event'}
            </button>
          ) : (
            <>
              <Link href="/#how-it-works" className="nav-link">How it works</Link>
              <Link href="/create" className="button button-primary button-small">Create a potluck <span aria-hidden="true">↗</span></Link>
            </>
          )}
          <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
            <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
          </button>
        </div>
      </nav>
    </header>
  )
}
