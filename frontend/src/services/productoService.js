import api from './api'

export const productoService = {
  listar:    (params) => api.get('/productos', { params }).then((r) => r.data),
  obtener:   (id)     => api.get(`/productos/${id}`).then((r) => r.data),
  crear:     (data)   => api.post('/productos', data).then((r) => r.data),
  actualizar:(id, data) => api.put(`/productos/${id}`, data).then((r) => r.data),
  eliminar:  (id)     => api.delete(`/productos/${id}`),
}
