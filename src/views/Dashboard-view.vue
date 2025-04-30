<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const goToCreateDriver = () => {
  router.push('/drivers/create')
}

const logout = () => {
  authStore.logout() // Выполняем логику выхода
  router.push('/login') // Перенаправляем на страницу логина
}
</script>

<template>
  <div>
    <h1>Личный кабинет</h1>
    <p>Привет</p>
    <button @click="logout()">Выйти</button>
    <button @click="goToCreateDriver">Создать водителя</button>
    <button class="btn btn-secondary" @click="router.push('/drivers')">Список водителей</button>
  </div>
</template>
