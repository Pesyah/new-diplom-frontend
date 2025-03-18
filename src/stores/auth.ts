import api from '@/services/api'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as { id: number; email: string } | null,
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const response = await api.post('/auth/login', { email, password })
        this.token = response.data.token
        this.user = response.data.user
        if (this.token) localStorage.setItem('token', this.token)
      } catch (error) {
        console.error('Ошибка авторизации', error)
      }
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    },
  },
})
