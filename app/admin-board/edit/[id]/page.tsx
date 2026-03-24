// This is now a pure Server Component. Its only job is to fetch data.

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import EditForm from '../edit-form' // Corrected import path

export default async function EditHumorFlavorPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  // Fetch the existing flavor data
  const flavorPromise = supabase
    .from('humor_flavors')
    .select('id, slug, description')
    .eq('id', id)
    .single()

  // Fetch all details for the steps of this flavor
  const stepsPromise = supabase
    .from('humor_flavor_steps')
    .select('*') // Select all columns for the details view
    .eq('humor_flavor_id', id)
    .order('order_by', { ascending: true })

  // Await both promises in parallel
  const [{ data: flavor, error: fetchError }, { data: steps, error: stepsError }] = await Promise.all([flavorPromise, stepsPromise])

  if (fetchError || !flavor) {
    console.error('Error fetching flavor or flavor not found:', fetchError)
    return redirect('/admin-board')
  }
  if (stepsError) {
    console.error('Error fetching steps:', stepsError)
    // We can still render the page even if steps fail to load
  }

  // Server Action to UPDATE the flavor
  const updateFlavor = async (formData: FormData) => {
    'use server'
    const slug = formData.get('slug') as string
    const description = formData.get('description') as string
    if (!slug) return
    const supabase = await createClient()
    await supabase.from('humor_flavors').update({ slug, description }).eq('id', id)
    redirect('/admin-board')
  }

  // Server Action to DELETE the flavor
  const deleteFlavor = async (idToDelete: string) => {
    'use server'
    const supabase = await createClient()
    await supabase.from('humor_flavors').delete().eq('id', idToDelete)
    revalidatePath('/admin-board')
    redirect('/admin-board')
  }

  // Server Action to DELETE a step
  const deleteStep = async (stepId: number) => {
    'use server'
    const supabase = await createClient()
    const { error } = await supabase
      .from('humor_flavor_steps')
      .delete()
      .eq('id', stepId)
    if (error) {
      console.error('Error deleting step:', error)
      throw new Error(error.message)
    }
    revalidatePath(`/admin-board/edit/${id}`) // Revalidate the current page
  }

  // Server Action to REORDER the steps
  const reorderSteps = async (reorderedSteps: any[]) => {
    'use server'
    const supabase = await createClient()

    // Use a loop of explicit updates for better reliability
    for (let i = 0; i < reorderedSteps.length; i++) {
      const step = reorderedSteps[i];
      const { error } = await supabase
        .from('humor_flavor_steps')
        .update({ order_by: i + 1 })
        .eq('id', step.id)

      if (error) {
        console.error(`Error updating step ${step.id}:`, error)
        // If one update fails, we stop to avoid further issues
        return
      }
    }

    revalidatePath(`/admin-board/edit/${id}`)
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '700px', margin: 'auto' }}>
      <EditForm
        flavor={flavor}
        steps={steps || []}
        updateAction={updateFlavor}
        deleteAction={deleteFlavor}
        deleteStepAction={deleteStep}
        reorderStepsAction={reorderSteps}
      />
    </div>
  )
}
