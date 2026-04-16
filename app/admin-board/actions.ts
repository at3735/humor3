'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Helper function to generate a slug from a string
const toSlug = (str: string) => {
  return str
    // .toLowerCase() // Removed to preserve case
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
}

export async function duplicateFlavor(flavorId: string, newName: string) {
  const supabase = await createClient()
  const newSlug = toSlug(newName)

  // 1. Verify the new name is unique (case-insensitively)
  const { data: existingFlavor, error: existingError } = await supabase
    .from('humor_flavors')
    .select('slug')
    .ilike('slug', newSlug) // Use ilike for case-insensitive check
    .single()

  if (existingError && existingError.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('Error checking for existing flavor:', existingError)
    return { error: 'Database error while checking for existing flavor.' }
  }

  if (existingFlavor) {
    return { error: `A flavor with a similar name to "${newName}" already exists.` }
  }

  // 2. Get the original flavor to duplicate
  const { data: originalFlavor, error: originalError } = await supabase
    .from('humor_flavors')
    .select('*')
    .eq('id', flavorId)
    .single()

  if (originalError || !originalFlavor) {
    console.error('Error fetching original flavor:', originalError)
    return { error: 'Could not find the flavor to duplicate.' }
  }

  // 3. Create the new flavor and get its ID
  const { description } = originalFlavor

  const { data: newFlavor, error: insertError } = await supabase
    .from('humor_flavors')
    .insert([{
      slug: newSlug,
      description,
    }])
    .select('id')
    .single()

  if (insertError || !newFlavor) {
    console.error('Error inserting new flavor:', insertError)
    return { error: 'Failed to create the new flavor.' }
  }

  // 4. Get the steps from the original flavor
  const { data: originalSteps, error: stepsError } = await supabase
    .from('humor_flavor_steps')
    .select('*')
    .eq('humor_flavor_id', flavorId)

  if (stepsError) {
    console.error('Error fetching original steps:', stepsError)
    return { error: 'Failed to fetch the steps of the original flavor.' }
  }

  // 5. Duplicate the steps for the new flavor
  if (originalSteps && originalSteps.length > 0) {
    const newSteps = originalSteps.map(step => {
      const { id, created_datetime_utc, modified_datetime_utc, created_by_user_id, modified_by_user_id, ...rest } = step;
      return {
        ...rest,
        humor_flavor_id: newFlavor.id,
      };
    });

    const { error: insertStepsError } = await supabase
      .from('humor_flavor_steps')
      .insert(newSteps)

    if (insertStepsError) {
      console.error('Error inserting new steps:', insertStepsError)
      return { error: 'Failed to duplicate the steps for the new flavor.' }
    }
  }

  // 6. Revalidate the path and return success
  revalidatePath('/admin-board')
  return { success: true }
}
