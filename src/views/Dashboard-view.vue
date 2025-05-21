<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

const goToCreateDriver = () => {
  router.push('/drivers/create')
}

const goToProducts = () => {
  router.push('/products')
}

const isAdmin = computed(() => authStore.user?.role === 'admin')
</script>

<template>
  <div class="dashboard">
    <div class="flex-column">
      <button class="mt-4 bg-blue-600 px-4 py-2 rounded" @click="goToProducts">
        Выбрать продукты
      </button>
    </div>
    <div class="flex-column">
      <!-- Показываем кнопку только если admin -->
      <button v-if="isAdmin" class="btn btn-secondary" @click="router.push('/drivers')">
        Список продуктов(админ)
      </button>
      <!-- Можно добавлять другие элементы сюда -->
    </div>
  </div>
</template>

<style scoped>
/* Уникальные стили компонента */
</style>
