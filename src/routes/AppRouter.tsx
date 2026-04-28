import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { AppShell } from '@/components/layout/AppShell'
import { navigationSections } from '@/modules/navigation'
import type { MasterDataKind } from '@/types/masterData'

const LoginPage = lazy(() => import('@/pages/LoginPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'))
const ModulePage = lazy(() => import('@/pages/ModulePage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const RecordsPage = lazy(() => import('@/pages/RecordsPage'))

const specialRouteKinds: Record<string, MasterDataKind> = {
  '/configuracion/usuarios-roles': 'users',
  '/clientes': 'customers',
  '/proveedores': 'suppliers',
  '/operaciones/productos': 'products',
  '/operaciones/inventario': 'inventory',
  '/operaciones/bodega': 'inventory',
}

const moduleRoutes = navigationSections
  .flatMap((section) => section.items)
  .filter((item) => item.path !== '/dashboard' && !specialRouteKinds[item.path])

// Protected route component
function ProtectedRoute({ element }: { element: React.ReactElement }) {
  const { isAuthenticated, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-slate-400">Loading...</div>
      </div>
    )
  }

  return isAuthenticated ? element : <Navigate to="/login" replace />
}

export function AppRouter() {
  const { initializeAuth, isAuthenticated, loading } = useAuthStore()

  // Initialize authentication on mount
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-slate-400">Loading application...</div>
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="flex min-h-[50vh] items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-sm text-slate-400">
            Cargando experiencia ERP...
          </div>
        </AppShell>
      }
    >
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        {isAuthenticated && (
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

            {/* Master data routes */}
            {Object.entries(specialRouteKinds).map(([path, kind]) => (
              <Route key={path} path={path} element={<RecordsPage kind={kind} />} />
            ))}

            {/* Module routes */}
            {moduleRoutes.map((item) => (
              <Route
                key={item.path}
                path={item.path}
                element={<ModulePage title={item.label} subtitle={item.description} path={item.path} />}
              />
            ))}

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        )}

        {/* Redirect to login if not authenticated */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  )
}
