/**
 * Configuración central de la aplicación
 */

export const API_CONFIG = {
  // Timeouts
  REQUEST_TIMEOUT: 30000,
  
  // Paginación
  DEFAULT_PAGE_SIZE: 10,
  
  // Roles
  ROLES: {
    ADMIN: 'ADMIN',
    COMPRADOR: 'COMPRADOR',
    CONSULTA: 'CONSULTA',
  },

  // Estados de órdenes
  ORDER_STATES: {
    PENDIENTE: 'PENDIENTE',
    APROBADA: 'APROBADA',
    RECHAZADA: 'RECHAZADA',
    EN_TRANSITO: 'EN_TRANSITO',
    ENTREGADA: 'ENTREGADA',
  },

  // Validaciones
  VALIDATION: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^[0-9+\-\s()]{7,20}$/,
    NIT_REGEX: /^[0-9]{6,15}(-[0-9]{1})?$/,
  },
}

export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  if (error.message === 'Network Error') {
    return 'Error de conectividad. Verifica tu conexión a internet.'
  }
  if (error.code === 'ECONNABORTED') {
    return 'La solicitud tardó demasiado. Intenta nuevamente.'
  }
  return 'Ha ocurrido un error. Intenta nuevamente.'
}

export const getFieldErrors = (error) => {
  return error.response?.data?.details || []
}

export const isUnauthorized = (error) => error.response?.status === 401

export const isForbidden = (error) => error.response?.status === 403

export const isServerError = (error) => error.response?.status >= 500
