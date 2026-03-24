'use client'

// Define the shape of a Step, matching the database schema
interface Step {
  id: number;
  description: string | null;
  order_by: number;
  llm_system_prompt: string | null;
  llm_user_prompt: string | null;
  llm_temperature: number | null;
  // Add other fields as needed
}

interface ModalProps {
  step: Step | null;
  onClose: () => void;
}

export default function StepDetailsModal({ step, onClose }: ModalProps) {
  if (!step) return null;

  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflowY: 'auto',
  };

  const preStyle: React.CSSProperties = {
    backgroundColor: '#f4f4f4',
    padding: '10px',
    borderRadius: '5px',
    whiteSpace: 'pre-wrap', // Allow text to wrap
    wordBreak: 'break-all',
    maxHeight: '200px',
    overflowY: 'auto',
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0 }}>Details for Step {step.order_by}</h2>
        <p><strong>Description:</strong> {step.description || 'N/A'}</p>

        <h4>System Prompt</h4>
        <pre style={preStyle}>{step.llm_system_prompt || 'N/A'}</pre>

        <h4>User Prompt</h4>
        <pre style={preStyle}>{step.llm_user_prompt || 'N/A'}</pre>

        <p><strong>Temperature:</strong> {step.llm_temperature ?? 'N/A'}</p>

        <button onClick={onClose} style={{ marginTop: '20px' }}>Close</button>
      </div>
    </div>
  );
}
