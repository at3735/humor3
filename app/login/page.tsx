'use client'

import { createClient } from '@/utils/supabase/client'
import styles from './login.module.css' // Import the CSS module

export default function LoginPage() {
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1 className={styles.title}>
          Admin Portal
        </h1>
        <p className={styles.subtitle}>
          Please log in to see the admin dashboard.
        </p>
        <button
          onClick={handleGoogleLogin}
          className={styles.button}
        >
          <span>Sign In with Google</span>
        </button>
      </div>
    </div>
  )
}
