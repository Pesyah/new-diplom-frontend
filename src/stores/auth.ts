import api from '@/services/api'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    access_token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const response = await api.post(
          '/auth/login',
          { email, password },
          { withCredentials: true },
        )
        console.log(response)
        this.access_token = response.data.access_token
        if (this.access_token) localStorage.setItem('access_token', this.access_token)
      } catch (error) {
        console.error('Ошибка авторизации', error)
      }
    },
    logout() {
      this.access_token = null
      localStorage.removeItem('token')
    },
  },
})
