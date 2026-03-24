'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuthButton() {
  const supabase = createClient()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUserEmail(user?.email || null)
    }
    getUser()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
    setUserEmail(null)
  }

  const handleSignIn = () => {
    router.push('/login')
  }

  const buttonStyles = {
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: '1px solid #ccc',
    padding: '8px 16px',
    borderRadius: '4px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    width: '100%', // Make button take full width of container
  }

  // If the user is logged in, show the info box
  if (userEmail) {
    return (
      <div style={{
        border: '1px solid #eee',
        borderRadius: '6px',
        padding: '12px',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}>
        <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>
          Signed in as
        </div>
        <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>
          {userEmail}
        </div>
        <button onClick={handleSignOut} style={buttonStyles}>
          Sign Out
        </button>
      </div>
    )
  }

  // If logged out, show a simple sign-in button
  return (
    <button onClick={handleSignIn} style={{
      backgroundColor: '#4285F4',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      fontSize: '1rem',
      cursor: 'pointer',
    }}>
      Sign In
    </button>
  )
}
