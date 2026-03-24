'use client'

import Link from 'next/link'
import { Flavor, Step } from './types'
import SortableStepList from './sortable-step-list' // Import the new sortable list

// Define the props for our component
interface EditFormProps {
  flavor: Flavor;
  steps: Step[];
  updateAction: (formData: FormData) => Promise<void>;
  deleteAction: (id: string) => Promise<void>;
  deleteStepAction: (stepId: number) => Promise<void>;
  reorderStepsAction: (steps: Step[]) => Promise<void>;
}

export default function EditForm({ flavor, steps, updateAction, deleteAction, deleteStepAction, reorderStepsAction }: EditFormProps) {

  const handleFlavorDelete = async () => {
    if (window.confirm('Are you sure you want to delete this humor flavor? This action cannot be undone.')) {
      await deleteAction(flavor.id)
    }
  }

  return (
    <>
      {/* Flavor Edit Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px', gap: '20px' }}>
        <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Edit Humor Flavor</h1>
        <button
          onClick={handleFlavorDelete}
          style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9rem', flexShrink: 0 }}
        >
          Delete Flavor
        </button>
      </div>
      <form action={updateAction} style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderBottom: '1px solid #ccc', paddingBottom: '30px', marginBottom: '30px' }}>
        {/* Form fields... */}
        <div>
          <label htmlFor="slug" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Slug</label>
          <input type="text" id="slug" name="slug" required defaultValue={flavor.slug} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </div>
        <div>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
          <textarea id="description" name="description" rows={4} defaultValue={flavor.description || ''} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <Link href="/admin-board" style={{ padding: '10px 20px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: 'white', cursor: 'pointer', textDecoration: 'none', color: '#333' }}>
            Cancel
          </Link>
          <button type="submit" style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}>
            Update Flavor
          </button>
        </div>
      </form>

      {/* Steps Management Section */}
      <SortableStepList
        flavorId={flavor.id}
        initialSteps={steps}
        deleteStepAction={deleteStepAction}
        reorderStepsAction={reorderStepsAction}
      />
    </>
  )
}
