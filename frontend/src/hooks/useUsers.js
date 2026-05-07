import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '../services/userService'
import toast from 'react-hot-toast'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.list,
  })
}

export function useCrearUsuario() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('Usuario creado exitosamente')
    },
    onError: (e) => {
      const msg = e.response?.data?.details?.[0] || e.response?.data?.message || 'Error al crear usuario'
      toast.error(msg)
    },
  })
}

export function useToggleActivoUsuario() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: userService.toggleActive,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success(data.activo ? 'Usuario activado' : 'Usuario desactivado')
    },
    onError: (e) => toast.error(e.response?.data?.message ?? 'Error al cambiar estado'),
  })
}
