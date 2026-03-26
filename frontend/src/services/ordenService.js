import api from './api'

export const ordenService = {
  listar:  (params) => api.get('/ordenes', { params }).then((r) => r.data),
  obtener: (id)     => api.get(`/ordenes/${id}`).then((r) => r.data),
  crear:   (data)   => api.post('/ordenes', data).then((r) => r.data),
  aprobar: (id, observaciones) =>
    api.patch(`/ordenes/${id}/aprobar`, null, { params: { observaciones } }).then((r) => r.data),
  rechazar: (id, observaciones) =>
    api.patch(`/ordenes/${id}/rechazar`, null, { params: { observaciones } }).then((r) => r.data),
  cancelar: (id) => api.patch(`/ordenes/${id}/cancelar`).then((r) => r.data),
}
