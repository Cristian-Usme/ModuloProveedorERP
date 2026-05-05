/*
  API ENDPOINTS SUGERIDOS - SupplyOS PRO v4.0
  
  Este documento describe todos los endpoints RESTful que debería
  implementar el backend para soportar el nuevo ERP.
*/

// ═══════════════════════════════════════════════════════
// 1. PROVEEDORES (SUPPLIERS)
// ═══════════════════════════════════════════════════════

/**
 * GET /api/suppliers
 * Obtener lista de todos los proveedores
 * 
 * Query Params:
 *   - page: number (default 0)
 *   - limit: number (default 10)
 *   - search: string (buscar por nombre, email, nit)
 *   - status: 'activo' | 'inactivo' | 'todos'
 *   - sort: 'name' | 'rating' | 'leadTime' | 'createdAt'
 *   - order: 'asc' | 'desc'
 * 
 * Response:
 * {
 *   "data": [
 *     { id, name, category, country, contact, phone, leadTime, ... }
 *   ],
 *   "total": 15,
 *   "page": 0,
 *   "pageSize": 10
 * }
 */

/**
 * POST /api/suppliers
 * Crear nuevo proveedor
 * 
 * Body:
 * {
 *   "name": "TechSupply Global",
 *   "category": "Electrónicos",
 *   "country": "China 🇨🇳",
 *   "contact": "wei.zhang@techsupply.cn",
 *   "phone": "+86 10 8888 9999",
 *   "leadTime": 14,
 *   "nit": "900.123.456-1",
 *   "address": "Shenzhen Industrial Park",
 *   "website": "techsupply.cn",
 *   "paymentTerms": "30 días",
 *   "minimumOrder": 1000
 * }
 * 
 * Response: { id, ...supplier, createdAt }
 */

/**
 * GET /api/suppliers/:id
 * Obtener detalle de un proveedor
 * 
 * Response:
 * {
 *   id, name, category, country, contact, phone, leadTime,
 *   nit, address, website, paymentTerms, minimumOrder,
 *   rating, ratingCount, totalOrders, totalSpent,
 *   products: [{ id, name, sku, stock, ... }],
 *   orders: [{ id, status, date, ... }],
 *   createdAt, updatedAt
 * }
 */

/**
 * PUT /api/suppliers/:id
 * Actualizar proveedor
 * 
 * Body: { name, contact, phone, leadTime, ... }
 */

/**
 * DELETE /api/suppliers/:id
 * Soft delete (marcar como inactivo)
 * 
 * Response: { deleted: true, deletedAt }
 */

/**
 * PATCH /api/suppliers/:id/restore
 * Restaurar proveedor eliminado
 * 
 * Response: { restored: true }
 */

/**
 * POST /api/suppliers/:id/rating
 * Calificar un proveedor
 * 
 * Body: { rating: 5, comment: "Excelente servicio" }
 * 
 * Response:
 * {
 *   id,
 *   averageRating: 4.7,
 *   ratingCount: 12,
 *   ratings: [{ userId, rating, comment, date }]
 * }
 */

// ═══════════════════════════════════════════════════════
// 2. PRODUCTOS (PRODUCTS)
// ═══════════════════════════════════════════════════════

/**
 * GET /api/products
 * Obtener lista de productos
 * 
 * Query Params:
 *   - page: number
 *   - limit: number
 *   - search: string (nombre, sku)
 *   - supplierId: string (filtrar por proveedor)
 *   - status: 'crítico' | 'bajo' | 'ok' | 'agotado'
 *   - sort: 'stock' | 'name' | 'leadTime' | 'salePrice'
 */

/**
 * POST /api/products
 * Crear nuevo producto
 * 
 * Body:
 * {
 *   "name": "iPhone 15 Pro",
 *   "supplierId": "S-001",
 *   "category": "Electrónicos",
 *   "sku": "APL-IP15P-128",
 *   "description": "Smartphone premium Apple",
 *   "stock": 15,
 *   "minStock": 20,
 *   "maxStock": 150,
 *   "unitCost": 3200000,
 *   "salePrice": 4680000
 * }
 * 
 * Response: { id, ...product, createdAt }
 */

/**
 * GET /api/products/:id
 * Obtener detalle de producto
 */

/**
 * PUT /api/products/:id
 * Actualizar producto
 */

/**
 * PATCH /api/products/:id/stock
 * Actualizar stock
 * 
 * Body: { stock: 25 }
 * 
 * Response: { id, stock, oldStock, updatedAt }
 */

/**
 * DELETE /api/products/:id
 * Eliminar producto (hard delete si no tiene órdenes)
 */

/**
 * GET /api/products/supplier/:supplierId
 * Obtener productos de un proveedor específico
 */

/**
 * GET /api/products/stock-status/critical
 * Obtener productos con stock crítico
 * 
 * Response: [{ id, name, stock, minStock, daysLeft, supplierId }]
 */

/**
 * GET /api/products/stock-status/low
 * Obtener productos con stock bajo
 */

// ═══════════════════════════════════════════════════════
// 3. ÓRDENES DE COMPRA (PURCHASE ORDERS)
// ═══════════════════════════════════════════════════════

/**
 * GET /api/orders
 * Obtener lista de órdenes de compra
 * 
 * Query Params:
 *   - page: number
 *   - limit: number
 *   - search: string (# orden)
 *   - status: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'EN_TRANSITO' | 'ENTREGADA' | 'CANCELADA'
 *   - supplierId: string
 *   - productId: string
 *   - startDate: YYYY-MM-DD
 *   - endDate: YYYY-MM-DD
 */

/**
 * POST /api/orders
 * Crear nueva orden de compra
 * 
 * Body:
 * {
 *   "supplierId": "S-001",
 *   "productId": "P-001",
 *   "qty": 50,
 *   "unitCost": 3200000,
 *   "notes": "Reposición urgente",
 *   "eta": "2024-05-12"
 * }
 * 
 * Response: { id, status: 'PENDIENTE', createdAt, ... }
 */

/**
 * GET /api/orders/:id
 * Obtener detalle de orden
 */

/**
 * PATCH /api/orders/:id/status
 * Cambiar estado de orden
 * 
 * Body: { status: 'APROBADA' | 'RECHAZADA' | 'EN_TRANSITO' | 'ENTREGADA' | 'CANCELADA' }
 * 
 * Response: { id, status, changedBy, changedAt }
 */

/**
 * POST /api/orders/:id/approve
 * Aprobar orden (requiere ADMIN)
 * 
 * Response: { id, status: 'APROBADA', approvedBy, approvedAt }
 */

/**
 * POST /api/orders/:id/reject
 * Rechazar orden (requiere ADMIN)
 * 
 * Body: { reason: "..." }
 */

/**
 * POST /api/orders/:id/cancel
 * Cancelar orden
 */

/**
 * PATCH /api/orders/:id/deliver
 * Registrar entrega
 * 
 * Body: { receivedQty: 50, notes: "..." }
 */

/**
 * GET /api/orders/stats/pending
 * Obtener estadísticas de órdenes pendientes
 * 
 * Response:
 * {
 *   total: 15,
 *   totalValue: 450000000,
 *   oldestOrder: { daysOld: 5, id, date },
 *   bySupplier: { "S-001": 3, "S-002": 2 }
 * }
 */

// ═══════════════════════════════════════════════════════
// 4. USUARIOS Y ROLES
// ═══════════════════════════════════════════════════════

/**
 * GET /api/users
 * Obtener lista de usuarios
 */

/**
 * POST /api/users
 * Crear nuevo usuario
 * 
 * Body:
 * {
 *   "email": "user@empresa.com",
 *   "name": "Nombre Usuario",
 *   "role": "COMPRAS" | "CONSULTA",
 *   "password": "..."
 * }
 */

/**
 * PATCH /api/users/:id/role
 * Cambiar rol de usuario
 * 
 * Body: { role: "COMPRAS" }
 */

/**
 * DELETE /api/users/:id
 * Desactivar usuario
 */

/**
 * GET /api/auth/permissions/:role
 * Obtener permisos de un rol
 * 
 * Response:
 * {
 *   "COMPRAS": {
 *     "createSupplier": true,
 *     "deleteSupplier": false,
 *     "approveOrder": false,
 *     ...
 *   }
 * }
 */

// ═══════════════════════════════════════════════════════
// 5. REPORTES Y ANALYTICS (REPORTS)
// ═══════════════════════════════════════════════════════

/**
 * GET /api/reports/inventory-summary
 * Resumen de inventario
 * 
 * Response:
 * {
 *   totalValue: 15000000,
 *   totalItems: 324,
 *   critical: 3,
 *   low: 5,
 *   ok: 10,
 *   averageDaysLeft: 15,
 *   daysToStockout: { min: 2, max: 45, average: 18 }
 * }
 */

/**
 * GET /api/reports/supplier-performance
 * Desempeño de proveedores
 * 
 * Response:
 * [
 *   {
 *     suppressId,
 *     name,
 *     rating,
 *     orders: { total, onTime, delayed },
 *     avgLeadTime,
 *     totalSpent
 *   }
 * ]
 */

/**
 * GET /api/reports/order-metrics
 * Métricas de órdenes
 * 
 * Query Params:
 *   - period: 'daily' | 'weekly' | 'monthly' | 'yearly'
 *   - startDate: YYYY-MM-DD
 *   - endDate: YYYY-MM-DD
 * 
 * Response:
 * [
 *   {
 *     date,
 *     created: 5,
 *     approved: 3,
 *     delivered: 2,
 *     rejected: 1,
 *     totalValue: 450000000
 *   }
 * ]
 */

/**
 * GET /api/reports/top-products
 * Productos más vendidos / ordenados
 * 
 * Response:
 * [
 *   {
 *     productId,
 *     name,
 *     totalOrdersQty: 500,
 *     totalSpent: 1600000000,
 *     margin: 45.2
 *   }
 * ]
 */

/**
 * GET /api/reports/export/csv
 * Exportar datos a CSV
 * 
 * Query Params:
 *   - type: 'suppliers' | 'products' | 'orders'
 *   - filter: JSON string con filtros
 */

/**
 * GET /api/reports/export/pdf
 * Exportar reporte a PDF
 * 
 * Query Params: (similar a CSV)
 */

// ═══════════════════════════════════════════════════════
// 6. AUDITORÍA Y HISTORIAL
// ═══════════════════════════════════════════════════════

/**
 * GET /api/audit/logs
 * Obtener registro de auditoría
 * 
 * Query Params:
 *   - entityType: 'supplier' | 'product' | 'order'
 *   - entityId: string
 *   - userId: string
 *   - action: 'create' | 'update' | 'delete' | 'approve'
 *   - startDate: YYYY-MM-DD
 *   - endDate: YYYY-MM-DD
 * 
 * Response:
 * [
 *   {
 *     id,
 *     timestamp,
 *     userId,
 *     userName,
 *     action,
 *     entityType,
 *     entityId,
 *     changes: { field: { oldValue, newValue } }
 *   }
 * ]
 */

/**
 * GET /api/audit/logs/:id/history
 * Obtener historial completo de una entidad
 */

// ═══════════════════════════════════════════════════════
// 7. DASHBOARDS EN TIEMPO REAL
// ═══════════════════════════════════════════════════════

/**
 * WebSocket: /ws/dashboard
 * Conexión en tiempo real para updates del dashboard
 * 
 * Events:
 *   - "order.created": nueva orden
 *   - "order.updated": orden actualizada
 *   - "stock.critical": stock crítico
 *   - "supplier.unavailable": proveedor no disponible
 * 
 * Message:
 * {
 *   "event": "order.created",
 *   "data": { id, supplierId, productId, status, ... }
 * }
 */

// ═══════════════════════════════════════════════════════
// ERRORES Y CÓDIGOS ESTÁNDAR
// ═══════════════════════════════════════════════════════

/**
 * 200 OK: Éxito
 * 201 CREATED: Recurso creado
 * 204 NO CONTENT: Éxito sin contenido
 * 
 * 400 BAD REQUEST: Datos inválidos
 * 401 UNAUTHORIZED: No autenticado
 * 403 FORBIDDEN: Sin permisos
 * 404 NOT FOUND: Recurso no existe
 * 409 CONFLICT: Conflicto (ej: SKU duplicado)
 * 422 UNPROCESSABLE ENTITY: Validación fallida
 * 
 * 500 INTERNAL SERVER ERROR: Error del servidor
 * 503 SERVICE UNAVAILABLE: Servicio no disponible
 * 
 * Error Response Format:
 * {
 *   "error": {
 *     "code": "INVALID_SKU",
 *     "message": "SKU duplicado",
 *     "details": "El SKU 'APL-IP15P' ya existe",
 *     "timestamp": "2024-05-05T10:30:00Z"
 *   }
 * }
 */

// ═══════════════════════════════════════════════════════
// AUTENTICACIÓN Y HEADERS
// ═══════════════════════════════════════════════════════

/**
 * Todo request debe incluir:
 * 
 * Headers:
 * {
 *   "Authorization": "Bearer <JWT_TOKEN>",
 *   "Content-Type": "application/json"
 * }
 * 
 * JWT Payload:
 * {
 *   "sub": "userId",
 *   "email": "user@empresa.com",
 *   "role": "ADMIN" | "COMPRAS" | "CONSULTA",
 *   "iat": 1234567890,
 *   "exp": 1234571490
 * }
 */

// ═══════════════════════════════════════════════════════
// CICLO DE VIDA DE UNA ORDEN
// ═══════════════════════════════════════════════════════

/**
 * 1. Usuario crea OC → status: PENDIENTE
 *    POST /api/orders
 * 
 * 2. Admin aprueba → status: APROBADA
 *    PATCH /api/orders/:id/status { status: "APROBADA" }
 * 
 * 3. Se envía al proveedor → status: EN_TRANSITO
 *    PATCH /api/orders/:id/status { status: "EN_TRANSITO" }
 * 
 * 4. Se entrega → status: ENTREGADA
 *    PATCH /api/orders/:id/status { status: "ENTREGADA" }
 *    - Actualizar stock del producto
 *    - Registrar en auditoría
 * 
 * O si es rechazada:
 * 2b. Admin rechaza → status: RECHAZADA
 *     PATCH /api/orders/:id/status { status: "RECHAZADA", reason: "..." }
 */
