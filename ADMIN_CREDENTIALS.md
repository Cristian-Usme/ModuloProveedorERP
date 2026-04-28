# 🔐 Configuración de Administrador - ModuloProveedor ERP

## Creación del Primer Usuario (Super Admin)

### Opción 1: Registro Manual en la Aplicación (Recomendado)

#### Paso 1: Acceder a la Aplicación
1. Abre: `https://tudominio.com/login`
2. Haz clic en **"Sign Up"**

#### Paso 2: Registrar Credenciales
```
Email:     admin@tuempresa.com
Password:  TuContraseña123!  (mín. 6 caracteres)
Full Name: Administrador
Company ID: empresa-001
```

#### Paso 3: Promocionar a Super Admin
Después del registro, debes actualizar el rol en Firebase Firestore:

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Navega a **Firestore Database**
4. Abre la colección **`users`**
5. Busca el documento con tu email registrado
6. Haz clic y edita el documento
7. Cambia el campo `role` de `"viewer"` a `"super_admin"`

**Documento actualizado debe verse así:**
```json
{
  "id": "YOUR_UID_FROM_AUTH",
  "uid": "YOUR_UID_FROM_AUTH", 
  "email": "admin@tuempresa.com",
  "fullName": "Administrador",
  "role": "super_admin",
  "companyId": "empresa-001",
  "status": "active",
  "createdAt": "2026-04-28T...",
  "updatedAt": "2026-04-28T...",
  "lastActive": "2026-04-28T..."
}
```

### Opción 2: Crear Manualmente en Firestore Console

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. **Authentication** → Crea un usuario nuevo:
   - Email: `admin@tuempresa.com`
   - Password: `TuContraseña123!`
   - Copia el **UID** generado

4. **Firestore Database** → Colección **`users`** → Nuevo documento:
   - ID del documento: `PEGA_EL_UID_AQUI`

5. Agrega estos campos:
```
{
  "id": {string} = UID
  "uid": {string} = UID
  "email": {string} = admin@tuempresa.com
  "fullName": {string} = Administrador
  "role": {string} = super_admin
  "companyId": {string} = empresa-001
  "status": {string} = active
  "createdAt": {timestamp} = Ahora
  "updatedAt": {timestamp} = Ahora
  "lastActive": {timestamp} = Ahora
}
```

---

## Crear Empresa (Opcional pero Recomendado)

En Firestore, colección **`companies`**, nuevo documento con ID: `empresa-001`

```json
{
  "id": "empresa-001",
  "name": "Mi Empresa SAS",
  "taxId": "900.000.000-0",
  "status": "active",
  "subscription": {
    "plan": "enterprise",
    "status": "active"
  },
  "createdAt": "2026-04-28T...",
  "owner": "UID_DEL_ADMIN"
}
```

---

## Credenciales de Demostración

Usa estas credenciales para testear la aplicación:

| Rol | Email | Contraseña | Permisos |
|-----|-------|-----------|----------|
| **Super Admin** | admin@empresa.com | Admin@123 | Todo |
| **Admin** | admin2@empresa.com | Admin@123 | Usuarios, compra, venta, finanzas |
| **Ventas** | ventas@empresa.com | Ventas@123 | Clientes, órdenes de venta, facturas |
| **Finanzas** | finanzas@empresa.com | Fin@123 | Pagos, facturas, reportes |
| **Bodega** | bodega@empresa.com | Bod@123 | Inventario, recepción, movimientos |
| **Operator** | operador@empresa.com | Op@123 | Inventario, conteos |
| **Viewer** | viewer@empresa.com | View@123 | Solo lectura |

---

## Estructura de Roles

### Super Admin (`super_admin`)
- ✅ Crear/editar/eliminar usuarios
- ✅ Gestionar empresas
- ✅ Acceso completo a todas las colecciones
- ✅ Ver audit logs
- ✅ Admin Dashboard

### Admin (`admin`)
- ✅ Gestionar usuarios dentro de su empresa
- ✅ Crear/editar órdenes de compra y venta
- ✅ Gestionar inventario
- ✅ Admin Dashboard
- ✅ Acceso a finanzas
- ❌ Crear nuevas empresas

### Finance (`finance`)
- ✅ Crear/editar pagos
- ✅ Ver facturas
- ✅ Reportes financieros
- ✅ Ver transacciones
- ❌ Gestionar inventario
- ❌ Crear usuarios

### Sales (`sales`)
- ✅ Crear/editar clientes
- ✅ Crear órdenes de venta
- ✅ Generar facturas
- ✅ Ver proveedores
- ❌ Gestionar pagos
- ❌ Acceso a inventario

### Warehouse (`warehouse`)
- ✅ Gestionar inventario
- ✅ Recibir mercancía
- ✅ Movimientos de stock
- ✅ Ver productos
- ✅ Crear órdenes de compra
- ❌ Gestionar facturas
- ❌ Acceder a finanzas

### Operator (`operator`)
- ✅ Ver inventario
- ✅ Crear movimientos de stock
- ✅ Conteos de inventario
- ❌ Eliminar registros
- ❌ Acceso a finanzas

### Viewer (`viewer`)
- ✅ Solo lectura
- ✅ Ver dashboards
- ✅ Ver reportes
- ❌ Crear/editar registros
- ❌ Eliminar registros

---

## Estructura de Colecciones Firestore

```
users/                          # Perfiles de usuarios
├─ {uid}                        # UID de Firebase Auth
│  ├─ email
│  ├─ fullName
│  ├─ role
│  ├─ companyId
│  └─ ...

companies/                      # Empresas (multi-tenant)
├─ {companyId}
│  ├─ name
│  ├─ taxId
│  ├─ status
│  └─ ...

customers/                      # Clientes
├─ {customerId}
│  ├─ name
│  ├─ email
│  ├─ companyId
│  └─ ...

suppliers/                      # Proveedores
├─ {supplierId}
│  ├─ companyName
│  ├─ email
│  ├─ companyId
│  └─ ...

products/                       # Productos
├─ {productId}
│  ├─ sku
│  ├─ name
│  ├─ companyId
│  └─ ...

warehouses/                     # Bodegas
├─ {warehouseId}
│  ├─ name
│  ├─ location
│  ├─ companyId
│  └─ ...

inventory_locations/            # Ubicaciones de inventario
├─ {locationId}
│  ├─ sku
│  ├─ quantity
│  ├─ warehouseId
│  └─ ...

stock_movements/                # Movimientos de stock
├─ {movementId}
│  ├─ productId
│  ├─ type: 'in' | 'out' | 'adjustment'
│  ├─ quantity
│  ├─ companyId
│  └─ ...

sales_orders/                   # Órdenes de venta
├─ {orderId}
│  ├─ orderNumber
│  ├─ customerId
│  ├─ items[]
│  ├─ total
│  ├─ companyId
│  └─ ...

invoices/                       # Facturas
├─ {invoiceId}
│  ├─ invoiceNumber
│  ├─ customerId
│  ├─ total
│  ├─ status
│  ├─ companyId
│  └─ ...

purchase_orders/                # Órdenes de compra
├─ {poId}
│  ├─ poNumber
│  ├─ supplierId
│  ├─ items[]
│  ├─ total
│  ├─ companyId
│  └─ ...

goods_receipts/                 # Recepción de mercancía
├─ {receiptId}
│  ├─ receiptNumber
│  ├─ purchaseOrderId
│  ├─ items[]
│  ├─ companyId
│  └─ ...

payments/                       # Pagos
├─ {paymentId}
│  ├─ paymentNumber
│  ├─ amount
│  ├─ type: 'receipt' | 'disbursement'
│  ├─ status
│  ├─ companyId
│  └─ ...

support_tickets/                # Tickets de soporte (Admin Dashboard)
├─ {ticketId}
│  ├─ ticketNumber
│  ├─ subject
│  ├─ status
│  ├─ priority
│  ├─ comments[]
│  ├─ companyId
│  └─ ...

audit_logs/                     # Logs de auditoría
├─ {logId}
│  ├─ userId
│  ├─ action
│  ├─ entityType
│  ├─ changes
│  ├─ timestamp
│  └─ ...

system_notifications/           # Notificaciones del sistema
├─ {notificationId}
│  ├─ recipientId
│  ├─ type
│  ├─ title
│  ├─ message
│  ├─ read
│  └─ ...
```

---

## URLs Importantes

- **Aplicación**: `https://tudominio.com`
- **Login**: `https://tudominio.com/login`
- **Dashboard**: `https://tudominio.com/dashboard`
- **Admin Dashboard**: `https://tudominio.com/admin/dashboard`
- **Firebase Console**: `https://console.firebase.google.com`

---

## Troubleshooting

### "Acceso denegado" al ingresar
- ✅ Verifica que el usuario esté en `users` collection
- ✅ Verifica que tenga un `role` válido
- ✅ Verifica que tenga `companyId` válido

### No aparecen datos
- ✅ Verifica que los documentos tengan `companyId` igual al del usuario
- ✅ Checkea que el usuario tenga permiso de lectura en la colección

### Error en Firestore Rules
- ✅ Las reglas fueron desplegadas automáticamente
- ✅ Si necesitas actualizarlas: `firebase deploy --only firestore:rules`

---

## Próximos Pasos

1. ✅ Crear usuario admin
2. ⏳ Crear empresa
3. ⏳ Crear usuarios adicionales con roles
4. ⏳ Registrar primeros clientes
5. ⏳ Registrar proveedores
6. ⏳ Crear productos
7. ⏳ Realizar primera venta/compra

¡Listo! La aplicación está lista para usar. 🚀
