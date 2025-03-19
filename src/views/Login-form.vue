<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const authStore = useAuthStore()
const router = useRouter()

const login = async () => {
  await authStore.login(email.value, password.value)
  if (authStore.access_token) {
    router.push('/dashboard')
  }
}
</script>

<template>
  <div>
    <h1>Вход</h1>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Пароль" />
    <button @click="login">Войти</button>
  </div>
</template>
