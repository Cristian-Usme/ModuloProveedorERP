import type { NavigationItem } from '@/types/erp'

export const navigationSections: Array<{ label: string; items: NavigationItem[] }> = [
  {
    label: 'Principal',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: 'layout-dashboard', section: 'principal', description: 'Vista ejecutiva con KPI en tiempo real', primary: true },
      { label: 'Actividad en tiempo real', path: '/actividad', icon: 'activity', section: 'principal', description: 'Eventos, alertas y operaciones recientes' },
      { label: 'Calendario', path: '/calendario', icon: 'calendar-days', section: 'principal', description: 'Fechas críticas, hitos y entregas' },
    ],
  },
  {
    label: 'Operaciones',
    items: [
      { label: 'Ventas', path: '/operaciones/ventas', icon: 'shopping-cart', section: 'operaciones', description: 'Cotizaciones, pedidos y facturas' },
      { label: 'Compras', path: '/operaciones/compras', icon: 'package-plus', section: 'operaciones', description: 'Solicitudes, órdenes y recepción' },
      { label: 'Productos', path: '/operaciones/productos', icon: 'boxes', section: 'operaciones', description: 'Catálogo, SKU y control de stock' },
      { label: 'Inventario', path: '/operaciones/inventario', icon: 'boxes', section: 'operaciones', description: 'Kardex, lotes y stock mínimo' },
      { label: 'Producción', path: '/operaciones/produccion', icon: 'factory', section: 'operaciones', description: 'Órdenes, BOM y costeo' },
      { label: 'Bodega', path: '/operaciones/bodega', icon: 'warehouse', section: 'operaciones', description: 'Ubicaciones, picking y packing' },
      { label: 'Logística', path: '/operaciones/logistica', icon: 'truck', section: 'operaciones', description: 'Rutas, entregas y seguimiento' },
      { label: 'Calidad', path: '/operaciones/calidad', icon: 'shield-check', section: 'operaciones', description: 'No conformidades y control de calidad' },
    ],
  },
  {
    label: 'Finanzas',
    items: [
      { label: 'Finanzas', path: '/finanzas', icon: 'wallet', section: 'finanzas', description: 'Flujo de caja, bancos y tesorería' },
      { label: 'Contabilidad', path: '/contabilidad', icon: 'calculator', section: 'finanzas', description: 'Libro diario, balance y P&G' },
      { label: 'Facturación', path: '/facturacion', icon: 'file-text', section: 'finanzas', description: 'Emisión y seguimiento de facturas' },
      { label: 'Tesorería', path: '/tesoreria', icon: 'landmark', section: 'finanzas', description: 'Cuentas por cobrar y pagar' },
      { label: 'Presupuesto', path: '/presupuesto', icon: 'chart-column-increasing', section: 'finanzas', description: 'Proyecciones y control presupuestal' },
    ],
  },
  {
    label: 'Clientes y Proveedores',
    items: [
      { label: 'Clientes', path: '/clientes', icon: 'users', section: 'clientes', description: 'Historial, cartera y seguimiento' },
      { label: 'Proveedores', path: '/proveedores', icon: 'truck', section: 'clientes', description: 'Cotizaciones y evaluación' },
      { label: 'CRM', path: '/crm', icon: 'handshake', section: 'clientes', description: 'Leads, embudo y tareas comerciales' },
    ],
  },
  {
    label: 'Reportes e IA',
    items: [
      { label: 'Reportes', path: '/reportes', icon: 'file-chart-column', section: 'reportes', description: 'KPIs, exportaciones y PDF' },
      { label: 'Analítica', path: '/analitica', icon: 'sparkles', section: 'reportes', description: 'Insights, tendencias y predicción' },
      { label: 'Paneles personalizados', path: '/paneles-personalizados', icon: 'panel-top', section: 'reportes', description: 'Dashboards configurables por usuario' },
    ],
  },
  {
    label: 'Configuración',
    items: [
      { label: 'Usuarios y Roles', path: '/configuracion/usuarios-roles', icon: 'user-round-cog', section: 'configuracion', description: 'Permisos por módulo y auditoría' },
      { label: 'Seguridad', path: '/configuracion/seguridad', icon: 'shield', section: 'configuracion', description: 'MFA, reglas y acceso seguro' },
      { label: 'Integraciones', path: '/configuracion/integraciones', icon: 'plug-zap', section: 'configuracion', description: 'ERP, APIs y automatizaciones' },
      { label: 'Logs del sistema', path: '/configuracion/logs', icon: 'scroll-text', section: 'configuracion', description: 'Trazabilidad y eventos críticos' },
    ],
  },
]

export const bottomNavigation = navigationSections.flatMap((section) => section.items).filter((item) => item.primary || item.label === 'Ventas' || item.label === 'Inventario' || item.label === 'Finanzas' || item.label === 'CRM')