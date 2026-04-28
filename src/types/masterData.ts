export type MasterDataKind = 'users' | 'customers' | 'suppliers' | 'products' | 'inventory'

export type MasterRecord = {
  id: string
  createdAt: string
  status: 'Activo' | 'Pendiente' | 'Crítico' | 'Bajo' | 'Bloqueado'
}

export type UserRecord = MasterRecord & {
  name: string
  email: string
  role: 'Super Admin' | 'Admin' | 'Finanzas' | 'Ventas' | 'Bodega' | 'Operador' | 'Lectura'
  company: string
}

export type CustomerRecord = MasterRecord & {
  name: string
  taxId: string
  segment: string
  email: string
  phone: string
  city: string
  creditLimit: number
}

export type SupplierRecord = MasterRecord & {
  companyName: string
  contactName: string
  category: string
  email: string
  phone: string
  leadTimeDays: number
}

export type ProductRecord = MasterRecord & {
  sku: string
  name: string
  category: string
  unit: string
  stock: number
  minStock: number
  warehouse: string
  location: string
  condition: string
}

export type InventoryRecord = MasterRecord & {
  sku: string
  productName: string
  warehouse: string
  zone: string
  rack: string
  shelf: string
  stock: number
  minStock: number
  unit: string
  stockType: string
  lastCount: string
}

export type MasterRecordMap = {
  users: UserRecord
  customers: CustomerRecord
  suppliers: SupplierRecord
  products: ProductRecord
  inventory: InventoryRecord
}

export type EntityFieldType = 'text' | 'email' | 'number' | 'select' | 'textarea'

export type EntityFieldOption = {
  label: string
  value: string
}

export type EntityField = {
  name: string
  label: string
  type: EntityFieldType
  placeholder?: string
  helperText?: string
  options?: EntityFieldOption[]
}

export type EntityConfig<K extends MasterDataKind> = {
  kind: K
  title: string
  eyebrow: string
  description: string
  accent: string
  collectionLabel: string
  fields: EntityField[]
  defaultValues: Record<string, string | number>
  seedRecords: MasterRecordMap[K][]
  columns: Array<{
    key: string
    label: string
    render: (record: MasterRecordMap[K]) => string | number
  }>
  buildRecord: (values: Record<string, string | number>) => MasterRecordMap[K]
}
