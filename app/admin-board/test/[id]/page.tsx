'use client';

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { generateCaptions } from '../actions'

export default function TestFlavorPage() {
  const { id } = useParams<{ id: string }>()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [captions, setCaptions] = useState<string[]>([])
  const [status, setStatus] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setCaptions([]) // Clear old captions
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!imageFile) {
      alert('Please upload an image first.')
      return
    }

    setIsLoading(true)
    setCaptions([])
    setStatus('Generating captions... this can take up to 60 seconds.')

    const formData = new FormData()
    formData.append('image', imageFile)

    try {
      if (!id) throw new Error('Missing flavor id.')
      const result = await generateCaptions(id, formData)
      setCaptions(result)
      setStatus(null)
    } catch (err) {
      console.error(err)
      const message = err instanceof Error ? err.message : 'Failed to generate captions'
      setStatus(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <header style={{ marginBottom: '30px' }}>
        <Link href="/admin-board" style={{ textDecoration: 'none', color: '#007bff' }}>
          &larr; Back to Admin Board
        </Link>
        <h1 style={{ fontSize: '1.8rem', marginTop: '10px' }}>Test Humor Flavor</h1>
      </header>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
        <div>
          <label htmlFor="image-upload" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>1. Upload an Image</label>
          <input type="file" id="image-upload" name="image" accept="image/*" onChange={handleFileChange} required />
        </div>
        <button type="submit" disabled={isLoading || !imageFile} style={{ padding: '12px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer', fontSize: '1rem', opacity: (isLoading || !imageFile) ? 0.5 : 1 }}>
          {isLoading ? 'Generating...' : '2. Generate Captions'}
        </button>
      </form>

      {imagePreview && (
        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Results</h2>
          <div style={{ border: '1px solid #eee', borderRadius: '8px', padding: '20px' }}>
            <img src={imagePreview} alt="Image preview" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '4px', marginBottom: '20px' }} />
            {status && <p>{status}</p>}
            {isLoading ? (
              <p>Loading captions...</p>
            ) : (
              <ul>
                {captions.map((caption, index) => (
                  <li key={index} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #f0f0f0' }}>{caption}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
