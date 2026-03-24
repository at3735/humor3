'use client'

import { useEffect, useState } from 'react'

type ThemeMode = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'theme-mode'

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement
  const body = document.body
  if (mode === 'system') {
    root.removeAttribute('data-theme')
    body.removeAttribute('data-theme')
    root.style.colorScheme = ''
    body.style.colorScheme = ''
  } else {
    root.setAttribute('data-theme', mode)
    body.setAttribute('data-theme', mode)
    root.style.colorScheme = mode
    body.style.colorScheme = mode
  }
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('system')

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) || 'system'
    setMode(saved)
    applyTheme(saved)
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value as ThemeMode
    setMode(next)
    localStorage.setItem(STORAGE_KEY, next)
    applyTheme(next)
  }

  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
      <span style={{ color: 'var(--muted)' }}>Theme</span>
      <select
        value={mode}
        onChange={handleChange}
        style={{
          padding: '6px 10px',
          borderRadius: '6px',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          color: 'var(--foreground)',
        }}
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  )
}
