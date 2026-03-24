// This page is for users who are logged in but not authorized.

export default function UnauthorizedPage() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontSize: '1.5rem',
      fontFamily: 'sans-serif',
      color: '#333',
    }}>
      You do not have admin access.
    </div>
  )
}
