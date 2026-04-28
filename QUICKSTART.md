# 🚀 Quick Start - ModuloProveedor ERP

## Acceso Rápido

### 1️⃣ Crear Primer Admin (5 minutos)

```bash
# Opción A: Registrarse en la app
1. Ir a: https://tudominio.com/login
2. Click "Sign Up"
3. Llenar:
   - Email: admin@empresa.com
   - Password: Admin@123!
   - Full Name: Administrador
   - Company ID: empresa-001

# Opción B: Crear directamente en Firebase Console
# Ve a: console.firebase.google.com → Authentication → Add User
# Luego ve a: Firestore → users → Edit
# Cambia role a "super_admin"
```

### 2️⃣ Credenciales de Demostración

| Usuario | Email | Contraseña | Rol |
|---------|-------|-----------|-----|
| Admin | admin@empresa.com | Admin@123 | Super Admin |
| Ventas | ventas@empresa.com | Ventas@123 | Ventas |
| Bodega | bodega@empresa.com | Bod@123 | Warehouse |
| Finanzas | finanzas@empresa.com | Fin@123 | Finance |

### 3️⃣ Admin Dashboard

Accede con usuario admin a:
```
https://tudominio.com/admin/dashboard
```

Aquí puedes:
- 📋 Ver tickets de soporte de usuarios
- 💬 Responder problemas
- 🔄 Cambiar estado de tickets
- 👥 Resolver issues de proveedores/clientes

---

## URLs Principales

```
Login:           /login
Dashboard:       /dashboard
Admin Panel:     /admin/dashboard
Clientes:        /clientes
Proveedores:     /proveedores
Productos:       /operaciones/productos
Inventario:      /operaciones/inventario
Usuarios:        /configuracion/usuarios-roles
Bodega/Mapa:     /operaciones/bodega
```

---

## Estructura del Proyecto

```
src/
├─ pages/
│  ├─ LoginPage.tsx           ← Autenticación
│  ├─ AdminDashboardPage.tsx  ← Dashboard de admin
│  ├─ DashboardPage.tsx       ← Dashboard operativo
│  ├─ RecordsPage.tsx         ← CRUD genérico
│  └─ ...
├─ store/
│  ├─ authStore.ts            ← Auth con Firebase
│  ├─ masterDataStore.ts      ← Estado local
│  └─ ...
├─ services/firebase/
│  ├─ app.ts                  ← Inicialización
│  ├─ config.ts               ← Configuración
│  ├─ auth.ts                 ← Autenticación
│  ├─ firestore.ts            ← Base de datos
│  └─ ...
└─ types/
   ├─ firebaseSchema.ts       ← Tipos profesionales
   └─ ...
```

---

## Roles y Permisos

```
Super Admin  → Todo
Admin        → Usuarios, compras, ventas, finanzas
Ventas       → Clientes, órdenes, facturas
Finanzas     → Pagos, reportes
Bodega       → Inventario, recepción
Operator     → Movimientos de stock
Viewer       → Solo lectura
```

---

## Firestore Collections

Cada colección es **multi-tenant** (por companyId):

- `users/` - Usuarios
- `companies/` - Empresas
- `customers/` - Clientes
- `suppliers/` - Proveedores  
- `products/` - Productos
- `warehouses/` - Bodegas
- `inventory_locations/` - Ubicaciones
- `stock_movements/` - Movimientos
- `sales_orders/` - Órdenes venta
- `invoices/` - Facturas
- `purchase_orders/` - Órdenes compra
- `goods_receipts/` - Recepción
- `payments/` - Pagos
- `support_tickets/` - Tickets soporte
- `audit_logs/` - Auditoría

---

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Deploy a Firebase Hosting + Rules + Functions
firebase deploy

# Ver logs de Cloud Functions
firebase functions:log

# Tests
npm run test

# Lint
npm run lint
```

---

## Características Key ✨

- ✅ **Multi-tenant** - Múltiples empresas en un proyecto
- ✅ **Autenticación Firebase** - Secure auth
- ✅ **Role-based Access** - 7 roles diferentes
- ✅ **Firestore Rules** - Seguridad granular
- ✅ **Admin Dashboard** - Gestión de tickets
- ✅ **TypeScript** - Type-safe code
- ✅ **Tailwind CSS** - UI profesional
- ✅ **Clean Architecture** - Escalable y maintainable

---

## Próximos Pasos

1. ✅ Crear admin user
2. ✅ Deploy a Firebase
3. ⏳ Crear company
4. ⏳ Agregar más usuarios
5. ⏳ Registrar clientes
6. ⏳ Registrar proveedores
7. ⏳ Crear productos
8. ⏳ Hacer primera venta

---

**Documentación completa:** Ver [ADMIN_CREDENTIALS.md](./ADMIN_CREDENTIALS.md)

**Repositorio:** https://github.com/Cristian-Usme/ModuloProveedorERP
