import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts'
import { ShoppingCart, Package, Users, CheckCircle, Clock, Star, TrendingUp, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useProveedores } from '../hooks/useProveedores'
import { useProductos } from '../hooks/useProductos'
import { useOrdenes } from '../hooks/useOrdenes'
import Badge from '../components/ui/Badge'

const fmt = (v) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v || 0)

const ESTADOS = ['PENDIENTE', 'APROBADA', 'RECHAZADA', 'CANCELADA']
const ESTADO_COLORS = { PENDIENTE: '#FBBF24', APROBADA: '#22C55E', RECHAZADA: '#EF4444', CANCELADA: '#9CA3AF' }

function StatCard({ title, value, icon: Icon, color, subtitle, to }) {
  const cfg = {
    blue:   { bg: 'bg-blue-50 border-blue-100',    icon: 'bg-blue-100 text-blue-600',    text: 'text-blue-700' },
    green:  { bg: 'bg-green-50 border-green-100',   icon: 'bg-green-100 text-green-600',  text: 'text-green-700' },
    yellow: { bg: 'bg-yellow-50 border-yellow-100', icon: 'bg-yellow-100 text-yellow-600',text: 'text-yellow-700' },
    purple: { bg: 'bg-purple-50 border-purple-100', icon: 'bg-purple-100 text-purple-600',text: 'text-purple-700' },
  }[color]
  const Wrapper = to ? Link : 'div'
  return (
    <Wrapper to={to} className={`card border ${cfg.bg} hover:shadow-md transition-all duration-150 ${to ? 'block' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`text-3xl font-bold mt-1 ${cfg.text}`}>{value ?? '—'}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${cfg.icon}`}>
          <Icon size={22} />
        </div>
      </div>
    </Wrapper>
  )
}

function StarsRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
          className={s <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  )
}

const CustomTooltipBar = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-md text-sm">
        <p className="text-gray-500">{payload[0].payload.mes}</p>
        <p className="font-semibold text-gray-900">{fmt(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const { auth } = useAuth()
  const { data: provData } = useProveedores({ size: 1 })
  const { data: prodData } = useProductos({ size: 1 })
  const { data: pendientes } = useOrdenes({ estado: 'PENDIENTE', size: 1 })
  const { data: aprobadas  } = useOrdenes({ estado: 'APROBADA',  size: 1 })
  const { data: rechazadas } = useOrdenes({ estado: 'RECHAZADA', size: 1 })
  const { data: canceladas } = useOrdenes({ estado: 'CANCELADA', size: 1 })
  const { data: allOrdenes } = useOrdenes({ size: 200 })
  const { data: topProv    } = useProveedores({ size: 6 })

  const pieData = useMemo(() => {
    const counts = [
      pendientes?.totalElements ?? 0,
      aprobadas?.totalElements  ?? 0,
      rechazadas?.totalElements ?? 0,
      canceladas?.totalElements ?? 0,
    ]
    return ESTADOS.map((e, i) => ({ name: e, value: counts[i] })).filter((d) => d.value > 0)
  }, [pendientes, aprobadas, rechazadas, canceladas])

  const barData = useMemo(() => {
    if (!allOrdenes?.content) return []
    const map = {}
    allOrdenes.content
      .filter((o) => o.estado === 'APROBADA')
      .forEach((o) => {
        const d = new Date(o.fechaCreacion)
        const key = d.toLocaleDateString('es-CO', { month: 'short', year: '2-digit' })
        map[key] = (map[key] || 0) + (o.total || 0)
      })
    return Object.entries(map).map(([mes, total]) => ({ mes, total }))
  }, [allOrdenes])

  const provConCalif = useMemo(() => {
    if (!topProv?.content) return []
    return [...topProv.content]
      .filter((p) => p.totalCalificaciones > 0)
      .sort((a, b) => b.calificacionPromedio - a.calificacionPromedio)
      .slice(0, 5)
  }, [topProv])

  const recentOrdenes = useMemo(() => {
    if (!allOrdenes?.content) return []
    return [...allOrdenes.content]
      .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
      .slice(0, 5)
  }, [allOrdenes])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {auth?.nombre}
        </h1>
        <p className="text-gray-500 text-sm mt-1 flex items-center gap-2 flex-wrap">
          {auth?.roles?.map((r) => <Badge key={r} label={r} />)}
          <span className="text-gray-300">·</span>
          <span>
            {new Date().toLocaleDateString('es-CO', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </span>
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Proveedores activos"
          value={provData?.totalElements}
          icon={Users}
          color="blue"
          subtitle="Ver proveedores"
          to="/proveedores"
        />
        <StatCard
          title="Productos en catálogo"
          value={prodData?.totalElements}
          icon={Package}
          color="purple"
          subtitle="Ver catálogo"
          to="/productos"
        />
        <StatCard
          title="Órdenes pendientes"
          value={pendientes?.totalElements}
          icon={Clock}
          color="yellow"
          subtitle="Requieren atención"
          to="/ordenes"
        />
        <StatCard
          title="Órdenes aprobadas"
          value={aprobadas?.totalElements}
          icon={CheckCircle}
          color="green"
          subtitle="Compras completadas"
          to="/ordenes"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut pie */}
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <ShoppingCart size={16} className="text-indigo-500" />
            Distribución de órdenes por estado
          </h2>
          {pieData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-300">
              <ShoppingCart size={36} className="mb-2" />
              <p className="text-sm text-gray-400">Sin órdenes registradas</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={ESTADO_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [v, 'órdenes']} />
                <Legend
                  formatter={(value) => (
                    <span className="text-xs text-gray-600">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar chart monthly */}
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-indigo-500" />
            Compras aprobadas por mes
          </h2>
          {barData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-300">
              <TrendingUp size={36} className="mb-2" />
              <p className="text-sm text-gray-400">Sin órdenes aprobadas aún</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={barData} margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
                  width={48}
                />
                <Tooltip content={<CustomTooltipBar />} />
                <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top proveedores */}
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Star size={16} className="text-yellow-400" />
            Proveedores mejor calificados
          </h2>
          {provConCalif.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-300">
              <Star size={32} className="mb-2" />
              <p className="text-sm text-gray-400">Aún no hay calificaciones</p>
              <Link to="/proveedores" className="text-xs text-indigo-500 mt-1 hover:underline">
                Calificar proveedores
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {provConCalif.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.nombre}</p>
                    <p className="text-xs text-gray-400">{p.totalCalificaciones} evaluación(es)</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <StarsRow rating={p.calificacionPromedio} />
                    <span className="text-sm font-semibold text-gray-700">
                      {p.calificacionPromedio?.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Últimas órdenes */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <AlertCircle size={16} className="text-indigo-500" />
              Últimas órdenes
            </h2>
            <Link to="/ordenes" className="text-xs text-indigo-500 hover:underline">Ver todas</Link>
          </div>
          {recentOrdenes.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Sin órdenes</p>
          ) : (
            <div className="space-y-2">
              {recentOrdenes.map((o) => (
                <div key={o.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{o.numeroOrden}</p>
                    <p className="text-xs text-gray-400 truncate">{o.proveedorNombre}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge label={o.estado} />
                    <p className="text-xs text-gray-500 mt-0.5">{fmt(o.total)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
