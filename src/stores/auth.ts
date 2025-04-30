import api from '@/services/api'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    access_token: localStorage.getItem('access_token') || null,
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const response = await api.post(
          '/auth/login',
          { email, password },
          { withCredentials: true },
        )
        if (response.status !== 201) {
          return { status: response.status }
        }
        this.access_token = response.data.access_token
        if (this.access_token) localStorage.setItem('access_token', this.access_token)
        return { status: 201 }
      } catch (error) {
        console.error('Ошибка авторизации', error)
        return error
      }
    },
    logout() {
      this.access_token = null
      localStorage.removeItem('access_token')
    },
  },
})
