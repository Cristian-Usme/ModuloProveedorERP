import { useState } from 'react'
import { ShoppingCart, Plus, Check, X, Ban, Eye, Filter } from 'lucide-react'
import { useOrdenes, useCrearOrden, useAprobarOrden, useRechazarOrden, useCancelarOrden } from '../hooks/useOrdenes'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Pagination from '../components/ui/Pagination'
import OrdenCompraForm from '../components/OrdenCompraForm'

const fmt = (v) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v || 0)

const ESTADOS = ['', 'PENDIENTE', 'APROBADA', 'RECHAZADA', 'CANCELADA']

const ESTADO_BTN = {
  '':          'bg-gray-100 text-gray-600 border-gray-200',
  PENDIENTE:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  APROBADA:    'bg-green-50 text-green-700 border-green-200',
  RECHAZADA:   'bg-red-50 text-red-700 border-red-200',
  CANCELADA:   'bg-gray-50 text-gray-500 border-gray-200',
}

export default function Ordenes() {
  const { isAdmin, isComprador } = useAuth()
  const [page, setPage]         = useState(0)
  const [estado, setEstado]     = useState('')
  const [modalCreate, setModalCreate] = useState(false)
  const [modalDetalle, setModalDetalle] = useState(null)
  const [modalAccion, setModalAccion]   = useState(null)
  const [obsText, setObsText]           = useState('')

  const { data, isLoading } = useOrdenes({ page, size: 10, estado: estado || undefined })
  const { data: allData }   = useOrdenes({ size: 1 })
  const crearMut    = useCrearOrden()
  const aprobarMut  = useAprobarOrden()
  const rechazarMut = useRechazarOrden()
  const cancelarMut = useCancelarOrden()

  function confirmarAccion() {
    const { tipo, orden } = modalAccion
    const cb = { onSuccess: () => { setModalAccion(null); setObsText('') } }
    if (tipo === 'APROBAR')  aprobarMut.mutate({ id: orden.id, observaciones: obsText }, cb)
    if (tipo === 'RECHAZAR') rechazarMut.mutate({ id: orden.id, observaciones: obsText }, cb)
    if (tipo === 'CANCELAR') cancelarMut.mutate(orden.id, cb)
  }

  const isPending = aprobarMut.isPending || rechazarMut.isPending || cancelarMut.isPending

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Órdenes de Compra</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {allData?.totalElements ?? '…'} orden(es) en total
          </p>
        </div>
        {(isAdmin() || isComprador()) && (
          <Button onClick={() => setModalCreate(true)}>
            <Plus size={15} className="mr-1" /> Nueva orden
          </Button>
        )}
      </div>

      {/* Filter chips */}
      <div className="card mb-4 py-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-gray-400 mr-1">
            <Filter size={13} /> Filtrar:
          </span>
          {ESTADOS.map((e) => (
            <button
              key={e}
              onClick={() => { setEstado(e); setPage(0) }}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                estado === e
                  ? 'ring-2 ring-offset-1 ring-indigo-400 ' + ESTADO_BTN[e]
                  : ESTADO_BTN[e] + ' opacity-70 hover:opacity-100'
              }`}
            >
              {e || 'Todos'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['N° Orden', 'Proveedor', 'Fecha', 'Estado', 'Total', 'Solicitante', 'Acciones'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Cargando...</span>
                  </div>
                </td>
              </tr>
            ) : !data?.content?.length ? (
              <tr>
                <td colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2 text-gray-300">
                    <ShoppingCart size={36} />
                    <p className="text-sm text-gray-400">
                      {estado ? `Sin órdenes con estado ${estado}` : 'No hay órdenes registradas'}
                    </p>
                    {(isAdmin() || isComprador()) && !estado && (
                      <button
                        onClick={() => setModalCreate(true)}
                        className="text-xs text-indigo-500 hover:underline mt-1"
                      >
                        Crear primera orden
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : data.content.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <button
                    onClick={() => setModalDetalle(o)}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    {o.numeroOrden}
                  </button>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{o.proveedorNombre}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {new Date(o.fechaCreacion).toLocaleDateString('es-CO')}
                </td>
                <td className="px-4 py-3"><Badge label={o.estado} /></td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{fmt(o.total)}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{o.usuarioNombre}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      title="Ver detalle"
                      onClick={() => setModalDetalle(o)}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                    >
                      <Eye size={15} />
                    </button>
                    {o.estado === 'PENDIENTE' && (
                      <>
                        {isAdmin() && (
                          <>
                            <button
                              title="Aprobar"
                              onClick={() => { setObsText(''); setModalAccion({ tipo: 'APROBAR', orden: o }) }}
                              className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                            >
                              <Check size={15} />
                            </button>
                            <button
                              title="Rechazar"
                              onClick={() => { setObsText(''); setModalAccion({ tipo: 'RECHAZAR', orden: o }) }}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <X size={15} />
                            </button>
                          </>
                        )}
                        {(isAdmin() || isComprador()) && (
                          <button
                            title="Cancelar"
                            onClick={() => { setObsText(''); setModalAccion({ tipo: 'CANCELAR', orden: o }) }}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                          >
                            <Ban size={15} />
                          </button>
                        )}
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
      <Modal open={modalCreate} onClose={() => setModalCreate(false)} title="Nueva orden de compra" size="lg">
        <OrdenCompraForm
          loading={crearMut.isPending}
          onSubmit={(d) => crearMut.mutate(d, { onSuccess: () => setModalCreate(false) })}
        />
      </Modal>

      {/* Modal detalle */}
      <Modal
        open={!!modalDetalle}
        onClose={() => setModalDetalle(null)}
        title={`Detalle — ${modalDetalle?.numeroOrden}`}
        size="md"
      >
        {modalDetalle && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm bg-gray-50 rounded-lg p-4">
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Proveedor</span>
                <p className="font-medium text-gray-900 mt-0.5">{modalDetalle.proveedorNombre}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Estado</span>
                <div className="mt-0.5"><Badge label={modalDetalle.estado} /></div>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Solicitante</span>
                <p className="font-medium text-gray-900 mt-0.5">{modalDetalle.usuarioNombre}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Fecha</span>
                <p className="font-medium text-gray-900 mt-0.5">
                  {new Date(modalDetalle.fechaCreacion).toLocaleString('es-CO')}
                </p>
              </div>
              {modalDetalle.observaciones && (
                <div className="col-span-2">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Observaciones</span>
                  <p className="text-gray-700 mt-0.5">{modalDetalle.observaciones}</p>
                </div>
              )}
            </div>

            <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  {['Producto', 'Cant.', 'Precio unit.', 'Subtotal'].map((h) => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {modalDetalle.detalles?.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium text-gray-900">{d.productoNombre}</td>
                    <td className="px-3 py-2 text-center">{d.cantidad}</td>
                    <td className="px-3 py-2 text-right text-gray-600">{fmt(d.precioUnitario)}</td>
                    <td className="px-3 py-2 text-right font-semibold">{fmt(d.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <td colSpan={3} className="px-3 py-2 text-right font-semibold text-gray-700">Total:</td>
                  <td className="px-3 py-2 text-right font-bold text-gray-900 text-base">{fmt(modalDetalle.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Modal>

      {/* Modal acción */}
      <Modal
        open={!!modalAccion}
        onClose={() => setModalAccion(null)}
        title={`${modalAccion?.tipo} orden — ${modalAccion?.orden?.numeroOrden}`}
        size="sm"
      >
        {modalAccion && (
          <div className="space-y-4">
            <div className={`rounded-lg p-3 text-sm ${
              modalAccion.tipo === 'APROBAR'  ? 'bg-green-50 text-green-800' :
              modalAccion.tipo === 'RECHAZAR' ? 'bg-red-50 text-red-800' :
              'bg-gray-50 text-gray-700'
            }`}>
              {modalAccion.tipo === 'APROBAR'  && 'Se aprobará esta orden. Los productos serán asignados al proveedor.'}
              {modalAccion.tipo === 'RECHAZAR' && 'Se rechazará esta orden. Puede indicar el motivo a continuación.'}
              {modalAccion.tipo === 'CANCELAR' && '¿Confirmas cancelar esta orden? El estado cambiará a CANCELADA.'}
            </div>

            {modalAccion.tipo !== 'CANCELAR' && (
              <div>
                <label className="label">Observaciones</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={obsText}
                  onChange={(e) => setObsText(e.target.value)}
                  placeholder="Motivo o comentario (opcional)..."
                />
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setModalAccion(null)}>Volver</Button>
              <Button
                variant={modalAccion.tipo === 'APROBAR' ? 'primary' : 'danger'}
                loading={isPending}
                onClick={confirmarAccion}
              >
                {modalAccion.tipo === 'APROBAR' ? 'Confirmar aprobación' :
                 modalAccion.tipo === 'RECHAZAR' ? 'Confirmar rechazo' : 'Cancelar orden'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
