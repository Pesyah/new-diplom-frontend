import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const api = axios.create({
  withCredentials: true, // Оставь, если используешь куки
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: 'http://localhost:3000/api',
})

api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.access_token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.log('Ошибка в интерцепторе:', error) // Логируем ошибку
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error.response, error.response.status)
    if (error.response && error.response.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
