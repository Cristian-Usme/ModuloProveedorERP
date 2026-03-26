import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, Package, ShoppingCart, LogOut, Menu, X, Building2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { to: '/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/proveedores', label: 'Proveedores',  icon: Users },
  { to: '/productos',   label: 'Productos',    icon: Package },
  { to: '/ordenes',     label: 'Órdenes',      icon: ShoppingCart },
]

function UserAvatar({ nombre }) {
  const initials = nombre
    ? nombre.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'
  return (
    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center select-none shrink-0">
      {initials}
    </div>
  )
}

export default function Navbar() {
  const { auth, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2 text-indigo-700 font-bold text-base select-none">
              <Building2 size={20} className="text-indigo-600" />
              <span className="hidden sm:inline">GestiónProv</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => {
                const active = location.pathname.startsWith(to)
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={15} />
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <UserAvatar nombre={auth?.nombre} />
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 leading-tight">{auth?.nombre}</p>
                <p className="text-xs text-gray-400 leading-tight">{auth?.roles?.join(', ')}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Salir</span>
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 space-y-1">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = location.pathname.startsWith(to)
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
          <div className="pt-2 border-t border-gray-100 flex items-center gap-2 px-3 py-2">
            <UserAvatar nombre={auth?.nombre} />
            <div>
              <p className="text-sm font-medium text-gray-900">{auth?.nombre}</p>
              <p className="text-xs text-gray-400">{auth?.roles?.join(', ')}</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
