import * as admin from 'firebase-admin'
import { onCall, HttpsError } from 'firebase-functions/v2/https'

admin.initializeApp()

function hasAllowedRole(role: string | undefined) {
  return role != null && ['Super Admin', 'Admin', 'Finanzas', 'Ventas', 'Bodega', 'Operador'].includes(role)
}

export const healthCheck = onCall(() => {
  return {
    ok: true,
    service: 'ModuloProveedorERP',
    timestamp: new Date().toISOString(),
  }
})

export const createReportSnapshot = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Debes iniciar sesión para generar reportes.')
  }

  if (!hasAllowedRole(request.auth.token.role as string | undefined)) {
    throw new HttpsError('permission-denied', 'Tu rol no tiene permisos para generar reportes.')
  }

  return {
    ok: true,
    generatedBy: request.auth.token.email ?? 'system',
    payload: request.data ?? {},
  }
})

export const syncInventoryAlert = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Debes iniciar sesión para sincronizar alertas.')
  }

  if (!hasAllowedRole(request.auth.token.role as string | undefined)) {
    throw new HttpsError('permission-denied', 'Tu rol no tiene permisos para sincronizar alertas.')
  }

  return {
    ok: true,
    status: 'queued',
    requestedBy: request.auth.uid,
    data: request.data ?? {},
  }
})