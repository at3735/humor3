'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { duplicateFlavor } from './actions'

export default function DuplicateButton({ flavorId }: { flavorId: string }) {
  const [isDuplicating, setIsDuplicating] = useState(false)
  const router = useRouter()

  const handleDuplicate = async () => {
    const newName = prompt('Enter the new name for the duplicated flavor:')
    if (!newName || newName.trim() === '') {
      return
    }

    setIsDuplicating(true)
    try {
      const result = await duplicateFlavor(flavorId, newName.trim())
      if (result?.error) {
        alert(`Error: ${result.error}`)
      } else if (result?.success) {
        router.push('/admin-board')
      }
    } catch (error) {
      console.error('Duplication failed:', error)
      alert('An unexpected error occurred during duplication.')
    } finally {
      setIsDuplicating(false)
    }
  }

  return (
    <button
      onClick={handleDuplicate}
      disabled={isDuplicating}
      style={{
        padding: '8px 12px',
        borderRadius: '5px',
        border: '1px solid var(--border)',
        backgroundColor: 'var(--surface)',
        color: 'var(--foreground)',
        cursor: 'pointer',
        opacity: isDuplicating ? 0.5 : 1,
      }}
    >
      {isDuplicating ? 'Duplicating...' : 'Duplicate'}
    </button>
  )
}
