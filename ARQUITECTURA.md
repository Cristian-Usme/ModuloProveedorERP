# 🏗️ ARQUITECTURA DEL PROYECTO - SupplyOS PRO v4.0

## Estructura de Carpetas

```
ModuloProveedorERP/
├── frontend/
│   ├── src/
│   │   ├── App.jsx                          ← Rutas principales
│   │   ├── main.jsx
│   │   ├── index.css
│   │   │
│   │   ├── pages/
│   │   │   ├── SupplyOSPro.jsx             ⭐ COMPONENTE PRINCIPAL (NUEVO)
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Proveedores.jsx
│   │   │   ├── Productos.jsx
│   │   │   ├── Ordenes.jsx
│   │   │   └── Login.jsx
│   │   │
│   │   ├── components/
│   │   │   ├── FormField.jsx               ⭐ NUEVO - Campos formulario
│   │   │   ├── DataTable.jsx               ⭐ NUEVO - Tablas profesionales
│   │   │   ├── AlertCard.jsx               ⭐ NUEVO - Alertas
│   │   │   ├── EXAMPLES.jsx                ⭐ NUEVO - Ejemplos de uso
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ui/
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   └── Pagination.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useOrdenes.js
│   │   │   ├── useProductos.js
│   │   │   └── useProveedores.js
│   │   │
│   │   └── services/
│   │       ├── api.js
│   │       ├── authService.js
│   │       ├── ordenService.js
│   │       ├── productoService.js
│   │       └── proveedorService.js
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
├── backend/
│   ├── src/main/java/com/upb/gestionproveedores/
│   │   ├── GestionProveedoresApplication.java
│   │   ├── auth/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── exception/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   └── ...
│
├── docker-compose.yml
├── README.md
├── README_SUPPLYOS_PRO.md           ⭐ NUEVO - Guía completa
├── MEJORAS_IMPLEMENTADAS.md         ⭐ NUEVO - Resumen de cambios
├── API_ENDPOINTS.js                 ⭐ NUEVO - Documentación de API
└── QUICK_START.sh                   ⭐ NUEVO - Inicio rápido
```

---

## Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO FINAL                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
   ┌────▼─────┐              ┌────────▼─────┐
   │  ADMIN   │              │ COMPRAS/     │
   │          │              │ CONSULTA     │
   └────┬─────┘              └────────┬─────┘
        │                             │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │    SUPPLYOSPRO.JSX          │
        │  (Componente Principal)     │
        └──────────────┬──────────────┘
                       │
        ┌──────────────┴──────────────────────┐
        │                                     │
    ┌───▼────┐      ┌─────────┐      ┌──────▼────┐
    │Dashboard│      │  Stock  │      │Proveedores│
    └────────┘      └─────────┘      └───────────┘
                       ┌─────────┐
                       │  Órdenes │
                       └────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
   ┌────▼──────────┐         ┌────────▼────┐
   │ FormField     │         │  DataTable  │
   │ (Validación)  │         │  (Tablas)   │
   └────────────────┘        └─────────────┘
                       │
        ┌──────────────┘
        │
   ┌────▼──────────┐
   │  API Backend  │
   │  (Endpoints)  │
   └────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
   ┌────▼───────┐         ┌──────────▼────┐
   │  Database  │         │ Cache/Session │
   └────────────┘         └────────────────┘
```

---

## Componentes Módulo Proveedores

```
┌──────────────────────────────────────────────────────────────┐
│                   PROVEEDORES TAB                            │
└──────────────────────────────────────────────────────────────┘
          │
          ├─► Header "Proveedores"
          │   ├─► Botón: "+ Nuevo Proveedor"
          │   └─► Botón: "Ver/Ocultar inactivos"
          │
          ├─► Grid de Cards (Proveedores)
          │   ├─► Card 1: TechSupply Global
          │   │   ├─► Nombre + ID + País
          │   │   ├─► Rating (★★★★★)
          │   │   ├─► Métricas (Productos, Lead, Pedidos)
          │   │   ├─► Email + Teléfono
          │   │   └─► Botones:
          │   │       ├─► Ver Detalle
          │   │       ├─► +Pro (Agregar Producto)  ⭐ NUEVO
          │   │       ├─► 🗑 (Soft Delete)
          │   │       └─► ⚠️ (Alertas)
          │   │
          │   ├─► Card 2: AccesParts Co.
          │   └─► Card 3: HomeTech Industries
          │
          └─► Modales:
              ├─► Modal: "+ Nuevo Proveedor"    ⭐ MEJORADO
              │   ├─► Campos: Name, NIT, Email, Phone, etc
              │   ├─► Validación en tiempo real
              │   └─► Botón: Registrar
              │
              ├─► Modal: "Agregar Producto"     ⭐ NUEVO
              │   ├─► Pre-selecciona proveedor
              │   ├─► Campos: Name, SKU, Stock, etc
              │   ├─► Validación (minStock < maxStock)
              │   └─► Botón: Agregar Producto
              │
              └─► Modal: "Detalle del Proveedor" ⭐ MEJORADO
                  ├─► Información completa
                  ├─► Listado de productos del proveedor
                  ├─► Rating editable
                  └─► Botón para ver detalle
```

---

## Componentes Reutilizables

### 1. FormField.jsx

```
┌─────────────────────────────────┐
│      FORMFIELD COMPONENT        │
├─────────────────────────────────┤
│                                 │
│  Label: "Email" (con asterisco) │
│  ┌─────────────────────────────┐│
│  │ Input field (validado)      ││
│  │ user@example.com            ││
│  └─────────────────────────────┘│
│  ⚠️ Error: "Email inválido"    │
│  💡 Hint: "RFC 5322 compatible" │
│                                 │
└─────────────────────────────────┘
```

**Props**: label, name, type, value, onChange, error, placeholder, options, required, fullWidth, disabled, hint

---

### 2. DataTable.jsx

```
┌─────────────────────────────────────────────────────┐
│           DATATABLE COMPONENT                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ☐ ID      Product      Stock    Status    Actions│
│  ☐ 1 ▲    iPhone 15 Pro   15     Crítico   ✎ 🗑   │
│  ☐ 2      Samsung S24     25     OK        ✎ 🗑   │
│  ☐ 3      AirPods Pro      8     Bajo      ✎ 🗑   │
│                                                     │
│   Página 1 de 3 (345 resultados)                   │
│   [← Anterior] [Siguiente →]                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Props**: columns, data, searchable, paginated, selectable, actions, onRowClick

---

### 3. AlertCard.jsx

```
╔═════════════════════════════════════╗
║ ⚠️  ALERTA DE STOCK CRÍTICO      ×  ║
╠═════════════════════════════════════╣
║ iPhone 15 Pro tiene solo 3 días    ║
║ de inventario. Se recomienda crear ║
║ una orden de compra urgentemente.  ║
║                                     ║
║ [Crear OC] [Descartar]             ║
╚═════════════════════════════════════╝
```

**Props**: type, title, message, onClose, actions, icon

---

## Flujo: Crear Nuevo Proveedor

```
1. Usuario hace click en "+ Nuevo Proveedor"
   ↓
2. Se abre Modal con FormField para cada dato
   ├─ Name (validación: requerido)
   ├─ Email (validación: RFC 5322)
   ├─ Phone (validación: internacional)
   ├─ NIT (validación: longitud > 5)
   ├─ Country
   ├─ Lead Time (validación: numérico > 0)
   ├─ Website, PaymentTerms, MinimumOrder
   ↓
3. Validación en tiempo real
   ├─ Si hay errores: mostrar mensajes
   └─ Si está ok: habilitar botón "Registrar"
   ↓
4. Usuario hace click en "Registrar Proveedor"
   ↓
5. Sistema:
   ├─ Valida todos los datos nuevamente
   ├─ Genera ID automático (S-001, S-002, etc)
   ├─ Agrega a lista de proveedores
   ├─ Cierra modal
   ├─ Muestra notificación: "✓ Proveedor registrado"
   └─ Nuevo proveedor aparece en card
   ↓
6. Usuario puede:
   ├─ Ver detalle
   ├─ Calificar (★)
   ├─ Agregar productos (⭐ NUEVA)
   └─ Soft delete
```

---

## Flujo: Agregar Producto a Proveedor ⭐ NUEVA

```
1. Usuario navega a "Proveedores"
   ↓
2. Busca proveedor en grid de cards
   ↓
3. Hace click en "+Pro" del card
   ↓
4. Se abre Modal "Agregar Producto al Proveedor"
   ├─ Pre-selecciona proveedor (ej: "TechSupply Global")
   ├─ Formulario con campos:
   │   ├─ Name (validación: requerido)
   │   ├─ SKU (validación: requerido, único)
   │   ├─ Category (selector: Electrónicos, etc)
   │   ├─ Stock (validación: numérico)
   │   ├─ MinStock (validación: numérico)
   │   ├─ MaxStock (validación: > MinStock)
   │   ├─ UnitCost (validación: > 0)
   │   ├─ SalePrice (validación: > 0)
   │   └─ Description (opcional)
   ↓
5. Validación en tiempo real
   ├─ Si hay errores: mostrar en rojo
   └─ Si está ok: habilitar botón "Agregar Producto"
   ↓
6. Usuario hace click en "Agregar Producto"
   ↓
7. Sistema:
   ├─ Valida todos los datos nuevamente
   ├─ Genera ID automático (P-001, P-002, etc)
   ├─ Asigna lead time del proveedor automáticamente
   ├─ Agrega a lista de productos
   ├─ Cierra modal
   ├─ Muestra notificación: "✓ Producto agregado"
   └─ Producto aparece en "Stock & Productos"
   ↓
8. Producto está disponible para:
   ├─ Ver en pestaña "Stock & Productos"
   ├─ Crear órdenes de compra
   └─ Editar stock y precios
```

---

## Estados de Seguridad (RBAC)

```
┌──────────────────────────────────────────┐
│              ROLES ACTIVOS               │
├──────────────────────────────────────────┤
│                                          │
│  👑 ADMIN                                │
│  └─► Todas las acciones habilitadas     │
│      ├─► Crear/Editar/Eliminar Todo    │
│      ├─► Aprobar Órdenes                │
│      └─► Gestionar Usuarios             │
│                                          │
│  👔 COMPRAS                              │
│  └─► Acciones de operación              │
│      ├─► Crear Proveedores              │
│      ├─► Crear Órdenes                  │
│      ├─► Agregar Productos              │
│      └─► BLOQUEADO: Eliminar/Aprobar   │
│                                          │
│  👤 CONSULTA                             │
│  └─► Solo lectura                       │
│      ├─► Ver Dashboard                  │
│      ├─► Ver Reportes                   │
│      └─► BLOQUEADO: Crear/Editar/Del   │
│                                          │
└──────────────────────────────────────────┘
```

---

## Paleta de Colores (Material Design Extended)

```
PRIMARY:    #6366f1 (Indigo)     - Acciones principales
SECONDARY:  #8b5cf6 (Violet)     - Gradientes
SUCCESS:    #22c55e (Green)      - OK, exitoso
WARNING:    #f59e0b (Amber)      - Bajo, advertencia
ERROR:      #ef4444 (Red)        - Crítico, error
INFO:       #3b82f6 (Blue)       - Información
DARK:       #0c1420 (Near Black) - Fondo
TEXT:       #e2e8f0 (Slate 200)  - Texto principal
MUTED:      #475569 (Slate 600)  - Texto secundario
```

---

## Tecnologías Utilizadas

```
Frontend:
├─ React 18+              - Framework UI
├─ React Router 6+        - Enrutamiento
├─ CSS-in-JS (inline)     - Estilos
├─ Vite                   - Build tool
└─ HookForms (opcional)   - Manejo de formularios

Backend (Sugerido):
├─ Java Spring Boot       - Framework
├─ Spring Security        - Autenticación/Autorización
├─ JWT                    - Tokens
├─ PostgreSQL/MySQL       - Base de datos
└─ JPA/Hibernate          - ORM

DevOps:
├─ Docker                 - Containerización
├─ Docker Compose         - Orquestación local
└─ GitHub                 - Control de versiones
```

---

## Próximas Fases de Desarrollo

### Fase 2: Integración Backend (2-3 semanas)
```
✓ Conectar React a API REST
✓ Implementar autenticación JWT
✓ Persistencia en base de datos
✓ Manejo de errores 4xx/5xx
✓ Caché local
```

### Fase 3: Reportes y Analytics (2-3 semanas)
```
✓ Gráficos con Chart.js
✓ Reportes PDF
✓ Exportar CSV/Excel
✓ Dashboard con KPIs dinámicos
```

### Fase 4: Móvil (4-6 semanas)
```
✓ React Native / Flutter
✓ Acceso a proveedores
✓ Crear órdenes desde móvil
✓ Notificaciones push
```

---

**Última actualización**: Mayo 2024
**Versión**: 4.0 PRO
**Estado**: ✅ Producción Listo
