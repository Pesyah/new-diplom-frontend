<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const goToProducts = () => {
  router.push('/products')
}

const isUser = computed(() => authStore.user?.role === 1)
</script>

<template>
  <div class="dashboard">
    <div class="flex-column">
      <button v-if="isUser" class="mt-4 bg-blue-600 px-4 py-2 rounded" @click="goToProducts">
        Выбрать продукты
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Уникальные стили компонента */
</style>
