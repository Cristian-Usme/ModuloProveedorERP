import type { DashboardWidget } from '@/types/erp'

export const defaultWidgets: DashboardWidget[] = [
  { id: 'kpis', title: 'KPI Cards', subtitle: 'Ventas, margen, órdenes y stock crítico', kind: 'kpis', size: 'xl', accent: 'from-blue-500 to-cyan-500', enabledByDefault: true },
  { id: 'sales-trend', title: 'Ventas vs Ganancias', subtitle: 'Comparativo diario, semanal y mensual', kind: 'salesTrend', size: 'lg', accent: 'from-blue-600 to-sky-400', enabledByDefault: true },
  { id: 'category-donut', title: 'Ventas por Categoría', subtitle: 'Distribución por línea de negocio', kind: 'categoryDonut', size: 'md', accent: 'from-violet-500 to-fuchsia-400', enabledByDefault: true },
  { id: 'alerts', title: 'Alertas y Notificaciones', subtitle: 'Prioridades operativas del día', kind: 'alerts', size: 'md', accent: 'from-amber-500 to-orange-400', enabledByDefault: true },
  { id: 'activity', title: 'Actividades Recientes', subtitle: 'Movimiento operativo en tiempo real', kind: 'activity', size: 'md', accent: 'from-emerald-500 to-teal-400', enabledByDefault: true },
  { id: 'inventory', title: 'Estado de Inventario', subtitle: 'Stock, mínimos y ubicación', kind: 'inventory', size: 'lg', accent: 'from-sky-500 to-blue-400', enabledByDefault: true },
  { id: 'top-products', title: 'Top Productos', subtitle: 'Ranking de ventas y facturación', kind: 'topProducts', size: 'md', accent: 'from-fuchsia-500 to-pink-400', enabledByDefault: true },
  { id: 'cash-flow', title: 'Flujo de Caja', subtitle: 'Entrada, salida y neto', kind: 'cashFlow', size: 'lg', accent: 'from-emerald-500 to-lime-400', enabledByDefault: true },
  { id: 'warehouse-map', title: 'Mapa de Bodega', subtitle: 'Zonas operativas por rotación', kind: 'warehouseMap', size: 'md', accent: 'from-indigo-500 to-sky-400', enabledByDefault: true },
  { id: 'modules', title: 'Módulos Principales', subtitle: 'Acceso rápido a procesos clave', kind: 'modules', size: 'md', accent: 'from-blue-500 to-indigo-400', enabledByDefault: true },
  { id: 'ai', title: 'Análisis rápido con IA', subtitle: 'Insights y predicción de demanda', kind: 'ai', size: 'lg', accent: 'from-cyan-500 to-blue-400', enabledByDefault: true },
]