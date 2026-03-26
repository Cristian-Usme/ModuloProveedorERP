import { useForm } from 'react-hook-form'
import Input from './ui/Input'
import Button from './ui/Button'
import { useProveedores } from '../hooks/useProveedores'

export default function ProductoForm({ defaultValues, onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: defaultValues
      ? { ...defaultValues, proveedorId: defaultValues.proveedorId?.toString() }
      : {},
  })
  const { data } = useProveedores({ size: 100 })
  const proveedores = data?.content ?? []

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nombre *"
        placeholder="Nombre del producto"
        error={errors.nombre?.message}
        {...register('nombre', { required: 'El nombre es obligatorio' })}
      />
      <div>
        <label className="label">Descripción</label>
        <textarea className="input-field" rows={3} placeholder="Descripción..." {...register('descripcion')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Precio de referencia" type="number" step="0.01" placeholder="0.00"
          {...register('precioReferencia', { valueAsNumber: true })} />
        <Input label="Unidad" placeholder="Unidad, Kg, Litro..." {...register('unidad')} />
      </div>
      <div>
        <label className="label">Proveedor *</label>
        <select
          className={`input-field ${errors.proveedorId ? 'border-red-500' : ''}`}
          {...register('proveedorId', { required: 'El proveedor es obligatorio' })}
        >
          <option value="">Seleccionar proveedor</option>
          {proveedores.map((p) => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>
        {errors.proveedorId && <p className="mt-1 text-xs text-red-600">{errors.proveedorId.message}</p>}
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" loading={loading}>
          {defaultValues?.id ? 'Actualizar' : 'Crear'} producto
        </Button>
      </div>
    </form>
  )
}
