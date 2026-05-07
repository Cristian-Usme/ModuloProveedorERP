import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: 30000,
})

// Interceptor de request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// Interceptor de response
api.interceptors.response.use(
  (response) => {
    console.debug('[API Response OK]', response.config.method.toUpperCase(), response.config.url)
    return response
  },
  (error) => {
    console.error('[API Response Error]', error.response?.status, error.response?.data?.message)

    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }

    if (error.response?.status === 403) {
      // Acceso denegado - mostrar mensaje personalizado
      console.warn('[FORBIDDEN] No tienes permisos para esta acción')
    }

    if (error.response?.status === 500) {
      // Error del servidor
      console.error('[SERVER ERROR]', error.response?.data?.message)
    }

    return Promise.reject(error)
  }
)

export default api

