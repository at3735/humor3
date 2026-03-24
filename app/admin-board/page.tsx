import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import ThemeToggle from './theme-toggle'

export default async function AdminBoardPage() {
  const supabase = await createClient()
  const { data: flavors, error } = await supabase
    .from('humor_flavors')
    .select('id, slug, description')
    .order('slug', { ascending: true })

  if (error) {
    console.error('Error fetching humor flavors:', error)
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '1000px', margin: 'auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', gap: '16px', flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Admin Board</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <ThemeToggle />
          <Link href="/admin-board/new" style={{ padding: '10px 16px', borderRadius: '5px', backgroundColor: 'var(--primary)', color: 'var(--primary-contrast)', textDecoration: 'none', fontSize: '0.95rem' }}>
            + New Humor Flavor
          </Link>
        </div>
      </header>

      {(!flavors || flavors.length === 0) ? (
        <p>No humor flavors found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {flavors.map((flavor) => (
            <div key={flavor.id} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', backgroundColor: 'var(--surface)', boxShadow: `0 2px 6px var(--shadow)` }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>{flavor.slug}</div>
                {flavor.description && (
                  <div style={{ color: 'var(--muted)', marginTop: '6px' }}>{flavor.description}</div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                <Link href={`/admin-board/edit/${flavor.id}`} style={{ padding: '8px 12px', borderRadius: '5px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', textDecoration: 'none', color: 'var(--foreground)' }}>
                  Edit
                </Link>
                <Link href={`/admin-board/test/${flavor.id}`} style={{ padding: '8px 12px', borderRadius: '5px', border: '1px solid #17a2b8', backgroundColor: '#e8f7fb', textDecoration: 'none', color: '#0f6d80' }}>
                  Test
                </Link>
                <Link href={`/admin-board/captions/${flavor.id}`} style={{ padding: '8px 12px', borderRadius: '5px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', textDecoration: 'none', color: 'var(--foreground)' }}>
                  Captions
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
