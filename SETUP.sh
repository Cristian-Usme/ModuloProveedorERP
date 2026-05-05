#!/bin/bash

# ============================================
# SETUP COMPLETO - ERP GESTIÓN DE PROVEEDORES
# ============================================

echo "📦 Iniciando setup del proyecto..."

# 1. Backend
echo ""
echo "1️⃣  Iniciando Backend en Docker..."
cd /workspaces/ModuloProveedorERP
docker-compose down 2>/dev/null
docker-compose up -d --build

echo "⏳ Esperando a que backend esté listo..."
sleep 15

# 2. Frontend
echo ""
echo "2️⃣  Iniciando Frontend..."
cd /workspaces/ModuloProveedorERP/frontend

# Asegurar que está instalado
if [ ! -d "node_modules" ]; then
  echo "   📥 Instalando dependencias..."
  npm install
fi

# Crear .env.local si no existe
if [ ! -f ".env.local" ]; then
  echo "   🔧 Creando archivo .env.local..."
  echo "VITE_API_URL=http://localhost:8080" > .env.local
fi

# Iniciar dev server
npm run dev &

echo ""
echo "✅ Setup completado."
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "🚀 URLs DE ACCESO:"
echo "═══════════════════════════════════════════════════════════"
echo "  📱 Frontend:        http://localhost:5173"
echo "  🔐 Backend API:     http://localhost:8080"
echo "  📚 Documentación:   http://localhost:8080/swagger-ui.html"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "🔑 CREDENCIALES DE PRUEBA:"
echo "═══════════════════════════════════════════════════════════"
echo "  👤 Admin:"
echo "     Email: admin@upb.edu.co"
echo "     Pass:  Test1234!"
echo "     Rol:   ADMIN"
echo ""
echo "  👤 Comprador:"
echo "     Email: comprador@upb.edu.co"
echo "     Pass:  Test1234!"
echo "     Rol:   COMPRADOR"
echo ""
echo "  👤 Consulta:"
echo "     Email: consulta@upb.edu.co"
echo "     Pass:  Test1234!"
echo "     Rol:   CONSULTA"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "🎯 Próximos pasos:"
echo "   1. Abre http://localhost:5173 en tu navegador"
echo "   2. Inicia sesión con cualquier usuario"
echo "   3. Navega a Proveedores > agregar nuevos"
echo "   4. Luego ve a Productos > crear productos"
echo ""
echo "📞 Soporte: Todos los endpoints están documentados en"
echo "   http://localhost:8080/swagger-ui.html"
echo ""
