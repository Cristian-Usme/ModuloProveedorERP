import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordenService } from '../services/ordenService'
import toast from 'react-hot-toast'

export function useOrdenes(params) {
  return useQuery({
    queryKey: ['ordenes', params],
    queryFn: () => ordenService.listar(params),
  })
}

export function useCrearOrden() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ordenService.crear,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ordenes'] }); toast.success('Orden de compra creada') },
    onError: (e) => toast.error(e.response?.data?.message ?? 'Error al crear orden'),
  })
}

export function useAprobarOrden() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, observaciones }) => ordenService.aprobar(id, observaciones),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ordenes'] }); toast.success('Orden aprobada') },
    onError: (e) => toast.error(e.response?.data?.message ?? 'Error al aprobar'),
  })
}

export function useRechazarOrden() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, observaciones }) => ordenService.rechazar(id, observaciones),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ordenes'] }); toast.success('Orden rechazada') },
    onError: (e) => toast.error(e.response?.data?.message ?? 'Error al rechazar'),
  })
}

export function useCancelarOrden() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ordenService.cancelar,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ordenes'] }); toast.success('Orden cancelada') },
    onError: (e) => toast.error(e.response?.data?.message ?? 'Error al cancelar'),
  })
}
