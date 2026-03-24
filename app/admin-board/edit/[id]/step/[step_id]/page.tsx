// This is a Server Component

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function EditHumorFlavorStepPage({ params }: { params: Promise<{ id: string, step_id: string }> }) {
  const supabase = await createClient()
  const { id, step_id } = await params // Correctly named 'id' now

  // Fetch the existing step data
  const { data: step, error: fetchError } = await supabase
    .from('humor_flavor_steps')
    .select('*')
    .eq('id', step_id)
    .single()

  if (fetchError || !step) {
    console.error('Error fetching step or step not found:', fetchError)
    return redirect(`/admin-board/edit/${id}`)
  }

  // Server Action to update the step
  const updateStep = async (formData: FormData) => {
    'use server'

    const updatedStep = {
      description: formData.get('description') as string,
      llm_system_prompt: formData.get('llm_system_prompt') as string,
      llm_user_prompt: formData.get('llm_user_prompt') as string,
      // TODO: Add other fields
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('humor_flavor_steps')
      .update(updatedStep)
      .eq('id', step_id)

    if (error) {
      console.error('Error updating step:', error)
    } else {
      redirect(`/admin-board/edit/${id}`)
    }
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '700px', margin: 'auto' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '30px' }}>Edit Step {step.order_by}</h1>
      <form action={updateStep} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description (Optional)</label>
          <input
            type="text"
            id="description"
            name="description"
            defaultValue={step.description || ''}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label htmlFor="llm_system_prompt" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>System Prompt</label>
          <textarea
            id="llm_system_prompt"
            name="llm_system_prompt"
            rows={6}
            defaultValue={step.llm_system_prompt || ''}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label htmlFor="llm_user_prompt" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>User Prompt</label>
          <textarea
            id="llm_user_prompt"
            name="llm_user_prompt"
            rows={6}
            defaultValue={step.llm_user_prompt || ''}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <Link href={`/admin-board/edit/${id}`} style={{ padding: '10px 20px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: 'white', cursor: 'pointer', textDecoration: 'none', color: '#333' }}>
            Cancel
          </Link>
          <button type="submit" style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}>
            Update Step
          </button>
        </div>
      </form>
    </div>
  )
}
