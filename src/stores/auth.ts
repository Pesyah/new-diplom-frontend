import api from '@/services/api'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    access_token: localStorage.getItem('access_token') || null,
    user: null as null | { id: number; email: string; role: number },
  }),

  actions: {
    async login(email: string, password: string) {
      try {
        const response = await api.post(
          'auth/login',
          { email, password },
          { withCredentials: true },
        )
        if (response.status !== 201) return { status: response.status }

        this.access_token = response.data.access_token
        if (this.access_token) localStorage.setItem('access_token', this.access_token)

        await this.fetchUser()
        return { status: 201 }
      } catch (error: any) {
        console.error('Ошибка авторизации', error)
        return {
          status: error.response?.status || 500,
          message: error.response?.data?.message || 'Ошибка авторизации',
        }
      }
    },

    async register(payload: {
      name: string
      surname: string
      phone: string
      email: string
      password: string
    }) {
      try {
        const response = await api.post('/auth/register', payload)
        return { status: response.status, data: response.data }
      } catch (error: any) {
        console.error('Ошибка регистрации', error)
        return {
          status: error.response?.status || 500,
          message: error.response?.data?.message || 'Ошибка регистрации',
        }
      }
    },

    async fetchUser() {
      try {
        const response = await api.get('/auth/me')
        response.data['role'] = response.data['roleType']['id']
        this.user = response.data
      } catch (error) {
        console.error('Ошибка при получении пользователя:', error)
      }
    },

    logout() {
      this.access_token = null
      this.user = null
      localStorage.removeItem('access_token')
    },
  },

  getters: {
    isAdmin: (state) => state.user?.role === 2,
  },
})
