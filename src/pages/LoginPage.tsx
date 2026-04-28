import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

type AuthMode = 'signin' | 'signup'

export default function LoginPage() {
  const navigate = useNavigate()
  const { signIn, signUp, loading, error } = useAuthStore()
  const [mode, setMode] = useState<AuthMode>('signin')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    companyId: '',
  })
  const [localError, setLocalError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setLocalError(null)
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    try {
      if (mode === 'signin') {
        if (!formData.email || !formData.password) {
          setLocalError('Email and password are required')
          return
        }
        if (!validateEmail(formData.email)) {
          setLocalError('Invalid email format')
          return
        }
        await signIn(formData.email, formData.password)
      } else {
        if (!formData.email || !formData.password || !formData.fullName || !formData.companyId) {
          setLocalError('All fields are required')
          return
        }
        if (!validateEmail(formData.email)) {
          setLocalError('Invalid email format')
          return
        }
        if (formData.password.length < 6) {
          setLocalError('Password must be at least 6 characters')
          return
        }
        await signUp(formData.email, formData.password, formData.fullName, formData.companyId)
      }

      // Redirect on success
      navigate('/dashboard')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed'
      setLocalError(errorMessage)
    }
  }

  const displayError = localError || error

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">ModuloProveedor</h1>
          <p className="text-slate-300">Professional ERP Solution</p>
        </div>

        {/* Auth Card */}
        <Card className="p-8 shadow-2xl border-slate-700">
          {/* Mode selector */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setMode('signin')
                setLocalError(null)
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                mode === 'signin'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup')
                setLocalError(null)
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                mode === 'signup'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error message */}
            {displayError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{displayError}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                disabled={loading}
                className="w-full"
              />
            </div>

            {/* Full Name (Sign Up Only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">Full Name</label>
                <Input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  disabled={loading}
                  className="w-full"
                />
              </div>
            )}

            {/* Company ID (Sign Up Only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">Company ID</label>
                <Input
                  type="text"
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleChange}
                  placeholder="company-id"
                  disabled={loading}
                  className="w-full"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Password</label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={loading}
                className="w-full"
              />
              {mode === 'signup' && (
                <p className="text-xs text-slate-400 mt-1">Minimum 6 characters</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 rounded-lg transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : mode === 'signin' ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-blue-300 text-center">
              {mode === 'signin'
                ? 'Demo credentials will be available after first user signup'
                : 'Create your account to start using ModuloProveedor'}
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-slate-400 text-sm">
          <p>Version 1.0.0 • Professional ERP Solution</p>
        </div>
      </div>
    </div>
  )
}
