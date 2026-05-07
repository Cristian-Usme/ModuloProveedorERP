import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Star, Search, Plus, Pencil, Trash2, Award, Loader2 } from 'lucide-react'
import {
  useProveedores, useCrearProveedor, useActualizarProveedor,
  useEliminarProveedor, useCalificarProveedor,
} from '../hooks/useProveedores'
import { useAuth } from '../context/AuthContext'
import { proveedorService } from '../services/proveedorService'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import Pagination from '../components/ui/Pagination'
import ProveedorForm from '../components/ProveedorForm'

function StarsDisplay({ value, total }) {
  const rounded = Math.round(value || 0)
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={13}
            className={s <= rounded ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500 ml-1">
        {value ? value.toFixed(1) : '—'}
        <span className="text-gray-300"> / {total ?? 0}</span>
      </span>
    </div>
  )
}

export default function Proveedores() {
  const { isAdmin, isComprador } = useAuth()
  const [page, setPage]               = useState(0)
  const [search, setSearch]           = useState('')
  const [modalCreate, setModalCreate] = useState(false)
  const [modalEdit, setModalEdit]     = useState(null)
  const [modalCalif, setModalCalif]   = useState(null)

  // Rating modal state
  const [loadingCalif, setLoadingCalif]   = useState(false)
  const [existingCalif, setExistingCalif] = useState(null)

  const { data, isLoading } = useProveedores({ page, size: 10, search: search || undefined })
  const crearMut      = useCrearProveedor()
  const actualizarMut = useActualizarProveedor()
  const eliminarMut   = useEliminarProveedor()
  const calificarMut  = useCalificarProveedor()

  const { register: rCalif, handleSubmit: hCalif, reset: resetCalif, watch, setValue } = useForm({
    defaultValues: { puntuacion: 5, comentario: '' },
  })
  const puntActual = parseInt(watch('puntuacion') || 5)

  // Fetch existing rating when modal opens
  const openCalifModal = useCallback(async (proveedor) => {
    setModalCalif(proveedor)
    setLoadingCalif(true)
    setExistingCalif(null)

    try {
      const existing = await proveedorService.miCalificacion(proveedor.id)
      setExistingCalif(existing)
      setValue('puntuacion', existing.puntuacion)
      setValue('comentario', existing.comentario || '')
    } catch (err) {
      // 404 = no existing rating, show fresh form
      if (err.response?.status === 404) {
        resetCalif({ puntuacion: 5, comentario: '' })
      }
    } finally {
      setLoadingCalif(false)
    }
  }, [setValue, resetCalif])

  function closeCalifModal() {
    setModalCalif(null)
    setExistingCalif(null)
    resetCalif({ puntuacion: 5, comentario: '' })
  }

  function onCalif(data) {
    calificarMut.mutate(
      { id: modalCalif.id, data: { puntuacion: parseInt(data.puntuacion), comentario: data.comentario } },
      { onSuccess: () => closeCalifModal() },
    )
  }

  function handleEliminar(id) {
    if (window.confirm('¿Eliminar este proveedor? Esta acción no se puede deshacer.')) {
      eliminarMut.mutate(id)
    }
  }

  const isEditMode = !!existingCalif

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proveedores</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {data?.totalElements ?? '…'} proveedor(es) registrado(s)
          </p>
        </div>
        {isAdmin() && (
          <Button onClick={() => setModalCreate(true)}>
            <Plus size={15} className="mr-1" /> Nuevo proveedor
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="card mb-4 py-4">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input-field pl-9"
            placeholder="Buscar por nombre o RUC/NIT..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Proveedor', 'RUC/NIT', 'Contacto', 'Calificación', 'Acciones'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Cargando...</span>
                  </div>
                </td>
              </tr>
            ) : !data?.content?.length ? (
              <tr>
                <td colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2 text-gray-300">
                    <Award size={36} />
                    <p className="text-sm text-gray-400">
                      {search ? 'Sin resultados para esa búsqueda' : 'No hay proveedores registrados'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : data.content.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">{p.nombre}</p>
                  {p.direccion && <p className="text-xs text-gray-400 truncate max-w-[200px]">{p.direccion}</p>}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 font-mono">{p.rucNit}</td>
                <td className="px-4 py-3">
                  <p className="text-sm text-gray-600">{p.email ?? '—'}</p>
                  <p className="text-xs text-gray-400">{p.telefono ?? ''}</p>
                </td>
                <td className="px-4 py-3">
                  <StarsDisplay value={p.calificacionPromedio} total={p.totalCalificaciones} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {(isAdmin() || isComprador()) && (
                      <button
                        title="Calificar"
                        onClick={() => openCalifModal(p)}
                        className="p-1.5 rounded-lg text-yellow-500 hover:bg-yellow-50 transition-colors"
                      >
                        <Star size={15} />
                      </button>
                    )}
                    {isAdmin() && (
                      <>
                        <button
                          title="Editar"
                          onClick={() => setModalEdit(p)}
                          className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          title="Eliminar"
                          onClick={() => handleEliminar(p.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 border-t border-gray-100">
          <Pagination page={page} totalPages={data?.totalPages ?? 0} onPageChange={setPage} />
        </div>
      </div>

      {/* Modal crear */}
      <Modal open={modalCreate} onClose={() => setModalCreate(false)} title="Nuevo proveedor">
        <ProveedorForm
          loading={crearMut.isPending}
          onSubmit={(d) => crearMut.mutate(d, { onSuccess: () => setModalCreate(false) })}
        />
      </Modal>

      {/* Modal editar */}
      <Modal open={!!modalEdit} onClose={() => setModalEdit(null)} title="Editar proveedor">
        <ProveedorForm
          defaultValues={modalEdit}
          loading={actualizarMut.isPending}
          onSubmit={(d) =>
            actualizarMut.mutate({ id: modalEdit.id, data: d }, { onSuccess: () => setModalEdit(null) })
          }
        />
      </Modal>

      {/* Modal calificar */}
      <Modal
        open={!!modalCalif}
        onClose={closeCalifModal}
        title={isEditMode ? `Editar calificación: ${modalCalif?.nombre}` : `Calificar: ${modalCalif?.nombre}`}
        size="sm"
      >
        {loadingCalif ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <Loader2 size={28} className="animate-spin text-indigo-500" />
            <p className="text-sm text-gray-400">Verificando calificación existente…</p>
          </div>
        ) : (
          <form onSubmit={hCalif(onCalif)} className="space-y-5">
            {/* Edit mode indicator */}
            {isEditMode && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                <Pencil size={14} className="text-amber-600 shrink-0" />
                <p className="text-xs text-amber-700">
                  Ya calificaste este proveedor. Puedes modificar tu calificación.
                </p>
              </div>
            )}

            {/* Stars selector */}
            <div>
              <label className="label">Puntuación</label>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <label key={n} className="cursor-pointer">
                    <input type="radio" value={n} className="sr-only" {...rCalif('puntuacion', { required: true })} />
                    <Star
                      size={28}
                      className={`transition-colors ${n <= puntActual ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
                    />
                  </label>
                ))}
                <span className="ml-2 text-sm font-semibold text-gray-700">{puntActual} / 5</span>
              </div>
            </div>
            <div>
              <label className="label">Comentario (opcional)</label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Escribe tu comentario sobre el proveedor..."
                {...rCalif('comentario')}
              />
            </div>
            <Button type="submit" loading={calificarMut.isPending} className="w-full">
              {isEditMode ? (
                <><Pencil size={14} className="mr-1.5" /> Actualizar calificación</>
              ) : (
                <><Star size={14} className="mr-1.5" /> Enviar calificación</>
              )}
            </Button>
          </form>
        )}
      </Modal>
    </div>
  )
}
