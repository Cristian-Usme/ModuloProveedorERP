export type Role =
  | 'Super Admin'
  | 'Admin'
  | 'Finanzas'
  | 'Ventas'
  | 'Bodega'
  | 'Operador'
  | 'Lectura'

export type NavSection = 'principal' | 'operaciones' | 'finanzas' | 'clientes' | 'reportes' | 'configuracion'

export type NavigationItem = {
  label: string
  path: string
  icon: string
  section: NavSection
  description: string
  primary?: boolean
}

export type WidgetSize = 'sm' | 'md' | 'lg' | 'xl'

export type DashboardWidgetKind =
  | 'kpis'
  | 'salesTrend'
  | 'categoryDonut'
  | 'alerts'
  | 'activity'
  | 'inventory'
  | 'topProducts'
  | 'cashFlow'
  | 'warehouseMap'
  | 'modules'
  | 'ai'
  | 'custom'

export type DashboardWidget = {
  id: string
  title: string
  subtitle: string
  kind: DashboardWidgetKind
  size: WidgetSize
  accent: string
  enabledByDefault?: boolean
}

export type ModuleDefinition = {
  key: string
  path: string
  title: string
  subtitle: string
  color: string
  metrics: Array<{ label: string; value: string; delta: string }>
  highlights: string[]
}

export type CustomWidgetDraft = {
  title: string
  subtitle: string
  accent: string
  size: WidgetSize
  value: string
}