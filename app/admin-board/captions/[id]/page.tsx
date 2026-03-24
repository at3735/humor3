// This is a Server Component

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ViewCaptionsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  // Fetch the flavor details and its captions with images
  const flavorPromise = supabase
    .from('humor_flavors')
    .select('slug')
    .eq('id', id)
    .single()

  const captionsPromise = supabase
    .from('captions')
    .select(`
      id,
      content,
      images ( url )
    `)
    .eq('humor_flavor_id', id)
    .order('created_datetime_utc', { ascending: false })

  const [{ data: flavor, error: flavorError }, { data: captions, error: captionsError }] = await Promise.all([flavorPromise, captionsPromise])

  if (flavorError || !flavor) {
    console.error('Error fetching flavor:', flavorError)
    return redirect('/admin-board')
  }

  if (captionsError) {
    console.error('Error fetching captions:', captionsError)
    // We can still render the page and show an error
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <header style={{ marginBottom: '30px' }}>
        <Link href="/admin-board" style={{ textDecoration: 'none', color: '#007bff' }}>
          &larr; Back to Admin Board
        </Link>
        <h1 style={{ fontSize: '1.8rem', marginTop: '10px' }}>Captions for: <span style={{ color: '#007bff' }}>{flavor.slug}</span></h1>
      </header>

      <main>
        {captions && captions.length > 0 ? (
          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {captions.map((caption: any) => (
              <div key={caption.id} style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                {caption.images?.url ? (
                  <img src={caption.images.url} alt="Caption image" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '200px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                    No Image
                  </div>
                )}
                <div style={{ padding: '15px' }}>
                  <p>{caption.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No captions found for this humor flavor.</p>
        )}
      </main>
    </div>
  )
}
