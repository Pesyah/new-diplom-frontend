<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const router = useRouter()
const authStore = useAuthStore()

const isLoggedIn = computed(() => !!authStore.access_token) // Или authStore.user

const goToDashboard = () => {
  router.push('/dashboard')
}

const goToCart = () => {
  router.push('/cart')
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div>
    <button class="btn btn-primary" @click="goToDashboard">На главную</button>
    <button class="btn btn-primary" style="margin-left: 8vw" @click="goToCart">
      Перейти в корзину
    </button>
    <template v-if="isLoggedIn">
      <button style="margin-top: 5vh" @click="logout" class="btn btn-primary">Выйти</button>
    </template>

    <RouterView />
  </div>
</template>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

button {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
