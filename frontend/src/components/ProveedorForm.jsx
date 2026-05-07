import { useForm } from 'react-hook-form'
import Input from './ui/Input'
import Button from './ui/Button'

export default function ProveedorForm({ defaultValues, onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nombre *"
        placeholder="Nombre del proveedor"
        error={errors.nombre?.message}
        {...register('nombre', { required: 'El nombre es obligatorio' })}
      />
      <Input
        label="RUC / NIT *"
        placeholder="900123456-1"
        error={errors.rucNit?.message}
        {...register('rucNit', { required: 'El RUC/NIT es obligatorio' })}
      />
      <Input
        label="Email"
        type="email"
        placeholder="ventas@proveedor.com"
        error={errors.email?.message}
        {...register('email', {
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' },
        })}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Teléfono" placeholder="604-555-0101" {...register('telefono')} />
        <Input label="Dirección" placeholder="Calle 50 # 40-20" {...register('direccion')} />
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" loading={loading}>
          {defaultValues?.id ? 'Actualizar' : 'Crear'} proveedor
        </Button>
      </div>
    </form>
  )
}
