import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  // If there's an error or no user, redirect to the login page
  if (error || !data?.user) {
    return redirect('/login')
  }

  const user = data.user

  // Fetch the user's profile from the database
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_superadmin, is_matrix_admin')
    .eq('id', user.id)
    .single()

  // Check for authorization
  const isDeveloper = user.email === 'at3735@columbia.edu'
  const isAuthorized = profile?.is_superadmin || profile?.is_matrix_admin || isDeveloper

  // Redirect based on authorization status
  if (isAuthorized) {
    return redirect('/admin-board')
  } else {
    return redirect('/unauthorized')
  }
}
