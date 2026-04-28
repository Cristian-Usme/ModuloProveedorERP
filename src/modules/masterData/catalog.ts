import type { ColumnDef } from '@tanstack/react-table'
import type {
  CustomerRecord,
  EntityConfig,
  InventoryRecord,
  MasterDataKind,
  ProductRecord,
  SupplierRecord,
  UserRecord,
} from '@/types/masterData'
import { formatCurrency, formatNumber } from '@/utils/format'

const now = () => new Date().toISOString()

const baseRecord = {
  createdAt: now(),
  status: 'Activo' as const,
}

const roleOptions = [
  { label: 'Super Admin', value: 'Super Admin' },
  { label: 'Admin', value: 'Admin' },
  { label: 'Finanzas', value: 'Finanzas' },
  { label: 'Ventas', value: 'Ventas' },
  { label: 'Bodega', value: 'Bodega' },
  { label: 'Operador', value: 'Operador' },
  { label: 'Lectura', value: 'Lectura' },
]

const statusOptions = [
  { label: 'Activo', value: 'Activo' },
  { label: 'Pendiente', value: 'Pendiente' },
  { label: 'Crítico', value: 'Crítico' },
  { label: 'Bajo', value: 'Bajo' },
  { label: 'Bloqueado', value: 'Bloqueado' },
]

const warehouseOptions = [
  { label: 'Bodega Central', value: 'Bodega Central' },
  { label: 'Planta Norte', value: 'Planta Norte' },
  { label: 'Sucursal Sur', value: 'Sucursal Sur' },
  { label: 'CD Logístico', value: 'CD Logístico' },
]

const inventoryZoneOptions = [
  { label: 'Alta rotación', value: 'Alta rotación' },
  { label: 'Media', value: 'Media' },
  { label: 'Baja', value: 'Baja' },
  { label: 'Vacío', value: 'Vacío' },
]

const inventoryTypeOptions = [
  { label: 'Materia prima', value: 'Materia prima' },
  { label: 'Producto terminado', value: 'Producto terminado' },
  { label: 'Repuesto', value: 'Repuesto' },
  { label: 'Embalaje', value: 'Embalaje' },
]

// Seed data removed - users manage their own data through the app

function buildColumns(config: EntityConfig<any>): ColumnDef<any>[] {
  return config.columns.map((column) => ({
    id: column.key,
    accessorFn: (record) => column.render(record),
    header: column.label,
    cell: (info) => info.getValue(),
  }))
}

export const masterDataCatalog = {
  users: {
    kind: 'users',
    title: 'Usuarios y Roles',
    eyebrow: 'Acceso y seguridad',
    description: 'Registra usuarios internos o de clientes con permisos por módulo y trazabilidad básica.',
    accent: 'from-blue-500 to-cyan-400',
    collectionLabel: 'usuarios',
    fields: [
      { name: 'name', label: 'Nombre completo', type: 'text', placeholder: 'Nombre del usuario' },
      { name: 'email', label: 'Correo', type: 'email', placeholder: 'usuario@empresa.com' },
      { name: 'role', label: 'Rol', type: 'select', options: roleOptions },
      { name: 'company', label: 'Empresa', type: 'text', placeholder: 'Nombre de la empresa' },
      { name: 'status', label: 'Estado', type: 'select', options: statusOptions },
    ],
    defaultValues: { name: '', email: '', role: 'Lectura', company: '', status: 'Activo' },
    seedRecords: [],
    columns: [
      { key: 'name', label: 'Nombre', render: (record) => record.name },
      { key: 'email', label: 'Correo', render: (record) => record.email },
      { key: 'role', label: 'Rol', render: (record) => record.role },
      { key: 'company', label: 'Empresa', render: (record) => record.company },
      { key: 'status', label: 'Estado', render: (record) => record.status },
    ],
    buildRecord: (values) => ({
      id: `user-${crypto.randomUUID()}`,
      createdAt: now(),
      status: values.status as UserRecord['status'],
      name: String(values.name),
      email: String(values.email),
      role: values.role as UserRecord['role'],
      company: String(values.company),
    }),
  },
  customers: {
    kind: 'customers',
    title: 'Clientes',
    eyebrow: 'Ventas y cartera',
    description: 'Alta de clientes, segmentos, cupos de crédito y datos de contacto.',
    accent: 'from-emerald-500 to-teal-400',
    collectionLabel: 'clientes',
    fields: [
      { name: 'name', label: 'Razón social', type: 'text', placeholder: 'Nombre del cliente' },
      { name: 'taxId', label: 'NIT / ID', type: 'text', placeholder: '900.000.000-0' },
      { name: 'segment', label: 'Segmento', type: 'text', placeholder: 'Industrial, retail, logístico...' },
      { name: 'email', label: 'Correo', type: 'email', placeholder: 'compras@cliente.com' },
      { name: 'phone', label: 'Teléfono', type: 'text', placeholder: '+57...' },
      { name: 'city', label: 'Ciudad', type: 'text', placeholder: 'Ciudad' },
      { name: 'creditLimit', label: 'Cupo de crédito', type: 'number', placeholder: '0' },
      { name: 'status', label: 'Estado', type: 'select', options: statusOptions },
    ],
    defaultValues: { name: '', taxId: '', segment: '', email: '', phone: '', city: '', creditLimit: 0, status: 'Activo' },
    seedRecords: [],
    columns: [
      { key: 'name', label: 'Cliente', render: (record) => record.name },
      { key: 'taxId', label: 'ID fiscal', render: (record) => record.taxId },
      { key: 'segment', label: 'Segmento', render: (record) => record.segment },
      { key: 'city', label: 'Ciudad', render: (record) => record.city },
      { key: 'creditLimit', label: 'Cupo', render: (record) => formatCurrency(record.creditLimit) },
      { key: 'status', label: 'Estado', render: (record) => record.status },
    ],
    buildRecord: (values) => ({
      id: `customer-${crypto.randomUUID()}`,
      createdAt: now(),
      status: values.status as CustomerRecord['status'],
      name: String(values.name),
      taxId: String(values.taxId),
      segment: String(values.segment),
      email: String(values.email),
      phone: String(values.phone),
      city: String(values.city),
      creditLimit: Number(values.creditLimit),
    }),
  },
  suppliers: {
    kind: 'suppliers',
    title: 'Proveedores',
    eyebrow: 'Compras y abastecimiento',
    description: 'Administra proveedores, tiempos de entrega y categorías suministradas.',
    accent: 'from-violet-500 to-fuchsia-400',
    collectionLabel: 'proveedores',
    fields: [
      { name: 'companyName', label: 'Empresa', type: 'text', placeholder: 'Nombre del proveedor' },
      { name: 'contactName', label: 'Contacto', type: 'text', placeholder: 'Nombre del contacto' },
      { name: 'category', label: 'Categoría', type: 'text', placeholder: 'Materia prima, embalaje...' },
      { name: 'email', label: 'Correo', type: 'email', placeholder: 'ventas@proveedor.com' },
      { name: 'phone', label: 'Teléfono', type: 'text', placeholder: '+57...' },
      { name: 'leadTimeDays', label: 'Días de entrega', type: 'number', placeholder: '0' },
      { name: 'status', label: 'Estado', type: 'select', options: statusOptions },
    ],
    defaultValues: { companyName: '', contactName: '', category: '', email: '', phone: '', leadTimeDays: 0, status: 'Activo' },
    seedRecords: [],
    columns: [
      { key: 'companyName', label: 'Proveedor', render: (record) => record.companyName },
      { key: 'contactName', label: 'Contacto', render: (record) => record.contactName },
      { key: 'category', label: 'Categoría', render: (record) => record.category },
      { key: 'leadTimeDays', label: 'Lead time', render: (record) => `${record.leadTimeDays} días` },
      { key: 'status', label: 'Estado', render: (record) => record.status },
    ],
    buildRecord: (values) => ({
      id: `supplier-${crypto.randomUUID()}`,
      createdAt: now(),
      status: values.status as SupplierRecord['status'],
      companyName: String(values.companyName),
      contactName: String(values.contactName),
      category: String(values.category),
      email: String(values.email),
      phone: String(values.phone),
      leadTimeDays: Number(values.leadTimeDays),
    }),
  },
  products: {
    kind: 'products',
    title: 'Productos',
    eyebrow: 'Catálogo y stock',
    description: 'Crea productos con SKU, ubicación y nivel mínimo para controlar inventario.',
    accent: 'from-amber-500 to-orange-400',
    collectionLabel: 'productos',
    fields: [
      { name: 'sku', label: 'SKU', type: 'text', placeholder: 'PROD-001' },
      { name: 'name', label: 'Nombre', type: 'text', placeholder: 'Nombre del producto' },
      { name: 'category', label: 'Categoría', type: 'text', placeholder: 'Repuesto, materia prima...' },
      { name: 'unit', label: 'Unidad', type: 'text', placeholder: 'Und, caja, metro...' },
      { name: 'stock', label: 'Stock actual', type: 'number', placeholder: '0' },
      { name: 'minStock', label: 'Stock mínimo', type: 'number', placeholder: '0' },
      { name: 'warehouse', label: 'Bodega', type: 'select', options: warehouseOptions },
      { name: 'location', label: 'Ubicación', type: 'text', placeholder: 'Zona A-03' },
      { name: 'condition', label: 'Condición', type: 'select', options: [
        { label: 'Disponible', value: 'Disponible' },
        { label: 'Crítico', value: 'Crítico' },
        { label: 'Bajo', value: 'Bajo' },
      ] },
    ],
    defaultValues: { sku: '', name: '', category: '', unit: 'Und', stock: 0, minStock: 0, warehouse: 'Bodega Central', location: '', condition: 'Disponible' },
    seedRecords: [],
    columns: [
      { key: 'sku', label: 'SKU', render: (record) => record.sku },
      { key: 'name', label: 'Producto', render: (record) => record.name },
      { key: 'warehouse', label: 'Bodega', render: (record) => record.warehouse },
      { key: 'location', label: 'Ubicación', render: (record) => record.location },
      { key: 'stock', label: 'Stock', render: (record) => formatNumber(record.stock) },
      { key: 'minStock', label: 'Mínimo', render: (record) => formatNumber(record.minStock) },
      { key: 'condition', label: 'Condición', render: (record) => record.condition },
    ],
    buildRecord: (values) => ({
      id: `product-${crypto.randomUUID()}`,
      createdAt: now(),
      status: (Number(values.stock) <= Number(values.minStock) ? 'Crítico' : 'Activo') as ProductRecord['status'],
      sku: String(values.sku),
      name: String(values.name),
      category: String(values.category),
      unit: String(values.unit),
      stock: Number(values.stock),
      minStock: Number(values.minStock),
      warehouse: String(values.warehouse),
      location: String(values.location),
      condition: String(values.condition),
    }),
  },
  inventory: {
    kind: 'inventory',
    title: 'Inventario y ubicaciones',
    eyebrow: 'Bodega y stock',
    description: 'Visualiza dónde está cada SKU, cómo se almacena y cuántas unidades reales tienes.',
    accent: 'from-cyan-500 to-blue-400',
    collectionLabel: 'inventario',
    fields: [
      { name: 'sku', label: 'SKU', type: 'text', placeholder: 'PROD-001' },
      { name: 'productName', label: 'Producto', type: 'text', placeholder: 'Nombre del producto' },
      { name: 'warehouse', label: 'Bodega', type: 'select', options: warehouseOptions },
      { name: 'zone', label: 'Zona', type: 'select', options: inventoryZoneOptions },
      { name: 'rack', label: 'Rack', type: 'text', placeholder: 'A' },
      { name: 'shelf', label: 'Nivel', type: 'text', placeholder: '03' },
      { name: 'stock', label: 'Stock', type: 'number', placeholder: '0' },
      { name: 'minStock', label: 'Stock mínimo', type: 'number', placeholder: '0' },
      { name: 'unit', label: 'Unidad', type: 'text', placeholder: 'Und' },
      { name: 'stockType', label: 'Tipo de almacenamiento', type: 'select', options: [
        { label: 'Picking', value: 'Picking' },
        { label: 'Reserva', value: 'Reserva' },
        { label: 'Control', value: 'Control' },
      ] },
      { name: 'lastCount', label: 'Último conteo', type: 'text', placeholder: '2026-04-28' },
      { name: 'status', label: 'Estado', type: 'select', options: statusOptions },
    ],
    defaultValues: {
      sku: '',
      productName: '',
      warehouse: 'Bodega Central',
      zone: 'Alta rotación',
      rack: '',
      shelf: '',
      stock: 0,
      minStock: 0,
      unit: 'Und',
      stockType: 'Picking',
      lastCount: new Date().toISOString().slice(0, 10),
      status: 'Activo',
    },
    seedRecords: [],
    columns: [
      { key: 'productName', label: 'Producto', render: (record) => record.productName },
      { key: 'warehouse', label: 'Bodega', render: (record) => record.warehouse },
      { key: 'zone', label: 'Zona', render: (record) => record.zone },
      { key: 'rack', label: 'Rack', render: (record) => record.rack },
      { key: 'shelf', label: 'Nivel', render: (record) => record.shelf },
      { key: 'stock', label: 'Stock', render: (record) => formatNumber(record.stock) },
      { key: 'minStock', label: 'Mínimo', render: (record) => formatNumber(record.minStock) },
      { key: 'stockType', label: 'Almacenamiento', render: (record) => record.stockType },
      { key: 'lastCount', label: 'Último conteo', render: (record) => record.lastCount },
    ],
    buildRecord: (values) => ({
      id: `inv-${crypto.randomUUID()}`,
      createdAt: now(),
      status: (Number(values.stock) <= Number(values.minStock) ? 'Crítico' : 'Activo') as InventoryRecord['status'],
      sku: String(values.sku),
      productName: String(values.productName),
      warehouse: String(values.warehouse),
      zone: String(values.zone),
      rack: String(values.rack),
      shelf: String(values.shelf),
      stock: Number(values.stock),
      minStock: Number(values.minStock),
      unit: String(values.unit),
      stockType: String(values.stockType),
      lastCount: String(values.lastCount),
    }),
  },
} as Record<MasterDataKind, EntityConfig<any>>

export const masterDataKinds = Object.keys(masterDataCatalog) as MasterDataKind[]

export const masterDataColumns = Object.fromEntries(
  masterDataKinds.map((kind) => [kind, buildColumns(masterDataCatalog[kind])]),
) as Record<MasterDataKind, ColumnDef<any>[]>
