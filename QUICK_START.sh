#!/bin/bash

# ╔══════════════════════════════════════════════════════════════╗
# ║   SupplyOS PRO v4.0 - QUICK START                           ║
# ║   Sistema de Gestión de Proveedores y Compras               ║
# ╚══════════════════════════════════════════════════════════════╝

echo "🚀 SupplyOS PRO v4.0 - Iniciando..."
echo ""

# 1. INSTALACIÓN DE DEPENDENCIAS
echo "1️⃣  Instalando dependencias..."
cd frontend
npm install
echo "✅ Dependencias instaladas"
echo ""

# 2. INICIAR SERVIDOR DE DESARROLLO
echo "2️⃣  Iniciando servidor de desarrollo..."
npm run dev
echo ""
echo "✅ Servidor iniciado en http://localhost:5173"
echo ""

# 3. ACCEDER AL ERP
echo "3️⃣  Acceder a la aplicación:"
echo ""
echo "   🔗 URL Principal: http://localhost:5173"
echo "   🔗 ERP Nuevo:     http://localhost:5173/erp  ⭐ RECOMENDADO"
echo ""

# 4. OPCIONES DE ROL
echo "4️⃣  Seleccionar Rol en Sidebar:"
echo ""
echo "   👑 ADMIN      - Acceso total"
echo "   👔 COMPRAS    - Crear órdenes y proveedores"
echo "   👤 CONSULTA   - Solo lectura"
echo ""

# 5. PRIMAS ACCIONES
echo "5️⃣  Primeras Acciones:"
echo ""
echo "   1. Click en 'Proveedores'"
echo "   2. Click en '+ Nuevo Proveedor'"
echo "   3. Completar formulario"
echo "   4. Ver proveedor en card"
echo "   5. Click en '+Pro' para agregar producto"
echo ""

echo "════════════════════════════════════════════════════════════"
echo "🎉 ¡ERP Listo para usar!"
echo "════════════════════════════════════════════════════════════"
