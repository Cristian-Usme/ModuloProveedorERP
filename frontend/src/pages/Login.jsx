import { useForm } from 'react-hook-form'
import { useNavigate, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import toast from 'react-hot-toast'

export default function Login() {
  const { auth, login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  if (auth) return <Navigate to="/dashboard" replace />

  async function onSubmit(data) {
    setLoading(true)
    try {
      const response = await authService.login(data)
      login(response)
      navigate('/dashboard')
    } catch (e) {
      toast.error(e.response?.data?.message ?? 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100">
      <div className="w-full max-w-md">
        <div className="card shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Proveedores</h1>
            <p className="text-sm text-gray-500 mt-1">UPB Medellín · Sistemas Empresariales 2026</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="admin@upb.edu.co"
              error={errors.email?.message}
              {...register('email', { required: 'El email es obligatorio' })}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', { required: 'La contraseña es obligatoria' })}
            />
            <Button type="submit" loading={loading} className="w-full">
              Iniciar sesión
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-500 space-y-1">
            <p className="font-medium text-gray-700 mb-2">Usuarios de prueba:</p>
            <p>admin@upb.edu.co — Test1234!</p>
            <p>comprador@upb.edu.co — Test1234!</p>
            <p>consulta@upb.edu.co — Test1234!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
