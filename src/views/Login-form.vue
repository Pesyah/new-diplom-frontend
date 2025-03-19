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
  <div style="margin: 30% 40% 40% 40%; padding: 10px; width: 20%">
    <h1>Вход</h1>
    <input
      style="margin-bottom: 10px; padding: 5px; width: 20vw; font-size: 20px"
      v-model="email"
      placeholder="Email"
    />
    <br />
    <input
      style="margin-bottom: 10px; padding: 5px; width: 20vw; font-size: 20px"
      v-model="password"
      type="password"
      placeholder="Пароль"
    />
    <br />
    <button class="btn btn-primary" @click="login">Войти</button>
  </div>
</template>
