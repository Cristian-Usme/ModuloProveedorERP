import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productoService } from '../services/productoService'
import toast from 'react-hot-toast'

export function useProductos(params) {
  return useQuery({
    queryKey: ['productos', params],
    queryFn: () => productoService.listar(params),
  })
}

export function useCrearProducto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: productoService.crear,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['productos'] }); toast.success('Producto creado') },
    onError: (e) => toast.error(e.response?.data?.message ?? 'Error al crear producto'),
  })
}

export function useActualizarProducto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => productoService.actualizar(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['productos'] }); toast.success('Producto actualizado') },
    onError: (e) => toast.error(e.response?.data?.message ?? 'Error al actualizar producto'),
  })
}

export function useEliminarProducto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: productoService.eliminar,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['productos'] }); toast.success('Producto eliminado') },
    onError: (e) => toast.error(e.response?.data?.message ?? 'Error al eliminar producto'),
  })
}
