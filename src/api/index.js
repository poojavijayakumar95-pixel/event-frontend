import api from './axiosInstance'

// ── Query Keys (single source of truth for React Query cache) ──
export const queryKeys = {
  events: {
    all:    () => ['events'],
    list:   (params) => ['events', 'list', params],
    detail: (id) => ['events', 'detail', id],
    search: (params) => ['events', 'search', params],
  },
  speakers: {
    all:    () => ['speakers'],
    list:   (search) => ['speakers', 'list', search],
    detail: (id) => ['speakers', 'detail', id],
  },
  registrations: {
    my:    (page) => ['registrations', 'my', page],
    event: (id) => ['registrations', 'event', id],
  },
  admin: {
    dashboard: () => ['admin', 'dashboard'],
    users:     () => ['admin', 'users'],
  },
  auth: {
    me: () => ['auth', 'me'],
  },
}

// ── Auth API ────────────────────────────────────────────────
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  refresh:  (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  me:       () => api.get('/auth/me'),
}

// ── Events API ──────────────────────────────────────────────
export const eventsApi = {
  getAll:  (page = 0, size = 9) =>
    api.get('/events', { params: { page, size } }),

  search:  (params) =>
    api.get('/events/search', { params }),

  getById: (id) => api.get(`/events/${id}`),
  create:  (data) => api.post('/events', data),
  update:  (id, data) => api.put(`/events/${id}`, data),
  delete:  (id) => api.delete(`/events/${id}`),
}

// ── Speakers API ─────────────────────────────────────────────
export const speakersApi = {
  getAll:  (search) =>
    api.get('/speakers', { params: search ? { search } : {} }),
  getById: (id) => api.get(`/speakers/${id}`),
  create:  (data) => api.post('/speakers', data),
  update:  (id, data) => api.put(`/speakers/${id}`, data),
  delete:  (id) => api.delete(`/speakers/${id}`),
}

// ── Registrations API ────────────────────────────────────────
export const registrationsApi = {
  register:       (eventId, notes) =>
    api.post('/registrations', { eventId, notes }),
  cancel:         (eventId) =>
    api.delete(`/registrations/events/${eventId}`),
  myRegistrations: (page = 0, size = 10) =>
    api.get('/registrations/my', { params: { page, size } }),
}

// ── Admin API ────────────────────────────────────────────────
export const adminApi = {
  dashboard:           () => api.get('/admin/dashboard'),
  getUsers:            () => api.get('/admin/users'),
  toggleUserStatus:    (userId) => api.patch(`/admin/users/${userId}/toggle-status`),
  promoteUser:         (userId) => api.patch(`/admin/users/${userId}/promote`),
  getEventRegistrations: (eventId) =>
    api.get(`/admin/events/${eventId}/registrations`),
  updateAttendance:    (registrationId, status) =>
    api.patch('/admin/attendance', { registrationId, status }),
}
