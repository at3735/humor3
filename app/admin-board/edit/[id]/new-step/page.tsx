// This is a Server Component

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function NewHumorFlavorStepPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id: humor_flavor_id } = await params

  // Determine the next 'order_by' value
  const { data: maxOrder, error: orderError } = await supabase
    .from('humor_flavor_steps')
    .select('order_by')
    .eq('humor_flavor_id', humor_flavor_id)
    .order('order_by', { ascending: false })
    .limit(1)
    .single()

  const nextOrderBy = orderError || !maxOrder ? 1 : maxOrder.order_by + 1

  // Server Action to create the new step
  const createStep = async (formData: FormData) => {
    'use server'

    const newStep = {
      humor_flavor_id: humor_flavor_id,
      description: formData.get('description') as string,
      llm_system_prompt: formData.get('llm_system_prompt') as string,
      llm_user_prompt: formData.get('llm_user_prompt') as string,
      order_by: nextOrderBy,
      // TODO: Add other fields like temperature, model_id, etc.
      // For now, we'll use placeholders or defaults if your DB requires them.
      // Assuming your DB has defaults or allows nulls for these for now.
      llm_temperature: 0.7,
      llm_input_type_id: 1, // Placeholder
      llm_output_type_id: 1, // Placeholder
      llm_model_id: 1, // Placeholder
      humor_flavor_step_type_id: 1, // Placeholder
    }

    const supabase = await createClient()
    const { error } = await supabase.from('humor_flavor_steps').insert([newStep])

    if (error) {
      console.error('Error creating step:', error)
    } else {
      redirect(`/admin-board/edit/${humor_flavor_id}`)
    }
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '700px', margin: 'auto' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '30px' }}>Create New Step (Step {nextOrderBy})</h1>
      <form action={createStep} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description (Optional)</label>
          <input
            type="text"
            id="description"
            name="description"
            placeholder="e.g., 'Generate a funny observation'"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label htmlFor="llm_system_prompt" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>System Prompt</label>
          <textarea
            id="llm_system_prompt"
            name="llm_system_prompt"
            rows={6}
            placeholder="You are a witty comedian..."
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label htmlFor="llm_user_prompt" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>User Prompt</label>
          <textarea
            id="llm_user_prompt"
            name="llm_user_prompt"
            rows={6}
            placeholder="Look at this image description: {{input}}. Make a funny observation about it."
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <Link href={`/admin-board/edit/${humor_flavor_id}`} style={{ padding: '10px 20px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: 'white', cursor: 'pointer', textDecoration: 'none', color: '#333' }}>
            Cancel
          </Link>
          <button type="submit" style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}>
            Create Step
          </button>
        </div>
      </form>
    </div>
  )
}
