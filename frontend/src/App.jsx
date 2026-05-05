import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Proveedores from './pages/Proveedores'
import Productos from './pages/Productos'
import Ordenes from './pages/Ordenes'
import SupplyOSPro from './pages/SupplyOSPro'
import SimpleERP from './pages/SimpleERP'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/simple" element={<SimpleERP />} />
          <Route path="/erp" element={<SupplyOSPro />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="proveedores" element={<Proveedores />} />
            <Route path="productos" element={<Productos />} />
            <Route path="ordenes" element={<Ordenes />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
