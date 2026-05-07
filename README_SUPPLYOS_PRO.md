# SupplyOS PRO v4.0 - Guía de Mejoras

## 🎯 Nuevas Características Implementadas

### 1. **Sistema Avanzado de Proveedores**
- ✅ Crear nuevos proveedores con validación completa
- ✅ Soft delete (deactivate without losing data)
- ✅ Restaurar proveedores inactivos
- ✅ Sistema de calificación (★ estrellas)
- ✅ Campos extendidos: Website, Términos de Pago, Orden Mínima

### 2. **Gestión de Productos por Proveedor** ⭐ NUEVO
- ✅ Agregar productos directamente desde el modal del proveedor
- ✅ Validación automática de stock (min < max)
- ✅ Cálculo de margen de ganancia
- ✅ Descripción detallada del producto
- ✅ SKU único garantizado

### 3. **RBAC (Control de Acceso Basado en Roles)**
- 👑 **ADMIN**: Acceso total a todas las funciones
- 👔 **COMPRAS**: Puede crear órdenes, proveedores, productos
- 👤 **CONSULTA**: Solo lectura en reportes

### 4. **Validación Robusta de Datos**
```javascript
- Email válido: RFC 5322
- Teléfono: Formato internacional
- NIT: Longitud mínima validada
- Stock: minStock < maxStock
- Precios: Validación numérica
```

### 5. **Componentes Reutilizables Profesionales**

#### FormField.jsx
```jsx
<FormField
  label="Nombre del Proveedor"
  name="name"
  type="text"
  value={form.name}
  onChange={handleChange}
  error={errors.name}
  required={true}
  hint="Nombre comercial completo"
/>
```

#### DataTable.jsx
```jsx
<DataTable
  columns={[
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'rating', label: 'Calificación', render: (val) => `${val} ★` }
  ]}
  data={products}
  searchable={true}
  paginated={true}
  actions={[
    { label: 'Editar', onClick: handleEdit, icon: '✎' }
  ]}
/>
```

#### AlertCard.jsx
```jsx
<AlertCard
  type="warning"
  title="Stock Crítico"
  message="iPhone 15 Pro tiene solo 3 días de inventario"
  icon="⚠"
  actions={[
    { label: 'Crear OC', onClick: createOrder, variant: 'primary' }
  ]}
/>
```

## 📊 Acceso a la Nueva Interfaz

### Opción 1: Ruta Directa
```
http://localhost:5173/erp
```

### Opción 2: Desde el Backend
Integrar con la ruta en `App.jsx`:
```jsx
<Route path="/erp" element={<SupplyOSPro />} />
```

## 🔐 Roles y Permisos

### ADMIN (Administrador)
- ✅ Crear/Editar/Eliminar Proveedores
- ✅ Crear/Editar/Eliminar Productos
- ✅ Aprobar/Rechazar Órdenes
- ✅ Calificar Proveedores
- ✅ Gestionar Usuarios

### COMPRAS (Encargado de Compras)
- ✅ Crear Órdenes de Compra
- ✅ Crear Proveedores
- ✅ Agregar Productos a Proveedores
- ✅ Calificar Proveedores
- ❌ No puede Eliminar Proveedores
- ❌ No puede Aprobar Órdenes

### CONSULTA (Usuario de Consulta)
- ✅ Ver Dashboard
- ✅ Ver Reportes
- ✅ Consultar Stock
- ❌ No puede Crear/Editar/Eliminar
- ❌ No puede Crear Órdenes

## 📋 Flujos de Trabajo

### Agregar Nuevo Proveedor
1. Click en "+ Nuevo Proveedor"
2. Completar formulario con validación
3. El sistema genera ID automático (S-001, S-002, etc)
4. Aparece en listado inmediatamente

### Agregar Producto a Proveedor
1. Desde card de Proveedor → Click "+Pro"
2. Seleccionar Proveedor (pre-seleccionado)
3. Completar datos del producto
4. Sistema calcula lead time automáticamente
5. Producto disponible en Stock & Productos

### Estado de Órdenes de Compra
```
PENDIENTE → APROBADA → EN_TRANSITO → ENTREGADA
         ↘ RECHAZADA
         ↘ CANCELADA
```

## 🎨 Paleta de Colores y Estados

### Stock Status
- 🟢 **OK**: Verde (#22c55e) - Stock normal
- 🟡 **BAJO**: Amarillo (#f59e0b) - por debajo de mínimo
- 🔴 **CRÍTICO**: Rojo (#ef4444) - muy bajo
- ⚫ **AGOTADO**: Rojo oscuro (#dc2626) - stock = 0

### OC Status
- ⚪ **PENDIENTE**: Gris (#94a3b8)
- 🔵 **APROBADA**: Azul (#60a5fa)
- 🟡 **EN_TRANSITO**: Amarillo (#fbbf24)
- 🟢 **ENTREGADA**: Verde (#34d399)
- ❌ **RECHAZADA**: Rojo (#f87171)
- ⚫ **CANCELADA**: Gris oscuro (#475569)

## 📈 Próximas Mejoras Sugeridas

1. **Importar/Exportar** (CSV, Excel)
2. **Auditoría de Cambios** (quién, cuándo, qué cambió)
3. **Integración de Imágenes** para productos
4. **Historial de Precios** de proveedores
5. **Alertas por Email** para stock crítico
6. **API REST** completa para móvil
7. **Reportes Avanzados** (PDF, gráficos)
8. **Dashboard en Tiempo Real** con WebSockets

## 🔧 Variables de Entorno

```env
VITE_API_URL=http://localhost:8080/api
VITE_ROLE_DEFAULT=CONSULTA
```

## 📚 Estructura de Datos

### Supplier
```javascript
{
  id: "S-001",
  name: "TechSupply Global",
  category: "Electrónicos",
  country: "China 🇨🇳",
  contact: "wei.zhang@techsupply.cn", // email
  phone: "+86 10 8888 9999",
  leadTime: 14,
  nit: "900.123.456-1",
  address: "Shenzhen Industrial Park",
  website: "techsupply.cn",
  paymentTerms: "30 días",
  minimumOrder: 1000,
  deleted: false,
  rating: 4.7,
  ratingCount: 12,
  totalOrders: 8,
  totalSpent: 4850000,
  createdAt: "2023-01-15"
}
```

### Product
```javascript
{
  id: "P-001",
  name: "iPhone 15 Pro",
  category: "Electrónicos",
  sku: "APL-IP15P-128",
  stock: 15,
  minStock: 20,
  maxStock: 150,
  supplierId: "S-001",
  unitCost: 3200000,
  salePrice: 4680000,
  leadTime: 14,
  lastOrder: "2024-04-15",
  createdAt: "2023-05-10",
  description: "Smartphone premium Apple"
}
```

### Order (Orden de Compra)
```javascript
{
  id: "OC-2024-089",
  supplierId: "S-001",
  productId: "P-001",
  qty: 50,
  unitCost: 3200000,
  status: "EN_TRANSITO",
  createdAt: "2024-04-28",
  eta: "2024-05-12",
  approvedBy: "Admin",
  notes: "Reposición urgente stock crítico"
}
```

## 🚀 Deployment

### Frontend
```bash
npm install
npm run build
npm run preview
```

### Backend (Integración)
```bash
curl -X POST http://localhost:8080/api/suppliers \
  -H "Content-Type: application/json" \
  -d @payload.json
```

## 📞 Soporte

Para preguntas o problemas:
1. Revisar la consola de navegador (DevTools)
2. Validar estructura de datos
3. Verificar permisos del rol asignado
4. Consultar logs del backend

---

**Última actualización**: Mayo 2024 | **Versión**: 4.0 PRO
