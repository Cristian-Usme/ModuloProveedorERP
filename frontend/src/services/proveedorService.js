import api from './api'

export const proveedorService = {
  listar:    (params) => api.get('/proveedores', { params }).then((r) => r.data),
  obtener:   (id)     => api.get(`/proveedores/${id}`).then((r) => r.data),
  crear:     (data)   => api.post('/proveedores', data).then((r) => r.data),
  actualizar:(id, data) => api.put(`/proveedores/${id}`, data).then((r) => r.data),
  eliminar:  (id)     => api.delete(`/proveedores/${id}`),
  calificar: (id, data) => api.post(`/proveedores/${id}/calificacion`, data),
}
