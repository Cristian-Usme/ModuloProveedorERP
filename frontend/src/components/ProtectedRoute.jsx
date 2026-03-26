import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, roles }) {
  const { auth, hasRole } = useAuth()
  if (!auth) return <Navigate to="/login" replace />
  if (roles && !roles.some(hasRole)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso denegado</h2>
          <p className="text-gray-500">No tienes permisos para ver esta página.</p>
        </div>
      </div>
    )
  }
  return children
}
