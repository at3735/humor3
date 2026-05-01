'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const toSlug = (str: string) => {
  return str
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
}

export async function createFlavor(name: string, description: string) {
  const supabase = await createClient()
  const newSlug = toSlug(name)

  // Check for existing flavor with the same slug (case-insensitive)
  const { data: existingFlavor, error: existingError } = await supabase
    .from('humor_flavors')
    .select('slug')
    .ilike('slug', newSlug)
    .single()

  if (existingError && existingError.code !== 'PGRST116') {
    console.error('Error checking for existing flavor:', existingError)
    return { error: 'Database error while checking for existing flavor.' }
  }

  if (existingFlavor) {
    return { error: `A flavor with a similar name to "${name}" already exists.` }
  }

  // Insert the new flavor
  const { error: insertError } = await supabase
    .from('humor_flavors')
    .insert([{ slug: newSlug, description }])

  if (insertError) {
    console.error('Error creating flavor:', insertError)
    return { error: 'Failed to create the new flavor.' }
  }

  revalidatePath('/admin-board')
  return { success: true }
}
