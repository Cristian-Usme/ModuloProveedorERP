import { createContext, useContext, useState, useCallback } from 'react'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token')
    if (!token) return null
    try {
      const decoded = jwtDecode(token)
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token')
        return null
      }
      return { token, ...decoded }
    } catch {
      localStorage.removeItem('token')
      return null
    }
  })

  const login = useCallback((authResponse) => {
    localStorage.setItem('token', authResponse.token)
    const decoded = jwtDecode(authResponse.token)
    setAuth({ token: authResponse.token, ...decoded, ...authResponse })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setAuth(null)
  }, [])

  const hasRole = useCallback(
    (role) => auth?.roles?.includes(role) ?? false,
    [auth]
  )

  const isAdmin    = useCallback(() => hasRole('ADMIN'),    [hasRole])
  const isComprador = useCallback(() => hasRole('COMPRADOR'), [hasRole])

  return (
    <AuthContext.Provider value={{ auth, login, logout, hasRole, isAdmin, isComprador }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
