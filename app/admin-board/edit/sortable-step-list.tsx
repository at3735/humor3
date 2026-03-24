'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { DraggableStepItem } from './draggable-step-item'
import StepDetailsModal from './step-details-modal'
import { Step } from './types'

interface SortableStepListProps {
  flavorId: string;
  initialSteps: Step[];
  deleteStepAction: (stepId: number) => Promise<void>;
  reorderStepsAction: (steps: Step[]) => Promise<void>;
}

export default function SortableStepList({ flavorId, initialSteps, deleteStepAction, reorderStepsAction }: SortableStepListProps) {
  const [steps, setSteps] = useState(initialSteps)
  const [selectedStep, setSelectedStep] = useState<Step | null>(null)
  const router = useRouter()
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = steps.findIndex((s) => s.id === active.id)
      const newIndex = steps.findIndex((s) => s.id === over.id)
      const newSteps = arrayMove(steps, oldIndex, newIndex)
      setSteps(newSteps)
      reorderStepsAction(newSteps) // Call the server action
    }
  }

  const handleStepDelete = async (stepId: number) => {
    if (window.confirm('Are you sure you want to delete this step?')) {
      try {
        await deleteStepAction(stepId)
        setSteps((prev) => prev.filter((step) => step.id !== stepId))
        if (selectedStep?.id === stepId) {
          setSelectedStep(null)
        }
        router.refresh()
      } catch (err) {
        console.error(err)
        alert('Failed to delete step')
      }
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Humor Flavor Steps</h2>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={steps} strategy={verticalListSortingStrategy}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {steps.map((step, index) => ( // Get the index from the map function
              <DraggableStepItem key={step.id} step={step}>
                {(dragHandleProps) => (
                  <div style={{ border: '1px solid #eee', borderRadius: '6px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span {...dragHandleProps} style={{ cursor: 'grab', color: '#999' }}>&#x2630;</span>
                      <div>
                        {/* Use the array index for the label */}
                        <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Step {index + 1}</span>
                        <span>{step.description || 'No description'}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => setSelectedStep(step)} style={{ padding: '8px 12px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: 'white', cursor: 'pointer' }}>View</button>
                      <Link href={`/admin-board/edit/${flavorId}/step/${step.id}`} style={{ padding: '8px 12px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#ffc107', color: 'black', textDecoration: 'none' }}>Edit</Link>
                      <button onClick={() => handleStepDelete(step.id)} style={{ padding: '8px 12px', borderRadius: '5px', backgroundColor: '#dc3545', color: 'white', cursor: 'pointer', border: 'none' }}>Delete</button>
                    </div>
                  </div>
                )}
              </DraggableStepItem>
            ))}
            {steps.length === 0 && <p>No steps found for this flavor.</p>}
          </div>
        </SortableContext>
      </DndContext>
      <div style={{ marginTop: '20px' }}>
        <Link href={`/admin-board/edit/${flavorId}/new-step`} style={{ backgroundColor: '#28a745', color: 'white', padding: '10px 15px', borderRadius: '5px', textDecoration: 'none', fontSize: '0.9rem' }}>+ Create New Step</Link>
      </div>
      <StepDetailsModal step={selectedStep} onClose={() => setSelectedStep(null)} />
    </div>
  )
}
