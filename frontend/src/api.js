import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const facultyAPI = {
  getAll: () => api.get('/faculty'),
  getById: (id) => api.get(`/faculty/${id}`),
  search: (query) => api.get(`/search?q=${query}`)
}

export const adminAPI = {
  login: (password) => api.post('/admin/login', { password }),
  scrapePreview: (linkedinUrl, scholarUrl) => 
    api.post('/admin/scrape', null, {
      params: { linkedin_url: linkedinUrl, scholar_url: scholarUrl }
    }),
  createFaculty: (data) => api.post('/admin/faculty', data),
  updateFaculty: (id, data) => api.put(`/admin/faculty/${id}`, data),
  deleteFaculty: (id) => api.delete(`/admin/faculty/${id}`)
}

export default api
