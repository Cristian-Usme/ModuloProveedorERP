import { useEffect, useState } from 'react'

export default function App() {
  const [status, setStatus] = useState('checking')
  const [error, setError] = useState(null)

  useEffect(() => {
    // Test si el backend está disponible
    async function checkBackend() {
      try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'test@test.com', password: 'test' }),
        })
        setStatus('ready')
      } catch (err) {
        setError(err.message)
        setStatus('error')
      }
    }
    checkBackend()
  }, [])

  if (status === 'checking') {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '18px',
        fontFamily: 'sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <p>Verificando conexión con el backend...</p>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '20px' }}>
            Backend URL: http://localhost:8080<br/>
            Frontend URL: http://localhost:5174
          </p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '16px',
        fontFamily: 'sans-serif',
        background: '#fee',
      }}>
        <div style={{ textAlign: 'center', padding: '40px', maxWidth: '500px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
          <h1 style={{ marginBottom: '10px' }}>Conexión no disponible</h1>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            No se puede conectar al Backend. Verifica que Docker esté corriendo:
          </p>
          <code style={{
            display: 'block',
            background: '#f5f5f5',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '12px',
            overflow: 'auto',
          }}>
            docker-compose ps
          </code>
          <p style={{ color: '#999', fontSize: '12px' }}>{error}</p>
        </div>
      </div>
    )
  }

  // Si todo está bien, renderizar la app normal
  return (
    <div>
      <p style={{ textAlign: 'center', padding: '20px' }}>
        Cargando aplicación...
      </p>
    </div>
  )
}
