import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { proveedorService } from '../services/proveedorService'
import toast from 'react-hot-toast'

export function useProveedores(params) {
  return useQuery({
    queryKey: ['proveedores', params],
    queryFn: () => proveedorService.listar(params),
  })
}

export function useCrearProveedor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: proveedorService.crear,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['proveedores'] }); toast.success('Proveedor creado') },
    onError: (e) => toast.error(e.response?.data?.message ?? 'Error al crear proveedor'),
  })
}

export function useActualizarProveedor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => proveedorService.actualizar(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['proveedores'] }); toast.success('Proveedor actualizado') },
    onError: (e) => toast.error(e.response?.data?.message ?? 'Error al actualizar proveedor'),
  })
}

export function useEliminarProveedor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: proveedorService.eliminar,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['proveedores'] }); toast.success('Proveedor eliminado') },
    onError: (e) => toast.error(e.response?.data?.message ?? 'Error al eliminar proveedor'),
  })
}

export function useCalificarProveedor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => proveedorService.calificar(id, data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['proveedores'] })
      toast.success(data.actualizadoEn ? 'Calificación actualizada' : 'Calificación registrada')
    },
    onError: (e) => toast.error(e.response?.data?.message ?? 'Error al calificar'),
  })
}
