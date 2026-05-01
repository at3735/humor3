'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createFlavor } from './actions'

export default function NewHumorFlavorPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string
    const description = formData.get('description') as string

    const result = await createFlavor(name, description)

    if (result?.error) {
      setError(result.error)
      alert(result.error) // Display the error in an alert
    } else if (result?.success) {
      setError(null)
      router.push('/admin-board')
    }
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '30px' }}>Create New Humor Flavor</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>A unique name for the flavor (e.g., "Witty Puns").</p>
        </div>
        <div>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Link href="/admin-board" style={{
            padding: '10px 20px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: 'white',
            cursor: 'pointer',
            textDecoration: 'none',
            color: '#333',
          }}>
            Cancel
          </Link>
          <button type="submit" style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}>
            Create Flavor
          </button>
        </div>
      </form>
    </div>
  )
}
