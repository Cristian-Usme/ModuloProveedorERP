import { useState } from 'react'
import { Search, Plus, Pencil, Trash2, Package } from 'lucide-react'
import { useProductos, useCrearProducto, useActualizarProducto, useEliminarProducto } from '../hooks/useProductos'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import Pagination from '../components/ui/Pagination'
import ProductoForm from '../components/ProductoForm'

const fmt = (v) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v || 0)

export default function Productos() {
  const { isAdmin } = useAuth()
  const [page, setPage]               = useState(0)
  const [search, setSearch]           = useState('')
  const [modalCreate, setModalCreate] = useState(false)
  const [modalEdit, setModalEdit]     = useState(null)

  const { data, isLoading }  = useProductos({ page, size: 10, search: search || undefined })
  const crearMut      = useCrearProducto()
  const actualizarMut = useActualizarProducto()
  const eliminarMut   = useEliminarProducto()

  function handleEliminar(id) {
    if (window.confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) {
      eliminarMut.mutate(id)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catálogo de Productos</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {data?.totalElements ?? '…'} producto(s) registrado(s)
          </p>
        </div>
        {isAdmin() && (
          <Button onClick={() => setModalCreate(true)}>
            <Plus size={15} className="mr-1" /> Nuevo producto
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="card mb-4 py-4">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input-field pl-9"
            placeholder="Buscar producto..."
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
              {['Producto', 'Precio referencia', 'Unidad', 'Proveedor', 'Acciones'].map((h) => (
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
                    <Package size={36} />
                    <p className="text-sm text-gray-400">
                      {search ? 'Sin resultados para esa búsqueda' : 'No hay productos en el catálogo'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : data.content.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">{p.nombre}</p>
                  {p.descripcion && (
                    <p className="text-xs text-gray-400 truncate max-w-[240px]">{p.descripcion}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  {p.precioReferencia ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-green-50 text-green-700 text-sm font-medium">
                      {fmt(p.precioReferencia)}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{p.unidad ?? '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{p.proveedorNombre}</td>
                <td className="px-4 py-3">
                  {isAdmin() && (
                    <div className="flex items-center gap-1.5">
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
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 border-t border-gray-100">
          <Pagination page={page} totalPages={data?.totalPages ?? 0} onPageChange={setPage} />
        </div>
      </div>

      <Modal open={modalCreate} onClose={() => setModalCreate(false)} title="Nuevo producto">
        <ProductoForm
          loading={crearMut.isPending}
          onSubmit={(d) =>
            crearMut.mutate(
              { ...d, proveedorId: parseInt(d.proveedorId) },
              { onSuccess: () => setModalCreate(false) },
            )
          }
        />
      </Modal>

      <Modal open={!!modalEdit} onClose={() => setModalEdit(null)} title="Editar producto">
        <ProductoForm
          defaultValues={modalEdit}
          loading={actualizarMut.isPending}
          onSubmit={(d) =>
            actualizarMut.mutate(
              { id: modalEdit.id, data: { ...d, proveedorId: parseInt(d.proveedorId) } },
              { onSuccess: () => setModalEdit(null) },
            )
          }
        />
      </Modal>
    </div>
  )
}
