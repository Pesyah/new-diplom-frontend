<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div>
    <h1>Личный кабинет</h1>
    <p>Привет</p>
    <button @click="authStore.logout()">Выйти</button>
  </div>
</template>
