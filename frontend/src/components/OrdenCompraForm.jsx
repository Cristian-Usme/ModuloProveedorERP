import { useForm, useFieldArray } from 'react-hook-form'
import Input from './ui/Input'
import Button from './ui/Button'
import { useProveedores } from '../hooks/useProveedores'
import { useProductos } from '../hooks/useProductos'

const fmt = (v) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v || 0)

export default function OrdenCompraForm({ onSubmit, loading }) {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    defaultValues: { detalles: [{ productoId: '', cantidad: 1, precioUnitario: 0 }] },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'detalles' })
  const { data: provData } = useProveedores({ size: 100 })
  const { data: prodData } = useProductos({ size: 200 })
  const proveedores = provData?.content ?? []
  const productos   = prodData?.content ?? []

  const detalles = watch('detalles')
  const total = detalles.reduce((acc, d) => acc + (d.cantidad || 0) * (d.precioUnitario || 0), 0)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="label">Proveedor *</label>
        <select
          className={`input-field ${errors.proveedorId ? 'border-red-500' : ''}`}
          {...register('proveedorId', { required: 'El proveedor es obligatorio', valueAsNumber: true })}
        >
          <option value="">Seleccionar proveedor</option>
          {proveedores.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>
        {errors.proveedorId && <p className="mt-1 text-xs text-red-600">{errors.proveedorId.message}</p>}
      </div>

      <div>
        <label className="label">Observaciones</label>
        <textarea className="input-field" rows={2} {...register('observaciones')} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Productos</h3>
          <Button type="button" variant="secondary" size="sm"
            onClick={() => append({ productoId: '', cantidad: 1, precioUnitario: 0 })}>
            + Agregar línea
          </Button>
        </div>

        <div className="space-y-3">
          {fields.map((field, idx) => (
            <div key={field.id} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5">
                <label className="label text-xs">Producto</label>
                <select className="input-field text-sm"
                  {...register(`detalles.${idx}.productoId`, { required: true, valueAsNumber: true })}>
                  <option value="">Seleccionar</option>
                  {productos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="label text-xs">Cantidad</label>
                <input type="number" min={1} className="input-field text-sm"
                  {...register(`detalles.${idx}.cantidad`, { valueAsNumber: true, min: 1 })} />
              </div>
              <div className="col-span-4">
                <label className="label text-xs">Precio unitario</label>
                <input type="number" step="0.01" min={0} className="input-field text-sm"
                  {...register(`detalles.${idx}.precioUnitario`, { valueAsNumber: true })} />
              </div>
              <div className="col-span-1 flex justify-center pb-2">
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(idx)}
                    className="text-red-500 hover:text-red-700 text-xl">&times;</button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-right">
          <span className="text-sm text-gray-600 mr-2">Total estimado:</span>
          <span className="text-lg font-bold text-gray-900">{fmt(total)}</span>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={loading}>Crear orden</Button>
      </div>
    </form>
  )
}
