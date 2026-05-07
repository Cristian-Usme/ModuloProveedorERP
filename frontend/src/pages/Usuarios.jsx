import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { UserPlus, Shield, ShieldOff, Check, X, Eye, EyeOff } from 'lucide-react'
import { useUsers, useCrearUsuario, useToggleActivoUsuario } from '../hooks/useUsers'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

/* ── Password strength rules ────────────────────────────────── */
const PASSWORD_RULES = [
  { key: 'length',  label: 'Al menos 8 caracteres',        test: (v) => v.length >= 8 },
  { key: 'upper',   label: 'Una letra mayúscula',           test: (v) => /[A-Z]/.test(v) },
  { key: 'lower',   label: 'Una letra minúscula',           test: (v) => /[a-z]/.test(v) },
  { key: 'digit',   label: 'Un número',                     test: (v) => /\d/.test(v) },
  { key: 'special', label: 'Un carácter especial (@$!%*?&)', test: (v) => /[@$!%*?&.,#^()_+=\-]/.test(v) },
]

function PasswordStrength({ password }) {
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length
  const pct = (passed / PASSWORD_RULES.length) * 100

  const barColor =
    pct <= 40 ? 'bg-red-500' : pct <= 80 ? 'bg-yellow-500' : 'bg-green-500'
  const label =
    pct <= 40 ? 'Débil' : pct <= 80 ? 'Media' : 'Fuerte'

  return (
    <div className="mt-2 space-y-2">
      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={`text-xs font-medium ${pct <= 40 ? 'text-red-600' : pct <= 80 ? 'text-yellow-600' : 'text-green-600'}`}>
          {password.length > 0 ? label : ''}
        </span>
      </div>

      {/* Checklist */}
      <ul className="space-y-0.5">
        {PASSWORD_RULES.map((rule) => {
          const ok = rule.test(password)
          return (
            <li key={rule.key} className="flex items-center gap-1.5 text-xs">
              {ok ? (
                <Check size={13} className="text-green-500 shrink-0" />
              ) : (
                <X size={13} className="text-gray-300 shrink-0" />
              )}
              <span className={ok ? 'text-green-700' : 'text-gray-400'}>
                {rule.label}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function allPasswordRulesPass(password) {
  return PASSWORD_RULES.every((r) => r.test(password))
}

/* ── Main Component ─────────────────────────────────────────── */
export default function Usuarios() {
  const { isAdmin } = useAuth()
  const { data: users, isLoading } = useUsers()
  const crearMut  = useCrearUsuario()
  const toggleMut = useToggleActivoUsuario()

  const [modalOpen, setModalOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: { nombre: '', email: '', password: '', rol: 'COMPRADOR' },
  })

  const passwordValue = watch('password') || ''
  const passwordValid = allPasswordRulesPass(passwordValue)

  function onSubmit(data) {
    crearMut.mutate(
      { nombre: data.nombre, email: data.email, password: data.password, roles: [data.rol] },
      {
        onSuccess: () => {
          setModalOpen(false)
          reset()
          setShowPassword(false)
        },
      },
    )
  }

  function handleToggle(user) {
    if (!user.editable) return
    const action = user.activo ? 'desactivar' : 'activar'
    if (window.confirm(`¿Estás seguro de ${action} a ${user.nombre}?`)) {
      toggleMut.mutate(user.id)
    }
  }

  const sortedUsers = useMemo(() => {
    if (!users) return []
    // Admin first, then sort by id
    return [...users].sort((a, b) => {
      if (!a.editable && b.editable) return -1
      if (a.editable && !b.editable) return 1
      return a.id - b.id
    })
  }, [users])

  if (!isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Shield size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Acceso restringido</h2>
          <p className="text-sm text-gray-400 mt-1">Solo los administradores pueden gestionar usuarios</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {users?.length ?? '…'} usuario(s) registrado(s)
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <UserPlus size={15} className="mr-1" /> Nuevo usuario
        </Button>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Usuario', 'Email', 'Rol', 'Estado', 'Creado', 'Acciones'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Cargando…</span>
                  </div>
                </td>
              </tr>
            ) : !sortedUsers.length ? (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <p className="text-sm text-gray-400">No hay usuarios registrados</p>
                </td>
              </tr>
            ) : sortedUsers.map((u) => (
              <tr key={u.id} className={`transition-colors ${u.activo ? 'hover:bg-gray-50' : 'bg-gray-50/50 opacity-60'}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                      !u.editable ? 'bg-purple-600' : 'bg-indigo-600'
                    }`}>
                      {u.nombre.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{u.nombre}</p>
                      {!u.editable && (
                        <p className="text-[10px] text-purple-500 font-medium">Administrador del sistema</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                <td className="px-4 py-3">
                  {u.roles.map((r) => <Badge key={r} label={r} />)}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    u.activo
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${u.activo ? 'bg-green-500' : 'bg-red-500'}`} />
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {new Date(u.creadoEn).toLocaleDateString('es-CO', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3">
                  {u.editable ? (
                    <button
                      title={u.activo ? 'Desactivar usuario' : 'Activar usuario'}
                      onClick={() => handleToggle(u)}
                      disabled={toggleMut.isPending}
                      className={`p-1.5 rounded-lg transition-colors ${
                        u.activo
                          ? 'text-red-400 hover:bg-red-50 hover:text-red-600'
                          : 'text-green-500 hover:bg-green-50 hover:text-green-700'
                      }`}
                    >
                      {u.activo ? <ShieldOff size={15} /> : <Shield size={15} />}
                    </button>
                  ) : (
                    <span className="text-xs text-gray-300 italic">Protegido</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal crear usuario */}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); reset(); setShowPassword(false) }} title="Nuevo usuario">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="label">Nombre completo <span className="text-red-500">*</span></label>
            <input
              className={`input-field ${errors.nombre ? 'border-red-400 focus:ring-red-400' : ''}`}
              placeholder="Ej: María López"
              {...register('nombre', { required: 'El nombre es obligatorio' })}
            />
            {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="label">Correo electrónico <span className="text-red-500">*</span></label>
            <input
              type="email"
              className={`input-field ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
              placeholder="Ej: usuario@upb.edu.co"
              {...register('email', {
                required: 'El email es obligatorio',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Formato de email inválido' },
              })}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="label">Contraseña <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`input-field pr-10 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                placeholder="Mínimo 8 caracteres"
                {...register('password', { required: 'La contraseña es obligatoria' })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            <PasswordStrength password={passwordValue} />
          </div>

          {/* Rol */}
          <div>
            <label className="label">Rol <span className="text-red-500">*</span></label>
            <select className="input-field" {...register('rol')}>
              <option value="COMPRADOR">Comprador</option>
              <option value="CONSULTA">Consulta</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              {watch('rol') === 'COMPRADOR'
                ? 'Puede crear órdenes, proveedores y productos'
                : 'Solo lectura — puede ver dashboard y reportes'}
            </p>
          </div>

          <Button
            type="submit"
            loading={crearMut.isPending}
            disabled={!passwordValid}
            className="w-full"
          >
            <UserPlus size={15} className="mr-1.5" />
            Crear usuario
          </Button>

          {!passwordValid && passwordValue.length > 0 && (
            <p className="text-xs text-center text-amber-600">
              Completa todos los requisitos de contraseña para continuar
            </p>
          )}
        </form>
      </Modal>
    </div>
  )
}
