import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Берем URL из .env
  withCredentials: true, // Если используешь куки для аутентификации
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
