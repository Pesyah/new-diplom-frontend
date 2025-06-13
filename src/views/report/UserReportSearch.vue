<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Отчёты по пользователям</h1>

    <input
      v-model="searchQuery"
      @input="handleSearch"
      type="text"
      placeholder="Введите имя, email или телефон"
      class="w-full border rounded p-2 mb-4"
    />

    <div v-if="loading" class="text-gray-500">Поиск...</div>
    <div v-if="users.length === 0 && !loading && searchQuery" class="text-gray-500">
      Пользователи не найдены
    </div>

    <ul v-else class="space-y-2">
      <li
        v-for="user in users"
        :key="user.id"
        class="border rounded p-3 flex justify-between items-center"
      >
        <div>
          <div class="font-semibold">{{ user.name }} {{ user.surname }}</div>
          <div class="text-sm text-gray-600">{{ user.email }} — {{ user.phone }}</div>
        </div>
        <button
          @click="goToReport(user.id)"
          class="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Сформировать отчёт
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isAdmin = computed(() => authStore.user?.role === 2)

const searchQuery = ref('')
const users = ref([])
const loading = ref(false)

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    users.value = []
    return
  }

  loading.value = true
  try {
    const { data } = await api.get(`/auth/user-by-query/${searchQuery.value.trim()}`)
    users.value = Array.isArray(data) ? data : [data]
  } catch (err) {
    console.error('Ошибка при поиске пользователей', err)
    users.value = []
  } finally {
    loading.value = false
  }
}

const goToReport = (userId: string) => {
  router.push({ path: '/admin/user-report', query: { userId } })
}
</script>
