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
  <div class="dashboard">
    <h1>Личный кабинет</h1>
    <p>Привет</p>
    <div class="flex-column">
      <button @click="logout" class="btn btn-primary">Выйти</button>
      <button @click="goToCreateDriver" class="btn btn-primary">Создать водителя</button>
    </div>
    <div class="flex-column">
      <button class="btn btn-secondary" @click="router.push('/drivers')">Список водителей</button>
      <!-- Можно добавлять другие элементы сюда -->
    </div>
  </div>
</template>

<style scoped>
/* Уникальные стили компонента */
</style>
