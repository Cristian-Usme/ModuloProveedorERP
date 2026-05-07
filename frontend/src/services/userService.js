import api from './api'

export const userService = {
  list:         ()     => api.get('/auth/users').then((r) => r.data),
  create:       (data) => api.post('/auth/register', data).then((r) => r.data),
  toggleActive: (id)   => api.patch(`/auth/users/${id}/toggle-active`).then((r) => r.data),
}
