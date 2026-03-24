// This is now a Server Component, no 'use client' needed.

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default function NewHumorFlavorPage() {

  const createFlavor = async (formData: FormData) => {
    'use server'

    const slug = formData.get('slug') as string
    const description = formData.get('description') as string

    if (!slug) {
      // Handle error: slug is required
      return
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('humor_flavors')
      .insert([{ slug, description }])

    if (error) {
      console.error('Error creating flavor:', error)
      // Optionally, handle the error in the UI
    } else {
      redirect('/admin-board')
    }
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '30px' }}>Create New Humor Flavor</h1>
      <form action={createFlavor} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label htmlFor="slug" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Slug</label>
          <input
            type="text"
            id="slug"
            name="slug"
            required
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>A unique, URL-friendly identifier (e.g., "witty-puns").</p>
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
